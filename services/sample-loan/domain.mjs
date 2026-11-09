export const MODELS = Object.freeze({
  "rm01-t234-32g": "RM-01 32G T234 ( 275 TOPS )",
  "rm01-t234-64g": "RM-01 64G T234 ( 275 TOPS )",
  "rm01-t4000-64g": "RM-01 64G T4000 ( 1200 TFLOPS )",
  "rm01-t5000-128g": "RM-01 128G T5000 ( 2070 TFLOPS )",
});
export class LoanError extends Error {
  constructor(status, code, message, fieldErrors = {}) {
    super(message);
    Object.assign(this, { status, code, fieldErrors });
  }
}
export const fail = (status, code, message, fields) => {
  throw new LoanError(status, code, message, fields);
};
export function requireField(ok, path, message) {
  if (!ok) fail(422, "VALIDATION_FAILED", message, { [path]: message });
}
export const iso = () => new Date().toISOString();
export const assert = (ok, code, message, status = 409) => {
  if (!ok) fail(status, code, message);
};
export function exact(data, keys) {
  assert(
    data && typeof data === "object" && !Array.isArray(data),
    "INVALID_FIELDS",
    "请求格式不符",
    422,
  );
  for (const k of Object.keys(data))
    if (!keys.includes(k))
      fail(422, "INVALID_FIELDS", "请求包含不支持的字段", {
        [k]: "不支持此字段",
      });
}
export function text(v, path, max = 1000, optional = false, raw = false) {
  if (optional && (v === null || v === undefined || v === "")) return null;
  if (
    typeof v !== "string" ||
    !v.trim() ||
    v.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(v)
  )
    fail(422, "VALIDATION_FAILED", "请检查填写内容", {
      [path]: `请填写此项（最多${max}字）`,
    });
  return raw ? v : v.trim().replaceAll("\r\n", "\n");
}
export function integer(v, path, min = 1, max = Number.MAX_SAFE_INTEGER) {
  if (!Number.isSafeInteger(v) || v < min || v > max)
    fail(422, "VALIDATION_FAILED", "请检查数值", {
      [path]: "请填写允许范围内的整数",
    });
  return v;
}
export function money(v, path = "money", allowZero = true) {
  exact(v, ["currency", "amountMinor"]);
  if (
    !["CNY", "USD"].includes(v.currency) ||
    typeof v.amountMinor !== "string" ||
    !/^\d+$/.test(v.amountMinor) ||
    BigInt(v.amountMinor) > BigInt(Number.MAX_SAFE_INTEGER) ||
    (!allowZero && BigInt(v.amountMinor) === 0n)
  )
    fail(422, "VALIDATION_FAILED", "金额格式不符", {
      [path]: "请填写有效币种和金额",
    });
  return {
    currency: v.currency,
    amountMinor: BigInt(v.amountMinor).toString(),
  };
}
export function at(v, path = "occurredAt", { past = false } = {}) {
  if (
    typeof v !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(v) ||
    !Number.isFinite(Date.parse(v)) ||
    new Date(v).toISOString() !== v
  )
    fail(422, "VALIDATION_FAILED", "时间格式不符", {
      [path]: "请填写有效时间",
    });
  if (past && Date.parse(v) > Date.now())
    fail(422, "VALIDATION_FAILED", "实际时间不能晚于现在", {
      [path]: "请核对实际时间",
    });
  return v;
}
export function date(v, path = "date") {
  if (
    typeof v !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(v) ||
    !Number.isFinite(Date.parse(v + "T00:00:00Z")) ||
    new Date(v + "T00:00:00Z").toISOString().slice(0, 10) !== v
  )
    fail(422, "VALIDATION_FAILED", "日期格式不符", {
      [path]: "请填写有效日期",
    });
  return v;
}
export const beijingDay = (v) =>
  new Date(Date.parse(v) + 28800000).toISOString().slice(0, 10);
export const endOfDay = (v) =>
  new Date(date(v) + "T23:59:59+08:00").toISOString();
export const termDays = (start, end) =>
  Math.round(
    (Date.parse(beijingDay(end)) - Date.parse(beijingDay(start))) / 86400000,
  ) + 1;
