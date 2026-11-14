import test from 'node:test';
import assert from 'node:assert/strict';
import { syncRelease, readRelease, CURRENT_KEY, snapshotKey } from '../src/releases.js';
import worker from '../src/index.js';

async function fixture() {
  const firmware = new Uint8Array(288); const view = new DataView(firmware.buffer);
  firmware[0] = 0xe9; view.setUint32(32, 0xabcd5432, true);
  for (const [offset, text] of [[48,'0.6.0+build'],[80,'TianShanOS'],[112,'12:00:00'],[128,'Oct 2 2026'],[144,'v5.5.2']]) firmware.set(new TextEncoder().encode(text), offset);
  const www = new Uint8Array([1,2,3]);
  const data = [firmware, www];
  const assets = await Promise.all(['TianShanOS.bin','www.bin'].map(async (name, i) => ({name, state:'uploaded', size:data[i].length, browser_download_url:`https://files/${i}`, digest:'sha256:'+Buffer.from(await crypto.subtle.digest('SHA-256',data[i])).toString('hex')})));
  const release = {id:1, tag_name:'v0.6.0', draft:false, prerelease:false, assets, html_url:'https://github.com/RMinte/TianshanOS/releases/tag/v0.6.0', published_at:'2026-10-02T21:30:05Z'};
  const objects = new Map(), writes = [];
  const bucket = {
    async get(key, options) {
      const value=objects.get(key); if(value===undefined)return null;
      const object={json:async()=>JSON.parse(value),body:value,size:value.byteLength??value.length,httpEtag:'"hash"',writeHttpMetadata(){}};
      const range=options?.range?.get('Range');
      if(range){const [,start,end]=range.match(/^bytes=(\d+)-(\d+)$/);object.range={offset:Number(start),length:Number(end)-Number(start)+1};object.body=value.slice(Number(start),Number(end)+1);}
      return object;
    },
    async head(key){return this.get(key);},
    async put(key, value) {writes.push(key); objects.set(key,value);}
  };
  const fetcher = async url => String(url).includes('api.github.com') ? Response.json(release) : new Response(data[Number(String(url).split('/').at(-1))]);
  return {release, objects, writes, bucket, fetcher};
}

test('publish the matched pair before current; API/page/download read the same snapshot', async () => {
  const f=await fixture(); const result=await syncRelease(f.bucket,f.fetcher);
  assert.equal(result.changed,true); assert.equal(f.writes.at(-1),CURRENT_KEY);
  const release=await readRelease(f.bucket); assert.equal(release.version,'0.6.0+build');
  assert.equal((await readRelease(f.bucket,release.snapshot)).www.sha256,release.www.sha256);
  const env={DOWNLOADS:f.bucket};
  const info=await (await worker.fetch(new Request('https://ota/version'),env)).json();
  assert.equal(info.version,release.version); assert.equal(info.sha256,release.firmware.sha256); assert.equal(info.www_sha256,release.www.sha256);
  const html=await (await worker.fetch(new Request('https://ota/'),env)).text(); assert.match(html,/0.6.0/); assert.match(html,/>TianshanOS\.bin</);
  const response=await worker.fetch(new Request(`https://ota/firmware?release=${release.snapshot}`),env);
  assert.equal(response.headers.get('cache-control'),'public, max-age=31536000, immutable');
  assert.equal(Buffer.from(await response.arrayBuffer()).length,288);
  const latest=await worker.fetch(new Request('https://ota/firmware'),env); assert.equal(latest.headers.get('cache-control'),'no-store');
  assert.equal((await syncRelease(f.bucket,f.fetcher)).changed,false); assert.equal(f.writes.length,4);
});

