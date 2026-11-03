import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCorpus, corpusRoot, hash, splitBlocks } from '../scripts/build.ts';
import { createKnowledge } from '../src/knowledge.ts';
import { bytes, terms } from '../src/text.ts';
const c=await buildCorpus();const kb=createKnowledge(c);
test('All 90 reviewed entries accounted for; unverified OCR absent from runtime, history separate',()=>{
 assert.equal(c.documents.length,90);assert.equal(c.documents.filter(d=>d.status==='excluded').length,2);assert(c.documents.filter(d=>d.status==='excluded').every(d=>d.id==='company-brochure-ocr'));assert.equal(c.documents.filter(d=>d.status==='history-only').length,2);assert(!c.sections.some(s=>s.doc_id==='company-brochure-ocr'));
});
test('Deterministic build, IDs unique, content/context hashes accurate, bounded replies',async()=>{
 assert.deepEqual(await buildCorpus(),c);assert.equal(new Set(c.sections.map(s=>s.section_id)).size,c.sections.length);
 for(const s of c.sections){assert.equal(hash(s.body),s.content_hash);assert.equal(hash(s.context),s.context_hash);assert(bytes(s.body)<=7000);assert(bytes(JSON.stringify(kb.read(s.section_id,c.revision)))<=29000);assert(s.source_urls.length);for(const id of s.related_sections)assert(c.sections.some(t=>t.section_id===id));}
});
test('Every nonblank original source line is preserved in body or original heading path',async()=>{
 const m=JSON.parse(await readFile(resolve(corpusRoot,'source-manifest.json'),'utf8'));
 for(const d of m.documents){if(!d.default_retrieval)continue;const text=await readFile(resolve(corpusRoot,d.path),'utf8');const body=text.split('---\n\n',2)[1];assert(body,d.path);const built=c.sections.filter(s=>s.doc_id===d.id&&s.language===d.language);const original=built.map(s=>s.body+'\n'+s.heading_path.join('\n')).join('\n');for(const line of body.split('\n')){const normalized=line.replace(/^#{1,6}\s+/, '').trim();if(normalized)assert(original.includes(normalized),`${d.path}: ${normalized}`);}}
});
test('Security-page inherited HTTP limitation follows certificate operation',()=>{
 for(const lang of ['zh','en']){const s=c.sections.find(s=>s.doc_id==='guide-security'&&s.language===lang&&/5\.3/.test(s.heading_path.join(' ')));assert(s);const r=kb.read(s.section_id,c.revision);assert.equal(r.version,'0.6.4');assert(/HTTP/.test(r.context));assert(/部分证书操作|Some certificate operations/i.test(r.context));}
});
test('Source versions and history policy are enforced at search and read',()=>{
 for(const id of ['guide-admin','guide-root','guide-security'])for(const language of ['zh','en']){
  const sections=c.sections.filter(s=>s.doc_id===id&&s.language===language);assert(sections.length);
  for(const s of sections){const r=kb.read(s.section_id,c.revision);assert.equal(r.version,'0.6.4');assert.equal(r.source_date,'2026-11-03');}
 }
 const current=kb.search({query:'security HTTPS certificate',version:'0.6.4',limit:8});assert(current.results.some(s=>s.doc_id==='guide-security'&&s.version==='0.6.4'));
 assert(!kb.search({query:'security HTTPS certificate',version:'0.6.3',limit:8}).results.some(s=>s.version==='0.6.4'));
 assert(!kb.search({query:'Lite Pro Ultra 256GB',limit:8}).results.some(s=>s.historical));assert(kb.search({query:'Lite Pro Ultra 256GB',include_history:true,limit:8}).results.some(s=>s.historical));
 assert.throws(()=>kb.read('zh/company-brochure-ocr/page-1',c.revision),/not available/);assert.throws(()=>kb.read('../../secret',c.revision),/not available/);assert.throws(()=>kb.read(c.sections[0].section_id,'0'.repeat(64)),/Corpus changed/);
});
test('No arbitrary URL/path input and no silently truncated queries/results',()=>{
 assert.throws(()=>kb.search({query:' '}));assert.throws(()=>kb.search({query:'字'.repeat(301)}));assert.throws(()=>kb.search({query:'fan',limit:9}));
 assert.equal(kb.search({query:'unfindableXYZ314159'}).results.length,0);assert.equal(kb.search({query:'公司注册资本是多少？'}).results.length,0);
 assert.throws(()=>splitBlocks('```\n'+'x'.repeat(7100)+'\n```'),/Indivisible/);
});
test('Chinese and English source coverage; authoritative Chinese agreement reachable from English note',()=>{
 const note=c.sections.find(s=>s.doc_id==='sample-loan-agreement'&&s.language==='en');assert(note);const r=kb.read(note.section_id,c.revision);assert(r.related_sections.some(id=>id.startsWith('zh/sample-loan-agreement/')));assert(/Chinese/.test(r.body));
 assert(terms('供电功耗 256GB').includes('power'));assert(terms('256GB').includes('gb'));assert.deepEqual(terms('power supply'),terms('供电'));
});
test('All nine specialist workflow stages retain their corresponding scenario identity',()=>{
 for(const language of ['zh','en']){
  const stages=c.sections.filter(s=>s.doc_id==='models'&&s.language===language&&s.heading_path.at(-1)==='stages');assert.equal(stages.length,9);
  for(const stage of stages){const name=c.sections.filter(s=>s.doc_id==='models'&&s.language===language&&s.heading_path.at(-1)==='name'&&s.source_lines[0]<stage.source_lines[0]).at(-1);assert(name);assert(stage.context.includes(name.body));}
 }
});