export function code(v, path) {
  const display = text(v, path, 200);
  assert(
    !/[\r\n\t]/.test(display),
    "VALIDATION_FAILED",
    "编号不能包含控制字符",
    422,
  );
  return { display, key: display.normalize("NFC").toUpperCase() };
}
export function applicant(d) {
  exact(d, [
    "type",
    "name",
    "contactName",
    "phone",
    "email",
    "creditCode",
    "registeredAddress",
    "contactAddress",
  ]);
  assert(
    ["company", "person"].includes(d.type),
    "VALIDATION_FAILED",
    "请选择主体类型",
    422,
  );
  const result = { type: d.type };
  for (const [key, max] of [
    ["name", 200],
    ["contactName", 100],
    ["phone", 64],
    ["email", 254],
    ["contactAddress", 1000],
  ])
    result[key] = text(d[key], "applicant." + key, max);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email))
    fail(422, "VALIDATION_FAILED", "邮箱格式不正确", {
      "applicant.email": "请填写有效的邮箱地址",
    });
  result.creditCode = text(
    d.creditCode,
    "applicant.creditCode",
    64,
    d.type === "person",
  );
  result.registeredAddress = text(
    d.registeredAddress,
    "applicant.registeredAddress",
    1000,
    d.type === "person",
  );
  if (d.type === "person")
    assert(
      !result.creditCode && !result.registeredAddress,
      "VALIDATION_FAILED",
      "个人申请无需企业字段",
      422,
    );
  return result;
}
export function shipping(d) {
  exact(d, ["recipientName", "recipientPhone", "address"]);
  return Object.fromEntries(
    [
      ["recipientName", 100],
      ["recipientPhone", 64],
      ["address", 1000],
    ].map(([k, n]) => [k, text(d[k], "shipping." + k, n)]),
  );
}
export function application(d) {
  exact(d, [
    "applicant",
    "shipping",
    "modelKey",
    "requestedDays",
    "consent",
    "device",
  ]);
  assert(
    typeof d.modelKey === "string" && Object.hasOwn(MODELS, d.modelKey),
    "VALIDATION_FAILED",
    "请选择申请型号",
    422,
  );
  exact(d.consent, [
    "termsVersion",
    "noticeVersion",
    "accepted",
    "noStockShown",
    "language",
  ]);
  assert(
    d.consent.accepted === true,
    "CONSENT_REQUIRED",
    "请确认协议与责任提示",
    422,
  );
  if (d.consent.noStockShown !== undefined)
    assert(
      typeof d.consent.noStockShown === "boolean",
      "VALIDATION_FAILED",
      "库存提示确认值不符",
      422,
    );
  if (d.consent.language !== undefined)
    assert(
      ["zh", "en", "ja", "ko", "es", "fr"].includes(d.consent.language),
      "INVALID_LANGUAGE",
      "界面语言不符",
      422,
    );
  const device = d.device ? text(d.device, "device", 1000) : null;
  return {
    applicant: applicant(d.applicant),
    shipping: shipping(d.shipping),
    modelKey: d.modelKey,
    requestedDays: integer(d.requestedDays, "requestedDays", 1, 30),
    consent: d.consent,
    device,
  };
}
export function quote(input) {
  exact(input, ["deposit", "fx"]);
  exact(input.deposit, ["currency", "amountMinor"]);
  const currency = input.deposit?.currency;
  assert(
    ["CNY", "USD"].includes(currency),
    "VALIDATION_FAILED",
    "请选择押金币种",
    422,
  );
  if (currency === "CNY")
    return { deposit: { currency, amountMinor: "3000000" }, fx: null };
  const f = input.fx;
  exact(f, ["rateUnits", "rateScale", "publishedAt", "source"]);
  assert(
    typeof f.rateUnits === "string" &&
      /^\d+$/.test(f.rateUnits) &&
      BigInt(f.rateUnits) > 0n &&
      BigInt(f.rateUnits) <= BigInt(Number.MAX_SAFE_INTEGER) &&
      f.rateScale === 10000,
    "VALIDATION_FAILED",
    "牌价须为四位精度正数",
    422,
  );
  const publishedAt = at(f.publishedAt, "quote.fx.publishedAt", { past: true });
  assert(
    f.source === "中国银行美元现汇买入价",
    "VALIDATION_FAILED",
    "请使用约定牌价来源",
    422,
  );
  const n = BigInt(f.rateUnits),
    amount = (3000000000000n + n - 1n) / n;
  return {
    deposit: money({ currency, amountMinor: amount.toString() }),
    fx: { ...f, rateUnits: BigInt(f.rateUnits).toString(), publishedAt },
  };
}
export function approval(d) {
  exact(d, [
    "applicant",
    "shipping",
    "modelKey",
    "identity",
    "schedule",
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
  ]);
  const result = structuredClone(d);
  result.applicant = applicant(d.applicant);
  result.shipping = shipping(d.shipping);
  assert(
    typeof d.modelKey === "string" && Object.hasOwn(MODELS, d.modelKey),
    "VALIDATION_FAILED",
    "型号不存在",
    422,
  );
  exact(d.identity, ["notes", "verified"]);
  result.identity = {
    notes: text(d.identity.notes, "identity.notes", 4000),
    verified: d.identity.verified,
  };
  requireField(d.identity.verified === true, "identity.verified", "请勾选此项");
  exact(d.schedule, ["startsAt", "dueAt"]);
  at(d.schedule.startsAt, "schedule.startsAt");
  at(d.schedule.dueAt, "schedule.dueAt");
  requireField(
    d.schedule.dueAt > d.schedule.startsAt &&
      d.schedule.dueAt === endOfDay(beijingDay(d.schedule.dueAt)),
    "schedule.dueAt",
    "归还截止须晚于起始时间，并为北京时间当日23:59:59",
  );
  result.quote = quote(d.quote);
  exact(d.payment, ["expectedPayer", "thirdPartyNotes"]);
  result.payment = {
    expectedPayer: text(d.payment.expectedPayer, "payment.expectedPayer", 200),
    thirdPartyNotes: text(
      d.payment.thirdPartyNotes,
      "payment.thirdPartyNotes",
      4000,
      d.payment.expectedPayer === result.applicant.name,
    ),
  };
  exact(d.billingBasis, ["value"]);
  result.billingBasis = {
    value: money(d.billingBasis.value, "billingBasis.value", false),
  };
  exact(d.equipment, [
    "card",
    "defaultAccountInfo",
    "accessories",
    "outboundInspection",
  ]);
  exact(d.equipment.card, ["specification", "serial"]);
  result.equipment = {
    card: {
      specification: text(
        d.equipment.card.specification,
        "equipment.card.specification",
        4000,
      ),
      serial: text(d.equipment.card.serial, "equipment.card.serial", 200),
    },
    defaultAccountInfo: text(
      d.equipment.defaultAccountInfo,
      "equipment.defaultAccountInfo",
      8000,
      true,
      true,
    ),
    accessories: text(d.equipment.accessories, "equipment.accessories", 8000),
    outboundInspection: text(
      d.equipment.outboundInspection,
      "equipment.outboundInspection",
      8000,
    ),
  };
  exact(d.outbound, [
    "carrier",
    "trackingNumber",
    "insuranceReference",
    "inspectedAt",
  ]);
  result.outbound = {};
  for (const [k, n] of [
    ["carrier", 100],
    ["trackingNumber", 200],
    ["insuranceReference", 1000],
  ])
    result.outbound[k] = text(d.outbound[k], "outbound." + k, n, true);
  result.outbound.inspectedAt = d.outbound.inspectedAt
    ? at(d.outbound.inspectedAt, "outbound.inspectedAt", { past: true })
    : null;
  for (const [group, fields] of Object.entries({
    returnTo: { recipientName: 100, phone: 64, address: 1000 },
    lender: {
      name: 200,
      representative: 100,
      phone: 64,
      email: 254,
      address: 1000,
    },
  })) {
    exact(d[group], Object.keys(fields));
    result[group] = Object.fromEntries(
      Object.entries(fields).map(([k, n]) => [
        k,
        text(d[group][k], group + "." + k, n, k === "representative"),
      ]),
    );
  }
  assert(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.lender.email),
    "VALIDATION_FAILED",
    "请核对出借方邮箱",
    422,
  );
  result.agreementDate = date(d.agreementDate, "agreementDate");
  exact(d.approval, ["note"]);
  result.approval = {
    note: text(d.approval.note, "approval.note", 4000, true),
  };
  exact(d.attachments, ["note"]);
  result.attachments = {
    note: text(d.attachments.note, "attachments.note", 4000, true),
  };
  return result;
}
export const canonical = (v) =>
  v === null || typeof v !== "object"
    ? JSON.stringify(v)
    : Array.isArray(v)
      ? "[" + v.map(canonical).join(",") + "]"
      : "{" +
        Object.keys(v)
          .sort()
          .map((k) => JSON.stringify(k) + ":" + canonical(v[k]))
          .join(",") +
        "}";
