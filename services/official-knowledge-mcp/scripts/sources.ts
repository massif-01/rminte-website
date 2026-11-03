import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import type { SourceDoc } from '../src/types.ts';
export const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
export const corpusRoot = resolve(repository, 'docs/official-knowledge');
export const guideFiles = ['admin.md','root.md','security.zh.md','security.en.md','network.md'].map(name=>'website/guides/content/'+name);
export interface LoadedSource { doc:SourceDoc; lines:string[]; offset:number; lineOffset:number }
const hash=(text:string)=>createHash('sha256').update(text).digest('hex');
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
export function guideMetadata(body:string, language:string){
 const version=/^(?:对应版本：|Version covered:)\s*(?:TianshanOS\s+)?(\d+\.\d+\.\d+)/m.exec(body)?.[1];
 const zh=/(?:修订日期|核查日期)：(\d{4}-\d{2}-\d{2})/.exec(body);
 const en=/(?:Revised|Reviewed) ([A-Z][a-z]+) (\d{1,2}), (\d{4})/.exec(body);
 const date=language==='zh'?zh?.[1]:en&&months.includes(en[1])?`${en[3]}-${String(months.indexOf(en[1])+1).padStart(2,'0')}-${en[2].padStart(2,'0')}`:null;
 if(!version||!date||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('Guide version/date missing or invalid: '+language);
 return {version,source_date:date};
}
export async function loadSources(root=repository):Promise<LoadedSource[]>{
 const knowledge=resolve(root,'docs/official-knowledge');
 const manifest=JSON.parse(await readFile(resolve(knowledge,'source-manifest.json'),'utf8'));
 const sources:LoadedSource[]=[];
 for(const doc of manifest.documents as SourceDoc[]){
  const full=await readFile(resolve(knowledge,doc.path),'utf8');if(hash(full)!==doc.sha256)throw Error('Source hash mismatch: '+doc.path);
  const lines=full.split('\n');const offset=lines.findIndex((s,i)=>i>0&&s==='---')+1;if(offset<2)throw Error('Missing front matter: '+doc.path);
  sources.push({doc,lines,offset,lineOffset:0});
 }
 const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const commitDate=execFileSync('git',['show','-s','--format=%cs','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 for(const slug of ['admin','root','security','network']){
  const pair:LoadedSource[]=[];
  for(const language of ['zh','en']){
   const path=`website/guides/content/${slug}${slug==='security'?'.'+language:''}.md`;
   const full=(await readFile(resolve(root,path),'utf8')).replaceAll('\r\n','\n');
   let body=full,lineOffset=0;
   if(slug!=='security'){
    const headings=[...full.matchAll(/^# .+$/gm)];if(headings.length!==2)throw Error('Expected exactly two guide languages: '+path);
    const i=language==='zh'?0:1;const start=headings[i].index!;
    lineOffset=full.slice(0,start).split('\n').length-1;
    body=full.slice(start,headings[i+1]?.index).replace(/\s*---\s*$/,'');
   }
   const title=/^# (.+)$/m.exec(body)?.[1];if(!title)throw Error('Missing guide title: '+path);
   const metadata=slug==='network'?{version:null,source_date:null}:guideMetadata(body,language);
   const doc:SourceDoc={id:'guide-'+slug,language,title,path,sha256:hash(body),source_commit:commit,prepared_on:commitDate,content_kind:'operating-instructions',applicability:slug==='network'?'version-independent (confirmed by owner)':'TianshanOS '+metadata.version,source_files:[path],source_urls:['https://rminte.com/guides/'+slug],default_retrieval:true,evidence_status:'source transcription; not independent operational verification',...metadata};
   pair.push({doc,lines:body.split('\n'),offset:0,lineOffset});
  }
  if(pair[0].doc.version!==pair[1].doc.version||pair[0].doc.source_date!==pair[1].doc.source_date)throw Error('Guide language version/date mismatch: '+slug);
  sources.push(...pair);
 }
 return sources;
}
