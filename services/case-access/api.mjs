import {sampleAccess} from '../sample-loan/access.mjs';
import {digest,passwordMac,hashAdminPassword,verifyPassword,encryptPassword,decryptPassword,randomString,randomPassword} from './crypto.mjs';
import {resources} from './resources.mjs';
import {listDealerMaterials,dealerDownload,dealerCommand} from './dealer-materials.mjs';
import {LoanError} from '../sample-loan/domain.mjs';
import {caseIds} from '../../website/assets/case-catalog.mjs';
const H={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...H,...extra}});
class HttpError extends Error{constructor(status,message,code){super(message);this.status=status;this.code=code;}}
const fail=(status,message,code)=>{throw new HttpError(status,message,code)};
const now=()=>Math.floor(Date.now()/1000);
const cookieName=request=>new URL(request.url).protocol==='https:'?'__Host-rminte_session':'rminte_local_session';
function cookie(request,value,age){return `${cookieName(request)}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${new URL(request.url).protocol==='https:'?'; Secure':''}`;}
async function payload(request){
 if(!request.headers.get('content-type')?.startsWith('application/json'))fail(415,'需要 JSON 请求');
 const reader=request.body?.getReader();if(!reader)fail(400,'缺少请求内容');let chunks=[],size=0;
 while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();fail(413,'内容过长');}chunks.push(value);}
 let value;try{const all=new Uint8Array(size);let offset=0;for(const c of chunks){all.set(c,offset);offset+=c.length;}value=JSON.parse(new TextDecoder().decode(all));}catch{fail(400,'内容格式不正确');}
 if(!value||typeof value!=='object'||Array.isArray(value))fail(400,'内容格式不正确');return value;
}
function field(data,key,max){const v=data[key];if(typeof v!=='string'||!v.trim()||v.length>max)fail(400,`${key} 未填写或过长`);return v.trim();}
function passwordField(data,key){const value=data[key];if(typeof value!=='string'||!value.length||value.length>128)fail(400,'密码未填写或过长');return value;}
function exact(data,keys){if(Object.keys(data).some(k=>!keys.includes(k)))fail(400,'请求包含不支持的字段');}
function audit(env,actor,target,action,details){return env.CASE_DB.prepare('INSERT INTO permission_events(id,actor_id,target_id,action,details,occurred_at) VALUES(?,?,?,?,?,?)').bind(crypto.randomUUID(),actor,target,action,JSON.stringify(details),now());}
export async function session(request,env){
 const raw=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName(request)+'='))?.split('=')[1];
 if(!raw||!/^[A-Za-z0-9]{48}$/.test(raw))return null;
 return env.CASE_DB.prepare('SELECT s.token_hash AS session_hash,u.id,u.username,u.role,u.is_owner,u.disabled_at,u.must_change_password,u.can_download_dealer FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.disabled_at IS NULL').bind(await digest(raw),now()).first();
}
const activeGrants=rows=>rows.map(g=>g.case_id).filter(id=>caseIds.includes(id));
async function publicUser(u,env){
 if(!u)return null;
 const grants=u.role==='user'?await env.CASE_DB.prepare('SELECT case_id FROM case_grants WHERE user_id=? ORDER BY case_id').bind(u.id).all():{results:[]};
 return {sampleAccess:await sampleAccess(u,env),id:u.id,username:u.username,role:u.role,is_owner:!!u.is_owner,must_change_password:!!u.must_change_password,case_ids:activeGrants(grants.results),all_cases:u.role==='admin'&&!u.must_change_password,resources:Object.fromEntries(caseIds.map(id=>[id,{demo:!!(resources[id]?.demoUrl||(resources[id]?.demoPath&&env.CASE_DEMOS)),download:!!(resources[id]?.fileKey&&env.CASE_FILES)}]))};
}
async function limit(env,key,max,seconds){
 const t=now();const row=await env.CASE_DB.prepare('INSERT INTO rate_limits(key,hits,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN expires_at<=? THEN 1 ELSE hits+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING hits').bind(key,t+seconds,t,t).first();
 if(row.hits>max)fail(429,'尝试过于频繁，请稍后再试');
}
function ipOf(request){return request.headers.get('CF-Connecting-IP')||'本地开发';}
export async function handleApi(request,env){
 try{
 const url=new URL(request.url),path=url.pathname,method=request.method;
 if(!env.CASE_DB)fail(503,'账号服务尚未配置');
 if(path==='/api/dealer-materials'&&method==='GET')return json(await listDealerMaterials(env,url.searchParams.get('lang')||'zh'));
 if(!env.CASE_SECRET)fail(503,'账号服务尚未配置');
 if(!['GET','HEAD'].includes(method)){
  if(request.headers.get('origin')!==url.origin)fail(403,'请求来源不正确');
 }
 if(path!=='/api/applications'){const settings=await env.CASE_DB.prepare('SELECT ready FROM access_settings WHERE id=1').first();if(!settings?.ready)fail(503,'账号权限正在升级，请稍后重试');}
 if(method==='POST'&&path==='/api/login'){
  const data=await payload(request),username=field(data,'username',80),password=passwordField(data,'password');
  await limit(env,'login-ip:'+await digest(ipOf(request)),30,900);
  await limit(env,'login-user:'+await digest(username),15,900);
  const u=await env.CASE_DB.prepare('SELECT * FROM users WHERE username=?').bind(username).first();
  if(!u||u.disabled_at!==null||!await verifyPassword(env.CASE_SECRET,username,password,u.password_mac))fail(401,'用户名或密码不正确');
  const token=randomString(48),t=now(),cf=request.cf||{};
  const created=await env.CASE_DB.batch([
   env.CASE_DB.prepare('INSERT INTO sessions(token_hash,user_id,expires_at) SELECT ?,id,? FROM users WHERE id=? AND password_mac=? AND disabled_at IS NULL').bind(await digest(token),t+86400,u.id,u.password_mac),
   env.CASE_DB.prepare('INSERT INTO login_events(user_id,occurred_at,ip,country,region,city) VALUES(?,?,?,?,?,?)').bind(u.id,t,ipOf(request),cf.country||'',cf.region||'',cf.city||''),
   env.CASE_DB.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(t),
   env.CASE_DB.prepare('DELETE FROM rate_limits WHERE expires_at<=?').bind(t),
   env.CASE_DB.prepare('DELETE FROM login_events WHERE occurred_at<?').bind(t-90*86400)
  ]);
  if(!created[0].meta.changes)fail(401,'密码已更新，请重新登录');
  return json({user:await publicUser(u,env)},200,{'Set-Cookie':cookie(request,token,86400)});
 }
 if(method==='POST'&&path==='/api/logout'){
  const raw=(request.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName(request)+'='))?.split('=')[1];
  if(raw)await env.CASE_DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(raw)).run();
  return json({ok:true},200,{'Set-Cookie':cookie(request,'',0)});
 }
 if(method==='POST'&&path==='/api/applications'){
  const d=await payload(request);const values=['name','company','email','message','experience'].map(k=>field(d,k,k==='message'||k==='experience'?3000:200));
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values[2]))fail(400,'邮箱格式不正确');
  await limit(env,'application:'+await digest(ipOf(request)),5,3600);
  await env.CASE_DB.prepare('INSERT INTO applications(id,kind,name,company,email,message,experience,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(crypto.randomUUID(),'software',...values,now()).run();
  return json({ok:true},201);
 }
 const user=await session(request,env);
 if(method==='GET'&&path==='/api/session')return json({user:await publicUser(user,env)});
 if(!user)fail(401,'请先登录');
 if(user.must_change_password&&path!=='/api/admin/password')fail(403,'请先修改初始密码','password_change_required');
 const dealerFile=path.match(/^\/api\/dealer-materials\/([a-z0-9-]+)\/download$/);
 if(dealerFile&&['GET','HEAD'].includes(method)){
  if(user.role!=='admin'&&!user.can_download_dealer)fail(403,'此账号没有经销商资料下载权限','dealer_download_forbidden');
  return await dealerDownload(env,dealerFile[1],method);
 }
 const resource=path.match(/^\/api\/resources\/([a-z0-9-]+)\/(preview|demo|download)(\/.*)?$/);
 if(resource&&['GET','HEAD'].includes(method)){
  const [,id,kind,tail='']=resource;
  if(user.role!=='admin'&&!await env.CASE_DB.prepare('SELECT 1 FROM case_grants WHERE user_id=? AND case_id=?').bind(user.id,id).first())fail(403,'此账号没有该案例的访问权限');
  const r=resources[id];if(!r)fail(503,'该案例的演示或资料尚未接入');
  if(kind==='preview'){
   if(tail)fail(404,'接口不存在');
   if(r.demoPath&&r.demoUrl)fail(503,'演示配置不可用');
   if(r.demoUrl){
    let target;try{target=new URL(r.demoUrl);}catch{fail(503,'演示配置不可用');}
    if(target.protocol!=='https:'||target.username||target.password)fail(503,'演示配置不可用');
    return json({kind:'website',src:target.href});
   }
   if(!r.demoPath||!env.CASE_DEMOS)fail(503,'该案例的演示尚未接入');
   const base=new URL(`/api/resources/${id}/demo/`,url.origin);
   let target;try{target=new URL(r.demoEntry,base);}catch{fail(503,'演示配置不可用');}
   if(typeof r.demoEntry!=='string'||!r.demoEntry||/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(r.demoEntry)||target.origin!==base.origin||!target.pathname.startsWith(base.pathname)||/[\\]/.test(r.demoEntry))fail(503,'演示配置不可用');
   return json({kind:'private',src:target.pathname+target.search+target.hash,...(r.allowDownloads===true?{allowDownloads:true}:{})});
  }
  if(kind==='demo'){
   if(!r.demoPath||!env.CASE_DEMOS)fail(503,'该案例的演示尚未接入');
   const upstream=new URL(r.demoPath+tail.replace(/^\//,''),'https://private-demo.internal');upstream.search=url.search;
   const headers=new Headers({'X-RMinte-User':user.id,'X-RMinte-Role':user.role});
   const response=await env.CASE_DEMOS.fetch(new Request(upstream,{method,headers,redirect:'manual'}));
   if(response.status>=300&&response.status<400)fail(502,'演示服务返回了未配置的跳转');
   const h=new Headers(response.headers);h.set('Cache-Control','private, no-store');h.delete('set-cookie');
   return new Response(response.body,{status:response.status,headers:h});
  }
  if(tail||!r.fileKey||!env.CASE_FILES)fail(503,'该案例的资料尚未接入');
  const object=await env.CASE_FILES.get(r.fileKey);if(!object)fail(404,'资料不存在');
  return new Response(method==='HEAD'?null:object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'application/octet-stream','Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(r.fileName||'document.pdf')}`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }
 if(user.role!=='admin')fail(403,'仅管理员可操作');
 if(path==='/api/admin/dealer-materials'&&method==='GET')return json(await listDealerMaterials(env));
 const dealerEdit=path.match(/^\/api\/admin\/dealer-materials(?:\/([a-z0-9-]+))?$/);
 if(dealerEdit && ((!dealerEdit[1]&&method==='POST') || (dealerEdit[1]&&['PATCH','PUT','DELETE','POST'].includes(method))))return json(await dealerCommand(request,env,user,dealerEdit[1],(method==='PATCH'||(method==='POST'&&!dealerEdit[1]))?await payload(request):null),method==='POST'&&!dealerEdit[1]?201:200);
 if(path==='/api/admin/password'&&method==='POST'){
  await limit(env,'password-change:'+user.id,5,900);
  const data=await payload(request),current=passwordField(data,'current_password'),next=passwordField(data,'new_password');
  if(next.length<15)fail(400,'新密码至少需要 15 个字符');
  if(next===current)fail(400,'新密码不能与当前密码相同');
  const record=await env.CASE_DB.prepare('SELECT password_mac FROM users WHERE id=?').bind(user.id).first();
  if(!await verifyPassword(env.CASE_SECRET,user.username,current,record.password_mac))fail(400,'当前密码不正确');
  const hash=await hashAdminPassword(env.CASE_SECRET,user.username,next);
  const result=await env.CASE_DB.batch([
   env.CASE_DB.prepare("UPDATE users SET password_mac=?,password_cipher=NULL,must_change_password=0 WHERE id=? AND role='admin' AND disabled_at IS NULL AND password_mac=?").bind(hash,user.id,record.password_mac),
   env.CASE_DB.prepare('DELETE FROM sessions WHERE user_id=? AND EXISTS (SELECT 1 FROM users WHERE id=? AND password_mac=?)').bind(user.id,user.id,hash)
  ]);
  if(!result[0].meta.changes)fail(409,'密码已被更新，请重新登录');
  return json({ok:true},200,{'Set-Cookie':cookie(request,'',0)});
 }

 if(path==='/api/admin/admins'||path.startsWith('/api/admin/admins/')){
  if(!user.is_owner)fail(403,'仅主管理员可操作');
  if(path==='/api/admin/admins'&&method==='GET'){
   const offset=Math.max(0,Math.min(100000,Number(url.searchParams.get('offset'))||0));
   const {results}=await env.CASE_DB.prepare("SELECT id,username,label,disabled_at,must_change_password,created_at,(SELECT MAX(occurred_at) FROM login_events WHERE user_id=users.id) AS occurred_at FROM users WHERE role='admin' AND is_owner=0 ORDER BY created_at DESC,id LIMIT 51 OFFSET ?").bind(offset).all();
   return json({admins:results.slice(0,50),more:results.length>50});
  }
  if(path==='/api/admin/admins'&&method==='POST'){
   const data=await payload(request);exact(data,['label']);
   if(data.label!==undefined&&(typeof data.label!=='string'||data.label.length>40))fail(400,'备注不能超过 40 个字符');
   const label=(data.label||'').trim(),username='rminte-admin-'+randomString(10,'abcdefghijklmnopqrstuvwxyz0123456789'),password=randomString(24),id=crypto.randomUUID();
   await env.CASE_DB.batch([
    env.CASE_DB.prepare("INSERT INTO users(id,username,role,password_mac,password_cipher,created_at,must_change_password,label) VALUES(?,?,'admin',?,NULL,?,1,?)").bind(id,username,await hashAdminPassword(env.CASE_SECRET,username,password),now(),label),
    audit(env,user.id,id,'admin_created',{label})
   ]);
   return json({id,username,password,label},201);
  }
  const target=path.match(/^\/api\/admin\/admins\/([a-f0-9-]+)$/);
  if(target&&method==='PATCH'){
   const data=await payload(request);exact(data,['enabled']);if(typeof data.enabled!=='boolean')fail(400,'请指定账号状态');
   const id=target[1],u=await env.CASE_DB.prepare("SELECT id FROM users WHERE id=? AND role='admin' AND is_owner=0").bind(id).first();if(!u)fail(404,'管理员不存在');
   await env.CASE_DB.batch([
    env.CASE_DB.prepare("UPDATE users SET disabled_at=? WHERE id=? AND role='admin' AND is_owner=0").bind(data.enabled?null:now(),id),
    env.CASE_DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(id),
    audit(env,user.id,id,data.enabled?'admin_enabled':'admin_disabled',{})
   ]);
   return json({ok:true});
  }
  fail(404,'接口不存在');
 }
 if(path==='/api/admin/users'&&method==='GET'){
  const offset=Math.max(0,Math.min(100000,Number(url.searchParams.get('offset'))||0));
  const {results}=await env.CASE_DB.prepare(`SELECT u.id,u.username,u.role,u.permissions_version,u.can_download_dealer AS dealer_download,u.created_at,e.occurred_at,e.ip,e.country,e.region,e.city FROM users u LEFT JOIN login_events e ON e.id=(SELECT id FROM login_events WHERE user_id=u.id ORDER BY occurred_at DESC,id DESC LIMIT 1) WHERE u.role='user' ORDER BY u.created_at DESC,u.id LIMIT 51 OFFSET ?`).bind(offset).all();
  const page=results.slice(0,50);
  const grants=page.length?await env.CASE_DB.prepare(`SELECT user_id,case_id FROM case_grants WHERE user_id IN (${page.map(()=>'?').join(',')}) ORDER BY case_id`).bind(...page.map(u=>u.id)).all():{results:[]};
  return json({users:page.map(u=>({...u,dealer_download:!!u.dealer_download,case_ids:activeGrants(grants.results.filter(g=>g.user_id===u.id))})),more:results.length>50});
 }
 if(path==='/api/admin/users'&&method==='POST'){
  exact(await payload(request),[]);
  const demo=0,download=0,username='rminte-'+randomString(10,'abcdefghijklmnopqrstuvwxyz0123456789'),password=randomPassword(),id=crypto.randomUUID();
  await env.CASE_DB.prepare('INSERT INTO users(id,username,role,password_mac,password_cipher,can_demo,can_download,created_at) VALUES(?,?,?,?,?,?,?,?)').bind(id,username,'user',await passwordMac(env.CASE_SECRET,username,password),await encryptPassword(env.CASE_SECRET,username,password),demo,download,now()).run();
  return json({id,username,password},201);
 }
 const match=path.match(/^\/api\/admin\/users\/([a-f0-9-]+)(?:\/(password|logins|cases))?$/);
 if(match){
  const [,id,sub]=match;const u=await env.CASE_DB.prepare("SELECT * FROM users WHERE id=? AND role='user'").bind(id).first();if(!u)fail(404,'账号不存在');
  if(method==='GET'&&sub==='password')return json({password:await decryptPassword(env.CASE_SECRET,u.username,u.password_cipher)});
  if(method==='GET'&&sub==='logins'){
   const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);
   const {results}=await env.CASE_DB.prepare('SELECT occurred_at,ip,country,region,city FROM login_events WHERE user_id=? ORDER BY occurred_at DESC,id DESC LIMIT 51 OFFSET ?').bind(id,offset).all();return json({events:results.slice(0,50),more:results.length>50});
  }
  if(method==='GET'&&sub==='cases'){
   const {results}=await env.CASE_DB.prepare('SELECT case_id FROM case_grants WHERE user_id=? ORDER BY case_id').bind(id).all();
   return json({case_ids:activeGrants(results),dealer_download:!!u.can_download_dealer,version:u.permissions_version});
  }
  if(method==='PUT'&&sub==='cases'){
   const data=await payload(request);exact(data,['case_ids','dealer_download','version']);
   if(typeof data.dealer_download!=='boolean'||!Number.isSafeInteger(data.version)||data.version<0||!Array.isArray(data.case_ids)||data.case_ids.length>caseIds.length||data.case_ids.some(c=>!caseIds.includes(c))||new Set(data.case_ids).size!==data.case_ids.length)fail(400,'访问授权格式不正确');
   const version=data.version;
   // Every write uses the same version predicate; D1 batch commits all statements atomically.
   const guard="EXISTS(SELECT 1 FROM users WHERE id=? AND role='user' AND permissions_version=?)";
   const statements=[env.CASE_DB.prepare(`DELETE FROM case_grants WHERE user_id=? AND ${guard}`).bind(id,id,version)];
   for(const cid of data.case_ids)statements.push(env.CASE_DB.prepare(`INSERT INTO case_grants(user_id,case_id) SELECT ?,? WHERE ${guard}`).bind(id,cid,id,version));
   statements.push(env.CASE_DB.prepare(`INSERT INTO permission_events(id,actor_id,target_id,action,details,occurred_at) SELECT ?,?,?,?,?,? WHERE ${guard}`).bind(crypto.randomUUID(),user.id,id,'access_grants',JSON.stringify({case_ids:data.case_ids,dealer_download:data.dealer_download}),now(),id,version));
   statements.push(env.CASE_DB.prepare("UPDATE users SET can_download_dealer=?,permissions_version=permissions_version+1 WHERE id=? AND role='user' AND permissions_version=?").bind(data.dealer_download?1:0,id,version));
   const result=await env.CASE_DB.batch(statements);
   if(!result.at(-1).meta.changes)fail(409,'访问权限已更新，请重新载入后再保存');
   return json({case_ids:data.case_ids,dealer_download:data.dealer_download,version:version+1});
  }
  if(method==='DELETE'&&!sub){await env.CASE_DB.prepare("DELETE FROM users WHERE id=? AND role='user'").bind(id).run();return json({ok:true});}
 }
 if(path==='/api/admin/inbox'&&method==='GET'){
  const offset=Math.max(0,Number(url.searchParams.get('offset'))||0);const {results}=await env.CASE_DB.prepare('SELECT * FROM applications ORDER BY created_at DESC,id LIMIT 51 OFFSET ?').bind(offset).all();return json({messages:results.slice(0,50),more:results.length>50});
 }
 const message=path.match(/^\/api\/admin\/inbox\/([a-f0-9-]+)$/);
 if(message&&method==='PATCH'){await env.CASE_DB.prepare('UPDATE applications SET read_at=? WHERE id=?').bind(now(),message[1]).run();return json({ok:true});}
 fail(404,'接口不存在');
 }catch(e){if(e instanceof LoanError)return json({error:e.message,code:e.code,fieldErrors:e.fieldErrors},e.status);if(e instanceof HttpError)return json({error:e.message,...(e.code?{code:e.code}:{})},e.status);console.error('case_access_error',e.name);return json({error:'服务暂时不可用，请稍后重试'},500);}
}
