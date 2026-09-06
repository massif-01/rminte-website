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
  },
  network: {
    source: join(guidesDir, 'content', 'network.md'),
    output: join(guidesDir, 'network.html'),
    accent: 'network',
    label: { zh: '网络连接', en: 'Network connectivity' },
    title: { zh: 'RM-01 网络配置指南', en: 'RM-01 Network Configuration Guide' },
    description: {
      zh: '说明 C1 与 C3 两条网络连接路径，以及用户设备接入、AI 辅助网络共享和整机接入上层网络的方法。',
      en: 'Explains the C1 and C3 network paths, device access, AI-assisted internet sharing, and how to connect the complete RM-01 system to an upstream network.'
    },
    chapterCount: { zh: '7 个章节', en: '7 chapters' },
    sourceLink: {
      href: 'https://github.com/RMinte-AI/lpmu-agx-network-setup',
      zh: '在 GitHub 查看网络自动化项目',
      en: 'View the network automation project on GitHub'
    },
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

function sourceLinkTemplate(config, lang) {
  if (!config.sourceLink) return '';
  const label = config.sourceLink[lang];
  return `
            <a class="footer-github guide-github-link" href="${escapeHtml(config.sourceLink.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(label)}">
              <svg class="github" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false" style="display:inline-block;width:18px;height:18px;flex:none;vertical-align:middle"><path d="M12 0c6.63 0 12 5.276 12 11.79-.001 5.067-3.29 9.567-8.175 11.187-.6.118-.825-.25-.825-.56 0-.398.015-1.665.015-3.242 0-1.105-.375-1.813-.81-2.181 2.67-.295 5.475-1.297 5.475-5.822 0-1.297-.465-2.344-1.23-3.169.12-.295.54-1.503-.12-3.125 0 0-1.005-.324-3.3 1.209a11.32 11.32 0 00-3-.398c-1.02 0-2.04.133-3 .398-2.295-1.518-3.3-1.209-3.3-1.209-.66 1.622-.24 2.83-.12 3.125-.765.825-1.23 1.887-1.23 3.169 0 4.51 2.79 5.527 5.46 5.822-.345.294-.66.81-.765 1.577-.69.31-2.415.81-3.495-.973-.225-.354-.9-1.223-1.845-1.209-1.005.015-.405.56.015.781.51.28 1.095 1.327 1.23 1.666.24.663 1.02 1.93 4.035 1.385 0 .988.015 1.916.015 2.196 0 .31-.225.664-.825.56C3.303 21.374-.003 16.867 0 11.791 0 5.276 5.37 0 12 0z"/></svg>
              <span>${escapeHtml(label).replace('GitHub', '<svg class="github-text" viewBox="0 0 78 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false" style="display:inline-block;width:42.25px;height:13px;flex:none;vertical-align:middle"><path d="M16.598 10.836v9.48c0 .066-.017.181-.1.214 0 0-2.07 1.47-5.484 1.47C6.888 22 2 20.712 2 12.223 2 3.734 6.275 1.983 10.45 2c3.613 0 5.07.81 5.303.958.066.083.1.149.1.231l-.697 2.94c0 .149-.149.33-.331.28-.597-.18-1.491-.544-3.596-.544-2.435 0-5.053.693-5.053 6.16 0 5.466 2.485 6.11 4.275 6.11 1.524 0 2.07-.181 2.07-.181v-3.799h-2.435c-.182 0-.315-.132-.315-.28v-3.04c0-.148.133-.28.315-.28h6.197c.182 0 .315.132.315.28zM76 14.684c0 5.664-1.84 7.283-5.054 7.283-2.717 0-4.175-1.37-4.175-1.37s-.067.759-.15.858c-.05.1-.132.132-.231.132h-2.453c-.165 0-.315-.132-.315-.28l.034-18.349a.29.29 0 01.281-.28h3.53a.29.29 0 01.281.28v6.226s1.359-.875 3.347-.875l-.016-.033c1.988 0 4.921.743 4.921 6.408zM47.865 2.71a.29.29 0 01.281.281V21.34a.29.29 0 01-.281.281h-3.53a.29.29 0 01-.281-.28l.033-7.845h-5.485v7.844a.29.29 0 01-.281.281h-3.53c-.132 0-.281-.132-.281-.28V2.99a.29.29 0 01.281-.28h3.53a.29.29 0 01.281.28v6.755h5.485V2.99a.29.29 0 01.282-.28h3.496zM61.55 8.722c.183 0 .315.132.315.28l-.033 12.337c0 .149-.1.281-.282.281h-2.22c-.116 0-.232-.066-.265-.148-.05-.1-.133-.744-.133-.744S57.061 22 54.758 22c-2.8 0-4.839-.908-4.839-4.542V9.02a.29.29 0 01.282-.28h3.546a.29.29 0 01.282.28v7.845c0 1.238.364 1.8 1.607 1.8 1.243 0 2.154-.644 2.154-.644V9.036c0-.182.1-.314.282-.314h3.48zm-28.84 9.861h.007c.14.029.239.154.234.296v2.477c0 .116-.05.231-.149.264-.166.083-1.226.363-2.104.363-1.922 0-4.74-.412-4.74-4.442v-5.417H24.12c-.149 0-.281-.132-.281-.314V9.564c0-.132.083-.248.215-.28.116-.017 1.922-.463 1.922-.463V5.237c0-.132.083-.215.232-.215h3.58c.148 0 .231.083.231.215v3.485h2.635c.132 0 .265.132.265.28v2.808c0 .182-.116.314-.265.314h-2.635v5.17c0 .777.448 1.372 1.74 1.372.41 0 .797-.081.951-.083zM22.28 8.705a.29.29 0 01.282.281v12.172c0 .297-.083.446-.414.446h-3.182c-.281 0-.497-.116-.497-.446V9.036c0-.182.133-.33.282-.33h3.53zm49.693 6.243c0-2.99-1.21-3.386-2.486-3.253-.994.066-1.79.561-1.79.561v5.813s.813.562 2.022.595c1.707.05 2.254-.562 2.254-3.716zM20.54 3.123a2.26 2.26 0 012.254 2.28A2.26 2.26 0 0120.54 7.68a2.266 2.266 0 01-2.286-2.279c0-1.271 1.01-2.279 2.286-2.279z"/></svg>')}</span>
            </a>`;
}

function renderLanguagePane(lang, rendered, config) {
  return `
          <article class="guide-article lang-pane" data-lang-pane="${lang}"${lang === 'en' ? ' hidden' : ''}>
${rendered.html}
${sourceLinkTemplate(config, lang)}
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
      <a href="../gallery/index.html" data-guide-text data-zh="图册" data-en="Gallery">图册</a>
      <a href="../models/index.html" data-guide-text data-zh="模型" data-en="Models">模型</a>
      <a href="../index.html#engine" data-guide-text data-zh="产品" data-en="Product">产品</a>
      <a href="../index.html#teardown" data-guide-text data-zh="架构" data-en="Architecture">架构</a>
      <a class="active" href="index.html" aria-current="page" data-guide-text data-zh="指南" data-en="Guides">指南</a>
      <a href="../downloads/index.html" data-guide-text data-zh="下载" data-en="Downloads">下载</a>
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
        <img class="mobile-menu-logo" src="../assets/images/logo-white.svg" alt="RMinte">
        <button class="ghost-button" type="button" data-menu-close data-guide-text data-zh="关闭" data-en="Close">关闭</button>
      </div>
      <nav class="mobile-links" aria-label="移动导航">
        <a href="../gallery/index.html" data-guide-text data-zh="图册" data-en="Gallery">图册</a>
        <a href="../models/index.html" data-guide-text data-zh="模型" data-en="Models">模型</a>
        <a href="../index.html#engine" data-guide-text data-zh="产品" data-en="Product">产品</a>
        <a href="../index.html#teardown" data-guide-text data-zh="架构" data-en="Architecture">架构</a>
        <a class="active" href="index.html" aria-current="page" data-guide-text data-zh="指南" data-en="Guides">指南</a>
        <a href="../downloads/index.html" data-guide-text data-zh="下载" data-en="Downloads">下载</a>
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="description" content="${escapeHtml(config.description.zh)}">
  <meta property="og:title" content="${escapeHtml(config.title.zh)}">
  <meta property="og:description" content="${escapeHtml(config.description.zh)}">
  <meta property="og:image" content="../assets/images/img4.png">
  <meta name="theme-color" content="#050606">
  <title>RMinte - RM-01 - Portable AI Supercomputer - 泛灵人工智能</title>
  <link rel="icon" type="image/png" sizes="512x512" href="../assets/images/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&amp;family=Noto+Sans+SC:wght@300;400;500;600;700;800;900&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/styles.css?v=solid-header-1">
  <link rel="stylesheet" href="../assets/guides.css?v=clean-cards-1">
  <script id="guidePageData" type="application/json">${pageData}</script>
  <script src="../visitor-language.js" defer></script>
  <script src="../assets/guides.js?v=language-label-1" defer></script>
  <script src="../assets/site-data.js?v=models-launch-1" defer></script>
  <script src="../assets/footer.js?v=models-launch-1" defer></script>
</head>
<body class="guide-body guide-doc-body guide-accent-${config.accent}">
  <a class="skip-link" href="#guideContent" data-guide-text data-zh="跳至指南正文" data-en="Skip to guide content">跳至指南正文</a>
  <div class="ambient-field" aria-hidden="true"></div>
${siteNavigationTemplate()}

  <main id="guideContent" class="guide-doc-main">
    <section class="guide-doc-hero">
      <a class="guide-breadcrumb" href="index.html"><span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;pointer-events:none" aria-hidden="true" focusable="false"><path d="M19 12H5m5-5-5 5 5 5"/></svg></span><span data-guide-text data-zh="全部指南" data-en="All guides">全部指南</span></a>
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
${renderLanguagePane('zh', rendered.zh, config)}
${renderLanguagePane('en', rendered.en, config)}
        <a class="guide-next" href="${config.next.href}">
          <span data-guide-text data-zh="下一步" data-en="Next">下一步</span>
          <strong data-guide-text data-zh="${escapeHtml(config.next.zh)}" data-en="${escapeHtml(config.next.en)}">${escapeHtml(config.next.zh)}</strong>
          <span aria-hidden="true" style="display:inline-flex;align-items:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;pointer-events:none" aria-hidden="true" focusable="false"><path d="M7 17 17 7M7 7h10v10"/></svg></span>
        </a>
      </div>

      <aside class="guide-rail">
        <p data-guide-text data-zh="阅读提示" data-en="Reading note">阅读提示</p>
        <span data-guide-text data-zh="设备型号、硬件配置和当前状态会影响页面显示。以设备实际界面为准。" data-en="Device model, hardware configuration, and current state affect what the interface displays.">设备型号、硬件配置和当前状态会影响页面显示。以设备实际界面为准。</span>
      </aside>
    </div>
  </main>

  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="../assets/images/logo-white.svg" alt="RMinte">
        <div>
        <p data-footer-text="footer">泛灵（成都）人工智能科技有限公司</p>
        <span data-footer-text="copyright">© 2026 <span class="rm-mark">RMinte</span> ( Chengdu ) Artificial Intelligence Technology Co., Ltd. · RM-01 Protable AI Supercomputer</span>
        </div>
      </div>
      <div class="footer-actions">
        <button class="footer-contact" type="button" aria-expanded="false" aria-controls="contactPopover" data-contact-toggle>
          <span data-footer-text="contactButton">联系我们</span>
        </button>
        <a class="footer-github" href="https://github.com/RMinte-AI" target="_blank" rel="noreferrer" aria-label="GitHub">
          <svg class="github" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false" style="display:inline-block;width:18px;height:18px;flex:none;vertical-align:middle"><path d="M12 0c6.63 0 12 5.276 12 11.79-.001 5.067-3.29 9.567-8.175 11.187-.6.118-.825-.25-.825-.56 0-.398.015-1.665.015-3.242 0-1.105-.375-1.813-.81-2.181 2.67-.295 5.475-1.297 5.475-5.822 0-1.297-.465-2.344-1.23-3.169.12-.295.54-1.503-.12-3.125 0 0-1.005-.324-3.3 1.209a11.32 11.32 0 00-3-.398c-1.02 0-2.04.133-3 .398-2.295-1.518-3.3-1.209-3.3-1.209-.66 1.622-.24 2.83-.12 3.125-.765.825-1.23 1.887-1.23 3.169 0 4.51 2.79 5.527 5.46 5.822-.345.294-.66.81-.765 1.577-.69.31-2.415.81-3.495-.973-.225-.354-.9-1.223-1.845-1.209-1.005.015-.405.56.015.781.51.28 1.095 1.327 1.23 1.666.24.663 1.02 1.93 4.035 1.385 0 .988.015 1.916.015 2.196 0 .31-.225.664-.825.56C3.303 21.374-.003 16.867 0 11.791 0 5.276 5.37 0 12 0z"/></svg>
          <span><svg class="github-text" viewBox="0 0 78 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true" focusable="false" style="display:inline-block;width:42.25px;height:13px;flex:none;vertical-align:middle"><path d="M16.598 10.836v9.48c0 .066-.017.181-.1.214 0 0-2.07 1.47-5.484 1.47C6.888 22 2 20.712 2 12.223 2 3.734 6.275 1.983 10.45 2c3.613 0 5.07.81 5.303.958.066.083.1.149.1.231l-.697 2.94c0 .149-.149.33-.331.28-.597-.18-1.491-.544-3.596-.544-2.435 0-5.053.693-5.053 6.16 0 5.466 2.485 6.11 4.275 6.11 1.524 0 2.07-.181 2.07-.181v-3.799h-2.435c-.182 0-.315-.132-.315-.28v-3.04c0-.148.133-.28.315-.28h6.197c.182 0 .315.132.315.28zM76 14.684c0 5.664-1.84 7.283-5.054 7.283-2.717 0-4.175-1.37-4.175-1.37s-.067.759-.15.858c-.05.1-.132.132-.231.132h-2.453c-.165 0-.315-.132-.315-.28l.034-18.349a.29.29 0 01.281-.28h3.53a.29.29 0 01.281.28v6.226s1.359-.875 3.347-.875l-.016-.033c1.988 0 4.921.743 4.921 6.408zM47.865 2.71a.29.29 0 01.281.281V21.34a.29.29 0 01-.281.281h-3.53a.29.29 0 01-.281-.28l.033-7.845h-5.485v7.844a.29.29 0 01-.281.281h-3.53c-.132 0-.281-.132-.281-.28V2.99a.29.29 0 01.281-.28h3.53a.29.29 0 01.281.28v6.755h5.485V2.99a.29.29 0 01.282-.28h3.496zM61.55 8.722c.183 0 .315.132.315.28l-.033 12.337c0 .149-.1.281-.282.281h-2.22c-.116 0-.232-.066-.265-.148-.05-.1-.133-.744-.133-.744S57.061 22 54.758 22c-2.8 0-4.839-.908-4.839-4.542V9.02a.29.29 0 01.282-.28h3.546a.29.29 0 01.282.28v7.845c0 1.238.364 1.8 1.607 1.8 1.243 0 2.154-.644 2.154-.644V9.036c0-.182.1-.314.282-.314h3.48zm-28.84 9.861h.007c.14.029.239.154.234.296v2.477c0 .116-.05.231-.149.264-.166.083-1.226.363-2.104.363-1.922 0-4.74-.412-4.74-4.442v-5.417H24.12c-.149 0-.281-.132-.281-.314V9.564c0-.132.083-.248.215-.28.116-.017 1.922-.463 1.922-.463V5.237c0-.132.083-.215.232-.215h3.58c.148 0 .231.083.231.215v3.485h2.635c.132 0 .265.132.265.28v2.808c0 .182-.116.314-.265.314h-2.635v5.17c0 .777.448 1.372 1.74 1.372.41 0 .797-.081.951-.083zM22.28 8.705a.29.29 0 01.282.281v12.172c0 .297-.083.446-.414.446h-3.182c-.281 0-.497-.116-.497-.446V9.036c0-.182.133-.33.282-.33h3.53zm49.693 6.243c0-2.99-1.21-3.386-2.486-3.253-.994.066-1.79.561-1.79.561v5.813s.813.562 2.022.595c1.707.05 2.254-.562 2.254-3.716zM20.54 3.123a2.26 2.26 0 012.254 2.28A2.26 2.26 0 0120.54 7.68a2.266 2.266 0 01-2.286-2.279c0-1.271 1.01-2.279 2.286-2.279z"/></svg></span>
        </a>
      </div>
    </div>
  </footer>

  <aside class="contact-popover" id="contactPopover" role="dialog" aria-labelledby="contactTitle" aria-hidden="true" data-contact-popover>
    <div class="contact-card">
      <div class="contact-card-core">
        <div class="contact-top">
          <div>

            <h2 id="contactTitle" data-footer-text="contactTitle">联系我们</h2>
          </div>
          <button class="contact-close" type="button" aria-label="关闭" data-contact-close><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;flex-shrink:0;pointer-events:none" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
        </div>
        <div class="contact-links">
          <a href="mailto:jiezhu@rminte.com">
            <span data-footer-text="salesContact">销售与渠道合作</span>
            <strong>jiezhu@rminte.com</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </a>
          <a href="mailto:yishi@rminte.com">
            <span data-footer-text="manufacturingContact">制造与供应链合作</span>
            <strong>yishi@rminte.com</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </a>
          <a href="mailto:support@rminte.com">
            <span data-footer-text="supportContact">售前与售后服务</span>
            <strong>support@rminte.com</strong><svg class="contact-link-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>
          </a>
        </div>
      </div>
    </div>
  </aside>
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
