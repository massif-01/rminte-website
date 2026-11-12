import { setupDealerLibrary } from './dealer-admin.mjs?v=library-2';
import {enhancePasswords} from '../assets/password-field.mjs';
import {groups,caseCatalog} from '../assets/case-catalog.mjs?v=voxdock-case-1';
const $=s=>document.querySelector(s),api=CASE_AUTH.api;
enhancePasswords(document);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let currentUser=null;
let usersOffset=0,inboxOffset=0,historyOffset=0,historyId=null,users=[],newAccount=null;
const ago=t=>{if(!t)return '从未登录';const s=Date.now()/1000-t;return s<60?'刚刚登录':s<3600?`${Math.floor(s/60)} 分钟前登录`:s<86400?`${Math.floor(s/3600)} 小时前登录`:`${Math.floor(s/86400)} 天前登录`;};
const date=t=>new Date(t*1000).toLocaleString('zh-CN',{hour12:false});
const region=e=>[e.country,e.region,e.city].filter(Boolean).join(' / ')||'地区未知';
// Results and errors come up as a toast at the bottom left and go after a few seconds
let toastTimer;
function toast(label,text){const live=$('#toasts'),box=document.createElement('div'),tag=document.createElement('b');box.className='ad-toast';tag.textContent=label;box.append(tag,text);live.replaceChildren(box);clearTimeout(toastTimer);toastTimer=setTimeout(()=>live.replaceChildren(),5000);}
// A hint box under a form: the label is optional
function say(slot,text,label){const box=document.createElement('div');box.className='cs-msg';if(label){const tag=document.createElement('b');tag.textContent=label;box.append(tag);}box.append(text);slot.replaceChildren(box);}
function report(error){toast('未能完成',error.message||String(error));if(error.status===401)showLogin();}
const accountControls=['#account-who','#change-password','#logout'];
function showAdmin(user){
 currentUser=user;$('#account-who').textContent=`${user.username} · ${user.is_owner?'主管理员':'管理员'}`;
 accountControls.forEach(s=>$(s).hidden=false);$('#login-panel').hidden=true;
 $('#password-required-panel').hidden=!user.must_change_password;$('#admin-panel').hidden=user.must_change_password;
 $('#tab-admins').hidden=!user.is_owner;
}
function showLogin(){
 endCaseEdit();
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());currentUser=null;users=[];
 for(const id of ['users','messages','new-account','admin-accounts','admin-credentials','dealer-files'])$('#'+id).replaceChildren();
 $('#new-account').hidden=true;$('#admin-credentials').hidden=true;newAccount=null;accountControls.forEach(s=>$(s).hidden=true);
 $('#unread').hidden=true;$('#admin-panel').hidden=true;$('#password-required-panel').hidden=true;$('#login-panel').hidden=false;
}
async function init(){try{const user=await CASE_AUTH.refresh();if(user?.role==='admin'){showAdmin(user);if(!user.must_change_password){usersOffset=0;await selectTab($('#tab-users'));loadInbox();}}else{showLogin();if(user)say($('#login-message'),'当前账号不是管理员。你仍可前往案例页使用已授权的功能。');}}catch(e){showLogin();say($('#login-message'),e.message,'未能登录');}}
$('#admin-login').onsubmit=async e=>{e.preventDefault();const form=e.target,b=form.querySelector('[type=submit]');b.disabled=true;try{await CASE_AUTH.login(form.username.value,form.password.value);form.reset();$('#login-message').replaceChildren();await init();}catch(e){say($('#login-message'),e.message,'未能登录');}finally{b.disabled=false;}};
$('#logout').onclick=async()=>{try{await CASE_AUTH.logout();await init();}catch(e){report(e);}};
async function loadUsers(){
 try{const data=await api(`/api/admin/users?offset=${usersOffset}`);users=data.users;
 $('#users').innerHTML=users.length?users.map(u=>`<tr data-id="${u.id}"><td data-label="账号 / 密码"><span class="u">${escapeHtml(u.username)}</span><div class="ad-pw"><code data-password>••••••••••••</code><button class="ad-btn" type="button" data-show>查看密码</button><button class="ad-btn" type="button" data-copy>复制账号密码</button></div></td><td data-label="访问权限" class="summary"><strong>${u.case_ids.length} / ${caseCatalog.length} 个案例</strong><span class="s">${escapeHtml(u.case_ids.length?u.case_ids.slice(0,3).map(id=>caseCatalog.find(c=>c.id===id)?.name.zh||id).join('、')+(u.case_ids.length>3?'…':''):'尚未授权案例')}</span><span class="s">经销商资料下载：${u.dealer_download?'已授权':'未授权'}</span><button class="ad-btn" type="button" data-cases>管理权限</button></td><td data-label="最近登录"><span data-time="${u.occurred_at||''}">${ago(u.occurred_at)}</span><span class="s">${u.occurred_at?date(u.occurred_at):''}</span></td><td data-label="IP / 地区">${escapeHtml(u.ip||'—')}<span class="s">${escapeHtml(u.occurred_at?region(u):'—')}</span></td><td data-label="操作"><div class="ad-ops"><button class="ad-btn" type="button" data-history>登录记录</button><button class="ad-btn danger" type="button" data-delete>删除</button></div></td></tr>`).join(''):'<tr><td colspan="5">尚未分发账号。</td></tr>';
 $('#users-prev').disabled=usersOffset===0;$('#users-next').disabled=!data.more;$('#users-page').textContent=`第 ${usersOffset/50+1} 页`;
 }catch(e){report(e);}
}
$('#create-user').onsubmit=async e=>{e.preventDefault();const form=e.target,b=form.querySelector('button');b.disabled=true;try{const data=await api('/api/admin/users',{method:'POST',body:JSON.stringify({})});newAccount=data;const box=$('#new-account');box.hidden=false;box.innerHTML=`<p class="k">账号已生成</p><dl><dt>用户名</dt><dd>${escapeHtml(data.username)}</dd><dt>密码</dt><dd>${escapeHtml(data.password)}</dd></dl><div class="row"><button class="ad-btn" type="button" data-copy-new>复制账号密码</button></div><p class="ad-note">请在下方列表中选择允许访问的案例。</p>`;usersOffset=0;await loadUsers();}catch(e){report(e);}finally{b.disabled=false;}};
$('#new-account').addEventListener('click',async e=>{if(!e.target.closest('[data-copy-new]')||!newAccount)return;try{await navigator.clipboard.writeText(`用户名：${newAccount.username}\n密码：${newAccount.password}`);toast('已复制','账号密码已复制。');}catch(error){report(error);}});
// Delete asks in the row itself: the actions turn into "confirm / cancel" until one is chosen
const rowActions=new WeakMap();
$('#users').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const row=b.closest('tr'),id=row.dataset.id,u=users.find(u=>u.id===id);
 if(b.hasAttribute('data-cases')){await openCaseEditor(u,b);return;}
 if(b.hasAttribute('data-delete')){const ops=b.closest('.ad-ops');rowActions.set(ops,ops.innerHTML);ops.innerHTML='<span class="ad-note">删除后已有登录立即失效</span><button class="ad-btn solid" type="button" data-confirm>确认删除</button><button class="ad-btn" type="button" data-cancel>取消</button>';ops.querySelector('[data-confirm]').focus();return;}
 if(b.hasAttribute('data-cancel')){const ops=b.closest('.ad-ops');ops.innerHTML=rowActions.get(ops);ops.querySelector('[data-delete]').focus();return;}
 b.disabled=true;try{
 if(b.hasAttribute('data-show')){const target=row.querySelector('[data-password]');if(b.textContent==='隐藏密码'){target.textContent='••••••••••••';b.textContent='查看密码';}else{target.textContent=(await api(`/api/admin/users/${id}/password`)).password;b.textContent='隐藏密码';}}
 if(b.hasAttribute('data-copy')){const {password}=await api(`/api/admin/users/${id}/password`);await navigator.clipboard.writeText(`用户名：${u.username}\n密码：${password}`);toast('已复制','账号密码已复制。');}
 if(b.hasAttribute('data-confirm')){await api(`/api/admin/users/${id}`,{method:'DELETE'});$('#new-account').hidden=true;$('#new-account').replaceChildren();newAccount=null;await loadUsers();toast('已删除','账号已删除。');}
 if(b.hasAttribute('data-history')){historyId=id;historyOffset=0;$('#history-user').textContent=u.username;await loadHistory();$('#history').showModal();}
 }catch(e){report(e);}finally{b.disabled=false;}});
