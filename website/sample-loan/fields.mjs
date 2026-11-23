export const MODELS = {
  "rm01-t234-32g": "RM-01 32G T234 ( 275 TOPS )",
  "rm01-t234-64g": "RM-01 64G T234 ( 275 TOPS )",
  "rm01-t4000-64g": "RM-01 64G T4000 ( 1200 TFLOPS )",
  "rm01-t5000-128g": "RM-01 128G T5000 ( 2070 TFLOPS )",
};
export const modelKey = (name) =>
  Object.keys(MODELS).find((k) => MODELS[k] === name) || name;
export const pathGet = (obj, path) =>
  path.split(".").reduce((v, k) => v?.[k], obj);
export const fields = {
  company: "applicant.name",
  entity: "applicant.type",
  credit: "applicant.creditCode",
  contact: "applicant.contactName",
  phone: "applicant.phone",
  email: "applicant.email",
  registeredAddress: "applicant.registeredAddress",
  companyAddress: "applicant.contactAddress",
  receiver: "shipping.recipientName",
  receiverPhone: "shipping.recipientPhone",
  shippingAddress: "shipping.address",
  identityNotes: "identity.notes",
  identityVerified: "identity.verified",
  start: "schedule.startsAt",
  end: "schedule.dueAt",
  approvalNote: "approval.note",
  depositCurrency: "quote.deposit.currency",
  depositAmount: "quote.deposit.amountMinor",
  fxRate: "quote.fx.rateUnits",
  fxAt: "quote.fx.publishedAt",
  payer: "payment.expectedPayer",
  payerNotes: "payment.thirdPartyNotes",
  model: "modelKey",
  sn: "assetSnapshot.sn",
  no: "assetSnapshot.no",
  value: "billingBasis.value.amountMinor",
  currency: "billingBasis.value.currency",
  cardSpecs: "equipment.card.specification",
  cardSerial: "equipment.card.serial",
  defaultAccountInfo: "equipment.defaultAccountInfo",
  accessories: "equipment.accessories",
  inspection: "equipment.outboundInspection",
  carrier: "outbound.carrier",
  tracking: "outbound.trackingNumber",
  insuredValue: "insuredValue",
  insuranceProof: "outbound.insuranceReference",
  returnName: "returnTo.recipientName",
  returnPhone: "returnTo.phone",
  returnAddress: "returnTo.address",
  lender: "lender.name",
  lenderRepresentative: "lender.representative",
  lenderPhone: "lender.phone",
  lenderEmail: "lender.email",
  lenderAddress: "lender.address",
  agreementDate: "agreementDate",
  inspectionTime: "outbound.inspectedAt",
  attachmentNotes: "attachments.note",
};
export const localInput = (utc) =>
  utc ? new Date(Date.parse(utc) + 28800000).toISOString().slice(0, 19) : "";
export function inputUtc(v) {
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) v += "T23:59:59";
  const ms = Date.parse(v + "+08:00");
  return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}
