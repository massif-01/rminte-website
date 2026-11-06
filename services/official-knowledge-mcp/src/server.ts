import { McpServer } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { createKnowledge, KnowledgeError } from './knowledge.ts';
import { bytes } from './text.ts';
import type { Corpus } from './types.ts';
export function createServer(corpus:Corpus){
 const kb=createKnowledge(corpus);const server=new McpServer({name:'rminte-official-knowledge',version:'0.1.0'},{instructions:'Read-only official source retrieval. Read the matched section and its context before answering. Cite original URLs and applicability. Snapshots are not live facts; published claims and demos are not independent measurements. Use search_knowledge scope=api for API integration, endpoint parameters, authentication, WebSocket and developer examples; scope=general (default) covers product and operating guides. Read related_sections for linked data models and prerequisites. This service retrieves documentation only and cannot call device APIs. Chinese originals remain authoritative when no English original exists.'});
 const output=(fn:()=>unknown)=>{
  try{const data=fn();const text=JSON.stringify(data);if(bytes(text)>30000)throw new KnowledgeError('RESULT_TOO_LARGE','Result requires smaller source sections.');return{content:[{type:'text' as const,text}]};}
  catch(error){if(!(error instanceof KnowledgeError))throw error;return{isError:true,content:[{type:'text' as const,text:JSON.stringify({error:{code:error.code,message:error.message}})}]};}
 };
 const annotations={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
 server.registerTool('search_knowledge',{description:'Search official Chinese/English sources. Use scope=api for TianshanOS developer documentation, HTTP endpoints, parameters, authentication, WebSocket, models and examples. Default scope=general searches RM-01, operating guides, company, cases and sample loans. Returns excerpts and IDs, not generated answers. Call read_section before answering.',inputSchema:z.object({scope:z.enum(['general','api']).default('general'),query:z.string().min(1).refine(s=>Array.from(s).length<=300),language:z.enum(['auto','zh','en']).default('auto'),version:z.string().max(30).optional(),include_history:z.boolean().default(false),limit:z.number().int().min(1).max(8).default(5)}).strict(),annotations},args=>output(()=>kb.search(args)));
 server.registerTool('read_section',{description:'Read exact official source section, inherited prerequisites and safety context. Use section_id and corpus_revision from search; other paths/URLs cannot be read.',inputSchema:z.object({section_id:z.string().min(1).max(1000),corpus_revision:z.string().length(64)}).strict(),annotations},args=>output(()=>kb.read(args.section_id,args.corpus_revision)));
 return server;
}
