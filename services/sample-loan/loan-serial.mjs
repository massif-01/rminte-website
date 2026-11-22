import { code, fail } from "./domain.mjs";
import { mutation, rows } from "./store.mjs";
import { open } from "./vault.mjs";

const openLoans = `SELECT r.id, r.current_agreement_revision AS revision
  FROM sample_requests r
  WHERE r.id<>? AND (r.status='approved' OR (
    r.status IN ('loss_pending','loss_closed') AND EXISTS (
      SELECT 1 FROM sample_losses l WHERE l.request_id=r.id AND l.recovered_at IS NULL
    )
  ))`;

async function checkedRevisions(env, requestId, snKey) {
  const loans = await rows(env, `SELECT loan.id, loan.revision, v.snapshot_cipher
    FROM (${openLoans}) loan JOIN sample_agreement_versions v
    ON v.request_id=loan.id AND v.revision_no=loan.revision`, [requestId]);
  const revisions = [];
  for (const loan of loans) {
    const context = loan.id + ":" + loan.revision;
    const snapshot = await open(env.SAMPLE_SECRET, context, loan.snapshot_cipher);
    if (code(snapshot.assetSnapshot.sn, "sn").key === snKey) {
      const message = "该 SN 已用于另一份尚未归还的借用单，请核对序列号";
      fail(409, "SN_ALREADY_ON_LOAN", message, { "assetSnapshot.sn": message });
    }
    revisions.push(context);
  }
  return revisions;
}

export async function loanMutation(env, request, user, options, sn) {
  if (sn === undefined) return mutation(env, request, user, options);

  const snKey = code(sn, "sn").key;
  let verified = await checkedRevisions(env, options.requestId, snKey);
  const write = () => mutation(env, request, user, {
    ...options,
    // The SN lives in the encrypted agreement. Commit against the revisions just checked.
    condition: `(${options.condition}) AND NOT EXISTS (
      SELECT 1 FROM (${openLoans}) loan
      WHERE loan.id || ':' || loan.revision NOT IN (SELECT value FROM json_each(?))
    )`,
    conditionValues: [...options.conditionValues, options.requestId, JSON.stringify(verified)],
  });
  try {
    return await write();
  } catch (error) {
    if (error.code !== "VERSION_CONFLICT") throw error;
    const current = await checkedRevisions(env, options.requestId, snKey);
    const previous = new Set(verified);
    if (current.every((revision) => previous.has(revision))) throw error;
    verified = current;
  }
  try {
    return await write();
  } catch (error) {
    if (error.code === "VERSION_CONFLICT") await checkedRevisions(env, options.requestId, snKey);
    throw error;
  }
}
