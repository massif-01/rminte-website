import { normalize, terms, bytes } from './text.ts';
import type { Corpus, Section } from './types.ts';
export class KnowledgeError extends Error { code:string; constructor(code:string,message:string){super(message);this.code=code;} }
export interface SearchInput {query:string;language?:'auto'|'zh'|'en';version?:string;include_history?:boolean;limit?:number}
export function createKnowledge(c:Corpus){
 const byId=new Map(c.sections.map(s=>[s.section_id,s]));
 const postingFor=(term:string)=>Object.hasOwn(c.postings,term)?c.postings[term]:undefined;
 const metadata=(s:Section)=>({section_id:s.section_id,doc_id:s.doc_id,language:s.language,title:s.title,heading_path:s.heading_path,source_urls:s.source_urls,source_lines:s.source_lines,pdf_page:s.pdf_page,source_commit:s.source_commit,source_date:s.source_date,prepared_on:s.prepared_on,navigation_only:s.navigation_only,applicability:s.applicability,version:s.version,historical:s.historical,evidence_status:s.evidence_status,content_kind:s.content_kind,content_hash:s.content_hash,context_hash:s.context_hash});
 function read(section_id:string,corpus_revision:string){
  if(corpus_revision!==c.revision)throw new KnowledgeError('CORPUS_CHANGED','资料已更新，请重新搜索 / Corpus changed; search again.');
  const s=byId.get(section_id);if(!s)throw new KnowledgeError('SECTION_NOT_FOUND','没有可读取的章节 / Section not available.');
  const result={corpus_revision:c.revision,...metadata(s),body:s.body,context:s.context,related_sections:s.related_sections};
  if(bytes(JSON.stringify(result))>29000)throw new KnowledgeError('RESULT_TOO_LARGE','章节过长；需要维护者重新切分 / Section requires source-boundary review.');return result;
 }
 function search(input:SearchInput){
  if(!input.query?.trim()||Array.from(input.query).length>300)throw new KnowledgeError('INVALID_QUERY','query must contain 1–300 characters.');
  const limit=input.limit??5;if(!Number.isInteger(limit)||limit<1||limit>8)throw new KnowledgeError('INVALID_LIMIT','limit must be 1–8.');
  const requested=input.language??'auto';if(!['auto','zh','en'].includes(requested))throw new KnowledgeError('INVALID_LANGUAGE','language must be auto, zh, en.');
  const language=requested==='auto'?(/\p{Script=Han}/u.test(input.query)?'zh':/[a-z]{3}/i.test(input.query)?'en':null):requested;
  const queryTerms=[...new Set(terms(input.query))]; const scores=new Map<number,number>();const matches=new Map<number,Set<string>>();
  const version=input.version;const normalized=normalize(input.query);
  for(const t of queryTerms){
   const posting=postingFor(t);if(!posting)continue;
   const idf=Math.log(1+(c.sections.length-posting.length+0.5)/(posting.length+0.5));
   for(const [i,tf]of posting){
    const s=c.sections[i];if((s.historical&&!input.include_history)||(version&&s.version&&s.version!==version))continue;
    scores.set(i,(scores.get(i)||0)+idf*(tf*2.2)/(tf+1.2*(0.25+0.75*s.length/c.average_length)));
    if(!matches.has(i))matches.set(i,new Set());matches.get(i)!.add(t);
   }
  }
  const weight=(t:string)=>Math.log(1+(c.sections.length+0.5)/((postingFor(t)?.length||0)+0.5));
  // Unknown Han segments/bigrams are not rare indexed terms; keep unknown identifiers significant.
  const totalWeight=queryTerms.filter(t=>postingFor(t)||!/^\p{Script=Han}+$/u.test(t)).reduce((n,t)=>n+weight(t),0);
  const unsupportedShortQuery=queryTerms.length<=2&&queryTerms.some(t=>/^\p{L}+$/u.test(t)&&!postingFor(t));
  const ranked=(unsupportedShortQuery?[]:[...scores]).filter(([i])=>[...matches.get(i)!].reduce((n,t)=>n+weight(t),0)/Math.max(1,totalWeight)>=0.25).map(([i,score])=>{
   const s=c.sections[i];let boost=language===s.language?1.3:1;
   if(s.historical)boost*=0.45;
   if(normalized.includes(normalize(s.heading_path.at(-1)!))&&s.heading_path.at(-1)!.length>2)boost*=1.5;
   if(s.doc_id==='homepage-source-copy')boost*=0.75;
   return{i,score:score*boost};
  }).sort((a,b)=>b.score-a.score||a.i-b.i);
  const seen=new Set<string>();const docCounts=new Map<string,number>();const results=[];
  for(const {i,score}of ranked){
   const s=c.sections[i];const key=JSON.stringify([s.content_hash,s.context_hash,s.language,s.version,s.applicability]);const group=s.doc_id;
   if(seen.has(key)||(docCounts.get(group)||0)>=2)continue;
   seen.add(key);docCounts.set(group,(docCounts.get(group)||0)+1);
   const text=s.body;let start=0;for(const t of queryTerms){const pos=normalize(text).indexOf(t);if(pos>=0){start=Math.max(0,pos-60);break;}}
   const excerpt=Array.from(text).slice(start,start+400).join('');
   results.push({...metadata(s),excerpt,score:Number(score.toFixed(4)),language_fallback:!!language&&s.language!==language});if(results.length===limit)break;
  }
  return{corpus_revision:c.revision,results,status:results.length?'matches':'no_match',notice:'Snapshot knowledge only; retain version, safety context and source qualifications. 未核验实时状态，不能把官方宣传或模拟示意当成独立实测。',version_notice:version?`Only explicitly matching versioned documents and version-independent sources included. Requested: ${version}. No assurance for other software versions.`:null};
 }
 return{search,read,revision:c.revision};
}
