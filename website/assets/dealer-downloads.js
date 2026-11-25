(() => {
  const dialog = document.querySelector(".dealer-dialog");
  const title = document.querySelector("#dealerDialogTitle");
  const message = document.querySelector("#dealerDialogMessage");
  const help = document.querySelector("[data-dealer-help]");
  const login = document.querySelector("[data-case-login]");
  let opener;
  let lang = RM_I18N.initial();
  let state = "login";
  const COPY = {
    login: {
      title: { zh: "下载前请先登录", en: "Sign in to download" },
      message: {
        zh: "请先登录，再下载经销商资料。",
        en: "Please sign in first to download dealer resources.",
      },
      help: {
        zh: "前往应用案例页，使用 RMinte 专属账号即可登录。",
        en: "Head to the Application Cases page and sign in with your RMinte account.",
      },
    },
    forbidden: {
      title: { zh: "没有权限", en: "Access denied" },
      message: {
        zh: "当前账号暂未开通经销商资料下载权限，请联系对接人员协助开启。",
        en: "This account does not yet have access to dealer downloads. Please contact your RMinte representative to enable it.",
      },
      help: {
        zh: "权限开通后，可直接重新下载，无需再次登录。",
        en: "Once access is granted, try downloading again. You do not need to sign in again.",
      },
    },
    unavailable: {
      title: { zh: "暂时无法下载", en: "Download unavailable" },
      message: {
        zh: "资料暂时不可用，请稍后重试。",
        en: "This document is temporarily unavailable. Please try again later.",
      },
      help: {
        zh: "如需协助，请联系对接人员。",
        en: "For assistance, please contact your RMinte representative.",
      },
    },
    password: {
      title: {
        zh: "请先修改初始密码",
        en: "Change your initial password first",
      },
      message: {
        zh: "请前往管理后台修改初始密码，然后重新登录下载。",
        en: "Change your initial password in the admin console, then sign in again to download.",
      },
      help: {
        zh: "如需协助，请联系对接人员。",
        en: "For assistance, please contact your RMinte representative.",
      },
    },
  };
  function render() {
    for (const [element, key] of [
      [title, "title"],
      [message, "message"],
      [help, "help"],
    ]) {
      const pair = COPY[state][key];
      element.dataset.zh = pair.zh;
      element.dataset.en = pair.en;
      element.textContent = RM_I18N.text(pair, lang);
    }
    login.href = `../cases/?lang=${lang}#access`;
    login.hidden = state !== "login";
    if (opener)
      document.querySelector("#requestedFile").textContent = opener
        .closest(".download-row")
        .querySelector("h3").textContent;
  }
  window.addEventListener("download-language-change", (event) => {
    lang = event.detail;
    render();
  });
  const list = document.querySelector("#dealer-list");
  const STATUS = {
    zh: ["暂无该语言的资料", "资料列表暂时无法读取", "多语言"],
    en: [
      "No resources in this language",
      "The resource list is unavailable",
      "Multilingual",
    ],
    ja: ["この言語の資料はありません", "資料一覧を読み込めません", "多言語"],
    ko: [
      "이 언어의 자료가 없습니다",
      "자료 목록을 불러올 수 없습니다",
      "다국어",
    ],
    es: [
      "No hay documentos en este idioma",
      "La lista de documentos no está disponible",
      "Multilingüe",
    ],
    fr: [
      "Aucun document dans cette langue",
      "La liste des documents est indisponible",
      "Multilingue",
    ],
  };
  let catalogController;
  async function loadCatalog() {
    catalogController?.abort();
    const controller = new AbortController();
    catalogController = controller;
    const requestedLanguage = lang;
    try {
      const response = await fetch("/api/dealer-materials?lang=" + lang, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Catalog unavailable");
      const { files } = await response.json();
      if (controller !== catalogController) return;
      list.replaceChildren();
      if (!files.length) {
        const p = document.createElement("p");
        p.className = "dealer-lead";
        p.textContent = STATUS[requestedLanguage][0];
        list.append(p);
      }
      for (const f of files) {
        const row = document.createElement("article");
        row.className = "download-row";
        row.innerHTML =
          '<span class="download-filetype" aria-hidden="true">PDF</span><div class="download-copy"><h3></h3><p></p></div><a class="download-action" data-dealer-download><span></span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 5v14m-5-5 5 5 5-5"/></svg></a>';
        const heading = row.querySelector("h3");
        heading.textContent = f.title;
        heading.id = "dealer-title-" + f.id;
        const language =
          f.fileLanguage === "multi"
            ? STATUS[requestedLanguage][2]
            : new Intl.DisplayNames([requestedLanguage], {
                type: "language",
              }).of(f.fileLanguage);
        row.querySelector("p").textContent =
          "PDF · " + language + " · " + (f.size / 1048576).toFixed(1) + " MB";
        const link = row.querySelector("a");
        link.href = f.downloadUrl;
        link.dataset.fileName = f.fileName;
        link.querySelector("span").textContent = RM_I18N.text(
          { zh: "下载", en: "Download" },
          requestedLanguage,
        );
        link.querySelector("span").id = "dealer-action-" + f.id;
        link.setAttribute(
          "aria-labelledby",
          "dealer-action-" + f.id + " " + heading.id,
        );
        list.append(row);
      }
      window.dispatchEvent(new CustomEvent("download-resources-change"));
    } catch (e) {
      if (e.name === "AbortError") return;
      list.replaceChildren();
      const p = document.createElement("p");
      p.className = "dealer-lead";
      p.textContent = STATUS[requestedLanguage][1];
      list.append(p);
    }
  }
  window.addEventListener("download-language-change", loadCatalog);
  loadCatalog();
  list.addEventListener("click", async (event) => {
    const link = event.target.closest("[data-dealer-download]");
    if (!link) return;
    event.preventDefault();
    if (link.getAttribute("aria-busy") === "true") return;
    opener = link;
    link.setAttribute("aria-busy", "true");
    try {
      // The download request itself checks the current case-page session; no cached login decision.
      const response = await fetch(link.href, {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!response.ok) {
        state = response.status === 401 ? "login" : "unavailable";
        if (response.status === 403) {
          const { code } = await response.json();
          state =
            code === "dealer_download_forbidden"
              ? "forbidden"
              : code === "password_change_required"
                ? "password"
                : "unavailable";
        }
        render();
        dialog.showModal();
        document.querySelector("[data-dealer-close]").focus();
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const download = document.createElement("a");
      download.href = url;
      download.download = link.dataset.fileName;
      download.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      state = "unavailable";
      render();
      dialog.showModal();
      document.querySelector("[data-dealer-close]").focus();
    } finally {
      link.removeAttribute("aria-busy");
    }
  });
  document
    .querySelectorAll("[data-dealer-close]")
    .forEach((button) =>
      button.addEventListener("click", () => dialog.close()),
    );
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (
      event.clientX < b.left ||
      event.clientX > b.right ||
      event.clientY < b.top ||
      event.clientY > b.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () =>
    opener?.focus({ preventScroll: true }),
  );
})();
