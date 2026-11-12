import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync,readdirSync} from 'node:fs';
import {handleApi} from '../api.mjs';
import {resources} from '../resources.mjs';
import {digest} from '../crypto.mjs';
import {MAX_DEALER_PDF_BYTES} from '../dealer-materials.mjs';
test('resource proxy enforces grants on GET, HEAD and assets; revocation blocks further reads',async()=>{
 const db=new DatabaseSync(':memory:');for(const file of readdirSync(new URL('../migrations/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
 db.exec("UPDATE access_settings SET ready=1; INSERT INTO users(id,username,role,password_mac,created_at) VALUES('u','u','user','test',0); INSERT INTO case_grants VALUES('u','digital-toll');");
 const token='a'.repeat(48);db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await digest(token),'u',Math.floor(Date.now()/1000)+60);
 const statement=(sql,args=[])=>({bind(...values){return statement(sql,values);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};}});
 const CASE_DB={prepare:sql=>statement(sql)};
 let upstreamCalls=0,fileCalls=0;
 const env={CASE_DB,CASE_SECRET:'x'.repeat(43),CASE_DEMOS:{async fetch(request){upstreamCalls++;assert.equal(request.headers.get('X-RMinte-User'),'u');return new Response(request.method==='HEAD'?null:'isolated demo fixture');}},CASE_FILES:{async get(){fileCalls++;return {body:'isolated file fixture',httpMetadata:{contentType:'text/plain'}};}}};
 resources['digital-toll']={demoPath:'/fixture/',fileKey:'fixture.txt',fileName:'fixture.txt'};
 const request=(path,method='GET')=>handleApi(new Request('https://test.invalid/api/resources/'+path,{method,headers:{cookie:'__Host-rminte_session='+token}}),env);
 try{
  for(const path of ['digital-toll/demo','digital-toll/demo/asset.js','digital-toll/download']){
   const response=await request(path);assert.equal(response.status,200);assert.match(await response.text(),/isolated/);assert.equal(response.headers.get('cache-control'),'private, no-store');
   const head=await request(path,'HEAD');assert.equal(head.status,200);assert.equal(await head.text(),'');
  }
  const download=await request('digital-toll/download');assert.match(download.headers.get('content-disposition'),/attachment/);
  const before=[upstreamCalls,fileCalls];db.exec('DELETE FROM case_grants');
  for(const path of ['digital-toll/demo','digital-toll/demo/asset.js','digital-toll/download'])for(const method of ['GET','HEAD'])assert.equal((await request(path,method)).status,403);
  assert.deepEqual([upstreamCalls,fileCalls],before);
 }finally{delete resources['digital-toll'];db.close();}
});

const origin='https://test.invalid';
function fixture(){
 const db=new DatabaseSync(':memory:');
 for(const file of readdirSync(new URL('../migrations/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
 const ids={reader:crypto.randomUUID(),admin:crypto.randomUUID(),first:crypto.randomUUID()};
 db.exec("UPDATE access_settings SET ready=1");
 for(const [name,id] of Object.entries(ids))db.prepare('INSERT INTO users(id,username,role,password_mac,created_at,must_change_password) VALUES(?,?,?,?,0,?)').run(id,name,name==='reader'?'user':'admin','test',name==='first'?1:0);
 const statement=(sql,args=[])=>({bind(...values){return statement(sql,values);},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...args).changes)}};}});
 const CASE_DB={prepare:sql=>statement(sql),async batch(statements){db.exec('BEGIN');try{const results=[];for(const s of statements)results.push(await s.run());db.exec('COMMIT');return results;}catch(e){db.exec('ROLLBACK');throw e;}}};
 const objects=new Map(),calls=[];
 const env={CASE_SECRET:'test-only',CASE_DB,CASE_FILES:{
  async put(key,body,options){calls.push(['put',key]);objects.set(key,{bytes:new Uint8Array(body),size:body.byteLength,httpMetadata:options.httpMetadata});},
  async head(key){calls.push(['head',key]);return objects.get(key)||null;},
  async delete(key){calls.push(['delete',key]);objects.delete(key);},
  async get(key){calls.push(['get',key]);const object=objects.get(key);return object?{...object,body:object.bytes}:null;}
 }};
 async function cookie(name){const token=(name==='reader'?'r':name==='admin'?'a':'f').repeat(48);db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(await digest(token),ids[name],Math.floor(Date.now()/1000)+3600);return '__Host-rminte_session='+token;}
 const request=(path,{method='GET',cookie,body,headers={}}={})=>handleApi(new Request(origin+path,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...headers},body}),env);
 return {db,env,objects,calls,cookie,request,ids};
}
test('a retired case grant does not transfer to VoxDock or prevent saving active grants',async()=>{
 const f=fixture();try{
  f.env.CASE_DEMOS={fetch:async()=>new Response('VoxDock demo')};
  const admin=await f.cookie('admin'),reader=await f.cookie('reader');
  for(const id of ['official-writing','digital-toll'])f.db.prepare('INSERT INTO case_grants VALUES(?,?)').run(f.ids.reader,id);
  const path='/api/admin/users/'+f.ids.reader+'/cases',preview='/api/resources/voxdock/preview';
  const previous=await (await f.request(path,{cookie:admin})).json();
  assert.deepEqual(previous.case_ids,['digital-toll']);
  assert.deepEqual((await (await f.request('/api/session',{cookie:reader})).json()).user.case_ids,['digital-toll']);
  assert.equal((await f.request(preview,{cookie:reader})).status,403);
  assert.equal((await f.request('/api/resources/voxdock/demo/meeting.aac',{cookie:reader})).status,403);
  const saved=await f.request(path,{method:'PUT',cookie:admin,headers:{'Content-Type':'application/json'},body:JSON.stringify({...previous,case_ids:[...previous.case_ids,'voxdock']})});
  assert.equal(saved.status,200);
  assert.deepEqual(await (await f.request(preview,{cookie:reader})).json(),{kind:'private',src:'/api/resources/voxdock/demo/index.html?embed=1',allowDownloads:true});
  assert.equal((await f.request('/api/resources/voxdock/demo/meeting.aac',{cookie:reader})).status,200);
 }finally{f.db.close();}
});

