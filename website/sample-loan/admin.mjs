import { createUI } from "./ui.mjs";
import { emailLanguage, latestRejectionReason, rejectionEmail } from "./email.mjs";
import { copyEmailText } from "./clipboard.mjs";
import { api, retryableCommand } from "./client.mjs";
import {
  MODELS as MODEL_MAP,
  modelKey,
  flat,
  fields,
  approvalDTO,
  draftDTO,
  inputUtc,
  major,
  minor,
  fxUnits,
  localInput,
} from "./fields.mjs";
import { renderContract, escapeHtml } from "./contract.mjs";
import { openApplication } from "./application.mjs?v=sample-3";
const {
  $,
  $$,
  validateForm,
  refreshSelects,
  installSelects,
  showDialog,
  wireDialogs,
  serverErrors,
} = createUI();
const MODELS = Object.values(MODEL_MAP),
  form = $("#approval-form");
const state = {
  requests: [],
  counts: {},
  cursor: null,
  filter: "pending",
  sort: "latest",
  role: "user",
  current: null,
  user: null,
  toastTimer: null,
};
const operations = {
  machines: [],
  edit: null,
  machineEdit: null,
  progress: null,
};
const STATUS = {
  pending: "待批复",
  approved: "已批复",
  rejected: "未通过",
  completed: "已完成",
  cancelled: "已取消",
  loss_pending: "丢失待处理",
  loss_closed: "赔偿结案",
};
const isApproved = (r) => !!r?.snapshot;
const canEditRequest = (r) =>
  !!r && (r.status === "pending" || operations.edit?.id === r.id);
const requestPhotos = (r) =>
  operations.edit?.id === r?.id ? operations.edit.photos : r?.photos || [];
const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const actor = () => state.user?.username || "";
let clock = { server: 0, baseline: 0, available: false },
  listGeneration = 0,
  detailGeneration = 0,
  machineEditGeneration = 0;
const loanClock = () => clock.server + performance.now() - clock.baseline;
const localDate = (v = new Date(loanClock()).toISOString()) =>
  localInput(v).slice(0, 10);
const localTime = (v) => localInput(v).replace("T", " ");
const timePair = (v) => (v ? localTime(v) + " UTC+08:00 / " + v : "尚未记录");
const daysBetween = (a, b) =>
  a && b && inputUtc(b) > inputUtc(a)
    ? Math.round(
        (Date.parse(b.slice(0, 10)) - Date.parse(a.slice(0, 10))) / 86400000,
      ) + 1
    : 0;
function toast(message) {
  clearTimeout(state.toastTimer);
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  state.toastTimer = setTimeout(() => ($("#toast").hidden = true), 6000);
}
function busyLoan(id) {
  const a = operations.machines.find((m) => m.id === id),
    x = a?.allocation;
  return x?.source === "legacy"
    ? {
        id: x.legacyLoanId,
        source: "legacy",
        company: x.name,
        snapshot: { end: x.dueAt ? localInput(x.dueAt).slice(0, 10) : "" },
      }
    : x
      ? state.requests.find((r) => r.id === x.requestId) || {
          id: x.requestId,
          company: x.name,
          snapshot: { end: localInput(x.dueAt).slice(0, 10) },
        }
      : null;
}
function adapt(raw) {
  const original = { ...flat(raw.original), days: raw.original.requestedDays };
  const snapshot = raw.agreement
    ? flat(raw.agreement)
    : raw.dueAt
      ? { end: localInput(raw.dueAt).slice(0, 10) }
      : null;
  const saved = raw.draft?.draft || raw.draft,
    fileIds = raw.agreement?.fileIds || raw.draft?.fileIds;
  const progress = raw.progress || {};
  const finance = raw.finance,
    bank = finance?.byCurrency;
  const deposit = raw.agreement?.quote.deposit || raw.depositDue;
  let depositStatus = finance?.reconciliation ? "reconciliation" : "unpaid";
  if (
    deposit &&
    bank &&
    !finance.reconciliation &&
    BigInt(finance.depositMatchedMinor) >= BigInt(deposit.amountMinor) &&
    BigInt(bank[deposit.currency].balanceMinor) -
      BigInt(bank[deposit.currency].unallocatedMinor) >=
      BigInt(deposit.amountMinor)
  )
    depositStatus = "held";
  if (
    [
      "cancelled",
      "rejected",
      "completed",
      "loss_pending",
      "loss_closed",
    ].includes(raw.status)
  ) {
    depositStatus = finance?.reconciliation
      ? "reconciliation"
      : bank && Object.values(bank).some((b) => BigInt(b.balanceMinor) > 0n)
        ? "refundPending"
        : raw.financialClosedAt && finance?.balanced
          ? "settled"
          : bank &&
              !finance.reconciliation &&
              Object.values(bank).some((b) => BigInt(b.refundedMinor) > 0n)
            ? "refunded"
            : "none";
  }
  return {
    ...original,
    company:
      raw.displayName || raw.agreement?.applicant.name || original.company,
    id: raw.id,
    publicNo: raw.publicNo,
    status: raw.status,
    submittedAt: raw.submittedAt,
    original,
    draft: saved ? flat(saved) : defaults(original),
    snapshot,
    machineId: raw.asset?.id || raw.draft?.assetId || null,
    photos:
      raw.files
        ?.filter(
          (f) =>
            (!fileIds || fileIds.includes(f.id)) &&
            ["ready", "uploaded"].includes(f.status),
        )
        .map((f) => ({
          id: f.id,
          name: f.name,
          size: f.originalSize,
          url: `/api/sample-admin/requests/${raw.id}/files/${f.id}/original`,
        })) || [],
    versions: raw.versions || [],
    events: (raw.events || []).map((e) => ({
      id: e.id,
      text: e.action + (e.details?.reason ? "：" + e.details.reason : ""),
      time: e.recordedAt,
    })),
    acceptance: raw.consent
      ? {
          ...raw.consent.terms,
          confirmedAt: raw.consent.confirmedAt,
          notice: (
            raw.consent.presentedNotice?.items || raw.consent.terms.notices
          ).join("\n"),
        }
      : null,
    browser: raw.consent?.userAgent,
    reason: latestRejectionReason(raw.events || []),
    cancelReason:
      raw.events?.find((event) => event.action === "progress.cancel")?.details
        .reason || "",
    approvedAt: raw.agreement?.approvedAt,
    approvedBy: raw.agreement?.approvedBy,
    completedAt: progress.returnedAt,
    completedBy: "已核对",
    returnedAt: progress.returnedAt,
    shippedAt: progress.shippedAt,
    inspectedAt: progress.inspectedAt,
    depositStatus,
    _raw: raw,
  };
}
function defaults(request) {
  return {
    company: request.company,
    entity: request.entity || "公司",
    credit: request.credit || "",
    contact: request.contact || "",
    phone: request.phone,
    email: request.email,
    registeredAddress: request.registeredAddress || "",
    companyAddress: request.companyAddress || "",
    model: request.model,
    start: "",
    end: "",
    approvalNote: "",
    sn: "",
    no: "",
    value: "",
    currency: "CNY",
    defaultAccountInfo: "",
    accessories: "",
    inspection: "",
    receiver: request.receiver || "",
    receiverPhone: request.receiverPhone || request.phone,
    shippingAddress: request.shippingAddress || "",
    carrier: "",
    tracking: "",
    returnName: "",
    returnPhone: "15882008185",
    returnAddress:
      "中国（四川）自由贸易试验区成都高新区天府五街200号2栋A区5楼501-502室",
    lender: "泛灵（成都）人工智能科技有限公司",
    lenderRepresentative: "朱杰",
    lenderPhone: "15882008185",
    lenderEmail: "support@rminte.com",
    lenderAddress:
      "中国（四川）自由贸易试验区成都高新区天府五街200号2栋A区5楼501-502室",
    agreementDate: localDate(),
    inspectionTime: "",
    attachmentNotes: "",
    identityNotes: "",
    identityVerified: "",
    payer: request.company,
    payerNotes: "",
    depositCurrency: "CNY",
    depositAmount: "30000.00",
    fxRate: "",
    fxAt: "",
    cardSpecs: "",
    cardSerial: "",
    insuredValue: "",
    insuranceProof: "",
  };
}

function renderList() {
  const query = $("#search").value.toLocaleLowerCase().trim();
  const requests = state.requests;
  $$("[data-sort-time]").forEach((button) => {
    const current = state.sort === "latest" ? "最晚优先" : "最早优先";
    button.title = `当前${current}；点击切换为${state.sort === "latest" ? "最早优先" : "最晚优先"}`;
    button.setAttribute("aria-label", `提交时间：${button.title}`);
    button.querySelector("[data-sort-direction]").textContent =
      state.sort === "latest" ? "↓" : "↑";
    const label = button.querySelector("[data-sort-label]");
    if (label) label.textContent = current;
  });
  $("#list-total").textContent =
    `${Object.values(state.counts).reduce((a, b) => a + b, 0)} 份申请`;
  $("#pending-count").textContent = state.counts.pending || 0;
  $("#list-action-label").textContent =
    state.filter === "approved" ? "归还" : "详情";
  $("#completion-hint").hidden = state.filter !== "approved";
  $("#request-rows").innerHTML = requests
    .map((request) => {
      const model = request.model.replace(/^RM-01 /, "");
      const [configuration, performance] = model.split(" (");
      const action =
        request.status === "approved" && state.filter === "approved"
          ? `<button type="button" class="complete-request" data-complete="${escapeHtml(request.id)}" title="标记已归还，终结单据" aria-label="标记 ${escapeHtml(request.company)} 已归还">${icon("check")}</button>`
          : `<a class="row-arrow" href="#admin/${encodeURIComponent(request.id)}" aria-label="查看 ${escapeHtml(request.company)} 的详情">${icon("arrow")}</a>`;
      return `<div class="request-row"><button type="button" class="request-open" data-request="${escapeHtml(request.id)}" aria-label="查看 ${escapeHtml(request.company)} 的申请"><span><strong>${escapeHtml(request.company)}</strong><span class="sub mono">${escapeHtml(request.publicNo)}</span></span><span class="request-model"><span>RM-01 ${escapeHtml(configuration)}</span><span class="sub">${escapeHtml(performance.replace(")", ""))}</span><span class="sub">申请 ${request.days} 天</span></span><span class="request-deadline">${deadlineMarkup(request)}</span><span class="request-time"><span class="mono">${localTime(request.submittedAt).slice(5, 16)}</span><span class="sub">北京时间</span></span><span class="status" data-status="${request.status}">${STATUS[request.status]}</span></button>${action}<div class="request-tags progress-tags">${progressMarkup(request)}</div></div>`;
    })
    .join("");
  $("#list-empty").hidden = requests.length > 0;
  refreshCountdowns();
}

