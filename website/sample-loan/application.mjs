import { createUI } from "./ui.mjs";
import { api, retryableCommand } from "./client.mjs";
import { MODELS, modelKey, applicationDTO, fields } from "./fields.mjs";
import { renderContract, escapeHtml } from "./contract.mjs";
let mounted;
async function mount() {
  const [response, catalogResponse] = await Promise.all([
    fetch("/sample-loan/application.json"),
    fetch("/sample-loan/locales.json"),
  ]);
  if (!response.ok) throw new Error("申请表暂时无法加载，请稍后重试");
  if (!catalogResponse.ok) throw new Error("申请表语言资源未能加载");
  const [definition, catalog] = await Promise.all([
    response.json(),
    catalogResponse.json(),
  ]);
  const host = document.createElement("div");
  host.dataset.sampleLoanHost = "";
  host.style.cssText =
    "color:var(--text-1);font:400 15px/1.7 var(--font-ui);-webkit-font-smoothing:antialiased;color-scheme:dark";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML =
    '<link rel="stylesheet" href="/sample-loan/preview.css?v=sample-4"><link rel="stylesheet" href="/sample-loan/operations.css?v=sample-4"><style>:host([data-input="pointer"]) button:focus-visible,:host([data-input="pointer"]) a:focus-visible{outline:none}</style>' +
    definition.html;
  document.body.append(host);
  try {
    await Promise.all(
      [...root.querySelectorAll("link[rel=stylesheet]")].map((link) =>
        link.sheet
          ? Promise.resolve()
          : new Promise((resolve, reject) => {
              link.onload = resolve;
              link.onerror = () => reject(new Error("申请表样式未能加载"));
            }),
      ),
    );
  } catch (e) {
    host.remove();
    throw e;
  }
  if (!document.querySelector("link[data-sample-font]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/fonts/noto-sans-sc.css?v=sample-20261026";
    link.dataset.sampleFont = "";
    document.head.append(link);
  }
  const syncInput = () => {
    if (document.documentElement.dataset.input === "pointer")
      host.dataset.input = "pointer";
    else delete host.dataset.input;
  };
  syncInput();
  new MutationObserver(syncInput).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-input"],
  });
  let language = "zh";
  const languages = ["en", "ja", "ko", "es", "fr"];
  const t = (value) =>
    language === "zh"
      ? value
      : catalog[value]?.[languages.indexOf(language)] || value;
  const originalNodes = [],
    originalAttrs = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeValue.trim()) originalNodes.push([node, node.nodeValue]);
  }
  for (const el of root.querySelectorAll("[placeholder],[aria-label]"))
    for (const attr of ["placeholder", "aria-label"])
      if (el.hasAttribute(attr))
        originalAttrs.push([el, attr, el.getAttribute(attr)]);
  function paintLanguage() {
    const candidate = document.documentElement.lang.split("-")[0];
    language = candidate === "zh"
      ? "zh"
      : languages.includes(candidate) ? candidate : "en";
    for (const [node, value] of originalNodes)
      node.nodeValue = value.replace(value.trim(), t(value.trim()));
    for (const [el, key, value] of originalAttrs)
      el.setAttribute(key, t(value));
    host.style.fontFamily = getComputedStyle(document.body).fontFamily;
  }
  paintLanguage();
  const {
      $,
      $$,
      validateForm,
      installSelects,
      refreshSelects,
      showDialog,
      wireDialogs,
      serverErrors,
    } = createUI(root, { translate: t }),
    form = $("#application-form"),
    dialog = $("#application-dialog"),
    confirmation = $("#confirmation-dialog"),
    nextKey = retryableCommand();
  let terms = null,
    pending = null,
    availability = "unknown",
    availabilityGeneration = 0,
    opener,
    afterClose;
  for (const select of $$("[data-model-options]"))
    for (const name of Object.values(MODELS))
      select.add(new Option(name, name));
  installSelects();
  wireDialogs();
  const error = (e) => {
    if (
      !serverErrors(form, e.fieldErrors, { ...fields, days: "requestedDays" })
    ) {
      $("#application-error").textContent = t(e.message);
      $("#application-error").hidden = false;
    }
  };
  function validateApplication() {
    if (!validateForm(form)) return false;
    if (Number(form.elements.days.value) <= 30) return true;
    error({ fieldErrors: { requestedDays: "申请天数须为1—30天的整数" } });
    return false;
  }
  function entity() {
    const company = form.elements.entity.value === "公司";
    $$("[data-application-company]").forEach((section) => {
      section.hidden = !company;
      section.querySelectorAll("input,textarea").forEach((input) => {
        input.disabled = !company;
      });
    });
    $("#applicant-name-label").textContent = t(
      company ? "经销商名称 / 公司全称" : "借用人姓名",
    );
    refreshSelects(form);
  }
  form.elements.entity.addEventListener("change", entity);
  entity();
  async function stock() {
    const generation = ++availabilityGeneration,
      key = modelKey(form.elements.model.value);
    const notice = $("#availability-notice");
    notice.hidden = !key;
    availability = "unknown";
    if (!key) return;
    notice.textContent = t("正在查询空闲样机…");
    try {
      const result = await api(
        "/api/sample-loans/availability?modelKey=" + encodeURIComponent(key),
      );
      if (generation !== availabilityGeneration) return;
      availability = result.availability;
    } catch {
      if (generation !== availabilityGeneration) return;
    }
    notice.dataset.available = String(availability === "available");
    notice.textContent =
      availability === "available"
        ? t("该型号目前有空闲样机，实际出借以管理员批复为准")
        : availability === "unavailable"
          ? t(
              "该样机目前仓库无空闲机器，是否仍继续申请？工作人员将根据后续库存安排批复",
            )
          : t("暂时无法查询库存，仍可提交申请，由工作人员核对");
  }
  form.elements.model.addEventListener("change", stock);
  async function loadTerms() {
    const result = await api("/api/sample-loans/terms");
    terms = result.terms;
    const list = $("#application-key-terms");
    list.innerHTML =
      language === "zh" ? terms.noticeHtml : terms.noticeLocales[language].html;
    return terms;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    $("#application-error").hidden = true;
    if (!validateApplication()) return;
    try {
      if (!terms) await loadTerms();
      await stock();
      if (!validateApplication()) return;
      const values = Object.fromEntries(new FormData(form));
      pending = applicationDTO(values, {
        termsVersion: terms.version,
        noticeVersion: terms.noticeVersion,
        accepted: true,
        noStockShown: availability === "unavailable",
        language,
      });
      $("#confirmation-summary").innerHTML = [
        ["借用主体", values.company],
        ["联系邮箱", values.email],
        ["申请型号", values.model],
        ["期望借用天数", values.days + " " + t("天")],
      ]
        .map(
          ([a, b]) =>
            `<div><dt>${escapeHtml(t(a))}</dt><dd>${escapeHtml(b)}</dd></div>`,
        )
        .join("");
      $("#confirmation-key-terms").innerHTML = $(
        "#application-key-terms",
      ).innerHTML;
      $("#confirmation-version").textContent = t("条款版本：") + terms.version;
      $("#confirmation-stock").hidden = availability !== "unavailable";
      $("#confirmation-stock").textContent = t(
        "该样机目前仓库无空闲机器，确认后仍提交申请，等待工作人员安排",
      );
      $("#confirm-application").disabled = false;
      showDialog(confirmation);
      $("#confirmation-title").focus();
    } catch (e) {
      error(e);
    }
  });
  $("#confirm-application").addEventListener("click", async () => {
    if (!pending) return;
    const button = $("#confirm-application");
    button.disabled = true;
    try {
      const result = await api("/api/sample-loans/applications", {
        data: pending,
        key: nextKey(pending),
      });
      confirmation.close();
      $("#success-id").textContent = result.publicNo;
      $("#success-email").textContent = pending.applicant.email;
      $("#success-days").textContent =
        pending.requestedDays + " " + t("天") + t("（期望天数）");
      pending = null;
      $("#application-content").hidden = true;
      $("#application-success").hidden = false;
      $("#application-success [data-close]").focus();
      form.reset();
      entity();
      refreshSelects(form);
    } catch (e) {
      confirmation.close();
      if (e.code === "TERMS_CHANGED") {
        terms = null;
        await loadTerms().catch(error);
      }
      error(e);
    } finally {
      button.disabled = false;
    }
  });
  confirmation.addEventListener("close", () => {
    pending = null;
  });
  dialog.addEventListener("close", () => {
    confirmation.close();
    opener?.focus({ preventScroll: true });
    afterClose?.();
    afterClose = null;
  });
  $$("[data-view-terms]").forEach((b) =>
    b.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        if (!terms) await loadTerms();
        const agreement = $("#agreement-document");
        agreement.lang = language === "zh" ? "zh-CN" : "en";
        agreement.innerHTML = renderContract(null, terms, [], language);
        $("#agreement-mode").textContent = t("申请前查看");
        $("#agreement-footer-note").textContent = t(
          "固定条款在申请时展示，实际交付信息由管理员批复填入。",
        );
        showDialog($("#agreement-dialog"));
      } catch (e) {
        error(e);
      }
    }),
  );
  return {
    async open(from, onClose) {
      afterClose = onClose;
      paintLanguage();
      entity();
      refreshSelects(form);
      opener = from || document.activeElement;
      $("#application-content").hidden = false;
      $("#application-success").hidden = true;
      showDialog(dialog);
      await loadTerms().catch(error);
      stock();
    },
  };
}
export async function openApplication(opener, onClose) {
  mounted ||= mount().catch((e) => {
    mounted = null;
    throw e;
  });
  await (await mounted).open(opener, onClose);
}
