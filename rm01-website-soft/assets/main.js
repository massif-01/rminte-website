(function () {
  const data = window.RM_SOFT;
  const imageBase = 'assets/images/';
  let lang = localStorage.getItem('rm-soft-lang') || window.RM_DEFAULT_LANG || 'en';
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
  const markedTermPattern = /(?:RM-01|TianshanOS|EricLake|RMinte)/g;

  function writeMarkedText(el, text) {
    const value = text == null ? '' : String(text);
    if (!value.includes('RM-01') && !value.includes('TianshanOS') && !value.includes('EricLake') && !value.includes('RMinte')) {
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
      title.replaceChildren(...ui('heroTitle').split('\n').map((line) => textEl('span', line, 'hero-title-line')));
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
    const initialHash = window.location.hash;
    const restore = () => {
      if (window.location.hash === initialHash) window.scrollTo(0, 0);
    };
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
    const restore = () => {
      if (window.location.hash.slice(1) === id) target.scrollIntoView({ block: 'start' });
    };
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
      const card = cardShell([
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
      const spec = textEl('span', t(module.spec), 'module-spec');
      const card = cardShell([
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
    const brand = $('.site-shell .brand-mark');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      // Fade only the homepage logo over the first 240px of scrolling.
      const opacity = motion.matches ? 1 : Math.max(0, Math.min(1, 1 - window.scrollY / 240));
      brand.style.opacity = opacity;
      brand.inert = opacity === 0;

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
    motion.addEventListener('change', onScroll);
    onHashChange();
    if (!window.location.hash && sections[0]) setActive(sections[0].id);
    updateActive();

    activeNavCleanup = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
      motion.removeEventListener('change', onScroll);
      activeNavCleanup = undefined;
    };
  }

  function setupTeardownSequence() {
    const section = $('.teardown-section');
    const canvas = $('.teardown-canvas');
    if (!section || !canvas) return;

    const context = canvas.getContext('2d', { alpha: false, desynchronized: true }) || canvas.getContext('2d');
    if (!context) return;

    const frameCount = Number(canvas.dataset.frameCount) || 0;
    const framePad = Number(canvas.dataset.framePad) || 3;
    const framePrefix = canvas.dataset.framePrefix || '';
    const frameExt = canvas.dataset.frameExt || '.jpg';
    const frames = new Array(frameCount);
    const queued = new Set();
    const failed = new Set();
    const decodeQueue = [];
    const maxConcurrentDecodes = 3;
    let activeDecodes = 0;
    let targetFrame = 0;
    let displayedFrame = 0;
    let renderedFrame = -1;
    let animationRunning = false;
    let updatePending = false;
    let teardownActive = false;

    const frameSrc = (index) => {
      const number = String(index + 1).padStart(framePad, '0');
      return `${framePrefix}${number}${frameExt}`;
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      return { width, height };
    };

    const setTeardownActive = (active) => {
      if (teardownActive === active) return;
      teardownActive = active;
      document.body.classList.toggle('teardown-active', active);
    };

    const drawFrame = (image) => {
      const { width, height } = resizeCanvas();
      const sourceWidth = image.naturalWidth || image.width;
      const sourceHeight = image.naturalHeight || image.height;
      if (!sourceWidth || !sourceHeight) return;
      const imageRatio = sourceWidth / sourceHeight;
      const canvasRatio = width / height;
      const fitScale = imageRatio > canvasRatio
        ? width / sourceWidth
        : height / sourceHeight;
      const drawWidth = sourceWidth * fitScale;
      const drawHeight = sourceHeight * fitScale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      context.fillStyle = '#030404';
      context.fillRect(0, 0, width, height);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'medium';
      context.drawImage(image, x, y, drawWidth, drawHeight);
      canvas.classList.add('is-ready');
    };

    const nearestLoadedFrame = (index) => {
      for (let distance = 0; distance < frameCount; distance += 1) {
        const before = index - distance;
        const after = index + distance;
        if (before >= 0 && frames[before]) return before;
        if (after < frameCount && frames[after]) return after;
      }
      return -1;
    };

    const renderFrame = (index) => {
      const image = frames[index];
      if (!image) {
        const nearest = nearestLoadedFrame(index);
        if (nearest >= 0 && nearest !== renderedFrame) renderFrame(nearest);
        return;
      }
      drawFrame(image);
      renderedFrame = index;
      canvas.dataset.currentFrame = String(index + 1);
    };

    const decodeWithImageElement = (index) => new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = frameSrc(index);
    });

    const decodeFrame = async (index) => {
      try {
        let image;
        if (window.location.protocol !== 'file:' && 'createImageBitmap' in window && 'fetch' in window) {
          const response = await fetch(frameSrc(index), { cache: 'force-cache' });
          const blob = await response.blob();
          image = await createImageBitmap(blob);
        } else {
          image = await decodeWithImageElement(index);
          if (image.decode) await image.decode();
        }
        frames[index] = image;
        canvas.dataset.decodedFrames = String(frames.filter(Boolean).length);
        if (index === Math.round(targetFrame) || renderedFrame < 0) requestUpdate();
      } catch (error) {
        failed.add(index);
      }
    };

    const pumpQueue = () => {
      while (activeDecodes < maxConcurrentDecodes && decodeQueue.length) {
        const index = decodeQueue.shift();
        activeDecodes += 1;
        decodeFrame(index).finally(() => {
          activeDecodes -= 1;
          pumpQueue();
        });
      }
    };

    const queueFrame = (index, priority = false) => {
      if (index < 0 || index >= frameCount || frames[index] || queued.has(index) || failed.has(index)) return;
      queued.add(index);
      if (priority) decodeQueue.unshift(index);
      else decodeQueue.push(index);
      pumpQueue();
    };

    const loadAround = (index) => {
      for (let offset = -6; offset <= 9; offset += 1) queueFrame(index + offset, true);
    };

    const updateTargetFrame = () => {
      const scrollRange = section.offsetHeight - window.innerHeight;
      const rect = section.getBoundingClientRect();
      const progress = scrollRange > 0
        ? Math.min(1, Math.max(0, -rect.top / scrollRange))
        : 0;
      setTeardownActive(rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1);
      targetFrame = progress * (frameCount - 1);
      if (progress) canvas.dataset.progress = progress.toFixed(3);
      loadAround(Math.round(targetFrame));
      startAnimation();
      updatePending = false;
    };

    const animate = () => {
      const distance = targetFrame - displayedFrame;
      if (Math.abs(distance) < 0.035) {
        displayedFrame = targetFrame;
        renderFrame(Math.round(displayedFrame));
        animationRunning = false;
        return;
      }
      displayedFrame += distance * 0.24;
      renderFrame(Math.round(displayedFrame));
      window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animationRunning) return;
      animationRunning = true;
      window.requestAnimationFrame(animate);
    };

    const requestUpdate = () => {
      if (updatePending) return;
      updatePending = true;
      requestAnimationFrame(updateTargetFrame);
    };

    queueFrame(0, true);
    loadAround(0);

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    requestUpdate();
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

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
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
      const core = video.closest('.cartridge-video-core, .teardown-film-core');
      const returnFirstFrame = video.hasAttribute('data-return-first-frame');
      let playedThisVisit = false;
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
          entries.forEach((entry) => {
            // Rearm only after leaving the viewport, not while crossing the play threshold.
            if (!entry.isIntersecting) {
              video.pause();
              playedThisVisit = false;
              return;
            }
            if (entry.intersectionRatio >= 0.45 && !playedThisVisit) {
              playedThisVisit = true;
              playOnce();
            }
          });
        }, { threshold: [0, 0.45] });

        observer.observe(video);
      };

      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) prepare();
      else video.addEventListener('loadedmetadata', prepare, { once: true });

      video.addEventListener('ended', showResult);
      video.addEventListener('error', showResult);
      core?.addEventListener('click', () => playOnce());
      core?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        playOnce();
      });
    });
  }

  function setupThermalScroll() {
    const stage = $('.thermal-stage');
    const detail = $('.thermal-detail', stage);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => {
      frame = undefined;
      // Measure the layout position, unaffected by the detail's animated transform.
      const center = stage.getBoundingClientRect().top + detail.offsetTop + detail.offsetHeight / 2;
      const progress = motion.matches ? 1 : Math.max(0, Math.min(1,
        (window.innerHeight * 0.85 - center) / (window.innerHeight * 0.35)));
      const reveal = progress * progress * (3 - 2 * progress);
      detail.style.setProperty('--thermal-reveal', reveal.toFixed(3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    new ResizeObserver(schedule).observe(stage);
    update();
  }

  function setupSapphireScroll() {
    const section = $('#sapphire');
    const image = $('.sapphire-light-image', section);
    let frame;
    const update = () => {
      frame = undefined;
      if (!image.naturalWidth) return;
      const rect = image.getBoundingClientRect();
      const scale = Math.max(rect.width / image.naturalWidth, rect.height / image.naturalHeight);
      const positionY = parseFloat(getComputedStyle(image).objectPosition.split(' ')[1]) / 100;
      // Center of the gemstone in the original 2000 x 1333 photo, not the section center.
      const centerY = rect.top + (rect.height - image.naturalHeight * scale) * positionY + 574 * scale;
      const position = centerY / window.innerHeight;
      // Brighten only after the gemstone is visible; fade again as it passes the upper edge.
      const glow = Math.max(0, Math.min(1, (0.78 - position) / 0.28, (position - 0.08) / 0.28));
      image.style.setProperty('--sapphire-glow', glow.toFixed(3));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    image.addEventListener('load', schedule);
    schedule();
  }

  function setupCraftStory() {
    const section = $('#craft');
    const panels = $$('.craft-story-panel', section);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame;
    const update = () => {
      frame = undefined;
      const enabled = !motion.matches && window.innerHeight >= 740;
      section.classList.toggle('is-scroll-story', enabled);
      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const fraction = enabled ? Math.max(0, Math.min(1, -rect.top / distance)) : 0;
      const index = Math.min(panels.length - 1, Math.floor(fraction * panels.length));
      panels.forEach((panel, i) => {
        panel.classList.toggle('is-active', i === index);
        panel.inert = enabled && i !== index;
        if (enabled && i !== index) panel.setAttribute('aria-hidden', 'true');
        else panel.removeAttribute('aria-hidden');
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    update();
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
    setupThermalScroll();
    setupSapphireScroll();
    setupCraftStory();
    setupTeardownSequence();
    setupLoopingMedia();
    setupOneShotMedia();
    restoreInitialLocation();
  });
})();
