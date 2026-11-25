(function () {
  const popover = document.querySelector('[data-contact-popover]');
  const toggle = document.querySelector('[data-contact-toggle]');
  const close = document.querySelector('[data-contact-close]');

  function updateLanguage() {
    const lang = document.documentElement.lang.split('-')[0];
    document.querySelectorAll('[data-footer-text]').forEach((element) => {
      const key = element.dataset.footerText;
      const value = RM_I18N.text({ zh: window.RM_SOFT.ui.zh[key], en: window.RM_SOFT.ui.en[key] }, lang);
      element.replaceChildren(...value.split(/(RMinte(?:\s+AI\b)?|RM-01)/g).filter(Boolean).map((part) => {
        if (!/^(RMinte(?:\s+AI\b)?|RM-01)$/.test(part)) return document.createTextNode(part);
        const span = document.createElement('span');
        span.className = 'rm-mark';
        span.textContent = part;
        return span;
      }));
    });
    close.setAttribute('aria-label', RM_I18N.text({zh: '关闭', en: 'Close'}, lang));
  }

  // The panel is modal. While it is open the page behind is dimmed by a layer (a click on it closes the panel) and made inert, so it
  // can neither be tabbed into nor clicked and is hidden from assistive technology. Focus lands on the close button and goes back to the
  // button that opened the panel.
  popover.setAttribute('aria-modal', 'true');
  popover.inert = true;
  const scrim = document.createElement('div');
  scrim.className = 'contact-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  popover.before(scrim);
  let behind = [];

  // Everything outside the branch that leads to the panel; what was already inert is left alone and stays so afterwards.
  function setBehind(inert) {
    if (!inert) {
      behind.forEach((element) => { element.inert = false; });
      behind = [];
      return;
    }
    for (let node = popover; node && node !== document.body; node = node.parentElement) {
      for (const sibling of node.parentElement.children) {
        if (sibling === node || sibling === scrim || sibling.inert || /^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(sibling.tagName)) continue;
        sibling.inert = true;
        behind.push(sibling);
      }
    }
  }

  function setOpen(open) {
    if (open === popover.classList.contains('active')) return;
    // A click on the dimming layer moves focus to the page body before the click arrives, so that counts as "still in the panel" too
    const focused = document.activeElement;
    const restoreFocus = !open && (popover.contains(focused) || focused === document.body || !focused);
    popover.inert = !open;
    popover.classList.toggle('active', open);
    scrim.classList.toggle('active', open);
    popover.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    setBehind(open);
    if (open) close.focus({ preventScroll: true });
    else if (restoreFocus) toggle.focus({ preventScroll: true });
  }

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!popover.classList.contains('active'));
  });
  popover.addEventListener('click', (event) => event.stopPropagation());
  close.addEventListener('click', () => setOpen(false));
  const applicationLink = popover.querySelector('[data-sample-loan-open]');
  const applicationError = popover.querySelector('[data-sample-load-error]');
  popover.querySelector('[data-sample-reload]').addEventListener('click', () => location.reload());
  applicationLink.addEventListener('click', async event => {
    event.preventDefault();
    if (applicationLink.getAttribute('aria-disabled') === 'true') return;
    applicationError.hidden = true;
    applicationLink.setAttribute('aria-disabled', 'true');
    try {
      const {openApplication} = await import('/sample-loan/application.mjs?v=copy-20261125');
      await openApplication(toggle);
      setOpen(false);
    } catch {
      applicationError.hidden = false;
    } finally {
      applicationLink.removeAttribute('aria-disabled');
    }
  });
  document.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
  new MutationObserver(updateLanguage).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  updateLanguage();
})();
