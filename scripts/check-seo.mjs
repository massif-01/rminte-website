// Run against Wrangler Pages dev or an authorized preview, not the ordinary static preview.
// Python 3 is already used by the site's font builder and SEO probe; no parser dependency is installed.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { englishPages, pages, origin } from '../website/scripts/seo.mjs';

const searchPages = [...Object.values(pages), ...Object.values(englishPages)];

function parseMarkup(kind, body) {
  return JSON.parse(execFileSync('python3', [fileURLToPath(new URL('./parse-seo-markup.py', import.meta.url)), kind], {
    input: body, encoding: 'utf8', maxBuffer: 5_000_000
  }));
}
export function environmentFor(base) {
  return new URL(base).hostname.endsWith('.pages.dev') ? 'preview' : 'production';
}
const blocksIndex = value => /(?:^|[\s,])(?:noindex|none)(?=$|[\s,])/i.test(value);
function headerBlocksIndex(value) {
  let relevant = true;
  return value.split(',').some(part => {
    const prefix = part.trim().match(/^([\w-]+)\s*:\s*(.*)$/);
    if (prefix && !['max-snippet', 'max-image-preview', 'max-video-preview', 'unavailable_after'].includes(prefix[1].toLowerCase())) {
      relevant = ['googlebot', 'bingbot'].includes(prefix[1].toLowerCase());
      part = prefix[2];
    }
    return relevant && blocksIndex(part);
  });
}
export function checkPage(page, body, response, environment) {
  assert.ok(['production', 'preview'].includes(environment), 'Choose production or preview indexing policy');
  for (const pair of [page.title, page.description]) for (const lang of ['zh', 'en']) {
    assert.ok(pair[lang].trim(), `${page.path}: metadata configuration must not be empty`);
  }
  const head = parseMarkup('html', body);
  const language = page.language || 'zh';
  assert.equal(head.lang, language === 'en' ? 'en' : 'zh-CN', `${page.path}: HTML language`);
  if (language === 'en') {
    assert.ok(/[A-Za-z]/.test(head.h1) && !/\p{Script=Han}/u.test(head.h1), `${page.path}: English H1 in the initial HTML`);
  }
  const one = (items, label) => { assert.equal(items.length, 1, `${page.path}: one ${label} required`); return items[0]; };
  const title = one(head.titles, 'Title');
  assert.equal(title.text, page.title[language], `${page.path}: Title value`);
  assert.equal(title.attrs['data-zh'], page.title.zh, `${page.path}: Chinese Title value`);
  assert.equal(title.attrs['data-en'], page.title.en, `${page.path}: English Title value`);
  const meta = (name, key = 'name') => one(head.metas.filter(tag => tag[key]?.toLowerCase() === name), name);
  const description = meta('description');
  assert.equal(description.content, page.description[language], `${page.path}: Description value`);
  for (const lang of ['zh', 'en']) assert.equal(description[`data-${lang}`], page.description[lang], `${page.path}: ${lang} Description value`);
  const canonical = one(head.links.filter(tag => tag.rel?.toLowerCase().split(/\s+/).includes('canonical')), 'Canonical');
  assert.equal(canonical.href, origin + page.path, `${page.path}: Canonical value`);
  assert.ok(!head.links.some(tag => tag.hreflang), `${page.path}: no invented hreflang`);
  for (const [field, pair] of [['og:title', page.title], ['og:description', page.description]]) {
    const tag = meta(field, 'property');
    assert.equal(tag.content, pair[language], `${page.path}: ${field} value`);
    for (const lang of ['zh', 'en']) assert.equal(tag[`data-${lang}`], pair[lang], `${page.path}: ${lang} ${field} value`);
  }
  const image = origin + (page.path === '/gallery/' ? '/assets/gallery/DSC00043.jpg' : '/assets/images/img4.png');
  for (const [field, expected] of [['og:type', 'website'], ['og:url', origin + page.path], ['og:image', image]]) {
    assert.equal(meta(field, 'property').content, expected, `${page.path}: ${field} value`);
  }
  const indexBlocked = head.metas.some(tag => ['robots', 'googlebot', 'bingbot'].includes(tag.name?.toLowerCase()) && blocksIndex(tag.content || ''))
    || headerBlocksIndex(response.headers.get('x-robots-tag') || '');
  if (environment === 'production') assert.ok(!indexBlocked, `${page.path}: production noindex/none`);
  const schema = JSON.parse(one(head.schemas, 'JSON-LD'));
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@graph'][0].url, origin + page.path);
  assert.ok(!/"(?:offers|aggregateRating|review)"/.test(JSON.stringify(schema)));
  if (page.path === '/' || page.path === englishPages.home.path) {
    const organization = one(schema['@graph'].filter(node => node['@type'] === 'Organization'), 'Organization');
    assert.equal(organization.logo, `${origin}/assets/images/favicon.png`, 'Organization visible-on-white logo');
  }
  return { indexBlocked, indexingPolicy: environment };
}
export function checkSitemap(body) {
  const sitemap = parseMarkup('xml', body);
  const expected = searchPages.map(page => origin + page.path).sort();
  assert.equal(new Set(sitemap.urls).size, sitemap.urls.length, 'Sitemap duplicate page URLs');
  assert.deepEqual(sitemap.urls.sort(), expected, 'Sitemap canonical page URL set');
  assert.ok(!sitemap.hasLastmod, 'No invented lastmod');
  assert.equal(sitemap.images.length, 11);
  for (const page of Object.values(pages)) {
    const chinese = origin + page.path;
    const english = page.englishPath && origin + page.englishPath;
    const alternates = english ? [
      { rel: 'alternate', hreflang: 'zh-CN', href: chinese },
      { rel: 'alternate', hreflang: 'en', href: english }
    ] : [];
    assert.deepEqual(sitemap.alternates[chinese], alternates, `${page.path}: correct language alternates`);
    if (english) assert.deepEqual(sitemap.alternates[english], alternates, `${page.englishPath}: reciprocal language alternates`);
  }
  return sitemap.images;
}
function crawlAllowed(groups, path, crawler) {
  const matching = groups.map(group => ({ ...group, specificity: Math.max(-1, ...group.agents.map(agent => agent === '*' ? 0 : crawler.includes(agent) ? agent.length : -1)) }));
  const specificity = Math.max(-1, ...matching.map(group => group.specificity));
  const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rules = matching.filter(group => group.specificity === specificity && specificity >= 0).flatMap(group => group.rules)
    .filter(rule => new RegExp('^' + rule.path.replace(/\$$/, '').split('*').map(escape).join('.*') + (rule.path.endsWith('$') ? '$' : '')).test(path))
    .sort((a, b) => Buffer.byteLength(b.path) - Buffer.byteLength(a.path) || Number(b.allow) - Number(a.allow));
  return rules[0]?.allow ?? true;
}
export function checkRobots(body) {
  const groups = []; const sitemaps = []; let group;
  for (const raw of body.replace(/^\uFEFF/, '').split(/\r?\n/)) {
    const line = raw.split('#')[0].trim(); const colon = line.indexOf(':');
    if (colon < 0) continue;
    const key = line.slice(0, colon).trim().toLowerCase(), value = line.slice(colon + 1).trim();
    if (key === 'sitemap') sitemaps.push(value);
    if (key === 'user-agent') {
      if (!group || group.startedRules) { group = { agents: [], rules: [], startedRules: false }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ['allow', 'disallow'].includes(key)) {
      group.startedRules = true;
      if (value.startsWith('/')) group.rules.push({ path: value, allow: key === 'allow' });
    }
  }
  assert.ok(sitemaps.includes(origin + '/sitemap.xml'), 'robots.txt canonical Sitemap directive');
  for (const page of searchPages) for (const crawler of ['*', 'googlebot', 'bingbot', 'kimibot', 'baiduspider']) {
    assert.ok(crawlAllowed(groups, page.path, crawler), `${page.path}: robots.txt blocks ${crawler}`);
  }
}

async function main() {
  const base = process.argv[2] || 'http://127.0.0.1:4189';
  const environment = process.argv.find(value => value.startsWith('--environment='))?.split('=')[1] || environmentFor(base);
  assert.ok(['production', 'preview'].includes(environment), 'Use --environment=production or --environment=preview');
  if ([new URL(origin).hostname, 'www.' + new URL(origin).hostname].includes(new URL(base).hostname)) {
    assert.equal(environment, 'production', 'The official host must use production indexing policy');
  }
  const results = [];
  async function get(path, options) {
    const response = await fetch(base + path, options);
    const body = await response.text();
    results.push({ path, status: response.status, finalUrl: response.url, mime: response.headers.get('content-type'), xRobotsTag: response.headers.get('x-robots-tag') });
    return { response, body };
  }
  for (const page of searchPages) {
    for (const suffix of ['', '?lang=en', '?lang=zh&utm_source=seo-check']) {
      const { response, body } = await get(page.path + suffix, { redirect: 'manual' });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type'), /^text\/html/);
      Object.assign(results.at(-1), checkPage(page, body, response, environment));
    }
    const alias = page.file === 'index.html' ? '/index.html' : '/' + page.file;
    const { response } = await get(alias + '?lang=en&utm_source=seo-check', { redirect: 'manual' });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), page.path + '?lang=en&utm_source=seo-check');
  }
  for (const path of ['/nonexistent-seo-check-one', '/a/nonexistent-seo-check-two', '/assets/missing-seo.svg', '/assets/missing-seo.css', '/assets/missing-seo.js', '/models/nonexistent-seo', '/guides/nonexistent-seo']) {
    const { response, body } = await get(path);
    assert.equal(response.status, 404);
    assert.equal(body, '');
  }
  const robots = await get('/robots.txt');
  assert.equal(robots.response.status, 200);
  assert.match(robots.response.headers.get('content-type'), /^text\/plain/);
  checkRobots(robots.body);
  const sitemap = await get('/sitemap.xml');
  assert.equal(sitemap.response.status, 200);
  assert.match(sitemap.response.headers.get('content-type'), /xml/);
  const images = checkSitemap(sitemap.body);
  for (const image of images) {
    const path = new URL(image).pathname;
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^image\/jpeg/);
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(new URL('../website' + path, import.meta.url)));
  }
  for (const [path, mime] of [
    ['/assets/images/favicon.svg', 'image/svg+xml'], ['/assets/styles.css', 'text/css'],
    ['/assets/images/favicon.png', 'image/png'],
    ['/assets/i18n.js', 'javascript'], ['/assets/fonts/Geist-latin-v1800.woff2', 'font/woff2'],
    ['/assets/downloads/tianshanos-admin-user-guide-bilingual.pdf', 'application/pdf']
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').includes(mime));
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(new URL('../website' + path, import.meta.url)));
  }
  console.log(JSON.stringify({ passed: true, environment, requests: results.length, imageAndAssetByteChecks: 17, results }, null, 2));
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
