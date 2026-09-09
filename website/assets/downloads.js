(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let lang = RM_I18N.initial();

  function applyBrandFonts(root = document.body) {
    const textNodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;

    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || parent.closest('.rm-mark, [data-brand-font="ui"], script, style')) continue;
      if (/(?:RM-01|TianShanOS|TianshanOS|RMinte(?:\s+AI\b)?)(?![A-Za-z0-9_-]|\.[A-Za-z0-9])/.test(node.nodeValue)) textNodes.push(node);
    }

    textNodes.forEach((textNode) => {
      const parts = textNode.nodeValue.split(/(RM-01|TianShanOS|TianshanOS|RMinte(?:\s+AI\b)?)(?![A-Za-z0-9_-]|\.[A-Za-z0-9])/g);
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (/^(RM-01|TianShanOS|TianshanOS|RMinte(?:\s+AI\b)?)$/.test(part)) {
          const mark = document.createElement('span');
          mark.className = 'rm-mark';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      textNode.replaceWith(fragment);
    });
  }

  function applyLanguage(nextLang) {
    lang = nextLang;

    RM_I18N.apply(lang);

    $$('[data-download-text]').forEach((element) => {
      const value = RM_I18N.text(element.dataset, lang);
      if (value !== undefined) element.textContent = value;
    });
    applyBrandFonts();



    const menuButton = $('[data-menu-toggle]');
    if (menuButton) {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-label', RM_I18N.text({zh: open ? '关闭菜单' : '打开菜单', en: open ? 'Close menu' : 'Open menu'}, lang));
    }

    RM_I18N.apply(lang);
  }

  function setupLanguage() {
    RM_I18N.mount('[data-download-lang-toggle]', next => applyLanguage(next));
    applyLanguage(lang);
  }

  function setupMenu() {
    const overlay = $('#mobileOverlay');
    const button = $('[data-menu-toggle]');
    if (!overlay || !button) return;

    overlay.inert = true;
    function setOpen(open) {
      const restoreFocus = !open && overlay.contains(document.activeElement);
      overlay.inert = !open;
      if (open) requestAnimationFrame(() => $('[data-menu-close]')?.focus({ preventScroll: true }));
      else if (restoreFocus) button.focus({ preventScroll: true });
      overlay.classList.toggle('active', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      button.classList.toggle('active', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', RM_I18N.text({zh: open ? '关闭菜单' : '打开菜单', en: open ? 'Close menu' : 'Open menu'}, lang));
    }

    button.addEventListener('click', () => setOpen(!button.classList.contains('active')));
    $('[data-menu-close]')?.addEventListener('click', () => setOpen(false));
    $$('.mobile-links a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  setupLanguage();
  setupMenu();
})();