function inputError(path, message) {
  const e = new Error(message);
  e.fieldErrors = { [path]: message };
  throw e;
}
export function fxUnits(value) {
  if (!/^\d+(?:\.\d{1,4})?$/.test(value))
    inputError("quote.fx.rateUnits", "汇率须使用普通十进制数字，最多四位小数");
  const [a, b = ""] = value.split(".");
  return (BigInt(a) * 10000n + BigInt(b.padEnd(4, "0"))).toString();
}
export function minor(value, path = "money") {
  if (!/^\d+(?:\.\d{1,2})?$/.test(String(value)))
    inputError(path, "金额须使用普通十进制数字，最多两位小数");
  const [a, b = ""] = String(value).split(".");
  return (BigInt(a) * 100n + BigInt(b.padEnd(2, "0"))).toString();
}
export function depositOutstandingMinor(deposit, finance) {
  if (!deposit) return 0n;
  const due = BigInt(deposit.amountMinor);
  if (!finance) return due;
  const account = finance.byCurrency[deposit.currency];
  const matched = BigInt(finance.depositMatchedMinor);
  const available = BigInt(account.balanceMinor) - BigInt(account.unallocatedMinor);
  const held = matched < available ? matched : available;
  return held <= 0n ? due : held >= due ? 0n : due - held;
}
export function major(v) {
  const raw = BigInt(v),
    n = raw < 0n ? -raw : raw;
  return (
    (raw < 0n ? "-" : "") +
    n / 100n +
    "." +
    (n % 100n).toString().padStart(2, "0")
  );
}
export function flat(d = {}) {
  const out = {};
  for (const [field, path] of Object.entries(fields))
    out[field] = pathGet(d, path) ?? "";
  out.entity = d.applicant?.type === "person" ? "个人" : "公司";
  out.model = MODELS[d.modelKey] || d.modelKey || "";
  out.identityVerified = d.identity?.verified ? "yes" : "";
  for (const k of ["start", "fxAt", "inspectionTime"])
    out[k] = localInput(out[k]);
  out.end = localInput(out.end).slice(0, 10);
  for (const k of ["value", "depositAmount"])
    out[k] = out[k] !== "" ? major(out[k]) : "";
  out.fxRate =
    d.quote?.fx?.rateUnits != null
      ? BigInt(d.quote.fx.rateUnits) / 10000n +
        "." +
        (BigInt(d.quote.fx.rateUnits) % 10000n).toString().padStart(4, "0")
      : "";
  out.insuredValue =
    d.billingBasis?.value?.amountMinor != null
      ? major(d.billingBasis.value.amountMinor) +
        " " +
        d.billingBasis.value.currency
      : "";
  return out;
}
export function applicationDTO(f, consent) {
  return {
    applicant: {
      type: f.entity === "个人" ? "person" : "company",
      name: f.company,
      contactName: f.contact,
      phone: f.phone,
      email: f.email,
      creditCode: f.entity === "公司" ? f.credit || null : null,
      registeredAddress: f.entity === "公司" ? f.registeredAddress : null,
      contactAddress: f.companyAddress,
    },
    shipping: {
      recipientName: f.receiver,
      recipientPhone: f.receiverPhone,
      address: f.shippingAddress,
    },
    modelKey: modelKey(f.model),
    requestedDays: Number(f.days),
    consent,
    device: navigator.userAgentData?.platform || navigator.platform || null,
  };
}
export function approvalDTO(f) {
  const app = applicationDTO(f, null);
  const fx =
    f.depositCurrency === "USD"
      ? {
          rateUnits: fxUnits(f.fxRate),
          rateScale: 10000,
          publishedAt: inputUtc(f.fxAt),
          source: "中国银行美元现汇买入价",
        }
      : null;
  return {
    applicant: app.applicant,
    shipping: app.shipping,
    modelKey: app.modelKey,
    identity: {
      notes: f.identityNotes,
      verified: f.identityVerified === "yes",
    },
    schedule: { startsAt: inputUtc(f.start), dueAt: inputUtc(f.end) },
    quote: { deposit: { currency: f.depositCurrency }, fx },
    payment: { expectedPayer: f.payer, thirdPartyNotes: f.payerNotes || null },
    billingBasis: {
      value: {
        currency: f.currency,
        amountMinor: minor(f.value, "billingBasis.value"),
      },
    },
    equipment: {
      card: { specification: f.cardSpecs, serial: f.cardSerial },
      defaultAccountInfo: f.defaultAccountInfo || null,
      accessories: f.accessories,
      outboundInspection: f.inspection,
    },
    outbound: {
      carrier: f.carrier || null,
      trackingNumber: f.tracking || null,
      insuranceReference: f.insuranceProof || null,
      inspectedAt: inputUtc(f.inspectionTime),
    },
    returnTo: {
      recipientName: f.returnName,
      phone: f.returnPhone,
      address: f.returnAddress,
    },
    lender: {
      name: f.lender,
      representative: f.lenderRepresentative || null,
      phone: f.lenderPhone,
      email: f.lenderEmail,
      address: f.lenderAddress,
    },
    agreementDate: f.agreementDate,
    approval: { note: f.approvalNote || null },
    attachments: { note: f.attachmentNotes || null },
  };
}
// Drafts use the same nested DTO, with null for unfinished scalar values.
export function draftDTO(f) {
  const d = approvalDTO({
    ...f,
    value: f.value || "0",
    fxRate: f.fxRate || "0",
  });
  if (!f.value) d.billingBasis.value.amountMinor = null;
  if (d.quote.fx && !f.fxRate) d.quote.fx.rateUnits = null;
  d.modelKey = modelKey(f.model) || null;
  return d;
}
