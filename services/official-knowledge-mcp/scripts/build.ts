import { writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { terms, bytes } from '../src/text.ts';
import { loadSources, corpusRoot, repository } from './sources.ts';
export { corpusRoot } from './sources.ts';
import { loadApiSources } from './api-sources.ts';
import type { LoadedSource } from './sources.ts';
import type { Section, Corpus, KnowledgeIndex } from '../src/types.ts';
const service = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const hash = (s:string) => createHash('sha256').update(s).digest('hex');
const ALLOWED = new Set(['operating-instructions','product-security-document','official-product-copy','official-site-text','official-source-text','public-contact-information','public-case-description','public-application-instructions','public-agreement-template','source-availability-note','public-company-identification','source-interpretation','historical-company-brochure','public-service-instructions']);
const POLICY='api-scoped-complete-endpoints-v1-intl-segmenter-bigrams-wattage-bm25-v5';
interface Heading { level:number;title:string;start:number;end:number;path:string[];body:string;id:string;parents:Heading[] }
export function parseHeadings(lines:string[], offset:number, docId:string, language:string, title:string, maxLevel=6):Heading[]{
 const headings:Heading[]=[];const stack:Heading[]=[];const ids=new Map<string,number>();let fence:string|null=null;
 for(let i=offset;i<lines.length;i++){
  const marker=/^\s{0,3}(`{3,}|~{3,})/.exec(lines[i]);
  if(marker){if(!fence)fence=marker[1];else if(marker[1][0]===fence[0]&&marker[1].length>=fence.length&&!lines[i].slice(marker[0].length).trim())fence=null;continue;}
  const match=!fence&&/^(#{1,6})\s+(.+)/.exec(lines[i]);if(!match||match[1].length>maxLevel)continue;
  if(headings.length)headings.at(-1)!.end=i;
  const level=match[1].length;while(stack.length&&stack.at(-1)!.level>=level)stack.pop();
  const headingTitle=match[2].trim();const path=[...stack.map(h=>h.title),headingTitle];
  const slug=path.map(x=>x.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')).join('/');
  const n=(ids.get(slug)||0)+1;ids.set(slug,n);
  const h:Heading={level,title:headingTitle,start:i,end:lines.length,path,body:'',id:`${language}/${docId}/${slug}${n>1?'~'+n:''}`,parents:[...stack]};
  headings.push(h);stack.push(h);
 }
 if(fence)throw Error('Unclosed Markdown code fence');
 if(!headings.length)headings.push({level:1,title,start:offset-1,end:lines.length,path:[title],body:'',id:`${language}/${docId}/overview`,parents:[]});
 if(headings[0].start>=offset&&lines.slice(offset,headings[0].start).join('').trim()){
  const preamble:Heading={level:0,title,start:offset-1,end:headings[0].start,path:[title],body:'',id:`${language}/${docId}/preamble`,parents:[]};
  for(const h of headings)h.parents.unshift(preamble);
  headings.unshift(preamble);
 }
 for(const h of headings)h.body=lines.slice(h.start+1,h.end).join('\n').trim();
 return headings;
}
export function splitBlocks(body:string, max=7000):string[] {
  const lines=body.split('\n'); const blocks:string[]=[]; let block:string[]=[], fence:string|null=null, table=false;
  const flush=()=>{if(block.length){blocks.push(block.join('\n'));block=[];}};
  for(const line of lines){
    const marker=/^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if(marker){block.push(line);if(!fence)fence=marker[1];else if(marker[1][0]===fence[0]&&marker[1].length>=fence.length&&!line.slice(marker[0].length).trim()){fence=null;flush();}continue;}
    if(fence){block.push(line);continue;}
    if(/^\s*\|/.test(line)){if(!table)flush();table=true;block.push(line);continue;}
    if(table){flush();table=false;}
    if(!line.trim()){flush();continue;} block.push(line);
  }if(fence)throw Error('Unclosed Markdown code fence');flush();
  const parts:string[]=[];let current='';
  for(const b of blocks){
    if(bytes(b)>max) throw new Error(`Indivisible block exceeds ${max} bytes; curate its boundaries, never truncate: ${b.slice(0,70)}`);
    if(current&&bytes(current+'\n\n'+b)>max){parts.push(current);current='';} current+=(current?'\n\n':'')+b;
  }if(current)parts.push(current);return parts;
}
function buildIndex(sources:LoadedSource[], api=false):KnowledgeIndex {
 const sections:Section[]=[];const documents:Corpus['documents']=[];
 for(const {doc:d,lines,offset,lineOffset} of sources){
  if(!d.default_retrieval||!ALLOWED.has(d.content_kind)){documents.push({id:d.id,language:d.language,status:'excluded',reason:'unverified or unapproved source type',sections:0});continue;}
  const headings=parseHeadings(lines,offset,d.id,d.language,d.title,api?2:6);
  const reference=api&&/\/reference\/(?!pdf-index\.md)/.test(d.path);
  const before=sections.length;
  for(const h of headings){
   const navigation_only=!h.body||h.level===0||(reference&&h.level===1);const originalBody=h.body||lines[h.start];if(!originalBody)continue;
   let context=h.parents.filter(x=>x.body).map(x=>x.path.join(' / ')+'\n'+(reference?x.body.split(/\n\|/)[0].trim():x.body)).join('\n\n');
   if(reference&&h.level===2){
    const conventions=sources.find(s=>s.doc.id==='api-conventions'&&s.doc.language===d.language)!;
    context+='\n\n'+conventions.lines.join('\n');
   }
   if(d.id==='models'&&['task','outputs','stages'].includes(h.title)){const scenario=headings.filter(x=>x.start<h.start&&x.title==='name').at(-1);if(scenario)context+='\n\n'+scenario.body;}
   if(bytes(context)>12000)throw Error(`Context too large: ${h.id}`);
   const parts=splitBlocks(originalBody);
   if(reference&&h.level===2&&parts.length!==1)throw Error('API endpoint must remain one complete read: '+h.id);
   for(let i=0;i<parts.length;i++){
    const body=parts[i];
    const endpoint=reference&&h.level===2;const apiPath=endpoint?/`(\/api\/v1\/[^`]+)`/.exec(body)?.[1]:undefined;
    if(endpoint&&!apiPath)throw Error('API endpoint path missing: '+h.id);
    const id=h.id+(parts.length>1?`/part-${i+1}`:''); const page=h.path.join(' ').match(/(?:原 PDF 第|Original PDF page)\s*(\d+)/);
    sections.push({...(endpoint?{api_name:h.title,api_path:apiPath!}:{}),section_id:id,doc_id:d.id,language:d.language,title:d.title,heading_path:h.path,body,context,related_sections:[],source_urls:d.source_urls,source_lines:[h.start+1+lineOffset,h.end+lineOffset],pdf_page:page?Number(page[1]):null,source_commit:d.source_commit,source_date:d.source_date??(d.id==='hardware-security'?'2026-09-11':d.id==='company-brochure'?'2026-09-07':null),prepared_on:d.prepared_on,navigation_only,applicability:d.applicability,version:d.version??null,historical:d.content_kind==='historical-company-brochure',evidence_status:d.evidence_status,content_kind:d.content_kind,content_hash:hash(body),context_hash:hash(context),length:terms(body).length});
   }
  }
  documents.push({id:d.id,language:d.language,status:d.content_kind==='historical-company-brochure'?'history-only':'indexed',reason:'approved source; retain original heading/body and inherited preamble',sections:sections.length-before});
 }
 // Resolve original intra-corpus links (including the Chinese authoritative contract).
 if(api)resolveApiLinks(sources,sections);
 else for(const s of sections){const paths=[...s.body.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)].map(x=>resolve(corpusRoot,s.language,x[1]));s.related_sections=sections.filter(t=>paths.includes(resolve(corpusRoot,t.language,t.doc_id+'.md'))).map(t=>t.section_id);}
 const postings:Corpus['postings']=Object.create(null);
 sections.forEach((s,i)=>{const freq=new Map<string,number>();for(const t of terms(s.body))freq.set(t,(freq.get(t)||0)+1);for(const t of terms(s.context))freq.set(t,(freq.get(t)||0)+0.1);for(const t of terms(s.title+' '+s.heading_path.join(' ')+' '+s.doc_id))freq.set(t,(freq.get(t)||0)+2);s.length=[...freq.values()].reduce((a,b)=>a+b,0);if(!s.navigation_only)for(const [t,n]of freq)(postings[t]??=[]).push([i,n]);});
 return{sections,postings,average_length:sections.reduce((sum,s)=>sum+s.length,0)/sections.length,documents};
}
function resolveApiLinks(sources:LoadedSource[], sections:Section[]) {
 const byPath=new Map(sources.map(source=>[resolve(repository,source.doc.path),source]));
 const sectionSource=new Map(sources.map(source=>[source.doc.language+'/'+source.doc.id,source]));
 const slug=(title:string)=>title.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_\-\s]/gu,'').trim().replace(/\s/g,'-');
 const targets=new Map<string,string[]>();
 for(const [path,source]of byPath){
  const local=sections.filter(s=>s.doc_id===source.doc.id&&s.language===source.doc.language);
  targets.set(path,local.map(s=>s.section_id));
  for(const s of local){
   const key=path+'#'+slug(s.heading_path.at(-1)!);
   targets.set(key,[...(targets.get(key)||[]),s.section_id]);
  }
  for(let i=0;i<source.lines.length;i++){
   const anchor=/^<a id="([^"]+)"><\/a>$/.exec(source.lines[i]);if(!anchor)continue;
   const next=local.find(s=>s.source_lines[0]>i+1);if(next)targets.set(path+'#'+anchor[1],[next.section_id]);
  }
 }
 for(const s of sections){
  const source=sectionSource.get(s.language+'/'+s.doc_id)!;
  const related=new Set<string>();
  const text=s.body+'\n'+(source.doc.path.includes('/reference/')?source.lines.slice(0,source.lines.findIndex(line=>line.startsWith('## '))).join('\n').split(/\n\|/)[0]:'');
  for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
   const [href,fragment]=match[1].split('#');if(href&&!href.endsWith('.md'))continue;
   let path=href?resolve(repository,dirname(source.doc.path),href):resolve(repository,source.doc.path);
   if(path.endsWith('/reference/README.md'))path=path.replace(/README\.md$/,'pdf-index.md');
   const ids=targets.get(path+(fragment?'#'+decodeURIComponent(fragment):''));
   if(!ids)throw Error('Unresolved API Markdown link: '+source.doc.path+' -> '+match[1]);
   for(const id of ids)if(id!==s.section_id)related.add(id);
  }
  s.related_sections=[...related];
 }
}
export async function buildCorpus(root=repository):Promise<Corpus> {
 const sources=await loadSources(root);const apiSources=await loadApiSources(root);
 const general=buildIndex(sources);const api=buildIndex(apiSources,true);
 const revision=hash(JSON.stringify({policy:POLICY,sources:[...sources,...apiSources].map(({doc:d})=>[d.path,d.sha256,d.default_retrieval,d.content_kind]),general,api}));
 return{revision,build_policy:POLICY,...general,api};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const c=await buildCorpus();await mkdir(resolve(service,'.generated'),{recursive:true});await writeFile(resolve(service,'.generated/corpus.json'),JSON.stringify(c));await writeFile(resolve(service,'.generated/build-report.json'),JSON.stringify({revision:c.revision,sections:c.sections.length,api_sections:c.api.sections.length,documents:[...c.documents,...c.api.documents],largest_body:Math.max(...[...c.sections,...c.api.sections].map(s=>bytes(s.body))),largest_context:Math.max(...[...c.sections,...c.api.sections].map(s=>bytes(s.context)))},null,2)+'\n');console.log(JSON.stringify({revision:c.revision,sections:c.sections.length,api_sections:c.api.sections.length,bytes:bytes(JSON.stringify(c))}));
}