function captureDraft() {
  if (state.current && canEditRequest(state.current)) {
    const values = Object.fromEntries(new FormData(form));
    state.current.draft = {
      ...(state.current.draft || {}),
      ...values,
      identityVerified: form.elements.identityVerified.checked ? "yes" : "",
    };
  }
}
function openRequest(request) {
  state.current = request;
  const approved = isApproved(request);
  const locked = !canEditRequest(request);
  const values =
    approved && !canEditRequest(request) ? request.snapshot : request.draft;
  $$("input[name],select[name],textarea[name]")
    .filter((input) => form.contains(input))
    .forEach((input) => {
      if (input.type === "checkbox")
        input.checked = values[input.name] === "yes";
      else input.value = values[input.name] ?? "";
      input.disabled = locked;
    });
  $("#detail-id").textContent = request.publicNo;
  $("#detail-title").textContent = request.company;
  $("#detail-status").textContent = STATUS[request.status];
  $("#detail-status").dataset.status = request.status;
  $("#detail-summary").textContent =
    `申请 ${request.days} 天 · ${request.model}`;
  $("#requested-days").textContent = request.days;
  $("#original-model").textContent = request.original.model;
  $("#record-id").textContent = request.publicNo;
  $("#record-submitted").textContent = timePair(request.submittedAt);
  $("#record-version").textContent =
    request.acceptance?.version ||
    request._raw.consent?.termsVersion ||
    "尚未记录";
  $("#record-acceptance").textContent = request.acceptance
    ? timePair(request.acceptance.confirmedAt) +
      " · 已保存该次重点提示与条款快照"
    : "尚未记录";
  $("#record-actor").textContent =
    request.approvedBy || (locked ? "—" : `完成时记录当前管理员：${actor()}`);
  $("#record-approved").textContent = request.approvedAt
    ? timePair(request.approvedAt)
    : "尚未完成";
  $("#original-record").textContent = "";
  const original = document.createElement("p");
  original.textContent = `借用主体：${request.original.company}\n主体类型：${request.original.entity || "公司"}\n联系人：${request.original.contact || "未填写"}\n统一社会信用代码：${request.original.credit || "未填写"}\n注册地址：${request.original.registeredAddress || "不适用或未填写"}\n联系地址：${request.original.companyAddress || "未填写"}\n联系电话：${request.original.phone}\n邮箱：${request.original.email}\n收件人：${request.original.receiver || "未填写"}\n收件电话：${request.original.receiverPhone || "未填写"}\n收货地址：${request.original.shippingAddress || "未填写"}\n申请型号：${request.original.model}\n申请天数：${request.days} 天\n浏览器：${request.browser || "未提供"}\nIP：${request._raw.consent?.ip || "未提供"}`;
  $("#original-record").append(original);
  if (request.acceptance) {
    const notice = document.createElement("p");
    notice.textContent = "提交时重点提示：\n" + request.acceptance.notice;
    $("#original-record").append(notice);
  }
  renderEvents();
  $("#approval-result").hidden = !approved;
  $("#completion-result").hidden = request.status !== "completed";
  $("#completion-summary").textContent = request.completedAt
    ? `${request.completedBy} · ${timePair(request.completedAt)}`
    : "";
  $("#approved-email").textContent = values.email;
  $("#rejected-result").hidden = request.status !== "rejected";
  $("#rejected-reason").textContent = request.reason || "";
  $("#complete-approval").hidden = request.status !== "pending";
  $("#save-draft").hidden = request.status !== "pending";
  $("#reject-request").hidden = request.status !== "pending";
  $("#photo-upload").disabled = locked;
  $(".upload-zone").hidden = locked;
  $("#form-message").textContent =
    operations.edit?.id === request.id
      ? "修改完成后保存新版本，原协议和历史附件保留。"
      : approved
        ? "已保存批复快照。PDF 下载与人工发送是独立操作。"
        : locked
          ? "未通过原因已记录，本页不发送通知。"
          : "填写完成后，一次批复并生成协议。";
  syncEntityFields(form, "data-admin-company", values.entity === "公司");
  refreshSelects(form);
  updateDeposit();
  updateSchedule();
  renderPhotos();
  renderMachinePicker();
  renderOperations(request);
}
function renderEvents() {
  $("#event-list").innerHTML = state.current.events
    .map(
      (event) =>
        `<li>${escapeHtml(event.text)}<small>${escapeHtml(timePair(event.time))}</small></li>`,
    )
    .join("");
}
function updateDeposit() {
  const usd = form.elements.depositCurrency.value === "USD";
  const locked = !canEditRequest(state.current);
  form.querySelectorAll("[data-usd-quote]").forEach((field) => {
    field.hidden = !usd;
    field.querySelectorAll("input").forEach((input) => {
      input.disabled = !usd || locked;
    });
  });
  let amount = "";
  if (usd) {
    try {
      const rate = BigInt(fxUnits(form.elements.fxRate.value));
      if (rate > 0n) amount = major((3000000000000n + rate - 1n) / rate);
    } catch {}
  }
  form.elements.depositAmount.value = usd ? amount : "30000.00";
  form.elements.insuredValue.value = form.elements.value.value
    ? form.elements.value.value + " " + form.elements.currency.value
    : "";
}

function updateSchedule() {
  const start = form.elements.start.value;
  const end = form.elements.end.value;
  const days = daysBetween(start, end);
  $("#start-utc").textContent = start
    ? `北京时间 UTC+08:00 / ${inputUtc(start).replace("T", " ").replace(".000Z", " UTC")}`
    : "按北京时间填写，同时保留 UTC。";
  $("#end-utc").textContent = end
    ? `北京时间 UTC+08:00 / ${inputUtc(end).replace("T", " ").replace(".000Z", " UTC")}`
    : "截止时须已送达厂家。";
  $("#approved-days").textContent = days
    ? `批复借期：${days} 个自然日`
    : start && end
      ? "归还截止时间须晚于借用起始时间"
      : "请填写起止时间";
}
function changedApproval() {
  updateDeposit();
  updateSchedule();
  if ($("#form-message").dataset.error) {
    $("#form-message").textContent = "填写完成后，一次批复并生成协议。";
    delete $("#form-message").dataset.error;
  }
}

function renderPhotos() {
  const request = state.current;
  $("#photo-grid").innerHTML = requestPhotos(request)
    .map(
      (photo, index) =>
        `<div class="photo-item"><img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.name)}"><div class="photo-caption"><span>${escapeHtml(photo.name)}<small class="fine"> · ${Math.ceil(photo.size / 1024)} KB 原图</small></span>${canEditRequest(request) ? `<button type="button" data-remove-photo="${index}" aria-label="移除图片 ${escapeHtml(photo.name)}">${icon("close")}</button>` : ""}</div></div>`,
    )
    .join("");
}

