// Extract paired source copy for translation and coverage audits; no page execution.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const site = join(dirname(fileURLToPath(import.meta.url)), '..');
const entries = new Map();
function add(zh, en, source) {
  if (typeof zh !== 'string' || typeof en !== 'string' || !en) return;
  if (!entries.has(en)) entries.set(en, { zh, en, sources: [] });
  const item=entries.get(en);
  if (!item.sources.includes(source)) item.sources.push(source);
  if(item.zh!==zh) { item.zhVariants ||= []; if(!item.zhVariants.includes(zh)) item.zhVariants.push(zh); }
}
function pair(zh,en,source) {
  if(typeof en==='string') { if (!source.endsWith('.langToggle')) add(zh,en,source); return; }
  if(en && typeof en==='object') for(const key of Object.keys(en)) pair(zh?.[key],en[key],`${source}.${key}`);
}
function walk(value,source) {
  if(!value || typeof value!=='object')return;
  if('zh' in value && 'en' in value) pair(value.zh,value.en,source);
  for(const key of Object.keys(value)) {
    if(key.endsWith('Zh') && key.slice(0,-2)+'En' in value) pair(value[key],value[key.slice(0,-2)+'En'],`${source}.${key.slice(0,-2)}`);
    if(key!=='zh'&&key!=='en'&&key!=='source')walk(value[key],`${source}.${key}`);
  }
}
const context={window:{}}; vm.runInNewContext(readFileSync(join(site,'assets/site-data.js'),'utf8'),context); walk(context.window.RM_SOFT,'assets/site-data.js');
for(const [file,start,end,names] of [
 ['assets/gallery.js','  const galleryItems =','  const $ =',['galleryItems']],
 ['models/models.js','      const cases =','      function bilingual(',['cases','optimizationItems']],
 ['scripts/build-guides.mjs','const guideConfig =','extendPairs(guideConfig);',['guideConfig']]
]) {
 const code=readFileSync(join(site,file),'utf8');
 const block=code.slice(code.indexOf(start),code.indexOf(end));
 // Only constant declarations are evaluated; no document, IO, or browser globals.
 const data=vm.runInNewContext(`${block}\n;({${names.join(',')}})`,{join,guidesDir:join(site,'guides')});
 walk(data,file);
}
function decode(text){return text.replace(/&(?:amp|quot|lt|gt|apos|#39|#x27);/g,x=>({'&amp;':'&','&quot;':'"','&lt;':'<','&gt;':'>','&apos;':"'",'&#39;':"'",'&#x27;':"'"}[x]));}
const pages=['index.html','models/index.html','gallery/index.html','downloads/index.html','guides/index.html',...['admin','root','network','security'].map(x=>`guides/${x}.html`)];
for(const file of [...pages, 'scripts/build-guides.mjs']) {
 const html=readFileSync(join(site,file),'utf8');
 for(const tag of html.matchAll(/<[a-zA-Z][^>]*>/g)) {
  for(const match of tag[0].matchAll(/\b(data-(?:i18n-[a-z-]+-)?)zh="([^"]*)"/g)) {
   const en=tag[0].match(new RegExp('\\b'+match[1]+'en="([^"]*)"'));
   if(en && !en[1].includes('${')) add(decode(match[2]),decode(en[1]),`${file}:${html.slice(0,tag.index).split('\n').length}`);
  }
 }
}
const dynamic=join(site,'assets/i18n-ui.json');
if(existsSync(dynamic)) for(const item of JSON.parse(readFileSync(dynamic,'utf8')))add(item.zh,item.en,'assets/i18n-ui.json');
const out=join(site,'locales');mkdirSync(out,{recursive:true});
writeFileSync(join(out,'source.json'),JSON.stringify([...entries.values()],null,2)+'\n');
console.log(`Extracted ${entries.size} unique source pairs`);