async function loadHistory(){const data=await api(`/api/admin/users/${historyId}/logins?offset=${historyOffset}`);$('#events').innerHTML=data.events.length?data.events.map(e=>`<div class="e"><strong data-time="${e.occurred_at}">${ago(e.occurred_at)}</strong><p>${date(e.occurred_at)} · ${escapeHtml(e.ip)} · ${escapeHtml(region(e))}</p></div>`).join(''):'<p class="ad-note">暂无登录记录。</p>';$('#history-prev').disabled=historyOffset===0;$('#history-next').disabled=!data.more;$('#history-pager').hidden=historyOffset===0&&!data.more;}
document.querySelectorAll('dialog:not(#dealer-editor) [data-close]').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#history').addEventListener('close',()=>$('#events').replaceChildren());
$('#history-prev').onclick=()=>{historyOffset-=50;loadHistory().catch(report)};$('#history-next').onclick=()=>{historyOffset+=50;loadHistory().catch(report)};
async function loadInbox(){try{const data=await api(`/api/admin/inbox?offset=${inboxOffset}`);
 $('#messages').innerHTML=data.messages.length?data.messages.map(m=>`<article class="ad-msg"${m.read_at?' data-read':''}><div class="top"><span class="st">${m.read_at?'已读':'未读'}</span><span>${date(m.created_at)}</span></div><h3>${escapeHtml(m.company)} · ${escapeHtml(m.name)}</h3><a class="m" href="mailto:${encodeURIComponent(m.email)}">${escapeHtml(m.email)}</a><dl><div><dt>应用与合作构想</dt><dd${m.read_at?' class="a"':''}>${escapeHtml(m.message)}</dd></div><div><dt>产品理解与开发经验</dt><dd${m.read_at?' class="a"':''}>${escapeHtml(m.experience)}</dd></div></dl>${m.read_at?'':`<div class="row"><button class="ad-btn solid" type="button" data-read="${m.id}">标为已读</button></div>`}</article>`).join(''):'<p class="ad-note">暂无软件合作伙伴申请。</p>';
 $('#inbox-prev').disabled=inboxOffset===0;$('#inbox-next').disabled=!data.more;$('#inbox-page').textContent=`第 ${inboxOffset/50+1} 页`;
 if(inboxOffset===0){const unread=data.messages.filter(m=>!m.read_at).length;$('#unread').textContent=unread;$('#unread').hidden=!unread;}
 }catch(e){report(e);}}
