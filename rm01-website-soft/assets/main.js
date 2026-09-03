(function () {
  const data = window.RM_SOFT;
  const imageBase = 'assets/images/';
  let lang = localStorage.getItem('rm-soft-lang') || 'zh';
  let revealObserver;
  let activeNavCleanup;

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

  function cardShell(content, className = '') {
    const outer = document.createElement('article');
    outer.className = `bezel ${className}`.trim();
    const inner = document.createElement('div');
    inner.className = 'card-core';
    inner.append(...content);
    outer.append(inner);
    return outer;
  }

  function textEl(tag, text, className) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    writeMarkedText(el, text);
    return el;
  }

  function setUiText() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $$('[data-ui]').forEach((el) => {
      const key = el.getAttribute('data-ui');
      writeMarkedText(el, ui(key));
    });
    const title = $('[data-hero-title]');
    if (title) {
      title.innerHTML = ui('heroTitle')
        .split('\n')
        .map((line) => `<span>${line}</span>`)
        .join('<br>');
    }
    $$('[data-lang-toggle]').forEach((button) => {
      button.textContent = ui('langToggle');
      button.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
    });
    const close = $('[data-menu-close]');
    if (close) close.textContent = ui('closeMenu');
  }

  function renderNav() {
    const desktop = $('#desktopNav');
    const mobile = $('#mobileNav');
    if (!desktop || !mobile) return;
    desktop.replaceChildren();
    mobile.replaceChildren();

    data.nav.forEach(([id, label, options = {}]) => {
      const desktopLink = document.createElement('a');
      desktopLink.href = options.href || `#${id}`;
      desktopLink.textContent = t(label);
      if (!options.href) {
        desktopLink.dataset.navTarget = id;
        desktopLink.addEventListener('click', (event) => {
          event.preventDefault();
          goToSection(id);
        });
      }
      desktop.append(desktopLink);

      const mobileLink = document.createElement('a');
      mobileLink.href = options.href || `#${id}`;
      mobileLink.textContent = t(label);
      if (!options.href) {
        mobileLink.addEventListener('click', (event) => {
          event.preventDefault();
          closeMenu();
          goToSection(id);
        });
      }
      mobile.append(mobileLink);
    });
  }

  function goToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    if (history.pushState) history.pushState(null, '', `#${id}`);
    else location.hash = id;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    $$('[data-nav-target]').forEach((link) => {
      link.classList.toggle('active', link.dataset.navTarget === id);
    });
  }

  function restoreScroll(top) {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    const restore = () => window.scrollTo(0, top);
    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(() => {
        restore();
        html.style.scrollBehavior = previousBehavior;
      });
    });
    [140, 360, 700].forEach((delay) => window.setTimeout(restore, delay));
  }

  function forceInitialTop() {
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    const restore = () => window.scrollTo(0, 0);
    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(() => {
        restore();
        html.style.scrollBehavior = previousBehavior;
      });
    });
    [80, 240, 520].forEach((delay) => window.setTimeout(restore, delay));
  }

  function restoreInitialLocation() {
    const id = window.location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) {
      forceInitialTop();
      return;
    }

    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    const restore = () => target.scrollIntoView({ block: 'start' });
    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(() => {
        restore();
        html.style.scrollBehavior = previousBehavior;
      });
    });
    [140, 360, 700].forEach((delay) => window.setTimeout(restore, delay));
    $$('[data-nav-target]').forEach((link) => {
      link.classList.toggle('active', link.dataset.navTarget === id);
    });
  }

  function renderMetrics() {
    const root = $('#heroMetrics');
    if (!root) return;
    root.replaceChildren(...data.metrics.map((metric, index) => {
      const item = document.createElement('div');
      item.className = 'metric';
      item.style.setProperty('--i', index);
      item.append(textEl('strong', metric.value), textEl('span', t(metric.label)));
      return item;
    }));
  }

  function renderPillars() {
    const root = $('#pillarGrid');
    if (!root) return;
    root.replaceChildren(...data.pillars.map((pillar, index) => {
      const number = textEl('span', String(index + 1).padStart(2, '0'), 'pillar-number');
      const card = cardShell([
        number,
        textEl('h3', t(pillar.title)),
        textEl('p', t(pillar.text))
      ], 'pillar-card reveal');
      card.dataset.revealDelay = String(index * 70);
      return card;
    }));
  }

  function renderModules() {
    const root = $('#moduleBento');
    if (!root) return;
    root.replaceChildren(...data.modules.map((module, index) => {
      const icon = document.createElement('div');
      icon.className = 'module-icon';
      const img = document.createElement('img');
      img.src = asset(module.icon);
      img.alt = '';
      icon.append(img);

      const spec = textEl('span', module.spec, 'module-spec');
      const card = cardShell([
        icon,
        textEl('span', `0${index + 1}`, 'module-number'),
        textEl('h3', t(module.name)),
        textEl('p', t(module.text)),
        spec
      ], 'module-card reveal');
      card.dataset.revealDelay = String(index * 60);
      return card;
    }));
  }

  function renderEngine() {
    const root = $('#engineRail');
    if (!root) return;
    root.replaceChildren(...data.engine.map((item, index) => {
      const card = cardShell([
        textEl('span', t(item.label), 'engine-label'),
        textEl('h3', t(item.title)),
        textEl('p', t(item.text))
      ], 'engine-card reveal');
      card.dataset.revealDelay = String(index * 90);
      return card;
    }));
  }

  function setupReveal() {
    if (revealObserver) revealObserver.disconnect();
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const delay = entry.target.dataset.revealDelay || '0';
        entry.target.style.transitionDelay = `${delay}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -58px 0px' });

    $$('.reveal').forEach((el) => revealObserver.observe(el));
  }

  function setupActiveNav() {
    if (activeNavCleanup) activeNavCleanup();
    const links = $$('[data-nav-target]');
    if (!links.length) return;
    const sections = data.nav
      .map(([id]) => document.getElementById(id))
      .filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle('active', link.dataset.navTarget === id);
      });
    };

    const updateActive = () => {
      const anchor = window.scrollY + Math.max(120, window.innerHeight * 0.34);
      let activeId = sections[0]?.id;

      sections.forEach((section) => {
        if (section.offsetTop <= anchor) activeId = section.id;
      });

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        activeId = sections[sections.length - 1]?.id || activeId;
      }

      if (activeId) setActive(activeId);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    const onHashChange = () => {
      const hashId = window.location.hash.slice(1);
      if (!hashId) return;
      if (sections.some((section) => section.id === hashId)) setActive(hashId);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    if (!window.location.hash && sections[0]) setActive(sections[0].id);
    updateActive();

    activeNavCleanup = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
      activeNavCleanup = undefined;
    };
  }

  function openMenu() {
    const overlay = $('#mobileOverlay');
    const button = $('[data-menu-toggle]');
    if (!overlay || !button) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    button.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    const overlay = $('#mobileOverlay');
    const button = $('[data-menu-toggle]');
    if (!overlay || !button) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    button.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
  }

  function setContactOpen(open) {
    const popover = $('[data-contact-popover]');
    const toggle = $('[data-contact-toggle]');
    if (!popover || !toggle) return;
    popover.classList.toggle('active', open);
    popover.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function closeContact() {
    setContactOpen(false);
  }

  function setupControls() {
    $$('[data-lang-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        const currentScroll = window.scrollY;
        lang = lang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('rm-soft-lang', lang);
        renderAll();
        restoreScroll(currentScroll);
      });
    });

    const menuButton = $('[data-menu-toggle]');
    if (menuButton) {
      menuButton.addEventListener('click', () => {
        if (menuButton.classList.contains('active')) closeMenu();
        else openMenu();
      });
    }

    const closeButton = $('[data-menu-close]');
    if (closeButton) closeButton.addEventListener('click', closeMenu);

    const contactToggle = $('[data-contact-toggle]');
    const contactClose = $('[data-contact-close]');
    const contactPopover = $('[data-contact-popover]');
    if (contactToggle && contactPopover) {
      contactToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        setContactOpen(!contactPopover.classList.contains('active'));
      });
      contactPopover.addEventListener('click', (event) => event.stopPropagation());
      document.addEventListener('click', closeContact);
    }
    if (contactClose) contactClose.addEventListener('click', closeContact);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        closeContact();
      }
    });
  }

  function setupLoopingMedia() {
    const videos = $$('video[data-loop-media]');
    if (!videos.length) return;

    videos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;

      const start = () => {
        const playback = video.play();
        if (playback) playback.catch(() => {});
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) start();
      else video.addEventListener('canplay', start, { once: true });

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && video.paused) start();
      });
    });
  }

  function setupOneShotMedia() {
    const videos = $$('video[data-once-media]');
    if (!videos.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    videos.forEach((video) => {
      const section = video.closest('.cartridge-section');
      const core = video.closest('.cartridge-video-core, .thermal-video-core, .teardown-film-core');
      const returnFirstFrame = video.hasAttribute('data-return-first-frame');
      let hasPlayed = false;
      let replayTimer;

      const showResult = () => {
        if (returnFirstFrame) {
          video.pause();
          video.currentTime = 0;
          return;
        }
        core?.classList.add('is-complete');
        section?.classList.add('is-complete');
      };

      const playOnce = (afterTransition = false) => {
        clearTimeout(replayTimer);
        video.pause();
        video.currentTime = 0;
        core?.classList.remove('is-complete');
        section?.classList.remove('is-complete');

        const start = () => {
          const playback = video.play();
          if (playback) playback.catch(showResult);
        };

        if (afterTransition) replayTimer = window.setTimeout(start, 460);
        else start();
      };

      const prepare = () => {
        section?.classList.add('motion-ready');
        if (reduceMotion) {
          showResult();
          return;
        }

        const observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.45)) return;
          observer.disconnect();
          if (!hasPlayed) {
            hasPlayed = true;
            playOnce();
          }
        }, { threshold: [0.45] });

        observer.observe(video);
      };

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) prepare();
      else video.addEventListener('loadedmetadata', prepare, { once: true });

      video.addEventListener('ended', showResult);
      core?.addEventListener('click', () => playOnce());
      core?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        playOnce();
      });
    });
  }

  function renderAll() {
    setUiText();
    renderNav();
    renderMetrics();
    renderPillars();
    renderModules();
    renderEngine();
    setupReveal();
    setupActiveNav();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderAll();
    setupControls();
    setupLoopingMedia();
    setupOneShotMedia();
    restoreInitialLocation();
  });
})();
