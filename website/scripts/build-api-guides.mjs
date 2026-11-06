import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname, posix} from 'node:path';
import {formatApiMarkdown,apiToc,apiLocator} from './api-guide-presentation.mjs';

// Same chapter and reference-group order as the final 0.6.4 PDF.
const main = ['README','quickstart','devices','scenarios','conventions','response-models','configuration-models','websocket','transfers','operations','troubleshooting','compatibility','pdf-examples'];
const modules = ['auth','system','fan','temp','power','device','network','wifi','dhcp','nat','time','storage','service','monitor','ui','log','hosts','key','cert','ssh','sftp','automation','led','gpio','lpmu_access','config','config_pack','ota'];
const files = [...main.map(name=>name+'.md'),'reference/README.md',...modules.map(name=>'reference/'+name+'.md')];
const headingSlug = text => text.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_\-\s]/gu,'').trim().replace(/\s/g,'-');

export function buildApiGuides({guidesDir,languages,renderMarkdown,pageTemplate,buildSearchEntries,extendPairs}) {
 const base=join(guidesDir,'content/api');
 const documents={}, anchors={}, chapterKeys={}, titles={}, sources={};
 const fields=new Set(['string','integer','boolean','number','object','array']);
 for(const file of files) {
  const md=readFileSync(join(base,'en',file),'utf8');
  for(const literal of md.matchAll(/`([a-z][\w]*)`/g))fields.add(literal[1]);
 }
 for(const module of modules) {
  const md=readFileSync(join(base,'en/reference',module+'.md'),'utf8');
  for(const row of md.matchAll(/^\| ([^|]+) \|/gm))for(const token of row[1].replaceAll('`','').split(/\s*\/\s*/))if(/^[a-z][\w]*$/.test(token))fields.add(token);
 }
 // Read the public reference so the grouped locator shares its names and access labels.
 const apiEntries=modules.flatMap(module=>{
  const source=readFileSync(join(base,'en/reference',module+'.md'),'utf8');
  return [...source.matchAll(/^## ([\w.]+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)].map(match=>{
   const access=match[2].match(/\*\*Minimum access\*\*[^\n]*?:?\s*([^\n]+)/i);
   if(!access)throw new Error('Missing API access: '+match[1]);
   return {name:match[1],access:access[1].replace(/^[:：]\s*/,'').trim().replace(/^Body token.*$/,'BODY TOKEN').toUpperCase(),file:'reference/'+module+'.md'};
  });
 });
 if(apiEntries.length!==277)throw new Error(`Expected 277 APIs; found ${apiEntries.length}`);
 for(const lang of languages) {
  let number=0;chapterKeys[lang]=[];
  for(const file of files) {
   let source=readFileSync(join(base,lang,file==='reference/README.md'?'reference/pdf-index.md':file),'utf8').replace(/^<a\s+id="[^"]+"><\/a>\s*$/gm,'');
   sources[`${lang}/${file}`]=source;
   if(file==='README.md')titles[lang]=source.split('\n')[0].replace(/^#\s+/,'');
   const used=new Map();anchors[`${lang}/${file}`]={};let inCode=false,local=0;
   // Promote each source document to a chapter and keep every original body line.
   const lines=source.split('\n').map(line=>{
    if(line.startsWith('```')){inCode=!inCode;return line;}
    const heading=!inCode&&line.match(/^(#{1,4})\s+(.+)$/);
    if(!heading)return line;
    const raw=headingSlug(heading[2]), count=used.get(raw)||0;used.set(raw,count+1);
    const id=`${lang}-section-${++number}`;
    anchors[`${lang}/${file}`][raw+(count?'-'+count:'')]=id;
    if(local===0)anchors[`${lang}/${file}`]['']=id;
    chapterKeys[lang].push('c'+files.indexOf(file)+'s'+local++);
    return '#'+line;
   });
   documents[`${lang}/${file}`]=formatApiMarkdown(lines.join('\n'),lang,fields);
  }
 }
 const combined={},rendered={};
 for(const lang of languages) {
  combined[lang]=files.map(file=>{
   let inCode=false;
   return documents[`${lang}/${file}`].split('\n').map(line=>{
    if(line.startsWith('```')){inCode=!inCode;return line;}
    if(inCode)return line;
    return line.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(whole,label,href)=>{
     if(/^(?:https?:|mailto:)/.test(href))return whole;
     const [path,fragment='']=href.split('#');
     let target=path?posix.normalize(posix.join(dirname(file),path)):file;
     // The PDF includes the runnable examples in its examples chapter.
     if(target==='examples/README.md')target='pdf-examples.md';
     if(!target.endsWith('.md'))return `[${label}](content/api/${lang}/${target})`;
     const reference=lang==='zh'?'zh':'en';
     const id=anchors[`${reference}/${target}`]?.[decodeURIComponent(fragment)];
     if(!id)throw new Error(`Unresolved API link: ${lang}/${file} -> ${href}`);
     const localId=id.replace(/^(zh|en)-/,lang+'-');
     return `[${label}](#${localId})`;
    });
   }).join('\n');
  }).join('\n\n');
  rendered[lang]=renderMarkdown(combined[lang],lang);
  rendered[lang].toc=apiToc(rendered[lang].headings,lang);
  const groups=modules.map(module=>{
   const file='reference/'+module+'.md',source=sources[`${lang}/${file}`];
   return {title:source.split('\n')[0].replace(/^#\s+/,''),entries:apiEntries.filter(api=>api.file===file).map(api=>{
    const purpose=source.split('## '+api.name+'\n')[1]?.trim().split('\n')[0];
    if(!purpose)throw new Error('Missing API purpose: '+lang+'/'+api.name);
    return {...api,purpose,id:anchors[`${lang}/${file}`][headingSlug(api.name)]};
   })};
  });
  const firstReference=`<h2 id="${anchors[`${lang}/reference/${modules[0]}.md`]['']}"`;
  rendered[lang].html=rendered[lang].html.replace(firstReference,apiLocator(groups,lang)+firstReference);
  // Keep language switches in the same source chapter despite translated headings.
  rendered[lang].html=rendered[lang].html.replace(/data-heading-key="section-(\d+)"/g,(_,n)=>`data-heading-key="${chapterKeys[lang][Number(n)-1]}"`);
 }
 const config={accent:'api',crumb:{zh:'API 接入',en:'API integration'},label:{zh:'API 接入',en:'API integration'},title:titles,
  description:{zh:'TianshanOS 0.6.4 API 使用手册：快速接入、任务示例与完整接口参考。',en:'TianshanOS 0.6.4 API guide: quickstart, task examples, and complete API reference.'},
  chapterCount:{zh:'TianshanOS 0.6.4',en:'TianshanOS 0.6.4'},next:{href:'index.html',zh:'全部指南',en:'All guides'}};
 extendPairs(config);
 writeFileSync(join(guidesDir,'api.html'),pageTemplate(config,rendered).replace('class="support-theme"','class="support-theme api-guide"').replace('</head>','<script src="../assets/api-guide.js?v=api-readable-20261107" defer></script>\n</head>'));
 const entries=languages.flatMap(lang=>buildSearchEntries(combined[lang],lang,'api',config));
 console.log(`Built complete API guide (${files.length} PDF chapters, 277 APIs, ${languages.length} languages)`);
 return entries;
}
