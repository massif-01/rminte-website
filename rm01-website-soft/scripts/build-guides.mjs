import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const siteDir = join(scriptDir, '..');
const guidesDir = join(siteDir, 'guides');

const guideConfig = {
  admin: {
    source: join(guidesDir, 'content', 'admin.md'),
    output: join(guidesDir, 'admin.html'),
    accent: 'admin',
    label: { zh: '日常管理', en: 'Daily administration' },
    title: { zh: 'TianshanOS admin 日常使用指南', en: 'TianshanOS Admin User Guide' },
    description: {
      zh: '面向使用 admin 账户管理 TianshanOS 的用户，覆盖系统状态、设备面板、网络、文件与 OTA 更新。',
      en: 'For users managing TianshanOS with the admin account, covering system status, devices, networking, files, and OTA updates.'
    },
    chapterCount: { zh: '9 个章节', en: '9 chapters' },
    next: { href: 'root.html', zh: '继续阅读 Root 指南', en: 'Continue to the Root guide' }
  },
  root: {
    source: join(guidesDir, 'content', 'root.md'),
    output: join(guidesDir, 'root.html'),
    accent: 'root',
    label: { zh: '系统运维', en: 'System operations' },
    title: { zh: 'TianshanOS root 运维指南', en: 'TianshanOS Root Operations Guide' },
    description: {
      zh: '面向使用 root 账户管理 TianshanOS 的运维人员，包含共用日常功能以及终端、指令与自动化。',
      en: 'For operators managing TianshanOS with the root account, including shared daily tasks, terminal, commands, and automation.'
    },
    chapterCount: { zh: '12 个章节', en: '12 chapters' },
    next: { href: 'security.html', zh: '继续阅读安全指南', en: 'Continue to the Security guide' }
  },
  security: {
    source: {
      zh: join(guidesDir, 'content', 'security.zh.md'),
      en: join(guidesDir, 'content', 'security.en.md')
    },
    output: join(guidesDir, 'security.html'),
    accent: 'security',
    label: { zh: '安全管理', en: 'Security operations' },
    title: { zh: 'TianshanOS 安全页面完整操作指南', en: 'TianshanOS Security Page Guide' },
    description: {
      zh: '面向个人用户、安全管理员与设备运维工程师，说明安全页面能做什么、不能做什么，以及如何验证每次关键操作。',
      en: 'For individual users, security administrators, and device operators. Learn what the Security page can and cannot do, and how to verify every critical action.'
    },
    chapterCount: { zh: '8 个章节', en: '8 chapters' },
    next: { href: 'admin.html', zh: '继续阅读 Admin 指南', en: 'Continue to the Admin guide' }
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function inlineMarkdown(value) {
  let text = escapeHtml(value);
  const code = [];
  text = text.replace(/`([^`]+)`/g, (_, content) => {
    const token = `@@CODE${code.length}@@`;
    code.push(`<code>${content}</code>`);
    return token;
  });
  text = text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  code.forEach((snippet, index) => {
    text = text.replace(`@@CODE${index}@@`, snippet);
  });
  return text;
}

function isHeading(line) {
  return /^(#{2,5})\s+/.test(line);
}

function isListItem(line) {
  return /^(\s*)([-+*]|\d+\.)\s+/.test(line);
}

function isTableStart(lines, index) {
  return /^\s*\|.*\|\s*$/.test(lines[index] || '')
    && /^\s*\|(?:\s*:?-+:?\s*\|)+\s*$/.test(lines[index + 1] || '');
}

function splitTableRow(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function renderTable(lines) {
  const rows = lines.map(splitTableRow);
  const headers = rows[0];
  const body = rows.slice(2);
  return `<div class="guide-table-wrap"><table><thead><tr>${headers.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function parseListItem(line) {
  const match = line.match(/^(\s*)([-+*]|\d+\.)\s+(.*)$/);
  return {
    indent: match[1].replaceAll('\t', '  ').length,
    type: /\d+\./.test(match[2]) ? 'ol' : 'ul',
    text: match[3]
  };
}

function renderList(items, start = 0, indent = items[start].indent) {
  const type = items[start].type;
  let html = `<${type}>`;
  let index = start;

  while (index < items.length) {
    const item = items[index];
    if (item.indent < indent || item.type !== type) break;
    if (item.indent > indent) {
      const nested = renderList(items, index, item.indent);
      html += nested.html;
      index = nested.index;
      continue;
    }

    html += `<li>${inlineMarkdown(item.text)}`;
    index += 1;
    while (index < items.length && items[index].indent > indent) {
      const nested = renderList(items, index, items[index].indent);
      html += nested.html;
      index = nested.index;
    }
    html += '</li>';
  }

  html += `</${type}>`;
  return { html, index };
}

function isCaution(text, lang) {
  if (lang === 'zh') {
    return /(?:可能.{0,18}(?:中断|断开|丢失|影响)|强制断电|高影响操作|修改前应|操作前应|执行前应|保存前应|测试期间应)/.test(text);
  }
  return /(?:may (?:interrupt|disconnect|affect|cause)|force power|high-impact|before (?:changing|running|saving|starting)|during the test)/i.test(text);
}

function renderMarkdown(source, lang) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const headings = [];
  const output = [];
  let index = 0;
  let headingIndex = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim() || /^!\[[^\]]*]\([^)]*\)\s*$/.test(line)) {
      index += 1;
      continue;
    }

    if (/^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)) {
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quote.push(lines[index].replace(/^>\s?/, '').trim());
        index += 1;
      }
      output.push(`<aside class="guide-notice"><span>${lang === 'zh' ? '重要提示' : 'Important'}</span><p>${inlineMarkdown(quote.join(' '))}</p></aside>`);
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith('```')) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      output.push(`<div class="guide-code"><button type="button" data-copy-code>${lang === 'zh' ? '复制' : 'Copy'}</button><pre><code${language ? ` class="language-${escapeHtml(language)}"` : ''}>${escapeHtml(code.join('\n'))}</code></pre></div>`);
      continue;
    }

    const headingMatch = line.match(/^(#{2,5})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      headingIndex += 1;
      const id = `${lang}-section-${headingIndex}`;
      const key = `section-${headingIndex}`;
      headings.push({ level, text, id, key });
      output.push(`<h${level} id="${id}" data-heading-key="${key}"><a href="#${id}">${inlineMarkdown(text)}</a></h${level}>`);
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableLines = [];
      while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }
      output.push(renderTable(tableLines));
      continue;
    }

    if (isListItem(line)) {
      const items = [];
      while (index < lines.length && (isListItem(lines[index]) || !lines[index].trim())) {
        if (isListItem(lines[index])) items.push(parseListItem(lines[index]));
        index += 1;
      }
      let itemIndex = 0;
      while (itemIndex < items.length) {
        const rendered = renderList(items, itemIndex, items[itemIndex].indent);
        output.push(rendered.html);
        itemIndex = rendered.index;
      }
      continue;
    }

    const paragraph = [];
    while (index < lines.length) {
      const current = lines[index];
      if (!current.trim() || current.startsWith('```') || isHeading(current) || isListItem(current) || isTableStart(lines, index)) break;
      if (!/^!\[[^\]]*]\([^)]*\)\s*$/.test(current)) paragraph.push(current.trim());
      index += 1;
    }
    const text = paragraph.join(' ');
    if (text) {
      output.push(isCaution(text, lang)
        ? `<aside class="guide-notice"><span>${lang === 'zh' ? '操作提示' : 'Operational note'}</span><p>${inlineMarkdown(text)}</p></aside>`
        : `<p>${inlineMarkdown(text)}</p>`);
    }
    if (!paragraph.length) index += 1;
  }

  return { html: output.join('\n'), headings };
}

