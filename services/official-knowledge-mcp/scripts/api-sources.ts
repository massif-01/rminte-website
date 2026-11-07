import { readFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { repository } from './sources.ts';
import type { LoadedSource } from './sources.ts';

export const apiDirectory = 'website/guides/content/api';
export async function loadApiSources(root=repository):Promise<LoadedSource[]> {
 const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const prepared_on=execFileSync('git',['show','-s','--format=%cs','HEAD'],{cwd:root,encoding:'utf8'}).trim();
 const sources:LoadedSource[]=[];const versions:string[]=[];
 for(const language of ['zh','en']) {
  const directory=resolve(root,apiDirectory,language);
  const readme=await readFile(resolve(directory,'README.md'),'utf8');
  const version=/\*\*TianshanOS (\d+\.\d+\.\d+)\*\*/.exec(readme)?.[1];
  if(!version)throw Error('API guide version missing: '+language);
  versions.push(version);
  // The long reference/README table repeats every endpoint; pdf-index keeps its calling instructions.
  const files=(await readdir(directory,{recursive:true})).filter(file=>file.endsWith('.md')&&file!=='reference/README.md').sort();
  for(const file of files) {
   const path=`${apiDirectory}/${language}/${file}`;
   const body=(await readFile(resolve(root,path),'utf8')).replaceAll('\r\n','\n');
   const title=/^# (.+)$/m.exec(body)?.[1];if(!title)throw Error('API guide title missing: '+path);
   sources.push({doc:{id:'api-'+file.slice(0,-3).replaceAll('/','-').toLowerCase(),language,title,path,
    sha256:createHash('sha256').update(body).digest('hex'),source_commit:commit,prepared_on,
    content_kind:'operating-instructions',applicability:'TianshanOS '+version,version,source_date:null,
    source_files:[path],source_urls:['https://rminte.com/guides/api?lang='+language,`https://github.com/RMinte/rminte-website/blob/${commit}/${path}`],
    default_retrieval:true,evidence_status:'official API documentation; not device or integration verification'},
    lines:body.split('\n'),offset:0,lineOffset:0});
  }
 }
 if(versions[0]!==versions[1])throw Error('API guide language version mismatch');
 return sources;
}