$('#messages').onclick=async e=>{const b=e.target.closest('button[data-read]');if(!b)return;b.disabled=true;try{await api('/api/admin/inbox/'+b.dataset.read,{method:'PATCH'});await loadInbox();}catch(e){report(e);b.disabled=false;}};
// Selecting a tab owns both the visible panel and its data load.
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){if(tab.hidden)return;tabs.forEach(x=>{const on=x===tab;x.setAttribute('aria-selected',String(on));x.tabIndex=on?0:-1;});for(const name of ['users','admins','dealer','inbox'])$('#'+name+'-panel').hidden=tab.dataset.tab!==name;if(tab.dataset.tab==='dealer')return loadDealerMaterials();if(tab.dataset.tab==='inbox')return loadInbox();if(tab.dataset.tab==='admins')return loadAdmins();return loadUsers();}
tabs.forEach(b=>b.onclick=()=>selectTab(b));
$('[role=tablist]').addEventListener('keydown',e=>{const visible=tabs.filter(t=>!t.hidden),i=visible.indexOf(document.activeElement);if(i<0)return;const next={ArrowRight:(i+1)%visible.length,ArrowLeft:(i+visible.length-1)%visible.length,Home:0,End:visible.length-1}[e.key];if(next===undefined)return;e.preventDefault();visible[next].focus();selectTab(visible[next]);});
$('#refresh-users').onclick=loadUsers;$('#refresh-inbox').onclick=loadInbox;
$('#users-prev').onclick=()=>{usersOffset-=50;loadUsers()};$('#users-next').onclick=()=>{usersOffset+=50;loadUsers()};$('#inbox-prev').onclick=()=>{inboxOffset-=50;loadInbox()};$('#inbox-next').onclick=()=>{inboxOffset+=50;loadInbox()};
setInterval(()=>document.querySelectorAll('[data-time]').forEach(e=>e.textContent=ago(Number(e.dataset.time))),30000);

