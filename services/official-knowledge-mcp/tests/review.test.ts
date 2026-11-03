import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseHeadings, splitBlocks, hash } from '../scripts/build.ts';
import { terms } from '../src/text.ts';
import { createKnowledge } from '../src/knowledge.ts';
import type { Corpus } from '../src/types.ts';
const corpus=JSON.parse(await readFile(new URL('../.generated/corpus.json',import.meta.url),'utf8')) as Corpus;

test('Protocol names are not treated as plural nouns; English aliases require complete words',()=>{
 assert.deepEqual(terms('HTTPS'),['https']);assert.deepEqual(terms('HTTP'),['http']);
 assert.deepEqual(terms('contraction'),['contraction']);assert.deepEqual(terms('contractor'),['contractor']);
 assert(terms('contract').includes('loan'));assert(terms('modules').includes('module'));
});
test('Chinese function-word removal does not destroy ownership or wired-network terms',()=>{
 assert(terms('所有权').includes('所有权'));
 assert(terms('有线网络').includes('有线'));
 const result=createKnowledge(corpus).search({query:'所有权',language:'zh'});
 assert(result.results.some(s=>s.doc_id==='sample-loan-agreement'));
});
test('Unknown terms matching Object.prototype do not crash or enter the index',()=>{
 const kb=createKnowledge(corpus);assert.equal(kb.search({query:'constructor'}).results.length,0);
 assert.equal(Object.hasOwn(corpus.postings,'constructor'),false);
});
test('Parent scope follows heading nesting, including skipped levels and repeated sibling titles',()=>{
 const lines=['# A','A condition','### Shared','first condition','#### Step','first step','# B','B condition','### Shared','second condition','#### Step','second step'];
 const headings=parseHeadings(lines,0,'example','en','Example');const step=headings.at(-1)!;
 assert.deepEqual(step.parents.map(h=>h.title),['B','Shared']);
 assert.deepEqual(step.parents.map(h=>h.body),['B condition','second condition']);
 const long=parseHeadings(['## Parent','x'.repeat(3200),'#### Child','child'],0,'long','en','Long');
 assert.equal(long.at(-1)!.parents[0].body.length,3200);
});
test('Tilde and longer backtick fences keep embedded headings/code blocks intact',()=>{
 for(const fence of ['~~~','````']){
  const text=`# Topic\n${fence}\n# not a heading\n\n\x60\x60\x60\n# still code\n${fence}\n## Real\ntext`;
  assert.deepEqual(parseHeadings(text.split('\n'),0,'code','en','Code').map(h=>h.title),['Topic','Real']);
  const code=text.slice(text.indexOf(fence),text.lastIndexOf(fence)+fence.length);
  const blocks=splitBlocks('prefix\n\n'+code+'\n\nsuffix',200);assert(blocks.some(s=>s.includes(code)));
 }
});
test('Identical body with different prerequisite context is not deduplicated away',()=>{
 const base=corpus.sections.find(s=>!s.navigation_only)!;
 const sections=['First prerequisite','Other prerequisite'].map((context,i)=>({...base,section_id:`en/source-${i}/step`,doc_id:`source-${i}`,language:'en',body:'proof',context,content_hash:hash('proof'),context_hash:hash(context),length:1,version:null}));
 const kb=createKnowledge({...corpus,sections,postings:{proof:[[0,1],[1,1]]},average_length:1});
 assert.equal(kb.search({query:'proof'}).results.length,2);
});
test('Width normalization precedes vocabulary matching',()=>{
 for(const [plain,wide] of [['wattage','ＷＡＴＴＡＧＥ'],['memory','ｍｅｍｏｒｙ'],['power supply','ＰＯＷＥＲ ＳＵＰＰＬＹ']]){
  assert.deepEqual(terms(wide),terms(plain));
 }
});
test('A document with no headings has one overview and valid source bounds',()=>{
 const headings=parseHeadings(['Intro','no headings'],0,'example','en','Example');
 assert.equal(headings.length,1);assert.equal(headings[0].body,'Intro\nno headings');
 assert.equal(headings[0].start+1,0);assert.equal(headings[0].end,2);assert.deepEqual(headings[0].parents,[]);
});
test('Non-searchable preambles remain readable context for the real source sections',()=>{
 const kb=createKnowledge(corpus);
 for(const language of ['zh','en']){
  const preamble=corpus.sections.find(s=>s.doc_id==='company-brochure'&&s.language===language&&s.section_id.endsWith('/preamble'));assert(preamble?.navigation_only);
  const page=corpus.sections.find(s=>s.doc_id==='company-brochure'&&s.language===language&&s.pdf_page===14);assert(page);
  const read=kb.read(page.section_id,corpus.revision);assert(read.context.includes(preamble.body));
  assert(new RegExp(language==='zh'?'历史性能表不提供完整测试条件':'Historical performance tables lack full test conditions').test(read.context));
  const contact=corpus.sections.find(s=>s.doc_id==='company-contact'&&s.language===language&&!s.navigation_only);assert(contact);
  assert(kb.read(contact.section_id,corpus.revision).context.includes('Artificial Intelligence Technology Co., Ltd.'));
 }
 for(const postings of Object.values(corpus.postings))assert(!postings.some(([i])=>corpus.sections[i].section_id.endsWith('/preamble')));
});

test('Wattage queries match numeric watt specifications without treating supply alone as wattage',()=>{
 for(const query of ['wattage','功耗','功率'])assert(terms(query).includes('w'));
 assert(terms('140W').includes('w'));assert(!terms('power supply').includes('w'));
 const kb=createKnowledge(corpus);
 for(const [language,query]of [['zh','RM-01 的供电标准和功耗是什么？'],['en','What power supply standard and wattage does RM-01 use?']]as const){
  const r=kb.search({language,query});assert(r.results.some(s=>s.doc_id==='hardware-modules'&&/140W/.test(kb.read(s.section_id,r.corpus_revision).body)));
 }
});
test('Conversational HTTPS queries retain the original HTTP limitation; unknown queries stay empty',()=>{
 const kb=createKnowledge(corpus);
 for(const [language,query]of [['zh','装 HTTPS 证书会让完整管理页面自动变成 HTTPS 吗？'],['en','Does installing an HTTPS certificate automatically switch the entire interface to HTTPS?']]as const){
  const r=kb.search({language,query});const hit=r.results.find(s=>s.doc_id==='guide-security');assert(hit);
  const s=kb.read(hit.section_id,r.corpus_revision);assert(/HTTP/.test(s.body+'\n'+s.context));
  assert(/安装证书不会把它切换到 HTTPS|installing a certificate does not switch it to HTTPS/.test(s.body+'\n'+s.context));
 }
 for(const query of ['unfindableXYZ314159 unknownXYZ271828','certificate unfindableXYZ'])assert.equal(kb.search({query}).results.length,0);
});
