/* Static UI snapshots plus deliberately local demonstration actions. No device transport. */
(() => {
  const {pages,shells,modals,hostCommands}=window.TS_DEMO_PAGES;
  const initialLanguage=new URLSearchParams(location.search).get('lang')||'en';
  let language=initialLanguage.startsWith('zh')?'zh':'en';
  const initialState=()=>({fan:{mode:'auto',duty:40},curve:[[30,20],[45,40],[60,70],[80,100]],curveLimits:[20,100,3,2000],leds:{board:{color:'#ff8800',hue:32,sat:100,brightness:128,on:true},touch:{color:'#ff8800',hue:32,sat:100,brightness:128,on:true},matrix:{color:'#ff8800',hue:32,sat:100,brightness:128,on:true}},engine:'running',rules:{r1:true,r2:true,r3:true,r4:true},hits:{r1:2,r2:2,r3:2,r4:2},models:{'model-27b':{status:'ready',events:['ready']},'model-flash-next':{status:'stopped',events:['stopped']}},path:'/sdcard',host:false});
  const curveFields=['fan-curve-min-duty','fan-curve-max-duty','fan-curve-hysteresis','fan-curve-interval'];
  const modelNames={'model-27b':'Qwen3.8-27B-NVFP4','model-flash-next':'Qwen3.8-Flash-Next-NVFP4'};
  const modelTimers=new Map();
  let state=initialState(),dialogTrigger=null,feedbackTimer=null,otaTimer=null;
  const content=document.getElementById('page-content');
  const dialogs=document.getElementById('demo-dialogs');
  const app=document.getElementById('app');
  const text=(zh,en)=>language==='zh'?zh:en;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId=id=>document.getElementById(id);
  const route=()=>location.hash?(location.hash.slice(2)||'system'):document.body.dataset.page;
  let templates={},fileListTemplate=null;

  function visibleArea(){
    const frame=window.frameElement,host=frame?.closest('.demo-modal-content');
    if(!frame)return {top:0,bottom:innerHeight};
    const frameBounds=frame.getBoundingClientRect(),hostBounds=host?host.getBoundingClientRect():{top:0,bottom:parent.innerHeight};
    const scale=frameBounds.width/innerWidth;
    return {top:Math.max(0,(hostBounds.top-frameBounds.top)/scale),bottom:Math.min(innerHeight,(hostBounds.bottom-frameBounds.top)/scale)};
  }
  function positionDialog(modal){
    const {top,bottom}=visibleArea();
    modal.style.setProperty('--demo-dialog-top',(top+24)+'px');
    modal.style.setProperty('--demo-dialog-height',(bottom-top-48)+'px');
  }
  function feedback(message){
    const box=byId('demo-feedback');box.textContent=message;box.hidden=false;
    box.style.bottom=(innerHeight-visibleArea().bottom+16)+'px';
    clearTimeout(feedbackTimer);feedbackTimer=setTimeout(()=>{box.hidden=true;},3200);
  }
  const previewOnly=()=>feedback(text('此项仅供查看，不执行操作。','Interface preview only; this action is not simulated.'));
  function closeDialog(){
    dialogs.replaceChildren();app.inert=false;
    parent.postMessage({type:'tianshanos-demo-dialog',open:false},location.origin);
    if(dialogTrigger?.isConnected)dialogTrigger.focus({preventScroll:true});
    dialogTrigger=null;
  }
  function openDialog(html){
    if(!dialogs.firstElementChild)dialogTrigger=document.activeElement;
    dialogs.innerHTML=html;
    const modal=dialogs.firstElementChild;modal.style.display='flex';modal.classList.remove('hidden');modal.hidden=false;
    modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
    const title=modal.querySelector('.st,.modal-title,h2,h3');
    if(title){title.id='demo-dialog-title';modal.setAttribute('aria-labelledby',title.id);}
    positionDialog(modal);
    parent.postMessage({type:'tianshanos-demo-dialog',open:true},location.origin);
    app.inert=true;
    const focusable=modal.querySelector('button:not([disabled]),input:not([disabled]),select:not([disabled])');
    if(focusable)focusable.focus({preventScroll:true});
  }
  function info(title,body){
    openDialog(`<div class="modal"><div class="sheet m-float" style="width:560px"><div class="sh"><h2 class="st">${escape(title)}</h2><button class="btn icon round xbtn" data-demo-click="closeDialog()" aria-label="${text('关闭','Close')}"><svg class="i"><use href="#ri-close-line"></use></svg></button></div><div class="sb"><p class="t-body demo-info-body">${escape(body)}</p></div><div class="sf"><button class="btn primary" data-demo-click="closeDialog()">${text('知道了','Got it')}</button></div></div></div>`);
  }
  function prepare(){
    // Native pages contain hidden dialog markup. Store it before rendering a demo dialog.
    templates={};content.querySelectorAll('.modal').forEach(node=>{templates[node.id]=node.outerHTML;node.remove();});
    content.querySelectorAll('[data-demo-click]:not(button):not(a):not(input)').forEach(node=>{
      if(node.querySelector('button,input,select'))return;
      node.tabIndex=0;node.setAttribute('role','button');
    });
  }
  function render(){
    closeDialog();clearInterval(otaTimer);otaTimer=null;
    clearTimeout(feedbackTimer);byId('demo-feedback').hidden=true;
    const page=route();
    if(!pages[language][page]){location.hash='#/system';return;}
    document.documentElement.lang=language==='zh'?'zh-CN':'en';
    document.title=text('TianshanOS 0.6.4 · 界面演示','TianshanOS 0.6.4 · Interface demo');
    byId('demo-header').innerHTML=shells[language];
    byId('demo-note').textContent=text('TianshanOS 0.6.4 界面演示 · 数据和操作均为模拟，不代表真实设备状态。','TianshanOS 0.6.4 interface demo · All data and actions are simulated, not a real device.');
    const connection=byId('ws-status');connection.textContent=text('模拟','Demo');connection.title=text('模拟连接','Demo connection');
    byId('login-btn').textContent=text('重置演示','Reset demo');byId('login-btn').dataset.demoClick='resetDemo()';
    document.querySelectorAll('.nav-link').forEach(link=>{
      const active=(link.hash==='#/'?page==='system':link.hash==='#/'+page)||(page==='ota'&&link.hash==='#/');
      link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');
    });
    const languageButton=byId('lang-switch').querySelector('button');languageButton.setAttribute('aria-label',text('切换为英文','Switch to Chinese'));
    content.innerHTML=pages[language][page];prepare();
    if(page==='system'){
      updateFan();updateLeds();updateModelPanels();
      byId('sys-datetime').textContent='14:30:00';
      if(language==='en')byId('sys-uptime').textContent='1 hour';
      byId('quick-actions-grid').querySelectorAll('[data-demo-click]').forEach(node=>node.setAttribute('aria-label',node.title));
    }
    if(page==='files'){fileListTemplate=byId('file-list').cloneNode(true);renderFiles();}
    if(page==='commands'){
      if(state.host)showCommands();
    }
    if(page==='automation')updateAutomation();
    if(page==='ota'){
      byId('ota-server-input').value='https://demo.invalid/firmware';
      byId('ota-version-meta').textContent=text('ESP32-S3 · 固件与 Web 界面均为 0.6.4 · 示例','ESP32-S3 · Firmware and Web UI 0.6.4 · Sample');
    }
  }
  function modelStatus(status){
    return {ready:text('已就绪','Ready'),starting:text('启动中','Starting'),stopped:text('已停止','Stopped')}[status];
  }
  function updateModelPanels(){
    for(const [id,model] of Object.entries(state.models)){
      const status=modelStatus(model.status);
      document.querySelectorAll(`[data-demo-model-status="${id}"]`).forEach(lamp=>{
        lamp.textContent=status;lamp.className='state service-lamp'+(model.status==='ready'?' ok':model.status==='starting'?' active':'');
        lamp.dataset.state=model.status;lamp.title=modelNames[id]+': '+status;
      });
      const record=dialogs.querySelector(`[data-demo-model-record="${id}"]`);
      if(record){
        record.querySelector('[data-run-status]').textContent=text('模拟结果：','Simulated result: ')+status;
        record.querySelector('[data-run-action="stop"]').disabled=model.status==='stopped';
      }
    }
  }
  function showModelLogs(id){
    const messages={ready:text('就绪日志匹配，模型服务已就绪。','Readiness log matched; the model service is ready.'),starting:text('已接受启动请求，等待就绪日志。','Start request accepted; waiting for the readiness log.'),stopped:text('模型服务已停止。','The model service is stopped.')};
    info(modelNames[id]+' · '+text('模拟日志','Simulated log'),state.models[id].events.map((status,index)=>`[${String(index+1).padStart(2,'0')}] ${messages[status]}`).join('\n'));
  }
  function updateFan(){
    const card=content.querySelector('.fan-card');
    const {mode,duty}=state.fan;
    const labels={off:text('关闭','Off'),manual:text('手动','Manual'),curve:text('曲线','Curve'),auto:text('智能','Smart')};
    card.querySelector('.t-section').textContent=text('风扇 0','Fan 0');
    card.classList.toggle('is-off',mode==='off');
    card.querySelector('.state').textContent=mode==='auto'?text('跟随曲线','Following curve'):labels[mode];
    card.querySelector('.tti').hidden=mode!=='auto';
    card.querySelector('.fan-meta').hidden=mode!=='auto';
    card.querySelector('.fan-speed-num').textContent=duty;
    card.querySelector('.fan-rpm').textContent=(duty===0?0:Math.round(duty*46))+' RPM';
    card.querySelectorAll('.seg button').forEach(button=>{
      const value=button.dataset.demoClick.match(/'(\w+)'/)[1];
      button.classList.toggle('on',value===mode);button.setAttribute('aria-pressed',String(value===mode));
      button.textContent=labels[value];
    });
    let recommendation=card.querySelector('.demo-recommended');
    if(!recommendation){recommendation=document.createElement('p');recommendation.className='demo-recommended';card.querySelector('.seg').after(recommendation);}
    recommendation.textContent=text('推荐模式：智能（TTI）','Recommended: Smart (TTI)');
    const slider=byId('fan-slider-0');slider.value=duty;slider.disabled=mode!=='manual';slider.setAttribute('aria-label',text('风扇 0 转速','Fan 0 speed'));
    slider.title=mode==='manual'?'':text('切换到手动模式后可调节','Switch to manual mode to adjust');
    slider.closest('.sl').style.setProperty('--p',duty+'%');slider.closest('.slrow').classList.toggle('disabled',mode!=='manual');
    card.querySelector('.fan-slider-value').textContent=duty+'%';byId('fan-global-duty').textContent=duty+'%';
  }
  function hsvColor(h,s){
    const f=n=>{const k=(n+h/60)%6;return 1-s/100*Math.max(0,Math.min(k,4-k,1));};
    return '#'+[f(5),f(3),f(1)].map(value=>Math.round(value*255).toString(16).padStart(2,'0')).join('');
  }
  function updateLeds(){
    for(const [name,led] of Object.entries(state.leds)){
      const hue=byId('led-'+name+'-hue'),sat=byId('led-'+name+'-sat'),slider=byId('brightness-'+name);
      hue.value=led.hue;sat.value=led.sat;
      byId('led-'+name+'-hue-val').textContent=led.hue+'°';byId('led-'+name+'-sat-val').textContent=led.sat+'%';
      for(const [input,percent] of [[hue,led.hue/359*100],[sat,led.sat]]){input.parentElement.style.setProperty('--p',percent+'%');input.parentElement.style.setProperty('--c',led.color);}
      sat.parentElement.style.setProperty('--end',hsvColor(led.hue,100));slider.value=led.brightness;byId('brightness-val-'+name).textContent=led.brightness;
      const card=hue.closest('.led-device-card');
      card.classList.toggle('is-on',led.on);
      const status=card.querySelector('.led-device-status');status.textContent=led.on?text('常亮','Static'):text('关闭','Off');status.classList.toggle('ok',led.on);
      const toggle=byId('toggle-'+name);toggle.classList.toggle('on',led.on);toggle.setAttribute('aria-pressed',String(led.on));
      toggle.title=text(led.on?'点击关闭':'点击开启',led.on?'Click to turn off':'Click to turn on');toggle.setAttribute('aria-label',toggle.title);
      slider.closest('.sl').style.setProperty('--p',(led.brightness/255*100)+'%');
    }
  }
  function drawCurve(){
    const canvas=dialogs.querySelector('canvas,.demo-curve-preview');
    const curve=Array.from(dialogs.querySelectorAll('#fan-curve-points>.row'),row=>Array.from(row.querySelectorAll('input'),input=>Number(input.value)));
    const points=curve.map(([temperature,duty])=>`${20+(temperature+20)/140*360},${145-duty*1.25}`).join(' ');
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 400 160');svg.classList.add('demo-curve-preview');svg.setAttribute('role','img');svg.setAttribute('aria-label',text('风扇 0 温度与转速曲线','Fan 0 temperature and speed curve'));
    svg.innerHTML=`<path d="M20 10V145H390" fill="none" stroke="#bcc4cf"/><polyline points="${points}" fill="none" stroke="#007aff" stroke-width="2.5"/>`;
    canvas.replaceWith(svg);
  }
  const sampleFiles={
    '/sdcard':[['config','dir'],['logs','dir'],['system.json','file'],['README.txt','file']],
    '/sdcard/config':[['cooling.json','file']],'/sdcard/logs':[['system.log','file']],'/spiffs':[['index.html','file']],'/':[['sdcard','dir'],['spiffs','dir']]
  };
  function fileContent(name){
    if(name.endsWith('.json'))return JSON.stringify(name==='cooling.json'?{fan_id:0,mode:state.fan.mode,curve:state.curve}:{device:'RM-01',version:'0.6.4',demo:true},null,2);
    return text('TianshanOS 0.6.4 模拟文件\n风扇 0：智能（TTI）\n没有连接真实设备。','TianshanOS 0.6.4 sample file\nFan 0: Smart (TTI)\nNo device is connected.');
  }
  function renderFiles(){
    const entries=sampleFiles[state.path];
    const root=state.path.startsWith('/spiffs')?'/spiffs':state.path==='/'?'/':'/sdcard';
    byId('breadcrumb').innerHTML=`<button class="field" data-demo-click="navigateToPath('${root}')">${root}</button><span class="t-note">${escape(state.path.slice(root.length)||'/')}</span>`;
    byId('storage-controls').querySelectorAll('[data-demo-click^="navigateToPath"]').forEach(button=>button.classList.toggle('on',button.dataset.demoClick.includes("'"+root+"'")));
    byId('file-list').replaceChildren(fileListTemplate.querySelector('.th').cloneNode(true));
    for(const [name,type] of entries){
      const row=fileListTemplate.querySelector(`[data-type="${type}"]`).cloneNode(true);
      row.dataset.name=name;row.dataset.path=(state.path==='/'?'':state.path)+'/'+name;
      const file=row.querySelector('.file-name');file.dataset.demoClick=`demoFile('${name}','${type}')`;file.setAttribute('role','button');file.tabIndex=0;
      file.querySelector('.fn').lastChild.textContent=name;
      const checkbox=row.querySelector('input');checkbox.setAttribute('aria-label',name);checkbox.dataset.path=row.dataset.path;
      row.querySelectorAll('.btn-rename,.btn-delete,.btn-download').forEach(button=>button.dataset.demoClick='previewOnly()');
      byId('file-list').append(row);
    }
  }
  function updateAutomation(){
    const status=content.querySelector('#automation-status .stat-st');
    status.innerHTML='<i></i>'+{running:text('运行中','Running'),stop:text('已停止','Stopped'),pause:text('已暂停','Paused')}[state.engine];
    status.className='stat-st '+(state.engine==='running'?'ok':'warn');
    const values=content.querySelectorAll('#automation-status .stat-v');
    values[1].textContent='4';values[2].textContent='2';values[4].textContent=Object.values(state.hits).reduce((a,b)=>a+b,0);
    content.querySelectorAll('[data-demo-click^="toggleRule"]').forEach(button=>{
      const id=button.dataset.demoClick.match(/["']([^"']+)/)[1],enabled=state.rules[id];
      button.classList.toggle('on',enabled);button.setAttribute('aria-checked',String(enabled));
      button.setAttribute('aria-label',text(enabled?'停用规则':'启用规则',enabled?'Disable rule':'Enable rule')+' '+id);
      button.closest('.tr').children[5].textContent=state.hits[id];
    });
  }
  function showCommands(hostId=state.host){
    state.host=hostId;
    if(hostId==='__orphan__'){
      const template=document.createElement('div');template.innerHTML=pages[language].commands;
      byId('commands-list').innerHTML=template.querySelector('#commands-list').innerHTML;
    }else byId('commands-list').innerHTML=hostCommands[language];
    content.querySelectorAll('[data-host-id]').forEach(button=>button.classList.toggle('on',button.dataset.hostId===hostId));
  }
  function dispatch(action,element){
    const handler=action.match(/(?:window\.)?(\w+)\(/)?.[1];
    const args=Array.from(action.matchAll(/['"]([^'"]*)['"]/g),m=>m[1]);
    const first=args[0];
    if(handler==='closeDialog')return closeDialog();
    if(handler==='previewOnly')return previewOnly();
    if(handler==='resetDemo'){
      for(const timer of modelTimers.values())clearTimeout(timer);modelTimers.clear();
      state=initialState();language='en';
      if(route()==='system')render();else location.hash='#/system';
      return;
    }
    if(handler==='toggleLanguageMenu'){language=language==='zh'?'en':'zh';render();return;}
    if(handler==='navigate'){location.hash='#/'+first.slice(1);return;}
    if(handler==='showFanAutoHelpModal'){openDialog(modals[language].tti);return;}
    if(handler==='setFanMode'){state.fan.mode=first;state.fan.duty=first==='off'?0:first==='manual'?40:Math.min(state.curveLimits[1],Math.max(state.curveLimits[0],40));updateFan();return;}
    if(handler==='showFanCurveModal'){
      openDialog(modals[language].curve);
      byId('fan-curve-temp-current').textContent='44.0 °C';byId('fan-curve-temp-current').style.color='var(--ink-2)';
      byId('variable-bind-status').textContent=text('已绑定：demo.temperature','Bound: demo.temperature');byId('variable-bind-status').className='state ok';
      dialogs.querySelectorAll('#temp-var-bindings-container optgroup').forEach(group=>{if(!group.querySelector('option[value="demo.temperature"]'))group.remove();});
      curveFields.forEach((id,index)=>byId(id).value=state.curveLimits[index]);
      const rows=dialogs.querySelector('#fan-curve-points');
      const template=rows.firstElementChild.cloneNode(true);rows.replaceChildren();
      for(const [index,point] of state.curve.entries()){
        const row=template.cloneNode(true);row.querySelector('.rl').textContent=text('节点 ','Point ')+(index+1);
        row.querySelectorAll('input').forEach((input,i)=>input.value=point[i]);
        row.querySelector('button').dataset.demoClick=`removeCurvePoint(${index})`;rows.append(row);
      }
      drawCurve();return;
    }
    if(handler==='addCurvePoint'||handler==='removeCurvePoint'){
      const rows=dialogs.querySelector('#fan-curve-points');
      if(handler==='addCurvePoint'){
        if(rows.children.length===10)return feedback(text('最多 10 个节点。','Maximum 10 points.'));
        if(Number(rows.lastElementChild.querySelector('input').value)>=120)return feedback(text('最后一个节点已达到 120°C。','The last point is already at 120°C.'));
        const row=rows.lastElementChild.cloneNode(true);const temp=row.querySelector('input');
        temp.value=Math.min(120,Number(temp.value)+10);rows.append(row);
      }else{
        if(rows.children.length===2)return feedback(text('至少保留两个节点。','Keep at least two points.'));
        rows.children[Number(action.match(/\((\d+)/)[1])].remove();
      }
      Array.from(rows.children).forEach((row,index)=>{row.querySelector('.rl').textContent=text('节点 ','Point ')+(index+1);row.querySelector('button').dataset.demoClick=`removeCurvePoint(${index})`;});
      drawCurve();return;
    }
    if(handler==='applyFanCurve'){
      const rows=dialogs.querySelectorAll('#fan-curve-points>div');
      const points=Array.from(rows,row=>Array.from(row.querySelectorAll('input')).map(input=>Number(input.value)));
      const inputs=[...dialogs.querySelectorAll('#fan-curve-points input'),...curveFields.map(byId)];
      const limits=curveFields.map(id=>Number(byId(id).value));
      if(inputs.some(input=>input.value===''||!input.checkValidity())||limits[0]>limits[1]||points.some(([temp],i)=>i>0&&temp<=points[i-1][0]))return feedback(text('请使用输入框允许的数值、递增的节点温度，且最小转速不能高于最大转速。','Use valid input values and increasing point temperatures. Minimum speed cannot exceed maximum speed.'));
      state.curve=points;state.curveLimits=limits;
      if(state.fan.mode==='auto'||state.fan.mode==='curve'){state.fan.duty=Math.min(limits[1],Math.max(limits[0],state.fan.duty));updateFan();}
      closeDialog();feedback(text('模拟曲线已保存，仅本次演示有效。','Demo curve saved for this session only.'));return;
    }
    if(handler==='switchNetTab'){
      for(const name of ['eth','wifi']){const panel=byId('net-tab-'+name);panel.style.display=name===first?'':'none';panel.classList.toggle('hidden',name!==first);}
      content.querySelectorAll('[data-demo-click^="switchNetTab"]').forEach(button=>button.classList.toggle('on',button===element));return;
    }
    if(handler==='navigateToPath'){state.path=first;renderFiles();return;}
    if(handler==='demoFile'){
      if(args[1]==='dir'){state.path=(state.path==='/'?'':state.path)+'/'+first;renderFiles();}
      else info(first,fileContent(first));return;
    }
    if(handler==='terminalClear'){byId('demo-terminal-output').textContent='';return;}
    if(handler==='automationControl'){
      state.engine=first==='start'||first==='reload'?'running':first;updateAutomation();
      feedback(text('模拟引擎状态已更新。','Demo engine state updated.'));return;
    }
    if(handler==='toggleRule'){
      const enabled=!state.rules[first];state.rules[first]=enabled;
      updateAutomation();feedback(text(enabled?'模拟规则已启用。':'模拟规则已停用。',enabled?'Demo rule enabled.':'Demo rule disabled.'));return;
    }
    if(handler==='startModel'){
      if(state.engine!=='running')return feedback(text('模拟引擎未运行，未启动模型。','The demo engine is not running; the model was not started.'));
      const model=state.models[first];
      if(model.status==='ready'||model.status==='starting')return feedback(text('该模拟模型已就绪或正在启动。','This demo model is already ready or starting.'));
      model.status='starting';model.events.push('starting');updateModelPanels();
      modelTimers.set(first,setTimeout(()=>{
        modelTimers.delete(first);model.status='ready';model.events.push('ready');updateModelPanels();
      },900));return;
    }
    if(handler==='stopModel'){
      clearTimeout(modelTimers.get(first));modelTimers.delete(first);
      const model=state.models[first];model.status='stopped';model.events.push('stopped');updateModelPanels();return;
    }
    if(handler==='showModelLogs'){showModelLogs(first);return;}
    if(handler==='verifyModel'){updateModelPanels();feedback(text('本地模拟状态已刷新，未检查远程主机。','Local demo state refreshed; no remote host was checked.'));return;}
    if(handler==='showServiceRuns'){openDialog(modals[language]['service-runs']);updateModelPanels();return;}
    if(handler==='triggerRule'||handler==='triggerQuickAction'){
      if(state.engine!=='running')return feedback(text('模拟引擎未运行，未执行规则。','The demo engine is not running; the rule was not executed.'));
      if(state.rules[first]===false)return feedback(text('模拟规则已停用，未执行。','This demo rule is disabled; it was not executed.'));
      state.hits[first]++;
      const message=text('模拟执行完成：状态检查通过。','Simulated run complete: status check passed.');
      const row=element.closest('.tr');
      if(row){updateAutomation();let record=row.nextElementSibling;if(!record?.classList.contains('demo-rule-record')){record=document.createElement('p');record.className='demo-rule-record';row.after(record);}record.textContent=message;}
      feedback(message);return;
    }
    if(handler==='editRule'||handler==='showSourceVariables'||handler==='editAction'||handler==='editSource'){
      info(element.getAttribute('aria-label')||text('规则详情','Rule details'),text('示例：读取设备温度 → 检查温度条件 → 记录状态。此演示不运行真实规则。','Sample: read device temperature → check the condition → record status. No real rule is executed.'));return;
    }
    if(handler==='toggleCommand'){
      const code=element.closest('.command-card').querySelector('.cmd-code');code.hidden=!code.hidden;
      element.setAttribute('aria-expanded',String(!code.hidden));element.querySelector('span').textContent=code.hidden?text('显示命令','Show command'):text('隐藏命令','Hide command');return;
    }
    if(handler==='selectHost'){showCommands(first);return;}
    if(handler==='demoExecute'){
      byId('exec-result-section').style.display='';byId('exec-result').textContent=`$ ${element.closest('.command-card').querySelector('.cmd-code').textContent}\nTianshanOS 0.6.4\nFan 0: ${state.fan.mode==='auto'?'Smart (TTI)':state.fan.mode}, ${state.fan.duty}%, ${Math.round(state.fan.duty*46)} RPM\n`+text('[模拟执行完成]','[Simulated execution complete]');return;
    }
    if(handler==='stopEffect'){state.leds[first].on=true;updateLeds();feedback(text('模拟效果已停止，保留当前颜色。','Demo effect stopped; the current color is retained.'));return;}
    if(handler==='quickFillColor'){state.leds[first].color=args[1];state.leds[first].on=true;updateLeds();return;}
    if(handler==='toggleLed'){state.leds[first].on=!state.leds[first].on;updateLeds();return;}
    if(handler==='allLedsOff'){Object.values(state.leds).forEach(led=>led.on=false);updateLeds();return;}
    if(handler==='openLedModal'){
      openDialog(modals[language]['led-'+args[1]]);
      if(first!=='matrix'){
        dialogs.querySelector('.sb>.seg').remove();
        dialogs.querySelector('.st').textContent=text('LED 设置 · ','LED Settings · ')+first.charAt(0).toUpperCase()+first.slice(1);
      }
      return;
    }
    if(handler==='checkForUpdates'){
      const status=byId('ota-update-status');status.style.display='block';status.textContent=text('模拟检查完成：当前演示版本为 0.6.4。可预览升级过程。','Demo check complete: version 0.6.4. Preview the update process.');
      const button=document.createElement('button');button.className='btn primary';button.dataset.demoClick='demoUpgrade()';button.textContent=text('预览升级过程','Preview update');status.append(document.createElement('br'),button);return;
    }
    if(handler==='demoUpgrade'){
      clearInterval(otaTimer);let progress=0;byId('ota-progress-section').style.display='';
      byId('ota-state-text').textContent=text('模拟升级','Simulated update');
      otaTimer=setInterval(()=>{progress+=20;byId('ota-progress-bar').style.width=progress+'%';byId('ota-progress-percent').textContent=progress+'%';if(progress===100){clearInterval(otaTimer);otaTimer=null;byId('ota-state-text').textContent=text('模拟完成，版本仍为 0.6.4，未重启设备。','Demo complete. Version remains 0.6.4; no device was restarted.');}},400);return;
    }
    if(handler==='abortOta'){clearInterval(otaTimer);otaTimer=null;byId('ota-state-text').textContent=text('模拟升级已取消','Demo update cancelled');return;}
    if(handler==='exportKey'||handler==='exportPrivateKey'||handler==='showCertViewModal'||handler==='showConfigPackExportCertModal'){
      info(text('示例凭据','Sample credential'),text('仅展示字段和操作入口。演示不包含可用的私钥、证书或真实设备凭据。','Fields and actions are illustrative. This demo contains no usable private keys, certificates or device credentials.'));return;
    }
    const modalIds={showApConfig:'ap-config-modal',showUploadDialog:'upload-modal',showNewFolderDialog:'newfolder-modal',showAddCommandModal:'command-modal',showGenerateKeyModal:'keygen-modal',showDeployKeyModal:'deploy-key-modal',showRevokeKeyModal:'revoke-key-modal',showCertGenKeyModal:'cert-genkey-modal',showCertCSRModal:'cert-csr-modal',showCertInstallModal:'cert-install-modal',showCertInstallCAModal:'cert-ca-modal',showConfigPackImportModal:'pack-import-modal',showConfigPackExportModal:'pack-export-modal',showConfigPackListModal:'pack-list-modal',showServicesModal:'services-modal',showTerminalLogsModal:'terminal-logs-modal'};
    if(Object.hasOwn(modalIds,handler)){openDialog(templates[modalIds[handler]]);return;}
    const extraModals={showAutomationConfig:'automation-config',showUserVariables:'user-variables',showServiceRuns:'service-runs'};
    if(Object.hasOwn(extraModals,handler)){openDialog(modals[language][extraModals[handler]]);return;}
    if(handler==='showWidgetManager'){
      openDialog(modals[language].widgets);return;
    }
    if(handler==='showMemoryDetailModal'){
      info(text('内存详情','Memory details'),'DRAM: 128 / 320 KB (40%)\nPSRAM: 2.0 / 8.0 MB (25%)\n'+text('以上均为示例数据。','All readings are sample data.'));return;
    }
    if(handler==='showWifiScan'||handler==='showDhcpClients'||handler==='showApStations'){
      info(text('网络示例','Network sample'),text('以太网：192.0.2.10\n演示主机：192.0.2.30\n此操作不会扫描或连接网络。','Ethernet: 192.0.2.10\nDemo host: 192.0.2.30\nThis action does not scan or connect to a network.'));return;
    }
    throw new Error('Unmapped demo action: '+handler);
  }
  document.addEventListener('click',event=>{
    const element=event.target.closest('[data-demo-click]');
    if(element){event.preventDefault();dispatch(element.dataset.demoClick,element);}
    else if(event.target.classList.contains('modal'))closeDialog();
  });
  document.addEventListener('input',event=>{
    const input=event.target;
    if(input.id==='fan-slider-0'){state.fan.duty=Number(input.value);updateFan();}
    if(input.id.startsWith('brightness-')){state.leds[input.id.slice(11)].brightness=Number(input.value);updateLeds();}
    const colorControl=input.id.match(/^led-(board|touch|matrix)-(hue|sat)$/);
    if(colorControl){const led=state.leds[colorControl[1]];led[colorControl[2]]=Number(input.value);led.color=hsvColor(led.hue,led.sat);led.on=true;updateLeds();}
    if(input.closest('#fan-curve-points'))drawCurve();
  });
  document.addEventListener('change',event=>{
    const control=event.target.id.match(/^led-(board|touch|matrix)-sat$/);
    if(control){const led=state.leds[control[1]];if(led.sat>0&&led.sat<=3){led.sat=0;led.color=hsvColor(led.hue,0);updateLeds();}}
  });
  document.addEventListener('submit',event=>{
    event.preventDefault();
    if(event.target.id!=='demo-terminal-form'){previewOnly();return;}
    const input=byId('demo-terminal-command'),command=input.value.trim();
    const responses={help:'help · status · fan · clear',status:'TianshanOS 0.6.4 · ESP32-S3 · '+text('模拟数据','Sample data'),fan:`Fan 0: ${state.fan.mode==='auto'?'Smart (TTI)':state.fan.mode}, ${state.fan.duty}%`};
    if(command==='clear')byId('demo-terminal-output').textContent='';
    else byId('demo-terminal-output').textContent+='\ndemo> '+command+'\n'+(responses[command]||text('仅支持 help、status、fan、clear 示例命令。','Available sample commands: help, status, fan, clear.'))+'\n';
    input.value='';
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&dialogs.firstElementChild){event.preventDefault();event.stopImmediatePropagation();closeDialog();return;}
    if(event.key==='Tab'&&dialogs.firstElementChild){
      const controls=Array.from(dialogs.querySelectorAll('button,input,select,textarea,[tabindex="0"]')).filter(el=>!el.disabled&&el.getClientRects().length);
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
    if((event.key==='Enter'||event.key===' ')&&event.target.matches('[role="button"][data-demo-click]')){event.preventDefault();event.target.click();}
  },true);
  let lastHeight=0;
  new ResizeObserver(()=>{
    const height=Math.max(720,Math.ceil(app.getBoundingClientRect().height));
    if(height!==lastHeight){lastHeight=height;parent.postMessage({type:'tianshanos-demo-height',height},location.origin);}
  }).observe(app);
  function layoutOverlays(){
    if(dialogs.firstElementChild)positionDialog(dialogs.firstElementChild);
    if(!byId('demo-feedback').hidden)byId('demo-feedback').style.bottom=(innerHeight-visibleArea().bottom+16)+'px';
  }
  addEventListener('resize',layoutOverlays);
  addEventListener('message',event=>{if(event.origin===location.origin&&event.source===parent&&event.data?.type==='tianshanos-demo-layout')layoutOverlays();});
  addEventListener('hashchange',render);render();
})();
