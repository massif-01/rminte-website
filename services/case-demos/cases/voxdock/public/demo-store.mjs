// Only fictional records and in-memory changes. This module never sends a request.
const now = () => Math.floor(Date.now()/1000);
const started = now();
const sampleSize = 8963;
const sampleHash = '8a8448c9e82cc5e3be79c2b9554da27dea4398818dfdcea1a167e499ad26ae5c';
const folders = [{id:1,name:'门店培训'},{id:2,name:'项目例会'}];
const tags = [{id:1,name:'待跟进'},{id:2,name:'已确认'}];
const profile = {group_memberships:[{group_name:'演示项目组'}]};
const metadata = (folderId, tagIds) => ({folder:folders.find(f=>f.id===folderId),tags:tags.filter(t=>tagIds.includes(t.id))});
const createDevice = (id,name,userId,seen=null) => ({id,name,user_id:userId,folder_id:null,tags:'[]',seen,binding_metadata:{},removed_at:null});
const users = [{id:1,name:'演示人员甲',profile},{id:2,name:'演示人员乙',profile}];
const devices = [createDevice('card-01','会议录音卡片',1,started-25),createDevice('badge-02','随身录音胸牌',2,started-70),createDevice('clip-03','便携录音夹',null)];
const retired = createDevice('old-04','旧演示录音夹',null,started-3500);
retired.removed_at=started-30;devices.push(retired);
function recording(id,title,deviceId,userId,state,minutes,extra={}) {
  const received=state!=='uploading';
  return {id,title,device_id:deviceId,user_id:userId,state,received,recording_id:id+'-sample',size:sampleSize,offset:received?sampleSize:Math.floor(sampleSize*.64),created:started-minutes*60,aac_check:received?'演示校验通过':null,sha256:sampleHash,folder_id:1,tags:'[1]',speakr_generation:0,speakr_id:null,delivery_outcome:'unattempted',metadata:{...metadata(1,[1]),audio_duration:11},...extra};
}
const uploads = [
  recording('meeting-01','门店培训安排','card-01',1,'ready',4,{speakr_id:101,delivery_outcome:'accepted'}),
  recording('meeting-02','培训材料讨论','badge-02',2,'processing',12,{speakr_id:102,delivery_outcome:'accepted'}),
  recording('meeting-03','培训执行例会','card-01',1,'transcription_failed',19,{speakr_id:103,delivery_outcome:'accepted',error:'模拟转写失败'}),
  recording('meeting-04','培训现场记录','clip-03',null,'uploading',25),
  recording('meeting-05','培训筹备沟通','old-04',null,'received',32),
  recording('meeting-06','培训任务确认','badge-02',2,'delivery_unknown',41,{delivery_outcome:'unknown'}),
  recording('meeting-07','培训物料检查','card-01',1,'received',56,{delivery_outcome:'rejected'}),
  recording('meeting-08','培训准备会','badge-02',2,'ready',85,{speakr_id:108,delivery_outcome:'accepted'})
];
const publication = r => ({user_id:r.user_id,upload_id:r.id,hash:`sample-${r.id}`,metadata:{...r.metadata,title:r.title}});
const publications=uploads.filter(r=>r.state==='ready').map(publication);
const events=[{kind:'received',detail:'meeting-01',created:started-4*60},{kind:'worker_error',detail:'meeting-03 模拟转写失败',created:started-19*60},{kind:'device_registered',detail:'card-01',created:started-90*60}];
const config={speakr_url:'https://speakr.example',speakr_generation:0,asr_note:'演示数据，未连接任何服务',archive_path:'/demo/archive'};
const device_connection={url:'http://voxdock.example:8766'};
let signedIn=true,password='demo-access',nextDevice=5,nextPerson=3,nextCredential=1;
const session=()=>({username:'demo',initial_password:password==='demo-access'});
function reject(message,status=400){throw Object.assign(new Error(message),{status});}
const event=(kind,detail)=>events.unshift({kind,detail,created:now()});
const byId=(rows,id)=>rows.find(r=>String(r.id)===String(id));
const applyCategories=(item,data,key)=>{
  item.folder_id=data.folder_id;
  item.tags=JSON.stringify(data.tags);
  item[key]={...item[key],...metadata(data.folder_id,data.tags)};
};
function publish(r) {
  Object.assign(r,{state:'ready',speakr_id:r.speakr_id||100+uploads.indexOf(r)+1,delivery_outcome:'accepted',error:null});
  if(!publications.some(p=>p.upload_id===r.id))publications.push(publication(r));
  event('received',`${r.id} 演示归档已更新`);
}