function deadlineMarkup(request) {
  const data = request.snapshot;
  if (!data)
    return `<span class="sub">${request.status === "pending" ? "待批复日期" : "—"}</span>`;
  return `<span class="deadline-date">${escapeHtml(request.status === "loss_pending" && request._raw.loss?.compensation_due_at ? localInput(request._raw.loss.compensation_due_at).slice(0, 10) : data.end)}</span><strong data-loan-countdown="${escapeHtml(request.id)}"></strong>`;
}
function countdownText(request) {
  if (request.status === "cancelled") return "已取消";
  if (request.status === "loss_pending" && !request._raw.loss?.conversion_at)
    return "转赔偿通知待核对";
  if (request.status === "loss_closed") return "赔偿结案";
  if (request.returnedAt)
    return `已于 ${localTime(request.returnedAt).slice(0, 16)} 归还`;
  const end =
    request.status === "loss_pending"
      ? request._raw.loss?.compensation_due_at
      : inputUtc(request.snapshot?.end);
  if (!end) return "待批复日期";
  const diff = Date.parse(end) - loanClock();
  const hours = Math.ceil(Math.abs(diff) / 3600000);
  const duration = `${Math.floor(hours / 24)}天${hours % 24}小时`;
  const start = inputUtc(request.snapshot.start);
  if (diff >= 0 && Date.parse(start) > loanClock())
    return `待出借 · 距归还 ${duration}`;
  return diff >= 0
    ? `${request.status === "loss_pending" ? "赔偿付款 · " : ""}剩余 ${duration}`
    : `已逾期 ${duration}${request.status === "loss_pending" ? " · 赔偿付款" : ""}`;
}
function refreshLegacyCountdowns() {
  $$("[data-legacy-deadline]").forEach((el) => {
    const due = Date.parse(el.dataset.legacyDeadline);
    if (!Number.isFinite(due)) {
      el.textContent = "归还日期待补录";
      return;
    }
    const remaining = due - loanClock();
    el.dataset.overdue = String(remaining < 0);
    el.textContent =
      (remaining < 0 ? "已逾期 " : "剩余 ") +
      Math.ceil(Math.abs(remaining) / 86400000) +
      " 天 · " +
      localInput(el.dataset.legacyDeadline).slice(0, 10) +
      " 前归还";
  });
}
function refreshCountdowns() {
  refreshLegacyCountdowns();
  $$("[data-loan-countdown]").forEach((element) => {
    const request = state.requests.find(
      (r) => r.id === element.dataset.loanCountdown,
    );
    if (!request) return;
    element.textContent = countdownText(request);
    element.dataset.overdue = String(
      request.status === "approved" &&
        Date.parse(inputUtc(request.snapshot?.end)) < loanClock(),
    );
  });
}
function progressMarkup(request) {
  const tags = [];
  const tag = (action, text, done = false) =>
    `<button type="button" class="progress-tag" data-progress="${action}" data-loan="${escapeHtml(request.id)}" ${done ? "disabled" : `title="点击确认：${text}"`}>${done ? icon("check") : '<span class="tag-dot" aria-hidden="true"></span>'}${text}</button>`;
  if (request.depositStatus === "reconciliation")
    tags.push(tag("reconcile", "资金待核对"));
  if (request.depositStatus === "unpaid" && request.status === "approved")
    tags.push(tag("deposit", "押金待到账"));
  if (request.depositStatus === "held")
    tags.push(tag("none", "押金已到账", true));
  if (request.status === "approved")
    tags.push(
      tag("ship", request.shippedAt ? "已发货" : "待发货", !!request.shippedAt),
      tag("return", "待归还"),
    );
  if (request.status === "completed")
    tags.push(
      tag(
        "inspect",
        request.inspectedAt ? "已验收" : "待验收",
        !!request.inspectedAt,
      ),
    );
  if (request.depositStatus === "refundPending")
    tags.push(tag("refund", "押金待退"));
  if (
    request.depositStatus === "refunded" ||
    request.depositStatus === "settled"
  )
    tags.push(
      tag(
        "none",
        request.depositStatus === "settled" ? "已结清" : "押金已退",
        true,
      ),
    );
  if (request.status === "completed" && request.depositStatus === "none")
    tags.push(tag("none", "无押金待退", true));
  if (
    request._raw.finance?.balanced &&
    request._raw.finance.assessmentComplete &&
    !request._raw.financialClosedAt
  )
    tags.push(tag("close", "费用待结清"));
  return tags.join("");
}
function renderInventory() {
  const query = $("#inventory-search").value.trim().toLocaleLowerCase();
  const all = operations.machines;
  const machines = all.filter((m) =>
    `${m.sn} ${m.no} ${m.model} ${m.notes}`.toLocaleLowerCase().includes(query),
  );
  $("#inventory-summary").textContent =
    `${all.length} 台样机 · 空闲 ${all.filter((m) => m.lifecycle === "active" && !busyLoan(m.id)).length} 台 · 已借出 ${all.filter((m) => busyLoan(m.id)).length} 台 · 不可借 ${all.filter((m) => m.lifecycle !== "active").length} 台`;
  $("#inventory-rows").innerHTML = machines
    .map((machine) => {
      const loan = busyLoan(machine.id);
      return `<article class="inventory-row"><h2>${escapeHtml(machine.model)}</h2><dl><div><dt>NO</dt><dd>${escapeHtml(machine.no)}</dd></div><div><dt>SN</dt><dd>${escapeHtml(machine.sn)}</dd></div></dl><p class="machine-notes">${escapeHtml(machine.notes || "暂无备注")}</p><div class="inventory-state"><span class="status" data-status="${loan ? "approved" : "idle"}">${loan ? "已借出" : machine.lifecycle === "active" ? "空闲" : machine.lifecycle === "lost" ? "已丢失" : "停用"}</span>${loan?.source === "legacy" ? `<div class="inventory-loan"><strong>历史登记 · ${escapeHtml(loan.company)}</strong><span data-legacy-deadline="${escapeHtml(machine.allocation.dueAt || "")}"></span></div>` : loan ? `<a class="inventory-loan" href="#admin/${encodeURIComponent(loan.id)}">${escapeHtml(loan.company)}<span>${escapeHtml(loan.snapshot.end)} 前归还</span></a>` : '<p class="fine">可在审批时分配</p>'}</div><button type="button" class="pill ghost" data-edit-machine="${machine.id}">修改</button></article>`;
    })
    .join("");
  $("#inventory-empty").hidden = machines.length > 0;
  refreshLegacyCountdowns();
}
function renderMachinePicker() {
  const request = state.current;
  if (!request) return;
  const editing = canEditRequest(request);
  const selected =
    operations.edit?.id === request.id
      ? operations.edit.machineId
      : request.machineId;
  const model = form.elements.model.value;
  const machines = operations.machines.filter(
    (m) =>
      m.model === model &&
      m.lifecycle === "active" &&
      (request.shippedAt
        ? m.id === request.machineId
        : m.id === selected || !busyLoan(m.id)),
  );
  $("#machine-options").innerHTML = machines
    .map(
      (machine) =>
        `<button type="button" class="machine-option" data-choose-machine="${machine.id}" aria-pressed="${machine.id === selected}" ${editing ? "" : "disabled"}><span>${escapeHtml(machine.no)}<small>SN ${escapeHtml(machine.sn)}</small></span>${machine.id === selected ? icon("check") : icon("plus")}</button>`,
    )
    .join("");
  $("#machine-selection-note").textContent = !machines.length
    ? "该型号暂无空闲机器，请先登记样机或等待归还，不能完成批复"
    : selected
      ? request.shippedAt
        ? "机器已实际寄出，NO、SN 保持交付记录；可补充物流、照片及说明"
        : "NO、SN 来自所选台账；批复完成时检查并占用样机"
      : "选择一台空闲样机后自动带入 NO、SN，备注可作为配件填写参考";
}
function renderOperations(request) {
  const visible =
    !!request.snapshot || ["cancelled", "rejected"].includes(request.status);
  $("#loan-operations").hidden = !visible;
  if (!visible) return;
  const editing = operations.edit?.id === request.id;
  $("#detail-deadline").innerHTML = request.snapshot
    ? `归还截止 <b>${escapeHtml(request.snapshot.end)} 23:59:59 北京时间</b><strong data-loan-countdown="${escapeHtml(request.id)}"></strong>`
    : "尚未批复出借，资金事实单独核对";
  $("#detail-progress").innerHTML = progressMarkup(request);
  if (editing) {
    [
      "start",
      "end",
      "depositCurrency",
      "depositAmount",
      "fxRate",
      "fxAt",
    ].forEach((key) => {
      form.elements[key].disabled = true;
    });
    refreshSelects(form);
  }
  $("#edit-note").hidden = !editing;
  $("#save-revision-bottom").hidden = !editing;
  $("#cancel-revision-bottom").hidden = !editing;
  $("#edit-approved").hidden =
    editing || !["approved", "completed"].includes(request.status);
  $("#extend-loan").hidden = editing || request.status !== "approved";
  $("#cancel-loan").hidden = editing || request.status !== "approved";
  $("#current-revision").textContent = request._raw.currentAgreementRevision
    ? `当前协议 R${request._raw.currentAgreementRevision} · ${request.versions.at(-1)?.status}`
    : "尚未生成协议";
  $("#pdf-status").textContent = $("#current-revision").textContent;
  $("#cancelled-summary").hidden = request.status !== "cancelled";
  $("#cancelled-summary").textContent = request.cancelReason
    ? `取消原因：${request.cancelReason}`
    : "";
  $("#copy-email").hidden = !request.snapshot || request.status === "cancelled";
  refreshCountdowns();
}

