import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {join,resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {configuredFiles,readJsonc,caseResources} from './config.mjs';
import {workerPageManifest,workerPages,readWorkerPages,htmlPage} from './pages.mjs';

export const owner = 'massif-01';
export const pages = [
  {id:'home', path:'/', file:'website/index.html', regions:['#hero','#engine','#teardown','#thermal','#sapphire','#craft']},
  {id:'gallery', path:'/gallery/', file:'website/gallery/index.html', regions:['body']},
  {id:'models', path:'/models/', file:'website/models/index.html', regions:['body']},
  {id:'cases', path:'/cases/', file:'website/cases/index.html', regions:['body']},
  {id:'sample-admin',path:'/sample-loan/',file:'website/sample-loan/index.html',regions:['body'],languages:['zh'],contentRoot:'body'},
  {id:'admin', path:'/admin/', file:'website/admin/index.html', regions:['main'],languages:['zh']},
  {id:'downloads', path:'/downloads/', file:'website/downloads/index.html', regions:['body']},
  {id:'guides', path:'/guides/', file:'website/guides/index.html', regions:['body']},
  ...['admin','root','security','network'].map(id => ({id:`guide-${id}`,path:`/guides/${id}`,file:`website/guides/${id}.html`,regions:['body']})),
  {id:'lamp', path:'/tools/emoji2pixel/', file:'website/tools/emoji2pixel/index.html', regions:['body'],languages:['zh','en']}
];

export function git(root, ...args) {
  return execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:'pipe',maxBuffer:10_000_000});
}

export function parseChanges(output) {
  const parts=output.split('\0'), changes=[];
  for(let i=0;i<parts.length && parts[i];) {
    const status=parts[i++];
    const paths=/^[RC]/.test(status) ? [parts[i++],parts[i++]] : [parts[i++]];
    if(paths.some(path=>!path)) throw new Error('Incomplete Git name-status record');
    changes.push({status,paths});
  }
  return changes;
}

export function changedPaths(root,base,head) {
  return parseChanges(git(root,'diff','--name-status','-z','-M','--merge-base',base,head,'--'));
}

export function readDemos(root) {
  const resources=caseResources(root);
  const entries=Object.entries(resources).filter(([,resource])=>resource.demoPath||resource.demoUrl);
  const config='services/case-demos/wrangler.jsonc';
  if(!existsSync(join(root,config))) {
    if(entries.some(([,r])=>r.demoPath)||existsSync(join(root,'services/case-demos/cases')))throw new Error('Case demos need their Worker configuration and website resource entries.');
  }
  const assets=existsSync(join(root,config))?resolve(root,dirname(config),readJsonc(root,config).assets.directory):null;
  const demos=entries.map(([id,resource])=>{
    if(resource.demoUrl)return {id,kind:'website',src:resource.demoUrl,files:[],route:`/api/resources/${id}/demo`};
    const scenario=`tests/browser/demos/${id}.mjs`;
    if(!existsSync(join(root,scenario)))throw new Error(`Demo ${id}: add its main click flow in ${scenario}.`);
    const directory=resolve(assets,'.'+resource.demoPath);
    if(!directory.startsWith(assets+'/')||!existsSync(join(directory,'index.html')))throw new Error(`Demo ${id}: missing index.html in its deployed assets directory.`);
    const prefix=relative(root,directory)+'/';
    const files=git(root,'ls-files','--cached','--others','--exclude-standard','-z','--',prefix).split('\0').filter(file=>file&&existsSync(join(root,file))).map(file=>file.slice(prefix.length)).sort();
    return {id,kind:'private',directory:relative(root,directory),assetPath:resource.demoPath,scenario,route:`/api/resources/${id}/demo`,files};
  });
  for(const folder of (assets?readdirSync(assets,{withFileTypes:true}):[]).filter(entry=>entry.isDirectory())) {
    if(!demos.some(demo=>demo.kind==='private'&&resolve(root,demo.directory)===join(assets,folder.name,'public')))throw new Error(`Demo directory ${folder.name}: connect its website entry in services/case-access/resources.mjs.`);
  }
  return demos;
}

