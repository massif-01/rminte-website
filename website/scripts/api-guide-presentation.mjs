const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const apiCopy = {
 zh:{toc:'筛选目录',overview:'本章概览',filter:'按接口名或功能筛选',count:'{n} 个接口',empty:'没有匹配的接口',tocEmpty:'没有匹配的目录项'},
 en:{toc:'Filter contents',overview:'Chapter overview',filter:'Filter by API name or function',count:'{n} APIs',empty:'No matching APIs',tocEmpty:'No matching sections'},
 ja:{toc:'目次を絞り込む',overview:'章の概要',filter:'API 名や機能で絞り込む',count:'{n} 件の API',empty:'一致する API はありません',tocEmpty:'一致する項目はありません'},
 ko:{toc:'목차 필터',overview:'장 개요',filter:'API 이름 또는 기능으로 필터',count:'API {n}개',empty:'일치하는 API가 없습니다',tocEmpty:'일치하는 목차 항목이 없습니다'},
 es:{toc:'Filtrar el índice',overview:'Introducción del capítulo',filter:'Filtrar por nombre o función de la API',count:'{n} API',empty:'No hay API que coincidan',tocEmpty:'No hay secciones que coincidan'},
 fr:{toc:'Filtrer le sommaire',overview:'Présentation du chapitre',filter:'Filtrer par nom ou fonction de l’API',count:'{n} API',empty:'Aucune API correspondante',tocEmpty:'Aucune section correspondante'}
};

// Format explanatory text only. Fenced examples, inline literals and link targets
// remain byte-for-byte intact; the original Markdown remains the content source.
export function formatApiMarkdown(source,lang,fields) {
 let fence=false;
 const technical = /(?:https?:\/\/[^\s`<>"，。；）]+|\/(?:api|sdcard|spiffs|www)[\w./<>-]*|\b[A-Za-z_][\w.]*(?:\/[A-Za-z_][\w.]*)+\b|\b[\w-]+\.(?:json|txt|bin|py|js|tscfg|pem)\b|\b[A-Za-z_][\w]*(?:\.[A-Za-z_][\w]*)*\(\)|\b[A-Za-z_$][\w$]*(?:\.[A-Za-z_][\w]*)+\b|\b[A-Za-z_][\w]*_[\w]+\b|\b[a-z]+[A-Z][\w]*\b|\b[A-Za-z_][\w.]*(?:=|:)(?:true|false|null|[\w.-]+)|\b(?:ROOT|ADMIN|READ|WRITE|PUBLIC|BODY TOKEN|ERROR|WARN|INFO|DEBUG|VERBOSE|NONE|GET|POST|PUT|DELETE|Authorization|Content-Type|curl|python3|umask|unset|true|false|null|tscfg|rpm|duty|0xRRGGBB)\b)/g;
 function prose(s) {
  // Chinese prose needs boundaries around Latin text; literal code is protected.
  if(lang==='zh')s=s.replace(/([\p{Script=Han}])([A-Za-z0-9])/gu,'$1 $2').replace(/([A-Za-z0-9%])([\p{Script=Han}])/gu,'$1 $2');
  s=s.replace(technical,m=>['e.g','i.e','Socket.IO'].includes(m)?m:m.includes('/')&&!m.startsWith('/')&&!m.includes('://')?m.split('/').map(x=>'`'+x+'`').join(' / '):'`'+m+'`');
  if(['zh','ja','ko'].includes(lang))s=s.split(/(`[^`]+`)/g).map(t=>t.startsWith('`')?t:t.replace(/\b[A-Za-z_][A-Za-z0-9_]*\b/g,m=>fields.has(m)?'`'+m+'`':m)).join('');
  return s;
 }
 return source.split('\n').map(line=>{
  if(line.startsWith('```')){fence=!fence;return line;}
  if(fence||/^#{1,5}\s/.test(line)||/^\|[\s:|\-]+$/.test(line))return line;
  // A parameter table's first column is an identifier, including simple names
  // such as id/value that would be ordinary words in English prose.
  if(line.startsWith('|'))line=line.replace(/^(\|\s*)([^|]+)(\|)/,(_,start,cell,end)=>start+cell.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map(part=>part.startsWith('`')||part.startsWith('[')?part:part.replace(/(?<![\w.])\b[a-z][A-Za-z0-9_]*\b(?![\w.])/g,word=>fields.has(word)?'`'+word+'`':word)).join('')+end);
  const result=line.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map(part=>{
   if(part.startsWith('`'))return part;
   const link=part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);return link?'['+prose(link[1])+']('+link[2]+')':prose(part);
  }).join('');
  return lang==='zh'?result.replace(/`[^`]+`/g,(literal,offset)=>
   (/\p{Script=Han}/u.test(result[offset-1]||'')?' ':'')+literal+(/\p{Script=Han}/u.test(result[offset+literal.length]||'')?' ':'')
  ):result;
 }).join('\n');
}

export function apiToc(headings,lang) {
 const copy=apiCopy[lang],groups=[];
 for(const h of headings){if(h.level===2)groups.push({heading:h,children:[]});else if(h.level===3)groups.at(-1).children.push(h);}
 const link=h=>`<a class="toc-link toc-depth-1" href="#${h.id}" data-toc-target="${h.id}">${escape(h.text.replaceAll('`',''))}</a>`;
 return `<div data-api-toc><label class="api-filter api-toc-filter"><span>${copy.toc}</span><input type="search" data-api-toc-filter autocomplete="off"></label><p class="api-filter-empty" data-api-toc-empty hidden>${copy.tocEmpty}</p>${groups.map(({heading:h,children})=>`<details class="api-toc-group" data-toc-chapter="${h.id}"><summary>${escape(h.text.replaceAll('`',''))}</summary><a class="toc-link toc-depth-1" href="#${h.id}" data-toc-target="${h.id}">${copy.overview}</a>${children.map(link).join('')}</details>`).join('')}</div>`;
}

export function apiLocator(groups,lang) {
 const copy=apiCopy[lang],count=groups.reduce((sum,group)=>sum+group.entries.length,0);
 return `<section class="api-locator" data-api-locator data-count-label="${escape(copy.count)}" data-empty-label="${escape(copy.empty)}"><label class="api-filter"><span>${copy.filter}</span><input type="search" data-api-filter autocomplete="off"></label><p class="api-filter-status" data-api-filter-status role="status">${copy.count.replace('{n}',count)}</p>${groups.map(group=>`<details class="api-index-group"><summary><span>${escape(group.title)}</span><span data-api-group-count>${group.entries.length}</span></summary><ul class="api-index-list">${group.entries.map(api=>`<li data-api-entry><a href="#${api.id}"><code>${escape(api.name)}</code><span>${escape(api.purpose)}</span></a><span class="api-access">${escape(api.access)}</span></li>`).join('')}</ul></details>`).join('')}</section>`;
}
