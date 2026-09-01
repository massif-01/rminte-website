(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  let lang = localStorage.getItem('rm-soft-lang') === 'en' ? 'en' : 'zh';

  function applyLanguage(nextLang) {
    lang = nextLang;
    localStorage.setItem('rm-soft-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    $$('[data-download-text]').forEach((element) => {
      const value = element.dataset[lang];
      if (value !== undefined) element.textContent = value;
    });

    $$('[data-download-lang-toggle]').forEach((button) => {
      button.textContent = lang === 'zh' ? 'EN' : '中';
      button.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
    });

    const menuButton = $('[data-menu-toggle]');
    if (menuButton) {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-label', lang === 'zh'
        ? (open ? '关闭菜单' : '打开菜单')
        : (open ? 'Close menu' : 'Open menu'));
    }

    document.title = 'RMinte - RM-01 - Portable AI Supercomputer - 泛灵人工智能';
  }

  function setupLanguage() {
    $$('[data-download-lang-toggle]').forEach((button) => {
      button.addEventListener('click', () => applyLanguage(lang === 'zh' ? 'en' : 'zh'));
    });
    applyLanguage(lang);
  }

  function setupMenu() {
    const overlay = $('#mobileOverlay');
    const button = $('[data-menu-toggle]');
    if (!overlay || !button) return;

    function setOpen(open) {
      overlay.classList.toggle('active', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      button.classList.toggle('active', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', lang === 'zh'
        ? (open ? '关闭菜单' : '打开菜单')
        : (open ? 'Close menu' : 'Open menu'));
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
