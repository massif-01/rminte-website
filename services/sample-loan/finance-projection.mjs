import { assert } from "./domain.mjs";

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
      if (
        d.purpose === "deposit" &&
        !d.exceptional &&
        quote?.deposit.currency === e.currency
      ) {
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
