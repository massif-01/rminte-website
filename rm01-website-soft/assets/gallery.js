(function () {
  const galleryItems = [
    {
      src: '../assets/gallery/DSC00043.jpg', tone: 'dark', layout: 'portrait',
      label: { zh: '整机实拍·3/4视角', en: 'Product photography · three-quarter view' },
      alt: { zh: 'RM-01 整机实拍 3/4 视角', en: 'Three-quarter product photograph of RM-01' }
    },
    {
      src: '../assets/gallery/DSC00010.jpg', tone: 'light', layout: 'portrait',
      label: { zh: '整机实拍·正面', en: 'Product photography · front view' },
      alt: { zh: 'RM-01 整机正面实拍', en: 'Front product photograph of RM-01' }
    },
    {
      src: '../assets/gallery/DSC00020.jpg', tone: 'light', layout: 'portrait',
      label: { zh: '整机实拍·亮场', en: 'Product photography · light studio' },
      alt: { zh: '亮场中的 RM-01 整机实拍', en: 'RM-01 product photograph in a light studio' }
    },
    {
      src: '../assets/gallery/DSC00030.jpg', tone: 'light', layout: 'portrait',
      label: { zh: '整机实拍·侧后方', en: 'Product photography · rear-side view' },
      alt: { zh: 'RM-01 整机侧后方实拍', en: 'Rear-side product photograph of RM-01' }
    },
    {
      src: '../assets/gallery/DSC0031.jpg', tone: 'light', layout: 'landscape',
      label: { zh: '接口与风道细节', en: 'Ports and airflow detail' },
      alt: { zh: 'RM-01 接口与散热风道细节', en: 'Close-up of RM-01 ports and thermal airflow channel' }
    },
    {
      src: '../assets/gallery/DSC00094.jpg', tone: 'dark', layout: 'landscape',
      label: { zh: 'CFe卡槽细节', en: 'CFe card slot detail' },
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
      label: { zh: 'R0.25圆角与装配工艺', en: 'R0.25 corner radius and assembly' },
      alt: { zh: 'RM-01 R0.25 圆角与装配工艺细节', en: 'Close-up of the RM-01 R0.25 corner radius and assembly' }
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('.visual-stage');
  const productImage = $('.product-image');
  const captionProduct = $('[data-caption-product]');
  const captionLabel = $('[data-caption-label]');
  const currentCount = $('.gallery-count strong');
  const previousButton = $('[data-gallery-previous]');
  const nextButton = $('[data-gallery-next]');
  const overlay = $('#mobileOverlay');
  const menuButton = $('[data-menu-toggle]');
  const closeButton = $('[data-menu-close]');
  let lang = localStorage.getItem('rm-soft-lang') || window.RM_DEFAULT_LANG || 'en';
  let currentIndex = 0;
  let transitionLocked = false;
  let pointerStart = null;
  const markedTermPattern = /RM-01/g;

  function t(value) {
    return value[lang] || value.zh;
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

  function updateImageCopy() {
    const item = galleryItems[currentIndex];
    productImage.alt = t(item.alt);
    writeMarkedText(captionProduct, lang === 'zh' ? 'RM-01 便携 AI 超算' : 'RM-01 Portable AI Supercomputer');
    captionLabel.textContent = t(item.label);
  }

  function applyLanguage(nextLang, remember = true) {
    lang = nextLang;
    if (remember) localStorage.setItem('rm-soft-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $$('[data-gallery-text]').forEach((element) => {
      const value = element.dataset[lang];
      if (value !== undefined) writeMarkedText(element, value);
    });
    $$('[data-gallery-lang-toggle]').forEach((button) => {
      button.textContent = lang === 'zh' ? 'EN' : '中文';
      button.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
    });
    previousButton.setAttribute('aria-label', lang === 'zh' ? '上一张照片' : 'Previous photo');
    nextButton.setAttribute('aria-label', lang === 'zh' ? '下一张照片' : 'Next photo');
    menuButton.setAttribute('aria-label', lang === 'zh'
      ? (menuButton.classList.contains('active') ? '关闭菜单' : '打开菜单')
      : (menuButton.classList.contains('active') ? 'Close menu' : 'Open menu'));
    updateImageCopy();
    document.title = 'RMinte - RM-01 - Portable AI Supercomputer - 泛灵人工智能';
  }

  function showImage(nextIndex) {
    if (transitionLocked) return;
    transitionLocked = true;
    currentIndex = (nextIndex + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    stage.classList.add('is-changing');

    window.setTimeout(() => {
      stage.dataset.tone = item.tone;
      stage.dataset.layout = item.layout;
      productImage.src = item.src;
      updateImageCopy();
      currentCount.textContent = formatIndex(currentIndex);
      stage.classList.remove('is-changing');
      preloadNeighbors(currentIndex);
      window.setTimeout(() => {
        transitionLocked = false;
      }, 420);
    }, 180);
  }

  function setMenu(open) {
    overlay.classList.toggle('active', open);
    overlay.setAttribute('aria-hidden', String(!open));
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-label', lang === 'zh'
      ? (open ? '关闭菜单' : '打开菜单')
      : (open ? 'Close menu' : 'Open menu'));
  }

  previousButton.addEventListener('click', () => showImage(currentIndex - 1));
  nextButton.addEventListener('click', () => showImage(currentIndex + 1));
  $('[data-gallery-lang-toggle]').addEventListener('click', () => applyLanguage(lang === 'zh' ? 'en' : 'zh'));
  menuButton.addEventListener('click', () => setMenu(!menuButton.classList.contains('active')));
  closeButton.addEventListener('click', () => setMenu(false));
  $('.mobile-links a[href="#galleryMain"]').addEventListener('click', () => setMenu(false));

  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'Escape') setMenu(false);
  });

  stage.addEventListener('pointerdown', (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointercancel', () => {
    pointerStart = null;
  });
  stage.addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    showImage(currentIndex + (deltaX < 0 ? 1 : -1));
  });

  applyLanguage(lang, false);
  preloadNeighbors(currentIndex);
})();
