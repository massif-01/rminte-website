(function () {
  const data = window.RM_SOFT;
  const imageBase = '../assets/images/';
  let lang = localStorage.getItem('rm-soft-lang') || 'zh';
  let revealObserver;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const t = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.zh || '';
  };
  const ui = (key) => data.ui[lang][key] || data.ui.zh[key] || '';
  const asset = (file) => imageBase + file;
  const markedTermPattern = /(?:RM-01|TianshanOS)/g;

  function writeMarkedText(el, text) {
    const value = text == null ? '' : String(text);
    if (!value.includes('RM-01') && !value.includes('TianshanOS')) {
      el.textContent = value;
      return;
    }

    el.replaceChildren();
    let cursor = 0;
    value.replace(markedTermPattern, (match, index) => {
      if (index > cursor) el.append(document.createTextNode(value.slice(cursor, index)));
      const mark = document.createElement('span');
      mark.className = 'rm-mark';
      mark.textContent = match;
      el.append(mark);
      cursor = index + match.length;
      return match;
    });
    if (cursor < value.length) el.append(document.createTextNode(value.slice(cursor)));
  }

  function textEl(tag, text, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    writeMarkedText(el, text);
    return el;
  }

  function cardShell(content, className = '') {
    const outer = document.createElement('article');
    outer.className = className;
    const inner = document.createElement('div');
    inner.className = 'card-core';
    inner.append(...content);
    outer.append(inner);
    return outer;
  }

  function currentCase() {
    const id = document.body.dataset.caseId;
    return data.cases.find((item) => item.id === id) || data.cases[0];
  }

  function nextCase(item) {
    const index = data.cases.findIndex((candidate) => candidate.id === item.id);
    return data.cases[(index + 1) % data.cases.length];
  }

  function renderNav() {
    const nav = document.createElement('nav');
    nav.className = 'case-nav';
    nav.setAttribute('aria-label', '案例导航');

    const back = document.createElement('a');
    back.href = '../index.html#applications';
    back.className = 'case-back';
    back.append(textEl('span', '←'), textEl('span', ui('back')));

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'language-toggle';
    toggle.textContent = ui('langToggle');
    toggle.addEventListener('click', () => {
      lang = lang === 'zh' ? 'en' : 'zh';
      localStorage.setItem('rm-soft-lang', lang);
      render();
    });

    nav.append(back, toggle);
    return nav;
  }

  function renderHero(item) {
    const section = document.createElement('section');
    section.className = 'case-hero';

    const copy = document.createElement('div');
    copy.className = 'reveal';
    copy.append(
      textEl('p', t(item.category), 'eyebrow'),
      textEl('h1', t(item.name)),
      textEl('p', t(item.desc))
    );

    const stack = document.createElement('div');
    stack.className = 'partner-stack reveal';
    stack.dataset.revealDelay = '120';
    item.partners.forEach((partner) => {
      stack.append(textEl('span', t(partner), 'partner-pill'));
    });

    const inner = document.createElement('div');
    inner.className = 'case-hero-inner';
    inner.append(copy, stack);
    section.append(inner);
    return section;
  }

  function renderInfo(item) {
    const overview = cardShell([
      textEl('h2', ui('overview')),
      textEl('p', t(item.overview))
    ], 'case-info-card reveal');

    const deployment = cardShell([
      textEl('h2', ui('deployment')),
      textEl('p', t(item.deploy))
    ], 'case-info-card reveal');
    deployment.dataset.revealDelay = '90';

    const partners = cardShell([
      textEl('h2', ui('partners')),
      ...item.partners.map((partner) => textEl('p', t(partner), 'case-partner'))
    ], 'case-info-card reveal');
    partners.dataset.revealDelay = '140';

    const column = document.createElement('div');
    column.append(overview, deployment, partners);
    return column;
  }

  function renderGallery(item) {
    const aside = document.createElement('aside');
    aside.className = 'case-gallery reveal';
    aside.dataset.revealDelay = '160';
    aside.append(textEl('p', ui('evidence'), 'eyebrow'));

    if (!item.images.length) {
      const empty = cardShell([textEl('p', ui('noImages'), 'empty-gallery')], 'case-info-card');
      aside.append(empty);
      return aside;
    }

    item.images.forEach((image) => {
      const figure = document.createElement('figure');
      figure.className = 'bezel media-bezel';
      const core = document.createElement('div');
      core.className = 'bezel-core';
      const img = document.createElement('img');
      img.src = asset(image);
      img.alt = t(item.name);
      core.append(img);
      figure.append(core);
      aside.append(figure);
    });
    return aside;
  }

  function renderContent(item) {
    const section = document.createElement('section');
    section.className = 'case-content';

    const inner = document.createElement('div');
    inner.className = 'case-content-inner';
    inner.append(renderInfo(item), renderGallery(item));
    section.append(inner);

    const next = nextCase(item);
    const nextWrap = document.createElement('div');
    nextWrap.className = 'next-case';
    const link = document.createElement('a');
    link.className = 'cta-button';
    link.href = next.file;
    link.append(textEl('span', `${ui('nextCase')}: ${t(next.name)}`), textEl('span', '→', 'cta-dot'));
    nextWrap.append(link);
    section.append(nextWrap);
    return section;
  }

  function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    const inner = document.createElement('div');
    inner.className = 'footer-inner';
    const img = document.createElement('img');
    img.src = asset('img3.png');
    img.alt = 'RMinte';
    const text = document.createElement('div');
    text.append(textEl('p', ui('footer')), textEl('span', ui('copyright')));
    inner.append(img, text);
    footer.append(inner);
    return footer;
  }

  function setupReveal() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${entry.target.dataset.revealDelay || 0}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -58px 0px' });
    $$('.reveal').forEach((el) => revealObserver.observe(el));
  }

  function render() {
    const item = currentCase();
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = 'RMinte - RM-01 - Portable AI Supercomputer - 泛灵人工智能';

    const root = $('#caseRoot');
    root.replaceChildren(renderNav(), renderHero(item), renderContent(item), renderFooter());
    setupReveal();
  }

  document.addEventListener('DOMContentLoaded', render);
})();
