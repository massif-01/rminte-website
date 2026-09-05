/**
 * Emoji2Pixel - 将Emoji转换为像素艺术
 */

class Emoji2Pixel {
    constructor() {
        // DOM 元素
        this.emojiInput = document.getElementById('emojiInput');
        this.langSelect = document.getElementById('langSelect');
        this.addImageBtn = document.getElementById('addImageBtn');
        this.emojiImageInput = document.getElementById('emojiImageInput');
        this.addEmojiBtn = document.getElementById('addEmojiBtn');
        this.mainCanvas = document.getElementById('mainCanvas');
        this.canvasHint = document.getElementById('canvasHint');
        this.framesContainer = document.getElementById('framesContainer');
        this.frameCount = document.getElementById('frameCount');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.animSpeedInput = document.getElementById('animSpeed');
        this.speedValue = document.getElementById('speedValue');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearFramesBtn = document.getElementById('clearFramesBtn');
        this.downloadGifBtn = document.getElementById('downloadGifBtn');
        this.tianshanUploadBtn = document.getElementById('tianshanUploadBtn');
        this.emojiGrid = document.getElementById('emojiGrid');
        this.emojiNav = document.getElementById('emojiNav');
        this.emojiSearchInput = document.getElementById('emojiSearchInput');
        this.emojiFitToggle = document.getElementById('emojiFitToggle');
        this.emojiFitRow = document.getElementById('emojiFitRow');
        this.emojiScaleInput = document.getElementById('emojiScaleInput');
        this.emojiScaleValue = document.getElementById('emojiScaleValue');
        this.tweenFramesInput = document.getElementById('tweenFramesInput');
        this.tweenInfo = document.getElementById('tweenInfo');
        this.styleBtns = document.querySelectorAll('.style-btn');

        // 变换控制元素
        this.scaleSlider = document.getElementById('scaleSlider');
        this.scaleValue = document.getElementById('scaleValue');
        this.offsetXSlider = document.getElementById('offsetXSlider');
        this.offsetXValue = document.getElementById('offsetXValue');
        this.offsetYSlider = document.getElementById('offsetYSlider');
        this.offsetYValue = document.getElementById('offsetYValue');
        this.rotateSlider = document.getElementById('rotateSlider');
        this.rotateValue = document.getElementById('rotateValue');
        this.resetTransformBtn = document.getElementById('resetTransformBtn');

        // 画布设置元素
        this.gridWidthInput = document.getElementById('gridWidthInput');
        this.gridHeightInput = document.getElementById('gridHeightInput');
        this.displayWidthInput = document.getElementById('displayWidthInput');
        this.displayHeightInput = document.getElementById('displayHeightInput');
        this.pixelSizeInput = document.getElementById('pixelSizeInput');
        this.gapSizeInput = document.getElementById('gapSizeInput');
        this.unitSelect = document.getElementById('unitSelect');
        this.renderModeSelect = document.getElementById('renderModeSelect');
        this.exportTypeSelect = document.getElementById('exportTypeSelect');
        this.quantizeToggle = document.getElementById('quantizeToggle');
        this.quantizeColorsInput = document.getElementById('quantizeColorsInput');
        this.sharpenModeSelect = document.getElementById('sharpenModeSelect');
        this.sharpenStrengthInput = document.getElementById('sharpenStrengthInput');
        this.frameRenderToggle = document.getElementById('frameRenderToggle');
        this.bgColorInput = document.getElementById('bgColorInput');
        this.bgToleranceInput = document.getElementById('bgToleranceInput');
        this.bgToleranceValue = document.getElementById('bgToleranceValue');
        this.colorSelectBtn = document.getElementById('colorSelectBtn');
        this.bgUndoBtn = document.getElementById('bgUndoBtn');
        this.selectionCanvas = document.getElementById('selectionCanvas');
        this.selectToggleBtn = document.getElementById('selectToggleBtn');
        this.clearSelectionBtn = document.getElementById('clearSelectionBtn');
        this.eraseSelectionBtn = document.getElementById('eraseSelectionBtn');
        this.fillSelectionBtn = document.getElementById('fillSelectionBtn');
        this.copySelectionBtn = document.getElementById('copySelectionBtn');
        this.pasteSelectionBtn = document.getElementById('pasteSelectionBtn');

        // Canvas 上下文
        this.ctx = this.mainCanvas.getContext('2d');

        // 状态
        this.frames = []; // 关键帧
        this.currentFrameIndex = 0;
        this.isPlaying = false;
        this.animationInterval = null;
        this.gridWidth = 32; // 默认32x32
        this.gridHeight = 32;
        this.displayWidth = 160; // 显示尺寸mm
        this.displayHeight = 160;
        this.pixelMm = 4; // 单个像素尺寸(mm)
        this.gapMm = 1; // 间隙尺寸(mm)
        this.unit = 'mm';
        this.exportType = 'raw'; // 导出类型
        this.renderMode = 'ideal'; // ideal | bare
        this.pixelStyle = 'rounded'; // 默认圆角
        this.quantizeEnabled = false;
        this.quantizeColors = 64;
        this.sharpenMode = 'none';
        this.sharpenStrength = 40;
        this.emojiFitMode = 'auto';
        this.emojiScale = 0.75;
        this.tweenFrames = 5; // 中间帧数
        this.mode = 'edit'; // 'edit' 或 'play'
        this.lastEditImageData = null; // 保存编辑模式的最后显示
        this.processUndo = null;
        this.isSelecting = false;
        this.selectionStart = null;
        this.selectionRect = null;
        this.selectionMask = null;
        this.isColorSelecting = false;
        this.colorPickPoint = null;
        this.selectionClipboard = null;

        // 变换状态
        this.transform = {
            scale: 100,
            offsetX: 0,
            offsetY: 0,
            rotate: 0
        };

        this.tianshanHost = '10.10.99.97';
        this.tianshanImageDir = '/sdcard/images';
        this.tianshanDevice = 'matrix';

        // 画布交互状态
        this.isDragging = false;
        this.isRotating = false;
        this.dragStart = { x: 0, y: 0 };
        this.transformStart = { offsetX: 0, offsetY: 0, rotate: 0 };

        // 用于渲染emoji的离屏canvas（willReadFrequently 优化 getImageData 性能）
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
        this.measureCanvas = document.createElement('canvas');
        this.measureCtx = this.measureCanvas.getContext('2d', { willReadFrequently: true });

        this.emojiSections = [];
        this.emojiNavButtons = [];
        this.emojiNavScrollRaf = null;
        this.emojiCategories = [];
        this.emojiNameMap = new Map();
        this.language = 'zh-CN';
        this.translations = {};
        this.availableLocales = [];

        this.init();
    }

    async init() {
        await this.initI18n();
        this.bindEvents();
        this.initWorkspace();
        this.loadEmojiList();
        // 不自动预览，等待用户输入
    }

    async initI18n() {
        await this.loadLocaleIndex();
        await this.buildLanguageOptions();
        const saved = localStorage.getItem('emoji2pixel_lang');
        const browserLang = (navigator.language || '').toLowerCase();
        const siteLang = localStorage.getItem('rm-soft-lang');
        const fallback = siteLang === 'zh' ? 'zh-CN' : siteLang === 'en' ? 'en-US' : browserLang.startsWith('en') ? 'en-US' : 'zh-CN';
        await this.setLanguage(saved || fallback, true);
        if (this.langSelect) {
            this.langSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    async loadLocaleIndex() {
        const bundled = typeof window !== 'undefined' && window.EMOJI2PIXEL_LOCALES;
        if (bundled && Array.isArray(bundled.index)) {
            this.availableLocales = bundled.index;
            return;
        }
        try {
            const response = await fetch('locales/index.json');
            if (!response.ok) throw new Error('Locale index load failed');
            const data = await response.json();
            if (Array.isArray(data)) {
                this.availableLocales = data;
                return;
            }
            if (Array.isArray(data.locales)) {
                this.availableLocales = data.locales;
                return;
            }
        } catch (err) {
            console.warn('Locale index load failed', err);
        }
        this.availableLocales = ['zh-CN', 'en-US'];
    }

    async buildLanguageOptions() {
        if (!this.langSelect) return;
        this.langSelect.innerHTML = '';
        const locales = Array.isArray(this.availableLocales) ? this.availableLocales : [];
        for (const code of locales) {
            await this.loadLocale(code);
            const label = (this.translations[code] && this.translations[code].selfName) || code;
            const option = document.createElement('option');
            option.value = code;
            option.textContent = label;
            this.langSelect.appendChild(option);
        }
    }

    async setLanguage(lang, silent = false) {
        if (!this.availableLocales.includes(lang)) {
            lang = 'zh-CN';
        }
        await this.loadLocale(lang);
        this.language = lang;
        if (this.langSelect) {
            this.langSelect.value = lang;
        }
        localStorage.setItem('emoji2pixel_lang', lang);
        this.applyI18n();
        if (!silent) {
            this.updateFramesList();
            this.updateTweenInfo();
        }
    }

    async loadLocale(lang) {
        if (this.translations[lang]) return;
        const bundled = typeof window !== 'undefined' && window.EMOJI2PIXEL_LOCALES;
        if (bundled && bundled.locales && bundled.locales[lang]) {
            this.translations[lang] = bundled.locales[lang];
            return;
        }
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) throw new Error('Locale load failed');
            const data = await response.json();
            this.translations[lang] = data;
        } catch (err) {
            console.warn('Locale load failed', err);
            this.translations[lang] = {};
        }
    }

    t(key, params = {}) {
        const dict = this.translations[this.language] || {};
        let value = dict[key] || key;
        Object.keys(params).forEach((paramKey) => {
            value = value.replace(`{${paramKey}}`, params[paramKey]);
        });
        return value;
    }

