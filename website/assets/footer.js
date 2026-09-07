(function () {
  const popover = document.querySelector('[data-contact-popover]');
  const toggle = document.querySelector('[data-contact-toggle]');
  const close = document.querySelector('[data-contact-close]');

  function updateLanguage() {
    const lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';
    const labels = window.RM_SOFT.ui[lang];
    document.querySelectorAll('[data-footer-text]').forEach((element) => {
      const value = labels[element.dataset.footerText];
      element.replaceChildren(...value.split(/(RMinte(?:\s+AI\b)?|RM-01)/g).filter(Boolean).map((part) => {
        if (!/^(RMinte(?:\s+AI\b)?|RM-01)$/.test(part)) return document.createTextNode(part);
        const span = document.createElement('span');
        span.className = 'rm-mark';
        span.textContent = part;
        return span;
      }));
    });
    close.setAttribute('aria-label', lang === 'zh' ? '关闭' : 'Close');
  }

  function setOpen(open) {
    popover.classList.toggle('active', open);
    popover.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!popover.classList.contains('active'));
  });
  popover.addEventListener('click', (event) => event.stopPropagation());
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  updateLanguage();
})();
