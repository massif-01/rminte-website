(function () {
  const galleryItems = [
    {
      src: '../assets/gallery/DSC00043.jpg', tone: 'dark', layout: 'portrait',
      label: { zh: '整机实拍 · 3/4 视角', en: 'Product photography · three-quarter view' },
      alt: { zh: 'RM-01 整机实拍 3/4 视角', en: 'Three-quarter product photograph of RM-01' }
    },
    {
      src: '../assets/gallery/DSC00010.jpg', tone: 'light', layout: 'portrait',
      label: { zh: '整机实拍 · 正面', en: 'Product photography · front view' },
      alt: { zh: 'RM-01 整机正面实拍', en: 'Front product photograph of RM-01' }
    },
    {
      src: '../assets/gallery/DSC00020.jpg', tone: 'light', layout: 'portrait',
      label: { zh: '整机实拍 · 亮场', en: 'Product photography · light studio' },
      alt: { zh: '亮场中的 RM-01 整机实拍', en: 'RM-01 product photograph in a light studio' }
    },
    {
      src: '../assets/gallery/DSC00030.jpg', tone: 'light', layout: 'portrait',
      label: { zh: '整机实拍 · 侧后方', en: 'Product photography · rear-side view' },
      alt: { zh: 'RM-01 整机侧后方实拍', en: 'Rear-side product photograph of RM-01' }
    },
    {
      src: '../assets/gallery/DSC0031.jpg', tone: 'light', layout: 'landscape',
      label: { zh: '接口与风道细节', en: 'Ports and airflow detail' },
      alt: { zh: 'RM-01 接口与散热风道细节', en: 'Close-up of RM-01 ports and thermal airflow channel' }
    },
    {
      src: '../assets/gallery/DSC00094.jpg', tone: 'dark', layout: 'landscape',
      label: { zh: 'CFe 卡槽细节', en: 'CFe card slot detail' },
      alt: { zh: 'RM-01 CFe 卡槽细节', en: 'Close-up of the RM-01 CFe card slot' }
    },
    {
      src: '../assets/gallery/DSC00120.jpg', tone: 'dark', layout: 'landscape',
      label: { zh: '蓝宝石状态灯', en: 'Sapphire status light' },
      alt: { zh: 'RM-01 蓝宝石状态灯细节', en: 'Close-up of the RM-01 sapphire status light' }
    },
    {
      src: '../assets/gallery/DSC00142.jpg', tone: 'dark', layout: 'portrait-detail',
      label: { zh: '铝合金工艺细节', en: 'Aluminum-alloy craftsmanship' },
      alt: { zh: 'RM-01 铝合金工艺细节', en: 'Close-up of RM-01 aluminum-alloy craftsmanship' }
    },
    {
      src: '../assets/gallery/DSC00150.jpg', tone: 'dark', layout: 'landscape',
      label: { zh: '设计与加工细节', en: 'Design and machining detail' },
      alt: { zh: 'RM-01 设计与加工细节', en: 'Close-up of RM-01 design and machining details' }
    },
    {
      src: '../assets/gallery/DSC00126.jpg', tone: 'dark', layout: 'landscape',
      label: { zh: '玻璃与装配工艺', en: 'Glass and assembly craftsmanship' },
      alt: { zh: 'RM-01 玻璃与装配工艺细节', en: 'Close-up of RM-01 glass and assembly craftsmanship' }
    },
    {
      src: '../assets/gallery/DSC00196.jpg', tone: 'dark', layout: 'landscape',
      label: { zh: 'R0.25 mm 圆角与装配工艺', en: 'R0.25 mm corner radius and assembly' },
      alt: { zh: 'RM-01 R0.25 mm 圆角与装配工艺细节', en: 'Close-up of the RM-01 R0.25 mm corner radius and assembly' }
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('.visual-stage');
  const productImage = $('.product-image');
  const captionProduct = $('[data-caption-product]');
  const captionLabel = $('[data-caption-label]');
  const captionExif = $('[data-caption-exif]');
  const currentCount = $('.gallery-count strong');
  const previousButton = $('[data-gallery-previous]');
  const nextButton = $('[data-gallery-next]');
  const overlay = $('#mobileOverlay');
  const menuButton = $('[data-menu-toggle]');
  const closeButton = $('[data-menu-close]');
  let lang = RM_I18N.initial();
  let currentIndex = 0;
  let transitionLocked = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SLIDE = 40; // px a photograph travels as it leaves and as the next one arrives
  const captionCopy = $('.caption-copy > div');
  let pointerStart = null;
  const markedTermPattern = /RM-01/g;

  function t(value) {
    return RM_I18N.text(value, lang);
  }

  function writeMarkedText(element, text) {
    const value = text == null ? '' : String(text);
    if (!value.includes('RM-01')) {
      element.textContent = value;
      return;
    }

    element.replaceChildren();
    let cursor = 0;
    value.replace(markedTermPattern, (match, index) => {
      if (index > cursor) element.append(document.createTextNode(value.slice(cursor, index)));
      const mark = document.createElement('span');
      mark.className = 'rm-mark';
      mark.textContent = match;
      element.append(mark);
      cursor = index + match.length;
      return match;
    });
    if (cursor < value.length) element.append(document.createTextNode(value.slice(cursor)));
  }

  function formatIndex(index) {
    return String(index + 1).padStart(2, '0');
  }


  const requestedImages = new Set([galleryItems[0].src]);

  function preloadImage(index) {
    const item = galleryItems[(index + galleryItems.length) % galleryItems.length];
    if (requestedImages.has(item.src)) return;
    requestedImages.add(item.src);
    const preload = new Image();
    preload.decoding = 'async';
    preload.src = item.src;
  }

  function preloadNeighbors(index) {
    preloadImage(index - 1);
    preloadImage(index + 1);
  }

  // Camera, lens, aperture, shutter and ISO come from the photograph itself (assets/gallery-exif.js, written by
  // scripts/extract-gallery-exif.mjs); a photograph without them shows no line.
  function renderExif(item) {
    const data = (window.RM_GALLERY_EXIF || {})[item.src.split('/').pop()];
    captionExif.replaceChildren();
    if (!data) return;
    [data.camera, data.lens, data.aperture, data.shutter, data.iso].filter(Boolean).forEach((text) => {
      const field = document.createElement('span');
      field.textContent = text;
      captionExif.append(field);
    });
  }

  function updateImageCopy() {
    const item = galleryItems[currentIndex];
    productImage.alt = t(item.alt);
    writeMarkedText(captionProduct, RM_I18N.text({zh: 'RM-01 便携 AI 超算', en: 'RM-01 Portable AI Supercomputer'}, lang));
    captionLabel.textContent = t(item.label);
    renderExif(item);
  }

  function applyLanguage(nextLang) {
    lang = nextLang;

    RM_I18N.apply(lang);
    $$('[data-gallery-text]').forEach((element) => {
      const value = RM_I18N.text(element.dataset, lang);
      if (value !== undefined) writeMarkedText(element, value);
    });

    previousButton.setAttribute('aria-label', RM_I18N.text({zh: '上一张照片', en: 'Previous photo'}, lang));
    nextButton.setAttribute('aria-label', RM_I18N.text({zh: '下一张照片', en: 'Next photo'}, lang));
    menuButton.setAttribute('aria-label', RM_I18N.text(menuButton.classList.contains('active') ? {zh: '关闭菜单', en: 'Close menu'} : {zh: '打开菜单', en: 'Open menu'}, lang));
    updateImageCopy();
    RM_I18N.apply(lang);
  }

  // Caption and counter settle in after a change (the class is replayed)
  function settle(element) {
    if (reducedMotion) return;
    element.classList.remove('is-settling');
    void element.offsetWidth;
    element.classList.add('is-settling');
  }

  // The photograph leaves toward the side the visitor is moving from and the next one arrives from the other side
  function slideIn(direction) {
    if (reducedMotion) return;
    productImage.style.transitionProperty = 'opacity';
    productImage.style.transform = `translateX(${direction * SLIDE}px)`;
    void productImage.offsetWidth;
    productImage.style.transitionProperty = '';
    productImage.style.transform = '';
  }

  function showImage(nextIndex, direction) {
    if (transitionLocked) return;
    transitionLocked = true;
    currentIndex = (nextIndex + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    stage.classList.add('is-changing');
    if (!reducedMotion) productImage.style.transform = `translateX(${-direction * SLIDE}px)`;

    // Fade out (240ms), swap while hidden, then fade the decoded photograph in (480ms, reveal easing)
    window.setTimeout(() => {
      stage.dataset.tone = item.tone;
      stage.dataset.layout = item.layout;
      productImage.src = item.src;
      updateImageCopy();
      currentCount.textContent = formatIndex(currentIndex);
      settle(captionCopy);
      settle(currentCount);
      const show = () => {
        stage.classList.remove('is-changing');
        slideIn(direction);
        preloadNeighbors(currentIndex);
        window.setTimeout(() => {
          transitionLocked = false;
        }, 420);
      };
      if (productImage.decode) productImage.decode().then(show, show);
      else show();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
  }

  overlay.inert = true;
  // While the full-screen menu is open nothing behind it may be reached from the keyboard (the overlay covers the page and the menu button)
  const pageParts = ['.skip-link', '.site-shell', 'main', 'body > .footer'].map((selector) => $(selector)).filter(Boolean);
  function setMenu(open) {
    const restoreFocus = !open && overlay.contains(document.activeElement);
    overlay.inert = !open;
    pageParts.forEach((part) => { part.inert = open; });
    if (open) requestAnimationFrame(() => closeButton.focus({ preventScroll: true }));
    else if (restoreFocus) menuButton.focus({ preventScroll: true });
    overlay.classList.toggle('active', open);
    overlay.setAttribute('aria-hidden', String(!open));
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-label', RM_I18N.text({zh: open ? '关闭菜单' : '打开菜单', en: open ? 'Close menu' : 'Open menu'}, lang));
  }

  previousButton.addEventListener('click', () => showImage(currentIndex - 1, -1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1, 1));
  RM_I18N.mount('[data-gallery-lang-toggle]', next => applyLanguage(next));
  menuButton.addEventListener('click', () => setMenu(!menuButton.classList.contains('active')));
  closeButton.addEventListener('click', () => setMenu(false));
  $('.mobile-links a[href="#galleryMain"]').addEventListener('click', () => setMenu(false));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1, -1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1, 1);
    if (event.key === 'Escape') setMenu(false);
  });

  stage.addEventListener('pointerdown', (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
    // a mouse drag that ends outside the figure still delivers its pointerup here, so the photograph always eases back
    if (event.pointerType === 'mouse') stage.setPointerCapture(event.pointerId);
  });
  // With a mouse the photograph follows the drag a little; released short of a swipe it eases back
  stage.addEventListener('pointermove', (event) => {
    if (!pointerStart || reducedMotion || event.pointerType === 'touch') return;
    const deltaX = event.clientX - pointerStart.x;
    if (Math.abs(deltaX) < 6) return;
    productImage.style.transition = 'none';
    productImage.style.transform = `translateX(${Math.max(-60, Math.min(60, deltaX * 0.3))}px)`;
  });
  function releaseDrag() {
    productImage.style.transition = '';
    productImage.style.transform = '';
  }
  stage.addEventListener('pointercancel', () => {
    pointerStart = null;
    releaseDrag();
  });
  stage.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    releaseDrag();
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    showImage(currentIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 1 : -1);
  });

  applyLanguage(lang);
  preloadNeighbors(currentIndex);
})();
