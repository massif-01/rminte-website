(function () {
  'use strict';
  const names = { zh: '中文', en: 'EN', ja: '日本語', ko: '한국어', es: 'Español', fr: 'Français' };
  const locales = { zh: 'zh-CN', en: 'en', ja: 'ja', ko: 'ko', es: 'es-ES', fr: 'fr-FR' };
  const valid = value => Object.hasOwn(names, value);
  const missing = new Set();
  const controls = [];
  function fromHash(hash = location.hash) { return hash.match(/^#(zh|en|ja|ko|es|fr)-/)?.[1] || null; }
  function initial() {
    const explicit = new URL(location.href).searchParams.get('lang');
    let stored;
    try { stored = localStorage.getItem('rm-soft-lang'); } catch { /* Storage may be disabled. */ }
    return [explicit, fromHash(), stored, window.RM_DEFAULT_LANG, 'en'].find(valid);
  }
  let current = initial();
  function text(pair, lang = current) {
    if (typeof pair === 'string' || pair == null) return pair || '';
    if (lang === 'zh' || lang === 'en') return pair[lang];
    const source = pair.en;
    const translated = window.RM_TRANSLATIONS?.[lang]?.[source];
    if (translated !== undefined) return translated;
    const key = `${lang}: ${source}`;
    if (!missing.has(key)) { missing.add(key); console.error('Missing translation', key); }
    return `⟦${key}⟧`;
  }
  function localize(value, lang = current) {
    if (!value || typeof value !== 'object') return value;
    if (Object.hasOwn(value, 'zh') && Object.hasOwn(value, 'en')) {
      if (typeof value.en === 'string') return text(value, lang);
      const walk = (zh, en) => {
        if (typeof en === 'string') return text({zh,en}, lang);
        if (Array.isArray(en)) return en.map((item,i) => walk(zh[i],item));
        return Object.fromEntries(Object.entries(en).map(([key,item]) => [key,walk(zh[key],item)]));
      };
      return walk(value.zh,value.en);
    }
    if (Array.isArray(value)) return value.map(item => localize(item,lang));
    return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,localize(item,lang)]));
  }
  function apply(lang) {
    if (!valid(lang)) throw new Error(`Unsupported language: ${lang}`);
    current = lang;
    synchronizeLinks();
    document.documentElement.lang = locales[lang];
    document.querySelectorAll('[data-i18n-attr]').forEach(element => {
      element.setAttribute(element.dataset.i18nAttr, text(element.dataset,lang));
    });
    ['aria-label', 'title', 'alt', 'placeholder', 'content'].forEach(attribute => {
      document.querySelectorAll(`[data-i18n-${attribute}-en]`).forEach(element => {
        element.setAttribute(attribute, text({zh: element.getAttribute(`data-i18n-${attribute}-zh`), en: element.getAttribute(`data-i18n-${attribute}-en`)},lang));
      });
    });
    document.querySelectorAll('[data-i18n-text][data-zh][data-en], title[data-zh][data-en]').forEach(element => { element.textContent = text(element.dataset,lang); });
    controls.forEach(({button,options}) => {
      button.querySelector('.language-name').textContent = names[lang];
      button.setAttribute('aria-label', names[lang]);
      options.forEach(option => option.setAttribute('aria-checked',String(option.dataset.language === lang)));
    });
  }
  function choose(lang) {
    if (!valid(lang)) return;
    try { localStorage.setItem('rm-soft-lang',lang); } catch { /* Selection still works for this page. */ }
    const url = new URL(location.href);
    url.searchParams.set('lang',lang);
    if (fromHash(url.hash)) url.hash = url.hash.replace(/^#(zh|en|ja|ko|es|fr)-/,`#${lang}-`);
    history.replaceState(history.state,'',url);
    apply(lang);
  }
  function mount(selector, onChange, beforeChange) {
    document.querySelectorAll(selector).forEach((button,index) => {
      const wrapper = document.createElement('div'); wrapper.className = 'language-picker';
      button.before(wrapper); wrapper.append(button);
      button.classList.add('language-picker-toggle');
      button.innerHTML = '<span class="language-name"></span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
      const menu = document.createElement('div'); menu.className = 'language-options'; menu.id = `language-options-${controls.length}-${index}`; menu.hidden = true; menu.setAttribute('role','menu');
      button.setAttribute('aria-haspopup','menu'); button.setAttribute('aria-controls',menu.id); button.setAttribute('aria-expanded','false');
      const options = Object.entries(names).map(([code,label]) => {
        const option = document.createElement('button'); option.type = 'button'; option.textContent = label; option.lang = locales[code]; option.dataset.language = code; option.setAttribute('role','menuitemradio'); option.tabIndex = -1;
        option.addEventListener('click',() => { const state = beforeChange?.(); close(); choose(code); onChange(code, state); button.focus(); }); menu.append(option); return option;
      });
      wrapper.append(menu); controls.push({button,options});
      function close() { menu.hidden = true; button.setAttribute('aria-expanded','false'); }
      function open() { menu.hidden = false; button.setAttribute('aria-expanded','true'); options.find(option => option.dataset.language === current).focus(); }
      button.addEventListener('click',event => { event.stopPropagation(); if (menu.hidden) open(); else close(); });
      button.addEventListener('keydown',event => { if (['ArrowDown','ArrowUp'].includes(event.key)) { event.preventDefault(); open(); } });
      wrapper.addEventListener('keydown',event => {
        if (event.key === 'Escape') { event.stopPropagation(); close(); button.focus(); }
        const index = options.indexOf(document.activeElement);
        if (index < 0) return;
        let next;
        if (event.key === 'ArrowDown') next = (index + 1) % options.length;
        if (event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = options.length - 1;
        if (next !== undefined) { event.preventDefault(); options[next].focus(); }
      });
      document.addEventListener('click',event => { if (!wrapper.contains(event.target)) close(); });
      wrapper.addEventListener('focusout',event => { if (!wrapper.contains(event.relatedTarget)) close(); });
    });
    apply(current);
  }
  // Keep real hrefs current, including copied links and opening a new tab.
  const propagatedLinks = new WeakMap();
  function synchronizeLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      const previous = propagatedLinks.get(link);
      const raw = previous && href === previous.generated ? previous.raw : href;
      if (!raw || raw.startsWith('#')) return;
      const url = new URL(raw, location.href);
      if (url.origin !== location.origin || !/^\/(?:index\.html)?$|^\/(?:models|gallery|downloads|guides)(?:\/|$)/.test(url.pathname)) return;
      if (valid(url.searchParams.get('lang')) || fromHash(url.hash)) return;
      url.searchParams.set('lang', current);
      propagatedLinks.set(link, {raw, generated: url.href});
      if (href !== url.href) link.setAttribute('href', url.href);
    });
  }
  new MutationObserver(synchronizeLinks).observe(document.documentElement, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['href']
  });
  window.RM_I18N = {names,locales,valid,initial,fromHash,text,localize,apply,choose,mount,missing};
  apply(current);
})();
