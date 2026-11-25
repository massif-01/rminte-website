import {caseIds} from '../../website/assets/case-catalog.mjs';
import {test,expect} from '@playwright/test';
import {createServer} from 'node:http';
import {active,setup,afterURL,createBrowserAccount} from './helpers.mjs';

const account={id:'fixture',username:'local-preview',role:'user',case_ids:caseIds,all_cases:false,must_change_password:false,resources:{}};
let server,foreign;
test.beforeAll(async()=>{
  server=createServer((req,res)=>{
    const url=new URL(req.url,'http://local');
    if(url.pathname==='/slow.png'){setTimeout(()=>res.end(''),600);return;}
    if(url.pathname==='/network'){res.destroy();return;}
    if(url.pathname==='/denied'){res.writeHead(200,{'Content-Security-Policy':"frame-ancestors 'none'"});res.end('<p>Embedding denied</p>');return;}
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.end(`<!doctype html><html><body><h1>Local cross-origin software</h1><input id="entry" autofocus><button id="increment">Count</button><output>0</output><button id="close">Close preview</button><div style="height:1800px"></div><button id="bottom">Bottom action</button>${url.pathname==='/early'?'<img src="/slow.png">':''}<script>
      const target=${JSON.stringify(afterURL)};
      function ready(){parent.postMessage({type:'case-demo-ready'},target)}
      document.querySelector('#increment').onclick=()=>document.querySelector('output').textContent=+document.querySelector('output').textContent+1;
      document.querySelector('#close').onclick=()=>parent.postMessage({type:'case-demo-close'},target);
      document.addEventListener('keydown',e=>{if(e.key==='Escape')parent.postMessage({type:'case-demo-close'},target)});
      ${url.pathname==='/silent'?'': 'ready();'}
    </script></body></html>`);
  });
  await new Promise(done=>server.listen(0,'127.0.0.1',done));foreign=`http://127.0.0.1:${server.address().port}`;
});
test.afterAll(async()=>{await new Promise(done=>server.close(done));});

async function boot(page,language='en',source='/ready'){
  await setup(page,language);
  await page.route('**/api/session',route=>route.fulfill({json:{user:account}}));
  // This fixture tests browser mechanics; integration.mjs tests the real endpoint separately.
  await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'private',src:foreign+source}}));
  await page.goto(afterURL+'/cases/?lang='+language);await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('#access .who')).toHaveText(account.username);
}
// Let cancelled requests finish in these race tests: freshness must hold even
// when cancellation cannot stop a response already in flight.
async function allowLateResponses(page){
 await page.evaluate(()=>{const fetch=window.fetch.bind(window);window.fetch=(url,options)=>fetch(url,{...options,signal:undefined});});
}
async function settleLateResponse(page,route,response){
 const received=page.waitForResponse(route.request().url());
 await route.fulfill(response);await (await received).finished();
 await page.evaluate(()=>new Promise(requestAnimationFrame));
}
const modal=page=>page.locator('#case-demo-modal');
const trigger=(page,index=0)=>page.locator('[data-action=demo]').nth(index);
const ready=page=>expect(modal(page)).toHaveAttribute('data-state','ready');
async function dimensions(page){return page.evaluate(()=>['#case-demo-modal','.case-demo-head','[data-case-demo-close]','.case-demo-content'].map(selector=>{
 const r=document.querySelector(selector).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};
}));}
function equalGeometry(actual,expected){for(let i=0;i<actual.length;i++)for(const key of ['x','y','width','height'])expect(Math.abs(actual[i][key]-expected[i][key]),`${i}.${key}`).toBeLessThanOrEqual(1);}