    applyI18n() {
        document.documentElement.lang = this.language;
        document.title = this.t('workspaceTitle') + ' · RMinte';
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = this.t(key);
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                el.setAttribute('placeholder', this.t(key));
            }
        });
        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            const key = el.getAttribute('data-i18n-title');
            if (key) {
                el.setAttribute('title', this.t(key));
                const axis = /Width/.test(el.id) ? ' W' : /Height/.test(el.id) ? ' H' : el.id === 'offsetXSlider' ? ' X' : el.id === 'offsetYSlider' ? ' Y' : '';
                el.setAttribute('aria-label', this.t(key) + axis);
            }
        });
    }

    initWorkspace() {
        const workspace = document.querySelector('.app-container');
        const tabs = [...document.querySelectorAll('[data-panel]')];
        const selectPanel = (tab) => {
            workspace.dataset.activePanel = tab.dataset.panel;
            tabs.forEach(button => {
                const selected = button === tab;
                button.setAttribute('aria-selected', String(selected));
                button.tabIndex = selected ? 0 : -1;
            });
            this.fitWorkspaceCanvas();
        };
        tabs.forEach(tab => {
            tab.addEventListener('click', () => selectPanel(tab));
            tab.addEventListener('keydown', event => {
                if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const visible = tabs.filter(button => button.getClientRects().length);
                const index = visible.indexOf(tab);
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + visible.length) % visible.length;
                selectPanel(visible[next]);
                visible[next].focus();
            });
        });
        selectPanel(tabs[0]);
        const menu = document.getElementById('brandMenu');
        const nav = document.getElementById('brandNav');
        const closeMenu = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded', 'false'); };
        menu.addEventListener('click', () => menu.setAttribute('aria-expanded', String(nav.classList.toggle('is-open'))));
        document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); menu.focus(); } });
        document.addEventListener('click', event => { if (!event.target.closest('.brand-header')) closeMenu(); });
        this.workspaceObserver = new ResizeObserver(() => this.fitWorkspaceCanvas());
        this.workspaceObserver.observe(this.mainCanvas.parentElement);
        window.addEventListener('resize', () => {
            if (innerWidth >= 768 && workspace.dataset.activePanel === 'frames') selectPanel(tabs[0]);
            this.fitWorkspaceCanvas();
        });
        // Labels keep compact controls understandable to keyboard and screen-reader users.
        const labels = {emojiInput:'inputEmoji',emojiSearchInput:'quickSearch',emojiScaleInput:'scale',tweenFramesInput:'tweenLabel',animSpeed:'play',displayWidthInput:'size',displayHeightInput:'size',gridWidthInput:'matrix',gridHeightInput:'matrix',pixelSizeInput:'pixelSize',gapSizeInput:'gap',unitSelect:'unit',renderModeSelect:'mode',exportTypeSelect:'exportRaw',scaleSlider:'scale',offsetXSlider:'transform',offsetYSlider:'transform',rotateSlider:'rotate',quantizeColorsInput:'colors',sharpenModeSelect:'sharpen',sharpenStrengthInput:'strength'};
        Object.entries(labels).forEach(([id,key]) => document.getElementById(id).setAttribute('data-i18n-title', key));
        this.applyI18n();
        const empty = document.getElementById('canvasEmpty');
        const refreshEmpty = () => { empty.hidden = this.frames.length > 0 || this.emojiInput.value.trim().length > 0; };
        this.emojiInput.addEventListener('input', refreshEmpty);
        this.frameObserver = new MutationObserver(refreshEmpty);
        this.frameObserver.observe(this.framesContainer, {childList:true});
        refreshEmpty();
    }

    fitWorkspaceCanvas() {
        const available = this.mainCanvas.parentElement.clientWidth;
        if (!available) return;
        const ratio = this.displayWidth / this.displayHeight;
        const maxHeight = innerHeight * (innerWidth < 768 ? 0.55 : 0.65);
        const width = Math.min(available, maxHeight * ratio, this.displayWidth * 96 / 25.4);
        this.mainCanvas.style.width = width + 'px';
        this.mainCanvas.style.height = (width / ratio) + 'px';
        this.drawSelectionOverlay();
    }

    async loadEmojiList() {
        const fallback = [
            { name: 'Smileys & Emotion', emojis: ['😀', '😃', '😄', '😁', '😆', '🤣', '😂', '😊', '🥰', '😍', '😎', '😢', '😭', '😡'] },
            { name: 'Animals & Nature', emojis: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼'] },
            { name: 'Food & Drink', emojis: ['🍎', '🍔', '🍣', '🍩', '☕️', '🍺'] },
            { name: 'Activities', emojis: ['⚽️', '🏀', '🏓', '🎮', '🎵', '🎬'] },
            { name: 'Objects', emojis: ['💎', '🔧', '🎁', '📱', '💡', '🧭'] },
            { name: 'Symbols', emojis: ['❤️', '⭐', '🔥', '✅', '⚠️', '❌'] },
            { name: 'Travel & Places', emojis: ['🚀', '✈️', '🗺️', '🌋', '🏝️', '🌙'] }
        ].map((group) => ({
            name: group.name,
            emojis: group.emojis.map((emoji) => ({ emoji, name: '' }))
        }));

        try {
            const sources = [
                'https://r.jina.ai/http://unicode.org/Public/emoji/latest/emoji-test.txt',
                'https://r.jina.ai/http://unicode.org/Public/emoji/15.1/emoji-test.txt',
                'https://r.jina.ai/http://unicode.org/Public/emoji/15.0/emoji-test.txt'
            ];

            for (const url of sources) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        continue;
                    }
                    const text = await response.text();
                    const categories = this.parseEmojiTest(text);
                    if (categories.length > 0) {
                        this.setEmojiCategories(categories);
                        return;
                    }
                } catch (innerErr) {
                    console.warn('Emoji list source failed', innerErr);
                }
            }
        } catch (err) {
            console.warn('Emoji list load failed', err);
        }

        this.setEmojiCategories(fallback);
    }

    parseEmojiTest(text) {
        const categories = [];
        const byName = new Map();
        let currentGroup = null;

        text.split('\n').forEach((line) => {
            if (line.startsWith('# group:')) {
                currentGroup = line.replace('# group:', '').trim();
                if (!byName.has(currentGroup)) {
                    const entry = { name: currentGroup, emojis: [] };
                    byName.set(currentGroup, entry);
                    categories.push(entry);
                }
                return;
            }

            if (!currentGroup || !line.includes('fully-qualified') || !line.includes('#')) {
                return;
            }

            const parts = line.split('#');
            if (parts.length < 2) return;
            const comment = parts[1].trim();
            if (!comment) return;
            const tokens = comment.split(/\s+/);
            const emoji = tokens[0];
            if (!emoji) return;
            const name = tokens.slice(1).join(' ').trim();
            byName.get(currentGroup).emojis.push({ emoji, name });
        });

        return categories;
    }

    setEmojiCategories(categories) {
        this.emojiCategories = categories;
        this.emojiNameMap = new Map();
        categories.forEach((category) => {
            category.emojis.forEach((emojiItem) => {
                if (typeof emojiItem === 'string') return;
                if (emojiItem && emojiItem.emoji && emojiItem.name) {
                    this.emojiNameMap.set(emojiItem.emoji, emojiItem.name);
                }
            });
        });
        this.renderEmojiCategories(categories);
    }

    getEmojiLabel(emoji) {
        if (!emoji) return '';
        return this.emojiNameMap.get(emoji) || emoji;
    }

    getFilteredEmojiCategories(term) {
        if (!term) return this.emojiCategories;
        const query = term.toLowerCase();
        return this.emojiCategories
            .map((category) => {
                const groupMatch = category.name.toLowerCase().includes(query);
                const emojis = groupMatch
                    ? category.emojis
                    : category.emojis.filter((item) => {
                        const emojiValue = typeof item === 'string' ? item : item.emoji;
                        const emojiName = typeof item === 'string' ? '' : (item.name || '');
                        return emojiValue.includes(query) || emojiName.toLowerCase().includes(query);
                    });
                if (!emojis.length) return null;
                return { name: category.name, emojis };
            })
            .filter(Boolean);
    }

    applyEmojiSearchFilter() {
        if (!this.emojiSearchInput) return;
        const term = this.emojiSearchInput.value.trim();
        const filtered = this.getFilteredEmojiCategories(term);
        this.renderEmojiCategories(filtered);
        if (this.emojiGrid) {
            this.emojiGrid.scrollTop = 0;
        }
    }

    renderEmojiCategories(categories) {
        if (!this.emojiGrid) return;
        this.emojiGrid.innerHTML = '';
        if (this.emojiNav) {
            this.emojiNav.innerHTML = '';
        }

        this.emojiSections = [];
        this.emojiNavButtons = [];

        categories.forEach((category) => {
            const sectionId = `emoji-group-${this.emojiSections.length}`;
            const section = document.createElement('section');
            section.className = 'emoji-category';
            section.id = sectionId;

            const title = document.createElement('div');
            title.className = 'emoji-category-title';
            title.textContent = category.name;

            const group = document.createElement('div');
            group.className = 'emoji-group';

            category.emojis.forEach((emojiItem) => {
                const btn = document.createElement('button');
                btn.className = 'emoji-btn';
                const emojiValue = typeof emojiItem === 'string' ? emojiItem : emojiItem.emoji;
                const emojiName = typeof emojiItem === 'string' ? '' : (emojiItem.name || '');
                btn.dataset.emoji = emojiValue;
                if (emojiName) {
                    btn.dataset.name = emojiName;
                    btn.title = emojiName;
                }
                btn.textContent = emojiValue;
                group.appendChild(btn);
            });

            if (this.emojiNav) {
                const navBtn = document.createElement('button');
                navBtn.className = 'emoji-nav-btn';
                navBtn.dataset.target = sectionId;
                navBtn.textContent = category.name;
                this.emojiNav.appendChild(navBtn);
                this.emojiNavButtons.push(navBtn);
            }

            section.appendChild(title);
            section.appendChild(group);
            this.emojiGrid.appendChild(section);
            this.emojiSections.push(section);
        });

        if (this.emojiNavButtons.length > 0) {
            this.emojiNavButtons[0].classList.add('active');
        }

        requestAnimationFrame(() => this.updateEmojiNavActive());
    }

    setActiveEmojiNav(targetId) {
        if (!this.emojiNavButtons || this.emojiNavButtons.length === 0) return;
        this.emojiNavButtons.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.target === targetId);
        });
    }

    updateEmojiNavActive() {
        if (!this.emojiSections || this.emojiSections.length === 0) return;
        const containerTop = this.emojiGrid.getBoundingClientRect().top;
        let bestIndex = 0;
        let bestDistance = Infinity;

        this.emojiSections.forEach((section, index) => {
            const distance = Math.abs(section.getBoundingClientRect().top - containerTop);
            if (distance < bestDistance) {
                bestDistance = distance;
                bestIndex = index;
            }
        });

        const activeSection = this.emojiSections[bestIndex];
        if (activeSection) {
            this.setActiveEmojiNav(activeSection.id);
        }
    }

    updateEmojiFitControls() {
        if (!this.emojiScaleInput) return;
        const isAuto = this.emojiFitMode === 'auto';
        if (this.emojiFitToggle) {
            this.emojiFitToggle.textContent = isAuto ? 'A' : 'M';
            this.emojiFitToggle.title = isAuto ? this.t('autoFit') : this.t('manualScale');
            this.emojiFitToggle.classList.toggle('active', isAuto);
        }
        if (this.emojiFitRow) {
            this.emojiFitRow.classList.toggle('is-visible', !isAuto);
        }
        if (this.emojiScaleValue) {
            this.emojiScaleValue.textContent = `${this.emojiScale.toFixed(2)}x`;
        }
    }

    getEmojiFitSettingsForFrame(frame) {
        if (frame && frame.emojiFitMode) {
            return {
                fitMode: frame.emojiFitMode,
                scale: Number.isFinite(frame.emojiScale) ? frame.emojiScale : this.emojiScale
            };
        }
        return {
            fitMode: this.emojiFitMode,
            scale: this.emojiScale
        };
    }

    updateFrameSampling(frame) {
        if (!frame) return;
        const transform = frame.transform || { scale: 100, offsetX: 0, offsetY: 0, rotate: 0 };
        const fitSettings = this.getEmojiFitSettingsForFrame(frame);
        if (frame.isImage && frame.imageElement) {
            frame.imageData = this.imageToPixels(frame.imageElement, this.gridWidth, this.gridHeight, transform, fitSettings);
        } else {
            frame.imageData = this.emojiToPixels(frame.emoji, this.gridWidth, this.gridHeight, transform, fitSettings);
        }
        if (frame.thumbCanvas && frame.imageData) {
            const thumbCtx = frame.thumbCanvas.getContext('2d');
            thumbCtx.clearRect(0, 0, 60, 60);
            this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        }
        if (!this.isPlaying && this.getCurrentFrame() === frame && frame.imageData) {
            this.renderPixels(this.ctx, frame.imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        }
    }

    loadSettings() {
        try {
            const raw = localStorage.getItem('emoji2pixel.settings');
            if (!raw) return;
            const data = JSON.parse(raw);

            if (Number.isFinite(data.gridWidth)) this.gridWidth = data.gridWidth;
            if (Number.isFinite(data.gridHeight)) this.gridHeight = data.gridHeight;
            if (Number.isFinite(data.displayWidth)) this.displayWidth = data.displayWidth;
            if (Number.isFinite(data.displayHeight)) this.displayHeight = data.displayHeight;
            if (Number.isFinite(data.pixelMm)) this.pixelMm = data.pixelMm;
            if (Number.isFinite(data.gapMm)) this.gapMm = data.gapMm;

            if (data.unit) this.unit = data.unit;
            if (!data.unit && data.displayUnit) this.unit = data.displayUnit;
            if (!data.unit && !data.displayUnit && data.sizeUnit) this.unit = data.sizeUnit;
            if (data.renderMode) this.renderMode = data.renderMode;
            if (data.pixelStyle) this.pixelStyle = data.pixelStyle;
            if (data.exportType) this.exportType = data.exportType;
            if (typeof data.quantizeEnabled === 'boolean') this.quantizeEnabled = data.quantizeEnabled;
            if (Number.isFinite(data.quantizeColors)) this.quantizeColors = data.quantizeColors;
            if (data.sharpenMode) this.sharpenMode = data.sharpenMode;
            if (Number.isFinite(data.sharpenStrength)) this.sharpenStrength = data.sharpenStrength;
            if (data.emojiFitMode) this.emojiFitMode = data.emojiFitMode;
            if (Number.isFinite(data.emojiScale)) this.emojiScale = data.emojiScale;

            this.gridWidthInput.value = this.gridWidth;
            this.gridHeightInput.value = this.gridHeight;
            this.unitSelect.value = this.unit;
            this.renderModeSelect.value = this.renderMode;
            this.exportTypeSelect.value = this.exportType;
            this.quantizeToggle.checked = this.quantizeEnabled;
            this.quantizeColorsInput.value = this.quantizeColors;
            this.sharpenModeSelect.value = this.sharpenMode;
            this.sharpenStrengthInput.value = this.sharpenStrength;
            if (this.emojiScaleInput) {
                this.emojiScaleInput.value = this.emojiScale;
            }
            if (this.emojiScaleValue) {
                this.emojiScaleValue.textContent = `${this.emojiScale.toFixed(2)}x`;
            }

            this.styleBtns.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.style === this.pixelStyle);
            });
        } catch (err) {
            console.warn('Settings load failed', err);
        }
    }

    saveSettings() {
        const data = {
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight,
            displayWidth: this.displayWidth,
            displayHeight: this.displayHeight,
            pixelMm: this.pixelMm,
            gapMm: this.gapMm,
            unit: this.unit,
            renderMode: this.renderMode,
            pixelStyle: this.pixelStyle,
            exportType: this.exportType,
            quantizeEnabled: this.quantizeEnabled,
            quantizeColors: this.quantizeColors,
            sharpenMode: this.sharpenMode,
            sharpenStrength: this.sharpenStrength,
            emojiFitMode: this.emojiFitMode,
            emojiScale: this.emojiScale
        };
        localStorage.setItem('emoji2pixel.settings', JSON.stringify(data));
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        // 添加emoji按钮
        this.addEmojiBtn.addEventListener('click', () => this.addFrame());

        if (this.addImageBtn && this.emojiImageInput) {
            this.addImageBtn.addEventListener('click', () => this.emojiImageInput.click());
            this.emojiImageInput.addEventListener('change', (e) => this.handleImageFile(e.target.files[0]));
        }

        // 输入框回车
        this.emojiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addFrame();
        });

        // 输入变化实时预览
        this.emojiInput.addEventListener('input', () => this.updatePreview());

        // 像素风格按钮
        this.styleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.styleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.pixelStyle = btn.dataset.style;
                this.updatePreview();
                this.rebuildFrames();
                this.saveSettings();
            });
        });

        // 画布设置
        const readNumberInput = (input) => {
            const raw = input.value.trim();
            if (raw === '' || raw === '-' || raw === '.' || raw === '-.') {
                return { valid: false, value: null };
            }
            const parsed = parseFloat(raw);
            if (Number.isNaN(parsed)) {
                return { valid: false, value: null };
            }
            return { valid: true, value: parsed };
        };

        const applyGridSize = (commit = true) => {
            const widthInput = readNumberInput(this.gridWidthInput);
            const heightInput = readNumberInput(this.gridHeightInput);
            if (!widthInput.valid || !heightInput.valid) {
                return;
            }

            const width = clamp(Math.round(widthInput.value), 8, 128);
            const height = clamp(Math.round(heightInput.value), 8, 128);
            this.gridWidth = width;
            this.gridHeight = height;

            if (commit) {
                this.gridWidthInput.value = width;
                this.gridHeightInput.value = height;
            }

            // 更新canvas实际像素
            this.mainCanvas.width = this.gridWidth * 20;
            this.mainCanvas.height = this.gridHeight * 20;
            this.rebuildFrames();
            this.updatePreview();
            this.saveSettings();
        };

        this.gridWidthInput.addEventListener('input', () => applyGridSize(false));
        this.gridHeightInput.addEventListener('input', () => applyGridSize(false));
        this.gridWidthInput.addEventListener('change', () => applyGridSize(true));
        this.gridHeightInput.addEventListener('change', () => applyGridSize(true));
        this.gridWidthInput.addEventListener('blur', () => applyGridSize(true));
        this.gridHeightInput.addEventListener('blur', () => applyGridSize(true));

        const MM_PER_IN = 25.4;
        const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
        const toMm = (value, unit) => unit === 'in' ? value * MM_PER_IN : value;
        const fromMm = (value, unit) => unit === 'in' ? value / MM_PER_IN : value;
        const formatValue = (value, unit) => unit === 'in'
            ? parseFloat(value.toFixed(2))
            : parseFloat(value.toFixed(1));
        const displayBounds = (unit) => unit === 'in'
            ? { min: 2, max: 12, step: 0.1 }
            : { min: 50, max: 300, step: 0.1 };
        const pixelBounds = (unit) => unit === 'in'
            ? { min: 0.04, max: 0.4, step: 0.01 }
            : { min: 1, max: 10, step: 0.1 };
        const gapBounds = (unit) => unit === 'in'
            ? { min: 0, max: 0.2, step: 0.01 }
            : { min: 0, max: 5, step: 0.1 };

        const updateUnitBadges = () => {
            const label = this.unit === 'in' ? 'in' : 'mm';
            document.querySelectorAll('.unit-badge[data-unit-target="display"]').forEach((badge) => {
                badge.textContent = label;
            });
            document.querySelectorAll('.unit-badge[data-unit-target="size"]').forEach((badge) => {
                badge.textContent = label;
            });
        };

        const applyDisplaySize = (commit = true) => {
            const bounds = displayBounds(this.unit);
            const widthInput = readNumberInput(this.displayWidthInput);
            const heightInput = readNumberInput(this.displayHeightInput);
            if (!widthInput.valid || !heightInput.valid) {
                return;
            }

            const widthUnit = clamp(widthInput.value, bounds.min, bounds.max);
            const heightUnit = clamp(heightInput.value, bounds.min, bounds.max);
            this.displayWidth = toMm(widthUnit, this.unit);
            this.displayHeight = toMm(heightUnit, this.unit);
            if (commit) {
                this.displayWidthInput.value = formatValue(widthUnit, this.unit);
                this.displayHeightInput.value = formatValue(heightUnit, this.unit);
            }
            this.fitWorkspaceCanvas();
            this.saveSettings();
        };

        const applyGapSize = (commit = true) => {
            const bounds = gapBounds(this.unit);
            const valueInput = readNumberInput(this.gapSizeInput);
            if (!valueInput.valid) {
                return;
            }
            const valueUnit = clamp(valueInput.value, bounds.min, bounds.max);
            this.gapMm = toMm(valueUnit, this.unit);
            if (commit) {
                this.gapSizeInput.value = formatValue(valueUnit, this.unit);
            }
            this.rebuildFrames();
            this.updatePreview();
            this.saveSettings();
        };

        const applyPixelSize = (commit = true) => {
            const bounds = pixelBounds(this.unit);
            const valueInput = readNumberInput(this.pixelSizeInput);
            if (!valueInput.valid) {
                return;
            }
            const valueUnit = clamp(valueInput.value, bounds.min, bounds.max);
            this.pixelMm = toMm(valueUnit, this.unit);
            if (commit) {
                this.pixelSizeInput.value = formatValue(valueUnit, this.unit);
            }
            this.saveSettings();
        };

        const updateUnit = (unit) => {
            this.unit = unit;
            const display = displayBounds(unit);
            const pixel = pixelBounds(unit);
            const gap = gapBounds(unit);
            this.displayWidthInput.min = display.min;
            this.displayWidthInput.max = display.max;
            this.displayWidthInput.step = display.step;
            this.displayHeightInput.min = display.min;
            this.displayHeightInput.max = display.max;
            this.displayHeightInput.step = display.step;
            this.pixelSizeInput.min = pixel.min;
            this.pixelSizeInput.max = pixel.max;
            this.pixelSizeInput.step = pixel.step;
            this.gapSizeInput.min = gap.min;
            this.gapSizeInput.max = gap.max;
            this.gapSizeInput.step = gap.step;
            this.displayWidthInput.value = formatValue(fromMm(this.displayWidth, unit), unit);
            this.displayHeightInput.value = formatValue(fromMm(this.displayHeight, unit), unit);
            this.pixelSizeInput.value = formatValue(fromMm(this.pixelMm, unit), unit);
            this.gapSizeInput.value = formatValue(fromMm(this.gapMm, unit), unit);
            updateUnitBadges();
        };

        const applyEmojiScale = (commit = true) => {
            if (!this.emojiScaleInput) return;
            const raw = parseFloat(this.emojiScaleInput.value || '0.75');
            if (Number.isNaN(raw)) return;
            const value = clamp(raw, 0.25, 5);
            this.emojiScale = Math.round(value * 100) / 100;
            if (commit) {
                this.emojiScaleInput.value = this.emojiScale;
            }
            if (this.emojiScaleValue) {
                this.emojiScaleValue.textContent = `${this.emojiScale.toFixed(2)}x`;
            }
            const frame = this.getCurrentFrame();
            if (frame) {
                frame.emojiFitMode = this.emojiFitMode;
                frame.emojiScale = this.emojiScale;
                this.updateFrameSampling(frame);
            } else {
                this.updatePreview();
            }
            this.saveSettings();
        };

        if (this.emojiFitToggle) {
            this.emojiFitToggle.addEventListener('click', () => {
                this.emojiFitMode = this.emojiFitMode === 'auto' ? 'manual' : 'auto';
                this.updateEmojiFitControls();
                const frame = this.getCurrentFrame();
                if (frame) {
                    frame.emojiFitMode = this.emojiFitMode;
                    frame.emojiScale = this.emojiScale;
                    this.updateFrameSampling(frame);
                } else {
                    this.updatePreview();
                }
                this.saveSettings();
            });
        }

        if (this.emojiScaleInput) {
            this.emojiScaleInput.addEventListener('input', () => applyEmojiScale(false));
            this.emojiScaleInput.addEventListener('change', () => applyEmojiScale(true));
        }

        if (this.emojiSearchInput) {
            this.emojiSearchInput.addEventListener('input', () => this.applyEmojiSearchFilter());
        }

        this.displayWidthInput.addEventListener('input', () => applyDisplaySize(false));
        this.displayHeightInput.addEventListener('input', () => applyDisplaySize(false));
        this.displayWidthInput.addEventListener('change', () => applyDisplaySize(true));
        this.displayHeightInput.addEventListener('change', () => applyDisplaySize(true));
        this.displayWidthInput.addEventListener('blur', () => applyDisplaySize(true));
        this.displayHeightInput.addEventListener('blur', () => applyDisplaySize(true));
        this.unitSelect.addEventListener('change', (e) => {
            updateUnit(e.target.value);
            applyDisplaySize(true);
            applyPixelSize(true);
            applyGapSize(true);
        });

        this.gapSizeInput.addEventListener('input', () => applyGapSize(false));
        this.gapSizeInput.addEventListener('change', () => applyGapSize(true));
        this.gapSizeInput.addEventListener('blur', () => applyGapSize(true));

        this.loadSettings();
        this.updateEmojiFitControls();
        if (this.bgToleranceInput && this.bgToleranceValue) {
            this.bgToleranceValue.textContent = this.bgToleranceInput.value;
        }
        updateUnit(this.unit);
        updateUnitBadges();
        applyGridSize(true);
        applyDisplaySize(true);
        applyPixelSize(true);
        applyGapSize(true);
        this.syncRenderControls(null);

        this.renderModeSelect.addEventListener('change', (e) => {
            this.renderMode = e.target.value;
            this.rebuildFrames();
            this.updatePreview();
            this.saveSettings();
        });

        const applyQuantizeColors = () => {
            const value = clamp(parseInt(this.quantizeColorsInput.value || '64', 10), 2, 2048);
            if (this.isPerFrameRenderActive()) {
                const frame = this.getCurrentFrame();
                this.ensureFrameRenderOverrides(frame);
                frame.renderOverrides.quantizeColors = value;
            } else {
                this.quantizeColors = value;
                this.saveSettings();
            }
            this.quantizeColorsInput.value = value;
            this.refreshFrameRenders();
            this.updatePreview();
        };

        this.quantizeToggle.addEventListener('change', () => {
            const enabled = this.quantizeToggle.checked;
            if (this.isPerFrameRenderActive()) {
                const frame = this.getCurrentFrame();
                this.ensureFrameRenderOverrides(frame);
                frame.renderOverrides.quantizeEnabled = enabled;
            } else {
                this.quantizeEnabled = enabled;
                this.saveSettings();
            }
            this.refreshFrameRenders();
            this.updatePreview();
        });

        this.quantizeColorsInput.addEventListener('input', applyQuantizeColors);
        this.quantizeColorsInput.addEventListener('change', applyQuantizeColors);

        const applySharpenStrength = () => {
            const value = clamp(parseInt(this.sharpenStrengthInput.value || '0', 10), 0, 100);
            if (this.isPerFrameRenderActive()) {
                const frame = this.getCurrentFrame();
                this.ensureFrameRenderOverrides(frame);
                frame.renderOverrides.sharpenStrength = value;
            } else {
                this.sharpenStrength = value;
                this.saveSettings();
            }
            this.sharpenStrengthInput.value = value;
            this.refreshFrameRenders();
            this.updatePreview();
        };

        this.sharpenModeSelect.addEventListener('change', (e) => {
            const mode = e.target.value;
            if (this.isPerFrameRenderActive()) {
                const frame = this.getCurrentFrame();
                this.ensureFrameRenderOverrides(frame);
                frame.renderOverrides.sharpenMode = mode;
            } else {
                this.sharpenMode = mode;
                this.saveSettings();
            }
            this.refreshFrameRenders();
            this.updatePreview();
        });

        this.sharpenStrengthInput.addEventListener('input', applySharpenStrength);
        this.sharpenStrengthInput.addEventListener('change', applySharpenStrength);

        if (this.frameRenderToggle) {
            this.frameRenderToggle.addEventListener('change', () => {
                const frame = this.getCurrentFrame();
                if (!frame) {
                    this.frameRenderToggle.checked = false;
                    return;
                }
                if (this.frameRenderToggle.checked) {
                    this.ensureFrameRenderOverrides(frame);
                } else {
                    frame.renderOverrides = null;
                }
                this.syncRenderControls(frame);
                this.refreshFrameRenders();
                this.updatePreview();
            });
        }

        this.exportTypeSelect.addEventListener('change', (e) => {
            this.exportType = e.target.value;
            this.saveSettings();
        });

        // 变换控制
        this.scaleSlider.addEventListener('input', (e) => {
            this.transform.scale = parseInt(e.target.value);
            this.scaleValue.textContent = this.transform.scale + '%';
            this.updateCurrentFrame();
        });

        this.offsetXSlider.addEventListener('input', (e) => {
            this.transform.offsetX = parseInt(e.target.value);
            this.offsetXValue.textContent = this.transform.offsetX;
            this.updateCurrentFrame();
        });

        this.offsetYSlider.addEventListener('input', (e) => {
            this.transform.offsetY = parseInt(e.target.value);
            this.offsetYValue.textContent = this.transform.offsetY;
            this.updateCurrentFrame();
        });

        this.rotateSlider.addEventListener('input', (e) => {
            this.transform.rotate = parseInt(e.target.value);
            this.rotateValue.textContent = this.transform.rotate + '°';
            this.updateCurrentFrame();
        });

        this.resetTransformBtn.addEventListener('click', () => {
            this.transform = { scale: 100, offsetX: 0, offsetY: 0, rotate: 0 };
            this.scaleSlider.value = 100;
            this.scaleValue.textContent = '100%';
            this.offsetXSlider.value = 0;
            this.offsetXValue.textContent = '0';
            this.offsetYSlider.value = 0;
            this.offsetYValue.textContent = '0';
            this.rotateSlider.value = 0;
            this.rotateValue.textContent = '0°';
            this.updateCurrentFrame();
        });

        // 中间帧数变化
        const applyTweenFrames = (commit = true) => {
            const valueInput = readNumberInput(this.tweenFramesInput);
            if (!valueInput.valid) {
                return;
            }
            const value = clamp(Math.round(valueInput.value), 0, 20);
            this.tweenFrames = value;
            if (commit) {
                this.tweenFramesInput.value = value;
            }
            this.updateTweenInfo();
            if (this.isPlaying) {
                this.pauseAnimation();
                this.playAnimation();
            }
        };

        this.tweenFramesInput.addEventListener('input', () => applyTweenFrames(false));
        this.tweenFramesInput.addEventListener('change', () => applyTweenFrames(true));
        this.tweenFramesInput.addEventListener('blur', () => applyTweenFrames(true));

        // 播放/暂停
        this.playBtn.addEventListener('click', () => this.playAnimation());
        this.pauseBtn.addEventListener('click', () => this.pauseAnimation());

        // 动画速度
        const applyAnimSpeed = (commit = true) => {
            const valueInput = readNumberInput(this.animSpeedInput);
            if (!valueInput.valid) {
                return;
            }
            const value = clamp(Math.round(valueInput.value), 20, 5000);
            if (commit) {
                this.animSpeedInput.value = value;
            }
            this.speedValue.textContent = value + 'ms';
            if (this.isPlaying) {
                this.pauseAnimation();
                this.playAnimation();
            }
        };

        this.animSpeedInput.addEventListener('input', () => applyAnimSpeed(false));
        this.animSpeedInput.addEventListener('change', () => applyAnimSpeed(true));
        this.animSpeedInput.addEventListener('blur', () => applyAnimSpeed(true));

        // 下载PNG
        this.downloadBtn.addEventListener('click', () => this.downloadPNG());

        // 复制到剪贴板
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());

        // 清空帧
        this.clearFramesBtn.addEventListener('click', () => this.clearFrames());

        // 下载GIF
        this.downloadGifBtn.addEventListener('click', async () => {
                this.downloadGifBtn.disabled = true;
                this.downloadGifBtn.setAttribute('aria-busy', 'true');
                this.downloadGifBtn.textContent = this.t('gifGenerating');
                try { await this.downloadGIF(); } finally {
                    this.downloadGifBtn.disabled = false;
                    this.downloadGifBtn.removeAttribute('aria-busy');
                    this.downloadGifBtn.textContent = this.t(this.downloadGifBtn.dataset.i18n);
                }
            });

        if (this.tianshanUploadBtn) {
            this.tianshanUploadBtn.addEventListener('click', async () => {
                this.tianshanUploadBtn.disabled = true;
                this.tianshanUploadBtn.setAttribute('aria-busy', 'true');
                this.tianshanUploadBtn.textContent = this.t('tianshanUploading');
                try { await this.uploadToTianshan(); } catch (error) {
                    this.showToast(this.t('tianshanUploadFailed', {message:error.message}));
                } finally {
                    this.tianshanUploadBtn.disabled = false;
                    this.tianshanUploadBtn.removeAttribute('aria-busy');
                    this.tianshanUploadBtn.textContent = this.t(this.tianshanUploadBtn.dataset.i18n);
                }
            });
        }


        // 快捷emoji选择 - 点击直接添加帧
        this.emojiGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-btn')) {
                const emoji = e.target.dataset.emoji;
                this.emojiInput.value = emoji;
                this.addFrame(); // 直接添加帧
            }
        });

        if (this.emojiNav) {
            this.emojiNav.addEventListener('click', (e) => {
                const btn = e.target.closest('.emoji-nav-btn');
                if (!btn) return;
                const targetId = btn.dataset.target;
                const section = targetId ? document.getElementById(targetId) : null;
                if (!section) return;
                const containerTop = this.emojiGrid.getBoundingClientRect().top;
                const sectionTop = section.getBoundingClientRect().top;
                this.emojiGrid.scrollTo({
                    top: this.emojiGrid.scrollTop + (sectionTop - containerTop) - 4,
                    behavior: 'smooth'
                });
                this.setActiveEmojiNav(targetId);
            });
        }

        this.emojiGrid.addEventListener('scroll', () => {
            if (!this.emojiSections || this.emojiSections.length === 0) return;
            if (this.emojiNavScrollRaf) return;
            this.emojiNavScrollRaf = requestAnimationFrame(() => {
                this.emojiNavScrollRaf = null;
                this.updateEmojiNavActive();
            });
        });

        // 画布交互事件
        this.mainCanvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
        this.mainCanvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
        this.mainCanvas.addEventListener('mouseup', () => this.onCanvasMouseUp());
        this.mainCanvas.addEventListener('mouseleave', () => this.onCanvasMouseUp());
        this.mainCanvas.addEventListener('wheel', (e) => this.onCanvasWheel(e));
        this.mainCanvas.addEventListener('click', (e) => this.onCanvasClick(e));

        // 触摸事件支持
        this.mainCanvas.addEventListener('touchstart', (e) => this.onCanvasTouchStart(e));
        this.mainCanvas.addEventListener('touchmove', (e) => this.onCanvasTouchMove(e));
        this.mainCanvas.addEventListener('touchend', () => this.onCanvasMouseUp());

        if (this.bgToleranceInput) {
            this.bgToleranceInput.addEventListener('input', () => {
                if (this.bgToleranceValue) {
                    this.bgToleranceValue.textContent = this.bgToleranceInput.value;
                }
                if (this.selectionMask && this.colorPickPoint) {
                    this.updateColorSelectionMask();
                }
            });
        }

        if (this.bgUndoBtn) {
            this.bgUndoBtn.addEventListener('click', () => this.undoProcess());
        }

        if (this.selectToggleBtn) {
            this.selectToggleBtn.addEventListener('click', () => {
                this.isSelecting = !this.isSelecting;
                this.selectionStart = null;
                this.selectionRect = null;
                this.clearSelectionOverlay();
                if (this.mainCanvas) {
                    this.mainCanvas.classList.toggle('selecting', this.isSelecting);
                    if (this.isSelecting) {
                        this.mainCanvas.classList.remove('color-selecting');
                        this.isColorSelecting = false;
                    }
                }
                this.selectToggleBtn.classList.toggle('is-active', this.isSelecting);
                if (this.isSelecting) {
                    this.showToast(this.t('dragSelect'));
                }
            });
        }

        if (this.clearSelectionBtn) {
            this.clearSelectionBtn.addEventListener('click', () => {
                this.selectionRect = null;
                this.selectionMask = null;
                this.colorPickPoint = null;
                this.clearSelectionOverlay();
            });
        }

        if (this.eraseSelectionBtn) {
            this.eraseSelectionBtn.addEventListener('click', () => this.clearSelectionPixels());
        }

        if (this.colorSelectBtn) {
            this.colorSelectBtn.addEventListener('click', () => this.selectByColor());
        }

        if (this.fillSelectionBtn) {
            this.fillSelectionBtn.addEventListener('click', () => this.fillSelection());
        }

        if (this.copySelectionBtn) {
            this.copySelectionBtn.addEventListener('click', () => this.copySelection());
        }

        if (this.pasteSelectionBtn) {
            this.pasteSelectionBtn.addEventListener('click', () => this.pasteSelection());
        }
    }

    onKeyDown(e) {
        const target = e.target;
        const isTyping = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (isTyping) return;

        const key = e.key.toLowerCase();
        const isCmdOrCtrl = e.metaKey || e.ctrlKey;
        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            this.clearSelectionPixels();
            return;
        }
        if (!isCmdOrCtrl) {
            if (key === 'a') {
                e.preventDefault();
                if (this.selectToggleBtn) this.selectToggleBtn.click();
                return;
            }
            if (key === 'i') {
                e.preventDefault();
                if (this.colorSelectBtn) this.colorSelectBtn.click();
                return;
            }
            if (key === 'f') {
                e.preventDefault();
                this.fillSelection();
                return;
            }
            if (key === 'escape') {
                e.preventDefault();
                this.selectionRect = null;
                this.selectionMask = null;
                this.colorPickPoint = null;
                this.clearSelectionOverlay();
                return;
            }
            return;
        }

        if (key === 'z') {
            e.preventDefault();
            this.undoProcess();
        }
        if (key === 'c') {
            e.preventDefault();
            this.copySelection();
        }
        if (key === 'v') {
            e.preventDefault();
            this.pasteSelection();
        }
    }

    /**
     * 设置模式（编辑/播放）
     */
    setMode(mode) {
        this.mode = mode;

        // 更新画布样式
        this.mainCanvas.classList.toggle('play-mode', mode === 'play');

        // 更新提示显示
        this.canvasHint.classList.toggle('hidden', mode === 'play');

        if (mode === 'edit') {
            // 恢复编辑预览
            this.updatePreview();
        } else {
            // 播放模式
            if (this.frames.length > 0) {
                this.currentFrameIndex = 0;
                this.showFrame(0);
            }
        }
    }

    /**
     * 画布鼠标按下
     */
    onCanvasMouseDown(e) {
        if (this.mode !== 'edit') return;

        if (this.isSelecting) {
            e.preventDefault();
            this.selectionStart = this.getCanvasPixelPoint(e);
            this.selectionRect = { x: this.selectionStart.x, y: this.selectionStart.y, w: 0, h: 0 };
            this.selectionMask = null;
            this.drawSelectionOverlay();
            return;
        }

        e.preventDefault();
        const rect = this.mainCanvas.getBoundingClientRect();
        this.dragStart = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        this.transformStart = {
            offsetX: this.transform.offsetX,
            offsetY: this.transform.offsetY,
            rotate: this.transform.rotate
        };

        if (e.shiftKey) {
            this.isRotating = true;
        } else {
            this.isDragging = true;
        }
    }

    /**
     * 画布鼠标移动
     */
    onCanvasMouseMove(e) {
        if (this.mode !== 'edit') return;

        if (this.isSelecting && this.selectionStart) {
            const point = this.getCanvasPixelPoint(e);
            const minX = Math.min(this.selectionStart.x, point.x);
            const minY = Math.min(this.selectionStart.y, point.y);
            const maxX = Math.max(this.selectionStart.x, point.x);
            const maxY = Math.max(this.selectionStart.y, point.y);
            this.selectionRect = {
                x: minX,
                y: minY,
                w: maxX - minX + 1,
                h: maxY - minY + 1
            };
            this.drawSelectionOverlay();
            return;
        }
        if (!this.isDragging && !this.isRotating) return;

        const rect = this.mainCanvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        // 计算canvas显示尺寸与实际像素的比例
        const scaleRatioX = this.gridWidth / rect.width;
        const scaleRatioY = this.gridHeight / rect.height;

        if (this.isDragging) {
            // 移动：计算偏移量（转换为网格单位）
            const deltaX = (currentX - this.dragStart.x) * scaleRatioX;
            const deltaY = (currentY - this.dragStart.y) * scaleRatioY;

            this.transform.offsetX = Math.round(Math.max(-16, Math.min(16, this.transformStart.offsetX + deltaX)));
            this.transform.offsetY = Math.round(Math.max(-16, Math.min(16, this.transformStart.offsetY + deltaY)));

            // 更新滑块
            this.offsetXSlider.value = this.transform.offsetX;
            this.offsetXValue.textContent = this.transform.offsetX;
            this.offsetYSlider.value = this.transform.offsetY;
            this.offsetYValue.textContent = this.transform.offsetY;
        } else if (this.isRotating) {
            // 旋转：基于从中心的角度变化
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const startAngle = Math.atan2(this.dragStart.y - centerY, this.dragStart.x - centerX);
            const currentAngle = Math.atan2(currentY - centerY, currentX - centerX);
            const deltaAngle = (currentAngle - startAngle) * (180 / Math.PI);

            let newRotate = this.transformStart.rotate + deltaAngle;
            // 保持在 0-360 范围内
            newRotate = ((newRotate % 360) + 360) % 360;
            this.transform.rotate = Math.round(newRotate);

            // 更新滑块
            this.rotateSlider.value = this.transform.rotate;
            this.rotateValue.textContent = this.transform.rotate + '°';
        }

        this.updateCurrentFrame();
    }

    /**
     * 画布鼠标释放
     */
    onCanvasMouseUp() {
        if (this.isSelecting && this.selectionStart) {
            this.selectionStart = null;
            return;
        }
        this.isDragging = false;
        this.isRotating = false;
    }

    getCanvasPixelPoint(e) {
        const rect = this.mainCanvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(this.gridWidth - 1, Math.floor((e.clientX - rect.left) / rect.width * this.gridWidth)));
        const y = Math.max(0, Math.min(this.gridHeight - 1, Math.floor((e.clientY - rect.top) / rect.height * this.gridHeight)));
        return { x, y };
    }

    drawSelectionOverlay() {
        if (!this.selectionCanvas || (!this.selectionRect && !this.selectionMask)) return;
        const ctx = this.selectionCanvas.getContext('2d');
        const rect = this.mainCanvas.getBoundingClientRect();
        const container = this.mainCanvas.parentElement;
        const containerRect = container ? container.getBoundingClientRect() : rect;
        this.selectionCanvas.width = containerRect.width;
        this.selectionCanvas.height = containerRect.height;
        ctx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);

        const offsetX = rect.left - containerRect.left;
        const offsetY = rect.top - containerRect.top;
        const scaleX = rect.width / this.gridWidth;
        const scaleY = rect.height / this.gridHeight;
        if (this.selectionMask) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            for (let y = 0; y < this.gridHeight; y++) {
                for (let x = 0; x < this.gridWidth; x++) {
                    const idx = y * this.gridWidth + x;
                    if (this.selectionMask[idx]) {
                        ctx.fillRect(offsetX + x * scaleX, offsetY + y * scaleY, scaleX, scaleY);
                    }
                }
            }
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            for (let y = 0; y < this.gridHeight; y++) {
                for (let x = 0; x < this.gridWidth; x++) {
                    const idx = y * this.gridWidth + x;
                    if (!this.selectionMask[idx]) continue;
                    const left = x === 0 ? 0 : this.selectionMask[idx - 1];
                    const right = x === this.gridWidth - 1 ? 0 : this.selectionMask[idx + 1];
                    const up = y === 0 ? 0 : this.selectionMask[idx - this.gridWidth];
                    const down = y === this.gridHeight - 1 ? 0 : this.selectionMask[idx + this.gridWidth];
                    const px = offsetX + x * scaleX;
                    const py = offsetY + y * scaleY;
                    if (!left) {
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(px, py + scaleY);
                        ctx.stroke();
                    }
                    if (!right) {
                        ctx.beginPath();
                        ctx.moveTo(px + scaleX, py);
                        ctx.lineTo(px + scaleX, py + scaleY);
                        ctx.stroke();
                    }
                    if (!up) {
                        ctx.beginPath();
                        ctx.moveTo(px, py);
                        ctx.lineTo(px + scaleX, py);
                        ctx.stroke();
                    }
                    if (!down) {
                        ctx.beginPath();
                        ctx.moveTo(px, py + scaleY);
                        ctx.lineTo(px + scaleX, py + scaleY);
                        ctx.stroke();
                    }
                }
            }

            if (this.selectionRect) {
                const handleSize = Math.max(4, Math.min(scaleX, scaleY) * 0.5);
                const corners = [
                    [this.selectionRect.x, this.selectionRect.y],
                    [this.selectionRect.x + this.selectionRect.w, this.selectionRect.y],
                    [this.selectionRect.x, this.selectionRect.y + this.selectionRect.h],
                    [this.selectionRect.x + this.selectionRect.w, this.selectionRect.y + this.selectionRect.h]
                ];
                ctx.setLineDash([]);
                corners.forEach(([cx, cy]) => {
                    const px = offsetX + cx * scaleX - handleSize / 2;
                    const py = offsetY + cy * scaleY - handleSize / 2;
                    ctx.fillRect(px, py, handleSize, handleSize);
                });
            }
            ctx.restore();
            return;
        }

        const startX = this.selectionRect.x;
        const startY = this.selectionRect.y;
        const endX = this.selectionRect.x + this.selectionRect.w - 1;
        const endY = this.selectionRect.y + this.selectionRect.h - 1;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                ctx.fillRect(offsetX + x * scaleX, offsetY + y * scaleY, scaleX, scaleY);
            }
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const px = offsetX + x * scaleX;
                const py = offsetY + y * scaleY;
                if (x === startX) {
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(px, py + scaleY);
                    ctx.stroke();
                }
                if (x === endX) {
                    ctx.beginPath();
                    ctx.moveTo(px + scaleX, py);
                    ctx.lineTo(px + scaleX, py + scaleY);
                    ctx.stroke();
                }
                if (y === startY) {
                    ctx.beginPath();
                    ctx.moveTo(px, py);
                    ctx.lineTo(px + scaleX, py);
                    ctx.stroke();
                }
                if (y === endY) {
                    ctx.beginPath();
                    ctx.moveTo(px, py + scaleY);
                    ctx.lineTo(px + scaleX, py + scaleY);
                    ctx.stroke();
                }
            }
        }
        const handleSize = Math.max(4, Math.min(scaleX, scaleY) * 0.5);
        const corners = [
            [startX, startY],
            [endX + 1, startY],
            [startX, endY + 1],
            [endX + 1, endY + 1]
        ];
        ctx.setLineDash([]);
        corners.forEach(([cx, cy]) => {
            const px = offsetX + cx * scaleX - handleSize / 2;
            const py = offsetY + cy * scaleY - handleSize / 2;
            ctx.fillRect(px, py, handleSize, handleSize);
        });
        ctx.restore();
    }

    clearSelectionOverlay() {
        if (!this.selectionCanvas) return;
        const ctx = this.selectionCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
    }

    clearSelectionPixels() {
        const frame = this.getCurrentFrame();
        if (!frame || !frame.imageData) {
            this.showToast(this.t('needFrame'));
            return;
        }
        if (!this.selectionRect && !this.selectionMask) {
            this.showToast(this.t('needSelection'));
            return;
        }

        if (!frame.baseImageData) {
            frame.baseImageData = this.cloneImageData(frame.imageData);
        }

        this.processUndo = {
            frameIndex: this.currentFrameIndex,
            baseImageData: this.cloneImageData(frame.baseImageData),
            processOps: Array.isArray(frame.processOps) ? [...frame.processOps] : []
        };

        const ops = Array.isArray(frame.processOps) ? [...frame.processOps] : [];
        if (this.selectionMask) {
            const indices = [];
            for (let i = 0; i < this.selectionMask.length; i++) {
                if (this.selectionMask[i]) indices.push(i);
            }
            if (indices.length) ops.push({ type: 'erase-mask', indices });
        } else {
            const { x, y, w, h } = this.selectionRect;
            ops.push({ type: 'erase-rect', x, y, w, h });
        }

        frame.processOps = ops;
        frame.imageData = this.applyProcessingPipeline(frame, this.cloneImageData(frame.baseImageData));
        frame.isImage = true;
        frame.imageElement = this.imageDataToCanvas(frame.imageData);

        const thumbCtx = frame.thumbCanvas.getContext('2d');
        thumbCtx.clearRect(0, 0, 60, 60);
        this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        this.renderPixels(this.ctx, frame.imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        this.showToast(this.t('selectionCleared'));
    }

    fillSelection() {
        const frame = this.getCurrentFrame();
        if (!frame || !frame.imageData) {
            this.showToast(this.t('needFrame'));
            return;
        }
        if (!this.selectionRect && !this.selectionMask) {
            this.showToast(this.t('needSelection'));
            return;
        }

        const color = this.bgColorInput ? this.bgColorInput.value : '#ffffff';
        const fill = this.hexToRgb(color);
        if (!fill) return;

        if (!frame.baseImageData) {
            frame.baseImageData = this.cloneImageData(frame.imageData);
        }

        this.processUndo = {
            frameIndex: this.currentFrameIndex,
            baseImageData: this.cloneImageData(frame.baseImageData),
            processOps: Array.isArray(frame.processOps) ? [...frame.processOps] : []
        };

        const base = this.applyProcessingPipeline(frame, this.cloneImageData(frame.baseImageData));
        const data = base.data;
        if (this.selectionMask) {
            for (let i = 0; i < this.selectionMask.length; i++) {
                if (!this.selectionMask[i]) continue;
                const idx = i * 4;
                if (idx >= 0 && idx + 3 < data.length) {
                    data[idx] = fill.r;
                    data[idx + 1] = fill.g;
                    data[idx + 2] = fill.b;
                    data[idx + 3] = 255;
                }
            }
        } else {
            const { x, y, w, h } = this.selectionRect;
            for (let yy = y; yy < y + h; yy++) {
                for (let xx = x; xx < x + w; xx++) {
                    const idx = (yy * base.width + xx) * 4;
                    if (idx >= 0 && idx + 3 < data.length) {
                        data[idx] = fill.r;
                        data[idx + 1] = fill.g;
                        data[idx + 2] = fill.b;
                        data[idx + 3] = 255;
                    }
                }
            }
        }

        frame.baseImageData = base;
        frame.processOps = [];
        frame.imageData = this.applyProcessingPipeline(frame, this.cloneImageData(frame.baseImageData));
        frame.isImage = true;
        frame.imageElement = this.imageDataToCanvas(frame.imageData);

        const thumbCtx = frame.thumbCanvas.getContext('2d');
        thumbCtx.clearRect(0, 0, 60, 60);
        this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        this.renderPixels(this.ctx, frame.imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        this.showToast(this.t('filled'));
    }

    copySelection() {
        const frame = this.getCurrentFrame();
        if (!frame || !frame.imageData) {
            this.showToast(this.t('needFrame'));
            return;
        }
        if (!this.selectionRect && !this.selectionMask) {
            this.showToast(this.t('needSelection'));
            return;
        }

        const rect = this.selectionRect;
        const width = rect.w;
        const height = rect.h;
        const src = frame.imageData.data;
        const clipData = new Uint8ClampedArray(width * height * 4);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const srcX = rect.x + x;
                const srcY = rect.y + y;
                const srcIdx = (srcY * frame.imageData.width + srcX) * 4;
                const dstIdx = (y * width + x) * 4;
                const maskIndex = (srcY * frame.imageData.width + srcX);
                const allowed = this.selectionMask ? this.selectionMask[maskIndex] : 1;
                if (!allowed) {
                    clipData[dstIdx + 3] = 0;
                    continue;
                }
                clipData[dstIdx] = src[srcIdx];
                clipData[dstIdx + 1] = src[srcIdx + 1];
                clipData[dstIdx + 2] = src[srcIdx + 2];
                clipData[dstIdx + 3] = src[srcIdx + 3];
            }
        }

        this.selectionClipboard = { width, height, data: clipData };
        this.showToast(this.t('selectionCopied'));
    }

    pasteSelection() {
        const frame = this.getCurrentFrame();
        if (!frame || !frame.imageData) {
            this.showToast(this.t('needFrame'));
            return;
        }
        if (!this.selectionClipboard) {
            this.showToast(this.t('pasteEmpty'));
            return;
        }

        if (!frame.baseImageData) {
            frame.baseImageData = this.cloneImageData(frame.imageData);
        }

        this.processUndo = {
            frameIndex: this.currentFrameIndex,
            baseImageData: this.cloneImageData(frame.baseImageData),
            processOps: Array.isArray(frame.processOps) ? [...frame.processOps] : []
        };

        const base = this.applyProcessingPipeline(frame, this.cloneImageData(frame.baseImageData));
        const { width, height, data } = this.selectionClipboard;
        const startX = this.selectionRect ? this.selectionRect.x : 0;
        const startY = this.selectionRect ? this.selectionRect.y : 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dstX = startX + x;
                const dstY = startY + y;
                if (dstX < 0 || dstY < 0 || dstX >= base.width || dstY >= base.height) continue;
                const srcIdx = (y * width + x) * 4;
                const dstIdx = (dstY * base.width + dstX) * 4;
                base.data[dstIdx] = data[srcIdx];
                base.data[dstIdx + 1] = data[srcIdx + 1];
                base.data[dstIdx + 2] = data[srcIdx + 2];
                base.data[dstIdx + 3] = data[srcIdx + 3];
            }
        }

        frame.baseImageData = base;
        frame.processOps = [];
        frame.imageData = this.applyProcessingPipeline(frame, this.cloneImageData(frame.baseImageData));
        frame.isImage = true;
        frame.imageElement = this.imageDataToCanvas(frame.imageData);

        this.selectionRect = { x: startX, y: startY, w: width, h: height };
        this.selectionMask = null;
        this.drawSelectionOverlay();

        const thumbCtx = frame.thumbCanvas.getContext('2d');
        thumbCtx.clearRect(0, 0, 60, 60);
        this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        this.renderPixels(this.ctx, frame.imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        this.showToast(this.t('pasted'));
    }

    onCanvasClick(e) {
        if (this.isColorSelecting) {
            this.selectByColorAtPoint(e);
            return;
        }
    }

    getActiveImageData() {
        const frame = this.getCurrentFrame();
        if (frame && frame.imageData) return frame.imageData;
        if (this.lastEditImageData) return this.lastEditImageData;
        return null;
    }

    selectByColor() {
        this.isColorSelecting = !this.isColorSelecting;
        if (this.mainCanvas) {
            this.mainCanvas.classList.toggle('color-selecting', this.isColorSelecting);
            if (this.isColorSelecting) {
                this.mainCanvas.classList.remove('selecting');
                this.isSelecting = false;
            }
        }
        if (this.colorSelectBtn) {
            this.colorSelectBtn.classList.toggle('is-active', this.isColorSelecting);
        }
        if (this.isColorSelecting) {
            this.showToast(this.t('pickColorPrompt'));
        }
    }

    selectByColorAtPoint(e) {
        const frame = this.getCurrentFrame();
        if (!frame || !frame.imageData) {
            this.showToast(this.t('needFrame'));
            return;
        }
        const point = this.getCanvasPixelPoint(e);
        this.colorPickPoint = point;
        const { data, width, height } = frame.imageData;
        const startIdx = (point.y * width + point.x) * 4;
        if (data[startIdx + 3] < 10) {
            this.showToast(this.t('transparentPixel'));
            return;
        }

        const target = { r: data[startIdx], g: data[startIdx + 1], b: data[startIdx + 2] };
        if (this.bgColorInput) {
            this.bgColorInput.value = this.rgbToHex(target.r, target.g, target.b);
        }

        this.updateColorSelectionMask();
        this.showToast(this.t('colorSelectionUpdated'));
    }

    updateColorSelectionMask() {
        const frame = this.getCurrentFrame();
        if (!frame || !frame.imageData || !this.colorPickPoint) return;

        const point = this.colorPickPoint;
        const { data, width, height } = frame.imageData;
        const startIdx = (point.y * width + point.x) * 4;
        if (data[startIdx + 3] < 10) return;

        const target = { r: data[startIdx], g: data[startIdx + 1], b: data[startIdx + 2] };
        const tolerance = this.bgToleranceInput ? parseInt(this.bgToleranceInput.value || '0', 10) : 0;
        const threshold = Math.max(0, Math.min(255, Math.round((tolerance / 100) * 255)));
        const thresholdSq = threshold * threshold;
        const mask = new Uint8Array(width * height);
        const visited = new Uint8Array(width * height);
        const queue = [[point.x, point.y]];
        visited[point.y * width + point.x] = 1;

        let minX = point.x;
        let minY = point.y;
        let maxX = point.x;
        let maxY = point.y;

        const matches = (x, y) => {
            const idx = (y * width + x) * 4;
            if (data[idx + 3] < 10) return false;
            const dr = data[idx] - target.r;
            const dg = data[idx + 1] - target.g;
            const db = data[idx + 2] - target.b;
            return dr * dr + dg * dg + db * db <= thresholdSq;
        };

        while (queue.length) {
            const [x, y] = queue.pop();
            if (!matches(x, y)) continue;
            const pos = y * width + x;
            mask[pos] = 1;
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;

            if (x > 0) {
                const left = pos - 1;
                if (!visited[left]) {
                    visited[left] = 1;
                    queue.push([x - 1, y]);
                }
            }
            if (x < width - 1) {
                const right = pos + 1;
                if (!visited[right]) {
                    visited[right] = 1;
                    queue.push([x + 1, y]);
                }
            }
            if (y > 0) {
                const up = pos - width;
                if (!visited[up]) {
                    visited[up] = 1;
                    queue.push([x, y - 1]);
                }
            }
            if (y < height - 1) {
                const down = pos + width;
                if (!visited[down]) {
                    visited[down] = 1;
                    queue.push([x, y + 1]);
                }
            }
        }

        if (maxX < minX || maxY < minY) return;

        this.selectionMask = mask;
        this.selectionRect = {
            x: minX,
            y: minY,
            w: maxX - minX + 1,
            h: maxY - minY + 1
        };
        this.drawSelectionOverlay();
    }

    undoProcess() {
        if (!this.processUndo || this.processUndo.frameIndex == null) {
            this.showToast(this.t('undoEmpty'));
            return;
        }

        const frame = this.frames[this.processUndo.frameIndex];
        if (!frame) {
            this.showToast(this.t('undoFailed'));
            return;
        }

        if (this.processUndo.baseImageData) {
            frame.baseImageData = this.processUndo.baseImageData;
        }
        if (Array.isArray(this.processUndo.processOps)) {
            frame.processOps = [...this.processUndo.processOps];
        }
        if (frame.baseImageData) {
            frame.imageData = this.applyProcessingPipeline(frame, frame.baseImageData);
        }
        if (frame.imageData) {
            frame.imageElement = this.imageDataToCanvas(frame.imageData);
        }

        const thumbCtx = frame.thumbCanvas.getContext('2d');
        thumbCtx.clearRect(0, 0, 60, 60);
        this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        if (this.currentFrameIndex === this.processUndo.frameIndex) {
            this.renderPixels(this.ctx, frame.imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        }

        this.processUndo = null;
        this.showToast(this.t('undone'));
    }

    hexToRgb(hex) {
        if (!hex) return null;
        const cleaned = hex.replace('#', '').trim();
        if (cleaned.length !== 6) return null;
        const r = parseInt(cleaned.slice(0, 2), 16);
        const g = parseInt(cleaned.slice(2, 4), 16);
        const b = parseInt(cleaned.slice(4, 6), 16);
        if ([r, g, b].some(Number.isNaN)) return null;
        return { r, g, b };
    }

    rgbToHex(r, g, b) {
        const toHex = (v) => v.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * 画布滚轮缩放
     */
    onCanvasWheel(e) {
        if (this.mode !== 'edit') return;

        e.preventDefault();

        // 滚轮缩放
        const delta = e.deltaY > 0 ? -5 : 5;
        this.transform.scale = Math.max(50, Math.min(150, this.transform.scale + delta));

        // 更新滑块
        this.scaleSlider.value = this.transform.scale;
        this.scaleValue.textContent = this.transform.scale + '%';

        this.updateCurrentFrame();
    }

    /**
     * 触摸开始
     */
    onCanvasTouchStart(e) {
        if (this.mode !== 'edit') return;
        if (e.touches.length !== 1) return;

        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.mainCanvas.getBoundingClientRect();
        this.dragStart = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
        this.transformStart = {
            offsetX: this.transform.offsetX,
            offsetY: this.transform.offsetY
        };
        this.isDragging = true;
    }

    /**
     * 触摸移动
     */
    onCanvasTouchMove(e) {
        if (this.mode !== 'edit') return;
        if (!this.isDragging || e.touches.length !== 1) return;

        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.mainCanvas.getBoundingClientRect();
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        const scaleRatioX = this.gridWidth / rect.width;
        const scaleRatioY = this.gridHeight / rect.height;
        const deltaX = (currentX - this.dragStart.x) * scaleRatioX;
        const deltaY = (currentY - this.dragStart.y) * scaleRatioY;

        this.transform.offsetX = Math.round(Math.max(-16, Math.min(16, this.transformStart.offsetX + deltaX)));
        this.transform.offsetY = Math.round(Math.max(-16, Math.min(16, this.transformStart.offsetY + deltaY)));

        this.offsetXSlider.value = this.transform.offsetX;
        this.offsetXValue.textContent = this.transform.offsetX;
        this.offsetYSlider.value = this.transform.offsetY;
        this.offsetYValue.textContent = this.transform.offsetY;

        this.updateCurrentFrame();
    }

    /**
     * 将emoji渲染为像素数据（支持变换）
     */
    emojiToPixels(emoji, width, height, transform = null, fitSettings = null) {
        if (!emoji) return null;

        // 使用传入的变换或当前变换
        const t = transform || this.transform;

        const fitMode = fitSettings ? fitSettings.fitMode : this.emojiFitMode;
        const fitScale = fitSettings ? fitSettings.scale : this.emojiScale;
        let fontSize = Math.floor(Math.min(width, height) * fitScale);
        let xOffset = 0;
        let yOffset = height * 0.05;
        if (fitMode === 'auto') {
            const measurement = this.measureEmojiBounds(emoji, width, height);
            if (measurement && measurement.width > 0 && measurement.height > 0) {
                const targetWidth = width * 0.95;
                const targetHeight = height * 0.95;
                const scale = Math.min(targetWidth / measurement.width, targetHeight / measurement.height);
                fontSize = Math.max(1, Math.floor(measurement.fontSize * scale));
                const offsetScale = fontSize / measurement.fontSize;
                xOffset = -measurement.centerX * offsetScale;
                yOffset = -measurement.centerY * offsetScale;
            }
        }

        // 设置离屏canvas大小
        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;

        const ctx = this.offscreenCtx;
        ctx.clearRect(0, 0, width, height);

        // 应用变换
        ctx.save();
        ctx.translate(width / 2 + t.offsetX, height / 2 + t.offsetY);
        ctx.rotate(t.rotate * Math.PI / 180);
        ctx.scale(t.scale / 100, t.scale / 100);

        // 设置emoji字体大小
        ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 在变换原点绘制emoji
        ctx.fillText(emoji, xOffset, yOffset);
        ctx.restore();

        // 获取像素数据
        const imageData = ctx.getImageData(0, 0, width, height);
        return imageData;
    }

    imageToPixels(image, width, height, transform = null, fitSettings = null) {
        if (!image) return null;

        const t = transform || this.transform;
        const fitMode = fitSettings ? fitSettings.fitMode : this.emojiFitMode;
        const fitScale = fitSettings ? fitSettings.scale : this.emojiScale;

        const baseScale = Math.min(width / image.width, height / image.height);
        const scale = fitMode === 'auto' ? baseScale * 0.95 : baseScale * fitScale;
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;

        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;

        const ctx = this.offscreenCtx;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width / 2 + t.offsetX, height / 2 + t.offsetY);
        ctx.rotate(t.rotate * Math.PI / 180);
        ctx.scale(t.scale / 100, t.scale / 100);
        ctx.drawImage(image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();

        return ctx.getImageData(0, 0, width, height);
    }

    measureEmojiBounds(emoji, width, height) {
        const size = Math.max(width, height) * 2;
        this.measureCanvas.width = size;
        this.measureCanvas.height = size;
        const ctx = this.measureCtx;
        ctx.clearRect(0, 0, size, size);

        const fontSize = Math.floor(Math.min(width, height));
        ctx.save();
        ctx.translate(size / 2, size / 2);
        ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 0, 0);
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, size, size);
        const bounds = this.getAlphaBounds(imageData);
        if (!bounds) return null;

        const centerX = (bounds.minX + bounds.maxX) / 2 - size / 2;
        const centerY = (bounds.minY + bounds.maxY) / 2 - size / 2;

        return {
            width: bounds.width,
            height: bounds.height,
            fontSize: fontSize,
            centerX,
            centerY
        };
    }

    getAlphaBounds(imageData) {
        const { width, height, data } = imageData;
        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4 + 3;
                if (data[idx] > 10) {
                    if (x < minX) minX = x;
                    if (y < minY) minY = y;
                    if (x > maxX) maxX = x;
                    if (y > maxY) maxY = y;
                }
            }
        }

        if (maxX < minX || maxY < minY) return null;
        return {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }

    /**
     * 将像素数据渲染到canvas上（带风格），透明背景
     */
    renderPixels(ctx, imageData, canvasWidth, canvasHeight, style = 'rounded', settings = null) {
        const processed = this.applyRenderPipeline(imageData, settings);
        const width = processed.width;
        const height = processed.height;
        const pixelSizeX = canvasWidth / width;
        const pixelSizeY = canvasHeight / height;
        const gapX = this.displayWidth > 0 ? (this.gapMm / this.displayWidth) * canvasWidth : 0;
        const gapY = this.displayHeight > 0 ? (this.gapMm / this.displayHeight) * canvasHeight : 0;
        const data = processed.data;

        // 清除为透明背景
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                if (a > 10) { // 只绘制有颜色的像素
                    const px = x * pixelSizeX + gapX / 2;
                    const py = y * pixelSizeY + gapY / 2;
                    const psx = Math.max(0, pixelSizeX - gapX);
                    const psy = Math.max(0, pixelSizeY - gapY);

                    if (this.renderMode === 'bare') {
                        const alpha = a / 255;
                        const lightWidth = psx * 0.35;
                        const lightHeight = psy * 0.6;
                        const lightY = py + (psy - lightHeight) / 2;
                        const stripeHeight = lightHeight / 3;
                        const sx = px + (psx - lightWidth);

                        // Clip to pixel shape so bare mode respects shape
                        ctx.save();
                        switch (style) {
                            case 'rounded':
                                this.drawRoundedRect(ctx, px, py, psx, psy, Math.min(psx, psy) * 0.2);
                                ctx.clip();
                                break;
                            case 'circle':
                                ctx.beginPath();
                                ctx.arc(px + psx / 2, py + psy / 2, Math.min(psx, psy) / 2, 0, Math.PI * 2);
                                ctx.clip();
                                break;
                            default:
                                ctx.beginPath();
                                ctx.rect(px, py, psx, psy);
                                ctx.clip();
                        }

                        // Base color fills the entire pixel
                        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        ctx.fillRect(px, py, psx, psy);

                        // Subpixels are subtle and influence each other
                        const baseMix = 0.7;
                        const stripeMix = 0.3;
                        const cross = 0.2;
                        const primary = 1 - cross * 2;
                        const subAlpha = alpha * 0.4;
                        const clampByte = (v) => Math.max(0, Math.min(255, Math.round(v)));

                        const subBlue = {
                            r: r * cross,
                            g: g * cross,
                            b: b * primary + r * cross + g * cross
                        };
                        const subRed = {
                            r: r * primary + g * cross + b * cross,
                            g: g * cross,
                            b: b * cross
                        };
                        const subGreen = {
                            r: r * cross,
                            g: g * primary + r * cross + b * cross,
                            b: b * cross
                        };

                        const mix = (base, sub) => clampByte(base * baseMix + sub * stripeMix);

                        ctx.fillStyle = `rgba(${mix(r, subBlue.r)}, ${mix(g, subBlue.g)}, ${mix(b, subBlue.b)}, ${subAlpha})`;
                        ctx.fillRect(sx, lightY, lightWidth, stripeHeight);
                        ctx.fillStyle = `rgba(${mix(r, subRed.r)}, ${mix(g, subRed.g)}, ${mix(b, subRed.b)}, ${subAlpha})`;
                        ctx.fillRect(sx, lightY + stripeHeight, lightWidth, stripeHeight);
                        ctx.fillStyle = `rgba(${mix(r, subGreen.r)}, ${mix(g, subGreen.g)}, ${mix(b, subGreen.b)}, ${subAlpha})`;
                        ctx.fillRect(sx, lightY + stripeHeight * 2, lightWidth, stripeHeight);

                        ctx.restore();
                        continue;
                    }

                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

                    switch (style) {
                        case 'rounded':
                            this.drawRoundedRect(ctx, px, py, psx, psy, Math.min(psx, psy) * 0.2);
                            break;
                        case 'circle':
                            ctx.beginPath();
                            ctx.arc(px + psx / 2, py + psy / 2, Math.min(psx, psy) / 2, 0, Math.PI * 2);
                            ctx.fill();
                            break;
                        default: // square
                            ctx.fillRect(px, py, psx, psy);
                    }
                }
            }
        }
    }

    getCurrentFrame() {
        if (this.frames.length === 0) return null;
        if (this.currentFrameIndex < 0 || this.currentFrameIndex >= this.frames.length) return null;
        return this.frames[this.currentFrameIndex];
    }

    getGlobalRenderSettings() {
        return {
            quantizeEnabled: this.quantizeEnabled,
            quantizeColors: this.quantizeColors,
            sharpenMode: this.sharpenMode,
            sharpenStrength: this.sharpenStrength
        };
    }

    getRenderSettingsForFrame(frame) {
        if (frame && frame.renderOverrides) {
            return frame.renderOverrides;
        }
        return this.getGlobalRenderSettings();
    }

    ensureFrameRenderOverrides(frame) {
        if (!frame) return;
        if (!frame.renderOverrides) {
            frame.renderOverrides = this.getGlobalRenderSettings();
        }
    }

    isPerFrameRenderActive() {
        return !!(this.frameRenderToggle && this.frameRenderToggle.checked && this.getCurrentFrame());
    }

    syncRenderControls(frame = null) {
        const currentFrame = frame || this.getCurrentFrame();
        const hasFrame = !!currentFrame;
        if (this.frameRenderToggle) {
            this.frameRenderToggle.disabled = !hasFrame;
            this.frameRenderToggle.checked = hasFrame && !!currentFrame.renderOverrides;
        }

        const settings = this.getRenderSettingsForFrame(currentFrame);
        this.quantizeToggle.checked = settings.quantizeEnabled;
        this.quantizeColorsInput.value = settings.quantizeColors;
        this.sharpenModeSelect.value = settings.sharpenMode;
        this.sharpenStrengthInput.value = settings.sharpenStrength;
    }

    refreshFrameRenders() {
        this.frames.forEach((frame) => {
            const thumbCtx = frame.thumbCanvas.getContext('2d');
            thumbCtx.clearRect(0, 0, 60, 60);
            this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        });

        if (!this.isPlaying && this.frames.length > 0) {
            this.showFrame(this.currentFrameIndex);
        }
    }

    applyRenderPipeline(imageData, settings = null) {
        const renderSettings = settings || this.getGlobalRenderSettings();
        let output = imageData;
        if (renderSettings.quantizeEnabled) {
            output = this.quantizeImageData(output, renderSettings.quantizeColors);
        }
        if (renderSettings.sharpenMode !== 'none' && renderSettings.sharpenStrength > 0) {
            output = this.sharpenImageData(output, renderSettings.sharpenMode, renderSettings.sharpenStrength);
        }
        return output;
    }

    cloneImageData(source) {
        return new ImageData(new Uint8ClampedArray(source.data), source.width, source.height);
    }

    applyProcessingPipeline(frame, baseImageData) {
        if (!frame || !baseImageData) return baseImageData;
        if (!frame.processOps || frame.processOps.length === 0) {
            return this.cloneImageData(baseImageData);
        }

        let output = this.cloneImageData(baseImageData);
        frame.processOps.forEach((op) => {
            if (!op || !op.type) return;
            if (op.type === 'bg-remove') {
                output = this.applyBackgroundRemovalToImage(output, op.color, op.tolerance);
            } else if (op.type === 'erase-rect') {
                output = this.applyEraseRect(output, op);
            } else if (op.type === 'erase-mask') {
                output = this.applyEraseMask(output, op);
            }
        });

        return output;
    }

    applyEraseMask(imageData, op) {
        if (!op || !Array.isArray(op.indices)) return imageData;
        const output = this.cloneImageData(imageData);
        const data = output.data;
        op.indices.forEach((pos) => {
            if (!Number.isFinite(pos)) return;
            const idx = pos * 4 + 3;
            if (idx >= 0 && idx < data.length) {
                data[idx] = 0;
            }
        });
        return output;
    }

    imageDataToCanvas(imageData) {
        const canvas = document.createElement('canvas');
        canvas.width = imageData.width;
        canvas.height = imageData.height;
        const ctx = canvas.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    }

    applyEraseRect(imageData, op) {
        if (!op) return imageData;
        const output = this.cloneImageData(imageData);
        const data = output.data;
        const startX = Math.max(0, Math.min(output.width - 1, op.x));
        const startY = Math.max(0, Math.min(output.height - 1, op.y));
        const endX = Math.max(0, Math.min(output.width - 1, op.x + op.w - 1));
        const endY = Math.max(0, Math.min(output.height - 1, op.y + op.h - 1));

        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const idx = (y * output.width + x) * 4 + 3;
                data[idx] = 0;
            }
        }

        return output;
    }

    applyBackgroundRemovalToImage(imageData, color, tolerance) {
        const target = this.hexToRgb(color);
        if (!target) return imageData;
        const output = this.cloneImageData(imageData);
        const data = output.data;
        const threshold = Math.max(0, Math.min(255, Math.round((tolerance / 100) * 255)));
        const thresholdSq = threshold * threshold;
        const width = output.width;
        const height = output.height;
        const visited = new Uint8Array(width * height);
        const queue = [];

        const shouldFill = (x, y) => {
            const idx = (y * width + x) * 4;
            if (data[idx + 3] < 10) return false;
            const dr = data[idx] - target.r;
            const dg = data[idx + 1] - target.g;
            const db = data[idx + 2] - target.b;
            return dr * dr + dg * dg + db * db <= thresholdSq;
        };

        const pushIfMatch = (x, y) => {
            const pos = y * width + x;
            if (visited[pos]) return;
            if (!shouldFill(x, y)) return;
            visited[pos] = 1;
            queue.push([x, y]);
        };

        for (let x = 0; x < width; x++) {
            pushIfMatch(x, 0);
            if (height > 1) pushIfMatch(x, height - 1);
        }
        for (let y = 1; y < height - 1; y++) {
            pushIfMatch(0, y);
            if (width > 1) pushIfMatch(width - 1, y);
        }

        while (queue.length) {
            const [x, y] = queue.pop();
            const idx = (y * width + x) * 4;
            data[idx + 3] = 0;

            if (x > 0) pushIfMatch(x - 1, y);
            if (x < width - 1) pushIfMatch(x + 1, y);
            if (y > 0) pushIfMatch(x, y - 1);
            if (y < height - 1) pushIfMatch(x, y + 1);
        }

        return output;
    }

    quantizeImageData(source, colors) {
        const levels = Math.max(2, Math.round(Math.cbrt(colors)));
        const step = 255 / (levels - 1);
        const output = this.cloneImageData(source);
        const data = output.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(data[i] / step) * step;
            data[i + 1] = Math.round(data[i + 1] / step) * step;
            data[i + 2] = Math.round(data[i + 2] / step) * step;
        }

        return output;
    }

    sharpenImageData(source, mode, strength) {
        const width = source.width;
        const height = source.height;
        const src = source.data;
        const out = new ImageData(width, height);
        const dst = out.data;
        const t = Math.max(0, Math.min(1, strength / 100));

        const getIndex = (x, y) => (y * width + x) * 4;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = getIndex(x, y);
                if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
                    dst[i] = src[i];
                    dst[i + 1] = src[i + 1];
                    dst[i + 2] = src[i + 2];
                    dst[i + 3] = src[i + 3];
                    continue;
                }

                const left = getIndex(x - 1, y);
                const right = getIndex(x + 1, y);
                const up = getIndex(x, y - 1);
                const down = getIndex(x, y + 1);

                for (let c = 0; c < 3; c++) {
                    let sharpened;
                    if (mode === 'unsharp') {
                        const blur = (
                            src[i + c] +
                            src[left + c] +
                            src[right + c] +
                            src[up + c] +
                            src[down + c] +
                            src[getIndex(x - 1, y - 1) + c] +
                            src[getIndex(x + 1, y - 1) + c] +
                            src[getIndex(x - 1, y + 1) + c] +
                            src[getIndex(x + 1, y + 1) + c]
                        ) / 9;
                        sharpened = src[i + c] + (src[i + c] - blur) * (t * 1.5);
                    } else {
                        const edge = src[i + c] * 5 - src[left + c] - src[right + c] - src[up + c] - src[down + c];
                        sharpened = src[i + c] * (1 - t) + edge * t;
                    }
                    dst[i + c] = Math.max(0, Math.min(255, sharpened));
                }
                dst[i + 3] = src[i + 3];
            }
        }

        return out;
    }

    /**
     * 绘制圆角矩形
     */
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * 更新实时预览
     */
    updatePreview() {
        if (this.isPlaying) return;

        const emoji = this.emojiInput.value;
        if (!emoji) {
            // 没有输入时，如果有关键帧则显示第一帧
            if (this.frames.length > 0) {
                this.showFrame(0);
            }
            return;
        }

        const currentFrame = this.getCurrentFrame();
        const fitSettings = this.getEmojiFitSettingsForFrame(currentFrame && currentFrame.emoji === emoji ? currentFrame : null);
        const imageData = this.emojiToPixels(emoji, this.gridWidth, this.gridHeight, this.transform, fitSettings);

        if (imageData) {
            this.lastEditImageData = imageData;
            const frame = this.getCurrentFrame();
            const settings = frame && frame.emoji === emoji
                ? this.getRenderSettingsForFrame(frame)
                : this.getGlobalRenderSettings();
            this.renderPixels(this.ctx, imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, settings);
        }
    }

    /**
     * 更新当前选中帧（变换时调用）
     */
    updateCurrentFrame() {
        if (this.isPlaying) return;

        const emoji = this.emojiInput.value;
        const currentFrame = this.getCurrentFrame();
        const isImageFrame = currentFrame && currentFrame.isImage;
        if (!emoji && !isImageFrame) return;

        // 重新生成imageData
        const frame = this.getCurrentFrame();
        const fitSettings = this.getEmojiFitSettingsForFrame(frame && frame.emoji === emoji ? frame : null);
        const sampled = isImageFrame
            ? this.imageToPixels(currentFrame.imageElement, this.gridWidth, this.gridHeight, this.transform, fitSettings)
            : this.emojiToPixels(emoji, this.gridWidth, this.gridHeight, this.transform, fitSettings);
        if (!sampled) return;
        const processed = currentFrame
            ? this.applyProcessingPipeline(currentFrame, this.cloneImageData(sampled))
            : sampled;

        // 更新画布预览
        const settings = currentFrame && (!emoji || currentFrame.emoji === emoji)
            ? this.getRenderSettingsForFrame(currentFrame)
            : this.getGlobalRenderSettings();
        this.renderPixels(this.ctx, processed, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, settings);

        // 如果有选中的帧且emoji匹配，更新帧数据
        if (this.frames.length > 0 && this.currentFrameIndex >= 0 && this.currentFrameIndex < this.frames.length) {
            const frame = this.frames[this.currentFrameIndex];
            if (frame.isImage || frame.emoji === emoji) {
                frame.transform = { ...this.transform };
                frame.baseImageData = this.cloneImageData(sampled);
                if (frame.isImage) frame.processOps = [];
                frame.imageData = this.applyProcessingPipeline(frame, frame.baseImageData);
                // 更新缩略图
                const thumbCtx = frame.thumbCanvas.getContext('2d');
                thumbCtx.clearRect(0, 0, 60, 60);
                this.renderPixels(thumbCtx, frame.imageData, 60, 60, this.pixelStyle, settings);
                // 更新列表显示
                this.updateFramesList();
            }
        }
    }

    /**
     * 添加帧（保存当前变换状态）
     */
    addFrame() {
        const emoji = this.emojiInput.value;
        if (!emoji) {
            this.showToast(this.t('needEmojiInput'));
            return;
        }

        const label = this.getEmojiLabel(emoji);

        // 保存当前变换状态
        const currentTransform = { ...this.transform };
        const fitSettings = { fitMode: this.emojiFitMode, scale: this.emojiScale };
        const imageData = this.emojiToPixels(emoji, this.gridWidth, this.gridHeight, currentTransform, fitSettings);
        if (!imageData) {
            this.showToast(this.t('emojiParseFailed'));
            return;
        }

        // 创建帧缩略图canvas
        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 60;
        thumbCanvas.height = 60;
        this.renderPixels(thumbCanvas.getContext('2d'), imageData, 60, 60, this.pixelStyle, this.getGlobalRenderSettings());

        this.frames.push({
            emoji: emoji,
            name: label,
            transform: currentTransform, // 保存变换状态
            imageData: imageData,
            baseImageData: this.cloneImageData(imageData),
            processOps: [],
            thumbCanvas: thumbCanvas,
            emojiFitMode: this.emojiFitMode,
            emojiScale: this.emojiScale
        });

        this.updateFramesList();
        this.updateTweenInfo();
        this.showToast(this.t('frameAdded', { count: this.frames.length }));

        // 自动选中新添加的帧，保持emoji在输入框
        this.currentFrameIndex = this.frames.length - 1;
        this.updateFramesList();
        this.syncRenderControls(this.frames[this.currentFrameIndex]);
    }

    async handleImageFile(file) {
        if (!file) return;
        if (!file.type || !file.type.startsWith('image/')) {
            this.showToast(this.t('selectImageFile'));
            return;
        }

        const isGif = file.type === 'image/gif' || (file.name || '').toLowerCase().endsWith('.gif');
        if (isGif) {
            await this.handleGifFile(file);
            return;
        }

        this.handleStaticImageFile(file);
    }

    handleStaticImageFile(file) {
        if (!file) return;

        const baseName = (file.name || '').replace(/\.[^.]+$/, '') || this.t('defaultImageName');

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => this.addImageFrame(img, reader.result, { label: baseName });
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
        if (this.emojiImageInput) {
            this.emojiImageInput.value = '';
        }
    }

    async handleGifFile(file) {
        if (!file) return;
        if (!('ImageDecoder' in window)) {
            this.showToast(this.t('gifNotSupported'));
            this.handleStaticImageFile(file);
            return;
        }

        let buffer;
        try {
            buffer = await file.arrayBuffer();
        } catch (err) {
            console.error(err);
            this.showToast(this.t('gifReadFailed'));
            return;
        }

        let decoder;
        try {
            decoder = new ImageDecoder({ data: buffer, type: 'image/gif' });
            await decoder.tracks.ready;
        } catch (err) {
            console.error(err);
            this.showToast(this.t('gifDecodeFailed'));
            return;
        }

        const track = decoder.tracks.selectedTrack;
        const frameCount = track ? track.frameCount : 1;
        if (!frameCount) {
            this.showToast(this.t('gifNoFrames'));
            return;
        }

        const frames = [];
        let totalDuration = 0;

        for (let i = 0; i < frameCount; i++) {
            try {
                const result = await decoder.decode({ frameIndex: i });
                const frame = result.image;
                const durationMs = Math.max(20, Math.round((frame.duration || 100000) / 1000));
                const width = frame.displayWidth || frame.codedWidth || frame.width;
                const height = frame.displayHeight || frame.codedHeight || frame.height;
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(frame, 0, 0);
                frame.close();
                frames.push({ canvas, durationMs });
                totalDuration += durationMs;
            } catch (err) {
                console.warn('GIF frame decode failed', err);
            }
        }

        if (!frames.length) {
            this.showToast(this.t('gifDecodeFailed'));
            return;
        }

        const avgDuration = Math.max(20, Math.min(5000, Math.round(totalDuration / frames.length)));
        this.tweenFrames = 0;
        this.tweenFramesInput.value = 0;
        this.animSpeedInput.value = avgDuration;
        this.speedValue.textContent = `${avgDuration}ms`;

        const baseName = (file.name || '').replace(/\.[^.]+$/, '') || this.t('defaultGifName');
        frames.forEach((frame, index) => {
            const label = frames.length > 1 ? `${baseName} ${index + 1}` : baseName;
            this.addImageFrame(frame.canvas, null, {
                durationMs: frame.durationMs,
                isGif: true,
                label: label,
                silent: true,
                skipRefresh: true
            });
        });

        this.updateFramesList();
        this.updateTweenInfo();
        this.currentFrameIndex = this.frames.length - 1;
        this.syncRenderControls(this.frames[this.currentFrameIndex]);
        this.showToast(this.t('gifImported', { count: frames.length }));

        if (this.emojiImageInput) {
            this.emojiImageInput.value = '';
        }
    }

    addImageFrame(image, src, options = {}) {
        if (!image) return;

        const {
            silent = false,
            skipRefresh = false,
            durationMs = null,
            isGif = false,
            label = '🖼'
        } = options;

        const currentTransform = { ...this.transform };
        const fitSettings = { fitMode: this.emojiFitMode, scale: this.emojiScale };
        const imageData = this.imageToPixels(image, this.gridWidth, this.gridHeight, currentTransform, fitSettings);
        if (!imageData) {
            this.showToast(this.t('imageParseFailed'));
            return;
        }

        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 60;
        thumbCanvas.height = 60;
        this.renderPixels(thumbCanvas.getContext('2d'), imageData, 60, 60, this.pixelStyle, this.getGlobalRenderSettings());

        this.frames.push({
            emoji: label,
            name: label,
            isImage: true,
            isGif: isGif,
            imageSrc: src,
            imageElement: image,
            transform: currentTransform,
            imageData: imageData,
            baseImageData: this.cloneImageData(imageData),
            processOps: [],
            thumbCanvas: thumbCanvas,
            emojiFitMode: this.emojiFitMode,
            emojiScale: this.emojiScale,
            durationMs: Number.isFinite(durationMs) ? durationMs : null
        });

        if (!skipRefresh) {
            this.updateFramesList();
            this.updateTweenInfo();
            if (!silent) {
                this.showToast(this.t('frameAdded', { count: this.frames.length }));
            }

            this.currentFrameIndex = this.frames.length - 1;
            this.updateFramesList();
            this.syncRenderControls(this.frames[this.currentFrameIndex]);
        }
    }

    /**
     * 更新中间帧信息
     */
    updateTweenInfo() {
        if (this.frames.length < 2) {
            this.tweenInfo.textContent = '';
            return;
        }
        const totalTween = (this.frames.length - 1) * this.tweenFrames;
        const totalFrames = this.frames.length + totalTween;
        this.tweenInfo.textContent = this.t('tweenInfo', { totalFrames, totalTween });
    }

    /**
     * 更新帧列表显示
     */
    updateFramesList() {
        this.frameCount.textContent = this.t('frameCount', { count: this.frames.length });
        this.updateTweenInfo();

        if (this.frames.length === 0) {
            this.framesContainer.innerHTML = `
                <div class="empty-frames">
                    <p>${this.t('emptyFrames')}</p>
                </div>
            `;
            return;
        }

        this.framesContainer.innerHTML = '';

        this.frames.forEach((frame, index) => {
            // 添加箭头和中间帧指示（除了第一帧）
            if (index > 0) {
                const tweenIndicator = document.createElement('div');
                tweenIndicator.className = 'tween-indicator';
                tweenIndicator.innerHTML = `<span class="frame-arrow">→</span><span class="tween-count">${this.t('tweenFrames', { count: this.tweenFrames })}</span>`;
                tweenIndicator.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
                const tweenCount = tweenIndicator.querySelector('.tween-count');
                tweenCount.style.cssText = 'font-size:0.7rem;color:var(--muted);';
                this.framesContainer.appendChild(tweenIndicator);
            }

            const frameItem = document.createElement('div');
            frameItem.className = 'frame-item' + (index === this.currentFrameIndex ? ' active' : '');
            frameItem.tabIndex = 0;
            frameItem.setAttribute('aria-label', this.t('keyframe', {index:index + 1}));
            frameItem.addEventListener('keydown', event => {
                if (event.target === frameItem && ['Enter',' '].includes(event.key)) { event.preventDefault(); this.selectFrame(index); }
            });
            const renderBadge = frame.renderOverrides ? '<span class="frame-render-badge">FX</span>' : '';
            const sampleBadge = frame.emojiFitMode
                ? `<span class="frame-sample-badge">${frame.emojiFitMode === 'auto' ? 'A' : 'M'}</span>`
                : '';
            frameItem.innerHTML = `
                <span class="keyframe-badge">K${index + 1}</span>
                ${renderBadge}
                ${sampleBadge}
                <canvas width="60" height="60"></canvas>
                <input class="frame-name" type="text" />
                <div class="frame-number">${this.t('keyframe', { index: index + 1 })}</div>
                <button class="frame-delete" data-index="${index}">×</button>
            `;

            // 复制缩略图
            const canvas = frameItem.querySelector('canvas');
            canvas.getContext('2d').drawImage(frame.thumbCanvas, 0, 0);

            // 点击选中帧
            frameItem.addEventListener('click', (e) => {
                if (!e.target.classList.contains('frame-delete')) {
                    this.selectFrame(index);
                }
            });

            frameItem.querySelector('.frame-delete').setAttribute('aria-label', this.t('delete') + ' ' + this.t('keyframe', {index:index+1}));
            const nameInput = frameItem.querySelector('.frame-name');
            nameInput.setAttribute('aria-label', this.t('keyframe', {index:index+1}));
            const frameName = frame.name || frame.emoji || this.t('keyframe', { index: index + 1 });
            nameInput.value = frameName;
            nameInput.addEventListener('click', (e) => e.stopPropagation());
            nameInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                }
            });
            nameInput.addEventListener('input', (e) => {
                this.frames[index].name = e.target.value.trim() || this.frames[index].emoji || this.t('keyframe', { index: index + 1 });
            });
            nameInput.addEventListener('blur', (e) => {
                const value = e.target.value.trim();
                const nextName = value || this.frames[index].emoji || this.t('keyframe', { index: index + 1 });
                this.frames[index].name = nextName;
                e.target.value = nextName;
            });

            // 删除帧
            frameItem.querySelector('.frame-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteFrame(index);
            });

            this.framesContainer.appendChild(frameItem);
        });

        // 更新动画预览到当前帧
        if (this.frames.length > 0 && !this.isPlaying) {
            this.showFrame(this.currentFrameIndex);
        }
    }

    /**
     * 选中帧
     */
    selectFrame(index) {
        this.currentFrameIndex = index;
        this.showFrame(index);
        this.updateFramesList();

        // 在编辑模式下，加载帧的emoji和变换到编辑器
        if (this.mode === 'edit') {
            const frame = this.frames[index];
            this.emojiInput.value = frame.isImage ? '' : frame.emoji;
            if (frame.transform) {
                this.transform = { ...frame.transform };
                this.scaleSlider.value = this.transform.scale;
                this.scaleValue.textContent = this.transform.scale + '%';
                this.offsetXSlider.value = this.transform.offsetX;
                this.offsetXValue.textContent = this.transform.offsetX;
                this.offsetYSlider.value = this.transform.offsetY;
                this.offsetYValue.textContent = this.transform.offsetY;
                this.rotateSlider.value = this.transform.rotate;
                this.rotateValue.textContent = this.transform.rotate + '°';
            }

            if (frame.emojiFitMode) {
                this.emojiFitMode = frame.emojiFitMode;
            }
            if (Number.isFinite(frame.emojiScale)) {
                this.emojiScale = frame.emojiScale;
            }
            if (this.emojiScaleInput) {
                this.emojiScaleInput.value = this.emojiScale;
            }
            this.updateEmojiFitControls();
        }
        this.syncRenderControls(this.frames[index]);
    }

    /**
     * 显示指定帧到动画canvas
     */
    showFrame(index) {
        if (index >= 0 && index < this.frames.length) {
            const frame = this.frames[index];
            this.renderPixels(this.ctx, frame.imageData, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        }
    }

    /**
     * 删除帧
     */
    deleteFrame(index) {
        this.frames.splice(index, 1);
        if (this.currentFrameIndex >= this.frames.length) {
            this.currentFrameIndex = Math.max(0, this.frames.length - 1);
        }
        this.updateFramesList();
        this.syncRenderControls(this.getCurrentFrame());
    }

    /**
     * 清空所有帧
     */
    clearFrames() {
        if (this.frames.length === 0) return;

        if (confirm(this.t('confirmClearFrames'))) {
            this.frames = [];
            this.currentFrameIndex = 0;
            this.pauseAnimation();
            this.updateFramesList();
            this.ctx.clearRect(0, 0, 640, 640);
            this.syncRenderControls(null);
        }
    }

    /**
     * 重建帧（当设置改变时）
     */
    rebuildFrames() {
        this.frames.forEach(frame => {
            const transform = frame.transform || { scale: 100, offsetX: 0, offsetY: 0, rotate: 0 };
            const fitSettings = this.getEmojiFitSettingsForFrame(frame);
            if (frame.isImage && frame.imageElement) {
                frame.baseImageData = this.imageToPixels(frame.imageElement, this.gridWidth, this.gridHeight, transform, fitSettings);
                frame.processOps = [];
            } else {
                frame.baseImageData = this.emojiToPixels(frame.emoji, this.gridWidth, this.gridHeight, transform, fitSettings);
            }
            if (frame.baseImageData) {
                frame.imageData = this.applyProcessingPipeline(frame, this.cloneImageData(frame.baseImageData));
            }
            this.renderPixels(frame.thumbCanvas.getContext('2d'), frame.imageData, 60, 60, this.pixelStyle, this.getRenderSettingsForFrame(frame));
        });
        this.updateFramesList();
    }

    /**
     * 播放动画
     */
    playAnimation() {
        if (this.frames.length < 2) {
            this.showToast(this.t('needTwoFramesPlay'));
            return;
        }

        this.isPlaying = true;
        this.setMode('play');
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;

        const speed = parseInt(this.animSpeedInput.value);
        const tweenCount = this.tweenFrames; // 使用用户设置的中间帧数

        // 如果没有中间帧，直接切换
        if (tweenCount === 0) {
            let currentBase = this.currentFrameIndex;
            const getFrameDuration = (index) => {
                const frame = this.frames[index];
                if (frame && Number.isFinite(frame.durationMs) && frame.durationMs > 0) {
                    return frame.durationMs;
                }
                return speed;
            };
            const animate = () => {
                if (!this.isPlaying) return;
                this.showFrame(currentBase);
                this.currentFrameIndex = currentBase;
                this.highlightCurrentFrame();
                const frameDuration = getFrameDuration(currentBase);
                currentBase = (currentBase + 1) % this.frames.length;
                this.animationInterval = setTimeout(animate, frameDuration);
            };
            animate();
            return;
        }

        // 有中间帧时的动画
        const frameTime = speed / (tweenCount + 1); // 每帧时间
        let transitionStep = 0;
        let currentBase = this.currentFrameIndex;

        const animate = () => {
            if (!this.isPlaying) return;

            if (transitionStep === 0) {
                // 显示当前关键帧
                this.showFrame(currentBase);
                this.currentFrameIndex = currentBase;
                this.highlightCurrentFrame();
            }

            transitionStep++;

            if (transitionStep <= tweenCount) {
                // 显示中间过渡帧
                const nextIndex = (currentBase + 1) % this.frames.length;
                const progress = transitionStep / (tweenCount + 1);
                this.showTransition(currentBase, nextIndex, progress);
                this.animationInterval = setTimeout(animate, frameTime);
            } else {
                // 移动到下一个关键帧
                currentBase = (currentBase + 1) % this.frames.length;
                transitionStep = 0;
                this.animationInterval = setTimeout(animate, frameTime);
            }
        };

        animate();
    }

    /**
     * 显示两帧之间的过渡
     */
    showTransition(fromIndex, toIndex, progress) {
        const fromFrame = this.frames[fromIndex];
        const toFrame = this.frames[toIndex];
        const width = fromFrame.imageData.width;
        const height = fromFrame.imageData.height;
        const fromData = fromFrame.imageData.data;
        const toData = toFrame.imageData.data;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const blended = ctx.createImageData(width, height);

        // 使用easeInOut缓动函数
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        for (let i = 0; i < blended.data.length; i += 4) {
            blended.data[i] = Math.round(fromData[i] * (1 - easeProgress) + toData[i] * easeProgress);
            blended.data[i + 1] = Math.round(fromData[i + 1] * (1 - easeProgress) + toData[i + 1] * easeProgress);
            blended.data[i + 2] = Math.round(fromData[i + 2] * (1 - easeProgress) + toData[i + 2] * easeProgress);
            blended.data[i + 3] = Math.round(fromData[i + 3] * (1 - easeProgress) + toData[i + 3] * easeProgress);
        }

        const settings = this.getRenderSettingsForFrame(fromFrame);
        this.renderPixels(this.ctx, blended, this.mainCanvas.width, this.mainCanvas.height, this.pixelStyle, settings);
    }

    /**
     * 高亮当前帧
     */
    highlightCurrentFrame() {
        const items = this.framesContainer.querySelectorAll('.frame-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentFrameIndex);
        });
    }

    /**
     * 暂停动画
     */
    pauseAnimation() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        if (this.animationInterval) {
            clearTimeout(this.animationInterval);
            this.animationInterval = null;
        }
        // 暂停后恢复编辑模式
        this.setMode('edit');
    }

    /**
     * 下载PNG
     */
    downloadPNG() {
        const exportType = this.exportType;
        const result = this.createExportCanvas(exportType);
        if (!result) return;

        let filename;
        if (exportType === 'preview') {
            filename = `emoji-preview-${result.width}x${result.height}.png`;
        } else {
            filename = `emoji-pixel-${this.gridWidth}x${this.gridHeight}.png`;
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = result.canvas.toDataURL('image/png');
        link.click();
        this.showToast(this.t('pngDownloaded', { size: result.sizeInfo }));
    }

    /**
     * 复制到剪贴板
     */
    async copyToClipboard() {
        const result = this.createExportCanvas(this.exportType);
        if (!result) return;

        try {
            const blob = await new Promise(resolve => result.canvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            this.showToast(this.t('copiedClipboard'));
        } catch (err) {
            this.showToast(this.t('copyFailed'));
            console.error(err);
        }
    }

    getActivePixelData() {
        const emoji = this.emojiInput.value;
        if (!emoji && this.frames.length === 0) {
            this.showToast(this.t('needEmojiOrFrame'));
            return null;
        }

        let imageData;
        let renderSettings = this.getGlobalRenderSettings();
        if (emoji) {
            const frame = this.getCurrentFrame();
            const fitSettings = this.getEmojiFitSettingsForFrame(frame && frame.emoji === emoji ? frame : null);
            imageData = this.emojiToPixels(emoji, this.gridWidth, this.gridHeight, null, fitSettings);
        } else if (this.frames.length > 0) {
            const frame = this.frames[this.currentFrameIndex];
            imageData = frame.imageData;
            renderSettings = this.getRenderSettingsForFrame(frame);
        }

        if (!imageData) {
            this.showToast(this.t('pixelDataUnavailable'));
            return null;
        }

        return { imageData, renderSettings };
    }

    createExportCanvas(exportType) {
        const source = this.getActivePixelData();
        if (!source) return null;

        const { imageData, renderSettings } = source;
        const outputCanvas = document.createElement('canvas');
        const ctx = outputCanvas.getContext('2d');
        let sizeInfo;

        if (exportType === 'preview') {
            const previewWidth = this.gridWidth * 20;
            const previewHeight = this.gridHeight * 20;
            outputCanvas.width = previewWidth;
            outputCanvas.height = previewHeight;
            this.renderPixels(ctx, imageData, previewWidth, previewHeight, this.pixelStyle, renderSettings);
            sizeInfo = `${previewWidth}x${previewHeight}`;
        } else {
            const processed = this.applyRenderPipeline(imageData, renderSettings);
            const outputData = this.prepareOutputImageData(processed);
            outputCanvas.width = this.gridWidth;
            outputCanvas.height = this.gridHeight;
            ctx.putImageData(outputData, 0, 0);
            sizeInfo = `${this.gridWidth}x${this.gridHeight}`;
        }

        return {
            canvas: outputCanvas,
            width: outputCanvas.width,
            height: outputCanvas.height,
            sizeInfo
        };
    }

    buildTianshanFilename(extension = '.png') {
        const now = new Date();
        const pad = (value) => String(value).padStart(2, '0');
        const timestamp = [
            now.getFullYear(),
            pad(now.getMonth() + 1),
            pad(now.getDate())
        ].join('') + '-' + [
            pad(now.getHours()),
            pad(now.getMinutes()),
            pad(now.getSeconds())
        ].join('');

        const normalizedExt = extension.startsWith('.') ? extension : `.${extension}`;
        return `emoji2pixel-${timestamp}${normalizedExt}`;
    }

    async createGifBlob() {
        if (this.frames.length < 2) return null;

        const animSpeed = parseInt(this.animSpeedInput.value);
        const totalFramesPerKeyframe = this.tweenFrames + 1;
        const usePerFrameDelay = this.tweenFrames === 0 && this.frames.every(f => Number.isFinite(f.durationMs) && f.durationMs > 0);
        const gif = new SimpleGIF({
            width: this.gridWidth,
            height: this.gridHeight,
            delay: animSpeed,
            framesPerKeyframe: totalFramesPerKeyframe
        });

        for (let i = 0; i < this.frames.length; i++) {
            if (usePerFrameDelay) {
                gif.addFrame(this.getFramePixelData(i), this.frames[i].durationMs);
            } else {
                gif.addFrame(this.getFramePixelData(i));
                if (this.tweenFrames > 0) {
                    const nextIndex = (i + 1) % this.frames.length;
                    for (let step = 1; step <= this.tweenFrames; step++) {
                        const progress = step / (this.tweenFrames + 1);
                        gif.addFrame(this.getTransitionPixelData(i, nextIndex, progress));
                    }
                }
            }
        }

        return gif.generate();
    }

    async requestTianshanJson(endpoint, options = {}) {
        const url = `http://${this.tianshanHost}/api/v1/${endpoint}`;
        const response = await fetch(url, options);
        let data = null;
        try {
            data = await response.json();
        } catch (err) {
            data = null;
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        if (data && typeof data.code === 'number' && data.code !== 0) {
            throw new Error(data.message || `code ${data.code}`);
        }
        return data;
    }

    async ensureTianshanImagesDir() {
        try {
            await this.requestTianshanJson('storage/mkdir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: this.tianshanImageDir })
            });
            return true;
        } catch (err) {
            return false;
        }
    }

    async uploadToTianshan() {
        const hasAnimation = this.frames.length >= 2;
        const filename = this.buildTianshanFilename(hasAnimation ? '.gif' : '.png');

        let blob = null;
        if (hasAnimation) {
            blob = await this.createGifBlob();
        } else {
            const exportResult = this.createExportCanvas('raw');
            if (!exportResult) return;
            blob = await new Promise(resolve => exportResult.canvas.toBlob(resolve, 'image/png'));
        }
        if (!blob) {
            this.showToast(this.t('tianshanUploadFailed', { message: this.t('pixelDataUnavailable') }));
            return;
        }

        this.showToast(this.t('tianshanUploading'));

        try {
            await this.ensureTianshanImagesDir();

            const uploadPath = `${this.tianshanImageDir}/${filename}`;
            const uploadUrl = `http://${this.tianshanHost}/api/v1/file/upload?path=${encodeURIComponent(uploadPath)}`;

            const uploadResponse = await fetch(uploadUrl, {
                method: 'POST',
                body: blob
            });

            let uploadData = null;
            try {
                uploadData = await uploadResponse.json();
            } catch (err) {
                uploadData = null;
            }

            if (!uploadResponse.ok) {
                throw new Error(`HTTP ${uploadResponse.status}`);
            }

            if (uploadData && typeof uploadData.code === 'number' && uploadData.code !== 0) {
                throw new Error(uploadData.message || `code ${uploadData.code}`);
            }

            const imagePath = `${this.tianshanImageDir}/${filename}`;
            await this.requestTianshanJson('led/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device: this.tianshanDevice, path: imagePath, center: 'image' })
            });

            this.showToast(this.t('tianshanUploaded', { name: filename }));
        } catch (err) {
            if (err && err.message && err.message.includes('HTTP 404')) {
                this.showToast(this.t('tianshanNeedRm01'));
                return;
            }
            this.showToast(this.t('tianshanUploadFailed', { message: err.message || 'error' }));
        }
    }

    /**
     * 下载GIF动画
     */
    async downloadGIF() {
        if (this.frames.length < 2) {
            this.showToast(this.t('needTwoFramesGif'));
            return;
        }

        this.showToast(this.t('gifGenerating'));

        try {
            const animSpeed = parseInt(this.animSpeedInput.value);
            const totalFramesPerKeyframe = this.tweenFrames + 1;
            const usePerFrameDelay = this.tweenFrames === 0 && this.frames.every(f => Number.isFinite(f.durationMs) && f.durationMs > 0);
            const gif = new SimpleGIF({
                width: this.gridWidth,
                height: this.gridHeight,
                delay: animSpeed,
                framesPerKeyframe: totalFramesPerKeyframe
            });

            for (let i = 0; i < this.frames.length; i++) {
                if (usePerFrameDelay) {
                    gif.addFrame(this.getFramePixelData(i), this.frames[i].durationMs);
                } else {
                    gif.addFrame(this.getFramePixelData(i));
                    if (this.tweenFrames > 0) {
                        const nextIndex = (i + 1) % this.frames.length;
                        for (let step = 1; step <= this.tweenFrames; step++) {
                            const progress = step / (this.tweenFrames + 1);
                            gif.addFrame(this.getTransitionPixelData(i, nextIndex, progress));
                        }
                    }
                }
            }

            const blob = gif.generate();
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.download = 'emoji-animation.gif';
            link.href = url;
            link.click();

            URL.revokeObjectURL(url);
            this.showToast(this.t('gifDownloaded'));
        } catch (err) {
            this.showToast(this.t('gifFailed'));
            console.error(err);
        }
    }

    /**
     * 获取帧的像素数据（带角落像素）
     */
    getFramePixelData(index) {
        const frame = this.frames[index];
        const processed = this.applyRenderPipeline(frame.imageData, this.getRenderSettingsForFrame(frame));
        return this.prepareOutputImageData(processed);
    }

    /**
     * 获取过渡帧的像素数据（带角落像素）
     */
    getTransitionPixelData(fromIndex, toIndex, progress) {
        const fromFrame = this.frames[fromIndex];
        const toFrame = this.frames[toIndex];
        const fromData = fromFrame.imageData;
        const toData = toFrame.imageData;
        const width = this.gridWidth;
        const height = this.gridHeight;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const newImageData = ctx.createImageData(width, height);
        const data = newImageData.data;

        // 使用easeInOut缓动函数使过渡更平滑
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.round(fromData.data[i] * (1 - easeProgress) + toData.data[i] * easeProgress);
            data[i + 1] = Math.round(fromData.data[i + 1] * (1 - easeProgress) + toData.data[i + 1] * easeProgress);
            data[i + 2] = Math.round(fromData.data[i + 2] * (1 - easeProgress) + toData.data[i + 2] * easeProgress);
            data[i + 3] = Math.round(fromData.data[i + 3] * (1 - easeProgress) + toData.data[i + 3] * easeProgress);
        }

        const processed = this.applyRenderPipeline(newImageData, this.getRenderSettingsForFrame(fromFrame));
        return this.addCornerPixels(processed);
    }

    /**
     * 显示toast提示
     */
    showToast(message) {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 2500);
    }

    /**
     * 给图像四角添加几乎不可见的像素（防止matrix自动缩放）
     * 仅在角落为透明时添加
     */
    addCornerPixels(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;

        // 四个角的位置索引
        const corners = [
            0,                                      // 左上 (0, 0)
            (width - 1) * 4,                        // 右上 (width-1, 0)
            (height - 1) * width * 4,               // 左下 (0, height-1)
            ((height - 1) * width + (width - 1)) * 4 // 右下 (width-1, height-1)
        ];

        // 几乎不可见的暗色像素 (RGB: 1,1,1, Alpha: 255)
        // 在LED点阵上几乎看不出来，但可以防止自动缩放
        const cornerPixel = { r: 1, g: 1, b: 1, a: 255 };

        for (const idx of corners) {
            // 检查该角落是否透明 (alpha < 10)
            if (data[idx + 3] < 10) {
                data[idx] = cornerPixel.r;
                data[idx + 1] = cornerPixel.g;
                data[idx + 2] = cornerPixel.b;
                data[idx + 3] = cornerPixel.a;
            }
        }

        return imageData;
    }

    /**
     * 复制ImageData并添加角落像素
     */
    prepareOutputImageData(sourceImageData) {
        // 复制一份新的ImageData
        const canvas = document.createElement('canvas');
        canvas.width = sourceImageData.width;
        canvas.height = sourceImageData.height;
        const ctx = canvas.getContext('2d');
        const newImageData = ctx.createImageData(sourceImageData.width, sourceImageData.height);
        newImageData.data.set(sourceImageData.data);

        // 添加角落像素
        return this.addCornerPixels(newImageData);
    }
}