function syncEntityFields(container, attr, company) {
  container.querySelectorAll("[" + attr + "]").forEach((label) => {
    label.hidden = !company;
    label.querySelectorAll("input,textarea").forEach((el) => {
      el.disabled = !company || !canEditRequest(state.current);
    });
  });
}
function deny(e) {
  if (e.status === 401 || e.status === 403) {
    $("#admin-view").hidden = true;
    state.role = "user";
    state.requests = [];
    state.current = null;
    for (const input of $$("input,textarea")) {
      input.value = "";
      if (input.type === "checkbox") input.checked = false;
    }
    for (const id of [
      "request-rows",
      "inventory-rows",
      "original-record",
      "agreement-document",
      "photo-grid",
      "history-list",
      "grant-list",
    ])
      $("#" + id).replaceChildren();
    for (const dialog of $$("dialog[open]")) dialog.close();
    $("#admin-detail").hidden = true;
    $("#inventory-view").hidden = true;
    $("#admin-list").hidden = true;
    $("#admin-denied").hidden = false;
  }
  toast(e.message);
}
async function checked(action, button = null, formNode = form) {
  if (button?.disabled) return;
  const previousError = formNode.querySelector("[data-command-error]");
  if (previousError) previousError.hidden = true;
  button && (button.disabled = true);
  try {
    return await action();
  } catch (e) {
    if (
      !serverErrors(formNode, e.fieldErrors, {
        ...fields,
        legacyBorrower: "legacyLoan.borrower",
        legacyContact: "legacyLoan.contact",
        legacyLent: "legacyLoan.lentAt",
        legacyDue: "legacyLoan.dueAt",
        legacyNotes: "legacyLoan.notes",
        "finance-amount": "money",
        "finance-currency": "money.currency",
        "finance-reference": "reference",
        "progress-time": "occurredAt",
        amount: "billingBasis.value",
        startsAt: "schedule.startsAt",
        dueAt: "schedule.dueAt",
        rate: "quote.fx.rateUnits",
        publishedAt: "quote.fx.publishedAt",
      })
    ) {
      if (formNode.closest("dialog")?.open && ![401, 403].includes(e.status)) {
        let message = formNode.querySelector('.inline-message[role="alert"]');
        if (!message) {
          message = document.createElement("p");
          message.className = "inline-message";
          message.setAttribute("role", "alert");
          formNode.append(message);
        }
        message.dataset.commandError = "";
        message.textContent = e.message;
        message.hidden = false;
        message.scrollIntoView({ block: "nearest" });
      } else deny(e);
    }
  } finally {
    button && (button.disabled = false);
  }
}
async function syncClock() {
  const start = performance.now();
  try {
    const r = await api("/api/sample-admin/time");
    const end = performance.now();
    clock = {
      server: Date.parse(r.serverTime) + (end - start) / 2,
      baseline: end,
      available: true,
    };
    $("#clock-status").textContent = "北京时间 / UTC · 服务器已校准";
    refreshCountdowns();
  } catch (e) {
    clock.available = false;
    $("#clock-status").textContent = "服务器校时不可用，显示仅供参考";
    if (e.status === 401 || e.status === 403) deny(e);
  }
}
async function loadAssets() {
  const r = await api("/api/sample-admin/assets");
  operations.machines = r.assets.map((a) => ({
    ...a,
    model: MODEL_MAP[a.modelKey],
  }));
  renderInventory();
}
async function loadList(append = false) {
  const generation = ++listGeneration;
  const params = new URLSearchParams({
    status: state.filter,
    sort: state.sort,
    q: $("#search").value.trim(),
  });
  if (append && state.cursor) params.set("cursor", state.cursor);
  const r = await api("/api/sample-admin/requests?" + params);
  if (generation !== listGeneration || state.role === "user") return;
  state.requests = append
    ? [...state.requests, ...r.requests.map(adapt)]
    : r.requests.map(adapt);
  state.counts = r.counts;
  state.cursor = r.cursor;
  $("#load-more").hidden = !r.cursor;
  renderList();
}
async function loadDetail(id, generation = ++detailGeneration) {
  const result = await api("/api/sample-admin/requests/" + encodeURIComponent(id));
  if (generation !== detailGeneration || state.role === "user") return false;
  const request = adapt(result.request);
  const at = state.requests.findIndex((r) => r.id === id);
  if (at >= 0) state.requests[at] = request;
  else state.requests.push(request);
  openRequest(request);
  renderFinance(request);
  return true;
}
async function command(tail, data, button, formNode = form) {
  const r = state.current,
    id = r.id;
  return checked(
    async () => {
      const keyFn = command.keys.get(tail) || retryableCommand();
      command.keys.set(tail, keyFn);
      const body = { expectedRowVersion: r._raw.rowVersion, ...data };
      const result = await api(`/api/sample-admin/requests/${id}/${tail}`, {
        data: body,
        key: keyFn(body),
      });
      if (operations.edit?.id === id) operations.edit = null;
      if (state.current?.id === id) {
        if (result.request) {
          openRequest(adapt(result.request));
          renderFinance(state.current);
        } else await loadDetail(id);
      }
      await loadAssets();
      if (!$("#admin-list").hidden) await loadList();
      return result;
    },
    button,
    formNode,
  );
}
command.keys = new Map();
async function route() {
  const hash = location.hash || "#admin";
  if (hash.startsWith("#section-")) return;
  // Invalidate the previous detail before any navigation request can finish.
  const generation = ++detailGeneration;
  state.current = null;
  $("#detail-loading").hidden = true;
  if (hash === "#apply") {
    await openPublicApplication();
    return;
  }
  if (state.role === "user" || !clock.server) return;
  $("#admin-view").hidden = false;
  for (const dialog of $$("dialog[open]")) dialog.close();
  operations.progress = null;
  operations.edit = null;
  const inventory = hash === "#admin-machines",
    id = hash.startsWith("#admin/") ? decodeURIComponent(hash.slice(7)) : null;
  $("#inventory-view").hidden = !inventory;
  $("#admin-list").hidden = inventory || !!id;
  $("#admin-detail").hidden = true;
  $("#detail-loading").hidden = !id;
  $("#admin-denied").hidden = true;
  $$("[data-admin-tab]").forEach((a) =>
    a.toggleAttribute(
      "aria-current",
      a.dataset.adminTab === (inventory ? "machines" : "requests"),
    ),
  );
  try {
    if (inventory) await loadAssets();
    else if (id) {
      await loadAssets();
      if (generation !== detailGeneration) return;
      if (await loadDetail(id, generation)) $("#admin-detail").hidden = false;
    } else await loadList();
  } catch (e) {
    if (generation === detailGeneration) deny(e);
  } finally {
    if (generation === detailGeneration) $("#detail-loading").hidden = true;
  }
}
window.addEventListener("hashchange", route);
form.addEventListener("input", changedApproval);
form.addEventListener("change", changedApproval);
form.elements.entity.addEventListener("change", () =>
  syncEntityFields(
    form,
    "data-admin-company",
    form.elements.entity.value === "公司",
  ),
);
form.elements.model.addEventListener("change", renderMachinePicker);
$("#back-to-list").addEventListener("click", () => {
  location.hash = "admin";
});
$("#request-rows").addEventListener("click", async (event) => {
  const complete = event.target.closest("[data-complete]");
  if (complete) {
    if (await loadDetail(complete.dataset.complete))
      openProgress(state.current, "return");
    return;
  }
  const b = event.target.closest("[data-request]");
  if (b) location.hash = "admin/" + b.dataset.request;
});
$$("[data-filter]").forEach((b) =>
  b.addEventListener("click", () => {
    state.filter = b.dataset.filter;
    $$("[data-filter]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)),
    );
    checked(() => loadList());
  }),
);
let searchTimer;
$("#search").addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => checked(() => loadList()), 200);
});
$$("[data-sort-time]").forEach((b) =>
  b.addEventListener("click", () => {
    state.sort = state.sort === "latest" ? "earliest" : "latest";
    checked(() => loadList());
  }),
);
$("#load-more").addEventListener("click", () =>
  checked(() => loadList(true), $("#load-more")),
);
$("#save-draft").addEventListener("click", () => {
  if (!validateForm(form, [form.elements.credit])) return;
  captureDraft();
  command(
    "draft",
    {
      draft: draftDTO(state.current.draft),
      assetId: state.current.machineId,
      fileIds: requestPhotos(state.current).map((p) => p.id),
    },
    $("#save-draft"),
  );
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (operations.edit) {
    await saveRevision();
    return;
  }
  if (!validateForm(form)) return;
  captureDraft();
  const asset = operations.machines.find(
    (a) => a.id === state.current.machineId,
  );
  if (!asset) {
    toast("请从台账选择实际出借样机");
    return;
  }
  checked(async () => {
    const data = {
      expectedAssetVersion: asset.assetVersion,
      assetId: asset.id,
      fileIds: requestPhotos(state.current).map((p) => p.id),
      draft: approvalDTO(state.current.draft),
    };
    await command("approve", data, null);
  }, $("#complete-approval"));
});
$("#reject-request").addEventListener("click", () => {
  $("#reject-form").reset();
  showDialog($("#reject-dialog"));
});
$("#reject-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateForm(event.currentTarget)) return;
  const requestId = state.current.id;
  const result = await command(
    "reject",
    { reason: $("#reject-reason").value },
    event.submitter,
    event.currentTarget,
  );
  if (result) {
    $("#reject-dialog").close();
    if (state.current?.id === requestId && state.current.status === "rejected") {
      $("#copy-rejection-email").focus({ preventScroll: true });
      showRejectionEmail();
    }
  }
});
$("#inventory-search").addEventListener("input", renderInventory);
$("#new-machine").addEventListener("click", () => openMachine());
$("#inventory-rows").addEventListener("click", (e) => {
  const b = e.target.closest("[data-edit-machine]");
  if (b)
    openMachine(
      operations.machines.find((a) => a.id === b.dataset.editMachine),
    );
});
function legacyFields() {
  const f = $("#machine-form"),
    on = f.elements.lifecycle.value === "borrowed";
  $("#legacy-fields").hidden = !on;
  $("#legacy-fields").disabled = !on;
}
$("#machine-form").elements.lifecycle.addEventListener("change", legacyFields);
async function loadLegacyHistory(machine, generation) {
  const slot = $("#legacy-history");
  const isCurrent = () =>
    generation === machineEditGeneration && $("#machine-dialog").open;
  slot.textContent = "正在读取历史借出记录…";
  try {
    const { loans } = await api(
      "/api/sample-admin/assets/" + machine.id + "/legacy-loans",
    );
    if (!isCurrent()) return;
    operations.legacyHistory = loans;
    slot.innerHTML =
      "<h3>历史借出记录</h3>" +
      loans
        .map(
          (l) =>
            `<article class="legacy-record"><strong>${escapeHtml(l.borrower)} · ${{ active: "借出中", returned: "已归还", lost: "已确认丢失", corrected: "误登记已更正" }[l.status]}</strong><p>${l.lentAt ? escapeHtml(timePair(l.lentAt)) : "借出时间待补录"} → ${l.dueAt ? escapeHtml(timePair(l.dueAt)) : "归还日期待补录"}</p><p>${escapeHtml(l.contact || "")} ${escapeHtml(l.notes)}</p><p class="fine">登记时间：${escapeHtml(timePair(l.recordedAt))}${l.endedAt ? " · 结束时间：" + escapeHtml(timePair(l.endedAt)) : ""}</p>${l.endReason ? "<p>" + escapeHtml(l.endReason) + "</p>" : ""}${l.holdReason ? "<p>保留原因：" + escapeHtml(l.holdReason) + "</p>" : ""}${l.status === "active" ? `<div class="legacy-actions"><button type="button" class="pill ghost" data-legacy-action="return" data-legacy-id="${l.id}">登记归还</button><button type="button" class="pill ghost" data-legacy-action="loss" data-legacy-id="${l.id}">登记丢失</button><button type="button" class="pill ghost" data-legacy-action="correct" data-legacy-id="${l.id}">更正误登记</button></div>` : ""}${state.role === "owner" ? `<button type="button" class="text-button" data-legacy-action="preservation" data-legacy-id="${l.id}">${l.holdReason ? "修改 / 解除档案保留" : "设置档案保留"}</button>` : ""}</article>`,
        )
        .join("") +
      (loans.length ? "" : '<p class="fine">尚无历史借出登记</p>');
  } catch (e) {
    if (isCurrent()) slot.textContent = e.message;
  }
}
$("#legacy-history").addEventListener("click", (e) => {
  const button = e.target.closest("[data-legacy-action]");
  if (!button) return;
  operations.legacyEnd = {
    machine: operations.machineEdit,
    id: button.dataset.legacyId,
    action: button.dataset.legacyAction,
  };
  const f = $("#legacy-end-form");
  f.reset();
  const preserving = operations.legacyEnd.action === "preservation",
    correcting = operations.legacyEnd.action === "correct" || preserving;
  f.elements.reason.disabled = preserving;
  f.elements.reason.closest("label").hidden = preserving;
  f.elements.holdReason.value =
    operations.legacyHistory.find((l) => l.id === button.dataset.legacyId)
      ?.holdReason || "";
  f.elements.holdReason.readOnly = !preserving && !!f.elements.holdReason.value;
  $("#legacy-end-title").textContent = button.textContent;
  $("#legacy-end-help").textContent = preserving
    ? "填写争议或待结事项原因以暂停清理；留空并确认可解除保留。"
    : correcting
      ? "仅用于纠正原登记有误，记录更正原因后释放占用，不记作实际归还。"
      : "请核对实物情况，确认后结束这次历史借出并保留记录。";
  if (f.elements.holdReason.readOnly)
    $("#legacy-end-help").textContent +=
      "已有档案保留继续生效，修改或解除须由主管理员单独处理。";
  $("#legacy-time-field").hidden = correcting;
  f.elements.occurredAt.disabled = correcting;
  f.elements.occurredAt.value = localInput(new Date(loanClock()).toISOString());
  showDialog($("#legacy-end-dialog"));
});
$("#legacy-end-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  if (!validateForm(f)) return;
  const { machine, id, action } = operations.legacyEnd;
  await checked(
    async () => {
      await api(
        `/api/sample-admin/assets/${machine.id}/legacy-loans/${id}/${action}`,
        {
          data: {
            expectedAssetVersion: machine.assetVersion,
            ...(action === "preservation"
              ? {}
              : {
                  occurredAt:
                    action === "correct"
                      ? null
                      : inputUtc(f.elements.occurredAt.value),
                  reason: f.elements.reason.value,
                }),
            holdReason: f.elements.holdReason.value || null,
          },
          key: crypto.randomUUID(),
        },
      );
      $("#legacy-end-dialog").close();
      await loadAssets();
      openMachine(operations.machines.find((m) => m.id === machine.id));
    },
    e.submitter,
    f,
  );
});
function openMachine(machine = null) {
  const generation = ++machineEditGeneration;
  operations.machineEdit = machine;
  operations.legacyHistory = [];
  const f = $("#machine-form");
  f.reset();
  for (const key of ["model", "no", "sn", "notes", "lifecycle"])
    f.elements[key].value =
      machine?.[key] ||
      (key === "model" ? MODELS[0] : key === "lifecycle" ? "active" : "");
  const busy = machine?.allocation;
  if (busy) f.elements.lifecycle.value = "borrowed";
  legacyFields();
  for (const [name, key] of Object.entries({
    legacyBorrower: "name",
    legacyContact: "contact",
    legacyLent: "lentAt",
    legacyDue: "dueAt",
    legacyNotes: "notes",
  }))
    f.elements[name].value =
      key === "lentAt" || key === "dueAt"
        ? localInput(busy?.[key])
        : busy?.source === "legacy"
          ? busy[key] || ""
          : "";
  if (busy?.source === "request") {
    $("#legacy-fields").hidden = true;
    $("#legacy-fields").disabled = true;
  }
  $("#legacy-history").replaceChildren();
  if (machine) loadLegacyHistory(machine, generation);
  for (const key of ["model", "no", "sn", "lifecycle"])
    f.elements[key].disabled = !!busy;
  $("#machine-title").textContent = machine ? "修改样机" : "添加样机";
  $("#machine-edit-note").textContent = busy
    ? busy.source === "legacy"
      ? "该机器已借出，NO、SN、型号锁定；借用资料和备注可补充"
      : "该机器已借出，NO、SN、型号锁定；备注可改"
    : "型号和 NO 可重复，SN 唯一；修改台账不改写历史协议";
  $("#machine-error").hidden = true;
  refreshSelects(f);
  showDialog($("#machine-dialog"));
}
$("#machine-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = event.currentTarget;
  if (!validateForm(f)) return;
  const existing = operations.machineEdit,
    data = {
      modelKey: modelKey(f.elements.model.value),
      no: f.elements.no.value,
      sn: f.elements.sn.value,
      notes: f.elements.notes.value,
      lifecycle:
        f.elements.lifecycle.value === "borrowed"
          ? "active"
          : f.elements.lifecycle.value,
      ...(f.elements.lifecycle.value === "borrowed" &&
      existing?.allocation?.source !== "request"
        ? {
            legacyLoan: {
              borrower: f.elements.legacyBorrower.value,
              contact: f.elements.legacyContact.value || null,
              lentAt: inputUtc(f.elements.legacyLent.value),
              dueAt: inputUtc(f.elements.legacyDue.value),
              notes: f.elements.legacyNotes.value,
            },
          }
        : {}),
      ...(existing ? { expectedAssetVersion: existing.assetVersion } : {}),
    };
  await checked(
    async () => {
      await api(
        "/api/sample-admin/assets" + (existing ? "/" + existing.id : ""),
        { method: existing ? "PATCH" : "POST", data, key: crypto.randomUUID() },
      );
      $("#machine-dialog").close();
      await loadAssets();
      if (state.current) renderMachinePicker();
    },
    event.submitter,
    f,
  );
});
$("#machine-options").addEventListener("click", (e) => {
  const b = e.target.closest("[data-choose-machine]");
  if (!b || !canEditRequest(state.current)) return;
  const a = operations.machines.find((m) => m.id === b.dataset.chooseMachine);
  if (operations.edit) operations.edit.machineId = a.id;
  else state.current.machineId = a.id;
  form.elements.no.value = a.no;
  form.elements.sn.value = a.sn;
  if (!form.elements.accessories.value)
    form.elements.accessories.value = a.notes;
  captureDraft();
  renderMachinePicker();
});
function startRevision() {
  const r = state.current;
  if (!r?.snapshot) return;
  operations.edit = {
    id: r.id,
    machineId: r.machineId,
    photos: r.photos.map((p) => ({ ...p })),
  };
  r.draft = { ...r.snapshot };
  $("#revision-reason").value = "";
  $("#sameLegalEntityConfirmed").checked = false;
  openRequest(r);
  $("#revision-reason").focus();
}
async function saveRevision() {
  if (!validateForm(form)) return;
  if (!$("#revision-reason").value.trim()) {
    toast("请填写修改原因");
    $("#revision-reason").focus();
    return;
  }
  captureDraft();
  const a = operations.machines.find((m) => m.id === operations.edit.machineId);
  await checked(async () => {
    const payload = {
      draft: approvalDTO(state.current.draft),
      assetId: a.id,
      expectedAssetVersion: a.assetVersion,
      fileIds: requestPhotos(state.current).map((p) => p.id),
      reason: $("#revision-reason").value,
      sameLegalEntityConfirmed: $("#sameLegalEntityConfirmed").checked,
    };
    await command("revisions", payload);
  });
}
$("#edit-approved").addEventListener("click", startRevision);
for (const id of ["save-revision", "save-revision-bottom"])
  $("#" + id).addEventListener("click", () => saveRevision());