if(active('cases'))test.describe('unified case preview',()=>{
 for(const language of ['zh','en','ja','ko','es','fr'])for(const [width,height] of [[1440,900],[768,1024],[390,844],[320,568],[844,390]])for(const motion of ['reduce','no-preference']){
  test(`${language} ${width}x${height} ${motion}: shared geometry and reachable controls`,async({page},testInfo)=>{
   await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:motion});await boot(page,language);
   let request;
   await page.route('**/api/resources/*/preview',route=>{request=route;});
   await trigger(page).click();await expect.poll(()=>!!request).toBe(true);
   // Opening the hidden title introduces font weights not used by the page yet.
   await page.evaluate(async()=>{await document.fonts.ready;await new Promise(requestAnimationFrame);});
   const first=await dimensions(page);await expect(modal(page)).toHaveAttribute('data-state','loading');
   await request.fulfill({json:{kind:'website',src:foreign+'/ready'}});await ready(page);equalGeometry(await dimensions(page),first);
   await page.unroute('**/api/resources/*/preview');
   await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'website',src:foreign+'/ready'}}));
   expect(first[0].width).toBe(width<=600?width:Math.min(1440,width-48));expect(first[0].height).toBe(width<=600?height:height-48);
   expect(first[2].width).toBe(44);expect(first[2].height).toBe(44);
   await page.frameLocator('#case-demo-frame').locator('#increment').click();await expect(page.frameLocator('#case-demo-frame').locator('output')).toHaveText('1');
   await page.frameLocator('#case-demo-frame').locator('#bottom').click();
   await page.locator('[data-case-demo-close]').click();await expect(trigger(page)).toBeFocused();
   await trigger(page,4).click();await ready(page);equalGeometry(await dimensions(page),first);
   expect(await page.locator('#case-demo-title').evaluate(e=>e.scrollWidth<=e.clientWidth&&e.scrollHeight<=e.clientHeight+1)).toBe(true);
   // Same-origin private page uses the exact same component, with a different title length.
   await page.locator('[data-case-demo-close]').click();
   await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'private',src:'/api/resources/fixture/demo/index.html'}}));
   await page.route('**/api/resources/fixture/demo/index.html',route=>route.fulfill({contentType:'text/html',body:`<button>Private fixture</button><script>parent.postMessage({type:'case-demo-ready'},location.origin)</script>`}));
   await trigger(page,8).click();await ready(page);equalGeometry(await dimensions(page),first);
   if(motion==='reduce'&&[1440,320,844].includes(width))await testInfo.attach(`${language}-${width}-preview`,{body:await modal(page).screenshot(),contentType:'image/png'});
   await page.keyboard.press('Escape');await expect(page.locator('#case-demo-frame')).toHaveCount(0);await expect(trigger(page,8)).toBeFocused();
   for(const code of [403,503]){
    await page.route('**/api/resources/*/preview',route=>route.fulfill({status:code,json:{error:'https://hidden.invalid/'}}));
    await trigger(page).click();await expect(modal(page)).toHaveAttribute('data-state','status');equalGeometry(await dimensions(page),first);
    expect(await modal(page).innerText()).not.toContain('https://');
    if(code===503){
     await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'website',src:foreign+'/ready'}}));
     await page.locator('.case-demo-status button').click();await ready(page);equalGeometry(await dimensions(page),first);
    }
    await page.locator('[data-case-demo-close]').click();await expect(trigger(page)).toBeFocused();
   }
  });
 }
 test('states, ready-before-load, timeout destroys content, retry and no address',async({page},testInfo)=>{
  await boot(page,'en','/early');await trigger(page).click();await ready(page);const geometry=await dimensions(page);
  await page.waitForTimeout(800);await ready(page); // load arriving later does not reset ready.
  await page.locator('[data-case-demo-close]').click();
  for(const [code,copy] of [[401,'expired'],[403,'does not yet have demo access'],[503,'not connected yet'],[500,'try again later']]){
   await page.route('**/api/resources/*/preview',route=>route.fulfill({status:code,json:{error:'SECRET https://should-never-display.invalid/path'}}));
   await trigger(page).click();await expect(modal(page)).toContainText(copy);equalGeometry(await dimensions(page),geometry);
   await expect(page.locator('#case-demo-frame')).toHaveCount(0);expect(await modal(page).innerText()).not.toMatch(/https?:|SECRET|should-never/);
   await testInfo.attach(`state-${code}`,{body:await modal(page).screenshot(),contentType:'image/png'});
   await page.keyboard.press('Escape');
  }
  await page.route('**/api/resources/*/preview',route=>route.abort());await trigger(page).click();await expect(modal(page)).toContainText('try again later');await page.keyboard.press('Escape');
  await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'private',src:foreign+'/silent'}}));
  await page.clock.install();await trigger(page).click();await expect(page.locator('#case-demo-frame')).toHaveCount(1);
  await page.evaluate(()=>{window.oldPreviewWindow=document.querySelector('iframe#case-demo-frame').contentWindow;});
  await expect(page.locator('[data-case-demo-close]')).toBeFocused();
  expect(await page.locator('#case-demo-frame').evaluate(e=>e.getBoundingClientRect().width>0&&e.getBoundingClientRect().height>0)).toBe(true);
  await page.keyboard.press('Tab');expect(await page.evaluate(()=>document.activeElement.id)).not.toBe('case-demo-frame');
  await page.clock.fastForward(30001);await expect(modal(page)).toContainText('Loading has not finished');await expect(page.locator('#case-demo-frame')).toHaveCount(0);equalGeometry(await dimensions(page),geometry);
  await page.evaluate(origin=>dispatchEvent(new MessageEvent('message',{source:window.oldPreviewWindow,origin,data:{type:'case-demo-ready'}})),foreign);
  await expect(modal(page)).toHaveAttribute('data-state','status');await expect(page.locator('body')).toHaveClass(/case-demo-open/);
  await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'website',src:foreign+'/ready'}}));
  await modal(page).getByRole('button',{name:'Retry',exact:true}).click();await ready(page);equalGeometry(await dimensions(page),geometry);
  await page.locator('[data-case-demo-close]').click();await expect(trigger(page)).toBeFocused();
 });
 test('cancel, switch, stale success/error and old frame messages cannot replace current content',async({page})=>{
  await boot(page);await allowLateResponses(page);const held=[];
  await page.route('**/api/resources/*/preview',route=>{held.push(route);});
  await trigger(page).click();await expect.poll(()=>held.length).toBe(1);await page.keyboard.press('Escape');
  await trigger(page,4).click();await expect.poll(()=>held.length).toBe(2);
  await held[1].fulfill({json:{kind:'website',src:foreign+'/ready'}});await ready(page);
  await settleLateResponse(page,held[0],{status:503,json:{error:'old failure'}});await ready(page);
  await page.evaluate(()=>{window.oldPreviewWindow=document.querySelector('#case-demo-frame').contentWindow;});
  // Close and immediately reopen before the browser delivers the old native close event.
  await page.evaluate(()=>{document.querySelector('[data-case-demo-close]').click();document.querySelectorAll('[data-action=demo]')[0].click();});
  await expect.poll(()=>held.length).toBe(3);await held[2].fulfill({json:{kind:'website',src:foreign+'/ready'}});await ready(page);
  for(const type of ['case-demo-ready','case-demo-close'])await page.evaluate(({origin,type})=>dispatchEvent(new MessageEvent('message',{source:window.oldPreviewWindow,origin,data:{type}})),{origin:foreign,type});
  await page.evaluate(()=>dispatchEvent(new MessageEvent('message',{source:document.querySelector('#case-demo-frame').contentWindow,origin:'https://wrong.invalid',data:{type:'case-demo-close'}})));
  await ready(page);await page.frameLocator('#case-demo-frame').locator('#close').click();await expect(modal(page)).not.toBeVisible();await expect(page.locator('#case-demo-frame')).toHaveCount(0);
 });
 test('cancelled login may establish the account but never continues the preview',async({page})=>{
  await boot(page);await page.route('**/api/session',route=>route.fulfill({json:{user:null}}));await page.reload();
  let login;await page.route('**/api/login',route=>{login=route;});
  // Pointer activation need not focus a button (for example, Safari).
  await trigger(page).evaluate(button=>button.addEventListener('mousedown',event=>event.preventDefault()));
  await trigger(page).click();await page.locator('#account').fill('local');await page.locator('#password').fill('local');await page.locator('#login-form [type=submit]').click();
  await expect.poll(()=>!!login).toBe(true);await page.keyboard.press('Escape');await expect(trigger(page)).toBeFocused();
  await login.fulfill({json:{user:account}});await expect(page.locator('#access .who')).toHaveText(account.username);await expect(modal(page)).not.toBeVisible();await expect(page.locator('dialog[open]')).toHaveCount(0);
 });
 test('session ownership is checked before shared state and confirmed logout wins',async({page})=>{
  await boot(page);const pending=[];await page.route('**/api/session',route=>{pending.push(route);});
  await page.evaluate(()=>{window.queryA=CASE_AUTH.refresh();window.queryB=CASE_AUTH.refresh();});
  await expect.poll(()=>pending.length).toBe(2);await pending[1].fulfill({json:{user:account}});await page.evaluate(()=>window.queryB);
  await pending[0].fulfill({json:{user:null}});await page.evaluate(()=>window.queryA);await expect(page.locator('#access .who')).toHaveText(account.username);
  await page.evaluate(()=>{window.queryC=CASE_AUTH.refresh().catch(error=>CASE_AUTH.render(error));window.queryD=CASE_AUTH.refresh();});
  await expect.poll(()=>pending.length).toBe(4);await pending[3].fulfill({json:{user:account}});await page.evaluate(()=>window.queryD);
  await pending[2].fulfill({status:503,json:{error:'old session failure'}});await page.evaluate(()=>window.queryC);await expect(page.locator('#access .cs-msg')).toHaveCount(0);
  await page.evaluate(()=>{window.queryE=CASE_AUTH.refresh();});await expect.poll(()=>pending.length).toBe(5);
  await page.route('**/api/logout',route=>route.fulfill({json:{ok:true}}));await page.locator('#access button.txt').click();
  await expect(page.locator('#access [data-action=login]')).toBeVisible();await pending[4].fulfill({json:{user:account}});await page.evaluate(()=>window.queryE);await expect(page.locator('#access .who')).toHaveCount(0);
 });
 test('cancelled preview session read cannot commit, transient errors retain account, loss unloads',async({page})=>{
  await boot(page);await allowLateResponses(page);let session;await page.route('**/api/session',route=>{session=route;});
  await trigger(page).click();await expect.poll(()=>!!session).toBe(true);await page.keyboard.press('Escape');await settleLateResponse(page,session,{json:{user:null}});await expect(page.locator('#access .who')).toHaveText(account.username);
  await page.route('**/api/session',route=>route.fulfill({json:{user:account}}));await trigger(page).click();await ready(page);
  await page.route('**/api/session',route=>route.abort());await page.evaluate(()=>CASE_AUTH.refresh().catch(()=>{}));await ready(page);
  await page.route('**/api/session',route=>route.fulfill({json:{user:{...account,case_ids:[]}}}));await page.evaluate(()=>CASE_AUTH.refresh());await expect(modal(page)).not.toBeVisible();await expect(page.locator('#case-demo-frame')).toHaveCount(0);
 });
 for(const source of ['/denied','/network'])test(`child ${source} never counts as readiness and remains a controlled timeout`,async({page})=>{
  await boot(page,'en',source);await page.clock.install();await trigger(page).click();await expect(page.locator('#case-demo-frame')).toHaveCount(1);await page.clock.fastForward(30001);await expect(modal(page)).toContainText('Loading has not finished');await expect(page.locator('#case-demo-frame')).toHaveCount(0);
 });
 test('portrait and landscape safe areas keep title, close and child viewport reachable',async({page,context})=>{
  const cdp=await context.newCDPSession(page);
  for(const [width,height,insets] of [[390,844,{top:59,bottom:34,left:0,right:0}],[844,390,{top:0,bottom:21,left:59,right:59}]]){
   await page.setViewportSize({width,height});await cdp.send('Emulation.setSafeAreaInsetsOverride',{insets});
   await boot(page);
   // viewport-fit also affects the host navigation, before the preview opens.
   for(const selector of ['.site-shell .brand-mark','.site-shell .language-toggle','[data-menu-toggle]']){
    const control=page.locator(selector);if(!await control.isVisible())continue;
    const r=await control.boundingBox();expect(r.y).toBeGreaterThanOrEqual(insets.top);expect(r.x).toBeGreaterThanOrEqual(insets.left);expect(r.x+r.width).toBeLessThanOrEqual(width-insets.right);
   }
   if(await page.locator('[data-menu-toggle]').isVisible()){
    await page.locator('[data-menu-toggle]').click();await expect(page.locator('#mobileOverlay')).toBeVisible();
    const close=page.locator('#mobileOverlay [data-menu-close]');
    const r=await close.boundingBox();expect(r.y).toBeGreaterThanOrEqual(insets.top);expect(r.x+r.width).toBeLessThanOrEqual(width-insets.right);
    await close.click();
   }
   await page.locator('[data-lang-toggle]').click();await expect(page.locator('.language-options')).toBeVisible();await page.keyboard.press('Escape');
   await trigger(page).click();await ready(page);
   const [,head,close,content]=await dimensions(page);
   expect(close.y).toBeGreaterThanOrEqual(insets.top);expect(close.x+close.width).toBeLessThanOrEqual(width-insets.right);
   expect(content.x).toBeGreaterThanOrEqual(insets.left);expect(content.x+content.width).toBeLessThanOrEqual(width-insets.right);
   expect(content.y+content.height).toBeLessThanOrEqual(height-insets.bottom);
   await page.frameLocator('#case-demo-frame').locator('#bottom').click();await page.locator('[data-case-demo-close]').click();
  }
 });
 test('confirmed permission loss during child initialization removes it before late ready',async({page})=>{
  await boot(page,'en','/silent');await trigger(page).click();await expect(page.locator('#case-demo-frame')).toHaveCount(1);
  await page.route('**/api/session',route=>route.fulfill({json:{user:{...account,case_ids:[]}}}));
  await page.evaluate(()=>CASE_AUTH.refresh());await expect(modal(page)).not.toBeVisible();await expect(page.locator('#case-demo-frame')).toHaveCount(0);
 });

 test('successful login continuation and explicit re-login preserve the original case focus target',async({page})=>{
  await boot(page);let user=null;
  await page.route('**/api/session',route=>route.fulfill({json:{user}}));await page.reload();
  await page.route('**/api/login',route=>{user=account;return route.fulfill({json:{user}});});
  const original=trigger(page,4);await original.click();
  await page.locator('#account').fill('local');await page.locator('#password').fill('local');await page.locator('#login-form [type=submit]').click();
  await ready(page);await expect(page.locator('dialog[open]')).toHaveCount(1);await page.locator('[data-case-demo-close]').click();await expect(original).toBeFocused();
  await page.route('**/api/resources/*/preview',route=>route.fulfill({status:401,json:{error:'expired'}}));
  await original.click();await expect(modal(page)).toContainText('expired');await modal(page).getByRole('button',{name:'Sign in',exact:true}).click();
  await expect(modal(page)).not.toBeVisible();await expect(page.locator('#login-form')).toBeVisible();
  await page.route('**/api/resources/*/preview',route=>route.fulfill({json:{kind:'website',src:foreign+'/ready'}}));
  await page.locator('#account').fill('local');await page.locator('#password').fill('local');await page.locator('#login-form [type=submit]').click();
  await ready(page);await expect(page.locator('dialog[open]')).toHaveCount(1);await page.locator('[data-case-demo-close]').click();await expect(original).toBeFocused();
 });
 test('late successful descriptor, unsupported height messages and confirmed logout cannot revive old content',async({page})=>{
  await boot(page);await allowLateResponses(page);const requests=[];await page.route('**/api/resources/*/preview',route=>{requests.push(route);});
  await trigger(page).click();await expect.poll(()=>requests.length).toBe(1);
  await page.evaluate(()=>document.querySelectorAll('[data-action=demo]')[4].click());await expect.poll(()=>requests.length).toBe(2);
  await requests[1].fulfill({json:{kind:'website',src:foreign+'/ready'}});await ready(page);const geometry=await dimensions(page);
  await settleLateResponse(page,requests[0],{json:{kind:'private',src:foreign+'/silent'}});await ready(page);
  await page.evaluate(origin=>dispatchEvent(new MessageEvent('message',{origin,source:document.querySelector('#case-demo-frame').contentWindow,data:{type:'case-demo-height',height:9999}})),foreign);
  equalGeometry(await dimensions(page),geometry);
  await page.route('**/api/logout',route=>route.fulfill({json:{ok:true}}));
  await page.evaluate(()=>document.querySelector('#access button.txt').click());await expect(modal(page)).not.toBeVisible();await expect(page.locator('#case-demo-frame')).toHaveCount(0);
 });

 test('real Cookie-writing logins finish in order after cancelling the first form',async({page})=>{
  const a=await createBrowserAccount(),b=await createBrowserAccount(),testIP='192.0.2.19';let release;
  try{
   await b.setPermissions(caseIds);await setup(page,'en');
   // Keep this real-login regression out of the other local clients' login-IP budget.
   await page.setExtraHTTPHeaders({'CF-Connecting-IP':testIP});let count=0;
   await page.route('**/api/login',async route=>{
    count++;if(count!==1){await route.continue();return;}
    // Isolated Node fetch holds the actual Set-Cookie, not just a mock JSON body.
    const response=await fetch(afterURL+'/api/login',{method:'POST',headers:{Origin:afterURL,'Content-Type':'application/json','CF-Connecting-IP':testIP},body:route.request().postData()});
    const body=await response.text(),headers=Object.fromEntries(response.headers.entries());
    expect(response.status).toBe(200);release=()=>route.fulfill({status:response.status,headers,body});
   });
   await page.goto(afterURL+'/cases/?lang=en');await expect(page.locator('#access [data-action=login]')).toBeVisible();
   const open=page.locator('[data-action=demo][data-selected="8"]');await open.click();
   await page.locator('#account').fill(a.username);await page.locator('#password').fill(a.password);await page.locator('#login-form [type=submit]').click();await expect.poll(()=>!!release).toBe(true);
   await page.keyboard.press('Escape');await open.click();await page.locator('#account').fill(b.username);await page.locator('#password').fill(b.password);await page.locator('#login-form [type=submit]').click();
   await page.evaluate(()=>new Promise(requestAnimationFrame));expect(count).toBe(1);
   await release();release=null;await ready(page);expect(count).toBe(2);
   const identity=await page.evaluate(async()=>({shared:CASE_AUTH.user,actual:(await(await fetch('/api/session')).json()).user}));
   expect(identity.shared.id).toBe(b.id);expect(identity.actual.id).toBe(b.id);expect(identity.shared.case_ids).toEqual(caseIds.slice().sort());expect(identity.actual.case_ids).toEqual(caseIds.slice().sort());
   await b.setPermissions([]);await page.evaluate(()=>CASE_AUTH.refresh());
   await expect(modal(page)).not.toBeVisible();await expect(page.locator('#case-demo-frame')).toHaveCount(0);
  }finally{if(release)await release();await a.remove();await b.remove();}
 });
 for(const phase of ['checking','loading'])test(`late Japanese catalog updates ${phase} and the original ready deadline`,async({page})=>{
  await boot(page,'en','/silent');let catalog,descriptor;
  await page.route('**/assets/translations/ja.js*',route=>{catalog=route;});
  if(phase==='checking')await page.route('**/api/resources/*/preview',route=>{descriptor=route;});
  await page.locator('[data-lang-toggle]').click();await page.locator('[data-language=ja]').click();await expect.poll(()=>!!catalog).toBe(true);
  await page.clock.install();await trigger(page).click();
  if(phase==='checking')await expect.poll(()=>!!descriptor).toBe(true);else await expect(page.locator('#case-demo-frame')).toHaveCount(1);
  await page.evaluate(()=>{window.languageFrame=document.querySelector('#case-demo-frame');});
  await page.clock.fastForward(15000);await catalog.continue();await expect(page.locator('html')).toHaveAttribute('lang','ja');
  await expect(modal(page).locator('[role=status]')).toHaveText(phase==='checking'?'アクセス権を確認しています…':'デモを読み込んでいます…');
  if(phase==='checking'){
   await descriptor.fulfill({json:{kind:'private',src:foreign+'/silent'}});await expect(page.locator('#case-demo-frame')).toHaveCount(1);
   await expect(modal(page).locator('[role=status]')).toHaveText('デモを読み込んでいます…');await page.clock.fastForward(15000);
  }else expect(await page.evaluate(()=>window.languageFrame===document.querySelector('#case-demo-frame'))).toBe(true);
  await page.clock.fastForward(15001);await expect(modal(page)).toHaveAttribute('data-state','status');
  await expect(modal(page).locator('[role=status]')).toHaveText('読み込みが完了していません。再試行するか閉じてください。');
  await expect(modal(page).locator('.case-demo-status button')).toHaveText('再試行');
  await page.keyboard.press('Escape');await expect(trigger(page)).toBeFocused();
 });

 test('preview locks background scrolling and final exit restores it',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await boot(page);await trigger(page).click();await ready(page);
  const position=await page.evaluate(()=>scrollY);await page.mouse.move(2,2);await page.mouse.wheel(0,300);await page.waitForTimeout(150);
  expect(await page.evaluate(()=>scrollY)).toBe(position);await page.locator('[data-case-demo-close]').click();await expect(trigger(page)).toBeFocused();
  await page.mouse.move(2,2);await page.mouse.wheel(0,300);await expect.poll(()=>page.evaluate(()=>scrollY)).not.toBe(position);
 });

});
