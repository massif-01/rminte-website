import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,mkdirSync,rmSync,cpSync,readFileSync,symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {changedPaths,classify,checkDescription,readDemos,git,context as getContext} from './scope.mjs';
import {checkHtml,checkCss,syntax,generatedCheck,staticChecks} from './static.mjs';
import {validateEvidence,gateResult} from './report.mjs';
import {workerPageManifest,workerPages} from './pages.mjs';
import {observeRoute,routeEvidence,checkNavigation} from './routes.mjs';
import {createServer} from 'node:http';
import {footerPages} from '../../website/scripts/footer-template.mjs';

test('footer CLI checks parsed class tokens rather than HTML quote style or text lookalikes',()=>{
  const root=mkdtempSync(join(tmpdir(),'rminte-footer-'));
  try {
    for(const file of [...footerPages,'scripts/build-footer.mjs','scripts/footer-template.mjs','assets/site-data.js']) {
      const target=join(root,'website',file);mkdirSync(dirname(target),{recursive:true});cpSync(join('website',file),target);
    }
    symlinkSync(resolve('node_modules'),join(root,'node_modules'),'dir');
    const check=()=>spawnSync(process.execPath,['website/scripts/build-footer.mjs','--check'],{cwd:root,encoding:'utf8'});
    const baseline=check();assert.equal(baseline.status,0,baseline.stderr);
    const page=join(root,'website/new-page.html');
    for(const source of [
      '<footer class="footer">Old footer</footer>',
      "<footer class='footer'>Old footer</footer>",
      '<footer class=footer>Old footer</footer>',
      '<FOOTER CLASS="other footer\tcompact">Old footer</FOOTER>'
    ]) {
      writeFileSync(page,source);const result=check();
      assert.equal(result.status,1,source);assert.match(result.stderr,/new-page\.html: standard footer is not registered/);
    }
    for(const source of [
      '<footer class="brand-footer">Independent footer</footer>',
      '<!-- <footer class="footer">Example</footer> -->',
      '<script>const example = \'<footer class="footer">Example</footer>\';</script>'
    ]) {
      writeFileSync(page,source);const result=check();assert.equal(result.status,0,result.stderr);
    }
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('real divergent history classifies only the PR change, including renames and deletion',()=>{
  const root=mkdtempSync(join(tmpdir(),'rminte-git-'));
  try {
    git(root,'init','-b','main');git(root,'config','user.name','CI Fixture');git(root,'config','user.email','ci@example.invalid');
    writeFileSync(join(root,'README.md'),'initial\n');mkdirSync(join(root,'website/assets'),{recursive:true});writeFileSync(join(root,'website/assets/brand.css'),'a{color:white}\n');
    git(root,'add','README.md','website');git(root,'commit','-m','base');const common=git(root,'rev-parse','HEAD').trim();
    writeFileSync(join(root,'website/assets/main.js'),'console.log("main only")');git(root,'add','website');git(root,'commit','-m','main advances');const base=git(root,'rev-parse','HEAD').trim();
    git(root,'switch','-c','contributor',common);writeFileSync(join(root,'README.md'),'docs PR\n');git(root,'add','README.md');git(root,'commit','-m','docs');
    const changes=changedPaths(root,base,'HEAD');assert.deepEqual(changes,[{status:'M',paths:['README.md']}]);assert.equal(classify(changes).pages.length,0);
    git(root,'mv','website/assets/brand.css','website/assets/other.css');git(root,'commit','-m','rename');
    const renamed=changedPaths(root,base,'HEAD');assert.ok(renamed.some(c=>c.status.startsWith('R')&&c.paths.includes('website/assets/brand.css')));assert.equal(classify(renamed).brand,true);
    git(root,'rm','website/assets/other.css');git(root,'commit','-m','delete');assert.equal(classify(changedPaths(root,base,'HEAD')).brand,true);
    assert.throws(()=>changedPaths(root,'missing-ref','HEAD'));
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('production Markdown, shared dependencies and new production files cannot use the documentation exemption',()=>{
  assert.equal(classify([{status:'M',paths:['website/guides/content/admin.md']}]).guides,true);
  assert.equal(classify([{status:'M',paths:['website/assets/brand.css']}]).pages.length,13);
  const sample=classify([{status:'M',paths:['services/sample-loan/commands.mjs']}]);
  assert.equal(sample.sampleLoan,true);assert.ok(sample.pages.some(p=>p.id==='sample-admin'));
  const unknown=classify([{status:'A',paths:['website/new-feature/unknown.js']}]);
  assert.equal(unknown.pages.length,13);assert.equal(unknown.homeMotion,true);
  const translated=classify([{status:'M',paths:['website/assets/translations/fr.js']}]);
  assert.ok(translated.languages.includes('fr'));
  assert.deepEqual(translated.pages.find(page=>page.id==='lamp').languages,['zh','en']);
  const standalone=classify([{status:'M',paths:['website/tianshanos-demo/system.html']}]).pages.find(page=>page.file==='website/tianshanos-demo/system.html');
  assert.deepEqual(standalone.languages,['zh','en']);assert.equal(standalone.contentRoot,'body');
  assert.equal(classify([{status:'M',paths:['docs/example.md']}]).pages.length,0);
  assert.equal(classify([{status:'M',paths:['services/case-access/README.md']}]).pages.length,0);
  assert.equal(classify([{status:'M',paths:['services/case-demos/cases/example/public/app.js']}]).caseService,true);
  assert.equal(classify([{status:'M',paths:['services/case-demos/README.md']}]).pages.length,0);
  assert.equal(classify([{status:'M',paths:['scripts/ci/README.md']}]).infrastructure,false);
  assert.throws(()=>classify([{status:'A',paths:['unclassified-code.py']}]),/No CI scope/);
});

test('Owner has no mandatory review material; an empty contributor description is rejected',()=>{
  assert.doesNotThrow(()=>checkDescription({author:'massif-01',body:''}));
  assert.throws(()=>checkDescription({author:'contributor',body:'## 问题与原因\n<!-- comment only -->'}),/missing/);
  assert.doesNotThrow(()=>checkDescription({author:'contributor',body:['问题与原因','影响范围','验证结果','依据与限制'].map(s=>`## ${s}\n真实说明\n`).join('\n')}));
});

test('actual malformed JavaScript, CSS and missing referenced resources are rejected',()=>{
  assert.throws(()=>syntax('function broken(', 'bad.js'));
  const root=mkdtempSync(join(tmpdir(),'rminte-resources-'));
  try {
    mkdirSync(join(root,'website'));writeFileSync(join(root,'website/index.html'),'<script src="missing.js"></script>');assert.throws(()=>checkHtml(root,'website/index.html'),/missing local resource/);
    writeFileSync(join(root,'website/index.html'),'<script>function broken(</script>');assert.throws(()=>checkHtml(root,'website/index.html'));
    writeFileSync(join(root,'website/bad.css'),'a { color: red;');assert.throws(()=>checkCss(root,'website/bad.css'));
    writeFileSync(join(root,'operational.jsonc'),'{"d1_databases": [');
    assert.throws(()=>staticChecks(root,{files:['operational.jsonc'],pages:[]}),/invalid JSONC/);
    writeFileSync(join(root,'operational.jsonc'),'{ /* JSONC uses comments and trailing commas */ "value": 1, }');
    assert.doesNotThrow(()=>staticChecks(root,{files:['operational.jsonc'],pages:[]}));
    writeFileSync(join(root,'website/index.html'),'<main><a href="/dynamic/">Relative</a><a href="https://rminte.com/dynamic/">Canonical origin</a><a href="https://example.invalid/dynamic/">External</a><a href="/portal.php">Worker</a><a href="/report.v2">Versioned route</a><a href="/guide.pdf" download>Download</a></main>');
    assert.deepEqual(checkHtml(root,'website/index.html'),['/dynamic/','/portal.php','/report.v2','/guide.pdf']);
    writeFileSync(join(root,'website/index.html'),'<img src="/portal.php">');
    assert.throws(()=>checkHtml(root,'website/index.html'),/missing local resource/);
    mkdirSync(join(root,'services/case-demos/cases/example/public'),{recursive:true});
    writeFileSync(join(root,'services/case-demos/cases/example/public/index.html'),'<main><a href="./">Demo</a></main><script type="module" src="./app.js"></script>');
    writeFileSync(join(root,'services/case-demos/cases/example/public/app.js'),'const value=1;export{value};');
    assert.deepEqual(checkHtml(root,'services/case-demos/cases/example/public/index.html'),[]);
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('the real font checker rejects a newly introduced Chinese character',()=>{
  const root=mkdtempSync(join(tmpdir(),'rminte-font-'));
  try {
    mkdirSync(join(root,'website/scripts'),{recursive:true});mkdirSync(join(root,'website/assets'),{recursive:true});
    cpSync('website/assets/fonts',join(root,'website/assets/fonts'),{recursive:true});cpSync('website/scripts/build-fonts.py',join(root,'website/scripts/build-fonts.py'));
    const have=readFileSync('website/assets/fonts/noto-sans-sc.chars.txt','utf8');let cp=0x4e00;while(have.includes(String.fromCodePoint(cp)))cp++;
    writeFileSync(join(root,'website/index.html'),`<p>${String.fromCodePoint(cp)}</p>`);
    const result=spawnSync('python3',['website/scripts/build-fonts.py','--check'],{cwd:root,encoding:'utf8'});
    assert.equal(result.status,1);assert.match(result.stdout,/not in the subset/);assert.ok(result.stdout.includes(String.fromCodePoint(cp)));
    writeFileSync(join(root,'website/index.html'),'<main>Page</main>');mkdirSync(join(root,'tests/browser'),{recursive:true});
    writeFileSync(join(root,'page.mjs'),`export const text="${String.fromCodePoint(cp)}";`);writeFileSync(join(root,workerPageManifest),JSON.stringify([{path:'/generated',dependencies:['page.mjs']}]));
    const worker=spawnSync('python3',['website/scripts/build-fonts.py','--check'],{cwd:root,encoding:'utf8'});
    assert.equal(worker.status,1);assert.match(worker.stdout,/used in page.mjs but not in the subset/);
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('generated-output check detects stale files without changing the checkout',()=>{
  const root=mkdtempSync(join(tmpdir(),'rminte-derived-'));
  try {
    mkdirSync(join(root,'website'));writeFileSync(join(root,'website/generate.mjs'),'import {writeFileSync} from "node:fs";writeFileSync(new URL("output.js",import.meta.url),"fresh");');
    writeFileSync(join(root,'website/output.js'),'stale');
    assert.throws(()=>generatedCheck(root,'website/generate.mjs',['website/output.js']),/stale generated/);assert.equal(readFileSync(join(root,'website/output.js'),'utf8'),'stale');
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('evidence for another Head, missing screenshots and altered image bytes fail the gate',()=>{
  const root=mkdtempSync(join(tmpdir(),'rminte-evidence-')),directory=join(root,'output/ci/evidence');
  try {
    mkdirSync(join(directory,'records'),{recursive:true});
    const context={baseSha:'base',headSha:'head',testSha:'merge',scope:{pages:[{id:'gallery',regions:['main']}],languages:['en'],widths:[390]}};
    writeFileSync(join(directory,'manifest.json'),JSON.stringify({...context,headSha:'old'}));assert.throws(()=>validateEvidence(root,context),/headSha/);
    writeFileSync(join(directory,'manifest.json'),JSON.stringify(context));assert.throws(()=>validateEvidence(root,context),/Required screenshot missing/);
    const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aK1cAAAAASUVORK5CYII=','base64');
    writeFileSync(join(directory,'image.png'),bytes);
    const records=['before','after'].map(phase=>({kind:'page',status:200,phase,page:'gallery',language:'en',width:390,region:'main',file:'image.png',sha256:createHash('sha256').update(bytes).digest('hex')}));
    writeFileSync(join(root,'output/ci/browser-results.json'),JSON.stringify({stats:{skipped:0,unexpected:0,flaky:0},suites:[{title:'operations gallery en 390px',specs:[{tests:[{expectedStatus:'passed',results:[{status:'passed'}]}]}]}]}));
    writeFileSync(join(directory,'records/gallery.json'),JSON.stringify(records));assert.equal(validateEvidence(root,context).screenshots,2);
    context.scope.pages[0].sourceExists={before:true,after:false};context.scope.pages[0].expected={before:true,after:true};
    assert.equal(validateEvidence(root,context).screenshots,2); // HTTP 200 still needs real PNGs after its source file moves.
    context.scope.pages[0].expected.after=false;assert.throws(()=>validateEvidence(root,context),/Undeclared HTML page/);
    context.scope.pages[0].expected.after=true;
    writeFileSync(join(root,'output/ci/browser-results.json'),JSON.stringify({stats:{skipped:1},suites:[]}));assert.throws(()=>validateEvidence(root,context),/without skips/);
    writeFileSync(join(directory,'image.png'),Buffer.concat([bytes,Buffer.from('altered')]));assert.throws(()=>validateEvidence(root,context),/checksum/);
    assert.throws(()=>gateResult([{name:'browser',required:true,status:'cancelled'}]),/did not pass/);
    assert.throws(()=>gateResult([{name:'browser',required:true,status:'skipped'}]),/did not pass/);
    assert.doesNotThrow(()=>gateResult([{name:'browser',required:false,status:'not-applicable'}]));
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('scope retains the Base/Head page inventory and Worker inputs across additions and removals',()=>{
  const root=mkdtempSync(join(tmpdir(),'rminte-pages-'));
  try {
    git(root,'init','-b','main');git(root,'config','user.name','CI Fixture');git(root,'config','user.email','ci@example.invalid');
    writeFileSync(join(root,'README.md'),'base');git(root,'add','README.md');git(root,'commit','-m','base');const base=git(root,'rev-parse','HEAD').trim();
    for(const directory of ['website/new-feature','services/case-access','tests/browser'])mkdirSync(join(root,directory),{recursive:true});
    writeFileSync(join(root,'services/case-access/resources.mjs'),'export const resources = {};');
    writeFileSync(join(root,'website/new-feature/index.html'),'<main>New</main>');
    const input='services/case-access/page.mjs',entry={path:'/page.php',dependencies:[input]};
    writeFileSync(join(root,input),'export const text="Page"');writeFileSync(join(root,workerPageManifest),JSON.stringify([entry]));
    git(root,'add','website','services','tests');git(root,'commit','-m','add static and Worker pages');
    const added=getContext(root,{base,head:'HEAD'}).scope;
    assert.deepEqual(added.pages.find(page=>page.path==='/new-feature/').expected,{before:false,after:true});
    assert.deepEqual(added.pages.find(page=>page.path==='/page.php').expected,{before:false,after:true});
    const previous=git(root,'rev-parse','HEAD').trim();
    writeFileSync(join(root,input),'export const text="Changed"');git(root,'add',input);git(root,'commit','-m','change Worker content');
    const changed=getContext(root,{base:previous,head:'HEAD'}).scope;
    assert.equal(changed.fonts,true);assert.ok(changed.pages.some(page=>page.path==='/page.php'));
    assert.ok(classify([{status:'M',paths:['website/assets/brand.css']}],{workerRoutes:workerPages(JSON.stringify([entry]))}).pages.some(page=>page.path==='/page.php'));
    git(root,'rm','website/new-feature/index.html');writeFileSync(join(root,workerPageManifest),'[]');git(root,'add',workerPageManifest);git(root,'commit','-m','remove pages');
    const removed=getContext(root,{base:previous,head:'HEAD'}).scope;
    for(const path of ['/new-feature/','/page.php'])assert.deepEqual(removed.pages.find(page=>page.path===path).expected,{before:true,after:false});
    assert.ok(removed.pages.some(page=>page.id==='home'),'Removing a route also checks navigation rendered by unchanged pages.');
  }finally{rmSync(root,{recursive:true,force:true});}
});

test('HTTP navigation distinguishes reachable pages, removals, dead links and external redirects',async()=>{
  const server=createServer((request,response)=>{
    if(request.url==='/external')response.writeHead(302,{Location:'http://127.0.0.2:1/unavailable'}).end();
    else if(request.url==='/internal')response.writeHead(302,{Location:'/page'}).end();
    else if(request.url==='/loop')response.writeHead(302,{Location:'/loop'}).end();
    else if(request.url==='/page')response.writeHead(200,{'Content-Type':'text/html'}).end('<main>Page</main>');
    else response.writeHead(404).end();
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));const base=`http://127.0.0.1:${server.address().port}`;
  const request=async url=>{
    assert.equal(new URL(url).origin,base);const response=await fetch(url,{redirect:'manual'});await response.body?.cancel();
    return {status:response.status,location:response.headers.get('location')};
  };
  try {
    const external=await observeRoute(base+'/external',request);
    assert.equal(routeEvidence(undefined,external).kind,'redirect');assert.throws(()=>routeEvidence(true,external),/direct HTTP 200/);
    const internal=await observeRoute(base+'/internal',request);
    assert.throws(()=>routeEvidence(true,internal),/direct HTTP 200/);
    assert.equal(routeEvidence(false,internal).kind,'redirect');assert.equal(routeEvidence(true,internal,'before').kind,'redirect');
    await assert.doesNotReject(checkNavigation(base,['/internal'],['/page']));
    assert.equal(routeEvidence(false,{status:404}).kind,'absent');assert.throws(()=>routeEvidence(true,{status:404}),/direct HTTP 200/);
    assert.throws(()=>routeEvidence(false,{status:200},'after'),/Undeclared/);
    await assert.rejects(checkNavigation(base,['/missing'],[]),/HTTP 404/);await assert.rejects(checkNavigation(base,['/page'],[]),/no page declaration/);
    await assert.rejects(observeRoute(base+'/loop',request),/redirect loop/);
  }finally{await new Promise(done=>server.close(done));}
});

// A website-only registry must not require private Worker assets or headers.
test('website previews participate in operation scope without a private Worker',()=>{
 const root=mkdtempSync(join(tmpdir(),'rminte-website-demo-'));
 try{
  mkdirSync(join(root,'services/case-access'),{recursive:true});mkdirSync(join(root,'tests/browser/demos'),{recursive:true});
  writeFileSync(join(root,'services/case-access/resources.mjs'),"export const resources={'example':{demoUrl:'https://preview.example.invalid/'}};");
  const demos=readDemos(root);assert.equal(demos.length,1);assert.equal(demos[0].kind,'website');assert.deepEqual(demos[0].files,[]);assert.equal(demos[0].directory,undefined);
 }finally{rmSync(root,{recursive:true,force:true});}
});

test('official knowledge runtime and original corpus select offline checks without exposing HTML routes',()=>{
  for(const file of ['services/official-knowledge-mcp/.gitignore','services/official-knowledge-mcp/src/worker.ts','docs/official-knowledge/zh/product-overview.md']) {
    const scope=classify([{status:'M',paths:[file]}]);assert.equal(scope.knowledgeMcp,true);assert.equal(scope.pages.length,0);
  }
  for(const name of ['admin.md','root.md','network.md','security.zh.md','security.en.md'])assert.equal(classify([{status:'M',paths:['website/guides/content/'+name]}]).knowledgeMcp,true);
  for(const name of ['admin.ja.md','security.fr.md'])assert.equal(classify([{status:'M',paths:['website/guides/content/'+name]}]).knowledgeMcp,false);
  assert.equal(classify([{status:'M',paths:['docs/knowledge-mcp/README.md']}]).knowledgeMcp,false);
  assert.equal(classify([{status:'M',paths:['services/official-knowledge-mcp/wrangler.jsonc']}]).configurationFiles.length,1);
});
