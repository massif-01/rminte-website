import { fields as fieldMap } from "../../website/sample-loan/fields.mjs";
import { session } from "../case-access/api.mjs";
import { sampleAccess } from "./access.mjs";
import { digest } from "../case-access/crypto.mjs";
import {
  LoanError,
  assert,
  fail,
  iso,
  exact,
  text,
  application,
  canonical,
  beijingDay,
  MODELS,
  partialDraft,
} from "./domain.mjs";
import {
  stmt,
  first,
  rows,
  requestRow,
  detail,
  mutation,
  priorMutation,
  eventStatement,
} from "./store.mjs";
import { canonicalTerms, confirmationMail } from "./agreements.mjs";
import { open, seal } from "./vault.mjs";
import {
  assetCommand,
  approveCommand,
  reviseCommand,
  progressCommand,
} from "./commands.mjs";
import { financeCommand } from "./finance.mjs";
import { validateCalendar } from "./maintenance.mjs";
import { enqueuePending } from "./dispatcher.mjs";
import { uploadCommand } from "./files.mjs";
import { legacyRows, endLegacy } from "./legacy.mjs";
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};
const json = (data, status = 200) =>
  new Response(JSON.stringify({ apiVersion: 1, serverTime: iso(), ...data }), {
    status,
    headers,
  });
