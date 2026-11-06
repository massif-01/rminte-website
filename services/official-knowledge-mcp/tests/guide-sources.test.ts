import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { guideFiles, guideMetadata, repository, loadSources } from '../scripts/sources.ts';
import { buildCorpus } from '../scripts/build.ts';
import { createKnowledge } from '../src/knowledge.ts';

test('Guide source changes reach the corpus without a knowledge copy; versions, dates and line numbers follow the original',async()=>{
 const root=await mkdtemp(join(tmpdir(),'knowledge-guides-'));
 const git=(...args:string[])=>execFileSync('git',args,{cwd:root,stdio:'pipe',encoding:'utf8'}).trim();
 try{
  await mkdir(join(root,'docs/official-knowledge'),{recursive:true});await writeFile(join(root,'docs/official-knowledge/source-manifest.json'),' {"documents":[]}');
  for(const path of guideFiles){await mkdir(dirname(join(root,path)),{recursive:true});await writeFile(join(root,path),await readFile(join(repository,path)));}
  await cp(join(repository,'website/guides/content/api'),join(root,'website/guides/content/api'),{recursive:true});
  git('init','-q');git('config','user.name','Source test');git('config','user.email','test@example.invalid');git('add','.');git('commit','-qm','original');
  const before=await buildCorpus(root);const path=join(root,guideFiles[0]);let body=await readFile(path,'utf8');
  const current=guideMetadata(body,'zh');const parts=current.version.split('.');parts[2]=String(Number(parts[2])+1);const version=parts.join('.');
  const date=new Date(Date.parse(current.source_date)+86400000).toISOString().slice(0,10);
  const englishDate=(iso:string)=>new Date(iso).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
  // Changing only English must be rejected rather than silently mixing editions.
  await writeFile(path,body.replace(/(Version covered:\s*(?:TianshanOS\s+)?)(\d+\.\d+\.\d+)/,(_,prefix)=>prefix+version));
  await assert.rejects(loadSources(root),/version\/date mismatch/);
  body=body.replaceAll(current.version,version).replaceAll(current.source_date,date).replaceAll(englishDate(current.source_date),englishDate(date))+'\nUniqueGuideContentProof\n';
  await writeFile(path,body);git('add','.');git('commit','-qm','new guide');
  const after=await buildCorpus(root);assert.notEqual(after.revision,before.revision);
  const kb=createKnowledge(after);const hit=kb.search({query:'UniqueGuideContentProof'}).results[0];assert(hit);
  const result=kb.read(hit.section_id,after.revision);assert.equal(result.doc_id,'guide-admin');assert.equal(result.language,'en');assert.equal(result.version,version);assert.equal(result.source_date,date);assert.equal(result.source_commit,git('rev-parse','HEAD'));
  assert(body.split('\n').slice(result.source_lines[0]-1,result.source_lines[1]).join('\n').includes('UniqueGuideContentProof'));
  const sources=await loadSources(root);assert.equal(sources.length,8);
  for(const s of after.sections.filter(s=>s.doc_id==='guide-network'))assert.equal(s.version,null);
  await writeFile(path,body.replace('对应版本：','旧版说明：'));
  await assert.rejects(loadSources(root),/version\/date missing/);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('Guide metadata requires an explicit valid version and date',()=>{
 assert.deepEqual(guideMetadata('对应版本：1.2.3 · 修订日期：2027-01-02。','zh'),{version:'1.2.3',source_date:'2027-01-02'});
 assert.deepEqual(guideMetadata('Version covered: TianshanOS 1.2.3. Reviewed January 2, 2027.','en'),{version:'1.2.3',source_date:'2027-01-02'});
 assert.throws(()=>guideMetadata('对应版本：1.2.3 · 修订日期：2027-02-31。','zh'),/missing or invalid/);
 assert.throws(()=>guideMetadata('Version covered: 1.2.3.','en'),/missing or invalid/);
});