const item={id:'rm01-product-comparison'},download='/api/dealer-materials/'+item.id+'/download',upload='/api/admin/dealer-materials/'+item.id;
async function uploadPdf(f,cookie,body,headers={}) {
 const version=f.db.prepare('SELECT row_version FROM dealer_materials WHERE id=?').get(item.id).row_version;
 const response=await f.request(upload,{method:'PUT',cookie,body,headers:{'Content-Type':'application/pdf','If-Match':String(version),'X-File-Name':'fixture.pdf',...headers}});
 if(response.ok){const result=await response.clone().json();if(result.cleanupPending)assert.equal((await f.request(upload,{method:'POST',cookie,headers:{'If-Match':String(result.version)}})).status,200);}
 return response;
}
const currentObject=f=>f.db.prepare('SELECT object_key FROM dealer_materials WHERE id=?').get(item.id).object_key;
const pdf=new TextEncoder().encode('%PDF-1.7\nlocal PDF fixture\n%%EOF');
test('legacy dealer metadata is explicitly verified before publishing; catalogue reads never access R2',async()=>{
 const f=fixture();try{
  const admin=await f.cookie('admin'),catalog=async()=>(await (await f.request('/api/dealer-materials?lang=zh')).json()).files;
  const before=f.db.prepare('SELECT * FROM dealer_materials WHERE id=?').get(item.id);
  assert.equal(before.status,'draft');assert.equal(before.size,null);
  assert.deepEqual(await catalog(),[]);
  assert.equal((await f.request(download,{cookie:admin})).status,404);
  const pending=(await (await f.request('/api/admin/dealer-materials',{cookie:admin})).json()).files[0];
  assert.equal(pending.status,'draft');assert.equal(pending.size,null);
  // An existing private object also stays unpublished until its metadata is verified.
  f.objects.set(before.object_key,{bytes:pdf,size:pdf.length,httpMetadata:{contentType:'application/pdf'}});
  assert.deepEqual(await catalog(),[]);assert.equal(f.calls.length,0);
  const updated=f.db.prepare("UPDATE dealer_materials SET size=?,status='published',row_version=row_version+1,updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id='rm01-product-comparison' AND object_key='dealer/rm01-product-comparison.pdf' AND status='draft' AND size IS NULL AND row_version=1").run(pdf.length);
  assert.equal(updated.changes,1);
  for(let i=0;i<2;i++){
   const listed=await catalog();assert.equal(listed.length,1);assert.equal(listed[0].id,item.id);assert.equal(listed[0].size,pdf.length);
  }
  assert.equal(f.calls.length,0,'public and admin catalogues must use stored metadata only');
  const after=f.db.prepare('SELECT * FROM dealer_materials WHERE id=?').get(item.id);
  for(const key of ['id','object_key','file_name','titles_json'])assert.equal(after[key],before[key]);
  const file=await f.request(download,{cookie:admin});assert.equal(file.status,200);
  assert.deepEqual(new Uint8Array(await file.arrayBuffer()),pdf);
 }finally{f.db.close();}
});
test('dealer downloads require an explicit grant, apply revocation to an existing session, and keep case access independent',async()=>{
 const f=fixture();try{
  const reader=await f.cookie('reader'),admin=await f.cookie('admin'),first=await f.cookie('first');
  for(const method of ['GET','HEAD'])assert.equal((await f.request(download,{method})).status,401);
  assert.equal(f.calls.length,0);
  for(const cookie of [reader,first])assert.equal((await f.request(upload,{method:'PUT',cookie,body:pdf,headers:{'Content-Type':'application/pdf'}})).status,403);
  const initial=await f.request(download,{cookie:first});assert.equal(initial.status,403);assert.equal((await initial.json()).code,'password_change_required');
  assert.equal((await uploadPdf(f,admin,pdf)).status,200);
  assert.equal((await (await f.request('/api/admin/dealer-materials',{cookie:admin})).json()).files[0].size,pdf.length);
  for(const method of ['GET','HEAD']){const denied=await f.request(download,{cookie:reader,method});assert.equal(denied.status,403);assert.equal((await denied.json()).code,'dealer_download_forbidden');}
  f.db.prepare('INSERT INTO case_grants VALUES(?,?)').run(f.ids.reader,'digital-toll');
  assert.equal((await f.request(download,{cookie:reader})).status,403,'A case grant cannot enable dealer downloads');
  f.db.prepare('DELETE FROM case_grants WHERE user_id=?').run(f.ids.reader);
  f.db.prepare('UPDATE users SET can_download_dealer=1 WHERE id=?').run(f.ids.reader);
  const response=await f.request(download,{cookie:reader});assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'private, no-store');assert.equal(response.headers.get('content-type'),'application/pdf');assert.match(response.headers.get('content-disposition'),/attachment/);assert.deepEqual(new Uint8Array(await response.arrayBuffer()),pdf);
  assert.equal((await f.request('/api/resources/digital-toll/download',{cookie:reader})).status,403,'Dealer permission cannot enable case downloads');
  const head=await f.request(download,{cookie:reader,method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');assert.equal(head.headers.get('content-length'),String(pdf.length));
  f.db.prepare('UPDATE users SET can_download_dealer=0 WHERE id=?').run(f.ids.reader);
  const before=f.calls.length;for(const method of ['GET','HEAD'])assert.equal((await f.request(download,{cookie:reader,method})).status,403);assert.equal(f.calls.length,before);
  f.db.prepare('UPDATE sessions SET expires_at=0 WHERE user_id=?').run(f.ids.reader);assert.equal((await f.request(download,{cookie:reader})).status,401);
  f.db.prepare('DELETE FROM sessions WHERE user_id=?').run(f.ids.reader);assert.equal((await f.request(download,{cookie:reader})).status,401);
  f.db.prepare('UPDATE users SET disabled_at=1 WHERE id=?').run(f.ids.admin);assert.equal((await uploadPdf(f,admin,pdf)).status,401);
 }finally{f.db.close();}
});
test('case and dealer grants share an atomic version, stale writers cannot change either, and a late failure rolls everything back',async()=>{
 const f=fixture();try{
  const admin=await f.cookie('admin'),reader=await f.cookie('reader'),path='/api/admin/users/'+f.ids.reader+'/cases';
  const put=(data,cookie=admin)=>f.request(path,{method:'PUT',cookie,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  const get=async()=> (await f.request(path,{cookie:admin})).json();
  assert.deepEqual(await get(),{case_ids:[],dealer_download:false,version:0});
  assert.equal((await put({case_ids:[],dealer_download:true,version:0},reader)).status,403);
  assert.equal((await put({case_ids:[],version:0})).status,400);
  assert.equal((await put({case_ids:['digital-toll'],dealer_download:true,version:0})).status,200);
  assert.equal((await put({case_ids:[],dealer_download:false,version:0})).status,409);
  assert.deepEqual(await get(),{case_ids:['digital-toll'],dealer_download:true,version:1});
  assert.equal((await put({case_ids:[],dealer_download:true,version:1})).status,200);
  assert.deepEqual(await get(),{case_ids:[],dealer_download:true,version:2});
  assert.equal((await put({case_ids:['digital-toll'],dealer_download:false,version:2})).status,200);
  assert.deepEqual(await get(),{case_ids:['digital-toll'],dealer_download:false,version:3});
  assert.equal((await f.request(download,{cookie:reader})).status,403);
  const events=f.db.prepare('SELECT details FROM permission_events ORDER BY rowid').all();assert.equal(events.length,3);assert.equal(JSON.parse(events[0].details).dealer_download,true);
  f.db.exec("CREATE TRIGGER reject_dealer_grant BEFORE UPDATE OF can_download_dealer ON users WHEN NEW.can_download_dealer=1 BEGIN SELECT RAISE(ABORT,'injected fixture failure'); END");
  assert.equal((await put({case_ids:[],dealer_download:true,version:3})).status,500);
  assert.deepEqual(await get(),{case_ids:['digital-toll'],dealer_download:false,version:3});assert.equal(f.db.prepare('SELECT COUNT(*) AS n FROM permission_events').get().n,3);
 }finally{f.db.close();}
});
test('upload rejects cross-origin, invalid type, invalid PDF and excessive bodies without replacing a stored PDF',async()=>{
 const f=fixture();try{
  const admin=await f.cookie('admin');
  assert.equal((await uploadPdf(f,admin,pdf)).status,200);
  for(const [headers,body,status] of [[{'Origin':'https://other.invalid','Content-Type':'application/pdf'},'%PDF-1.7',403],[{'Content-Type':'text/plain'},'%PDF-1.7',415],[{'Content-Type':'application/pdf'},'not a PDF',400],[{'Content-Type':'application/pdf'},new Uint8Array(MAX_DEALER_PDF_BYTES+1),413]]){const response=await uploadPdf(f,admin,body,headers);assert.equal(response.status,status);if(status!==403)assert.ok((await response.json()).fieldErrors.pdf);}
  assert.equal(f.objects.size,1);assert.deepEqual(f.objects.get(currentObject(f)).bytes,pdf);
  assert.equal((await f.request('/api/admin/dealer-materials/unknown',{method:'PUT',cookie:admin,body:pdf,headers:{'Content-Type':'application/pdf'}})).status,404);
  assert.equal((await f.request(download+'/extra',{cookie:admin})).status,404);
  const next=new TextEncoder().encode('%PDF-1.7\nreplacement fixture');assert.equal((await uploadPdf(f,admin,next)).status,200);assert.deepEqual(new Uint8Array(await (await f.request(download,{cookie:admin})).arrayBuffer()),next);
  delete f.env.CASE_FILES;assert.equal((await f.request(download,{cookie:admin})).status,503);
 }finally{f.db.close();}
});

test('dynamic dealer catalogue publishes only named languages, versions replacements, and deletes access before storage cleanup',async()=>{
 const f=fixture();try{
  const admin=await f.cookie('admin'),reader=await f.cookie('reader');
  const edit=(path,data,extra={})=>f.request(path,{cookie:admin,method:'POST',headers:{'Content-Type':'application/json',...extra},body:JSON.stringify(data)});
  const create=await edit('/api/admin/dealer-materials',{titles:{zh:'自定义中文 <script>',en:'Custom title'},fileLanguage:'zh'});assert.equal(create.status,201);const made=await create.json(),path='/api/admin/dealer-materials/'+made.id;
  const catalog=async lang=>(await (await f.request('/api/dealer-materials?lang='+lang)).json()).files;
  assert.equal((await catalog('zh')).some(x=>x.id===made.id),false);
  const put=(version,bytes=pdf)=>f.request(path,{cookie:admin,method:'PUT',headers:{'Content-Type':'application/pdf','If-Match':String(version),'X-File-Name':'same-name.pdf'},body:bytes});
  assert.equal((await put(1)).status,200);assert.equal((await catalog('zh')).find(x=>x.id===made.id).title,'自定义中文 <script>');assert.equal((await catalog('en')).find(x=>x.id===made.id).title,'Custom title');assert.equal((await catalog('ja')).some(x=>x.id===made.id),false);
  assert.equal((await f.request(path,{cookie:reader,method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({expectedVersion:2,titles:{zh:'No permission'},fileLanguage:'zh'})})).status,403);
  const next=new TextEncoder().encode('%PDF-1.7\nnew material');assert.equal((await put(1,next)).status,409);assert.equal((await put(2,next)).status,200);
  const current=f.db.prepare('SELECT * FROM dealer_materials WHERE id=?').get(made.id);assert(current.obsolete_key);assert.deepEqual(f.objects.get(current.object_key).bytes,next);assert.equal((await put(3)).status,409,'an unfinished cleanup must be resolved before replacing again');
  const originalDelete=f.env.CASE_FILES.delete;f.env.CASE_FILES.delete=async()=>{throw Error('injected R2 deletion failure');};
  assert.equal((await f.request(path,{cookie:admin,method:'POST',headers:{'If-Match':'3'}})).status,500);assert.equal((await catalog('en')).some(x=>x.id===made.id),true,'cleanup failure cannot conceal the published file');
  assert.equal((await f.request(path,{cookie:admin,method:'DELETE',headers:{'If-Match':'3'}})).status,500);assert.equal((await catalog('zh')).some(x=>x.id===made.id),false);assert.equal((await f.request('/api/dealer-materials/'+made.id+'/download',{cookie:admin})).status,404);
  f.env.CASE_FILES.delete=originalDelete;assert.equal((await f.request(path,{cookie:admin,method:'DELETE',headers:{'If-Match':'4'}})).status,200);assert.equal(f.db.prepare('SELECT id FROM dealer_materials WHERE id=?').get(made.id),undefined);
  assert.equal((await edit('/api/admin/dealer-materials',{titles:{},fileLanguage:'zh'})).status,422);assert.equal((await edit('/api/admin/dealer-materials',{titles:{xx:'Invalid'},fileLanguage:'zh'})).status,422);
 }finally{f.db.close();}
});
