(function () {
  const galleryItems = [
    {
      src: '../assets/gallery/DSC00043.jpg', tone: 'dark', layout: 'portrait', category: 'PRODUCT EXTERIOR',
      label: { zh: '整机外观 · 3/4 视角', en: 'Full product · three-quarter view' },
      alt: { zh: '黑色摄影背景中的 RM-01 银色机身', en: 'Silver RM-01 enclosure against a dark studio background' }
    },
    {
      src: '../assets/gallery/DSC00010.jpg', tone: 'light', layout: 'portrait', category: 'PRODUCT EXTERIOR',
      label: { zh: '整机外观 · 正面', en: 'Full product · front view' },
      alt: { zh: '浅色摄影背景中的 RM-01 正面外观', en: 'Front view of RM-01 against a light studio background' }
    },
    {
      src: '../assets/gallery/DSC00020.jpg', tone: 'light', layout: 'portrait', category: 'PRODUCT EXTERIOR',
      label: { zh: '整机外观 · 侧前方', en: 'Full product · front-side view' },
      alt: { zh: '浅色摄影背景中的 RM-01 侧前方外观', en: 'Front-side view of RM-01 against a light studio background' }
    },
    {
      src: '../assets/gallery/DSC00030.jpg', tone: 'light', layout: 'portrait', category: 'PRODUCT EXTERIOR',
      label: { zh: '整机外观 · 接口侧', en: 'Full product · port side' },
      alt: { zh: '浅色摄影背景中的 RM-01 接口侧外观', en: 'Port-side view of RM-01 against a light studio background' }
    },
    {
      src: '../assets/gallery/DSC0031.jpg', tone: 'light', layout: 'landscape', category: 'PORTS & AIRFLOW',
      label: { zh: '接口与风道细节', en: 'Ports and airflow detail' },
      alt: { zh: 'RM-01 接口与散热风道细节', en: 'Close-up of RM-01 ports and thermal airflow channel' }
    },
    {
      src: '../assets/gallery/DSC00094.jpg', tone: 'dark', layout: 'landscape', category: 'STORAGE SLOT',
      label: { zh: '插卡槽细节', en: 'Storage slot detail' },
      alt: { zh: 'RM-01 插卡槽特写', en: 'Close-up of the RM-01 storage slot' }
    },
    {
      src: '../assets/gallery/DSC00120.jpg', tone: 'dark', layout: 'landscape', category: 'STATUS LIGHT',
      label: { zh: '顶部状态灯', en: 'Top status light' },
      alt: { zh: 'RM-01 顶部三角形状态灯特写', en: 'Close-up of the triangular status light on top of RM-01' }
    },
    {
      src: '../assets/gallery/DSC00142.jpg', tone: 'dark', layout: 'portrait-detail', category: 'ENCLOSURE DETAIL',
      label: { zh: '壳体层叠细节', en: 'Layered enclosure detail' },
      alt: { zh: 'RM-01 壳体层叠结构特写', en: 'Close-up of the layered RM-01 enclosure' }
    },
    {
      src: '../assets/gallery/DSC00150.jpg', tone: 'dark', layout: 'landscape', category: 'THERMAL DETAIL',
      label: { zh: '散热风道细节', en: 'Thermal channel detail' },
      alt: { zh: 'RM-01 散热风道特写', en: 'Close-up of the RM-01 thermal channel' }
    },
    {
      src: '../assets/gallery/DSC00126.jpg', tone: 'dark', layout: 'landscape', category: 'PANEL DETAIL',
      label: { zh: '面板接缝细节', en: 'Panel seam detail' },
      alt: { zh: 'RM-01 面板接缝特写', en: 'Close-up of an RM-01 panel seam' }
    },
    {
      src: '../assets/gallery/DSC00196.jpg', tone: 'dark', layout: 'landscape', category: 'PANEL DETAIL',
      label: { zh: '面板边缘细节', en: 'Panel edge detail' },
      alt: { zh: 'RM-01 面板边缘特写', en: 'Close-up of an RM-01 panel edge' }
    }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const stage = $('.visual-stage');
  const stageBackdrop = $('.stage-backdrop');
  const productImage = $('.product-image');
  const captionIndex = $('.caption-index');
  const captionProduct = $('[data-caption-product]');
  const captionLabel = $('[data-caption-label]');
  const captionCategory = $('[data-caption-category]');
  const currentCount = $('.gallery-count strong');
  const progressRail = $('[data-gallery-progress]');
  const previousButton = $('[data-gallery-previous]');
  const nextButton = $('[data-gallery-next]');
  const overlay = $('#mobileOverlay');
  const menuButton = $('[data-menu-toggle]');
  const closeButton = $('[data-menu-close]');
  let lang = localStorage.getItem('rm-soft-lang') === 'en' ? 'en' : 'zh';
  let currentIndex = 0;
  let transitionLocked = false;
  let pointerStart = null;

  function t(value) {
    return value[lang] || value.zh;
  }

  function formatIndex(index) {
    return String(index + 1).padStart(2, '0');
  }

  const progressItems = galleryItems.map((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.toggle('active', index === 0);
    button.addEventListener('click', () => showImage(index));
    progressRail.append(button);
    return button;
  });

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
    captionProduct.textContent = lang === 'zh' ? 'RM-01 便携 AI 超算' : 'RM-01 Portable AI Supercomputer';
    captionLabel.textContent = t(item.label);
    captionCategory.textContent = item.category;
  }

  function applyLanguage(nextLang) {
    lang = nextLang;
    localStorage.setItem('rm-soft-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    $$('[data-gallery-text]').forEach((element) => {
      const value = element.dataset[lang];
      if (value !== undefined) element.textContent = value;
    });
    $$('[data-gallery-lang-toggle]').forEach((button) => {
      button.textContent = lang === 'zh' ? 'EN' : '中';
      button.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
    });
    previousButton.setAttribute('aria-label', lang === 'zh' ? '上一张照片' : 'Previous photo');
    nextButton.setAttribute('aria-label', lang === 'zh' ? '下一张照片' : 'Next photo');
    progressItems.forEach((button, index) => {
      button.setAttribute('aria-label', lang === 'zh' ? `查看第 ${index + 1} 张照片` : `View photo ${index + 1}`);
    });
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
      stageBackdrop.src = item.src;
      productImage.src = item.src;
      updateImageCopy();
      captionIndex.textContent = formatIndex(currentIndex);
      currentCount.textContent = formatIndex(currentIndex);
      progressItems.forEach((progress, index) => progress.classList.toggle('active', index === currentIndex));
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

  applyLanguage(lang);
  preloadNeighbors(currentIndex);
})();
