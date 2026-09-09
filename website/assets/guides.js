(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const languageFromHash = RM_I18N.fromHash;
  let lang = RM_I18N.initial();
  let scrollTicking = false;
  let refreshSearch = function () {};

  function markBrandText(root = document.body) {
    if (!root) return;
    const matches = [];
    root.querySelectorAll('*').forEach((element) => {
      if (element.closest('.rm-mark, script, style, noscript, textarea')) return;
      element.childNodes.forEach((node) => {
        if (node.nodeType === 3 && /RM-01|TianshanOS/i.test(node.nodeValue)) matches.push(node);
      });
    });

    matches.forEach((node) => {
      const parts = node.nodeValue.split(/(RM-01|TianshanOS)/gi);
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (/^(RM-01|TianshanOS)$/i.test(part)) {
          const mark = document.createElement('span');
          mark.className = 'rm-mark';
          mark.textContent = part;
          fragment.append(mark);
        } else if (part) fragment.append(document.createTextNode(part));
      });
      node.replaceWith(fragment);
    });
  }

  function pageData() {
    const node = $('#guidePageData');
    if (!node) return null;
    try {
      return JSON.parse(node.textContent);
    } catch {
      return null;
    }
  }

  function currentHeadingKey() {
    const pane = $(`[data-lang-pane="${lang}"].guide-article`);
    if (!pane) return null;
    const headings = $$('[data-heading-key]', pane);
    const anchor = window.scrollY + 160;
    let active = null;
    headings.forEach((heading) => {
      if (heading.offsetTop <= anchor) active = heading;
    });
    return active?.dataset.headingKey || null;
  }

  function updateToc() {
    const pane = $(`[data-lang-pane="${lang}"].guide-article`);
    if (!pane) return;
    const headings = $$('[data-heading-key]', pane);
    if (!headings.length) return;

    const anchor = window.scrollY + Math.max(150, window.innerHeight * 0.24);
    let active = headings[0];
    headings.forEach((heading) => {
      if (heading.offsetTop <= anchor) active = heading;
    });

    $$('[data-toc-target]').forEach((link) => {
      link.classList.toggle('active', link.dataset.tocTarget === active.id);
    });
  }

  function applyLanguage(nextLang, headingKey = null) {
    lang = nextLang;

    RM_I18N.apply(lang);

    $$('[data-guide-text]').forEach((element) => {
      const value = RM_I18N.text(element.dataset, lang);
      if (value !== undefined) element.textContent = value;
      if (lang === 'ja' && element.matches('h1')) {
        const phrases = /((?:ユーザー|ページ操作|運用)ガイド|ネットワーク|セキュリティ)/g;
        element.replaceChildren(...value.split(phrases).filter(Boolean).map(part => {
          if (!/^(?:(?:ユーザー|ページ操作|運用)ガイド|ネットワーク|セキュリティ)$/.test(part)) return document.createTextNode(part);
          const phrase = document.createElement('span');
          phrase.className = 'guide-title-phrase';
          phrase.textContent = part;
          return phrase;
        }));
      }
    });

    $$('[data-guide-placeholder]').forEach((element) => {
      const value = RM_I18N.text(element.dataset, lang);
      if (value !== undefined) element.setAttribute('placeholder', value);
    });

    $$('[data-lang-pane]').forEach((pane) => {
      pane.hidden = pane.dataset.langPane !== lang;
    });

    $$('[data-menu-toggle]').forEach((button) => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-label', RM_I18N.text({zh: isOpen ? '关闭菜单' : '打开菜单', en: isOpen ? 'Close menu' : 'Open menu'}, lang));
    });

    RM_I18N.apply(lang);

    refreshSearch();
    markBrandText();

    if (headingKey) {
      requestAnimationFrame(() => {
        const target = $(`[data-lang-pane="${lang}"].guide-article [data-heading-key="${headingKey}"]`);
        if (target) {
          window.history.replaceState(null, '', `#${target.id}`);
          const top = target.getBoundingClientRect().top + window.scrollY - 132;
          window.scrollTo({ top, behavior: 'auto' });
        }
        updateToc();
      });
    } else {
      const hashTarget = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
      if (hashTarget?.closest(`[data-lang-pane="${lang}"]`)) {
        requestAnimationFrame(() => {
          const top = hashTarget.getBoundingClientRect().top + window.scrollY - 132;
          window.scrollTo({ top, behavior: 'auto' });
          updateToc();
        });
      } else {
        updateToc();
      }
    }
  }

  function setupLanguage() {
    RM_I18N.mount('[data-guide-lang-toggle]', applyLanguage, currentHeadingKey);

    window.addEventListener('hashchange', () => {
      const hashLanguage = languageFromHash();
      if (hashLanguage && hashLanguage !== lang) applyLanguage(hashLanguage);
    });

    applyLanguage(lang);
  }

  function setupToc() {
    $$('[data-toc-target]').forEach((link) => {
      link.addEventListener('click', () => {
        const details = link.closest('details');
        if (details) details.open = false;
      });
    });

    window.addEventListener('scroll', () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        updateToc();
        scrollTicking = false;
      });
    }, { passive: true });
  }

  function setupMenu() {
    const overlay = $('#mobileOverlay');
    const button = $('[data-menu-toggle]');
    if (!overlay || !button) return;

    overlay.inert = true;
    function setOpen(open) {
      const restoreFocus = !open && overlay.contains(document.activeElement);
      overlay.inert = !open;
      if (open) requestAnimationFrame(() => $('[data-menu-close]')?.focus({ preventScroll: true }));
      else if (restoreFocus) button.focus({ preventScroll: true });
      overlay.classList.toggle('active', open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      button.classList.toggle('active', open);
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', RM_I18N.text({zh: open ? '关闭菜单' : '打开菜单', en: open ? 'Close menu' : 'Open menu'}, lang));
    }

    button.addEventListener('click', () => setOpen(!button.classList.contains('active')));
    $('[data-menu-close]')?.addEventListener('click', () => setOpen(false));
    $$('.mobile-links a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
  }

  function setupCopyButtons() {
    const data = pageData();
    $$('[data-copy-code]').forEach((button) => {
      button.addEventListener('click', async () => {
        const code = $('code', button.closest('.guide-code'));
        if (!code) return;
        const codeLanguage = button.closest('[data-lang-pane]').dataset.langPane;
        try {
          await navigator.clipboard.writeText(code.textContent);
          button.textContent = (RM_I18N.text({zh: '已复制', en: 'Copied'}, codeLanguage));
          window.setTimeout(() => {
            button.textContent = (RM_I18N.text({zh: '复制', en: 'Copy'}, codeLanguage));
          }, 1400);
        } catch {
          button.textContent = RM_I18N.text({zh: '复制失败', en: 'Copy failed'}, codeLanguage);
        }
      });
    });
  }

  function normalizeSearch(value) {
    return value.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  }

  function searchScore(entry, query) {
    const title = normalizeSearch(entry.title);
    const guide = normalizeSearch(`${entry.guideTitle} ${entry.guideLabel}`);
    const text = normalizeSearch(entry.text);
    const combined = `${title} ${guide} ${text}`;
    const terms = query.split(' ').filter(Boolean);
    if (!terms.every((term) => combined.includes(term))) return 0;

    let score = entry.lang === lang ? 10 : 0;
    if (title === query) score += 120;
    else if (title.startsWith(query)) score += 72;
    else if (title.includes(query)) score += 52;
    if (guide.includes(query)) score += 20;
    if (text.includes(query)) score += 12;

    terms.forEach((term) => {
      if (title.includes(term)) score += 18;
      if (guide.includes(term)) score += 6;
      if (text.includes(term)) score += 3;
    });
    score -= Math.max(0, entry.level - 2) * 0.25;
    return score;
  }

  function resultSnippet(entry, query) {
    const source = entry.text || entry.title;
    const normalized = normalizeSearch(source);
    const firstTerm = query.split(' ').find((term) => normalized.includes(term));
    const matchIndex = firstTerm ? normalized.indexOf(firstTerm) : 0;
    const start = Math.max(0, matchIndex - 54);
    const end = Math.min(source.length, start + 150);
    return `${start > 0 ? '…' : ''}${source.slice(start, end).trim()}${end < source.length ? '…' : ''}`;
  }

  function setupSearch() {
    const roots = $$('[data-guide-search]');
    if (!roots.length) return;

    let index = null;
    let loadFailed = false;
    let query = '';
    let firstResultHref = null;

    const indexPromise = fetch('search-index.json?v=docs-20260907')
      .then((response) => {
        if (!response.ok) throw new Error(`Search index returned ${response.status}`);
        return response.json();
      })
      .then((data) => {
        index = Array.isArray(data.entries) ? data.entries : [];
        render();
      })
      .catch(() => {
        loadFailed = true;
        render();
      });

    function createResult(entry, currentQuery) {
      const link = document.createElement('a');
      link.className = `guide-search-result guide-search-result-${entry.guide}`;
      link.href = entry.href;

      const meta = document.createElement('span');
      meta.className = 'guide-search-result-meta';
      meta.textContent = `${entry.guideLabel} · ${RM_I18N.names[entry.lang]}`;

      const title = document.createElement('strong');
      title.textContent = entry.title;

      const snippet = document.createElement('span');
      snippet.className = 'guide-search-result-snippet';
      snippet.textContent = resultSnippet(entry, currentQuery);

      const arrow = document.createElement('span');
      arrow.className = 'guide-search-result-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;pointer-events:none" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg>';

      link.append(meta, title);
      if (snippet.textContent !== entry.title) link.append(snippet);
      link.append(arrow);
      return link;
    }

    function render() {
      const normalizedQuery = normalizeSearch(query);
      firstResultHref = null;

      roots.forEach((root) => {
        const panel = $('[data-guide-search-results]', root);
        const summary = $('[data-guide-search-summary]', root);
        const list = $('[data-guide-search-result-list]', root);
        if (!panel || !summary || !list) return;

        list.replaceChildren();
        if (!normalizedQuery) {
          panel.hidden = true;
          return;
        }

        panel.hidden = false;
        if (loadFailed) {
          summary.textContent = RM_I18N.text({zh: '搜索暂时不可用，请刷新页面重试。', en: 'Search is unavailable. Refresh the page and try again.'}, lang);
          return;
        }
        if (!index) {
          summary.textContent = RM_I18N.text({zh: '正在读取指南…', en: 'Loading guides…'}, lang);
          return;
        }

        const results = index
          .filter((entry) => entry.lang === lang)
          .map((entry) => ({ entry, score: searchScore(entry, normalizedQuery) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
          .slice(0, 8)
          .map(({ entry }) => entry);

        if (!results.length) {
          summary.textContent = RM_I18N.text({zh: '没有找到“{query}”，试试更短的功能名称。', en: 'No result for “{query}”. Try a shorter feature name.'}, lang).replace('{query}', query.trim());
          return;
        }

        firstResultHref = results[0].href;
        summary.textContent = RM_I18N.text({zh: '显示 {count} 个最相关章节', en: '{count} most relevant sections'}, lang).replace('{count}', results.length);
        results.forEach((entry) => list.append(createResult(entry, normalizedQuery)));
      });
      markBrandText();
    }

    roots.forEach((root) => {
      const form = $('[data-guide-search-form]', root);
      const input = $('[data-guide-search-input]', root);
      const clear = $('[data-guide-search-clear]', root);
      if (!form || !input) return;

      input.addEventListener('input', () => {
        query = input.value;
        roots.forEach((otherRoot) => {
          const otherInput = $('[data-guide-search-input]', otherRoot);
          if (otherInput && otherInput !== input) otherInput.value = query;
        });
        render();
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (firstResultHref) window.location.href = firstResultHref;
        else render();
      });

      clear?.addEventListener('click', () => {
        query = '';
        roots.forEach((otherRoot) => {
          const otherInput = $('[data-guide-search-input]', otherRoot);
          if (otherInput) otherInput.value = '';
        });
        render();
        input.focus();
      });
    });

    refreshSearch = render;
    void indexPromise;
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupLanguage();
    setupMenu();
    setupToc();
    setupCopyButtons();
    setupSearch();
  });
})();
