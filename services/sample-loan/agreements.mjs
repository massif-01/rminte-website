import {
  approval,
  assert,
  iso,
  text,
  canonical,
  moneyDisplay,
  MODELS,
} from "./domain.mjs";
import { seal } from "./vault.mjs";
import { emailLanguage } from "../../website/sample-loan/email.mjs";
import { rows, first, eventStatement } from "./store.mjs";
import { digest } from "../case-access/crypto.mjs";
import terms from "./terms.json" with { type: "json" };
export const NOTICE_VERSION = "RM01-LOAN-NOTICE-r5";
import notices from "./notices.json" with { type: "json" };
export const NOTICE = Object.freeze(notices.items);
export async function canonicalTerms() {
  return {
    ...terms,
    noticeVersion: NOTICE_VERSION,
    notices: NOTICE,
    noticeHtml: notices.html,
    noticeLocales: notices.locales,
    sha256: await digest(
      canonical({
        ...terms,
        noticeVersion: NOTICE_VERSION,
        notices: NOTICE,
        noticeHtml: notices.html,
        noticeLocales: notices.locales,
      }),
    ),
  };
}
export async function versionStatements(
  env,
  user,
  r,
  raw,
  {
    kind = "approve",
    reason = "首次批复",
    asset,
    fileIds = [],
    audit = {},
  } = {},
) {
  const d = approval(raw);
  assert(
    d.modelKey === r.model_key,
    "MODEL_MISMATCH",
    "出借型号必须与原申请一致",
    422,
  );
  assert(
    asset && asset.model_key === r.model_key,
    "ASSET_MISMATCH",
    "请从台账选择型号一致的样机",
    422,
  );
  assert(
    Array.isArray(fileIds) &&
      fileIds.length === new Set(fileIds).size &&
      fileIds.every((id) => typeof id === "string"),
    "INVALID_FILES",
    "附件清单格式不符",
    422,
  );
  const files = await rows(
    env,
    "SELECT id,status FROM sample_files WHERE request_id=?",
    [r.id],
  );
  assert(
    fileIds.every((id) =>
      files.some(
        (f) => f.id === id && ["uploaded", "ready"].includes(f.status),
      ),
    ),
    "FILE_NOT_READY",
    "附件未上传完成或不属于本申请",
    422,
  );
  const rev = r.current_agreement_revision + 1,
    now = iso(),
    consent = JSON.parse(r.consent_json),
    quoteId = crypto.randomUUID();
  const snapshot = {
    ...d,
    assetSnapshot: {
      id: asset.id,
      no: asset.no,
      sn: asset.sn,
      modelKey: asset.model_key,
    },
    insuredValue: d.billingBasis.value,
    publicNo: r.public_no,
    requestedDays: r.requested_days,
    submittedAt: r.submitted_at,
    approvedAt: now,
    approvedBy: user.username,
    termsVersion: consent.termsVersion,
    agreementRevision: rev,
    agreementLanguage: consent.agreementLanguage || "zh",
    fileIds,
  };
  if (rev > 1) {
    const decision = await first(
      env,
      "SELECT d.recorded_at,u.username FROM sample_decisions d JOIN users u ON u.id=d.actor_id WHERE d.request_id=?",
      [r.id],
    );
    snapshot.approvedAt = decision.recorded_at;
    snapshot.approvedBy = decision.username;
  }
  const prevQuotes = await rows(
    env,
    "SELECT * FROM sample_quotes WHERE request_id=? ORDER BY quote_revision",
    [r.id],
  );
  const same =
    prevQuotes.at(-1) &&
    canonical(JSON.parse(prevQuotes.at(-1).quote_json)) === canonical(d.quote);
  snapshot.quoteId = same ? prevQuotes.at(-1).id : quoteId;
  const statements = [
    [
      "INSERT INTO sample_agreement_versions(request_id,revision_no,terms_version,snapshot_cipher,reason,kind,created_by,created_at) SELECT ?,?,?,?,?,?,?,? WHERE $gate",
      [
        r.id,
        rev,
        consent.termsVersion,
        await seal(env.SAMPLE_SECRET, r.id + ":" + rev, snapshot),
        text(reason, "reason", 4000),
        kind,
        user.id,
        now,
      ],
    ],
    [
      "UPDATE sample_requests SET row_version=row_version+1,draft_cipher=?,current_agreement_revision=?,effective_start_at=?,effective_due_at=?,search_text=?,display_name=? WHERE id=? AND $gate",
      [
        await seal(env.SAMPLE_SECRET, r.id + ":draft", d),
        rev,
        d.schedule.startsAt,
        d.schedule.dueAt,
        (r.public_no + " " + d.applicant.name).toLowerCase(),
        d.applicant.name,
        r.id,
      ],
    ],
    [
      "INSERT INTO sample_jobs(id,request_id,revision_no,next_attempt_at,created_at) SELECT ?,?,?,?,? WHERE $gate",
      [crypto.randomUUID(), r.id, rev, now, now],
    ],
    eventStatement(r.id, asset.id, user, "agreement." + kind, {
      revision: rev,
      reason,
      ...audit,
    }),
  ];
  if (!same)
    statements.push([
      "INSERT INTO sample_quotes(id,request_id,quote_revision,quote_json,recorded_at,operation_id) SELECT ?,?,?,?,?,? WHERE $gate",
      [
        quoteId,
        r.id,
        prevQuotes.length + 1,
        JSON.stringify(d.quote),
        now,
        "$operation",
      ],
    ]);
  for (const [i, id] of fileIds.entries())
    statements.push([
      "INSERT INTO sample_version_files(request_id,revision_no,file_id,position) SELECT ?,?,?,? WHERE $gate",
      [r.id, rev, id, i],
    ]);
  return { d, rev, snapshot, statements };
}
function confirmationMailZh(snapshot, settings, document) {
  const d = snapshot,
    lines = [
      `${d.applicant.name}，您好：`,
      "",
      `您的样机借用申请已批复，请查收随信附件《RM-01 产品借用协议》（${d.publicNo}，R${d.agreementRevision}）。`,
      "",
      `申请编号：${d.publicNo}`,
      `机器型号：${MODELS[d.assetSnapshot.modelKey]}`,
      `NO：${d.assetSnapshot.no}`,
      `SN：${d.assetSnapshot.sn}`,
      `整机价值：${moneyDisplay(d.billingBasis.value)}`,
      `借用起始：${timePair(d.schedule.startsAt)}`,
      `归还截止：${timePair(d.schedule.dueAt)}`,
      `押金：${moneyDisplay(d.quote.deposit)}`,
    ];
  if (d.quote.fx)
    lines.push(
      `牌价来源：${d.quote.fx.source}；每100美元折合人民币 ${(Number(d.quote.fx.rateUnits) / 10000).toFixed(4)}；发布时间 ${timePair(d.quote.fx.publishedAt)}`,
    );
  lines.push(
    "",
    "请在本确认邮件送达后24小时内汇出押金，实际足额到账且完成主体授权核验后发货。",
    `收款信息：\n${settings.bankAccounts[d.quote.deposit.currency]}`,
    `汇款备注：${d.applicant.name}＋样机借用押金＋${d.publicNo}`,
    "",
    "厂家发出运费到付并足额保价；寄回须自行支付运费及保价费，并按协议整机价值足额保价。借期包含往返运输，到期前必须实际送达厂家。",
    `寄出物流：${d.outbound.carrier || "发货前补充"} / ${d.outbound.trackingNumber || "发货前补充"}`,
    `归还收件：${d.returnTo.recipientName} / ${d.returnTo.phone}`,
    `归还地址：${d.returnTo.address}`,
    "",
    "请在协议邮件送达后48小时内从申请邮箱回邮知悉。修改过默认账户信息或密码的，归还前须恢复交付初始状态。完整责任和费用以附件协议为准。",
    `附件：${document.fileName}`,
    `SHA-256：${document.sha256}`,
    "",
    d.lender.name,
    d.lender.phone,
    d.lender.email,
  );
  return {
    recipient: d.applicant.email,
    subject: `【RMinte 样机借用批复】${d.publicNo} · 协议 R${d.agreementRevision}`,
    body: lines.join("\n"),
    templateRevision: settings.templateRevision,
  };
}
function confirmationMailEn(d, settings, document) {
  const lines = [
    `Dear ${d.applicant.name},`,
    "",
    `Your demo unit loan application has been approved. Please find the RM-01 Equipment Loan Agreement attached (${d.publicNo}, R${d.agreementRevision}).`,
    "",
    `Application number: ${d.publicNo}`,
    `Equipment model: ${MODELS[d.assetSnapshot.modelKey]}`,
    `NO: ${d.assetSnapshot.no}`,
    `SN: ${d.assetSnapshot.sn}`,
    `Equipment value: ${moneyDisplay(d.billingBasis.value)}`,
    `Loan start: ${timePair(d.schedule.startsAt)}`,
    `Return deadline: ${timePair(d.schedule.dueAt)}`,
    `Security deposit: ${moneyDisplay(d.quote.deposit)}`,
  ];
  if (d.quote.fx)
    lines.push(
      `Exchange-rate source: Bank of China USD foreign-exchange buying rate; CNY per USD 100: ${(Number(d.quote.fx.rateUnits) / 10000).toFixed(4)}; published: ${timePair(d.quote.fx.publishedAt)}`,
    );
  lines.push(
    "",
    "Please remit the security deposit within 24 hours after delivery of this confirmation email. Shipment requires receipt of the full deposit and verification of the borrower's identity and authority.",
    `Bank details:\n${settings.bankAccounts[d.quote.deposit.currency]}`,
    `Payment reference: ${d.applicant.name} + demo unit security deposit + ${d.publicNo}`,
    "",
    "Outbound freight is payable on delivery and the equipment is shipped with full declared-value coverage. You pay return freight and declared-value coverage based on the equipment value in the agreement. The loan period includes transport in both directions; the equipment must arrive at the manufacturer before the deadline.",
    `Outbound carrier / tracking: ${d.outbound.carrier || "To be added before shipment"} / ${d.outbound.trackingNumber || "To be added before shipment"}`,
    `Return recipient / telephone: ${d.returnTo.recipientName} / ${d.returnTo.phone}`,
    `Return address: ${d.returnTo.address}`,
    "",
    "Please acknowledge receipt by replying from the application email address within 48 hours after delivery of the agreement email. If you change the default equipment account or password, restore the initial delivery settings before returning it. The attached agreement governs the full responsibilities and charges.",
    `Attachment: ${document.fileName}`,
    `SHA-256: ${document.sha256}`,
    "",
    d.lender.name,
    d.lender.phone,
    d.lender.email,
  );
  return {
    subject: `[RMinte] Demo unit loan approval — ${d.publicNo} · Agreement R${d.agreementRevision}`,
    body: lines.join("\n"),
  };
}
export function confirmationMail(
  snapshot,
  settings,
  document,
  language = snapshot.agreementLanguage || "zh",
) {
  const chinese = confirmationMailZh(snapshot, settings, document);
  const translations = {
    zh: { subject: chinese.subject, body: chinese.body },
    en: confirmationMailEn(snapshot, settings, document),
  };
  language = emailLanguage(language);
  return { ...chinese, ...translations[language], language, translations };
}
export function timePair(v) {
  return (
    new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Shanghai",
      dateStyle: "short",
      timeStyle: "medium",
      hour12: false,
    }).format(new Date(v)) +
    " UTC+08:00 / " +
    v
  );
}
export { terms };