for(const problem of ['prerelease','draft','missing-www','ambiguous-firmware','bad-hash','wrong-tag','wrong-size','downgrade','upload-failure']) {
 test(`leave current unchanged on ${problem}`,async()=>{
  const f=await fixture(); await syncRelease(f.bucket,f.fetcher); const before=f.objects.get(CURRENT_KEY); f.release.id=2;
  if(problem==='prerelease'||problem==='draft') f.release[problem]=true;
  if(problem==='missing-www')f.release.assets.pop();
  if(problem==='ambiguous-firmware')f.release.assets.push({...f.release.assets[0],name:'TianshanOS.bin'});
  if(problem==='bad-hash')f.release.assets[1].digest='sha256:'+'0'.repeat(64);
  if(problem==='wrong-size')f.release.assets[1].size=10;
  if(problem==='wrong-tag')f.release.tag_name='v0.7.0';
  if(problem==='downgrade')f.release.tag_name='v0.5.1';
  if(problem==='upload-failure'){ const put=f.bucket.put; f.bucket.put=async(key,value)=>{if(key.endsWith('/www.bin'))throw new Error('failed');await put(key,value);}; }
  await assert.rejects(syncRelease(f.bucket,f.fetcher)); assert.equal(f.objects.get(CURRENT_KEY),before);
 });
}
test('a new asset on the same GitHub release replaces current and preserves the pinned pair',async()=>{
 const f=await fixture();await syncRelease(f.bucket,f.fetcher);const old=await readRelease(f.bucket);
 f.release.assets[0].name='TianshanOS.bin';
 const bytes = new Uint8Array(await (await f.fetcher('https://files/0')).arrayBuffer());
 bytes[287]=1;
 f.release.assets[0].digest='sha256:'+Buffer.from(await crypto.subtle.digest('SHA-256',bytes)).toString('hex');
 await syncRelease(f.bucket,async url=>url==='https://files/0'?new Response(bytes):f.fetcher(url));
 const current=await readRelease(f.bucket);
 assert.equal(current.tag,old.tag);assert.notEqual(current.snapshot,old.snapshot);
 assert.equal(current.firmware.name,'TianshanOS.bin');
 assert.equal((await readRelease(f.bucket,old.snapshot)).firmware.sha256,old.firmware.sha256);
 assert.equal(await readRelease(f.bucket,'../current'),null);
});

test('device aliases, HEAD, range and scheduled handler retain their contracts',async()=>{
 const f=await fixture();const original=globalThis.fetch;let task;
 try{globalThis.fetch=f.fetcher;await worker.scheduled({}, {DOWNLOADS:f.bucket},{waitUntil(p){task=p;}});await task;}finally{globalThis.fetch=original;}
 for(const path of ['/info','/version'])assert.equal((await(await worker.fetch(new Request('https://ota'+path),{DOWNLOADS:f.bucket})).json()).version,'0.6.0+build');
 for(const path of ['/firmware','/firmware.bin','/TianshanOS.bin','/TianShanOS.bin','/www','/www.bin']){
  const response=await worker.fetch(new Request('https://ota'+path,{method:'HEAD'}),{DOWNLOADS:f.bucket});assert.equal(response.status,200);assert.ok(Number(response.headers.get('content-length'))>0);assert.equal(await response.text(),'');
 }
 const range=await worker.fetch(new Request('https://ota/firmware',{headers:{Range:'bytes=0-15'}}),{DOWNLOADS:f.bucket});assert.equal(range.status,206);assert.equal(range.headers.get('content-range'),'bytes 0-15/288');assert.equal((await range.arrayBuffer()).byteLength,16);
 const missing=await worker.fetch(new Request('https://ota/version'),{DOWNLOADS:{get:async()=>null}});assert.equal(missing.status,503);
});

test('existing snapshots keep their stored firmware key and use the public download filename', async () => {
  const f = await fixture();
  const { snapshot } = await syncRelease(f.bucket, f.fetcher);
  const current = await readRelease(f.bucket);
  const canonicalKey = current.firmware.key;
  current.firmware.key = canonicalKey.replace('TianshanOS.bin', 'TianShanOS.bin');
  current.firmware.name = 'TianShanOS.bin';
  f.objects.set(current.firmware.key, f.objects.get(canonicalKey));
  f.objects.delete(canonicalKey);
  f.objects.set(CURRENT_KEY, JSON.stringify(current));
  f.objects.set(snapshotKey(snapshot), JSON.stringify(current));

  for (const suffix of ['', `?release=${snapshot}`]) {
    const result = await worker.fetch(new Request(`https://ota/firmware${suffix}`), { DOWNLOADS: f.bucket });
    assert.equal(result.status, 200);
    assert.equal(result.headers.get('content-disposition'), 'attachment; filename="TianshanOS.bin"');
    assert.deepEqual(await result.arrayBuffer(), f.objects.get(current.firmware.key));
  }
});
