import {readFileSync,existsSync,readdirSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {routeEvidence,operationName,operationLanguages} from './routes.mjs';

export function validateEvidence(root,context) {
  const directory=join(root,'output/ci/evidence');
  const manifest=JSON.parse(readFileSync(join(directory,'manifest.json'),'utf8'));
  for(const key of ['baseSha','headSha','testSha'])if(manifest[key]!==context[key])throw new Error(`Evidence ${key} does not match this run`);
  const records=[];
  for(const file of readdirSync(join(directory,'records')))if(file.endsWith('.json'))records.push(...JSON.parse(readFileSync(join(directory,'records',file),'utf8')));
  const seen=new Map();
  for(const record of records) {
    const key=[record.phase,record.page,record.language,record.width,record.region].join('|');
    if(seen.has(key))throw new Error(`Duplicate screenshot record: ${key}`);
    const page=context.scope.pages.find(page=>page.id===record.page);
    if(!page||!['before','after'].includes(record.phase))throw new Error(`Unknown route evidence: ${key}`);
    const route=routeEvidence(page.expected?.[record.phase],record,record.phase);
    if(record.kind!==route.kind)throw new Error(`Route evidence disagrees with HTTP result: ${key}`);
    if(route.kind!=='page') {
      seen.set(key,record);continue;
    }
    const {canvas,images}=record;
    if(!canvas||!Number.isInteger(canvas.width)||canvas.width<=0||!Number.isInteger(canvas.height)||canvas.height<=0||!Array.isArray(images)||!images.length)throw new Error(`Missing screenshot coverage: ${key}`);
    let covered=0;
    for(const image of images) {
      const file=resolve(directory,image.file);
      if(!file.startsWith(directory+'/')||!existsSync(file))throw new Error(`Missing screenshot: ${key}`);
      const bytes=readFileSync(file);
      if(bytes.length<24||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw new Error(`Invalid PNG screenshot: ${key}`);
      if(createHash('sha256').update(bytes).digest('hex')!==image.sha256)throw new Error(`Screenshot checksum mismatch: ${key}`);
      const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
      if(width!==canvas.width||height===0||image.y!==covered)throw new Error(`Screenshot coverage gap or overlap: ${key}`);
      covered+=height;
    }
    if(covered!==canvas.height)throw new Error(`Incomplete screenshot coverage: ${key}`);
    seen.set(key,record);
  }
  for(const page of context.scope.pages)for(const language of context.scope.languages.filter(lang=>!page.languages||page.languages.includes(lang)))for(const width of context.scope.widths)for(const region of page.regions)for(const phase of ['before','after']) {
    const key=[phase,page.id,language,width,region].join('|');
    if(!seen.has(key))throw new Error(`Required screenshot missing: ${key}`);
  }
  const browser=JSON.parse(readFileSync(join(root,'output/ci/browser-results.json'),'utf8'));
  const tests=[],operations=new Set();
  const collect=suites=>{for(const suite of suites||[]){for(const spec of suite.specs||[])if(spec.tests?.length){tests.push(...spec.tests);operations.add(suite.title);}collect(suite.suites);}};
  collect(browser.suites);
  if(!tests.length||browser.stats.skipped||browser.stats.unexpected||browser.stats.flaky||tests.some(test=>test.expectedStatus!=='passed'||test.results.length!==1||test.results[0].status!=='passed'))throw new Error('Required browser operations did not all pass without skips or expected failures');
  for(const page of context.scope.pages)for(const language of operationLanguages(page,context.scope.languages))for(const width of [1440,390]) {
    const rendered=seen.get(['after',page.id,language,width,page.regions[0]].join('|'));
    if(rendered?.kind==='page'&&!operations.has(operationName(page,language,width)))throw new Error(`Required page operation missing: ${operationName(page,language,width)}`);
  }
  manifest.screenshots=records.filter(record=>!['absent','redirect'].includes(record.kind));
  manifest.absences=records.filter(record=>['absent','redirect'].includes(record.kind));
  writeFileSync(join(directory,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  return {screenshots:manifest.screenshots.length,absences:manifest.absences.length,manifest:'output/ci/evidence/manifest.json'};
}

export function gateResult(checks) {
  const failed=checks.filter(check=>check.required&&check.status!=='passed');
  if(failed.length)throw new Error(`Required checks did not pass: ${failed.map(check=>`${check.name} (${check.status})`).join(', ')}`);
  return true;
}

export function writeReport(root,context,checks) {
  const report={...context,body:undefined,status:checks.some(c=>c.required&&c.status!=='passed')?'failed':'passed',checks,completedAt:new Date().toISOString(),data:'Temporary local D1 and explicit OTA test responses. No device or production-service acceptance.'};
  const directory=join(root,'output/ci');
  writeFileSync(join(directory,'report.json'),JSON.stringify(report,null,2)+'\n');
  const lines=['# PR 验证结果','',`状态：${report.status}`,`作者：${context.author||'本地验证'}`,`Base：${context.baseSha}`,`Head：${context.headSha}`,`测试提交：${context.testSha}`,'','| 检查 | 结果 | 说明 |','| --- | --- | --- |',...checks.map(c=>`| ${c.name} | ${c.status} | ${String(c.note||c.error||'').replaceAll('|','\\|').replaceAll('\n',' ')} |`),'',`页面：${context.scope.pages.map(p=>p.path).join('、')||'不适用'}`,`语言：${context.scope.languages.join('、')}`,`宽度：${context.scope.widths.join('、')}px`,'','截图和过程证据见同一个 artifact 中的 playwright-report/index.html 和 evidence/manifest.json。','测试数据仅供本地验证，不代表真实设备或生产服务结果。'];
  writeFileSync(join(directory,'report.md'),lines.join('\n')+'\n');
  if(process.env.GITHUB_STEP_SUMMARY)writeFileSync(process.env.GITHUB_STEP_SUMMARY,lines.join('\n')+'\n',{flag:'a'});
  return report;
}