const infrastructure = path => /^(?:\.github\/workflows\/|scripts\/ci\/|tests\/browser\/|playwright\.config\.|package(?:-lock)?\.json$)/.test(path);
const document = path => /^(?:docs\/|design-preview\/|copy-review\/|output\/)/.test(path)
  || (/\.md$/i.test(path) && !path.startsWith('website/') && path!=='DESIGN.md')
  || ['.gitignore','.github/CODEOWNERS','.github/pull_request_template.md'].includes(path);

export function classify(changes,{all=false,staticRoutes=[],workerRoutes=[]}={}) {
  const files=[...new Set(changes.flatMap(change=>change.paths))].sort();
  const destinations=new Set();
  for(const change of changes) {
    if(/^[DR]/.test(change.status))destinations.delete(change.paths[0]);
    if(!change.status.startsWith('D'))destinations.add(change.paths.at(-1));
  }
  const ids=new Set(), languages=new Set(['zh','en']), routes=new Map();
  const catalog=pages.map(page=>({...page}));
  for(const route of staticRoutes)if(!catalog.some(page=>page.path===route.path))catalog.push({...route});
  for(const route of workerRoutes) {
    const existing=catalog.find(page=>page.path===route.path);
    if(existing)existing.dependencies=[...(existing.dependencies||[]),...route.dependencies];
    else catalog.push({...route});
  }
  const scope={files,changes,pages:[],languages:[],widths:[1440,390],fonts:false,brand:false,exif:false,guides:false,translations:false,seo:false,caseService:false,sampleLoan:false,caseMigrations:false,ota:false,knowledgeMcp:false,infrastructure:false,homeMotion:false,configurationFiles:[],navigationAll:false};
  const addAll=()=>{catalog.forEach(page=>ids.add(page.id));scope.widths=[1440,768,390,320];};
  const guidePages=()=>pages.filter(page=>page.id.startsWith('guide')).forEach(page=>ids.add(page.id));
  if(changes.some(change=>/^[DR]/.test(change.status)&&/\.html?$/i.test(change.paths[0])))scope.navigationAll=true;
  for(const file of files) {
    for(const page of catalog)if(page.dependencies?.some(input=>input.endsWith('/')?file.startsWith(input):file===input)){ids.add(page.id);scope.fonts=true;}
    if(file===workerPageManifest) {workerRoutes.forEach(route=>ids.add(catalog.find(page=>page.path===route.path).id));scope.fonts=true;scope.navigationAll=true;continue;}
    if(file.startsWith('services/official-knowledge-mcp/')||file.startsWith('docs/official-knowledge/')||/^website\/guides\/content\/(?:admin|root|network|security\.(?:zh|en))\.md$/.test(file)) scope.knowledgeMcp=true;
    if(file.startsWith('services/official-knowledge-mcp/')) {
      if(destinations.has(file)&&configuredFiles.has(file))scope.configurationFiles.push(file);
      continue;
    }
    if(document(file)) continue;
    if(infrastructure(file)) {scope.infrastructure=true;addAll();Object.assign(scope,{fonts:true,brand:true,exif:true,guides:true,translations:true,seo:true,caseService:true,sampleLoan:true,caseMigrations:true,ota:true,knowledgeMcp:true,homeMotion:true,navigationAll:true});continue;}
    if(destinations.has(file)&&(configuredFiles.has(file)||/(?:^|\/)wrangler\.(?:jsonc?|toml)$/.test(file)))scope.configurationFiles.push(file);
    if(configuredFiles.get(file)?.kind==='d1') {scope.caseMigrations=true;continue;}
    if(file.startsWith('website/')&&/\.html?$/i.test(file)&&file!=='website/404.html'&&!pages.some(page=>page.file===file)) {
      const route=htmlPage(file),existing=catalog.find(page=>page.path===route.path);
      if(existing) {existing.file=file;ids.add(existing.id);}else {routes.set(route.id,route);ids.add(route.id);}
      scope.fonts=true;
      continue;
    }
    if(file==='DESIGN.md'||file==='website/DESIGN.md') {addAll();continue;}
    if(file.startsWith('services/tianshanos-ota/')||file==='scripts/sync-tianshanos-release.mjs') {scope.ota=true;scope.fonts=true;continue;}
    if(file.startsWith('services/sample-loan/')){scope.sampleLoan=true;scope.caseService=true;scope.fonts=true;ids.add('sample-admin');ids.add('cases');continue;}
    if(file.startsWith('website/sample-loan/')){scope.sampleLoan=true;scope.fonts=true;['sample-admin','home','cases','downloads'].forEach(id=>ids.add(id));scope.widths=[1440,768,390,320];['ja','ko','es','fr'].forEach(lang=>languages.add(lang));continue;}
    if(file.startsWith('services/case-access/')||file.startsWith('services/case-demos/')) {scope.caseService=true;if(file.startsWith('services/case-access/migrations/'))scope.caseMigrations=true;ids.add('cases');ids.add('admin');continue;}
    if(file==='scripts/build-service-brand.mjs') {scope.brand=true;scope.ota=true;continue;}
    if(/(?:seo|_worker\.js|_routes\.json|_headers|_redirects|404\.html|robots\.txt|sitemap\.xml)/.test(file)) {scope.seo=true;scope.navigationAll=true;addAll();if(file.endsWith('_worker.js'))scope.caseService=true;continue;}
    if(file.startsWith('website/scripts/')) {
      if(file.includes('build-fonts')) {scope.fonts=true;addAll();}
      else if(file.includes('gallery-exif')) {scope.exif=true;ids.add('gallery');}
      else if(file.includes('build-guides')) {scope.guides=true;guidePages();}
      else if(/(?:translations|i18n)/.test(file)) {scope.translations=true;addAll();}
      else addAll();
      continue;
    }
    if(!file.startsWith('website/')) throw new Error(`No CI scope for ${file}; classify this path explicitly.`);
    scope.fonts=true;
    const locale=file.match(/(?:translations\/|locales\/)(ja|ko|es|fr)\.(?:js|json)$/)?.[1]||file.match(/\.(ja|ko|es|fr)\.md$/)?.[1];
    if(locale) languages.add(locale);
    if(/website\/(?:locales\/|assets\/translations\/)/.test(file)) {scope.translations=true;addAll();continue;}
    if(/website\/assets\/(?:brand\.css|styles\.css|motion\.js|i18n\.js|site-data\.js|footer\.js|fonts\/)/.test(file)) {
      addAll();scope.homeMotion=true;
      if(/(?:brand\.css|fonts\/)/.test(file)) {scope.brand=true;scope.ota=true;}
      if(file.endsWith('site-data.js')) {scope.guides=true;scope.translations=true;}
      if(file.endsWith('i18n.js')) ['ja','ko','es','fr'].forEach(lang=>languages.add(lang));
      continue;
    }
    if(file.startsWith('website/guides/')||file.startsWith('website/assets/guides')) {scope.guides=true;guidePages();continue;}
    if(/website\/(?:gallery\/|assets\/gallery)/.test(file)) {ids.add('gallery');if(/\.(?:jpg|jpeg)$/i.test(file)){scope.exif=true;ids.add('home');scope.homeMotion=true;}continue;}
    if(/website\/(?:downloads\/|assets\/downloads)/.test(file)) {ids.add('downloads');continue;}
    if(file.startsWith('website/models/')) {ids.add('models');continue;}
    if(file.startsWith('website/cases/')) {ids.add('cases');continue;}
    if(file.startsWith('website/admin/')) {ids.add('admin');continue;}
    if(/website\/assets\/case-(?:ui|auth)/.test(file)) {ids.add('cases');ids.add('admin');continue;}
    if(file.startsWith('website/tools/emoji2pixel/')) {ids.add('lamp');continue;}
    if(file==='website/index.html'||/website\/assets\/(?:main\.js|engine|system|images\/|videos\/|teardown-frames)/.test(file)) {ids.add('home');scope.homeMotion=true;continue;}
    addAll();scope.homeMotion=true; // Unknown production assets can also affect normal homepage motion.
  }
  if(all) {addAll();Object.assign(scope,{fonts:true,brand:true,exif:true,guides:true,translations:true,seo:true,caseService:true,sampleLoan:true,caseMigrations:true,ota:true,knowledgeMcp:true,homeMotion:true,infrastructure:true,navigationAll:true});}
  // A removed URL can still be linked by unchanged JavaScript-rendered navigation.
  if(scope.navigationAll)catalog.forEach(page=>ids.add(page.id));
  scope.pages=[...catalog,...routes.values()].filter(page=>ids.has(page.id)).map(page=>({...page}));
  for(const page of scope.pages)for(const language of page.languages||[])languages.add(language);
  scope.languages=[...languages];
  scope.reason=scope.pages.length ? 'Browser checks follow the changed production dependencies.' : 'No affected website UI; screenshots are not applicable.';
  return scope;
}