$('#change-password').onclick=()=>{$('#password-form').reset();$('#password-message').replaceChildren();$('#password-dialog').showModal();$('#password-form').elements.current_password.focus();};
$('#required-password').onclick=()=>$('#change-password').click();
$('#password-dialog').addEventListener('close',()=>$('#password-form').reset());
$('#password-form').onsubmit=async event=>{
 event.preventDefault();const form=event.target,button=form.querySelector('[type=submit]');
 if(form.elements.new_password.value!==form.elements.confirm_password.value){say($('#password-message'),'两次输入的新密码不一致','未能保存');return;}
 button.disabled=true;
 try{
  await CASE_AUTH.changePassword({current_password:form.elements.current_password.value,new_password:form.elements.new_password.value});
  $('#password-dialog').close();showLogin();await CASE_AUTH.refresh();
  say($('#login-message'),'密码已修改，所有旧登录已退出。请使用新密码登录。');$('#admin-login').elements.password.focus();
 }catch(error){say($('#password-message'),error.message,'未能保存');if(error.status===401)showLogin();}
 finally{button.disabled=false;}
};

// Every opening owns its draft and requests, even when reopening the same account.
let caseEdit=null;
function caseSummary(){
 const edit=caseEdit;
 const added=[...edit.draft].filter(id=>!edit.original.has(id)).length,removed=[...edit.original].filter(id=>!edit.draft.has(id)).length;
 $('#selected').textContent=`已选 ${edit.draft.size} / ${caseCatalog.length} 个案例`;
 const changes=[];if(added||removed)changes.push(`案例新增 ${added} 个，移除 ${removed} 个`);if(edit.dealerDraft!==edit.dealerOriginal)changes.push(`${edit.dealerDraft?'开启':'关闭'}经销商资料下载`);
 $('#changes').textContent=changes.length?'待保存：'+changes.join('；')+'。':'当前授权未更改';
 caseControls();
}
function caseControls(){
 const edit=caseEdit;
 $('#editor').querySelectorAll('button,input').forEach(e=>{e.disabled=!!edit.busy;});
 $('#close').disabled=$('#cancel').disabled=edit.busy==='saving';
 $('#save').disabled=!!edit.busy||(edit.dealerDraft===edit.dealerOriginal&&edit.draft.size===edit.original.size&&[...edit.draft].every(id=>edit.original.has(id)));
}
function renderCaseChoices(){
 const query=$('#search').value.trim().toLowerCase(),edit=caseEdit;
 const casesMarkup=groups.map((group,index)=>{const members=caseCatalog.filter(c=>c.group===index&&c.name.zh.toLowerCase().includes(query));return members.length?`<section><h3 class="group-title">${escapeHtml(group.zh)}</h3>${members.map(c=>`<label class="case-option"><span class="ad-check"><input type="checkbox" data-case-id="${c.id}" ${edit.draft.has(c.id)?'checked':''} aria-label="${escapeHtml(c.name.zh)}"></span><span class="name">${escapeHtml(c.name.zh)}</span><span class="state">${edit.draft.has(c.id)?'已选择':'未选择'}</span></label>`).join('')}</section>`:'';}).join('');
 $('#case-list').innerHTML=`<section class="dealer-grant-group"><h3 class="group-title">下载中心</h3><label class="case-option"><span class="ad-check"><input type="checkbox" data-dealer-grant aria-label="经销商资料下载" aria-describedby="dealer-permission-help" ${edit.dealerDraft?'checked':''}></span><span class="name">经销商资料下载<small id="dealer-permission-help">统一控制全部经销商资料，不影响案例权限。</small></span><span class="state">${edit.dealerDraft?'已选择':'未选择'}</span></label></section>`+(casesMarkup||'<p class="empty">没有匹配的案例，请换一个名称搜索。</p>');
 caseSummary();
}
async function loadCaseEdit(edit){
 const data=await api(`/api/admin/users/${edit.user.id}/cases`);
 if(caseEdit!==edit)return false;
 edit.version=data.version;edit.original=new Set(data.case_ids);edit.draft=new Set(data.case_ids);edit.dealerOriginal=data.dealer_download;edit.dealerDraft=data.dealer_download;
 return true;
}
async function openCaseEditor(user,button){
 const edit={user,opener:button,busy:'loading'};caseEdit=edit;button.disabled=true;
 try{
  if(!await loadCaseEdit(edit))return;
  edit.busy=null;$('#editor-title').textContent=user.username;$('#search').value='';$('#select-all').textContent=`全选当前 ${caseCatalog.length} 个案例`;
  renderCaseChoices();$('#editor').showModal();
 }catch(e){if(caseEdit===edit){endCaseEdit();report(e);}}finally{button.disabled=false;}
}
$('#case-list').onchange=e=>{const input=e.target;if(input.matches('[data-dealer-grant]')){caseEdit.dealerDraft=input.checked;input.closest('.case-option').querySelector('.state').textContent=input.checked?'已选择':'未选择';caseSummary();return;}if(!input.matches('[data-case-id]'))return;if(input.checked)caseEdit.draft.add(input.dataset.caseId);else caseEdit.draft.delete(input.dataset.caseId);input.closest('.case-option').querySelector('.state').textContent=input.checked?'已选择':'未选择';caseSummary();};
$('#search').oninput=renderCaseChoices;
$('#select-all').onclick=()=>{caseEdit.draft=new Set(caseCatalog.map(c=>c.id));renderCaseChoices();};
$('#clear-all').onclick=()=>{caseEdit.draft.clear();renderCaseChoices();};
function endCaseEdit(){
 const edit=caseEdit;caseEdit=null;
 $('#editor').close();$('#case-list').replaceChildren();edit?.opener.focus();
}
function closeCaseEditor(){if(caseEdit.busy!=='saving')endCaseEdit();}
$('#cancel').onclick=closeCaseEditor;$('#close').onclick=closeCaseEditor;
$('#editor').addEventListener('cancel',e=>{e.preventDefault();closeCaseEditor();});
async function reloadCaseEdit(edit){
 edit.busy='loading';caseControls();
 try{if(await loadCaseEdit(edit))renderCaseChoices();}
 catch(e){if(caseEdit===edit)report(e);}
 finally{if(caseEdit===edit){edit.busy=null;caseControls();}}
}
$('#save').onclick=async()=>{
 const edit=caseEdit;edit.busy='saving';caseControls();
 try{
  await api(`/api/admin/users/${edit.user.id}/cases`,{method:'PUT',body:JSON.stringify({case_ids:[...edit.draft],dealer_download:edit.dealerDraft,version:edit.version})});
  if(caseEdit!==edit)return;
  endCaseEdit();await loadUsers();document.querySelector(`tr[data-id="${edit.user.id}"] [data-cases]`)?.focus();toast('已保存','访问权限已更新，对后续访问立即生效。');
 }catch(e){
  if(caseEdit!==edit)return;
  if(e.status===401)report(e);else{
   $('#changes').textContent=e.message;
   if(e.status===409){const reload=document.createElement('button');reload.className='ad-btn';reload.textContent='重新载入';reload.onclick=()=>reloadCaseEdit(edit);$('#changes').append(' ',reload);}
  }
 }finally{if(caseEdit===edit){edit.busy=null;caseControls();}}
};
let admins=[],adminsOffset=0,statusAdmin=null;
async function loadAdmins(){
 if(!currentUser?.is_owner)return;
 try{const data=await api(`/api/admin/admins?offset=${adminsOffset}`);admins=data.admins;
 $('#admin-accounts').innerHTML=admins.length?admins.map(u=>`<tr data-admin-id="${u.id}"><td data-label="管理员账号"><span class="u">${escapeHtml(u.username)}</span><span class="s account-label">${escapeHtml(u.label||'管理员')}</span></td><td data-label="状态"><span class="${u.disabled_at===null?'status-on':''}">${u.disabled_at!==null?'已停用':u.must_change_password?'待首次修改密码':'可用'}</span></td><td data-label="最近登录">${u.occurred_at?date(u.occurred_at):'尚未登录'}</td><td data-label="操作"><button class="ad-btn" data-admin-status="${u.id}">${u.disabled_at===null?'停用账号':'启用账号'}</button></td></tr>`).join(''):'<tr><td colspan="4">尚未分发管理员账号。</td></tr>';
 $('#admins-prev').disabled=adminsOffset===0;$('#admins-next').disabled=!data.more;$('#admins-page').textContent=`第 ${adminsOffset/50+1} 页`;
 }catch(e){report(e);}
}
$('#admins-prev').onclick=()=>{adminsOffset-=50;loadAdmins();};$('#admins-next').onclick=()=>{adminsOffset+=50;loadAdmins();};
$('#new-admin').onclick=()=>{$('#admin-create-form').reset();$('#admin-create-error').replaceChildren();$('#admin-create-dialog').showModal();};
$('#cancel-admin').onclick=()=>$('#admin-create-dialog').close();
const createError=document.createElement('div');createError.id='admin-create-error';createError.setAttribute('role','status');$('#admin-create-form .save-row').before(createError);
let adminCreating=false;
$('#admin-create-dialog').addEventListener('cancel',e=>{if(adminCreating)e.preventDefault();});
$('#admin-create-form').onsubmit=async e=>{
 e.preventDefault();if(adminCreating)return;adminCreating=true;const form=e.target;form.querySelectorAll('button,input').forEach(b=>b.disabled=true);createError.replaceChildren();
 try{const data=await api('/api/admin/admins',{method:'POST',body:JSON.stringify({label:form.elements.label.value.trim()})});$('#admin-create-dialog').close();
 const box=$('#admin-credentials');box.hidden=false;box.innerHTML=`<p class="k">管理员账号已生成 · 初始密码仅展示一次</p><div class="credential-values"><span>用户名</span>${escapeHtml(data.username)}<br><span>初始密码</span>${escapeHtml(data.password)}</div><p class="ad-note">请将账号密码交给接收人。首次登录必须修改密码；关闭后无法再次查看初始密码。</p><div class="row"><button class="ad-btn" id="copy-admin">复制账号密码</button><button class="ad-btn" id="dismiss-credentials">已记录，关闭</button></div>`;
 $('#copy-admin').onclick=async()=>{try{await navigator.clipboard.writeText(`用户名：${data.username}\n初始密码：${data.password}\n首次登录后请修改密码。`);toast('已复制','管理员账号密码已复制。');}catch(error){report(error);}};
 $('#dismiss-credentials').onclick=()=>{box.hidden=true;box.replaceChildren();$('#new-admin').focus();};adminsOffset=0;await loadAdmins();$('#copy-admin')?.focus();
 }catch(error){if(error.status===401)report(error);else{say(createError,error.unavailable?'请求结果未确认，请关闭窗口并刷新管理员列表核对。不要直接重复创建。':error.message,'未能完成');if(error.unavailable)await loadAdmins();}}
 finally{adminCreating=false;form.querySelectorAll('button,input').forEach(b=>b.disabled=false);}
};
$('#admin-accounts').onclick=e=>{const button=e.target.closest('[data-admin-status]');if(!button)return;statusAdmin=admins.find(u=>u.id===button.dataset.adminStatus);const enabled=statusAdmin.disabled_at===null;$('#admin-status-title').textContent=(enabled?'停用 ':'启用 ')+statusAdmin.username;$('#admin-status-help').textContent=enabled?'停用后，该管理员无法登录，现有登录立即失效。普通用户及其案例权限保持不变。':'启用后，该管理员可重新登录并管理所有普通用户。';$('#confirm-status').textContent=enabled?'确认停用':'确认启用';$('#admin-status-dialog').showModal();};
$('#cancel-status').onclick=()=>$('#admin-status-dialog').close();
let statusSaving=false;
$('#admin-status-dialog').addEventListener('cancel',e=>{if(statusSaving)e.preventDefault();});
$('#confirm-status').onclick=async()=>{const u=statusAdmin;statusSaving=true;$('#admin-status-dialog').querySelectorAll('button').forEach(b=>b.disabled=true);try{await api(`/api/admin/admins/${u.id}`,{method:'PATCH',body:JSON.stringify({enabled:u.disabled_at!==null})});$('#admin-status-dialog').close();await loadAdmins();document.querySelector(`[data-admin-status="${u.id}"]`)?.focus();toast('已保存','管理员状态已更新。');}catch(e){if(e.status===401)report(e);else $('#admin-status-help').textContent=e.message;}finally{statusSaving=false;$('#admin-status-dialog').querySelectorAll('button').forEach(b=>b.disabled=false);}};
const {load:loadDealerMaterials}=setupDealerLibrary({api,toast,report});
init();