for (const id of ["cancel-revision", "cancel-revision-bottom"])
  $("#" + id).addEventListener("click", () => {
    operations.edit = null;
    openRequest(state.current);
    toast("已取消修改");
  });
$("#photo-grid").addEventListener("click", (e) => {
  const b = e.target.closest("[data-remove-photo]");
  if (b && canEditRequest(state.current)) {
    requestPhotos(state.current).splice(Number(b.dataset.removePhoto), 1);
    renderPhotos();
  }
});
const pendingUploads = [];
let uploadRunning = false;
const retryUpload = document.createElement("button");
retryUpload.type = "button";
retryUpload.className = "pill ghost";
retryUpload.textContent = "继续上传未完成图片";
retryUpload.hidden = true;
$(".upload-zone").after(retryUpload);
async function uploadPending() {
  if (uploadRunning) return;
  uploadRunning = true;
  retryUpload.hidden = true;
  $("#photo-upload").disabled = true;
  try {
    for (const item of pendingUploads.filter((p) => !p.done)) {
      if (!item.created)
        item.created = await api(
          `/api/sample-admin/requests/${item.requestId}/uploads`,
          {
            data: { name: item.file.name, mime: item.file.type },
            key: item.key,
          },
        );
      const file = item.file,
        created = item.created;
      for (
        let part = item.nextPart || 1;
        (part - 1) * created.partSize < file.size;
        part++
      ) {
        const chunk = file.slice(
          (part - 1) * created.partSize,
          part * created.partSize,
        );
        await api(
          `/api/sample-admin/requests/${item.requestId}/uploads/${created.id}/part?partNumber=${part}`,
          {
            method: "PUT",
            body: chunk,
            headers: { "Content-Type": "application/octet-stream" },
          },
        );
        item.nextPart = part + 1;
      }
      await api(
        `/api/sample-admin/requests/${item.requestId}/uploads/${created.id}/complete`,
        { data: {}, key: item.completeKey },
      );
      item.done = true;
      if (state.current?.id === item.requestId) {
        requestPhotos(state.current).push({
          id: created.id,
          name: file.name,
          size: file.size,
          url: `/api/sample-admin/requests/${item.requestId}/files/${created.id}/original`,
        });
        renderPhotos();
      }
    }
  } catch (e) {
    deny(e);
    retryUpload.hidden = false;
  } finally {
    uploadRunning = false;
    $("#photo-upload").disabled = !canEditRequest(state.current);
  }
}
$("#photo-upload").addEventListener("change", (event) => {
  for (const file of event.target.files)
    pendingUploads.push({
      file,
      requestId: state.current.id,
      key: crypto.randomUUID(),
      completeKey: crypto.randomUUID(),
    });
  event.target.value = "";
  uploadPending();
});
retryUpload.addEventListener("click", uploadPending);
async function showAgreement(
  revision = state.current._raw.currentAgreementRevision,
) {
  const r = state.current;
  const result = await api(
    `/api/sample-admin/requests/${r.id}/versions/${revision}/preview`,
  );
  $("#agreement-document").lang =
    result.snapshot.agreementLanguage === "en" ? "en" : "zh-CN";
  $("#agreement-document").innerHTML = renderContract(
    result.snapshot,
    result.terms,
    (result.snapshot.fileIds || []).map((id) => ({
      name: r._raw.files.find((f) => f.id === id)?.name || "附件",
      url: `/api/sample-admin/requests/${r.id}/files/${id}/original`,
    })),
  );
  $("#agreement-mode").textContent = `${r.publicNo} · 协议 R${revision}`;
  $("#agreement-footer-note").textContent =
    "历史文件按原版本保存；交付请下载当前存档版本";
  $("#print-agreement").hidden = true;
  showDialog($("#agreement-dialog"));
}
$("#preview-agreement").addEventListener("click", () =>
  checked(() =>
    state.current._raw.currentAgreementRevision
      ? showAgreement()
      : Promise.resolve(toast("完成批复后可预览正式协议")),
  ),
);
let delivery = null;
async function downloadCurrent() {
  const r = state.current,
    rev = r._raw.currentAgreementRevision;
  const bundle = await api(
    `/api/sample-admin/requests/${r.id}/versions/${rev}/status`,
  );
  if (bundle.currentAgreementRevision !== rev)
    throw new Error("协议已更新，请刷新后下载当前版本");
  if (!bundle.document) throw new Error("当前PDF尚未生成");
  delivery = bundle.document;
  const response = await fetch(delivery.downloadUrl, {
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error("下载未完成，请刷新核对");
  const blob = await response.blob(),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = delivery.fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
  toast("已请求下载；请核对文件并人工发送");
}
$("#download-agreement").addEventListener("click", () =>
  checked(downloadCurrent, $("#download-agreement")),
);
$("#agreement-history").addEventListener("click", () => {
  const r = state.current;
  $("#history-list").innerHTML = r.versions
    .map(
      (v) =>
        `<article><div><strong>R${v.revision} · ${escapeHtml(v.status)}</strong><p>${escapeHtml(v.reason)}</p><small>${escapeHtml(timePair(v.createdAt))}</small></div><button type="button" class="text-button" data-view-version="${v.revision}">查看</button>${v.status === "ready" ? `<a class="text-button" href="/api/sample-admin/requests/${r.id}/versions/${v.revision}/download">下载</a>` : `<button type="button" class="text-button" data-retry-version="${v.revision}" ${["retry_wait", "failed_permanent"].includes(v.status) ? "" : "disabled"}>重试</button>`}</article>`,
    )
    .reverse()
    .join("");
  showDialog($("#history-dialog"));
});
$("#history-list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-view-version]");
  if (b) checked(() => showAgreement(Number(b.dataset.viewVersion)));
  const retry = e.target.closest("[data-retry-version]");
  if (retry)
    command(`versions/${retry.dataset.retryVersion}/retry`, {}, retry).then(
      () => $("#history-dialog").close(),
    );
});
let emailKind = "confirmation";
let emailDraft;
function applyEmailLanguage() {
  const language = $("#email-language").value;
  const content = emailDraft.translations[language];
  $("#email-subject").value = content.subject;
  $("#email-body").value = content.body;
  $("#email-subject").lang = language;
  $("#email-body").lang = language;
  $("#clipboard-status").textContent = "";
}
$("#email-language").addEventListener("change", applyEmailLanguage);
function showEmail(email, kind = "confirmation") {
  emailKind = kind;
  emailDraft = email;
  $("#email-title").textContent =
    kind === "rejection" ? "未通过通知邮件" : "确认邮件正文";
  $("#email-confirmation-help").hidden = kind !== "confirmation";
  $("#email-rejection-help").hidden = kind !== "rejection";
  $("#email-recipient").value = email.recipient;
  const request = state.current._raw;
  $("#email-language").value = emailLanguage(
    request.consent?.presentedNotice?.language ||
      request.consent?.agreementLanguage ||
      request.agreement?.agreementLanguage ||
      "zh",
  );
  applyEmailLanguage();
  refreshSelects($("#email-dialog"));
  showDialog($("#email-dialog"));
}
function showRejectionEmail() {
  showEmail(
    {
      recipient: state.current.original.email,
      translations: {
        zh: rejectionEmail(state.current, "zh"),
        en: rejectionEmail(state.current, "en"),
      },
    },
    "rejection",
  );
}
$("#copy-rejection-email").addEventListener("click", showRejectionEmail);
$("#copy-email").addEventListener("click", () =>
  checked(async () => {
    const r = state.current;
    if (
      !delivery ||
      delivery.agreementRevision !== r._raw.currentAgreementRevision
    ) {
      toast("请先下载当前版本协议，再复制对应邮件");
      return;
    }
    const fresh = await api(
      `/api/sample-admin/requests/${r.id}/versions/${delivery.agreementRevision}/delivery?documentId=${delivery.documentId}`,
    );
    if (state.current?.id !== r.id) return;
    delivery = fresh.delivery;
    showEmail(delivery);
  }),
);
for (const [button, input] of [
  ["copy-email-recipient", "email-recipient"],
  ["copy-email-subject", "email-subject"],
  ["copy-email-body", "email-body"],
])
  $("#" + button).addEventListener("click", async () => {
    try {
      await copyEmailText($("#" + input).value, $("#email-dialog"));
      $("#clipboard-status").textContent =
        emailKind === "rejection"
          ? "已复制，请核对收件人后人工发送"
          : "已复制，请核对附件版本后人工发送";
    } catch {
      $("#clipboard-status").textContent =
        "复制失败，请检查浏览器剪贴板权限后重试";
    }
  });
