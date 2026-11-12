import {enhancePasswords,refreshPasswordButtons} from '../assets/password-field.mjs';
import {groups,cases,caseIds} from '../assets/case-catalog.mjs?v=case-details-1';
// Cases page, design system v2 (D10). The cards, the dialogs and the authorised-access panel are drawn here. Every visible string is a zh/en pair that is
// painted in the visitor's language (RM_I18N.text: zh and en from the pair, ja/ko/es/fr from the catalogs by the English text) and painted again on a
// language switch, so a dialog that is open keeps what was typed into it.
(() => {
  'use strict';
  const COPY = {
    checking: {zh:'正在检查访问权限…', en:'Checking access…'},
    loading: {zh:'正在加载演示…', en:'Loading demo…'},
    expired: {zh:'登录已失效，请重新登录。', en:'Your session has expired. Please sign in again.'},
    unfinished: {zh:'暂未完成加载，请重试或关闭。', en:'Loading has not finished. Please retry or close.'},
    retry: {zh:'重试', en:'Retry'},
    signToDemo: {zh: '需登录后演示', en: 'Sign in to view demo'},
    demoOn: {zh: '演示已授权', en: 'Demo authorised'},
    demoOff: {zh: '演示未授权', en: 'Demo not authorised'},
    demo: {zh: '演示', en: 'Demo'},
    more: {zh: '资料与联系', en: 'Materials and contact'},
    materials: {zh: '下载相关资料', en: 'Related materials'},
    signToDownload: {zh: '登录后下载', en: 'Sign in to download'},
    docPending: {zh: '资料待接入', en: 'Document not yet connected'},
    contact: {zh: '联系供应商', en: 'Contact the supplier'},
    contactEmail: {zh: '电子邮箱：', en: 'Email:'},
    contactPending: {zh: '供应商信息待公布', en: 'Supplier details to be announced'},
    one: {zh: '1 个场景', en: '1 scenario'},
    many: {zh: '{n} 个场景', en: '{n} scenarios'},
    signIn: {zh: '授权登录', en: 'Sign in'},
    signInSubmit: {zh: '登录', en: 'Sign in'},
    loginLead: {zh: '使用官方分发的账号登录。登录后，可直接进入获准的演示或下载资料。', en: 'Sign in with the account we issued. Afterwards you can open the demos and materials you are authorised to use.'},
    username: {zh: '用户名', en: 'Username'},
    password: {zh: '密码', en: 'Password'},
    loginFailed: {zh: '未能登录', en: 'COULD NOT SIGN IN'},
    badLogin: {zh: '用户名或密码不正确', en: 'The username or password is incorrect'},
    partner: {zh: '成为软件合作伙伴', en: 'Become a software partner'},
    partnerLead: {zh: '介绍你的应用，以及它与 RM-01 结合的构想。我们将在审核后通过邮箱联系你。', en: 'Tell us about your application and how you would combine it with RM-01. We will contact you by email after review.'},
    name: {zh: '姓名', en: 'Name'},
    company: {zh: '公司／机构', en: 'Company / organisation'},
    email: {zh: '工作邮箱', en: 'Work email'},
    reason: {zh: '你的应用解决什么问题？如何与 RM-01 结合？', en: 'What problem does your application solve, and how would it combine with RM-01?'},
    ability: {zh: '你如何理解 RM-01？团队有哪些模型与应用开发经验？', en: 'How do you understand RM-01? What model and application development experience does your team have?'},
    submit: {zh: '提交申请', en: 'Submit'},
    review: {zh: '提交后由团队审核，并通过你填写的邮箱联系。合作申请不自动获得演示与下载权限。', en: 'The team reviews every application and replies by email. An application does not grant access to demos or downloads.'},
    received: {zh: '申请已收到。团队将通过邮箱与你联系。', en: 'Application received. The team will contact you by email.'},
    noDemo: {zh: '此账号尚未获得查看演示权限，请联系账号发放人。', en: 'This account is not yet authorised to view demos. Please contact whoever issued it.'},
    noDownload: {zh: '此账号尚未获得下载资料权限，请联系账号发放人。', en: 'This account is not yet authorised to download materials. Please contact whoever issued it.'},
    notConnected: {zh: '该案例的演示或资料尚未接入。', en: 'The demo or materials for this case are not connected yet.'},
    notConnectedLabel: {zh: '尚未接入', en: 'NOT YET CONNECTED'},
    noAccess: {zh: '此账号没有访问权限。', en: 'This account has no access.'},
    tryLater: {zh: '暂时无法打开，请稍后重试。', en: 'Cannot be opened right now. Please try again later.'},
    serviceDown: {zh: '账号服务暂时不可用', en: 'The account service is temporarily unavailable'}
  };
  const esc = (value) => String(value).replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  // A text node that paint() fills; until a language is applied the Chinese text stands in.
  const t = (pair, tag = 'span', attrs = '') => `<${tag}${attrs} data-case-text data-zh="${esc(pair.zh)}" data-en="${esc(pair.en)}">${esc(pair.zh)}</${tag}>`;
  const icons = {
    chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>'
  };
  const $ = (selector) => document.querySelector(selector);
  const list = $('#cases'), dialog = $('.cs-dialog'), body = $('#dialog-body');
  const overlay = $('#mobileOverlay'), menuButton = $('[data-menu-toggle]'), closeButton = $('[data-menu-close]');
  let lang = RM_I18N.initial(), opener = null, currentOperation = null;

  // Painting
  const MARKS = /(RMinte(?:\s+AI\b)?|RM-01)/, MARK_ONLY = /^(?:RMinte(?:\s+AI\b)?|RM-01)$/;
  function write(element, text) {
    if (!MARKS.test(text)) { if (element.textContent !== text) element.textContent = text; return; }
    element.replaceChildren(...text.split(MARKS).filter(Boolean).map((part) => {
      if (!MARK_ONLY.test(part)) return document.createTextNode(part);
      const mark = document.createElement('span');
      mark.className = 'rm-mark';
      mark.textContent = part;
      return mark;
    }));
  }
  function paint(root = document) {
    refreshPasswordButtons(root);
    root.querySelectorAll('[data-case-text]').forEach((element) => {
      let text = RM_I18N.text(element.dataset, lang);
      if (element.dataset.n) text = text.replace('{n}', element.dataset.n);
      write(element, text);
    });
    root.querySelectorAll('[data-supplier]').forEach((element) => {
      const supplier = cases[Number(element.dataset.supplier)].supplier;
      // Prefer a supplied full name; otherwise keep proper names in pinyin and translate the company suffix.
      write(element, supplier.name[lang] || `${supplier.pinyin} ${RM_I18N.text(supplier.suffix, lang)}`);
    });
  }
  const setPair = (element, pair) => { element.dataset.zh = pair.zh; element.dataset.en = pair.en; };
  function pairNode(tag, pair) {
    const node = document.createElement(tag);
    node.dataset.caseText = '';
    setPair(node, pair);
    node.textContent = pair.zh;
    return node;
  }

  // The cards: one section per scenario group, built once. A sign-in or sign-out only changes the status line and the download row (updateCards).
  function card(item, index) {
    const contact = item.supplier
      ? `<a class="cs-row" href="mailto:${esc(item.supplier.email)}">${t(COPY.contact, 'small')}<strong data-supplier="${index}">${esc(item.supplier.name.zh)}</strong><small>${t(COPY.contactEmail)} ${esc(item.supplier.email)}</small>${icons.arrow}</a>`
      : `<button class="cs-row cs-supplier-pending" type="button" data-state="off" aria-disabled="true">${t(COPY.contact, 'small')}${t(COPY.contactPending, 'strong')}${icons.arrow}</button>`;
    return `<article class="cs-card" data-bevel><div class="cs-summary"><div class="cs-copy">${t(COPY.signToDemo, 'p', ' class="cs-status"')}${t(item.name, 'h3')}${t(item.desc, 'p', ' class="desc"')}</div>`
      + `<div class="cs-bar"><button class="cs-more" type="button" aria-expanded="false" aria-controls="p${index}">${t(COPY.more)}${icons.chevron}</button>`
      + `<button class="cs-demo" type="button" data-action="demo" data-selected="${index}">${icons.play}${t(COPY.demo)}</button></div></div>`
      + `<div class="cs-panel" id="p${index}" inert><div><button class="cs-row" type="button" data-action="download" data-selected="${index}">${t(COPY.materials, 'small')}${t(COPY.signToDownload, 'strong')}${icons.arrow}</button>`
      + `${contact}</div></div></article>`;
  }
  function build() {
    list.innerHTML = groups.map((group, gi) => {
      const members = cases.map((item, index) => [item, index]).filter(([item]) => item.group === gi);
      const count = t(members.length === 1 ? COPY.one : COPY.many, 'p', ` class="count"${members.length === 1 ? '' : ` data-n="${members.length}"`}`);
      return `<section class="cs-group" aria-labelledby="g${gi}"><div class="cs-group-head"><span class="idx" aria-hidden="true">${String(gi + 1).padStart(2, '0')}</span>${t(group, 'h2', ` id="g${gi}"`)}${count}</div>`
        + `<div class="cs-cards">${members.map(([item, index]) => card(item, index)).join('')}</div></section>`;
    }).join('');
  }
  function updateCards() {
    const user = CASE_AUTH.user;
    list.querySelectorAll('.cs-status').forEach((status) => {
      const index=Number(status.closest('article').querySelector('[data-action="demo"]').dataset.selected);
      const granted=CASE_AUTH.canAccess(caseIds[index]);
      const [state,pair]=!user?['',COPY.signToDemo]:granted?['ok',COPY.demoOn]:['off',COPY.demoOff];
      if(state)status.dataset.state=state;else delete status.dataset.state;
      setPair(status,pair);
    });
    list.querySelectorAll('[data-action="download"]').forEach((download) => {
      const id=caseIds[Number(download.dataset.selected)],granted=CASE_AUTH.canAccess(id);
      if(user&&!granted)download.dataset.state='off';else delete download.dataset.state;
      download.removeAttribute('aria-disabled');
      setPair(download.querySelector('strong'),!user?COPY.signToDownload:!granted?COPY.noDownload:user.resources[id]?.download?COPY.materials:COPY.docPending);
    });
    paint();
  }

  // Dialogs
  function open(html) {
    if (!dialog.open) opener = document.activeElement;
    body.innerHTML = html;
    enhancePasswords(body);
    paint(body);
    if (!dialog.open) dialog.showModal();
    const title = body.querySelector('#dialog-title');
    title.tabIndex = -1;
    title.focus({preventScroll: true});
  }
  const heading = (pair) => t(pair, 'h2', ' id="dialog-title"');
  const field = (id, label, type, autocomplete, name = id) => `<label class="cs-field">${t(label)}<input id="${id}" name="${name}" type="${type}" autocomplete="${autocomplete}" required></label>`;
  const area = (id, label) => `<label class="cs-field">${t(label)}<textarea id="${id}" name="${id}" required></textarea></label>`;
  const status = '<div role="status"></div>';
  // A message under the form: what is a {zh, en} pair, or a text from the server that is shown as it is.
  function say(slot, what, label) {
    const box = document.createElement('div');
    box.className = 'cs-msg';
    if (label) box.append(pairNode('b', label));
    box.append(typeof what === 'string' ? document.createTextNode(what) : pairNode('span', what));
    slot.replaceChildren(box);
    paint(slot);
  }
  const KNOWN = {'用户名或密码不正确': COPY.badLogin};
  const fail = (pair) => Object.assign(new Error(pair.zh), {pair});
  const explain = (error) => error.pair || (error.unavailable ? COPY.serviceDown : KNOWN[error.message] || error.message);

  const text = pair => RM_I18N.text(pair, lang);
  const isCurrent = op => currentOperation === op;
  function endOperation(op) {
    if (!isCurrent(op)) return;
    currentOperation = null;
    if (op.kind === 'demo') CASE_DEMO.exit(op); else op.controller?.abort();
  }
  function closeForm(cancel = true) {
    if (cancel && currentOperation?.phase === 'login') endOperation(currentOperation);
    dialog.close();body.replaceChildren();
    if (cancel) opener?.focus({preventScroll:true});
  }
  function loginForm(item, op) {
    if (op) op.phase = 'login';
    open(`${heading(COPY.signIn)}${item ? t(item.name, 'p', ' class="name"') : ''}${t(COPY.loginLead, 'p', ' class="lead"')}<form id="login-form">${field('account', COPY.username, 'text', 'username', 'username')}${field('password', COPY.password, 'password', 'current-password')}<div class="actions"><button class="cs-pill primary" type="submit">${t(COPY.signInSubmit)}</button></div>${status}</form>`);
    if(op)opener=op.trigger;
  }
  function startResource(kind, index, trigger, forceLogin = false) {
    const previous=currentOperation;
    const op={kind,index,id:caseIds[index],item:cases[index],trigger,phase:'checking'};
    // Replace content without closing the shared preview or returning focus.
    if(previous) { if(previous.kind==='demo')CASE_DEMO.cleanup(previous);else previous.controller?.abort(); }
    currentOperation=op;
    if (forceLogin || !CASE_AUTH.user) loginForm(op.item,op); else enterResource(op);
  }
  function action(type, selected, trigger) {
    if (type === 'demo' || type === 'download') { startResource(type,Number(selected),trigger);return; }
    if (currentOperation) endOperation(currentOperation);
    if (type === 'login') { loginForm(null,null);return; }
    open(`${heading(COPY.partner)}${t(COPY.partnerLead, 'p', ' class="lead"')}<form id="partner-form"><div class="cs-grid2">${field('name', COPY.name, 'text', 'name')}${field('company', COPY.company, 'text', 'organization')}</div>${field('email', COPY.email, 'email', 'email')}${area('reason', COPY.reason)}${area('ability', COPY.ability)}<div class="actions"><button class="cs-pill primary" type="submit">${t(COPY.submit)}</button></div>${status}${t(COPY.review, 'p', ' class="lead sm"')}</form>`);
  }
  function previewStatus(op,key) {
    if(!isCurrent(op))return;
    op.statusKey=key;
    const relogin=key==='expired',retry=!['expired','noDemo','noAccess'].includes(key);
    CASE_DEMO.state(op,text(COPY[key]),relogin?text(COPY.signIn):retry?text(COPY.retry):null,
      relogin?()=>{const {index,trigger}=op;endOperation(op);startResource('demo',index,trigger,true);}
      :retry?()=>startResource('demo',op.index,op.trigger):null);
  }
  async function enterResource(op) {
    if (!isCurrent(op)) return;
    op.phase='checking';op.statusKey='checking';
    if(op.kind==='demo')CASE_DEMO.show(op,{
      label:text(op.item.name),allTitles:cases.map(item=>text(item.name)),isCurrent,exit:endOperation,text:text(COPY.checking)
    });
    op.controller=new AbortController();
    try {
      const user=await CASE_AUTH.refresh({isCurrent:()=>isCurrent(op),signal:op.controller.signal});
      if(!isCurrent(op))return;
      if(!user) { if(op.kind==='demo')previewStatus(op,'expired');else loginForm(op.item,op);return; }
      if(op.kind==='demo') {
        const response=await fetch(`/api/resources/${op.id}/preview`,{credentials:'same-origin',signal:op.controller.signal});
        if(!isCurrent(op))return;
        if(!response.ok){previewStatus(op,response.status===401?'expired':response.status===403?'noDemo':response.status===503?'notConnected':'tryLater');return;}
        const descriptor=await response.json();if(!isCurrent(op))return;
        if(!CASE_AUTH.user||!CASE_AUTH.canAccess(op.id)){previewStatus(op,CASE_AUTH.user?'noDemo':'expired');return;}
        op.statusKey='loading';
        CASE_DEMO.load(op,descriptor,text(op.item.name),text(COPY.loading),()=>previewStatus(op,'unfinished'));
      } else {
        if(!CASE_AUTH.canAccess(op.id))throw fail(COPY.noDownload);
        const url=`/api/resources/${op.id}/download`;
        const response=await fetch(url,{method:'HEAD',credentials:'same-origin',signal:op.controller.signal});
        if(!isCurrent(op))return;
        if(!response.ok)throw fail(response.status===503?COPY.notConnected:response.status===403?COPY.noAccess:COPY.tryLater);
        endOperation(op);closeForm(false);location.assign(url);
      }
    } catch(error) {
      if(!isCurrent(op))return;
      if(op.kind==='demo')previewStatus(op,'tryLater');
      else {open(`${heading(op.item.name)}${status}`);say(body.querySelector('[role=status]'),explain(error));}
    }
  }
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (trigger && trigger.dataset.state !== 'off') action(trigger.dataset.action, trigger.dataset.selected, trigger);
    const more = event.target.closest('.cs-more');
    if (more) {
      const card = more.closest('.cs-card'), expand = !card.hasAttribute('data-open');
      card.toggleAttribute('data-open', expand);
      more.setAttribute('aria-expanded', String(expand));
      card.querySelector('.cs-panel').inert = !expand;
    }
    if (event.target.closest('[data-dialog-close]')) closeForm();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeForm();
  });
  // A close event can arrive after the dialog was opened again (a quick answer to the resource check): leave the new content alone.
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeForm();});
  dialog.addEventListener('close',()=>{if(!dialog.open&&body.childNodes.length)closeForm();});
  dialog.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.target, button = form.querySelector('[type=submit]'), slot = form.querySelector('[role=status]');
    const loginOperation=currentOperation;
    button.disabled = true;
    try {
      if (form.id === 'login-form') {
        await CASE_AUTH.login(form.username.value, form.password.value);
        // Login can establish a valid account after cancellation; it cannot reopen that preview.
        if(!form.isConnected||form!==body.querySelector('form')||currentOperation!==loginOperation)return;
        form.reset();closeForm(false);
        if(loginOperation&&isCurrent(loginOperation))await enterResource(loginOperation);
        else opener?.focus({preventScroll:true});
      } else {
        await CASE_AUTH.api('/api/applications', {method: 'POST', body: JSON.stringify({name: form.querySelector('#name').value, company: form.querySelector('#company').value, email: form.querySelector('#email').value, message: form.querySelector('#reason').value, experience: form.querySelector('#ability').value})});
        form.reset();
        say(slot, COPY.received);
      }
    } catch (error) {
      if(!form.isConnected||form!==body.querySelector('form'))return;
      say(slot, explain(error), form.id === 'login-form' ? COPY.loginFailed : undefined);
    } finally {
      button.disabled = false;
    }
  });

  // The full-screen menu of the narrow layouts: the same behaviour as the other pages. Nothing behind it can be reached while it is open.
  overlay.inert = true;
  const pageParts = ['.site-shell', 'main', 'body > .footer'].map($).filter(Boolean);
  const menuLabel = (open) => RM_I18N.text(open ? {zh: '关闭菜单', en: 'Close menu'} : {zh: '打开菜单', en: 'Open menu'}, lang);
  function setMenu(open) {
    const restoreFocus = !open && overlay.contains(document.activeElement);
    overlay.inert = !open;
    pageParts.forEach((part) => { part.inert = open; });
    if (open) requestAnimationFrame(() => closeButton.focus({preventScroll: true}));
    else if (restoreFocus) menuButton.focus({preventScroll: true});
    overlay.classList.toggle('active', open);
    overlay.setAttribute('aria-hidden', String(!open));
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', menuLabel(open));
  }
  menuButton.addEventListener('click', () => setMenu(!menuButton.classList.contains('active')));
  closeButton.addEventListener('click', () => setMenu(false));
  $('.mobile-links a[href="#cases"]').addEventListener('click', () => setMenu(false));
  window.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });

  function applyLanguage(next) {
    lang = next;
    RM_I18N.apply(lang);
    document.title = `${RM_I18N.text({zh: '应用案例', en: 'Application cases'}, lang)} · RMinte`;
    menuButton.setAttribute('aria-label', menuLabel(menuButton.classList.contains('active')));
    paint();
    if(currentOperation?.kind==='demo'&&currentOperation.phase!=='login'){
      CASE_DEMO.relabel(text(currentOperation.item.name),cases.map(item=>text(item.name)),text(COPY[currentOperation.statusKey]));
      if(currentOperation.phase==='status')previewStatus(currentOperation,currentOperation.statusKey==='loading'?'unfinished':currentOperation.statusKey);
    }
  }

  build();
  // Keep every collapsed card equal without clipping translated copy. Observe the
  // content, not the equalized wrapper, so the height can shrink as well as grow.
  function alignCardHeights() {
    const height = Math.max(...Array.from(list.querySelectorAll('.cs-summary'), (summary) =>
      summary.querySelector('.cs-copy').getBoundingClientRect().height
      + parseFloat(getComputedStyle(summary.querySelector('.cs-copy')).marginBottom)
      + summary.querySelector('.cs-bar').getBoundingClientRect().height));
    list.style.setProperty('--case-summary-height', `${Math.ceil(height)}px`);
  }
  const cardSizeObserver = new ResizeObserver(alignCardHeights);
  list.querySelectorAll('.cs-copy, .cs-bar').forEach((content) => cardSizeObserver.observe(content));
  alignCardHeights();
  window.addEventListener('case-auth-render',()=>{
    updateCards();const op=currentOperation;
    if(op?.kind==='demo'&&op.frame&&(!CASE_AUTH.user||!CASE_AUTH.canAccess(op.id)))endOperation(op);
  });
  window.addEventListener('case-auth-change',()=>{if(currentOperation)endOperation(currentOperation);});
  RM_I18N.mount('[data-lang-toggle]', applyLanguage);
  applyLanguage(lang);
  CASE_AUTH.refresh().catch((error) => CASE_AUTH.render(error));
})();
