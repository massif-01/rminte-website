(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const hashLang = window.location.hash.startsWith('#en-') ? 'en' : window.location.hash.startsWith('#zh-') ? 'zh' : null;
  let lang = hashLang || (localStorage.getItem('rm-soft-lang') === 'en' ? 'en' : 'zh');
  let scrollTicking = false;

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

  function applyLanguage(nextLang, preserveHeading = false) {
    const headingKey = preserveHeading ? currentHeadingKey() : null;
    lang = nextLang;
    localStorage.setItem('rm-soft-lang', lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    $$('[data-guide-text]').forEach((element) => {
      const value = element.dataset[lang];
      if (value !== undefined) element.textContent = value;
    });

    $$('[data-lang-pane]').forEach((pane) => {
      pane.hidden = pane.dataset.langPane !== lang;
    });

    $$('[data-guide-lang-toggle]').forEach((button) => {
      button.textContent = lang === 'zh' ? 'EN' : '中';
      button.setAttribute('aria-label', lang === 'zh' ? '切换到英文' : 'Switch to Chinese');
    });

    const data = pageData();
    if (data?.title) {
      document.title = `${data.title[lang]} - ${lang === 'zh' ? '泛灵人工智能' : 'RMinte AI'}`;
    } else {
      document.title = lang === 'zh' ? '使用指南 - 泛灵人工智能' : 'Guides - RMinte AI';
    }

    if (headingKey) {
      requestAnimationFrame(() => {
        const target = $(`[data-lang-pane="${lang}"].guide-article [data-heading-key="${headingKey}"]`);
        if (target) window.scrollTo({ top: target.offsetTop - 132, behavior: 'auto' });
        updateToc();
      });
    } else {
      updateToc();
    }
  }

  function setupLanguage() {
    $$('[data-guide-lang-toggle]').forEach((button) => {
      button.addEventListener('click', () => {
        applyLanguage(lang === 'zh' ? 'en' : 'zh', true);
      });
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

  function setupCopyButtons() {
    const data = pageData();
    $$('[data-copy-code]').forEach((button) => {
      button.addEventListener('click', async () => {
        const code = $('code', button.closest('.guide-code'));
        if (!code) return;
        try {
          await navigator.clipboard.writeText(code.textContent);
          button.textContent = data?.copy?.[lang] || (lang === 'zh' ? '已复制' : 'Copied');
          window.setTimeout(() => {
            button.textContent = data?.copyDefault?.[lang] || (lang === 'zh' ? '复制' : 'Copy');
          }, 1400);
        } catch {
          button.textContent = lang === 'zh' ? '复制失败' : 'Copy failed';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupLanguage();
    setupToc();
    setupCopyButtons();
  });
})();