function splitLanguages(markdown) {
  const matches = [...markdown.matchAll(/^#\s+.+$/gm)];
  if (matches.length < 2) throw new Error('Expected Chinese and English H1 sections.');
  const zhStart = markdown.indexOf('\n', matches[0].index) + 1;
  const enStart = markdown.indexOf('\n', matches[1].index) + 1;
  return {
    zh: markdown.slice(zhStart, matches[1].index),
    en: markdown.slice(enStart)
  };
}

function documentBody(markdown) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  if (/^#\s+/.test(lines[0] || '')) lines.shift();
  while (!lines[0]?.trim()) lines.shift();
  if (/^\[(?:English|中文)]\([^)]+\)\s*$/.test(lines[0] || '')) lines.shift();
  return lines.join('\n');
}

function plainSearchText(value) {
  return value
    .replace(/^\s*(?:>\s*)?/, '')
    .replace(/^\s*(?:[-+*]|\d+\.)\s+/, '')
    .replace(/^\s*\|?|\|?\s*$/g, '')
    .replace(/\|/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\\([.()\-])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSearchEntries(source, lang, slug, config) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const entries = [];
  let current = null;
  let headingIndex = 0;
  let inCode = false;

  function flush() {
    if (!current) return;
    current.text = current.parts.join(' ').replace(/\s+/g, ' ').trim();
    delete current.parts;
    entries.push(current);
  }

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      inCode = !inCode;
      return;
    }

    const headingMatch = !inCode && line.match(/^(#{2,5})\s+(.*)$/);
    if (headingMatch) {
      flush();
      headingIndex += 1;
      current = {
        lang,
        guide: slug,
        guideTitle: config.title[lang],
        guideLabel: config.label[lang],
        title: plainSearchText(headingMatch[2]),
        level: headingMatch[1].length,
        href: `${slug}.html#${lang}-section-${headingIndex}`,
        parts: []
      };
      return;
    }

    if (!current || /^\s*(?:---+|___+|\*\*\*+|\|?(?:\s*:?-+:?\s*\|)+)\s*$/.test(line)) return;
    const text = plainSearchText(line);
    if (text) current.parts.push(text);
  });

  flush();
  return entries;
}

function tocItems(headings, lang) {
  const minimumLevel = Math.min(...headings.map(({ level }) => level));
  const visible = headings.filter(({ level }) => level <= minimumLevel + 1);
  return visible.map(({ level, text, id }) => {
    const depth = level - minimumLevel;
    return `<a class="toc-link toc-depth-${depth}" href="#${id}" data-toc-target="${id}">${inlineMarkdown(text)}</a>`;
  }).join('\n');
}

function renderLanguagePane(lang, rendered) {
  return `
          <article class="guide-article lang-pane" data-lang-pane="${lang}"${lang === 'en' ? ' hidden' : ''}>
${rendered.html}
          </article>`;
}

function searchTemplate() {
  return `
    <section class="guide-search" data-guide-search>
      <form class="guide-search-form" role="search" data-guide-search-form>
        <label class="guide-search-field">
          <span class="guide-search-kicker" data-guide-text data-zh="搜索指南" data-en="Search guides">搜索指南</span>
          <input type="search" autocomplete="off" spellcheck="false" data-guide-search-input data-guide-placeholder data-zh="输入功能，例如：OTA、SSH 密钥、风扇" data-en="Search a feature, for example: OTA, SSH key, fan" placeholder="输入功能，例如：OTA、SSH 密钥、风扇">
        </label>
        <button type="submit" data-guide-text data-zh="搜索" data-en="Search">搜索</button>
      </form>
      <p class="guide-search-hint" data-guide-text data-zh="试试：OTA 更新、远程主机、HTTPS 证书、自动化规则" data-en="Try: OTA update, remote host, HTTPS certificate, automation rule">试试：OTA 更新、远程主机、HTTPS 证书、自动化规则</p>
      <div class="guide-search-results" data-guide-search-results hidden aria-live="polite">
        <div class="guide-search-results-head">
          <p data-guide-search-summary></p>
          <button type="button" data-guide-search-clear data-guide-text data-zh="清除" data-en="Clear">清除</button>
        </div>
        <div class="guide-search-result-list" data-guide-search-result-list></div>
      </div>
    </section>`;
}

function siteNavigationTemplate() {
  return `
  <header class="site-shell" aria-label="主导航">
    <a class="brand-mark" href="../index.html#hero" aria-label="RMinte 首页">
      <img src="../assets/images/img3.png" alt="RMinte">
    </a>
    <nav class="nav-island" aria-label="页面导航">
      <a href="../index.html#product" data-guide-text data-zh="产品" data-en="Product">产品</a>
      <a href="../index.html#hardware" data-guide-text data-zh="架构" data-en="Architecture">架构</a>
      <a href="../index.html#proof" data-guide-text data-zh="验证" data-en="Proof">验证</a>
      <a href="../index.html#applications" data-guide-text data-zh="应用" data-en="Use Cases">应用</a>
      <a class="active" href="index.html" aria-current="page" data-guide-text data-zh="指南" data-en="Guides">指南</a>
    </nav>
    <div class="nav-actions">
      <button class="language-toggle" type="button" data-guide-lang-toggle>EN</button>
      <button class="menu-button" type="button" aria-label="打开菜单" aria-controls="mobileOverlay" aria-expanded="false" data-menu-toggle>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <div class="mobile-overlay" id="mobileOverlay" aria-hidden="true">
    <div class="mobile-overlay-panel">
      <div class="mobile-overlay-top">
        <span>RMinte</span>
        <button class="ghost-button" type="button" data-menu-close data-guide-text data-zh="关闭" data-en="Close">关闭</button>
      </div>
      <nav class="mobile-links" aria-label="移动导航">
        <a href="../index.html#product" data-guide-text data-zh="产品" data-en="Product">产品</a>
        <a href="../index.html#hardware" data-guide-text data-zh="架构" data-en="Architecture">架构</a>
        <a href="../index.html#proof" data-guide-text data-zh="验证" data-en="Proof">验证</a>
        <a href="../index.html#applications" data-guide-text data-zh="应用" data-en="Use Cases">应用</a>
        <a class="active" href="index.html" aria-current="page" data-guide-text data-zh="指南" data-en="Guides">指南</a>
      </nav>
    </div>
  </div>`;
}

function pageTemplate(config, rendered) {
  const pageData = JSON.stringify({
    title: config.title,
    copy: { zh: '已复制', en: 'Copied' },
    copyDefault: { zh: '复制', en: 'Copy' }
  }).replaceAll('<', '\\u003c');
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(config.description.zh)}">
  <meta property="og:title" content="${escapeHtml(config.title.zh)}">
  <meta property="og:description" content="${escapeHtml(config.description.zh)}">
  <meta property="og:image" content="../assets/images/img4.png">
  <meta name="theme-color" content="#050606">
  <title>${escapeHtml(config.title.zh)} - 泛灵人工智能</title>
  <link rel="icon" href="../assets/images/img3.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&amp;family=Noto+Sans+SC:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/styles.css?v=agency-24">
  <link rel="stylesheet" href="../assets/guides.css?v=agency-24">
  <script id="guidePageData" type="application/json">${pageData}</script>
  <script src="../assets/guides.js?v=agency-24" defer></script>
</head>
<body class="guide-body guide-doc-body guide-accent-${config.accent}">
  <a class="skip-link" href="#guideContent" data-guide-text data-zh="跳至指南正文" data-en="Skip to guide content">跳至指南正文</a>
  <div class="ambient-field" aria-hidden="true"></div>
${siteNavigationTemplate()}

  <main id="guideContent" class="guide-doc-main">
    <section class="guide-doc-hero">
      <a class="guide-breadcrumb" href="index.html"><span aria-hidden="true">←</span><span data-guide-text data-zh="全部指南" data-en="All guides">全部指南</span></a>
      <p class="eyebrow" data-guide-text data-zh="${escapeHtml(config.label.zh)}" data-en="${escapeHtml(config.label.en)}">${escapeHtml(config.label.zh)}</p>
      <h1 data-guide-text data-zh="${escapeHtml(config.title.zh)}" data-en="${escapeHtml(config.title.en)}">${escapeHtml(config.title.zh)}</h1>
      <p class="guide-doc-lead" data-guide-text data-zh="${escapeHtml(config.description.zh)}" data-en="${escapeHtml(config.description.en)}">${escapeHtml(config.description.zh)}</p>
      <div class="guide-doc-meta">
        <span data-guide-text data-zh="${escapeHtml(config.chapterCount.zh)}" data-en="${escapeHtml(config.chapterCount.en)}">${escapeHtml(config.chapterCount.zh)}</span>
        <span data-guide-text data-zh="中英双语" data-en="Chinese and English">中英双语</span>
        <span>TianshanOS</span>
      </div>
    </section>
${searchTemplate()}

    <details class="guide-mobile-toc">
      <summary data-guide-text data-zh="展开本页目录" data-en="Open page contents">展开本页目录</summary>
      <nav class="lang-pane" data-lang-pane="zh" aria-label="中文目录">
${tocItems(rendered.zh.headings, 'zh')}
      </nav>
      <nav class="lang-pane" data-lang-pane="en" aria-label="English contents" hidden>
${tocItems(rendered.en.headings, 'en')}
      </nav>
    </details>

    <div class="guide-doc-layout">
      <aside class="guide-toc" aria-label="本页目录">
        <p data-guide-text data-zh="本页目录" data-en="On this page">本页目录</p>
        <nav class="lang-pane" data-lang-pane="zh">
${tocItems(rendered.zh.headings, 'zh')}
        </nav>
        <nav class="lang-pane" data-lang-pane="en" hidden>
${tocItems(rendered.en.headings, 'en')}
        </nav>
      </aside>

      <div class="guide-article-column">
${renderLanguagePane('zh', rendered.zh)}
${renderLanguagePane('en', rendered.en)}
        <a class="guide-next" href="${config.next.href}">
          <span data-guide-text data-zh="下一步" data-en="Next">下一步</span>
          <strong data-guide-text data-zh="${escapeHtml(config.next.zh)}" data-en="${escapeHtml(config.next.en)}">${escapeHtml(config.next.zh)}</strong>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <aside class="guide-rail">
        <p data-guide-text data-zh="阅读提示" data-en="Reading note">阅读提示</p>
        <span data-guide-text data-zh="设备型号、硬件配置和当前状态会影响页面显示。以设备实际界面为准。" data-en="Device model, hardware configuration, and current state affect what the interface displays.">设备型号、硬件配置和当前状态会影响页面显示。以设备实际界面为准。</span>
      </aside>
    </div>
  </main>

  <footer class="guide-footer">
    <img src="../assets/images/img3.png" alt="RMinte">
    <div>
      <span>© 2026 RMinte AI</span>
    </div>
  </footer>
</body>
</html>
`;
}

const searchEntries = [];

for (const [slug, config] of Object.entries(guideConfig)) {
  const split = typeof config.source === 'string'
    ? splitLanguages(readFileSync(config.source, 'utf8'))
    : {
        zh: documentBody(readFileSync(config.source.zh, 'utf8')),
        en: documentBody(readFileSync(config.source.en, 'utf8'))
      };
  const rendered = {
    zh: renderMarkdown(split.zh, 'zh'),
    en: renderMarkdown(split.en, 'en')
  };
  if (rendered.zh.headings.length !== rendered.en.headings.length) {
    throw new Error(`${config.output}: Chinese and English heading counts differ.`);
  }
  searchEntries.push(
    ...buildSearchEntries(split.zh, 'zh', slug, config),
    ...buildSearchEntries(split.en, 'en', slug, config)
  );
  writeFileSync(config.output, pageTemplate(config, rendered));
  console.log(`Built ${config.output} (${rendered.zh.headings.length} headings per language)`);
}

writeFileSync(join(guidesDir, 'search-index.json'), `${JSON.stringify({ version: 1, entries: searchEntries }, null, 2)}\n`);
console.log(`Built search index (${searchEntries.length} sections)`);
