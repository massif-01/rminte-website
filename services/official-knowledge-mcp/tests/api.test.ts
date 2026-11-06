import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadApiSources, apiDirectory } from '../scripts/api-sources.ts';
import { repository } from '../scripts/sources.ts';
import { buildCorpus } from '../scripts/build.ts';
import { createKnowledge } from '../src/knowledge.ts';
import type { Corpus } from '../src/types.ts';
const corpus=JSON.parse(await readFile(new URL('../.generated/corpus.json',import.meta.url),'utf8')) as Corpus;
const kb=createKnowledge(corpus);
const sources=await loadApiSources();

test('Every API source line is retained; 277 complete endpoints per language are readable and discoverable by name or HTTP path',()=>{
 for(const source of sources){
  const sections=corpus.api.sections.filter(s=>s.doc_id===source.doc.id&&s.language===source.doc.language);
  const text=sections.map(s=>s.heading_path.join('\n')+'\n'+s.body).join('\n');
  for(const line of source.lines){const original=line.replace(/^#{1,2}\s+/,'').trim();if(original)assert(text.includes(original),source.doc.path+': '+original);}
 }
 for(const language of ['zh','en']as const){
  const endpoints=corpus.api.sections.filter(s=>s.language===language&&/^\w+\.[\w.]+$/.test(s.heading_path.at(-1)!)&&s.doc_id.startsWith('api-reference-'));
  assert.equal(endpoints.length,277);
  for(const endpoint of endpoints){
   const name=endpoint.heading_path.at(-1)!;
   const read=kb.read(endpoint.section_id,corpus.revision);
   assert(read.body.includes('### '),name);assert(read.context.includes('Authorization: Bearer'),name);
   assert(read.body.includes('/api/v1/'),name);
   const source=sources.find(s=>s.doc.id===endpoint.doc_id&&s.doc.language===language)!;
   assert.equal(read.version,source.doc.version);assert.equal(read.source_commit,source.doc.source_commit);
   for(const query of [name, /`(\/api\/v1\/[^`]+)`/.exec(read.body)![1]]){
    assert.equal(kb.search({query,language,scope:'api'}).results[0]?.section_id,endpoint.section_id,language+': '+query);
   }
  }
 }
});
test('Parameter-specific permissions and linked models accompany the exact API rather than an isolated example',()=>{
 for(const language of ['zh','en']as const){
  const hit=kb.search({query:'temp.bind',language,scope:'api'}).results.find(s=>s.language===language&&s.heading_path.at(-1)==='temp.bind');assert(hit);
  const read=kb.read(hit.section_id,corpus.revision);assert(/ADMIN/.test(read.body));assert(/ROOT/.test(read.body));assert(/variables/.test(read.body));assert(/code/.test(read.context));
  const temp=corpus.api.sections.find(s=>s.language===language&&s.heading_path.at(-1)==='temp.read');assert(temp);
  const related=kb.read(temp.section_id,corpus.revision).related_sections.map(id=>kb.read(id,corpus.revision));
  assert(related.some(s=>s.doc_id==='api-response-models'&&s.heading_path.at(-1)==='temperature'));
  assert(related.some(s=>s.doc_id==='api-conventions'));
 }
});
test('Developer workflows are searchable while general retrieval and version boundaries remain isolated',()=>{
 for(const [language,query,doc,evidence]of [
  ['zh','API 登录 token','api-quickstart',/session_id/],
  ['en','API login token','api-quickstart',/session_id/],
  ['zh','WebSocket 订阅 fan.status','api-websocket',/subscribe/],
  ['en','WebSocket subscribe fan.status','api-websocket',/subscribe/],
  ['zh','HTTP 200 业务失败','api-conventions',/code/],
  ['en','HTTP 200 business failure','api-conventions',/code/],
  ['zh','SSH active_version 受管服务','api-scenarios',/run_id/],
  ['en','managed remote service active_version','api-scenarios',/run_id/],
 ]as const){
  const results=kb.search({query,language,scope:'api'});assert(results.results.some(hit=>hit.doc_id===doc&&evidence.test(kb.read(hit.section_id,corpus.revision).body)),query);
 }
 assert(kb.search({query:'temp.bind'}).results.every(hit=>!hit.doc_id.startsWith('api-')));
 assert(kb.search({query:'RM-01 供电',scope:'api'}).results.every(hit=>hit.doc_id.startsWith('api-')));
 assert.equal(kb.search({query:'temp.bind',scope:'api',version:'0.0.0'}).results.length,0);
 assert.throws(()=>kb.search({query:'temp.bind',scope:'other' as 'api'}),/scope must/);
 assert.throws(()=>kb.read(corpus.api.sections[0].section_id,'0'.repeat(64)),/Corpus changed/);
 assert(!corpus.api.sections.some(s=>['ja','ko','es','fr'].includes(s.language)));
 assert(!sources.some(s=>s.doc.path.endsWith('/reference/README.md')));
});
test('Changing or adding only website API Markdown changes the served corpus; mismatched or missing versions fail the build',async()=>{
 const root=await mkdtemp(join(tmpdir(),'knowledge-api-'));
 const git=(...args:string[])=>execFileSync('git',args,{cwd:root,stdio:'pipe',encoding:'utf8'}).trim();
 try{
  await cp(join(repository,'website/guides/content'),join(root,'website/guides/content'),{recursive:true});
  await mkdir(join(root,'docs/official-knowledge'),{recursive:true});await writeFile(join(root,'docs/official-knowledge/source-manifest.json'),'{"documents":[]}');
  git('init','-q');git('config','user.name','API source test');git('config','user.email','test@example.invalid');git('add','.');git('commit','-qm','original');
  const before=await buildCorpus(root);
  await writeFile(join(root,apiDirectory,'en','new-topic.md'),'# New developer topic\n\n## New task\nUniqueApiContentProof\n');
  git('add','.');git('commit','-qm','website original update');
  const after=await buildCorpus(root);assert.notEqual(before.revision,after.revision);
  const changed=createKnowledge(after);const hit=changed.search({scope:'api',query:'UniqueApiContentProof'}).results[0];assert(hit);
  const result=changed.read(hit.section_id,after.revision);assert(result.body.includes('UniqueApiContentProof'));assert.equal(result.source_commit,git('rev-parse','HEAD'));assert.deepEqual(result.source_lines,[3,5]);
  assert.throws(()=>changed.read(hit.section_id,before.revision),/Corpus changed/);
  const path=join(root,apiDirectory,'en','README.md');const readme=await readFile(path,'utf8');
  await writeFile(path,readme.replace(/\*\*TianshanOS \d+\.\d+\.\d+\*\*/,'**TianshanOS 0.0.0**'));
  await assert.rejects(loadApiSources(root),/language version mismatch/);
  await writeFile(path,readme.replace(/\*\*TianshanOS \d+\.\d+\.\d+\*\*/,'TianshanOS'));
  await assert.rejects(loadApiSources(root),/version missing/);
 }finally{await rm(root,{recursive:true,force:true});}
});