export const moneyDisplay = (m) =>
  `${BigInt(m.amountMinor) / 100n}.${(BigInt(m.amountMinor) % 100n).toString().padStart(2, "0")} ${m.currency}`;
export function convert(amount, source, target, fx) {
  if (source === target) return BigInt(amount);
  assert(fx, "FX_RECONCILIATION_REQUIRED", "缺少适用冻结汇率", 422);
  const n =
      BigInt(amount) * (source === "USD" ? BigInt(fx.rateUnits) : 1000000n),
    den = source === "USD" ? 1000000n : BigInt(fx.rateUnits);
  return (n + den / 2n) / den;
}
export function partialDraft(d, fieldMap) {
  const paths = new Set(
    Object.values(fieldMap).filter(
      (p) =>
        !p.startsWith("assetSnapshot.") &&
        p !== "insuredValue" &&
        p !== "quote.deposit.amountMinor",
    ),
  );
  paths.add("quote.fx.source");
  paths.add("quote.fx.rateScale");
  const visit = (value, path = "") => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      assert(
        !path || [...paths].some((p) => p.startsWith(path + ".")),
        "INVALID_FIELDS",
        "草稿包含未知字段",
        422,
      );
      for (const [k, v] of Object.entries(value))
        visit(v, path ? path + "." + k : k);
      return;
    }
    if (path === "quote.fx" && value === null) return;
    assert(paths.has(path), "INVALID_FIELDS", "草稿包含未知或只读字段", 422);
    if (value === null) return;
    if (path === "identity.verified")
      assert(
        typeof value === "boolean",
        "VALIDATION_FAILED",
        "核验结果必须为布尔值",
        422,
      );
    else if (path === "quote.fx.rateScale")
      assert(value === 10000, "VALIDATION_FAILED", "牌价精度应为10000", 422);
    else if (path === "modelKey")
      assert(
        typeof value === "string" && Object.hasOwn(MODELS, value),
        "VALIDATION_FAILED",
        "请选择固定型号",
        422,
      );
    else if (path === "applicant.type")
      assert(
        ["person", "company"].includes(value),
        "VALIDATION_FAILED",
        "主体类型不符",
        422,
      );
    else if (path.endsWith(".currency"))
      assert(
        ["CNY", "USD"].includes(value),
        "VALIDATION_FAILED",
        "币种不符",
        422,
      );
    else if (path.endsWith(".amountMinor") || path === "quote.fx.rateUnits")
      assert(
        typeof value === "string" &&
          /^\d+$/.test(value) &&
          BigInt(value) <= BigInt(Number.MAX_SAFE_INTEGER),
        "VALIDATION_FAILED",
        "请填写有效最小单位金额或牌价",
        422,
      );
    else if (
      [
        "schedule.startsAt",
        "schedule.dueAt",
        "quote.fx.publishedAt",
        "outbound.inspectedAt",
      ].includes(path)
    )
      at(value, path);
    else
      assert(
        typeof value === "string" &&
          value.length <= 8000 &&
          !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value),
        "VALIDATION_FAILED",
        "草稿字段格式或长度不符",
        422,
      );
  };
  exact(d, [...new Set([...paths].map((p) => p.split(".")[0]))]);
  visit(d);
  return d;
}