export function context(root,{base,head,all=false}={}) {
  const event=process.env.GITHUB_EVENT_PATH ? JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')) : {};
  const pr=event.pull_request;
  base ||= pr?.base.sha || 'origin/main';
  head ||= pr?.head.sha || 'HEAD';
  const changes=changedPaths(root,base,head);
  if(!process.env.CI) {
    changes.push(...parseChanges(git(root,'diff','--name-status','-z','-M','HEAD','--')));
    for(const file of git(root,'ls-files','--others','--exclude-standard','-z').split('\0').filter(Boolean)) changes.push({status:'A',paths:[file]});
  }
  const baseSha=git(root,'rev-parse',base).trim();
  const baseFiles=new Set(git(root,'ls-tree','-r','--name-only','-z',baseSha).split('\0'));
  const currentFiles=git(root,'ls-files','--cached','--others','--exclude-standard','-z','--','website').split('\0').filter(file=>/\.html?$/i.test(file)&&existsSync(join(root,file)));
  // The independent TianshanOS demo does not consume the main site's styles or language system.
  // Direct HTML changes still select it in classify(); shared-site changes keep their existing boundary.
  const staticRoutes=[...new Set([...baseFiles,...currentFiles])].filter(file=>file.startsWith('website/')&&/\.html?$/i.test(file)&&file!=='website/404.html'&&!file.startsWith('website/tianshanos-demo/')).map(htmlPage);
  const beforeRoutes=baseFiles.has(workerPageManifest)?workerPages(git(root,'show',`${baseSha}:${workerPageManifest}`)):[],afterRoutes=readWorkerPages(root);
  const scope=classify(changes,{all,staticRoutes,workerRoutes:[...beforeRoutes,...afterRoutes]});
  scope.pages=scope.pages.map(page=>{
    const sourceExists={before:page.file!==null&&baseFiles.has(page.file),after:page.file!==null&&existsSync(join(root,page.file))};
    return {...page,sourceExists,expected:{before:sourceExists.before||beforeRoutes.some(route=>route.path===page.path),after:sourceExists.after||afterRoutes.some(route=>route.path===page.path)}};
  });
  scope.caseService ||= scope.pages.some(page=>['cases','admin'].includes(page.id));
  scope.caseDemos=scope.caseService&&existsSync(join(root,'services/case-demos/wrangler.jsonc'));
  scope.demos=scope.caseService?readDemos(root):[];
  scope.pagePaths=[...new Set([...currentFiles.map(file=>htmlPage(file).path),...afterRoutes.map(route=>route.path)])];
  scope.navigationFiles=scope.navigationAll?[...new Set(currentFiles)]:[];
  return {schema:1,baseSha,headSha:git(root,'rev-parse',head).trim(),testSha:git(root,'rev-parse','HEAD').trim(),local:!process.env.CI,prNumber:pr?.number||null,author:pr?.user?.login||null,body:pr?.body||'',scope};
}

export function checkDescription({author,body}) {
  if(!author||author===owner) return 'Owner/local run: no mandatory review material.';
  for(const label of ['问题与原因','影响范围','验证结果','依据与限制']) {
    const match=body.match(new RegExp(`^## ${label}\\s*\n([\\s\\S]*?)(?=^## |$(?![\\s\\S]))`,'m'));
    const content=match?.[1].replace(/<!--[\s\S]*?-->/g,'').trim();
    if(!content||/^待填写|^TODO$/i.test(content)) throw new Error(`PR description missing: ${label}`);
  }
  return 'Contributor description fields are present; Owner judges their substance.';
}

if(process.argv[1]===fileURLToPath(import.meta.url)) {
  const run=context(process.cwd());
  console.log(JSON.stringify({pages:run.scope.pages.map(p=>p.path),languages:run.scope.languages,widths:run.scope.widths,reason:run.scope.reason}));
  if(process.env.GITHUB_OUTPUT)writeFileSync(process.env.GITHUB_OUTPUT,`browser=${run.scope.pages.length>0}\n`,{flag:'a'});
}