/**
 * 简化的GIF生成器
 * 支持单一 delay 或每帧独立 delay（addFrame 传入 delayMs 时）
 */
class SimpleGIF {
    constructor(options) {
        this.width = options.width || 32;
        this.height = options.height || 32;
        // 每帧延迟 = 总时间 / 每关键帧的帧数；GIF 单位：百分之一秒
        const framesPerKeyframe = options.framesPerKeyframe || 1;
        this.delay = Math.max(2, Math.round((options.delay || 500) / framesPerKeyframe / 10));
        this.frames = [];
    }

    addFrame(imageData, delayMs) {
        const data = new Uint8Array(imageData.data);
        const delay = typeof delayMs === 'number' && delayMs >= 0
            ? Math.max(2, Math.round(delayMs / 10))
            : this.delay;
        this.frames.push({ data, delay });
    }

    generate() {
        const gif = new GIFBuilder(this.width, this.height);
        this.frames.forEach(({ data, delay }) => {
            gif.addFrame(data, delay);
        });
        return gif.build();
    }
}

/**
 * GIF文件构建器 - 使用局部颜色表确保每帧颜色正确
 */
class GIFBuilder {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.frames = [];
    }

    writeLittleEndian(value, bytes) {
        const result = [];
        for (let i = 0; i < bytes; i++) {
            result.push(value & 0xFF);
            value >>= 8;
        }
        return result;
    }

    addFrame(pixels, delay) {
        // 量化颜色到256色并创建调色板
        const { palette, indexedPixels, transparentIndex } = this.quantize(pixels);
        this.frames.push({ palette, indexedPixels, delay, transparentIndex });
    }

    quantize(pixels) {
        const colorMap = new Map();
        const colors = [];
        const indexedPixels = [];
        let transparentIndex = 0;

        // 先添加透明色
        colors.push([0, 0, 0]);
        colorMap.set('transparent', 0);

        // 收集所有颜色
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            if (a < 128) {
                // 透明像素
                indexedPixels.push(0);
            } else {
                // 量化颜色以减少颜色数（保留高5位）
                const qr = r & 0xF8;
                const qg = g & 0xF8;
                const qb = b & 0xF8;
                const key = `${qr},${qg},${qb}`;

                if (!colorMap.has(key)) {
                    if (colors.length < 256) {
                        colorMap.set(key, colors.length);
                        colors.push([r, g, b]); // 存储原始颜色
                    } else {
                        // 找最接近的颜色
                        let minDist = Infinity;
                        let closest = 1;
                        for (let j = 1; j < colors.length; j++) {
                            const dist = Math.abs(colors[j][0] - r) +
                                        Math.abs(colors[j][1] - g) +
                                        Math.abs(colors[j][2] - b);
                            if (dist < minDist) {
                                minDist = dist;
                                closest = j;
                            }
                        }
                        colorMap.set(key, closest);
                    }
                }
                indexedPixels.push(colorMap.get(key));
            }
        }

        // 填充到256色
        while (colors.length < 256) {
            colors.push([0, 0, 0]);
        }

        // 构建调色板
        const palette = [];
        for (const [r, g, b] of colors) {
            palette.push(r, g, b);
        }

        return { palette, indexedPixels, transparentIndex };
    }

    build() {
        const bytes = [];

        // GIF Header
        bytes.push(0x47, 0x49, 0x46, 0x38, 0x39, 0x61); // GIF89a

        // Logical Screen Descriptor
        bytes.push(...this.writeLittleEndian(this.width, 2));
        bytes.push(...this.writeLittleEndian(this.height, 2));
        bytes.push(0x70); // 无全局颜色表，颜色深度8位
        bytes.push(0);    // 背景色索引
        bytes.push(0);    // 像素宽高比

        // Netscape扩展 (循环播放)
        bytes.push(0x21, 0xFF, 0x0B);
        bytes.push(0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30); // NETSCAPE2.0
        bytes.push(0x03, 0x01, 0x00, 0x00, 0x00);

        // 添加每一帧
        for (const frame of this.frames) {
            // Graphic Control Extension
            bytes.push(0x21, 0xF9, 0x04);
            bytes.push(0x09); // 透明色标志 + 不处理方式
            bytes.push(...this.writeLittleEndian(frame.delay, 2));
            bytes.push(frame.transparentIndex); // 透明色索引
            bytes.push(0x00); // 块结束

            // Image Descriptor - 使用局部颜色表
            bytes.push(0x2C);
            bytes.push(...this.writeLittleEndian(0, 2)); // left
            bytes.push(...this.writeLittleEndian(0, 2)); // top
            bytes.push(...this.writeLittleEndian(this.width, 2));
            bytes.push(...this.writeLittleEndian(this.height, 2));
            bytes.push(0x87); // 局部颜色表标志, 256色

            // 局部颜色表
            bytes.push(...frame.palette);

            // LZW压缩图像数据
            const lzwData = this.lzwEncode(frame.indexedPixels, 8);
            bytes.push(8); // LZW最小码长

            // 分块输出
            let pos = 0;
            while (pos < lzwData.length) {
                const chunkSize = Math.min(255, lzwData.length - pos);
                bytes.push(chunkSize);
                for (let i = 0; i < chunkSize; i++) {
                    bytes.push(lzwData[pos++]);
                }
            }
            bytes.push(0x00); // 块结束
        }

        // GIF Trailer
        bytes.push(0x3B);

        return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
    }

    lzwEncode(pixels, minCodeSize) {
        const clearCode = 1 << minCodeSize;
        const endCode = clearCode + 1;
        const output = [];

        let codeSize = minCodeSize + 1;
        let nextCode = endCode + 1;

        // 使用数字数组作为键的字典
        const codeTable = new Map();

        // 初始化单字符码
        const initTable = () => {
            codeTable.clear();
            for (let i = 0; i < clearCode; i++) {
                codeTable.set(i.toString(), i);
            }
            codeSize = minCodeSize + 1;
            nextCode = endCode + 1;
        };

        initTable();

        let buffer = 0;
        let bufferBits = 0;

        const writeCode = (code) => {
            buffer |= (code << bufferBits);
            bufferBits += codeSize;

            while (bufferBits >= 8) {
                output.push(buffer & 0xFF);
                buffer >>= 8;
                bufferBits -= 8;
            }
        };

        // 写入清除码
        writeCode(clearCode);

        if (pixels.length === 0) {
            writeCode(endCode);
            if (bufferBits > 0) {
                output.push(buffer & 0xFF);
            }
            return output;
        }

        let indexBuffer = [pixels[0]];

        for (let i = 1; i < pixels.length; i++) {
            const k = pixels[i];
            const newBuffer = [...indexBuffer, k];
            const key = newBuffer.join(',');

            if (codeTable.has(key)) {
                indexBuffer = newBuffer;
            } else {
                // 输出当前序列的码
                const currentKey = indexBuffer.join(',');
                writeCode(codeTable.get(currentKey));

                // 添加新序列到码表
                if (nextCode < 4096) {
                    codeTable.set(key, nextCode);
                    nextCode++;

                    // 检查是否需要增加码长
                    if (nextCode > (1 << codeSize) && codeSize < 12) {
                        codeSize++;
                    }
                } else {
                    // 码表满了，发送清除码
                    writeCode(clearCode);
                    initTable();
                }

                indexBuffer = [k];
            }
        }

        // 输出最后的序列
        const finalKey = indexBuffer.join(',');
        writeCode(codeTable.get(finalKey));

        // 写入结束码
        writeCode(endCode);

        // 刷新缓冲区
        if (bufferBits > 0) {
            output.push(buffer & 0xFF);
        }

        return output;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Emoji2Pixel();
});
