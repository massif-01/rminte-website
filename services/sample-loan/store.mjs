import { digest } from "../case-access/crypto.mjs";
import { assert, fail, canonical, iso, integer } from "./domain.mjs";
import { liveAccessSQL } from "./access.mjs";
import { open } from "./vault.mjs";
import { project } from "./finance-projection.mjs";
import { depositOutstandingMinor } from "../../website/sample-loan/fields.mjs";
export const operationId = Symbol("sample operation ID");
export const stmt = (env, sql, values = []) =>
  env.CASE_DB.prepare(sql).bind(...values);
export const first = (env, sql, values = []) => stmt(env, sql, values).first();
export const rows = async (env, sql, values = []) =>
  (await stmt(env, sql, values).all()).results;
export async function requestRow(env, id) {
  const r = await first(env, "SELECT * FROM sample_requests WHERE id=?", [id]);
  assert(r, "NOT_FOUND", "申请不存在", 404);
  return r;
}
export function eventStatement(
  requestId,
  assetId,
  user,
  action,
  details = {},
  occurredAt = iso(),
  corrects = null,
) {
  return [
    `INSERT INTO sample_events(id,request_id,asset_id,actor_id,action,details_json,occurred_at,recorded_at,corrects_event_id,operation_id) SELECT ?,?,?,?,?,?,?,?,?,? WHERE $gate`,
    [
      crypto.randomUUID(),
      requestId,
      assetId,
      user.id,
      action,
      JSON.stringify(details),
      occurredAt,
      iso(),
      corrects,
      operationId,
    ],
  ];
}
export async function priorMutation(
  env,
  request,
  user,
  scope,
  data,
  requestId = null,
) {
  const key = request.headers.get("Idempotency-Key");
  if (!key) return null;
  const prior = await first(
    env,
    "SELECT payload_hash,result_json FROM sample_idempotency WHERE scope=? AND key=?",
    [user.id + ":" + scope + ":" + (requestId || ""), key],
  );
  if (!prior) return null;
  assert(
    prior.payload_hash === (await digest(canonical(data))),
    "IDEMPOTENCY_CONFLICT",
    "同一操作识别码的内容已改变",
  );
  return JSON.parse(prior.result_json);
}
export async function mutation(
  env,
  request,
  user,
  {
    scope,
    data,
    requestId = null,
    version = null,
    allowPurging = false,
    condition = "1",
    conditionValues = [],
    statements = [],
    result = {},
  },
) {
  const key = request.headers.get("Idempotency-Key");
  assert(
    key && /^[A-Za-z0-9_-]{16,100}$/.test(key),
    "IDEMPOTENCY_REQUIRED",
    "缺少有效操作识别码",
    422,
  );
  const fullScope = user.id + ":" + scope + ":" + (requestId || ""),
    hash = await digest(canonical(data));
  const prior = await first(
    env,
    "SELECT payload_hash,result_json FROM sample_idempotency WHERE scope=? AND key=?",
    [fullScope, key],
  );
  if (prior) {
    assert(
      prior.payload_hash === hash,
      "IDEMPOTENCY_CONFLICT",
      "同一操作识别码的内容已改变",
    );
    return JSON.parse(prior.result_json);
  }
  if (requestId) integer(version, "expectedRowVersion");
  const op = crypto.randomUUID(),
    gate = `EXISTS (SELECT 1 FROM sample_operations WHERE id='${op}')`;
  const requestGuard = requestId
    ? ` AND EXISTS (SELECT 1 FROM sample_requests WHERE id=? AND row_version=? ${allowPurging ? "" : "AND purge_after_at IS NULL"})`
    : "";
  const sql = `INSERT INTO sample_operations(id,kind,request_id,actor_id,created_at) SELECT ?,?,?,?,? WHERE ${liveAccessSQL}${requestGuard} AND (${condition})`;
  const batch = [
    stmt(env, sql, [
      op,
      scope,
      requestId,
      user.id,
      iso(),
      user.id,
      user.session_hash,
      Math.floor(Date.now() / 1000),
      ...(requestId ? [requestId, version] : []),
      ...conditionValues,
    ]),
  ];
  for (const [q, v] of statements) {
    assert(q.includes("$gate"), "INTERNAL", "事务语句缺少门槛", 500);
    batch.push(
      stmt(
        env,
        q.replaceAll("$gate", gate),
        v.map((x) => (x === operationId ? op : x)),
      ),
    );
  }
  batch.push(
    stmt(
      env,
      `INSERT INTO sample_security_events(id,actor_id,action,ip,occurred_at) SELECT ?,?,?,?,? WHERE ${gate}`,
      [
        crypto.randomUUID(),
        user.id,
        scope,
        request.headers.get("CF-Connecting-IP"),
        iso(),
      ],
    ),
  );
  batch.push(
    stmt(
      env,
      `INSERT INTO sample_idempotency(scope,key,payload_hash,result_json,recorded_at) SELECT ?,?,?,?,? WHERE ${gate}`,
      [fullScope, key, hash, JSON.stringify(result), iso()],
    ),
  );
  try {
    const done = await env.CASE_DB.batch(batch);
    assert(
      done[0].meta.changes,
      "VERSION_CONFLICT",
      "资料或权限已变化，请刷新后重新核对",
    );
  } catch (e) {
    if (e.status) throw e;
    if (/UNIQUE constraint failed/.test(e.message)) {
      const dup = await first(
        env,
        "SELECT payload_hash,result_json FROM sample_idempotency WHERE scope=? AND key=?",
        [fullScope, key],
      );
      if (dup && dup.payload_hash === hash) return JSON.parse(dup.result_json);
      if (/UNIQUE constraint failed: sample_assets\.sn_key\b/.test(e.message)) {
        const message = "该 SN 已登记，请检查后重新填写";
        fail(409, "DUPLICATE_SN", message, { sn: message });
      }
      fail(409, "RESOURCE_CONFLICT", "记录已被其他操作使用，请刷新核对");
    }
    throw e;
  }
  return result;
}
export async function detail(env, id) {
  const r = await requestRow(env, id),
    original = JSON.parse(r.original_json),
    consent = JSON.parse(r.consent_json);
  const [
    versions,
    events,
    files,
    progress,
    financial,
    alloc,
    loss,
    entries,
    assessments,
    quotes,
    extensions,
  ] = await Promise.all([
    rows(
      env,
      "SELECT revision_no AS revision,reason,kind,created_at AS createdAt,created_by AS actorId,pdf_status AS status,document_id AS documentId FROM sample_agreement_versions WHERE request_id=? ORDER BY revision_no",
      [id],
    ),
    rows(
      env,
      "SELECT id,actor_id AS actorId,action,details_json,occurred_at AS occurredAt,recorded_at AS recordedAt,corrects_event_id AS correctsEventId FROM sample_events WHERE request_id=? ORDER BY recorded_at,id",
      [id],
    ),
    rows(
      env,
      "SELECT id,name,mime,status,original_size AS originalSize,derivative_size AS derivativeSize FROM sample_files WHERE request_id=?",
      [id],
    ),
    first(env, "SELECT * FROM sample_progress WHERE request_id=?", [id]),
    first(
      env,
      "SELECT 1 FROM sample_financial_projections WHERE request_id=?",
      [id],
    ),
    first(
      env,
      "SELECT a.*,x.request_id FROM sample_assets a LEFT JOIN sample_allocations x ON x.asset_id=a.id WHERE a.id=?",
      [r.asset_id],
    ),
    first(env, "SELECT * FROM sample_losses WHERE request_id=?", [id]),
    rows(
      env,
      "SELECT * FROM sample_financial_entries WHERE request_id=? ORDER BY recorded_at,id",
      [id],
    ),
    rows(
      env,
      "SELECT * FROM sample_assessments WHERE request_id=? ORDER BY created_at,rowid",
      [id],
    ),
    rows(
      env,
      "SELECT id,quote_revision AS revision,quote_json FROM sample_quotes WHERE request_id=? ORDER BY quote_revision",
      [id],
    ),
    rows(
      env,
      "SELECT * FROM sample_extensions WHERE request_id=? ORDER BY recorded_at",
      [id],
    ),
  ]);
  let agreement = null;
  if (r.current_agreement_revision) {
    const v = await first(
      env,
      "SELECT snapshot_cipher FROM sample_agreement_versions WHERE request_id=? AND revision_no=?",
      [id, r.current_agreement_revision],
    );
    agreement = await open(
      env.SAMPLE_SECRET,
      id + ":" + r.current_agreement_revision,
      v.snapshot_cipher,
    );
  }
  const saved = await open(env.SAMPLE_SECRET, id + ":draft", r.draft_cipher);
  const { accessoriesFromAsset, ...draft } = saved || {};
  const finance = financial
      ? project(entries, assessments, quotes, quotes.at(-1))
      : null,
    unshipped = !progress?.shipped_at,
    noCash = !entries.some((e) => ["receipt", "refund"].includes(e.kind)),
    cleanup = !!r.purge_after_at,
    latest = versions.find((v) => v.revision === r.current_agreement_revision),
    canWrite = !cleanup;
  const allowedActions = {
    canApprove: canWrite && r.status === "pending",
    canReject: canWrite && r.status === "pending",
    canRevise: canWrite && ["approved", "completed"].includes(r.status),
    canReschedule:
      canWrite && r.status === "approved" && unshipped && !assessments.length,
    canUpdateQuote: canWrite && r.status === "approved" && unshipped && noCash,
    canCorrectBasis:
      canWrite &&
      r.status === "approved" &&
      unshipped &&
      noCash &&
      !assessments.length,
    canExtend:
      canWrite &&
      r.status === "approved" &&
      !unshipped &&
      r.initial_term_days > 7 &&
      r.effective_due_at >= iso(),
    canCancel:
      canWrite && ["pending", "approved"].includes(r.status) && unshipped,
    canShip: !!(
      canWrite &&
      r.status === "approved" &&
      unshipped &&
      agreement &&
      depositOutstandingMinor(agreement.quote.deposit, finance) === 0n
    ),
    canReturn: canWrite && r.status === "approved" && !unshipped,
    canInspect: canWrite && r.status === "completed",
    canRecordMoney: canWrite,
    canRegisterLoss: canWrite && r.status === "approved" && !unshipped,
    canNotifyLoss:
      canWrite &&
      r.status === "loss_pending" &&
      !loss?.conversion_at &&
      !!finance?.assessmentComplete,
    canCloseLoss:
      canWrite &&
      r.status === "loss_pending" &&
      !!loss?.conversion_at &&
      !!finance?.balanced &&
      !!finance?.assessmentComplete,
    canDownload: latest?.status === "ready",
    canCorrect:
      canWrite &&
      events.some((event) =>
        ["progress.ship", "progress.return", "progress.inspect"].includes(
          event.action,
        ),
      ),
  };

  return {
    id: r.id,
    publicNo: r.public_no,
    status: r.status,
    displayName: r.display_name,
    submittedAt: r.submitted_at,
    rowVersion: r.row_version,
    financialClosedAt: r.financial_closed_at,
    original,
    consent,
    draft: saved ? draft : null,
    accessoriesFromAsset: accessoriesFromAsset === true,
    agreement,
    allowedActions,
    currentAgreementRevision: r.current_agreement_revision,
    latestReadyAgreementRevision: r.latest_ready_agreement_revision,
    initialTermDays: r.initial_term_days,
    preservation: { reason: r.hold_reason, purgeAfterAt: r.purge_after_at },
    asset: alloc
      ? {
          id: alloc.id,
          no: alloc.no,
          sn: alloc.sn,
          modelKey: alloc.model_key,
          notes: alloc.notes,
          lifecycle: alloc.lifecycle,
          assetVersion: alloc.row_version,
        }
      : null,
    progress: progress
      ? {
          shippedAt: progress.shipped_at,
          returnedAt: progress.returned_at,
          inspectedAt: progress.inspected_at,
          inspectionNote: progress.inspection_note,
          refundDueAt: progress.refund_due_at,
          refundCalendarRevision: progress.refund_calendar_revision,
          billingBasisRevision: progress.billing_basis_revision,
        }
      : null,
    finance,
    versions,
    events: events.map((e) => ({
      ...e,
      details: JSON.parse(e.details_json),
      details_json: undefined,
    })),
    files,
    loss,
    entries: entries.map((e) => ({
      ...e,
      details: JSON.parse(e.details_json),
      details_json: undefined,
    })),
    assessments,
    quotes: quotes.map((q) => ({
      ...q,
      quote: JSON.parse(q.quote_json),
      quote_json: undefined,
    })),
    extensions,
  };
}