export async function demoRequest(path,{method='GET',body}={},auth=false) {
  const data=body?JSON.parse(body):{};
  if(auth){
    if(path==='login'&&method==='POST'){
      if(data.username!=='demo'||data.password!==password)reject('请使用演示账号和本次演示密码。');
      signedIn=true;return session();
    }
    if(!signedIn)reject('请先登录演示账号。',401);
    if(path==='session'&&method==='GET')return session();
    if(path==='logout'&&method==='POST'){signedIn=false;return {};}
    if(path==='password'&&method==='POST'){
      if(data.current_password!==password)reject('当前演示密码不正确。');
      password=data.new_password;return session();
    }
  }
  if(!signedIn)reject('请先登录演示账号。',401);
  const [route,query]=path.split('?'),[group,id,action]=route.split('/');
  if(path==='state'&&method==='GET')return structuredClone({users,devices,uploads,publications,events,config,device_connection});
  if(path==='sync'&&method==='POST'){
    uploads.filter(r=>r.state==='processing'&&byId(users,r.user_id)&&r.speakr_generation===config.speakr_generation).forEach(publish);
    event('sync_completed','已检查当前演示录音。');return {};
  }
  if(path==='config'&&method==='PUT'){
    const url=data.speakr_url.replace(/\/$/,'');
    if(url!==config.speakr_url){
      if(users.length)reject('请先解除所有演示人员关联，再保存新地址。',409);
      config.speakr_generation++;config.speakr_url=url;
    }
    config.asr_note=data.asr_note;event('config_saved','演示配置已更新。');return {};
  }
  if(group==='users'){
    if(action==='categories'&&method==='GET'&&byId(users,id))return {folders,tags};
    if(method==='POST'&&(!id||id==='verify')){
      if(!data.token.trim())reject('请输入演示授权码。');
      const person=data.expected_user_id?byId(users,data.expected_user_id):{id:nextPerson,name:`演示人员 ${nextPerson}`,profile};
      if(!person)reject('演示人员不存在。',404);
      if(id==='verify')return {id:person.id,name:person.name,...profile};
      if(!data.expected_user_id){users.push(person);nextPerson++;}
      return {id:person.id};
    }
    if(method==='DELETE'&&byId(users,id)){
      if(Number(new URLSearchParams(query).get('generation'))!==config.speakr_generation)reject('演示连接已变化，请重新打开。',409);
      const person=byId(users,id);users.splice(users.indexOf(person),1);
      devices.filter(d=>d.user_id===person.id).forEach(d=>Object.assign(d,{user_id:null,folder_id:null,tags:'[]',binding_metadata:{}}));
      uploads.filter(r=>r.user_id===person.id).forEach(r=>r.unlinked_owner_name=person.name);
      event('person_unlinked',person.name);return {};
    }
  }
  if(group==='devices'){
    const d=byId(devices,id);
    const credential=()=>String(nextCredential++).padStart(8,'0');
    if(method==='POST'&&action==='rotate'&&d)return {credential:credential()};
    if(method==='DELETE'&&d){d.removed_at=now();event('device_removed',id);return {};}
    if((method==='POST'&&!id)||(method==='PUT'&&d)){
      const item=d||createDevice(`device-${nextDevice++}`,data.name,data.user_id);
      if(!d)devices.push(item);
      item.name=data.name;item.user_id=data.user_id;applyCategories(item,data,'binding_metadata');
      if(data.user_id)uploads.filter(r=>r.device_id===item.id&&r.received&&r.user_id===null).forEach(r=>{r.user_id=data.user_id;r.state='processing';});
      event(d?'device_rebound':'device_registered',item.id);return d?{}:{credential:credential()};
    }
  }
  if(group==='uploads'){
    const r=byId(uploads,id);
    if(r&&method==='PUT'&&action==='classification'){
      applyCategories(r,data,'metadata');
      if(data.user_id){r.user_id=data.user_id;r.state='processing';}
      event('recording_assigned',r.id);return {};
    }
    if(r&&method==='POST'&&['retry','retranscribe','link'].includes(action)){
      if(action==='link')r.speakr_id=data.speakr_id;
      publish(r);return {action_result:{message:'已完成演示操作，可查看归档。'}};
    }
  }
  reject('此操作不在演示范围内。',404);
}

export function transcript(path) {
  const [userId,uploadId]=path.split('/');
  if(!publications.some(p=>String(p.user_id)===userId&&p.upload_id===uploadId))reject('演示逐字稿不可读。',404);
  return '## 转写原文（演示）\n\n这是虚构的会议演示。今天确认门店培训安排：周三完成试讲，周五发布培训材料。项目负责人明天下班前汇总问题。\n\n## 会议总结（演示）\n\n决定：周三完成试讲，周五发布培训材料。\n\n待办：项目负责人明天下班前汇总问题。';
}
