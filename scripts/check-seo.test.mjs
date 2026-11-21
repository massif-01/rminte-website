import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { checkPage, checkRobots, checkSitemap, environmentFor } from './check-seo.mjs';
import { englishPages, pages } from '../website/scripts/seo.mjs';

// Fixtures come from the real generated artifacts. Mutations exist only in test memory.
const html = page => readFileSync(new URL('../website/' + page.file, import.meta.url), 'utf8');
const sitemap = readFileSync(new URL('../website/sitemap.xml', import.meta.url), 'utf8');
const robots = readFileSync(new URL('../website/robots.txt', import.meta.url), 'utf8');
const response = value => new Response('', { headers: value ? { 'X-Robots-Tag': value } : {} });

test('real generated pages, sitemap and robots satisfy the production contract', () => {
  for (const page of [...Object.values(pages), ...Object.values(englishPages)]) checkPage(page, html(page), response(), 'production');
  checkSitemap(sitemap);
  checkRobots(robots);
});

test('metadata compares decoded HTML entities, including numeric and named references', () => {
  const page = pages.models;
  for (const amp of ['&#38;', '&#x26;']) {
    const encoded = html(page).replaceAll('&amp;', amp).replace('href="https://rminte.com', 'href="https:&sol;&sol;rminte.com');
    checkPage(page, encoded, response(), 'production');
  }
});

test('empty and incorrect Title, Description and OG values are rejected', () => {
  const page = pages.models;
  const source = html(page);
  assert.throws(() => checkPage(page, source.replace(/(<title[^>]*>)[\s\S]*?(<\/title>)/, '$1$2'), response(), 'production'), /Title value/);
  assert.throws(() => checkPage(page, source.replace('data-en="' + page.title.en.replaceAll('&', '&amp;') + '"', 'data-en=""'), response(), 'production'), /English Title value/);
  assert.throws(() => checkPage({ ...page, title: { zh: '', en: '' } }, source, response(), 'production'), /configuration must not be empty/);
  for (const [field, label] of [['name="description"', 'Description'], ...['title', 'description', 'url', 'image', 'type'].map(key => [`property="og:${key}"`, `og:${key}`])]) {
    for (const value of ['', 'wrong metadata']) {
      const bad = source.replace(new RegExp(`(<meta ${field} content=")[^"]*(")`), `$1${value}$2`);
      assert.notEqual(bad, source);
      assert.throws(() => checkPage(page, bad, response(), 'production'), new RegExp(label));
    }
  }
});

test('sitemap rejects a wrong address even with the same URL count, and duplicate addresses', () => {
  assert.throws(() => checkSitemap(sitemap.replace('<loc>https://rminte.com/models/</loc>', '<loc>https://rminte.com/nonexistent/</loc>')), /canonical page URL set/);
  assert.throws(() => checkSitemap(sitemap.replace('<loc>https://rminte.com/models/</loc>', '<loc>https://rminte.com/</loc>')), /duplicate page URLs/);
  assert.throws(() => checkSitemap(sitemap.replace('</url>', '<lastmod>2026-10-11</lastmod></url>')), /No invented lastmod/);
  assert.throws(() => checkSitemap(sitemap.replace('hreflang="en" href="https://rminte.com/en"', 'hreflang="en" href="https://rminte.com/"')), /correct language alternates/);
});

test('robots rejects core-page crawl bans, including crawler-specific groups', () => {
  assert.throws(() => checkRobots(robots.replace('Allow: /', 'Disallow: /')), /robots.txt blocks/);
  assert.throws(() => checkRobots(robots + '\nUser-agent: Googlebot\nDisallow: /guides/\n'), /robots.txt blocks googlebot/);
  assert.throws(() => checkRobots(robots + '\nUser-agent: Bingbot\nDisallow: /models/\n'), /robots.txt blocks bingbot/);
  for (const agent of ['KimiBot', 'Baiduspider']) {
    const managed = `User-agent: ${agent}\nDisallow: /\n\n`;
    checkRobots(managed + robots);
    assert.throws(() => checkRobots(managed + robots.replace(`User-agent: ${agent}\n`, '')), new RegExp(`robots.txt blocks ${agent.toLowerCase()}`));
  }
  // Longest-path and Allow-on-tie precedence must not produce a false crawl-ban report.
  checkRobots(robots + '\nUser-agent: *\nDisallow: /guides\nAllow: /guides/\n');
  checkRobots(robots + '\nUser-agent: *\nDisallow: /guides/\nAllow: /guides/\n');
});

test('production rejects meta/header noindex or none; Pages preview noindex remains allowed', () => {
  const page = pages.home;
  for (const value of ['noindex', 'none', 'Googlebot: noindex', 'Bingbot: none']) {
    assert.throws(() => checkPage(page, html(page), response(value), 'production'), /production noindex/);
  }
  for (const name of ['robots', 'googlebot', 'bingbot']) {
    const bad = html(page).replace('</head>', `<meta name="${name}" content="noindex, follow"></head>`);
    assert.throws(() => checkPage(page, bad, response(), 'production'), /production noindex/);
  }
  assert.equal(checkPage(page, html(page), response('noindex'), 'preview').indexBlocked, true);
  checkPage(page, html(page), response('Otherbot: noindex'), 'production');
  assert.equal(environmentFor('https://rminte.com'), 'production');
  assert.equal(environmentFor('https://www.rminte.com'), 'production');
  assert.equal(environmentFor('https://preview.rminte-website.pages.dev'), 'preview');
  const wrongPolicy = spawnSync(process.execPath, [new URL('./check-seo.mjs', import.meta.url).pathname, 'https://rminte.com', '--environment=preview'], { encoding: 'utf8' });
  assert.notEqual(wrongPolicy.status, 0);
  assert.match(wrongPolicy.stderr, /official host must use production/);
});