async function payload(request) {
  assert(
    request.headers.get("content-type")?.startsWith("application/json"),
    "JSON_REQUIRED",
    "需要JSON内容",
    415,
  );
  const reader = request.body?.getReader();
  assert(reader, "EMPTY_BODY", "请求不能为空", 422);
  const chunks = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 262144) {
      await reader.cancel();
      fail(413, "BODY_TOO_LARGE", "内容超过256KiB");
    }
    chunks.push(value);
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.length;
  }
  try {
    const d = JSON.parse(new TextDecoder().decode(all));
    assert(
      d && typeof d === "object" && !Array.isArray(d),
      "INVALID_JSON",
      "请求格式不符",
      422,
    );
    return d;
  } catch (e) {
    if (e.status) throw e;
    fail(422, "INVALID_JSON", "JSON格式不符");
  }
}
async function rate(env, request) {
  const key =
      "sample-application:" +
      (await digest(request.headers.get("CF-Connecting-IP") || "local")),
    now = Math.floor(Date.now() / 1000);
  const r = await first(
    env,
    "INSERT INTO rate_limits(key,hits,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN expires_at<=? THEN 1 ELSE hits+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING hits",
    [key, now + 3600, now, now],
  );
  assert(r.hits <= 5, "RATE_LIMITED", "申请过于频繁，请稍后再试", 429);
}
async function submit(request, env, data) {
  const d = application(data),
    t = await canonicalTerms();
  const key = request.headers.get("Idempotency-Key");
  assert(
    key && /^[A-Za-z0-9_-]{16,100}$/.test(key),
    "IDEMPOTENCY_REQUIRED",
    "缺少提交识别码",
    422,
  );
  const hash = await digest(canonical(d)),
    cached = await first(
      env,
      "SELECT * FROM sample_idempotency WHERE scope='public.application' AND key=?",
      [key],
    );
  if (cached) {
    assert(
      cached.payload_hash === hash,
      "IDEMPOTENCY_CONFLICT",
      "提交内容已改变",
    );
    return JSON.parse(cached.result_json);
  }
  assert(
    d.consent.termsVersion === t.version &&
      d.consent.noticeVersion === t.noticeVersion,
    "TERMS_CHANGED",
    "条款已更新，请重新阅读后确认",
  );
  await rate(env, request);
  const id = crypto.randomUUID(),
    now = iso(),
    day = beijingDay(now).replaceAll("-", "");
  const language = d.consent.language || "zh",
    presented =
      language === "zh"
        ? { html: t.noticeHtml, items: t.notices }
        : t.noticeLocales[language],
    presentedNotice = {
      language,
      ...presented,
      sha256: await digest(canonical({ language, ...presented })),
    };
  const consent = {
    agreementLanguage: language === "zh" ? "zh" : "en",
    presentedNotice,
    termsVersion: t.version,
    noticeVersion: t.noticeVersion,
    terms: t,
    accepted: true,
    confirmedAt: now,
    ip: request.headers.get("CF-Connecting-IP") || null,
    userAgent: (request.headers.get("user-agent") || "").slice(0, 2000),
    device: d.device,
    noStockShown: !!d.consent.noStockShown,
  };
  const original = {
    applicant: d.applicant,
    shipping: d.shipping,
    modelKey: d.modelKey,
    requestedDays: d.requestedDays,
  };
  try {
    await env.CASE_DB.batch([
      stmt(
        env,
        "INSERT OR IGNORE INTO sample_terms_versions(version,notice_version,canonical_json,sha256,created_at) VALUES(?,?,?,?,?)",
        [t.version, t.noticeVersion, JSON.stringify(t), t.sha256, now],
      ),
      stmt(
        env,
        "UPDATE sample_counters SET value=value+1 WHERE name='request'",
      ),
      stmt(
        env,
        "INSERT INTO sample_requests(id,public_no,original_json,consent_json,requested_days,model_key,search_text,display_name,submitted_at) SELECT ?,'RBA-RM01-'||?||'-'||printf('%06d',value),?,?,?,?,?,?,? FROM sample_counters WHERE name='request'",
        [
          id,
          day,
          JSON.stringify(original),
          JSON.stringify(consent),
          d.requestedDays,
          d.modelKey,
          d.applicant.name.toLowerCase(),
          d.applicant.name,
          now,
        ],
      ),
      stmt(
        env,
        "INSERT INTO sample_idempotency(scope,key,payload_hash,result_json,recorded_at) SELECT 'public.application',?,?,json_object('id',id,'publicNo',public_no,'submittedAt',submitted_at),? FROM sample_requests WHERE id=?",
        [key, hash, now, id],
      ),
    ]);
  } catch (e) {
    if (e.message.includes("SAMPLE_TERMS_VERSION_CONFLICT"))
      fail(
        503,
        "TERMS_VERSION_CONFLICT",
        "条款版本与内容不一致，请联系工作人员核对",
      );
    if (/UNIQUE constraint failed/.test(e.message)) {
      const old = await first(
        env,
        "SELECT * FROM sample_idempotency WHERE scope='public.application' AND key=?",
        [key],
      );
      if (old?.payload_hash === hash) return JSON.parse(old.result_json);
      fail(409, "IDEMPOTENCY_CONFLICT", "提交识别码冲突");
    }
    throw e;
  }
  const result = await first(
    env,
    "SELECT result_json FROM sample_idempotency WHERE scope='public.application' AND key=?",
    [key],
  );
  return JSON.parse(result.result_json);
}
async function listing(env, url) {
  const filter = url.searchParams.get("status") || "pending",
    sort = url.searchParams.get("sort") || "latest",
    q = (url.searchParams.get("q") || "").trim().toLowerCase();
  assert(
    ["pending", "approved", "rejected", "completed", "all"].includes(filter) &&
      ["latest", "earliest"].includes(sort) &&
      q.length <= 200,
    "INVALID_FILTER",
    "筛选参数不符",
    422,
  );
  const fingerprint = await digest(canonical({ filter, sort, q })),
    values = [],
    clauses = [];
  if (filter !== "all") {
    const statuses =
      filter === "approved"
        ? ["approved", "loss_pending"]
        : filter === "completed"
          ? ["completed", "loss_closed"]
          : [filter];
    clauses.push(`status IN (${statuses.map(() => "?").join(",")})`);
    values.push(...statuses);
  }
  if (q) {
    clauses.push("(instr(search_text,?)>0 OR instr(lower(public_no),?)>0)");
    values.push(q, q);
  }
  const cursor = url.searchParams.get("cursor");
  if (cursor) {
    let c;
    try {
      c = JSON.parse(atob(cursor));
    } catch {
      fail(422, "INVALID_CURSOR", "分页参数不符");
    }
    assert(
      c.f === fingerprint &&
        typeof c.t === "string" &&
        typeof c.id === "string",
      "INVALID_CURSOR",
      "筛选已改变，请重新加载",
      422,
    );
    clauses.push(`(submitted_at,id) ${sort === "latest" ? "<" : ">"} (?,?)`);
    values.push(c.t, c.id);
  }
  const order = sort === "latest" ? "DESC" : "ASC";
  const page = await rows(
    env,
    `SELECT r.id,r.public_no,r.status,r.original_json,r.display_name,r.model_key,r.requested_days,r.submitted_at,r.row_version,r.current_agreement_revision,r.effective_due_at,r.closed_at,r.financial_closed_at,p.shipped_at,p.returned_at,p.inspected_at,f.projection_json,l.conversion_at,l.compensation_due_at,(SELECT quote_json FROM sample_quotes q WHERE q.request_id=r.id ORDER BY quote_revision DESC LIMIT 1) AS quote_json FROM sample_requests r LEFT JOIN sample_progress p ON p.request_id=r.id LEFT JOIN sample_financial_projections f ON f.request_id=r.id LEFT JOIN sample_losses l ON l.request_id=r.id ${clauses.length ? "WHERE " + clauses.join(" AND ") : ""} ORDER BY submitted_at ${order},id ${order} LIMIT 51`,
    values,
  );
  const result = page.slice(0, 50).map((r) => ({
    id: r.id,
    publicNo: r.public_no,
    status: r.status,
    displayName: r.display_name,
    original: JSON.parse(r.original_json),
    modelKey: r.model_key,
    requestedDays: r.requested_days,
    submittedAt: r.submitted_at,
    rowVersion: r.row_version,
    financialClosedAt: r.financial_closed_at,
    depositDue: r.quote_json ? JSON.parse(r.quote_json).deposit : null,
    currentAgreementRevision: r.current_agreement_revision,
    dueAt: r.effective_due_at,
    loss: r.conversion_at
      ? {
          conversion_at: r.conversion_at,
          compensation_due_at: r.compensation_due_at,
        }
      : null,
    progress: {
      shippedAt: r.shipped_at,
      returnedAt: r.returned_at,
      inspectedAt: r.inspected_at,
    },
    finance: r.projection_json ? JSON.parse(r.projection_json) : null,
  }));
  const last = page[49],
    counts = await rows(
      env,
      "SELECT status,COUNT(*) AS count FROM sample_requests GROUP BY status",
    );
  return {
    requests: result,
    counts: Object.fromEntries(counts.map((x) => [x.status, x.count])),
    cursor:
      page.length > 50
        ? btoa(
            JSON.stringify({
              f: fingerprint,
              t: last.submitted_at,
              id: last.id,
            }),
          )
        : null,
  };
}
async function versionGet(request, env, r, revision, kind, url) {
  const v = await first(
    env,
    "SELECT * FROM sample_agreement_versions WHERE request_id=? AND revision_no=?",
    [r.id, revision],
  );
  assert(v, "NOT_FOUND", "协议版本不存在", 404);
  if (kind === "preview")
    return json({
      snapshot: await open(
        env.SAMPLE_SECRET,
        r.id + ":" + revision,
        v.snapshot_cipher,
      ),
      terms: JSON.parse(r.consent_json).terms,
    });
  const object = await first(
    env,
    "SELECT * FROM sample_document_objects WHERE document_id=?",
    [v.document_id],
  );
  assert(
    v.pdf_status === "ready" && object,
    "DOCUMENT_NOT_READY",
    "该版本PDF尚未生成",
    409,
  );
  const fileName = `${r.public_no}-R${revision}.pdf`,
    doc = {
      documentId: object.document_id,
      sha256: object.sha256,
      fileName,
      agreementRevision: revision,
      downloadUrl: `/api/sample-admin/requests/${r.id}/versions/${revision}/download`,
    };
  if (kind === "delivery") {
    assert(
      revision === r.current_agreement_revision,
      "DELIVERY_SUPERSEDED",
      "协议已更新，请重新下载当前版本",
    );
    assert(
      !url.searchParams.get("documentId") ||
        url.searchParams.get("documentId") === object.document_id,
      "DELIVERY_SUPERSEDED",
      "下载文件版本已改变",
    );
    const setting = await first(
      env,
      "SELECT * FROM sample_settings_versions WHERE kind='delivery' AND active=1",
    );
    assert(
      setting,
      "DELIVERY_CONFIG_REQUIRED",
      "请先配置并核对公司收款账户",
      409,
    );
    const data = JSON.parse(setting.data_json),
      snapshot = await open(
        env.SAMPLE_SECRET,
        r.id + ":" + revision,
        v.snapshot_cipher,
      );
    assert(
      data.bankAccounts?.[snapshot.quote.deposit.currency],
      "DELIVERY_CONFIG_REQUIRED",
      "该币种收款信息尚未配置",
      409,
    );
    return json({
      delivery: {
        ...doc,
        ...confirmationMail(snapshot, data, doc),
        bankAccountRevision: setting.id,
      },
    });
  }
  assert(env.SAMPLE_FILES, "STORAGE_UNAVAILABLE", "存储尚未配置", 503);
  const f = await env.SAMPLE_FILES.get(object.object_key);
  assert(f, "DOCUMENT_MISSING", "存档文件缺失，需处理恢复", 503);
  return new Response(f.body, {
    headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Length": String(f.size),
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "X-Content-SHA256": object.sha256,
      "X-Agreement-Revision": String(revision),
    },
  });
}
export async function handleSampleApi(request, env, ctx) {
  const traceId = crypto.randomUUID();
  try {
    const url = new URL(request.url),
      path = url.pathname,
      method = request.method;
    if (!["GET", "HEAD"].includes(method))
      assert(
        request.headers.get("origin") === url.origin,
        "INVALID_ORIGIN",
        "请求来源不正确",
        403,
      );
    if (path === "/api/sample-loans/terms" && method === "GET")
      return json({ terms: await canonicalTerms() });
    assert(env.CASE_DB, "SERVICE_UNAVAILABLE", "样机服务尚未配置", 503);
    if (path === "/api/sample-loans/availability" && method === "GET") {
      const key = url.searchParams.get("modelKey");
      assert(Object.hasOwn(MODELS, key), "INVALID_MODEL", "型号不存在", 422);
      const idle = await first(
        env,
        "SELECT 1 FROM sample_assets a WHERE model_key=? AND lifecycle='active' AND NOT EXISTS (SELECT 1 FROM sample_allocations x WHERE x.asset_id=a.id) LIMIT 1",
        [key],
      );
      return json({
        modelKey: key,
        availability: idle ? "available" : "unavailable",
      });
    }
    if (path === "/api/sample-loans/applications" && method === "POST")
      return json(await submit(request, env, await payload(request)), 201);
    assert(
      (await first(env, "SELECT ready FROM access_settings WHERE id=1"))?.ready,
      "ACCOUNT_UPGRADE_IN_PROGRESS",
      "账号权限正在升级，请稍后重试",
      503,
    );
    const user = await session(request, env);
    assert(user, "AUTH_REQUIRED", "请先到案例页登录", 401);
    assert(
      (await sampleAccess(user, env)).canManage,
      "SAMPLE_FORBIDDEN",
      "没有样机管理权限",
      403,
    );
    assert(
      env.SAMPLE_SECRET?.length >= 43,
      "SERVICE_UNAVAILABLE",
      "样机加密密钥尚未配置",
      503,
    );
    if (method === "GET" && /\/(download|preview|original|image)$/.test(path))
      await stmt(
        env,
        "INSERT INTO sample_security_events(id,actor_id,action,ip,occurred_at) VALUES(?,?,?,?,?)",
        [
          crypto.randomUUID(),
          user.id,
          "export.requested:" +
            path.replace(/[a-f0-9]{8}-[a-f0-9-]{27,}/g, ":id"),
          request.headers.get("CF-Connecting-IP"),
          iso(),
        ],
      ).run();
    if (path === "/api/sample-admin/time" && method === "GET")
      return json({
        user: { username: user.username, isOwner: !!user.is_owner },
      });
    if (path === "/api/sample-admin/health" && method === "GET") {
      const stats = await first(
          env,
          "SELECT MIN(CASE WHEN status IN ('queued','retry_wait','pending_assets') THEN next_attempt_at END) AS oldestDueAt,SUM(CASE WHEN status='failed_permanent' THEN 1 ELSE 0 END) AS failed FROM sample_jobs",
        ),
        scheduler = await first(
          env,
          "SELECT value FROM sample_counters WHERE name='last_scheduler_ms'",
        );
      return json({
        health: {
          queueBound: !!env.SAMPLE_JOBS,
          storageBound: !!env.SAMPLE_FILES,
          lastScheduledAt: scheduler
            ? new Date(scheduler.value).toISOString()
            : null,
          ...stats,
        },
      });
    }
    if (path === "/api/sample-admin/requests" && method === "GET")
      return json(await listing(env, url));
    if (path === "/api/sample-admin/assets" && method === "GET") {
      const assets = await rows(
        env,
        "SELECT a.*,x.request_id,x.legacy_loan_id,r.public_no,r.effective_due_at,r.original_json,l.borrower,l.contact,l.lent_at,l.due_at,l.notes AS loan_notes FROM sample_assets a LEFT JOIN sample_allocations x ON x.asset_id=a.id LEFT JOIN sample_requests r ON r.id=x.request_id LEFT JOIN sample_legacy_loans l ON l.id=x.legacy_loan_id ORDER BY a.created_at,a.id",
      );
      return json({
        assets: assets.map((a) => ({
          id: a.id,
          modelKey: a.model_key,
          no: a.no,
          sn: a.sn,
          notes: a.notes,
          lifecycle: a.lifecycle,
          assetVersion: a.row_version,
          allocation: a.legacy_loan_id
            ? {
                source: "legacy",
                legacyLoanId: a.legacy_loan_id,
                name: a.borrower,
                contact: a.contact,
                lentAt: a.lent_at,
                dueAt: a.due_at,
                notes: a.loan_notes,
              }
            : a.request_id
              ? {
                  source: "request",
                  requestId: a.request_id,
                  publicNo: a.public_no,
                  dueAt: a.effective_due_at,
                  name: JSON.parse(a.original_json).applicant.name,
                }
              : null,
        })),
      });
    }
    const legacy = path.match(
      /^\/api\/sample-admin\/assets\/([a-f0-9-]+)\/legacy-loans(?:\/([a-f0-9-]+)\/(return|loss|correct|preservation))?$/,
    );
    if (legacy && method === "GET" && !legacy[2])
      return json({ loans: await legacyRows(env, legacy[1]) });
    if (legacy && method === "POST" && legacy[2])
      return json(
        await endLegacy(
          request,
          env,
          user,
          legacy[1],
          legacy[2],
          legacy[3],
          await payload(request),
        ),
      );
    const asset = path.match(
      /^\/api\/sample-admin\/assets(?:\/([a-f0-9-]+))?$/,
    );
    if (asset && ["POST", "PATCH"].includes(method))
      return json(
        await assetCommand(
          request,
          env,
          user,
          asset[1],
          await payload(request),
        ),
        asset[1] ? 200 : 201,
      );
    if (path === "/api/sample-admin/grants" && method === "GET") {
      assert(user.is_owner, "OWNER_REQUIRED", "仅主管理员可授权", 403);
      return json({
        admins: await rows(
          env,
          "SELECT u.id,u.username,u.is_owner,u.disabled_at,g.revoked_at,g.granted_at FROM users u LEFT JOIN sample_admin_grants g ON g.user_id=u.id WHERE u.role='admin' ORDER BY u.created_at",
        ),
      });
    }
    if (path === "/api/sample-admin/grants" && method === "POST") {
      assert(user.is_owner, "OWNER_REQUIRED", "仅主管理员可授权", 403);
      const d = await payload(request);
      exact(d, ["userId", "enabled"]);
      assert(
        typeof d.enabled === "boolean",
        "INVALID_FIELDS",
        "请指定授权状态",
        422,
      );
      const target = await first(
        env,
        "SELECT id FROM users WHERE id=? AND role='admin' AND is_owner=0",
        [d.userId],
      );
      assert(target, "NOT_FOUND", "管理员不存在", 404);
      return json(
        await mutation(env, request, user, {
          scope: "grants",
          data: d,
          condition: "EXISTS (SELECT 1 FROM users WHERE id=? AND is_owner=1)",
          conditionValues: [user.id],
          statements: [
            [
              "INSERT INTO sample_admin_grants(user_id,granted_by,granted_at,revoked_at) SELECT ?,?,?,? WHERE $gate ON CONFLICT(user_id) DO UPDATE SET granted_by=excluded.granted_by,granted_at=excluded.granted_at,revoked_at=excluded.revoked_at",
              [d.userId, user.id, iso(), d.enabled ? null : iso()],
            ],
            eventStatement(null, null, user, "grant.changed", {
              targetId: d.userId,
              enabled: d.enabled,
            }),
          ],
          result: { ok: true },
        }),
      );
    }
    if (path === "/api/sample-admin/settings" && method === "GET") {
      assert(user.is_owner, "OWNER_REQUIRED", "仅主管理员可配置", 403);
      const s = await first(
        env,
        "SELECT id,data_json FROM sample_settings_versions WHERE kind='delivery' AND active=1",
      );
      return json({
        settings: s ? { id: s.id, ...JSON.parse(s.data_json) } : null,
      });
    }
    if (path === "/api/sample-admin/settings" && method === "POST") {
      assert(user.is_owner, "OWNER_REQUIRED", "仅主管理员可配置", 403);
      const d = await payload(request);
      exact(d, ["bankAccounts", "templateRevision"]);
      exact(d.bankAccounts, ["CNY", "USD"]);
      const data = {
          bankAccounts: {
            CNY: text(d.bankAccounts.CNY, "bankAccounts.CNY", 8000, true),
            USD: text(d.bankAccounts.USD, "bankAccounts.USD", 8000, true),
          },
          templateRevision: text(d.templateRevision, "templateRevision", 100),
        },
        id = crypto.randomUUID();
      assert(
        data.bankAccounts.CNY || data.bankAccounts.USD,
        "INVALID_FIELDS",
        "至少填写一个已核对收款账户",
        422,
      );
      return json(
        await mutation(env, request, user, {
          scope: "settings",
          data: d,
          condition: "EXISTS (SELECT 1 FROM users WHERE id=? AND is_owner=1)",
          conditionValues: [user.id],
          statements: [
            [
              "UPDATE sample_settings_versions SET active=0 WHERE kind='delivery' AND active=1 AND $gate",
              [],
            ],
            [
              "INSERT INTO sample_settings_versions(id,kind,data_json,active,created_by,created_at) SELECT ?,?,?,?,?,? WHERE $gate",
              [id, "delivery", JSON.stringify(data), 1, user.id, iso()],
            ],
            eventStatement(null, null, user, "settings.changed", {
              revision: id,
            }),
          ],
          result: { id },
        }),
      );
    }
    if (path === "/api/sample-admin/calendar" && method === "GET") {
      const c = await first(
        env,
        "SELECT id,data_json FROM sample_settings_versions WHERE kind='calendar' AND active=1",
      );
      return json({
        calendar: c ? { id: c.id, ...JSON.parse(c.data_json) } : null,
      });
    }
    if (path === "/api/sample-admin/calendar" && method === "POST") {
      assert(user.is_owner, "OWNER_REQUIRED", "仅主管理员可配置工作日历", 403);
      const d = await payload(request);
      exact(d, ["validFrom", "validUntil", "holidays", "workingDates"]);
      const calendar = validateCalendar(d),
        id = crypto.randomUUID();
      return json(
        await mutation(env, request, user, {
          scope: "calendar",
          data: d,
          condition: "EXISTS (SELECT 1 FROM users WHERE id=? AND is_owner=1)",
          conditionValues: [user.id],
          statements: [
            [
              "UPDATE sample_settings_versions SET active=0 WHERE kind='calendar' AND active=1 AND $gate",
              [],
            ],
            [
              "INSERT INTO sample_settings_versions(id,kind,data_json,active,created_by,created_at) SELECT ?,?,?,?,?,? WHERE $gate",
              [id, "calendar", JSON.stringify(calendar), 1, user.id, iso()],
            ],
            eventStatement(null, null, user, "calendar.changed", {
              revision: id,
            }),
          ],
          result: { id },
        }),
      );
    }
    const match = path.match(
      /^\/api\/sample-admin\/requests\/([a-f0-9-]+)(?:\/(.*))?$/,
    );
    assert(match, "NOT_FOUND", "接口不存在", 404);
    const [, id, tail = ""] = match,
      r = await requestRow(env, id);
    if (tail === "preservation" && method === "POST") {
      assert(
        user.is_owner,
        "OWNER_REQUIRED",
        "仅主管理员可冻结或恢复保留资料",
        403,
      );
      assert(
        !r.purge_started_at,
        "RETENTION_CLEANUP",
        "资料已开始清理，无法恢复",
        410,
      );
      const d = await payload(request);
      exact(d, ["expectedRowVersion", "enabled", "reason"]);
      assert(
        typeof d.enabled === "boolean",
        "INVALID_FIELDS",
        "请确认保留状态",
        422,
      );
      const reason = text(d.reason, "reason", 4000);
      return json(
        await mutation(env, request, user, {
          scope: "preservation",
          data: d,
          requestId: id,
          version: d.expectedRowVersion,
          allowPurging: true,
          condition:
            "EXISTS (SELECT 1 FROM users WHERE id=? AND is_owner=1) AND EXISTS (SELECT 1 FROM sample_requests WHERE id=? AND purge_started_at IS NULL)",
          conditionValues: [user.id, id],
          statements: [
            [
              "UPDATE sample_requests SET hold_reason=?,purge_after_at=NULL,row_version=row_version+1 WHERE id=? AND $gate",
              [d.enabled ? reason : null, id],
            ],
            eventStatement(id, r.asset_id, user, "preservation.changed", {
              enabled: d.enabled,
              reason,
            }),
          ],
          result: { id },
        }),
      );
    }
    if (!["GET", "HEAD"].includes(method))
      assert(
        !r.purge_after_at,
        "RETENTION_CLEANUP",
        "申请资料已进入清理流程；请由主管理员先核对保留事项",
        410,
      );
    if (!tail && method === "GET")
      return json({ request: await detail(env, id) });
    const version = tail.match(
      /^versions\/(\d+)\/(preview|download|delivery|retry|status)$/,
    );
    if (version && method === "GET" && version[2] === "status") {
      const job = await first(
        env,
        "SELECT status,error_code AS code,error_detail AS message,next_attempt_at AS nextAttemptAt FROM sample_jobs WHERE request_id=? AND revision_no=?",
        [id, Number(version[1])],
      );
      assert(job, "NOT_FOUND", "任务不存在", 404);
      const document = await first(
        env,
        "SELECT o.document_id AS documentId,o.sha256,o.size FROM sample_agreement_versions v JOIN sample_document_objects o ON o.document_id=v.document_id WHERE v.request_id=? AND v.revision_no=? AND v.pdf_status='ready'",
        [id, Number(version[1])],
      );
      return json({
        job,
        currentAgreementRevision: r.current_agreement_revision,
        document: document
          ? {
              ...document,
              agreementRevision: Number(version[1]),
              fileName: `${r.public_no}-R${version[1]}.pdf`,
              downloadUrl: `/api/sample-admin/requests/${id}/versions/${version[1]}/download`,
            }
          : null,
      });
    }
    if (version && method === "GET" && version[2] !== "retry")
      return await versionGet(
        request,
        env,
        r,
        Number(version[1]),
        version[2],
        url,
      );
    if (version && version[2] === "retry" && method === "POST") {
      const d = await payload(request);
      exact(d, ["expectedRowVersion"]);
      const job = await first(
        env,
        "SELECT * FROM sample_jobs WHERE request_id=? AND revision_no=?",
        [id, Number(version[1])],
      );
      assert(
        job && ["retry_wait", "failed_permanent"].includes(job.status),
        "JOB_NOT_RETRYABLE",
        "当前任务不可重试",
      );
      return json(
        await mutation(env, request, user, {
          scope: "retry/" + version[1],
          data: d,
          requestId: id,
          version: d.expectedRowVersion,
          condition:
            "EXISTS (SELECT 1 FROM sample_jobs j JOIN sample_agreement_versions v ON v.request_id=j.request_id AND v.revision_no=j.revision_no WHERE j.id=? AND j.status IN ('retry_wait','failed_permanent') AND v.document_id IS NULL)",
          conditionValues: [job.id],
          statements: [
            [
              "UPDATE sample_jobs SET status='queued',next_attempt_at=?,attempt_count=0,error_code=NULL,error_detail=NULL WHERE id=? AND $gate",
              [iso(), job.id],
            ],
            [
              "UPDATE sample_agreement_versions SET pdf_status='queued' WHERE request_id=? AND revision_no=? AND $gate",
              [id, Number(version[1])],
            ],
          ],
          result: { id, jobId: job.id },
        }),
      );
    }
    if (tail === "files" && method === "GET")
      return json({ files: (await detail(env, id)).files });
    const file = tail.match(/^files\/([a-f0-9-]+)\/(original|image)$/);
    if (file && method === "GET") {
      assert(env.SAMPLE_FILES, "STORAGE_UNAVAILABLE", "存储尚未配置", 503);
      const f = await first(
        env,
        "SELECT * FROM sample_files WHERE id=? AND request_id=?",
        [file[1], id],
      );
      assert(f, "NOT_FOUND", "附件不存在", 404);
      const key = file[2] === "original" ? f.original_key : f.derivative_key;
      assert(key, "FILE_NOT_READY", "图片尚未处理", 409);
      const object = await env.SAMPLE_FILES.get(key);
      assert(object, "FILE_MISSING", "图片文件缺失", 503);
      return new Response(object.body, {
        headers: {
          ...headers,
          "Content-Type": file[2] === "original" ? f.mime : "image/jpeg",
          "Content-Length": String(object.size),
        },
      });
    }
    const upload = tail.match(/^uploads(?:\/([a-f0-9-]+)\/(part|complete))?$/);
    if (
      upload &&
      ((!upload[1] && method === "POST") ||
        (upload[2] === "part" && method === "PUT") ||
        (upload[2] === "complete" && method === "POST"))
    )
      return json(
        await uploadCommand(
          request,
          env,
          user,
          id,
          upload[2] || "init",
          upload[1],
          upload[2] === "part" ? null : await payload(request),
        ),
      );
    const d = await payload(request);
    const scope =
      tail === "draft" ||
      tail === "approve" ||
      [
        "revisions",
        "reschedules",
        "quotes",
        "billing-basis-corrections",
        "extensions",
      ].includes(tail)
        ? tail
        : tail.startsWith("finances/")
          ? "finance." + tail.slice(9)
          : "progress." + (tail.startsWith("progress/") ? tail.slice(9) : tail);
    const prior = await priorMutation(env, request, user, scope, d, id);
    if (prior) return json({ ...prior, request: await detail(env, id) });
    assert(
      ["POST", "PATCH"].includes(method),
      "METHOD_NOT_ALLOWED",
      "方法不符",
      405,
    );
    let result;
    if (tail === "draft") {
      exact(d, ["expectedRowVersion", "draft", "assetId", "fileIds"]);
      partialDraft(d.draft, fieldMap);
      const type =
        d.draft.applicant?.type ?? JSON.parse(r.original_json).applicant.type;
      if (type === "company")
        text(d.draft.applicant?.creditCode, "applicant.creditCode", 64);
      const sealed = await seal(env.SAMPLE_SECRET, id + ":draft", d);
      assert(r.status === "pending", "DRAFT_LOCKED", "仅待批复可保存草稿");
      result = await mutation(env, request, user, {
        scope: "draft",
        data: d,
        requestId: id,
        version: d.expectedRowVersion,
        statements: [
          [
            "UPDATE sample_requests SET draft_cipher=?,row_version=row_version+1 WHERE id=? AND $gate",
            [sealed, id],
          ],
          eventStatement(id, r.asset_id, user, "draft.saved"),
        ],
        result: { id },
      });
    } else if (tail === "approve")
      result = await approveCommand(request, env, user, r, d);
    else if (
      [
        "revisions",
        "reschedules",
        "quotes",
        "billing-basis-corrections",
        "extensions",
      ].includes(tail)
    )
      result = await reviseCommand(request, env, user, r, tail, d);
    else if (tail.startsWith("finances/"))
      result = await financeCommand(request, env, user, r, tail.slice(9), d);
    else
      result = await progressCommand(
        request,
        env,
        user,
        r,
        tail.startsWith("progress/") ? tail.slice(9) : tail,
        d,
      );
    if (
      ctx &&
      env.SAMPLE_JOBS &&
      (tail === "approve" ||
        [
          "revisions",
          "reschedules",
          "quotes",
          "billing-basis-corrections",
          "extensions",
        ].includes(tail))
    )
      ctx.waitUntil(
        enqueuePending(env, id).catch(() =>
          console.error(
            JSON.stringify({
              service: "sample-outbox",
              code: "QUEUE_ENQUEUE_FAILED",
              requestId: id,
            }),
          ),
        ),
      );
    return json({ ...result, request: await detail(env, id) });
  } catch (e) {
    if (
      e instanceof LoanError &&
      [401, 403].includes(e.status) &&
      env.CASE_DB
    ) {
      try {
        await stmt(
          env,
          "INSERT INTO sample_security_events(id,actor_id,action,ip,occurred_at) VALUES(?,?,?,?,?)",
          [
            crypto.randomUUID(),
            null,
            "denied:" + e.code,
            request.headers.get("CF-Connecting-IP"),
            iso(),
          ],
        ).run();
      } catch {
        console.error(
          JSON.stringify({
            service: "sample-security",
            code: "SECURITY_RECORD_FAILED",
            traceId,
          }),
        );
      }
    }
    if (e instanceof LoanError)
      return json(
        { error: e.message, code: e.code, fieldErrors: e.fieldErrors, traceId },
        e.status,
      );
    console.error(
      JSON.stringify({
        traceId,
        service: "sample-loan",
        error: e.constructor.name,
      }),
    );
    return json(
      {
        error: "服务暂时不可用，请稍后重试",
        code: "SERVICE_UNAVAILABLE",
        traceId,
      },
      503,
    );
  }
}
