import {execFileSync,execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdirSync,writeFileSync,readFileSync,rmSync,mkdtempSync,openSync,closeSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {context,checkDescription} from './scope.mjs';
import {staticChecks,generatedCheck} from './static.mjs';
import {startServer} from './serve.mjs';
import {validateEvidence,gateResult,writeReport} from './report.mjs';
import {scanSecrets} from './secrets.mjs';
import {checkConfigurations} from './build.mjs';
import {checkNavigation} from './routes.mjs';

const root=process.cwd(),output=join(root,'output/ci');mkdirSync(output,{recursive:true});
const option=name=>process.argv.find(value=>value.startsWith(`--${name}=`))?.slice(name.length+3);
const run=context(root,{base:option('base'),head:option('head'),all:process.argv.includes('--all')});
for(const artifact of ['evidence','playwright-report','test-results','browser-results.json','secrets.json'])rmSync(join(output,artifact),{recursive:true,force:true});
writeFileSync(join(output,'context.json'),JSON.stringify(run,null,2));
const checks=[];
function requirePassing(stage) {
  if(checks.some(check=>check.required&&check.status==='failed')) {
    writeReport(root,run,checks);console.error(`${stage} failed; dependent verification was not executed.`);process.exit(1);
  }
}
async function check(name,required,fn,note) {
  if(!required){checks.push({name,required:false,status:'not-applicable',note});return;}
  const startedAt=new Date().toISOString();
  try {const result=await fn();checks.push({name,required:true,status:'passed',startedAt,completedAt:new Date().toISOString(),note:typeof result==='string'?result:JSON.stringify(result)});console.log(`PASS ${name}`);}
  catch(e){checks.push({name,required:true,status:'failed',startedAt,completedAt:new Date().toISOString(),error:e.message});console.error(`FAIL ${name}: ${e.message}`);}
}
async function command(program,args,name,cwd=root,env=process.env) {
  let result;
  try {result=await promisify(execFile)(program,args,{cwd,env,encoding:'utf8',timeout:20*60_000,maxBuffer:20_000_000});}
  catch(error) {
    const log=(error.stdout||'')+(error.stderr||'');writeFileSync(join(output,name+'.log'),log);
    throw new Error(`${name}: exit ${error.code||error.signal}; see output/ci/${name}.log\n${log.slice(-3500)}`);
  }
  writeFileSync(join(output,name+'.log'),result.stdout+result.stderr);
  return `See ${name}.log`;
}

await check('PR description',true,()=>checkDescription(run));
await check('secret protection',true,()=>scanSecrets(root,run));
requirePassing('PR input checks');
let source;
await check('syntax and resources',true,()=>{source=staticChecks(root,run.scope);return {checked:source.checked,navigationTargets:source.navigation.length};});
requirePassing('Source validation');
await check('diff whitespace',true,()=>{execFileSync('git',['diff','--check','--merge-base',run.baseSha,run.headSha,'--'],{cwd:root,stdio:'pipe'});return 'PR difference has no whitespace errors.';});
await check('shared footer consistency and coverage',true,()=>command(process.execPath,['website/scripts/build-footer.mjs','--check'],'footer'));
await check('font subset',run.scope.fonts,()=>command('python3',['website/scripts/build-fonts.py','--check'],'fonts'),'No Chinese copy or font dependency changed.');
await check('service brand',run.scope.brand,()=>command(process.execPath,['scripts/build-service-brand.mjs','--check'],'brand'),'No shared brand dependency changed.');
await check('gallery EXIF',run.scope.exif,()=>command(process.execPath,['website/scripts/extract-gallery-exif.mjs','--check'],'exif'),'No gallery data or photo changed.');
await check('generated guides',run.scope.guides,()=>generatedCheck(root,'website/scripts/build-guides.mjs',['website/guides/admin.html','website/guides/root.html','website/guides/security.html','website/guides/network.html','website/guides/api.html','website/guides/search-index.json']),'No guide source or template changed.');
await check('generated translations',run.scope.translations,()=>generatedCheck(root,'website/scripts/build-translations.mjs',['website/assets/translations/ja.js','website/assets/translations/ko.js','website/assets/translations/es.js','website/assets/translations/fr.js']),'No translation input or generator changed.');
const unit=run.scope.infrastructure?['scripts/ci/policy.test.mjs']:[];
if(run.scope.seo)unit.push('scripts/check-seo.test.mjs');
if(run.scope.caseService)unit.push('services/case-access/tests/crypto.test.mjs','services/case-demos/tests/worker.test.mjs','services/case-access/tests/migration.test.mjs','services/case-access/tests/migration-d1.test.mjs','services/case-access/tests/resources.test.mjs');
if(run.scope.sampleLoan)unit.push('services/sample-loan/tests/integration.test.mjs','services/sample-loan/tests/contract.test.mjs');
if(run.scope.ota)unit.push('services/tianshanos-ota/tests/releases.test.mjs');
await check('unit and gate regressions',unit.length>0,()=>command(process.execPath,['--test',...unit],'unit'),'No corresponding unit-test consumer changed.');
await check('official knowledge MCP',run.scope.knowledgeMcp,async()=>{
  const directory=join(root,'services/official-knowledge-mcp');
  await command('npm',['ci','--ignore-scripts'],'knowledge-install',directory);
  await command('npm',['run','build'],'knowledge-build',directory);
  await command('npm',['run','check'],'knowledge-typecheck',directory);
  await command('npm',['test'],'knowledge-tests',directory);
  await command(process.execPath,['--experimental-strip-types','scripts/evaluate.ts'],'knowledge-retrieval',directory);
  return 'Isolated locked dependencies, type check, source build, code/corpus regressions and offline retrieval; no Agent connection.';
},'No official knowledge runtime or source changed.');
await check('deployment and operational configurations',run.scope.caseService||run.scope.caseMigrations||run.scope.ota||run.scope.knowledgeMcp||run.scope.configurationFiles.length>0,()=>checkConfigurations(root,run.scope),'No deployment or operational configuration dependency changed.');
requirePassing('Build and configuration validation');

let after,before,beforeRoot;
const runtimeRequired=run.scope.pages.length>0||run.scope.seo||run.scope.caseService||source.navigation.length>0;
try {
  await check('local Pages runtime',runtimeRequired,async()=>{
    after=await startServer(root,8788,join(output,'after-server.log'));
    if(run.scope.pages.length) {
      beforeRoot=mkdtempSync(join(tmpdir(),'rminte-before-'));
      const archive=join(beforeRoot,'source.tar'),fd=openSync(archive,'w');
      try{execFileSync('git',['archive',run.baseSha],{cwd:root,stdio:['ignore',fd,'pipe']});}finally{closeSync(fd);}
      execFileSync('tar',['-xf',archive,'-C',beforeRoot]);rmSync(archive);
      before=await startServer(beforeRoot,8789,join(output,'before-server.log'));
    }
    return 'Actual Pages routing and fresh local D1 fixtures; no production access.';
  },'No Worker, service or browser path required.');
  await check('internal navigation HTTP',source.navigation.length>0,()=>{
    if(!after)throw new Error('Local Pages runtime did not start.');
    return checkNavigation(after.url,source.navigation,run.scope.pagePaths);
  },'No affected internal website navigation.');
  await check('case service integration',run.scope.caseService,async()=>{
    if(!after)throw new Error('Local Pages runtime did not start.');
    let noDemo;
    try {
      if(run.scope.caseDemos)noDemo=await startServer(root,8790,join(output,'missing-binding-server.log'),{withoutDemoBinding:true});
      await command(process.execPath,['services/case-access/tests/integration.mjs'],'case-integration',after.runtime,{...after.env,...(noDemo?{RMINTE_MISSING_DEMO_URL:noDemo.url,RMINTE_MISSING_DEMO_RUNTIME:noDemo.runtime}:{})});
    } finally {if(noDemo)await noDemo.stop();}
    await command(process.execPath,['services/case-access/tests/admin-password.mjs',join(root,'node_modules/wrangler/bin/wrangler.js')],'admin-password',after.runtime,after.env);
    return 'Account service tests ran against temporary local data; connected demos are checked in browser operations.';
  },'No case-access API dependency changed.');
  await check('sample loan PDF pipeline',run.scope.sampleLoan,async()=>{
    await command(process.execPath,['services/sample-loan/tests/pdf.integration.mjs'],'sample-loan-pdf');
    await command(process.execPath,['services/sample-loan/tests/pdf.integration.mjs'],'sample-loan-pdf-en',root,{...process.env,SAMPLE_PDF_LANGUAGE:'ja'});
    return 'Chinese and English archived PDFs generated from Chinese and Japanese applications.';
  },'No sample-loan runtime changed.');
  await check('SEO HTTP',run.scope.seo,()=>{
    if(!after)throw new Error('Local Pages runtime did not start.');
    return command(process.execPath,['scripts/check-seo.mjs',after.url,'--environment=production'],'seo-http');
  },'No SEO or routing dependency changed.');
  await check('browser operations and evidence',run.scope.pages.length>0,async()=>{
    if(!after||!before)throw new Error('Before/after Pages runtimes did not start.');
    // API and browser suites share one synthetic IP; reset only the disposable fixture quota between suites.
    after.command(['d1','execute','CASE_DB','--local','--config',join(after.runtime,'services/case-access/wrangler.jsonc'),'--command','DELETE FROM rate_limits;']);
    mkdirSync(join(output,'evidence'),{recursive:true});
    writeFileSync(join(output,'evidence/manifest.json'),JSON.stringify({schema:1,baseSha:run.baseSha,headSha:run.headSha,testSha:run.testSha,scope:run.scope,data:'Local D1 fixtures and synthetic OTA release. Admin currently supports Chinese only.'},null,2));
    const env={...process.env,RMINTE_AFTER_URL:after.url,RMINTE_BEFORE_URL:before.url,RMINTE_AFTER_FIXTURE:after.runtime,RMINTE_BEFORE_FIXTURE:before.runtime};
    await command(process.execPath,['node_modules/@playwright/test/cli.js','test'],'browser',root,env);
    return validateEvidence(root,run);
  },run.scope.reason);
} finally {
  if(before)await before.stop();if(after)await after.stop();
  if(beforeRoot)rmSync(beforeRoot,{recursive:true,force:true});
}
writeReport(root,run,checks);
try{gateResult(checks);console.log('PASS pr-gate; report: output/ci/report.md');}
catch(e){console.error(e.message);process.exitCode=1;}