$("#logout").addEventListener("click", () =>
  checked(async () => {
    await api("/api/logout", { method: "POST" });
    location.href = "/cases/";
  }),
);
function renderFinance(r) {
  const raw = r._raw,
    finance = raw.finance,
    a = raw.allowedActions || {};
  const visibility = {
    "edit-approved": "canRevise",
    "extend-loan": "canExtend",
    "cancel-loan": "canCancel",
  };
  for (const [id, key] of Object.entries(visibility))
    $("#" + id).hidden = !a[key] || !!operations.edit;
  $("#download-agreement").disabled = !a.canDownload;
  const special = {
    reschedules: "canReschedule",
    quotes: "canUpdateQuote",
    "billing-basis-corrections": "canCorrectBasis",
    loss: "canRegisterLoss",
    "loss-notice": "canNotifyLoss",
    "loss-close": "canCloseLoss",
    correction: "canCorrect",
  };
  for (const button of $$("[data-special]"))
    if (special[button.dataset.special])
      button.disabled = !a[special[button.dataset.special]];
  $("#finance-summary").textContent = finance
    ? ["CNY", "USD"]
        .map((c) => {
          const b = finance.byCurrency[c];
          return `${c}：实收 ${major(b.receivedMinor)}，已退 ${major(b.refundedMinor)}，已抵扣 ${major(b.appliedMinor)}，余额 ${major(b.balanceMinor)}，未结应收 ${major(b.outstandingMinor)}`;
        })
        .join("\n") +
      (finance.reconciliation ? "\n有待核对或异常资金，不能发货或结清" : "")
    : "尚无资金记录";
  if (
    raw.progress?.returnedAt &&
    finance &&
    Object.values(finance.byCurrency).some((b) => BigInt(b.balanceMinor) > 0n)
  )
    $("#finance-summary").textContent +=
      "\n" +
      (raw.progress.refundDueAt
        ? "退押金截止：" + timePair(raw.progress.refundDueAt)
        : "退款工作日历未覆盖归还日期，请主管理员核对配置");
  if (raw.preservation?.reason)
    $("#finance-summary").textContent +=
      "\n资料已保留：" + raw.preservation.reason;
  $("#progress-facts").textContent = [
    ["实际发货", raw.progress?.shippedAt],
    ["实际到厂", raw.progress?.returnedAt],
    ["归还验收", raw.progress?.inspectedAt],
  ]
    .filter(([, at]) => at)
    .map(([label, at]) => label + "：" + timePair(at))
    .join("\n");
  $("#financial-events").replaceChildren(
    ...(raw.entries || []).map((entry) => {
      const p = document.createElement("p");
      p.className = "fine";
      p.textContent = `${entry.kind} · ${major(String(entry.amount_minor))} ${entry.currency} · ${entry.reference || ""} · ${timePair(entry.occurred_at)}`;
      return p;
    }),
  );
  $("#special-actions").hidden = false;
  $('[data-special="preservation"]').hidden = state.role !== "owner";
  $("#pdf-status").textContent = raw.currentAgreementRevision
    ? `R${raw.currentAgreementRevision} · ${raw.versions.at(-1)?.status}`
    : "尚未生成";
}
function openProgress(r, action) {
  const permissions = {
    ship: "canShip",
    return: "canReturn",
    inspect: "canInspect",
  };
  if (permissions[action] && !r._raw.allowedActions?.[permissions[action]]) {
    toast(
      action === "ship"
        ? "请先核对押金足额到账、主体授权、物流保价和当前协议PDF"
        : action === "return"
          ? "请先核对实际发货记录"
          : "请先登记实际归还",
    );
    return;
  }
  state.current = r;
  operations.progress = { action };
  $("#progress-form").reset();
  $("#progress-time").value = localInput(new Date(loanClock()).toISOString());
  $("#progress-error").hidden = true;
  const finance = [
    "deposit",
    "refund",
    "apply",
    "assessment",
    "close",
  ].includes(action);
  $$("[data-finance-field]").forEach((e) => {
    e.hidden = !finance;
    e.querySelectorAll("input,select").forEach((i) => (i.disabled = !finance));
  });
  $("#progress-title").textContent = {
    deposit: "登记实际收款",
    refund: "登记实际退款",
    apply: "押金抵扣",
    assessment: "核定应收项目",
    close: "确认费用结清",
    ship: "发货登记",
    return: "确认已归还",
    inspect: "归还验收",
  }[action];
  $("#progress-description").textContent =
    action === "return"
      ? "是否确认机器已实际送达厂家？确认后恢复空闲；验收及押金继续单独跟进"
      : action === "inspect"
        ? "请核对SN、NO、外观、存储卡、配件及默认账户和密码恢复情况"
        : "请根据实际事实核对；登记收款、退款不代表系统执行银行转账";
  const moneyNeeded = finance && action !== "close";
  $("#finance-money-field").hidden = !moneyNeeded;
  $("#finance-amount").disabled = !moneyNeeded;
  $("#finance-amount").required = moneyNeeded;
  $("#finance-amount").min = action === "assessment" ? "0" : "0.01";
  $("#finance-currency").value =
    r._raw.agreement?.quote.deposit.currency || "CNY";
  $("#finance-reference").required = ["deposit", "refund"].includes(action);
  $("#finance-reference-field").hidden = !["deposit", "refund"].includes(
    action,
  );
  $("#finance-reference").disabled = !["deposit", "refund"].includes(action);
  $("#finance-purpose-field").hidden = action !== "deposit";
  $("#finance-purpose").disabled = action !== "deposit";
  $("#finance-quote").innerHTML =
    '<option value="">待核对 / 未归属</option>' +
    (r._raw.quotes || [])
      .map(
        (q) =>
          `<option value="${q.id}">报价 ${q.revision} · ${q.quote.deposit.currency} ${major(q.quote.deposit.amountMinor)}</option>`,
      )
      .join("");
  $("#finance-quote").value = r._raw.agreement?.quoteId || "";
  $("#finance-assessment").innerHTML =
    '<option value="">选择核定项目</option>' +
    (r._raw.assessments || [])
      .map(
        (a) =>
          `<option value="${a.id}">${escapeHtml(a.reason)} · ${a.currency} ${major(String(a.amount_minor))}</option>`,
      )
      .join("");
  $("#finance-complete-field").hidden = action !== "assessment";
  $("#finance-exception-field").hidden = !["deposit", "refund"].includes(
    action,
  );
  $("#progress-note").required = [
    "inspect",
    "assessment",
    "close",
    "apply",
  ].includes(action);
  installSelects();
  refreshSelects($("#progress-form"));
  showDialog($("#progress-dialog"));
}
document.addEventListener("click", async (event) => {
  const b = event.target.closest("[data-progress]");
  if (b && b.dataset.progress !== "none") {
    const id = b.dataset.loan;
    if (operations.edit) {
      toast("请先保存或取消资料修改");
      return;
    }
    if (!(await loadDetail(id))) return;
    if (b.dataset.progress === "reconcile") openSpecial("reconcile");
    else openProgress(state.current, b.dataset.progress);
  }
  const f = event.target.closest("[data-finance]");
  if (f) {
    const id = state.current.id;
    if (operations.edit) {
      toast("请先保存或取消资料修改");
      return;
    }
    if (await loadDetail(id))
      openProgress(state.current, f.dataset.finance);
  }
});
$("#progress-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = event.currentTarget;
  if (!validateForm(f)) return;
  const action = operations.progress.action,
    note = $("#progress-note").value,
    occurredAt = inputUtc($("#progress-time").value);
  let tail, payload;
  if (["deposit", "refund", "apply", "assessment", "close"].includes(action)) {
    tail =
      "finances/" +
      {
        deposit: "receipts",
        refund: "refunds",
        apply: "settlements",
        assessment: "assessments",
        close: "close",
      }[action];
    if (action === "close") payload = { reason: note };
    else if (action === "assessment")
      payload = {
        money: {
          currency: $("#finance-currency").value,
          amountMinor: minor($("#finance-amount").value),
        },
        reason: note,
        complete: $("#finance-complete").checked,
      };
    else
      payload = {
        money: {
          currency: $("#finance-currency").value,
          amountMinor: minor($("#finance-amount").value),
        },
        occurredAt,
        note,
        reference: $("#finance-reference").value || null,
        quoteId: $("#finance-quote").value || null,
        assessmentId: $("#finance-assessment").value || null,
        purpose: action === "deposit" ? $("#finance-purpose").value : null,
        exceptional: $("#finance-exception").checked,
      };
  } else {
    tail = "progress/" + action;
    payload = { occurredAt, note };
  }
  const result = await command(tail, payload, event.submitter, f);
  if (result) $("#progress-dialog").close();
});
$("#extend-loan").addEventListener("click", () => {
  $("#extension-form").reset();
  $("#extension-current").textContent =
    "须提前七个自然日申请，原借期不超过七日不接受延期；发货前调整请使用更正排期";
  $("#extension-received").value = localInput(
    new Date(loanClock()).toISOString(),
  );
  refreshSelects($("#extension-form"));
  showDialog($("#extension-dialog"));
});
$("#extension-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(e.currentTarget)) return;
  const result = await command(
    "extensions",
    {
      receivedAt: inputUtc($("#extension-received").value),
      requestedDueAt: inputUtc($("#extension-end").value),
      decision: $("#extension-decision").value,
      reason: $("#extension-reason").value,
    },
    e.submitter,
    e.currentTarget,
  );
  if (result) $("#extension-dialog").close();
});
$("#cancel-loan").addEventListener("click", () => {
  $("#cancel-loan-form").reset();
  showDialog($("#cancel-loan-dialog"));
});
$("#cancel-loan-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validateForm(e.currentTarget)) return;
  const r = await command(
    "cancel",
    { reason: $("#cancel-loan-reason").value },
    e.submitter,
    e.currentTarget,
  );
  if (r) $("#cancel-loan-dialog").close();
});
const specialSpecs = {
  preservation: {
    title: "资料保留 / 解除保留",
    fields: [["enabled", "启用保留（不勾选表示解除）", "checkbox"]],
  },
  reschedules: {
    title: "更正发货前排期",
    fields: [
      ["startsAt", "借用起始时间", "datetime-local"],
      ["dueAt", "归还截止日", "date"],
    ],
  },
  quotes: {
    title: "更新押金报价",
    fields: [
      ["currency", "押金币种", "currency"],
      ["rate", "每100美元折合人民币", "number"],
      ["publishedAt", "牌价发布时间", "datetime-local"],
    ],
  },
  "billing-basis-corrections": {
    title: "更正整机价值",
    fields: [
      ["currency", "整机价值币种", "currency"],
      ["amount", "整机价值", "number"],
    ],
  },
  loss: {
    title: "核实样机丢失",
    fields: [
      ["occurredAt", "实际核实时间", "datetime-local"],
      ["evidence", "核实依据", "textarea"],
    ],
  },
  "loss-notice": {
    title: "登记实际转赔偿通知",
    fields: [
      ["occurredAt", "实际通知及转赔偿时间", "datetime-local"],
      ["evidence", "通知送达依据", "textarea"],
    ],
  },
  "loss-close": { title: "赔偿结案", fields: [] },
  correction: {
    title: "更正错误标记",
    fields: [
      ["eventId", "原操作事件", "event"],
      [
        "confirmedNotShipped",
        "已核对机器未实际发出（更正发货时必选）",
        "checkbox",
      ],
    ],
  },
  reconcile: {
    title: "核对待认领款项",
    fields: [
      ["sourceEntryId", "原真实收支流水", "entry"],
      ["purpose", "核对后的用途", "purpose"],
      ["quoteId", "适用冻结报价", "quote"],
      ["assessmentId", "对应应收项目（赔偿时选择）", "assessment"],
    ],
  },
  reversal: {
    title: "更正资金录入",
    fields: [
      ["entryId", "原资金流水", "entry"],
      [
        "confirmedRecordingError",
        "已核对仅为录入错误，未撤销真实银行交易",
        "checkbox",
      ],
    ],
  },
};
let specialAction;
function openSpecial(action) {
  specialAction = action;
  const spec = specialSpecs[action];
  $("#special-title").textContent = spec.title;
  $("#special-form").reset();
  $("#special-fields").innerHTML = spec.fields
    .map(([name, label, type]) => {
      let input;
      if (type === "currency")
        input = `<select name="${name}"><option>CNY</option><option>USD</option></select>`;
      else if (type === "purpose")
        input = `<select name="${name}"><option value="deposit">押金</option><option value="compensation">赔偿款</option><option value="refund_only">仅退款，不计押金到账</option></select>`;
      else if (type === "quote" || type === "assessment") {
        const items =
          type === "quote"
            ? state.current._raw.quotes
            : state.current._raw.assessments;
        input = `<select name="${name}"><option value="">不适用</option>${items.map((x) => `<option value="${x.id}">${escapeHtml(x.reason || "报价 " + x.revision)}</option>`).join("")}</select>`;
      } else if (type === "event" || type === "entry") {
        let items =
          type === "event"
            ? state.current._raw.events
            : state.current._raw.entries;
        if (type === "event")
          items = items.filter((e) =>
            ["progress.ship", "progress.return", "progress.inspect"].includes(
              e.action,
            ),
          );
        else if (action === "reversal")
          items = items.filter((e) => e.kind !== "reversal" && !e.voided_by);
        else if (action === "reconcile")
          items = items.filter(
            (e) =>
              ["receipt", "refund"].includes(e.kind) &&
              !e.voided_by &&
              !state.current._raw.entries.some(
                (x) =>
                  x.kind === "reconcile" &&
                  !x.voided_by &&
                  x.details.sourceEntryId === e.id,
              ),
          );
        input = `<select name="${name}" required><option value="">请选择</option>${items.map((x) => `<option value="${x.id}">${escapeHtml(x.action || x.kind)} · ${escapeHtml(x.recordedAt || x.recorded_at)}</option>`).join("")}</select>`;
      } else if (type === "textarea")
        input = `<textarea name="${name}" required rows="3"></textarea>`;
      else
        input = `<input name="${name}" type="${type}" ${type === "checkbox" ? "" : "required"} ${type === "number" ? (name === "amount" ? 'min="0.01" step="0.01"' : 'min="0.0001" step="0.0001"') : ""} ${type === "datetime-local" ? 'step="1"' : ""}>`;
      return type === "checkbox"
        ? `<label class="check-field">${input}<span>${label}</span></label>`
        : `<label class="field"><span>${label}</span>${input}</label>`;
    })
    .join("");
  const d = state.current._raw.agreement;
  if (action === "quotes") {
    const f = $("#special-form");
    f.elements.currency.value = d.quote.deposit.currency;
    f.elements.rate.value = flat(d).fxRate;
    f.elements.publishedAt.value = localInput(d.quote.fx?.publishedAt);
    const sync = () => {
      const usd = f.elements.currency.value === "USD";
      for (const name of ["rate", "publishedAt"]) {
        f.elements[name].disabled = !usd;
        f.elements[name].required = usd;
        f.elements[name].closest(".field").hidden = !usd;
      }
    };
    f.elements.currency.addEventListener("change", sync);
    sync();
  }
  if (action === "reschedules") {
    const f = $("#special-form");
    f.elements.startsAt.value = localInput(d.schedule.startsAt);
    f.elements.dueAt.value = localInput(d.schedule.dueAt).slice(0, 10);
  }
  installSelects();
  wireDialogs();
  showDialog($("#special-dialog"));
}
$("#special-actions").addEventListener("click", (e) => {
  const b = e.target.closest("[data-special]");
  if (b) openSpecial(b.dataset.special);
});
$("#special-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = event.currentTarget;
  if (!validateForm(f)) return;
  await checked(
    async () => {
      const values = Object.fromEntries(new FormData(f)),
        r = state.current;
      let payload = { reason: values.reason },
        tail = specialAction;
      if (
        ["reschedules", "quotes", "billing-basis-corrections"].includes(
          specialAction,
        )
      ) {
        const d = structuredClone(r._raw.agreement);
        for (const key of [
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
          delete d[key];
        if (specialAction === "reschedules")
          d.schedule = {
            startsAt: inputUtc(values.startsAt),
            dueAt: inputUtc(values.dueAt),
          };
        if (specialAction === "quotes")
          d.quote = {
            deposit: { currency: values.currency },
            fx:
              values.currency === "USD"
                ? {
                    rateUnits: fxUnits(values.rate),
                    rateScale: 10000,
                    publishedAt: inputUtc(values.publishedAt),
                    source: "中国银行美元现汇买入价",
                  }
                : null,
          };
        if (specialAction === "billing-basis-corrections")
          d.billingBasis = {
            value: {
              currency: values.currency,
              amountMinor: minor(values.amount, "billingBasis.value"),
            },
          };
        payload.draft = d;
      } else if (specialAction === "preservation") {
        payload.enabled = f.elements.enabled.checked;
      } else if (specialAction === "reconcile") {
        tail = "finances/reconcile";
        payload = {
          sourceEntryId: values.sourceEntryId,
          purpose: values.purpose,
          quoteId: values.quoteId || null,
          assessmentId: values.assessmentId || null,
          note: values.reason,
        };
      } else if (specialAction === "correction") {
        payload.eventId = values.eventId;
        payload.expectedAssetVersion = r._raw.asset.assetVersion;
        payload.confirmedNotShipped = f.elements.confirmedNotShipped.checked;
      } else if (specialAction === "reversal") {
        const entry = r._raw.entries.find((e) => e.id === values.entryId);
        tail = "finances/reversal";
        payload = {
          money: {
            currency: entry.currency,
            amountMinor: String(entry.amount_minor),
          },
          note: values.reason,
          occurredAt: new Date(loanClock()).toISOString(),
          reversesEntryId: entry.id,
          confirmedRecordingError: f.elements.confirmedRecordingError.checked,
        };
      } else if (values.occurredAt)
        Object.assign(payload, {
          occurredAt: inputUtc(values.occurredAt),
          evidence: values.evidence,
        });
      const result = await command(tail, payload, event.submitter, f);
      if (result) $("#special-dialog").close();
    },
    null,
    f,
  );
});
$("#configuration").addEventListener("click", () =>
  checked(async () => {
    const [settings, grants, calendar] = await Promise.all([
      api("/api/sample-admin/settings"),
      api("/api/sample-admin/grants"),
      api("/api/sample-admin/calendar"),
    ]);
    const cf = $("#calendar-form");
    for (const key of ["validFrom", "validUntil", "holidays", "workingDates"])
      cf.elements[key].value = Array.isArray(calendar.calendar?.[key])
        ? calendar.calendar[key].join("\n")
        : calendar.calendar?.[key] || "";
    const f = $("#settings-form");
    f.elements.CNY.value = settings.settings?.bankAccounts.CNY || "";
    f.elements.USD.value = settings.settings?.bankAccounts.USD || "";
    $("#grant-list").innerHTML = grants.admins
      .map(
        (a) =>
          `<p class="fine">${escapeHtml(a.username)}${a.is_owner ? " · 主管理员" : ` <button type="button" class="text-button" data-grant="${a.id}" data-enabled="${!a.granted_at || !!a.revoked_at}">${a.granted_at && !a.revoked_at ? "撤销样机权限" : "授予样机权限"}</button>`}</p>`,
      )
      .join("");
    showDialog($("#settings-dialog"));
  }),
);
$("#grant-list").addEventListener("click", (e) => {
  const b = e.target.closest("[data-grant]");
  if (b)
    checked(async () => {
      await api("/api/sample-admin/grants", {
        data: {
          userId: b.dataset.grant,
          enabled: b.dataset.enabled === "true",
        },
        key: crypto.randomUUID(),
      });
      $("#settings-dialog").close();
      toast("样机权限已更新");
    }, b);
});
$("#settings-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  await checked(
    async () => {
      await api("/api/sample-admin/settings", {
        data: {
          bankAccounts: {
            CNY: f.elements.CNY.value || null,
            USD: f.elements.USD.value || null,
          },
          templateRevision: "RM01-MAIL-v1",
        },
        key: crypto.randomUUID(),
      });
      $("#settings-dialog").close();
      toast("收款配置已保存新版本");
    },
    e.submitter,
    f,
  );
});
let documentPoll = false;
async function refreshDocumentStatus() {
  const r = state.current,
    revision = r?._raw.currentAgreementRevision;
  if (documentPoll || !revision || state.role === "user" || document.hidden)
    return;
  if (
    ["ready", "failed_permanent", "cancelled"].includes(
      r.versions.find((v) => v.revision === revision)?.status,
    )
  )
    return;
  documentPoll = true;
  try {
    const result = await api(
      `/api/sample-admin/requests/${r.id}/versions/${revision}/status`,
    );
    if (
      state.current?.id !== r.id ||
      state.current._raw.currentAgreementRevision !== revision
    )
      return;
    const version = r.versions.find((v) => v.revision === revision);
    if (version) version.status = result.job.status;
    $("#pdf-status").textContent =
      `R${revision} · ${result.job.status}${result.job.message ? "：" + result.job.message : ""}`;
    $("#current-revision").textContent = $("#pdf-status").textContent;
    $("#download-agreement").disabled = result.job.status !== "ready";
  } catch (e) {
    if (e.status === 401 || e.status === 403) deny(e);
    else if (state.current?.id === r.id)
      $("#pdf-status").textContent =
        `R${revision} · 状态查询未完成：${e.message}`;
  } finally {
    documentPoll = false;
  }
}
setInterval(refreshDocumentStatus, 5000);
async function openPublicApplication() {
  $("#admin-view").hidden = true;
  $("#admin-denied").hidden = true;
  $("#application-load-error").hidden = true;
  try {
    await openApplication(null, () => location.replace("/cases/"));
  } catch {
    $("#application-load-error").hidden = false;
  }
}
$("#retry-application").addEventListener("click", openPublicApplication);
async function initialize() {
  for (const select of $$("[data-model-options]"))
    for (const model of MODELS) select.add(new Option(model, model));
  installSelects();
  wireDialogs();
  try {
    if (location.hash === "#apply") {
      await route();
      return;
    }
    const auth = await api("/api/session");
    state.user = auth.user;
    state.role = auth.user?.sampleAccess?.canManage
      ? auth.user.is_owner
        ? "owner"
        : "admin"
      : "user";
    $(".admin-identity").children[0].textContent =
      auth.user?.username || "未登录";
    $(".admin-identity").children[1].textContent =
      state.role === "owner"
        ? "主管理员"
        : state.role === "admin"
          ? "批复管理员"
          : "无样机权限";
    $("#configuration").hidden = state.role !== "owner";
    if (state.role === "user") {
      deny(
        Object.assign(new Error("请使用已授权的管理员账号登录"), {
          status: 403,
        }),
      );
      return;
    }
    $("#admin-view").hidden = false;
    await syncClock();
    if (!clock.server) return;
    await route();
    setInterval(syncClock, 60000);
    setInterval(refreshCountdowns, 10000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) syncClock();
    });
  } catch (e) {
    deny(e);
  }
}
initialize();

$("#calendar-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const f = event.currentTarget;
  if (!validateForm(f)) return;
  const dates = (key) =>
    f.elements[key].value.split(/[\s,，]+/).filter(Boolean);
  await checked(
    async () => {
      await api("/api/sample-admin/calendar", {
        data: {
          validFrom: f.elements.validFrom.value,
          validUntil: f.elements.validUntil.value,
          holidays: dates("holidays"),
          workingDates: dates("workingDates"),
        },
        key: crypto.randomUUID(),
      });
      toast("工作日历已保存；后台补查将更新此前缺失的退款截止日期");
    },
    event.submitter,
    f,
  );
});
