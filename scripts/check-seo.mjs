// Run against Wrangler Pages dev or an authorized preview, not the ordinary static preview.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pages, origin } from '../website/scripts/seo.mjs';

const base = process.argv[2] || 'http://127.0.0.1:4189';
const results = [];
async function get(path, options) {
  const response = await fetch(base + path, options);
  const body = await response.text();
  results.push({ path, status: response.status, finalUrl: response.url, mime: response.headers.get('content-type') });
  return { response, body };
}
for (const page of Object.values(pages)) {
  for (const suffix of ['', '?lang=en', '?lang=zh&utm_source=seo-check']) {
    const { response, body } = await get(page.path + suffix);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /^text\/html/);
    assert.equal((body.match(/<title\b/g) || []).length, 1);
    assert.equal((body.match(/<meta name="description"/g) || []).length, 1);
    assert.equal((body.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(body.includes(`rel="canonical" href="${origin}${page.path}"`));
    assert.ok(!body.includes('hreflang='));
    const schema = JSON.parse(body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(schema['@context'], 'https://schema.org');
    assert.equal(schema['@graph'][0].url, origin + page.path);
    assert.ok(!/"(?:offers|aggregateRating|review)"/.test(JSON.stringify(schema)));
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
assert.ok(robots.body.includes(`Sitemap: ${origin}/sitemap.xml`));
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.response.status, 200);
assert.match(sitemap.response.headers.get('content-type'), /xml/);
assert.equal((sitemap.body.match(/<url>/g) || []).length, Object.keys(pages).length);
assert.ok(!sitemap.body.includes('lastmod'));
const images = [...sitemap.body.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map(match => match[1]);
assert.equal(images.length, 11);
for (const image of images) {
  const path = new URL(image).pathname;
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^image\/jpeg/);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(new URL('../website' + path, import.meta.url)));
}
for (const [path, mime] of [
  ['/assets/images/favicon.svg', 'image/svg+xml'], ['/assets/styles.css', 'text/css'],
  ['/assets/i18n.js', 'javascript'], ['/assets/fonts/Geist-latin-v1800.woff2', 'font/woff2'],
  ['/assets/downloads/tianshanos-admin-user-guide-bilingual.pdf', 'application/pdf']
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.ok(response.headers.get('content-type').includes(mime));
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), readFileSync(new URL('../website' + path, import.meta.url)));
}
console.log(JSON.stringify({ passed: true, requests: results.length, imageAndAssetByteChecks: 16, results }, null, 2));
