import {
  assert,
  fail,
  iso,
  text,
  exact,
  integer,
  at,
  endOfDay,
  beijingDay,
  termDays,
  canonical,
  code,
  MODELS,
  approval,
} from "./domain.mjs";
import { mutation, first, eventStatement, detail } from "./store.mjs";
import { versionStatements } from "./agreements.mjs";
import { refundDeadline } from "./maintenance.mjs";
import { financialState } from "./finance.mjs";
import { legacyData } from "./legacy.mjs";
const touch = (r, closed = null) => [
  "UPDATE sample_requests SET row_version=row_version+1,closed_at=? WHERE id=? AND $gate",
  [closed, r.id],
];
export async function assetCommand(request, env, user, id, d) {
  exact(d, [
    "modelKey",
    "no",
    "sn",
    "notes",
    "lifecycle",
    "expectedAssetVersion",
    "legacyLoan",
  ]);
  assert(
    typeof d.modelKey === "string" && Object.hasOwn(MODELS, d.modelKey),
    "VALIDATION_FAILED",
    "请选择有效型号",
    422,
  );
  const sn = code(d.sn, "sn"),
    no = code(d.no, "no"),
    notes = text(d.notes, "notes", 8000, true) || "",
    life = d.lifecycle || "active";
  assert(
    ["active", "lost", "retired"].includes(life),
    "VALIDATION_FAILED",
    "样机状态不符",
    422,
  );
  const asset = id
    ? await first(env, "SELECT * FROM sample_assets WHERE id=?", [id])
    : null;
  if (id) assert(asset, "NOT_FOUND", "样机不存在", 404);
  const busy =
    asset &&
    (await first(
      env,
      "SELECT request_id,legacy_loan_id FROM sample_allocations WHERE asset_id=?",
      [id],
    ));
  if (busy)
    assert(
      asset.sn === sn.display &&
        asset.no === no.display &&
        asset.model_key === d.modelKey &&
        asset.lifecycle === life,
      "ASSET_IDENTITY_LOCKED",
      "已借出时不能更改 NO、SN、型号或台账状态",
    );
  if (asset?.lifecycle === "lost" && life === "active")
    assert(
      !busy && d.notes?.trim(),
      "RECOVERY_REQUIRED",
      "找回后检查并填写备注才能恢复可借状态",
      422,
    );
  const legacy = d.legacyLoan === undefined ? null : legacyData(d.legacyLoan);
  assert(
    !legacy || (life === "active" && !busy?.request_id),
    "ASSET_OCCUPIED",
    "只有正常且未关联审批单的机器能登记历史借出",
    422,
  );
  assert(
    !busy?.legacy_loan_id || legacy,
    "RETURN_REQUIRED",
    "请通过登记归还或更正处理历史借出",
    422,
  );
  const next = id || crypto.randomUUID(),
    now = iso();
  const statements = asset
    ? [
        [
          "UPDATE sample_assets SET model_key=?,sn=?,sn_key=?,no=?,no_key=?,notes=?,lifecycle=?,row_version=row_version+1,updated_at=? WHERE id=? AND $gate",
          [
            d.modelKey,
            sn.display,
            sn.key,
            no.display,
            no.key,
            notes,
            life,
            now,
            id,
          ],
        ],
      ]
    : [
        [
          "INSERT INTO sample_assets(id,model_key,no,sn,no_key,sn_key,notes,lifecycle,created_by,created_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,?,? WHERE $gate",
          [
            next,
            d.modelKey,
            no.display,
            sn.display,
            no.key,
            sn.key,
            notes,
            life,
            user.id,
            now,
            now,
          ],
        ],
      ];
  if (legacy) {
    const legacyId = busy?.legacy_loan_id || crypto.randomUUID();
    if (busy?.legacy_loan_id)
      statements.push([
        "UPDATE sample_legacy_loans SET borrower=?,contact=?,lent_at=?,due_at=?,notes=?,updated_at=?,row_version=row_version+1 WHERE id=? AND $gate",
        [
          legacy.borrower,
          legacy.contact,
          legacy.lentAt,
          legacy.dueAt,
          legacy.notes,
          now,
          legacyId,
        ],
      ]);
    else
      statements.push(
        [
          "INSERT INTO sample_legacy_loans(id,asset_id,borrower,contact,lent_at,due_at,notes,created_by,recorded_at,updated_at) SELECT ?,?,?,?,?,?,?,?,?,? WHERE $gate",
          [
            legacyId,
            next,
            legacy.borrower,
            legacy.contact,
            legacy.lentAt,
            legacy.dueAt,
            legacy.notes,
            user.id,
            now,
            now,
          ],
        ],
        [
          "INSERT INTO sample_allocations(asset_id,legacy_loan_id,allocated_at,operation_id) SELECT ?,?,?,? WHERE $gate",
          [next, legacyId, now, "$operation"],
        ],
      );
    statements.push(
      eventStatement(
        null,
        next,
        user,
        busy ? "legacy.updated" : "legacy.created",
        { legacyLoanId: legacyId, ...legacy },
        legacy.lentAt || now,
      ),
    );
  }
  if (asset?.lifecycle === "lost" && life === "active")
    statements.push([
      "UPDATE sample_losses SET recovered_at=? WHERE asset_id=? AND recovered_at IS NULL AND $gate",
      [now, next],
    ]);
  if (!legacy)
    statements.push(
      eventStatement(
        null,
        next,
        user,
        asset ? "asset.updated" : "asset.created",
        { modelKey: d.modelKey, lifecycle: life },
      ),
    );
  return mutation(env, request, user, {
    scope: asset ? "assets/" + id : "assets",
    data: d,
    condition: asset
      ? "EXISTS (SELECT 1 FROM sample_assets WHERE id=? AND row_version=?)" +
        (legacy && !busy
          ? " AND NOT EXISTS (SELECT 1 FROM sample_allocations WHERE asset_id=?)"
          : "")
      : "1",
    conditionValues: asset
      ? [
          id,
          integer(d.expectedAssetVersion, "expectedAssetVersion"),
          ...(legacy && !busy ? [id] : []),
        ]
      : [],
    statements,
    result: { id: next },
  });
}
export async function approveCommand(request, env, user, r, d) {
  exact(d, [
    "expectedRowVersion",
    "expectedAssetVersion",
    "assetId",
    "fileIds",
    "draft",
  ]);
  assert(r.status === "pending", "DECISION_EXISTS", "申请已处理");
  const asset = await first(env, "SELECT * FROM sample_assets WHERE id=?", [
    d.assetId,
  ]);
  assert(asset, "ASSET_REQUIRED", "请选择实际出借样机", 422);
  const v = await versionStatements(env, user, r, d.draft, {
      asset,
      fileIds: d.fileIds || [],
    }),
    now = iso();
  v.statements.push(
    [
      "INSERT INTO sample_decisions(request_id,kind,actor_id,reason,recorded_at,operation_id) SELECT ?,?,?,?,?,? WHERE $gate",
      [r.id, "approve", user.id, v.d.approval.note || "", now, "$operation"],
    ],
    [
      "INSERT INTO sample_allocations(asset_id,request_id,allocated_at,operation_id) SELECT ?,?,?,? WHERE $gate",
      [asset.id, r.id, now, "$operation"],
    ],
    [
      "UPDATE sample_assets SET row_version=row_version+1,updated_at=? WHERE id=? AND $gate",
      [now, asset.id],
    ],
    [
      "UPDATE sample_requests SET status='approved',asset_id=?,initial_term_days=? WHERE id=? AND $gate",
      [asset.id, termDays(v.d.schedule.startsAt, v.d.schedule.dueAt), r.id],
    ],
    [
      "INSERT INTO sample_progress(request_id,updated_at) SELECT ?,? WHERE $gate",
      [r.id, now],
    ],
  );
  return mutation(env, request, user, {
    scope: "approve",
    requestId: r.id,
    version: d.expectedRowVersion,
    data: d,
    condition:
      "EXISTS (SELECT 1 FROM sample_assets WHERE id=? AND row_version=? AND model_key=? AND lifecycle='active') AND NOT EXISTS (SELECT 1 FROM sample_allocations WHERE asset_id=?) AND NOT EXISTS (SELECT 1 FROM sample_decisions WHERE request_id=?)",
    conditionValues: [
      asset.id,
      integer(d.expectedAssetVersion, "expectedAssetVersion"),
      r.model_key,
      asset.id,
      r.id,
    ],
    statements: v.statements,
    result: { id: r.id, agreementRevision: v.rev },
  });
}
export async function reviseCommand(request, env, user, r, kind, d) {
  exact(d, [
    "expectedRowVersion",
    "expectedAssetVersion",
    "assetId",
    "fileIds",
    "draft",
    "reason",
    "receivedAt",
    "decision",
    "requestedDueAt",
    "sameLegalEntityConfirmed",
  ]);
  assert(
    r.status === "approved" ||
      (kind === "revisions" && r.status === "completed"),
    "NOT_EDITABLE",
    "该状态不可修订交付",
  );
  const current = await detail(env, r.id),
    old = current.agreement,
    reason = text(d.reason, "reason", 4000),
    funds = await financialState(env, r.id),
    draft = structuredClone(d.draft || old);
  // Read-only snapshot metadata never enters the writable DTO.
  for (const k of [
    "assetSnapshot",
    "insuredValue",
    "publicNo",
    "requestedDays",
    "submittedAt",
    "approvedAt",
    "approvedBy",
    "termsVersion",
    "agreementRevision",
    "agreementLanguage",
    "fileIds",
    "quoteId",
  ])
    delete draft[k];
  const assetId = d.assetId || r.asset_id,
    asset = await first(env, "SELECT * FROM sample_assets WHERE id=?", [
      assetId,
    ]),
    now = iso(),
    extra = [];
  assert(asset, "ASSET_REQUIRED", "样机不存在", 422);
  const noCash = !funds.entries.some((e) =>
      ["receipt", "refund"].includes(e.kind),
    ),
    unshipped = !current.progress.shippedAt;
  Object.assign(draft, approval(draft));
  const comparison = (keys) =>
    keys.every((k) => canonical(draft[k]) === canonical(old[k]));
  if (kind === "revisions") {
    assert(
      comparison(["schedule", "quote", "billingBasis"]),
      "LOCKED_FIELDS",
      "借期、报价与价值请使用专门更正操作",
      422,
    );
    if (
      draft.applicant.name !== old.applicant.name ||
      draft.applicant.creditCode !== old.applicant.creditCode
    )
      assert(
        d.sameLegalEntityConfirmed === true &&
          draft.identity?.verified === true &&
          draft.identity.notes !== old.identity.notes,
        "IDENTITY_RECHECK_REQUIRED",
        "更正主体名称或信用代码须确认仍为同一法律主体，并更新核验记录",
        422,
      );
    // A corrected name is explicitly attested as the same legal subject in the reason/verification record.
    assert(
      draft.applicant.type === old.applicant.type,
      "NEW_APPLICATION_REQUIRED",
      "更换法律主体应另立申请",
      422,
    );
  }
  if (kind === "reschedules") {
    assert(
      unshipped && funds.assessments.length === 0,
      "SCHEDULE_LOCKED",
      "实际寄出或产生费用核定后不可更正排期",
    );
    assert(
      comparison([
        "applicant",
        "shipping",
        "quote",
        "payment",
        "billingBasis",
        "equipment",
        "outbound",
        "returnTo",
        "lender",
        "agreementDate",
        "approval",
        "attachments",
      ]),
      "LOCKED_FIELDS",
      "排期更正仅可修改起止时间",
      422,
    );
    extra.push([
      "UPDATE sample_requests SET initial_term_days=? WHERE id=? AND $gate",
      [termDays(draft.schedule.startsAt, draft.schedule.dueAt), r.id],
    ]);
  }
  if (kind === "quotes" || kind === "billing-basis-corrections") {
    assert(
      unshipped &&
        noCash &&
        (kind === "quotes" || funds.assessments.length === 0),
      "FINANCIAL_BASIS_LOCKED",
      "已收款或实际寄出后不能覆盖报价或计费基数",
    );
    const change = kind === "quotes" ? "quote" : "billingBasis";
    assert(
      Object.keys(draft)
        .filter((k) => k !== change)
        .every((k) => canonical(draft[k]) === canonical(old[k])),
      "LOCKED_FIELDS",
      "专门更正只可修改对应报价或价值",
      422,
    );
  }
  if (kind === "extensions") {
    const received = at(d.receivedAt, "receivedAt", { past: true }),
      due = at(d.requestedDueAt, "requestedDueAt");
    assert(
      ["approve", "reject"].includes(d.decision),
      "VALIDATION_FAILED",
      "请选择延期结果",
      422,
    );
    extra.push([
      "INSERT INTO sample_extensions(id,request_id,received_at,requested_due_at,decision,reason,previous_due_at,recorded_at,actor_id,operation_id) SELECT ?,?,?,?,?,?,?,?,?,? WHERE $gate",
      [
        crypto.randomUUID(),
        r.id,
        received,
        due,
        d.decision,
        reason,
        old.schedule.dueAt,
        now,
        user.id,
        "$operation",
      ],
    ]);
    if (d.decision === "reject")
      return mutation(env, request, user, {
        scope: kind,
        requestId: r.id,
        version: d.expectedRowVersion,
        data: d,
        statements: [
          ...extra,
          touch(r),
          eventStatement(r.id, r.asset_id, user, "extension.rejected", {
            reason,
            receivedAt: received,
            requestedDueAt: due,
          }),
        ],
        result: { id: r.id },
      });
    assert(!unshipped, "USE_RESCHEDULE", "发货前排期请使用更正排期");
    assert(
      r.initial_term_days > 7 &&
        Date.parse(received) <= Date.parse(old.schedule.dueAt) - 7 * 86400000 &&
        now <= old.schedule.dueAt &&
        due > old.schedule.dueAt,
      "EXTENSION_NOT_ALLOWED",
      "不符合提前七日及原借期要求",
    );
    draft.schedule = { ...old.schedule, dueAt: due };
  }
  assert(
    unshipped || assetId === r.asset_id,
    "ASSET_SHIPPED",
    "实际寄出后不可直接换机",
  );
  const frozenAsset = current.progress.shippedAt
    ? {
        id: r.asset_id,
        no: old.assetSnapshot.no,
        sn: old.assetSnapshot.sn,
        model_key: old.assetSnapshot.modelKey,
      }
    : asset;
  const v = await versionStatements(env, user, r, draft, {
    kind,
    reason,
    asset: frozenAsset,
    fileIds: d.fileIds || old.fileIds,
    audit:
      kind === "revisions"
        ? { sameLegalEntityConfirmed: d.sameLegalEntityConfirmed === true }
        : {},
  });
  let condition = "1",
    conditionValues = [];
  if (assetId !== r.asset_id) {
    assert(
      r.status === "approved" &&
        asset.lifecycle === "active" &&
        asset.model_key === r.model_key,
      "ASSET_MISMATCH",
      "请选择同型号空闲样机",
      422,
    );
    condition =
      "EXISTS (SELECT 1 FROM sample_assets WHERE id=? AND row_version=? AND lifecycle='active') AND NOT EXISTS (SELECT 1 FROM sample_allocations WHERE asset_id=?)";
    conditionValues = [
      assetId,
      integer(d.expectedAssetVersion, "expectedAssetVersion"),
      assetId,
    ];
    extra.push(
      [
        "DELETE FROM sample_allocations WHERE request_id=? AND asset_id=? AND $gate",
        [r.id, r.asset_id],
      ],
      [
        "INSERT INTO sample_allocations(asset_id,request_id,allocated_at,operation_id) SELECT ?,?,?,? WHERE $gate",
        [assetId, r.id, now, "$operation"],
      ],
      [
        "UPDATE sample_requests SET asset_id=? WHERE id=? AND $gate",
        [assetId, r.id],
      ],
      [
        "UPDATE sample_assets SET row_version=row_version+1,updated_at=? WHERE id IN (?,?) AND $gate",
        [now, r.asset_id, assetId],
      ],
    );
  }
  return mutation(env, request, user, {
    scope: kind,
    requestId: r.id,
    version: d.expectedRowVersion,
    data: d,
    condition,
    conditionValues,
    statements: [...v.statements, ...extra],
    result: { id: r.id, agreementRevision: v.rev },
  });
}
export async function progressCommand(request, env, user, r, kind, d) {
  exact(d, [
    "expectedRowVersion",
    "occurredAt",
    "note",
    "reason",
    "evidence",
    "eventId",
    "expectedAssetVersion",
    "confirmedNotShipped",
  ]);
  const current = await detail(env, r.id),
    now = iso(),
    time = d.occurredAt ? at(d.occurredAt, "occurredAt", { past: true }) : now,
    reason = text(
      d.reason || d.note,
      "note",
      4000,
      kind === "ship" || kind === "return",
    ),
    p = current.progress,
    statements = [];
  let condition = "1",
    conditionValues = [],
    corrects = null;
  if (kind === "reject") {
    assert(r.status === "pending", "DECISION_EXISTS", "申请已经处理");
    statements.push(
      [
        "INSERT INTO sample_decisions(request_id,kind,actor_id,reason,recorded_at,operation_id) SELECT ?,?,?,?,?,? WHERE $gate",
        [r.id, "reject", user.id, reason, now, "$operation"],
      ],
      [
        "UPDATE sample_requests SET status='rejected',row_version=row_version+1,closed_at=? WHERE id=? AND $gate",
        [now, r.id],
      ],
    );
  } else if (kind === "cancel") {
    assert(
      ["pending", "approved"].includes(r.status) && !p?.shippedAt,
      "CANNOT_CANCEL",
      "仅未实际寄出单据可取消",
    );
    statements.push(
      [
        "UPDATE sample_requests SET status='cancelled',row_version=row_version+1,closed_at=?,financial_closed_at=NULL WHERE id=? AND $gate",
        [now, r.id],
      ],
      ["DELETE FROM sample_allocations WHERE request_id=? AND $gate", [r.id]],
      [
        "UPDATE sample_assets SET row_version=row_version+1,updated_at=? WHERE id=? AND $gate",
        [now, r.asset_id],
      ],
    );
  } else if (kind === "ship") {
    assert(
      r.status === "approved" && !p.shippedAt,
      "CANNOT_SHIP",
      "单据不可重复发货",
    );
    const a = current.agreement,
      fs = await financialState(env, r.id),
      q = fs.currentQuote;
    assert(
      !fs.projection.reconciliation &&
        BigInt(fs.projection.depositMatchedMinor) >=
          BigInt(a.quote.deposit.amountMinor) &&
        BigInt(
          fs.projection.byCurrency[a.quote.deposit.currency].balanceMinor,
        ) -
          BigInt(
            fs.projection.byCurrency[a.quote.deposit.currency].unallocatedMinor,
          ) >=
          BigInt(a.quote.deposit.amountMinor),
      "DEPOSIT_INSUFFICIENT",
      "请核对押金足额到账",
    );
    assert(
      a.identity.verified &&
        a.outbound.carrier &&
        a.outbound.trackingNumber &&
        a.outbound.insuranceReference,
      "DELIVERY_INCOMPLETE",
      "请补齐主体核验、物流及保价凭证",
    );
    assert(
      current.versions.at(-1)?.status === "ready",
      "DOCUMENT_NOT_READY",
      "当前协议PDF尚未生成",
    );
    assert(time >= a.submittedAt, "INVALID_TIME", "发货不能早于申请", 422);
    statements.push(
      [
        "UPDATE sample_progress SET shipped_at=?,billing_basis_revision=?,updated_at=? WHERE request_id=? AND $gate",
        [time, r.current_agreement_revision, now, r.id],
      ],
      touch(r),
    );
  } else if (kind === "return") {
    assert(
      r.status === "approved" && p.shippedAt && !p.returnedAt,
      "CANNOT_RETURN",
      "请先核对实际发货记录",
    );
    assert(time >= p.shippedAt, "INVALID_TIME", "归还不能早于发货", 422);
    const deadline = await refundDeadline(env, time);
    statements.push(
      [
        "UPDATE sample_progress SET returned_at=?,refund_due_at=?,refund_calendar_revision=?,updated_at=? WHERE request_id=? AND $gate",
        [time, deadline.dueAt, deadline.calendarRevision, now, r.id],
      ],
      [
        "UPDATE sample_requests SET status='completed',row_version=row_version+1,closed_at=?,financial_closed_at=NULL WHERE id=? AND $gate",
        [time, r.id],
      ],
      [
        "DELETE FROM sample_allocations WHERE request_id=? AND asset_id=? AND $gate",
        [r.id, r.asset_id],
      ],
      [
        "UPDATE sample_assets SET row_version=row_version+1,updated_at=? WHERE id=? AND $gate",
        [now, r.asset_id],
      ],
    );
  } else if (kind === "inspect") {
    assert(
      r.status === "completed" && p.returnedAt,
      "RETURN_REQUIRED",
      "请先登记实际归还",
    );
    assert(time >= p.returnedAt, "INVALID_TIME", "验收不能早于归还", 422);
    statements.push(
      [
        "UPDATE sample_progress SET inspected_at=?,inspection_note=?,updated_at=? WHERE request_id=? AND $gate",
        [time, reason, now, r.id],
      ],
      touch(r, r.closed_at),
    );
  } else if (kind === "loss") {
    assert(
      r.status === "approved" && p.shippedAt,
      "LOSS_NOT_ALLOWED",
      "未寄出仓库异常请取消出借并单独处理台账",
    );
    assert(time >= p.shippedAt, "INVALID_TIME", "丢失核实不能早于寄出", 422);
    const evidence = text(d.evidence, "evidence", 4000);
    statements.push(
      [
        "INSERT INTO sample_losses(request_id,asset_id,verified_at,reason,evidence) SELECT ?,?,?,?,? WHERE $gate",
        [r.id, r.asset_id, time, reason, evidence],
      ],
      [
        "UPDATE sample_requests SET status='loss_pending',row_version=row_version+1,financial_closed_at=NULL WHERE id=? AND $gate",
        [r.id],
      ],
      [
        "DELETE FROM sample_allocations WHERE request_id=? AND asset_id=? AND $gate",
        [r.id, r.asset_id],
      ],
      [
        "UPDATE sample_assets SET lifecycle='lost',row_version=row_version+1,updated_at=? WHERE id=? AND $gate",
        [now, r.asset_id],
      ],
    );
  } else if (kind === "loss-notice") {
    assert(
      r.status === "loss_pending" && !current.loss.conversion_at,
      "LOSS_NOTICE_NOT_ALLOWED",
      "已通知或单据状态不符",
    );
    assert(
      time >= current.loss.verified_at,
      "INVALID_TIME",
      "通知不得早于核实",
      422,
    );
    const evidence = text(d.evidence, "evidence", 4000),
      f = await financialState(env, r.id);
    assert(
      f.projection.assessmentComplete,
      "ASSESSMENT_REQUIRED",
      "通知前请完整核定赔偿及押金处理",
    );
    const due = endOfDay(
      beijingDay(new Date(Date.parse(time) + 7 * 86400000).toISOString()),
    );
    statements.push(
      [
        "UPDATE sample_losses SET conversion_at=?,notification_evidence=?,compensation_due_at=? WHERE request_id=? AND $gate",
        [time, evidence, due, r.id],
      ],
      touch(r),
    );
  } else if (kind === "loss-close") {
    const f = await financialState(env, r.id);
    assert(
      r.status === "loss_pending" &&
        current.loss.conversion_at &&
        f.projection.assessmentComplete &&
        f.projection.balanced,
      "LOSS_NOT_CLOSABLE",
      "请核对通知、核定、所有应收及应退",
    );
    statements.push(
      [
        "UPDATE sample_losses SET closed_at=? WHERE request_id=? AND $gate",
        [now, r.id],
      ],
      [
        "UPDATE sample_requests SET status='loss_closed',row_version=row_version+1,closed_at=?,financial_closed_at=? WHERE id=? AND $gate",
        [now, now, r.id],
      ],
    );
  } else if (kind === "correction") {
    const e = await first(
      env,
      "SELECT * FROM sample_events WHERE id=? AND request_id=?",
      [d.eventId, r.id],
    );
    assert(e, "EVENT_NOT_FOUND", "原事件不属于本单", 422);
    corrects = e.id;
    if (e.action === "progress.return") {
      assert(
        r.status === "completed" && !p.inspectedAt,
        "CORRECTION_DEPENDENCY",
        "已有验收或后续状态，不能直接撤销归还",
      );
      const downstream = await first(
        env,
        "SELECT id FROM sample_financial_entries WHERE request_id=? AND recorded_at>?",
        [r.id, e.recorded_at],
      );
      assert(
        !downstream,
        "CORRECTION_DEPENDENCY",
        "已有后续财务事实，请先核对",
      );
      assert(
        !(await first(
          env,
          "SELECT request_id FROM sample_allocations WHERE asset_id=?",
          [r.asset_id],
        )),
        "ASSET_REALLOCATED",
        "该样机已被新单占用，不能撤销原归还",
      );
      condition =
        "EXISTS (SELECT 1 FROM sample_assets WHERE id=? AND row_version=? AND lifecycle='active') AND NOT EXISTS (SELECT 1 FROM sample_allocations WHERE asset_id=?)";
      conditionValues = [
        r.asset_id,
        integer(d.expectedAssetVersion, "expectedAssetVersion"),
        r.asset_id,
      ];
      statements.push(
        [
          "INSERT INTO sample_allocations(asset_id,request_id,allocated_at,operation_id) SELECT ?,?,?,? WHERE $gate",
          [r.asset_id, r.id, now, "$operation"],
        ],
        [
          "UPDATE sample_progress SET returned_at=NULL,updated_at=? WHERE request_id=? AND $gate",
          [now, r.id],
        ],
        [
          "UPDATE sample_requests SET status='approved',closed_at=NULL,financial_closed_at=NULL,row_version=row_version+1 WHERE id=? AND $gate",
          [r.id],
        ],
        [
          "UPDATE sample_assets SET row_version=row_version+1,updated_at=? WHERE id=? AND $gate",
          [now, r.asset_id],
        ],
      );
    } else if (e.action === "progress.ship") {
      assert(
        r.status === "approved" &&
          p.shippedAt &&
          !p.returnedAt &&
          !current.loss &&
          d.confirmedNotShipped === true,
        "CORRECTION_DEPENDENCY",
        "请核对未实际发出且没有后续交接",
      );
      statements.push(
        [
          "UPDATE sample_progress SET shipped_at=NULL,billing_basis_revision=NULL,updated_at=? WHERE request_id=? AND $gate",
          [now, r.id],
        ],
        touch(r),
      );
    } else if (e.action === "progress.inspect") {
      assert(
        r.status === "completed",
        "CORRECTION_DEPENDENCY",
        "状态不允许更正",
      );
      statements.push(
        [
          "UPDATE sample_progress SET inspection_note=?,updated_at=? WHERE request_id=? AND $gate",
          [reason, now, r.id],
        ],
        touch(r, r.closed_at),
        [
          "UPDATE sample_requests SET financial_closed_at=NULL WHERE id=? AND $gate",
          [r.id],
        ],
      );
    } else
      fail(
        422,
        "CORRECTION_NOT_SUPPORTED",
        "资金更正请引用具体流水；此事件不支持直接回退",
      );
  } else fail(404, "NOT_FOUND", "操作不存在");
  statements.push(
    eventStatement(
      r.id,
      r.asset_id,
      user,
      "progress." + kind,
      { reason, evidence: d.evidence || null },
      time,
      corrects,
    ),
  );
  return mutation(env, request, user, {
    scope: "progress." + kind,
    requestId: r.id,
    version: d.expectedRowVersion,
    data: d,
    condition,
    conditionValues,
    statements,
    result: { id: r.id },
  });
}
