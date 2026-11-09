export function createUI(
  root = document,
  { translate = (value) => value } = {},
) {
  const $ = (s) => root.querySelector(s),
    $$ = (s) => [...root.querySelectorAll(s)];
  const selectControls = new Map();
  let openSelect = null,
    selectSequence = 0,
    listenersInstalled = false;
  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const icon = (name) =>
    `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  function rawFieldProblem(el) {
    const v = el.validity;
    if (v.valueMissing || (el.required && !el.value.trim()))
      return el.tagName === "SELECT"
        ? "请选择此项"
        : el.type === "checkbox"
          ? "请勾选此项"
          : "请填写此项";
    if (v.typeMismatch && el.type === "email") return "请填写有效的邮箱地址";
    if (v.typeMismatch || v.patternMismatch)
      return "格式不符，请检查后重新填写";
    if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch)
      return "数值超出允许范围";
    if (v.badInput) return "输入内容无法识别";
    return "请检查此项";
  }
  function fieldProblem(el) {
    return translate(rawFieldProblem(el));
  }
  function clearFieldError(el) {
    el.removeAttribute("aria-invalid");
    const note = el
      .closest("label, .field")
      ?.querySelector(".field-error[data-auto]");
    if (note) {
      const ids = (el.getAttribute("aria-describedby") || "")
        .split(" ")
        .filter((id) => id && id !== note.id);
      if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
      else el.removeAttribute("aria-describedby");
      note.remove();
    }
  }
  function validateForm(form, elements = [...form.elements]) {
    elements.forEach(clearFieldError);
    const bad = elements.filter(
      (el) =>
        el.willValidate &&
        (!el.validity.valid || (el.required && !el.value.trim())),
    );
    bad.forEach((el) => {
      if (el.tagName === "SELECT") {
        el.checkValidity();
        return;
      }
      const host = el.closest("label, .field") || el.parentElement;
      const note = document.createElement("p");
      note.className = "field-error";
      note.dataset.auto = "";
      note.setAttribute("role", "alert");
      note.id = `${form.id || "form"}-error-${[...form.elements].indexOf(el)}`;
      note.textContent = fieldProblem(el);
      host.append(note);
      el.setAttribute("aria-invalid", "true");
      el.setAttribute(
        "aria-describedby",
        [el.getAttribute("aria-describedby"), note.id]
          .filter(Boolean)
          .join(" "),
      );
    });
    const first = bad[0];
    if (first)
      (first.tagName === "SELECT"
        ? first.closest(".select-control")?.querySelector(".select-trigger")
        : first
      )?.focus();
    if (!form.dataset.inlineValidation) {
      form.dataset.inlineValidation = "on";
      form.addEventListener("input", (event) => clearFieldError(event.target));
      form.addEventListener("change", (event) => clearFieldError(event.target));
    }
    return bad.length === 0;
  }
  function refreshSelects(scope = document) {
    selectControls.forEach((control, select) => {
      if (scope.contains(select)) control.sync();
    });
  }
  function installSelects() {
    $$("select:not([data-enhanced])").forEach((select) => {
      const index = ++selectSequence;
      select.dataset.enhanced = "true";
      const label = select.closest(".field");
      const labelText = label.querySelector(":scope > span");
      labelText.id ||= `select-label-${index}`;
      const wrapper = document.createElement("div");
      wrapper.className = "select-control";
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.id = `select-trigger-${index}`;
      trigger.className = "select-trigger";
      trigger.setAttribute("role", "combobox");
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-labelledby", labelText.id);
      trigger.innerHTML =
        '<span></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
      const menu = document.createElement("div");
      menu.id = `select-options-${index}`;
      menu.className = "select-options";
      menu.hidden = true;
      menu.setAttribute("role", "listbox");
      menu.setAttribute("aria-labelledby", labelText.id);
      trigger.setAttribute("aria-controls", menu.id);
      select.before(wrapper);
      wrapper.append(select, trigger, menu);
      select.hidden = true;
      select.tabIndex = -1;
      select.setAttribute("aria-hidden", "true");
      label.htmlFor = trigger.id;
      const fieldError = document.createElement("p");
      if (fieldError) {
        fieldError.id = `select-error-${index}`;
        fieldError.className = "field-error";
        fieldError.hidden = true;
        fieldError.setAttribute("role", "alert");
        label.append(fieldError);
        trigger.setAttribute("aria-describedby", fieldError.id);
      }
      let options = [],
        optionSignature = "";
      function rebuildOptions() {
        const signature = [...select.options]
          .map((o) => o.value + "\0" + o.textContent)
          .join("\n");
        if (signature === optionSignature) return;
        optionSignature = signature;
        menu.replaceChildren();
        options = [...select.options].map((option) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "select-option";
          button.tabIndex = -1;
          button.setAttribute("role", "option");
          button.dataset.value = option.value;
          button.innerHTML = `<span>${escapeHtml(option.textContent)}</span>${icon("check")}`;
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            select.value = option.value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
            close(true);
          });
          menu.append(button);
          return button;
        });
      }
      function sync() {
        rebuildOptions();
        trigger.disabled = select.disabled;
        if (fieldError && !select.validity.valueMissing) {
          fieldError.hidden = true;
          fieldError.textContent = "";
          trigger.removeAttribute("aria-invalid");
        }
        trigger.querySelector("span").textContent =
          select.selectedOptions[0]?.textContent || "";
        trigger.dataset.empty = String(!select.value);
        options.forEach((button) => {
          const chosen = button.dataset.value === select.value;
          button.setAttribute("aria-selected", String(chosen));
          button.querySelector("svg").toggleAttribute("hidden", !chosen);
        });
      }
      function close(focus = false) {
        menu.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
        if (openSelect?.select === select) openSelect = null;
        if (focus) trigger.focus({ preventScroll: true });
      }
      function open() {
        if (trigger.disabled) return;
        openSelect?.close();
        const area =
          wrapper.closest(".application-content") || document.documentElement;
        const box = trigger.getBoundingClientRect(),
          bounds = area.getBoundingClientRect();
        const below = Math.min(innerHeight, bounds.bottom) - box.bottom - 12;
        const above = box.top - Math.max(0, bounds.top) - 12;
        const upward =
          below < Math.min(240, options.length * 44 + 8) && above > below;
        wrapper.dataset.direction = upward ? "up" : "down";
        menu.style.maxHeight = `${Math.max(80, Math.min(280, upward ? above : below))}px`;
        menu.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
        openSelect = { select, wrapper, close };
        (
          options.find(
            (option) => option.getAttribute("aria-selected") === "true",
          ) || options[0]
        ).focus({ preventScroll: true });
      }
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        menu.hidden ? open() : close();
      });
      wrapper.addEventListener("keydown", (event) => {
        const optionIndex = options.indexOf(
          root.activeElement || document.activeElement,
        );
        if (event.key === "Escape" && !menu.hidden) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
          return;
        }
        if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          if (menu.hidden) {
            open();
            return;
          }
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? options.length - 1
                : (optionIndex +
                    (event.key === "ArrowDown" ? 1 : -1) +
                    options.length) %
                  options.length;
          options[next].focus();
        }
        if (event.key === "Tab" && !menu.hidden) close(true);
      });
      select.addEventListener("change", sync);
      select.addEventListener("invalid", (event) => {
        event.preventDefault();
        trigger.focus();
        const message = fieldError || $("#form-message");
        message.hidden = false;
        message.textContent = translate("请选择此项");
        if (fieldError) trigger.setAttribute("aria-invalid", "true");
      });
      selectControls.set(select, { sync, close });
      sync();
    });
    if (listenersInstalled) return;
    listenersInstalled = true;
    document.addEventListener("pointerdown", (event) => {
      if (openSelect && !event.composedPath().includes(openSelect.wrapper))
        openSelect.close();
    });
    document.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape" && openSelect) {
          event.preventDefault();
          event.stopPropagation();
          openSelect.close(true);
        }
      },
      true,
    );
  }
  function showDialog(dialog) {
    dialog.querySelectorAll("[data-command-error]").forEach((el) => {
      el.hidden = true;
    });
    dialog.toggleAttribute("data-nested", !!root.querySelector("dialog[open]"));
    if (!dialog.open) dialog.showModal();
    const initial =
      dialog.querySelector("[autofocus]") || dialog.querySelector("[data-close]");
    initial?.focus({ preventScroll: true });
  }
  function wireDialogs() {
    $$("dialog:not([data-wired])").forEach((dialog) => {
      dialog.dataset.wired = "true";
      dialog
        .querySelectorAll("[data-close]")
        .forEach((b) => b.addEventListener("click", () => dialog.close()));
      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;
        const r = dialog.getBoundingClientRect();
        if (
          event.clientX < r.left ||
          event.clientX > r.right ||
          event.clientY < r.top ||
          event.clientY > r.bottom
        )
          dialog.close();
      });
    });
  }
  function serverErrors(form, errors, mapping = {}) {
    let first = null;
    for (const [path, message] of Object.entries(errors || {})) {
      const candidates = Object.keys(mapping).filter(
        (key) =>
          form.elements.namedItem(key) ||
          root.querySelector("#" + CSS.escape(key))?.form === form,
      );
      const name =
          candidates.find((key) => mapping[key] === path) ||
          candidates.find((key) => mapping[key].startsWith(path + ".")) ||
          path,
        el =
          form.elements.namedItem(name) ||
          root.querySelector("#" + CSS.escape(name));
      if (!el) continue;
      clearFieldError(el);
      const note = document.createElement("p");
      note.className = "field-error";
      note.dataset.auto = "";
      note.id = "server-error-" + crypto.randomUUID();
      note.textContent = translate(message);
      note.setAttribute("role", "alert");
      (el.closest("label,.field") || el.parentElement).append(note);
      el.setAttribute("aria-invalid", "true");
      el.setAttribute(
        "aria-describedby",
        [el.getAttribute("aria-describedby"), note.id]
          .filter(Boolean)
          .join(" "),
      );
      first ||=
        el.closest(".select-control")?.querySelector(".select-trigger") || el;
    }
    first?.focus();
    return !!first;
  }
  return {
    $,
    $$,
    validateForm,
    clearFieldError,
    installSelects,
    refreshSelects,
    showDialog,
    wireDialogs,
    serverErrors,
  };
}
