import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {dirname,join,relative,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'parse5';
import {footerPages,guidePages,renderFooter,renderContactPanel} from './footer-template.mjs';
import {buildEnglishPages} from './build-search-locales.mjs';
import {englishPages} from './seo.mjs';

const site=join(dirname(fileURLToPath(import.meta.url)),'..');
const check=process.argv.includes('--check');
const localizedPages=new Set(Object.values(englishPages).map(page=>page.file));

function replaceRegion(source,name,html,page) {
  const start=`<!-- shared-${name}:start -->`,end=`<!-- shared-${name}:end -->`;
  if(source.split(start).length!==2||source.split(end).length!==2||source.indexOf(start)>source.indexOf(end)) {
    throw new Error(`${page}: expected one ordered shared-${name} region.`);
  }
  return source.slice(0,source.indexOf(start))+html+source.slice(source.indexOf(end)+end.length);
}

function hasStandardFooter(node) {
  if(node.tagName==='footer'&&node.attrs.some(attr=>attr.name==='class'&&attr.value.split(/\s+/).includes('footer')))return true;
  return (node.childNodes||[]).some(hasStandardFooter);
}

// Discover existing standard footers as well as checking the explicit page list.
// Independent tools use their own footer classes and are not rewritten.
for(const file of readdirSync(site,{recursive:true}).filter(file=>file.endsWith('.html'))) {
  const page=file.split(sep).join('/'),source=readFileSync(join(site,file),'utf8');
  const hasFooter=hasStandardFooter(parse(source));
  if(hasFooter&&!footerPages.includes(page)&&!localizedPages.has(page)) {
    throw new Error(`${page}: standard footer is not registered in footerPages.`);
  }
}
for(const page of footerPages) {
  const file=join(site,page),source=readFileSync(file,'utf8');
  const assetPrefix=relative(dirname(file),site).split(sep).join('/');
  let output=replaceRegion(source,'footer',renderFooter(assetPrefix ? assetPrefix+'/' : ''),page);
  output=replaceRegion(output,'contact',renderContactPanel(),page);
  if((output.match(/<footer\b/g)||[]).length!==1||(output.match(/data-contact-popover\b/g)||[]).length!==1) {
    throw new Error(`${page}: expected one footer and contact panel.`);
  }
  if(check||guidePages.includes(page)) {
    if(output!==source)throw new Error(`${page}: stale shared footer; run npm run build:footer.`);
  } else if(output!==source)writeFileSync(file,output);
}
// The derived pages carry localized copies of the same checked footer and contact regions.
buildEnglishPages(check);
console.log(`${check?'Checked':'Generated'} shared footer: ${footerPages.length + localizedPages.size} pages.`);
