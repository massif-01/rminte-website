import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { terms, bytes } from '../src/text.ts';
import type { SourceDoc, Section, Corpus } from '../src/types.ts';
const service = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const corpusRoot = resolve(service, '../../docs/official-knowledge');
export const hash = (s:string) => createHash('sha256').update(s).digest('hex');
const ALLOWED = new Set(['operating-instructions','product-security-document','official-product-copy','official-site-text','official-source-text','public-contact-information','public-case-description','public-application-instructions','public-agreement-template','source-availability-note','public-company-identification','source-interpretation','historical-company-brochure','public-service-instructions']);
const POLICY='source-headings-v4-intl-segmenter-bigrams-wattage-bm25-v5';
interface Heading { level:number;title:string;start:number;end:number;path:string[];body:string;id:string;parents:Heading[] }
export function parseHeadings(lines:string[], offset:number, docId:string, language:string, title:string):Heading[]{
 const headings:Heading[]=[];const stack:Heading[]=[];const ids=new Map<string,number>();let fence:string|null=null;
 for(let i=offset;i<lines.length;i++){
  const marker=/^\s{0,3}(`{3,}|~{3,})/.exec(lines[i]);
  if(marker){if(!fence)fence=marker[1];else if(marker[1][0]===fence[0]&&marker[1].length>=fence.length&&!lines[i].slice(marker[0].length).trim())fence=null;continue;}
  const match=!fence&&/^(#{1,6})\s+(.+)/.exec(lines[i]);if(!match)continue;
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
export async function buildCorpus():Promise<Corpus> {
 const manifest=JSON.parse(await readFile(resolve(corpusRoot,'source-manifest.json'),'utf8'));
 const sections:Section[]=[];const documents:Corpus['documents']=[];
 for(const d of manifest.documents as SourceDoc[]){
  const full=await readFile(resolve(corpusRoot,d.path),'utf8');if(hash(full)!==d.sha256)throw Error(`Source hash mismatch: ${d.path}`);
  if(!d.default_retrieval||!ALLOWED.has(d.content_kind)){documents.push({id:d.id,language:d.language,status:'excluded',reason:'unverified or unapproved source type',sections:0});continue;}
  const lines=full.split('\n');const offset=lines.findIndex((s,i)=>i>0&&s==='---')+1; if(offset<2)throw Error('Missing front matter');
  const headings=parseHeadings(lines,offset,d.id,d.language,d.title);
  const before=sections.length;
  for(const h of headings){
   const navigation_only=!h.body||h.level===0;const originalBody=h.body||lines[h.start];if(!originalBody)continue;
   let context=h.parents.filter(x=>x.body).map(x=>x.path.join(' / ')+'\n'+x.body).join('\n\n');
   if(d.id==='models'&&['task','outputs','stages'].includes(h.title)){const scenario=headings.filter(x=>x.start<h.start&&x.title==='name').at(-1);if(scenario)context+='\n\n'+scenario.body;}
   if(bytes(context)>12000)throw Error(`Context too large: ${h.id}`);
   const parts=splitBlocks(originalBody);
   for(let i=0;i<parts.length;i++){
    const body=parts[i];const id=h.id+(parts.length>1?`/part-${i+1}`:''); const page=h.path.join(' ').match(/(?:原 PDF 第|Original PDF page)\s*(\d+)/);
    sections.push({section_id:id,doc_id:d.id,language:d.language,title:d.title,heading_path:h.path,body,context,related_sections:[],source_urls:d.source_urls,source_lines:[h.start+1,h.end],pdf_page:page?Number(page[1]):null,source_commit:d.source_commit,source_date:d.id==='hardware-security'?'2026-09-11':['guide-admin','guide-root','guide-security'].includes(d.id)?'2026-11-03':d.id==='company-brochure'?'2026-09-07':null,prepared_on:d.prepared_on,navigation_only,applicability:d.applicability,version:['guide-admin','guide-root','guide-security'].includes(d.id)?'0.6.4':null,historical:d.content_kind==='historical-company-brochure',evidence_status:d.evidence_status,content_kind:d.content_kind,content_hash:hash(body),context_hash:hash(context),length:terms(body).length});
   }
  }
  documents.push({id:d.id,language:d.language,status:d.content_kind==='historical-company-brochure'?'history-only':'indexed',reason:'approved source; retain original heading/body and inherited preamble',sections:sections.length-before});
 }
 // Resolve original intra-corpus links (including the Chinese authoritative contract).
 for(const s of sections){const paths=[...s.body.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)].map(x=>resolve(corpusRoot,s.language,x[1]));s.related_sections=sections.filter(t=>paths.includes(resolve(corpusRoot,t.language,t.doc_id+'.md'))).map(t=>t.section_id);}
 const postings:Corpus['postings']=Object.create(null);
 sections.forEach((s,i)=>{const freq=new Map<string,number>();for(const t of terms(s.body))freq.set(t,(freq.get(t)||0)+1);for(const t of terms(s.context))freq.set(t,(freq.get(t)||0)+0.1);for(const t of terms(s.title+' '+s.heading_path.join(' ')+' '+s.doc_id))freq.set(t,(freq.get(t)||0)+2);s.length=[...freq.values()].reduce((a,b)=>a+b,0);if(!s.navigation_only)for(const [t,n]of freq)(postings[t]??=[]).push([i,n]);});
 const revision=hash(JSON.stringify({policy:POLICY,sources:manifest.documents.map((d:SourceDoc)=>[d.path,d.sha256,d.default_retrieval,d.content_kind]),sections,postings}));
 return{revision,build_policy:POLICY,sections,postings,average_length:sections.reduce((sum,s)=>sum+s.length,0)/sections.length,documents};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const c=await buildCorpus();await mkdir(resolve(service,'.generated'),{recursive:true});await writeFile(resolve(service,'.generated/corpus.json'),JSON.stringify(c));await writeFile(resolve(service,'.generated/build-report.json'),JSON.stringify({revision:c.revision,sections:c.sections.length,documents:c.documents,largest_body:Math.max(...c.sections.map(s=>bytes(s.body))),largest_context:Math.max(...c.sections.map(s=>bytes(s.context)))},null,2)+'\n');console.log(JSON.stringify({revision:c.revision,sections:c.sections.length,bytes:bytes(JSON.stringify(c))}));
}
