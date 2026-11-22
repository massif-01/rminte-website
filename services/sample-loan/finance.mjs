import { assert, convert, money, at, text, iso, exact } from "./domain.mjs";
import { rows, mutation, eventStatement, detail, operationId } from "./store.mjs";
// Rebuildable projection; cash movements and their applications are separate facts.
export function project(entries, assessments, quotes, currentQuote) {
  const reversed = new Set(
    entries
      .filter((e) => e.kind === "reversal")
      .map((e) => e.reverses_entry_id),
  );
  const active = entries.filter(
    (e) => e.kind !== "reversal" && !reversed.has(e.id),
  );
  const matches = new Map(
    active
      .filter((e) => e.kind === "reconcile")
      .map((e) => [
        (typeof e.details_json === "string"
          ? JSON.parse(e.details_json)
          : e.details
        ).sourceEntryId,
        e,
      ]),
  );
  const byCurrency = Object.fromEntries(
    ["CNY", "USD"].map((c) => [
      c,
      { received: 0n, refunded: 0n, applied: 0n, unallocated: 0n, debt: 0n },
    ]),
  );
  const debts = Object.fromEntries(
    assessments.map((a) => [a.id, BigInt(a.amount_minor)]),
  );
  let reconciliation = false,
    depositMatched = 0n;
  for (const e of active) {
    const b = byCurrency[e.currency],
      n = BigInt(e.amount_minor),
      original =
        typeof e.details_json === "string"
          ? JSON.parse(e.details_json)
          : e.details,
      match = matches.get(e.id),
      d = match
        ? { ...original, ...JSON.parse(match.details_json), exceptional: false }
        : original;
    if (e.kind === "receipt") {
      b.received += n;
      const q = quotes.find((q) => q.id === (match?.quote_id || e.quote_id)),
        quote =
          q &&
          (typeof q.quote_json === "string"
            ? JSON.parse(q.quote_json)
            : q.quote);
      if (d.purpose === "deposit" && quote?.deposit.currency === e.currency) {
        if (currentQuote?.id === (match?.quote_id || e.quote_id))
          depositMatched += n;
      } else if (
        d.purpose === "compensation" &&
        debts[match?.assessment_id || e.assessment_id] !== undefined &&
        assessments.find(
          (a) => a.id === (match?.assessment_id || e.assessment_id),
        ).currency === e.currency
      ) {
        debts[match?.assessment_id || e.assessment_id] -= n;
        b.applied += n;
      } else if (match && d.purpose === "refund_only") {
      } else {
        b.unallocated += n;
        reconciliation = true;
      }
    }
    if (e.kind === "refund") b.refunded += n;
    if (e.kind === "apply") {
      b.applied += n;
      assert(
        debts[e.assessment_id] !== undefined,
        "ASSESSMENT_REQUIRED",
        "核定项目不存在",
        422,
      );
      debts[e.assessment_id] -= BigInt(d.targetMinor);
    }
    if (d.exceptional) reconciliation = true;
  }
  for (const a of assessments) byCurrency[a.currency].debt += debts[a.id];
  const result = {
    byCurrency: {},
    debts: Object.fromEntries(
      Object.entries(debts).map(([k, v]) => [k, v.toString()]),
    ),
    reconciliation,
    assessmentComplete: assessments.at(-1)?.completed === 1,
    depositMatchedMinor: depositMatched.toString(),
  };
  if (Object.values(debts).some((amount) => amount < 0n))
    result.reconciliation = true;
  for (const [c, b] of Object.entries(byCurrency)) {
    const balance = b.received - b.refunded - b.applied;
    if (balance < 0n || b.debt < 0n) result.reconciliation = true;
    result.byCurrency[c] = {
      receivedMinor: b.received.toString(),
      refundedMinor: b.refunded.toString(),
      appliedMinor: b.applied.toString(),
      unallocatedMinor: b.unallocated.toString(),
      balanceMinor: balance.toString(),
      outstandingMinor: b.debt.toString(),
    };
  }
  result.balanced =
    !result.reconciliation &&
    Object.values(debts).every((amount) => amount === 0n) &&
    Object.values(result.byCurrency).every(
      (b) =>
        b.balanceMinor === "0" &&
        b.outstandingMinor === "0" &&
        b.unallocatedMinor === "0",
    );
  return result;
}
export async function financialState(
  env,
  id,
  extraEntries = [],
  extraAssessments = [],
) {
  const [entries, assessments, quotes] = await Promise.all([
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
      "SELECT * FROM sample_quotes WHERE request_id=? ORDER BY quote_revision",
      [id],
    ),
  ]);
  return {
    entries,
    assessments,
    quotes,
    currentQuote: quotes.at(-1),
    projection: project(
      [...entries, ...extraEntries],
      [...assessments, ...extraAssessments],
      quotes,
      quotes.at(-1),
    ),
  };
}
export const projectionStatement = (id, projection) => [
  "INSERT INTO sample_financial_projections(request_id,projection_json,updated_at) SELECT ?,?,? WHERE $gate ON CONFLICT(request_id) DO UPDATE SET projection_json=excluded.projection_json,updated_at=excluded.updated_at",
  [id, JSON.stringify(projection), iso()],
];
export async function financeCommand(request, env, user, r, action, d) {
  const current = await detail(env, r.id),
    state = await financialState(env, r.id),
    statements = [];
  let projection, entry, assessment;
  if (action === "assessments") {
    exact(d, ["expectedRowVersion", "money", "reason", "complete"]);
    const m = money(d.money),
      reason = text(d.reason, "reason", 4000);
    assert(
      typeof d.complete === "boolean",
      "VALIDATION_FAILED",
      "请确认核定是否完整",
      422,
    );
    assessment = {
      id: crypto.randomUUID(),
      request_id: r.id,
      currency: m.currency,
      amount_minor: Number(m.amountMinor),
      basis_revision:
        current.progress?.billingBasisRevision || r.current_agreement_revision,
      reason,
      completed: +d.complete,
      created_at: iso(),
      actor_id: user.id,
      operation_id: operationId,
    };
    statements.push([
      "INSERT INTO sample_assessments(id,request_id,currency,amount_minor,basis_revision,reason,completed,created_at,actor_id,operation_id) SELECT ?,?,?,?,?,?,?,?,?,? WHERE $gate",
      Object.values(assessment),
    ]);
    projection = project(
      state.entries,
      [...state.assessments, assessment],
      state.quotes,
      state.currentQuote,
    );
  } else if (action === "close") {
    exact(d, ["expectedRowVersion", "reason"]);
    text(d.reason, "reason", 4000);
    assert(
      [
        "completed",
        "cancelled",
        "rejected",
        "loss_pending",
        "loss_closed",
      ].includes(r.status),
      "FINANCIAL_NOT_CLOSABLE",
      "实物流程尚未结束",
    );
    assert(
      r.status !== "completed" || current.progress?.inspectedAt,
      "INSPECTION_REQUIRED",
      "请先完成归还验收",
    );
    projection = state.projection;
    assert(
      projection.assessmentComplete && projection.balanced,
      "BALANCE_OUTSTANDING",
      "请完成核定，处理所有应收、应退及待核对金额",
    );
  } else if (action === "reconcile") {
    exact(d, [
      "expectedRowVersion",
      "sourceEntryId",
      "purpose",
      "quoteId",
      "assessmentId",
      "note",
    ]);
    const note = text(d.note, "note", 4000),
      source = state.entries.find((e) => e.id === d.sourceEntryId);
    assert(
      source && ["receipt", "refund"].includes(source.kind),
      "ENTRY_NOT_FOUND",
      "请选择本单真实收支流水",
      422,
    );
    const reversed = new Set(
      state.entries
        .filter((e) => e.kind === "reversal")
        .map((e) => e.reverses_entry_id),
    );
    assert(
      !reversed.has(source.id) &&
        !state.entries.some(
          (e) =>
            e.kind === "reconcile" &&
            !reversed.has(e.id) &&
            JSON.parse(e.details_json).sourceEntryId === source.id,
        ),
      "ALREADY_RECONCILED",
      "原记录已更正或核对",
    );
    assert(
      ["deposit", "compensation", "refund_only"].includes(d.purpose),
      "PURPOSE_REQUIRED",
      "请选择核对后的用途",
      422,
    );
    if (d.quoteId)
      assert(
        state.quotes.some((q) => q.id === d.quoteId),
        "QUOTE_NOT_FOUND",
        "报价不属于本单",
        422,
      );
    if (d.assessmentId)
      assert(
        state.assessments.some((a) => a.id === d.assessmentId),
        "ASSESSMENT_REQUIRED",
        "核定项目不属于本单",
        422,
      );
    if (source.kind === "receipt" && d.purpose === "deposit") {
      const quote = state.quotes.find((q) => q.id === d.quoteId);
      assert(
        quote &&
          JSON.parse(quote.quote_json).deposit.currency === source.currency,
        "QUOTE_NOT_FOUND",
        "请选择与实际到账币种一致的报价",
        422,
      );
    }
    if (source.kind === "receipt" && d.purpose === "compensation") {
      const assessment = state.assessments.find((a) => a.id === d.assessmentId);
      assert(
        assessment &&
          assessment.currency === source.currency &&
          BigInt(source.amount_minor) <=
            BigInt(state.projection.debts[assessment.id]),
        "ALLOCATION_EXCEEDS_DEBT",
        "核对款项须与应收币种一致且不得超过该项目未结应收",
        422,
      );
    }
    entry = {
      id: crypto.randomUUID(),
      request_id: r.id,
      kind: "reconcile",
      currency: source.currency,
      amount_minor: 0,
      occurred_at: iso(),
      recorded_at: iso(),
      actor_id: user.id,
      reference: null,
      quote_id: d.quoteId || null,
      assessment_id: d.assessmentId || null,
      details_json: JSON.stringify({
        sourceEntryId: source.id,
        purpose: d.purpose,
        note,
      }),
      reverses_entry_id: null,
      operation_id: operationId,
    };
    projection = project(
      [...state.entries, entry],
      state.assessments,
      state.quotes,
      state.currentQuote,
    );
    statements.push([
      "INSERT INTO sample_financial_entries(id,request_id,kind,currency,amount_minor,occurred_at,recorded_at,actor_id,reference,quote_id,assessment_id,details_json,reverses_entry_id,operation_id) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE $gate",
      Object.values(entry),
    ]);
  } else {
    exact(d, [
      "expectedRowVersion",
      "money",
      "occurredAt",
      "reference",
      "quoteId",
      "assessmentId",
      "purpose",
      "note",
      "exceptional",
      "reversesEntryId",
      "confirmedRecordingError",
    ]);
    const m = money(d.money, "money", action === "reversal"),
      occurred = at(d.occurredAt, "occurredAt", { past: true }),
      note = text(d.note, "note", 4000, action !== "reversal"),
      kind = {
        receipts: "receipt",
        refunds: "refund",
        settlements: "apply",
        reversal: "reversal",
      }[action];
    assert(kind, "NOT_FOUND", "财务操作不存在", 404);
    const details = {
      purpose: d.purpose || null,
      note,
      exceptional: d.exceptional === true,
    };
    assert(
      !d.exceptional || note,
      "REASON_REQUIRED",
      "异常事实须说明原因",
      422,
    );
    let quoteId = d.quoteId || null,
      assessmentId = d.assessmentId || null;
    if (quoteId)
      assert(
        state.quotes.some((q) => q.id === quoteId),
        "QUOTE_NOT_FOUND",
        "报价不属于本单",
        422,
      );
    if (kind === "receipt")
      assert(
        ["deposit", "compensation", "unmatched"].includes(d.purpose),
        "PURPOSE_REQUIRED",
        "请选择收款用途",
        422,
      );
    if (kind === "refund") {
      assert(
        d.exceptional === true ||
          [
            "completed",
            "cancelled",
            "rejected",
            "loss_pending",
            "loss_closed",
          ].includes(r.status),
        "REFUND_NOT_ALLOWED",
        "请先确认归还、取消或丢失结算",
      );
      assert(
        d.exceptional === true ||
          r.status !== "completed" ||
          current.progress?.inspectedAt,
        "INSPECTION_REQUIRED",
        "请先验收",
      );
      if (!d.exceptional)
        assert(
          BigInt(m.amountMinor) <=
            BigInt(state.projection.byCurrency[m.currency].balanceMinor),
          "REFUND_EXCEEDS_BALANCE",
          "退款超过账面可退金额",
          422,
        );
      if (current.progress?.returnedAt && !d.exceptional)
        assert(
          occurred >= current.progress.returnedAt,
          "INVALID_TIME",
          "退款不能早于归还",
          422,
        );
    }
    if (
      kind === "apply" ||
      (kind === "receipt" && d.purpose === "compensation")
    ) {
      const a = state.assessments.find((a) => a.id === assessmentId);
      assert(a, "ASSESSMENT_REQUIRED", "请选择本单核定项目", 422);
      const q = state.quotes.find((q) => q.id === quoteId),
        fx = q && JSON.parse(q.quote_json).fx;
      const target = convert(m.amountMinor, m.currency, a.currency, fx);
      details.targetMinor = target.toString();
      details.targetCurrency = a.currency;
      details.sourceMinor = m.amountMinor;
      if (m.currency !== a.currency) {
        const numerator =
            BigInt(m.amountMinor) *
            (m.currency === "USD" ? BigInt(fx.rateUnits) : 1000000n),
          denominator = m.currency === "USD" ? 1000000n : BigInt(fx.rateUnits);
        details.rounding = {
          numerator: (target * denominator - numerator).toString(),
          denominator: denominator.toString(),
          currency: a.currency,
        };
      }
      assert(
        target > 0n && target <= BigInt(state.projection.debts[a.id]),
        "ALLOCATION_EXCEEDS_DEBT",
        "抵扣或赔偿款超过未结应收",
        422,
      );
      if (kind === "receipt")
        assert(
          m.currency === a.currency,
          "FX_RECONCILIATION_REQUIRED",
          "跨币种到账先按原币登记待核对，再核对适用汇率",
          422,
        );
      if (kind === "apply")
        assert(
          BigInt(m.amountMinor) <=
            BigInt(state.projection.byCurrency[m.currency].balanceMinor) -
              BigInt(state.projection.byCurrency[m.currency].unallocatedMinor),
          "ALLOCATION_EXCEEDS_BALANCE",
          "可分配余额不足",
          422,
        );
    }
    const reference = ["receipt", "refund"].includes(kind)
      ? text(d.reference, "reference", 200)
      : null;
    if (kind === "reversal") {
      const old = state.entries.find((e) => e.id === d.reversesEntryId);
      assert(old, "ENTRY_NOT_FOUND", "原流水不属于本单", 422);
      assert(
        old.kind !== "reversal",
        "CORRECTION_DEPENDENCY",
        "冲销后请追加正确记录，不重复冲销更正事件",
        422,
      );
      assert(
        d.confirmedRecordingError === true,
        "BANK_FACT_REQUIRED",
        "仅可冲销已核对的录入错误，不能撤销真实银行交易",
        422,
      );
      assert(
        !state.entries.some((e) => e.reverses_entry_id === old.id),
        "ALREADY_REVERSED",
        "该流水已冲销",
      );
      assert(
        old.currency === m.currency &&
          String(old.amount_minor) === m.amountMinor,
        "REVERSAL_MISMATCH",
        "冲销须与原流水币种和金额一致",
        422,
      );
    }
    entry = {
      id: crypto.randomUUID(),
      request_id: r.id,
      kind,
      currency: m.currency,
      amount_minor: Number(m.amountMinor),
      occurred_at: occurred,
      recorded_at: iso(),
      actor_id: user.id,
      reference,
      quote_id: quoteId,
      assessment_id: assessmentId,
      details_json: JSON.stringify(details),
      reverses_entry_id: d.reversesEntryId || null,
      operation_id: operationId,
    };
    projection = project(
      [...state.entries, entry],
      state.assessments,
      state.quotes,
      state.currentQuote,
    );
    if (kind === "reversal")
      assert(
        Object.values(projection.debts).every(
          (amount) => BigInt(amount) >= 0n,
        ) &&
          Object.values(projection.byCurrency).every(
            (b) =>
              BigInt(b.balanceMinor) >= 0n && BigInt(b.outstandingMinor) >= 0n,
          ),
        "CORRECTION_DEPENDENCY",
        "原流水已有下游抵扣或退款，请先核对依赖",
      );
    statements.push([
      "INSERT INTO sample_financial_entries(id,request_id,kind,currency,amount_minor,occurred_at,recorded_at,actor_id,reference,quote_id,assessment_id,details_json,reverses_entry_id,operation_id) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE $gate",
      Object.values(entry),
    ]);
    if (kind === "reversal")
      statements.push([
        "UPDATE sample_financial_entries SET voided_by=? WHERE id=? AND $gate",
        [entry.id, entry.reverses_entry_id],
      ]);
  }
  statements.push(
    projectionStatement(r.id, projection),
    [
      "UPDATE sample_requests SET row_version=row_version+1,financial_closed_at=? WHERE id=? AND $gate",
      [action === "close" ? iso() : null, r.id],
    ],
    eventStatement(
      r.id,
      r.asset_id,
      user,
      "finance." + action,
      {
        entryId: entry?.id || null,
        assessmentId: assessment?.id || null,
        reason: d.reason || d.note || null,
      },
      entry?.occurred_at,
    ),
  );
  return mutation(env, request, user, {
    scope: "finance." + action,
    requestId: r.id,
    version: d.expectedRowVersion,
    data: d,
    statements,
    result: { id: r.id, entryId: entry?.id, assessmentId: assessment?.id },
  });
}
