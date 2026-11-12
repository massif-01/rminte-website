// One shared view. cases.js owns the operation; every async callback checks it.
window.CASE_DEMO = (() => {
  const modal=document.querySelector('#case-demo-modal'),head=modal.querySelector('.case-demo-head');
  const title=modal.querySelector('h2'),close=modal.querySelector('[data-case-demo-close]');
  const mount=modal.querySelector('.case-demo-mount'),status=modal.querySelector('.case-demo-status');
  const message=status.querySelector('[role=status]'),action=status.querySelector('button');
  const READY_TIMEOUT=30000;
  let active=null,valid,onExit,titles=[];
  function measure(){
    const width=head.clientWidth-parseFloat(getComputedStyle(head).paddingLeft)-parseFloat(getComputedStyle(head).paddingRight)-44-16;
    if(width<=0)return;
    const probe=title.cloneNode(false);probe.removeAttribute('id');probe.className='case-demo-title-probe';
    probe.style.width=`${width}px`;document.body.append(probe);
    let height=44;for(const text of titles){probe.textContent=text;height=Math.max(height,probe.getBoundingClientRect().height);}
    probe.remove();modal.style.setProperty('--preview-title-height',`${Math.ceil(height)}px`);
  }
  function cleanup(op){
    clearTimeout(op.timer);op.timer=null;op.controller?.abort();
    op.frame?.remove();op.frame=null;op.origin=null;
  }
  function state(op,text,buttonText,callback){
    if(!valid(op))return;
    cleanup(op);op.phase='status';modal.dataset.state='status';message.textContent=text;
    action.hidden=!buttonText;action.textContent=buttonText||'';action.onclick=callback||null;
    // A removed frame or retry button must not leave focus outside the dialog.
    close.focus({preventScroll:true});
  }
  function show(op,{label,allTitles,isCurrent,exit,text}){
    active=op;valid=isCurrent;onExit=exit;titles=allTitles;title.textContent=label;
    modal.dataset.state='loading';message.textContent=text;action.hidden=true;action.onclick=null;
    if(!modal.open){modal.showModal();document.body.classList.add('case-demo-open');}
    measure();close.focus({preventScroll:true});
  }
  function load(op,descriptor,label,waiting,onTimeout){
    if(!valid(op))return;
    const frame=document.createElement('iframe');frame.id='case-demo-frame';frame.title=label;
    frame.referrerPolicy='no-referrer';frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms');
    if(descriptor.kind==='private'){
      frame.tabIndex=-1;frame.inert=true;
      if(descriptor.allowDownloads===true)frame.sandbox.add('allow-downloads');
    }
    op.frame=frame;op.origin=new URL(descriptor.src,location.href).origin;op.phase='loading';
    modal.dataset.state='loading';message.textContent=waiting;action.hidden=true;
    // Private apps report initialized UI; external websites render directly and own their loading UI.
    if(descriptor.kind==='private')op.timer=setTimeout(()=>{if(valid(op)&&op.frame===frame)onTimeout();},READY_TIMEOUT);
    mount.append(frame);frame.src=descriptor.src;
    if(descriptor.kind==='website'){op.phase='ready';modal.dataset.state='ready';}
  }
  window.addEventListener('message',event=>{
    const op=active;
    if(!op||!valid(op)||!op.frame||event.source!==op.frame.contentWindow||event.origin!==op.origin)return;
    if(event.data?.type==='case-demo-ready'){
      clearTimeout(op.timer);op.timer=null;op.phase='ready';modal.dataset.state='ready';
      op.frame.inert=false;op.frame.removeAttribute('tabindex');
    }else if(event.data?.type==='case-demo-close')onExit(op);
  });
  function exit(op){
    cleanup(op);if(active!==op)return;
    active=null;modal.close();document.body.classList.remove('case-demo-open');
    op.trigger?.focus({preventScroll:true});
  }
  close.addEventListener('click',()=>{if(active)onExit(active);});
  modal.addEventListener('cancel',event=>{event.preventDefault();if(active)onExit(active);});
  modal.addEventListener('click',event=>{
    if(event.target!==modal)return;const r=modal.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)if(active)onExit(active);
  });
  // Programmatic exit already cleaned synchronously. A delayed old close cannot affect a reopened view.
  modal.addEventListener('close',()=>{if(!modal.open&&active)onExit(active);});
  function relabel(label,allTitles,waiting){titles=allTitles;if(active){title.textContent=label;if(active.frame)active.frame.title=label;if(active.phase==='checking'||active.phase==='loading')message.textContent=waiting;}measure();}
  window.addEventListener('resize',measure);document.fonts.addEventListener('loadingdone',measure);
  return {show,state,load,cleanup,exit,relabel};
})();
