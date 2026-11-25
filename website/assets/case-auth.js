window.CASE_AUTH = (()=>{
 let user=null, generation=0, query=0, writes=Promise.resolve();
 // Copy of the authorised-access panel on the cases page (#access). Every string is a zh/en pair that cases.js paints in the visitor's language;
 // the admin console is Chinese only and has no #access, so render() does nothing there.
 const PANEL={
  label:{zh:'授权访问',en:'AUTHORISED ACCESS'},
  hint:{zh:'已有 RMinte 专属账号？登录后即可体验已授权演示并下载资料。',en:'Already have an RMinte account? Sign in to access authorised demos and downloads.'},
  signIn:{zh:'授权登录',en:'Sign in'},
  cases:{zh:'案例访问',en:'Case access'},
  all:{zh:'全部案例',en:'All cases'},
  count:{zh:'已授权 {n} 个案例',en:'{n} cases authorised'},
  changePassword:{zh:'请先到管理后台修改初始密码',en:'Change your initial password in the admin console first'},
  admin:{zh:'管理后台',en:'Admin console'},
  sample:{zh:'样机管理',en:'Demo unit management'},
  signOut:{zh:'退出登录',en:'Sign out'},
  unavailable:{zh:'账号服务暂时不可用',en:'The account service is temporarily unavailable'}
 };
 async function api(path,options={}){
  let response,data;
  try{
   response=await fetch(path,{credentials:'same-origin',...options,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...options.headers}});
   data=await response.json();
  }catch{const error=new Error('服务暂时不可用，请稍后重试');error.unavailable=true;if(response)error.status=response.status;throw error;}
  if(!response.ok){const error=new Error(data.error||'操作失败');Object.assign(error,{status:response.status,code:data.code,fieldErrors:data.fieldErrors});throw error;}return data;
 }
 function node(tag,className,pair){const n=document.createElement(tag);if(className)n.className=className;if(pair){n.textContent=pair.zh;n.dataset.caseText='';n.dataset.zh=pair.zh;n.dataset.en=pair.en;}return n;}
 // problem: the error of a failed call, shown under the panel
 function render(problem){const panel=document.querySelector('#access');if(!panel)return;
  panel.replaceChildren(node('p','k',PANEL.label));
  if(!user){
   const login=node('button','cs-pill ghost',PANEL.signIn);login.type='button';login.dataset.action='login';
   panel.append(node('p','hint',PANEL.hint),login);
  }else{
   const who=node('p','who');who.textContent=user.username;
   const list=node('ul','p');
   const granted=user.all_cases?PANEL.all:PANEL.count;
   const item=node('li'),value=node('span','',user.must_change_password?PANEL.changePassword:granted);if(!user.all_cases&&!user.must_change_password)value.dataset.n=String(user.case_ids.length);if(user.all_cases||user.case_ids.length)item.dataset.state='ok';item.append(node('span','',PANEL.cases),value);list.append(item);
   const row=node('div','row');
   if(user.role==='admin'){const link=node('a','cs-pill ghost',PANEL.admin);link.href='/admin/';row.append(link);}
   if(user.sampleAccess?.canManage){const link=node('a','cs-pill ghost',PANEL.sample);link.href='/sample-loan/#admin';row.append(link);}
   const out=node('button','txt',PANEL.signOut);out.type='button';out.onclick=async()=>{try{await logout();}catch(e){render(e);}};
   row.append(out);panel.append(who,list,row);
  }
  if(problem){const note=problem.unavailable?node('div','cs-msg',PANEL.unavailable):node('div','cs-msg');if(!problem.unavailable)note.textContent=problem.message;panel.append(note);}
  window.dispatchEvent(new Event('case-auth-render'));
 }
 // A stale query must not mutate shared auth state or dispatch render events.
 async function refresh({isCurrent=()=>true,signal}={}){
  const version=generation,request=++query;
  let result,problem;
  try{result=await api('/api/session',{signal});}catch(error){problem=error;}
  if(version!==generation||request!==query||!isCurrent())return user;
  if(problem)throw problem;
  user=result.user;render();return user;
 }
 // Serialize the complete Cookie-writing operation, including the user commit.
 // A rejected operation still rejects its caller; the next submitted write can run.
 function writeSession(action){
  const run=async()=>{++generation;try{return await action();}finally{++generation;}};
  const result=writes.then(run,run);writes=result;return result;
 }
 function login(username,password){return writeSession(async()=>{
  const result=await api('/api/login',{method:'POST',body:JSON.stringify({username,password})});
  user=result.user;render();return user;
 });}
 function logout(){return writeSession(async()=>{
  await api('/api/logout',{method:'POST'});user=null;render();window.dispatchEvent(new Event('case-auth-change'));
 });}
 function changePassword(passwords){return writeSession(async()=>{
  await api('/api/admin/password',{method:'POST',body:JSON.stringify(passwords)});
  user=null;render();window.dispatchEvent(new Event('case-auth-change'));
 });}
 function canAccess(id){return !!user&&!user.must_change_password&&(user.all_cases||user.case_ids.includes(id));}
 return {api,refresh,login,logout,changePassword,render,canAccess,get user(){return user;}};
})();
