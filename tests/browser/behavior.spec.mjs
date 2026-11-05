import {caseIds} from '../../website/assets/case-catalog.mjs';
import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {operationName,operationLanguages,navigationPath,checkNavigation} from '../../scripts/ci/routes.mjs';
import {run,setup,openPage,inspectRoute,layout,afterURL,createBrowserAccount,loginFixture} from './helpers.mjs';

for(const descriptor of run.scope.pages)for(const language of operationLanguages(descriptor,run.scope.languages))for(const width of [1440,390]) {
  test.describe(operationName(descriptor,language,width),()=>{
    test.use({viewport:{width,height:900},hasTouch:width===390,locale:language==='zh'?'zh-CN':'en'});
    test('navigation, language and page operation remain usable',async({page,context},testInfo)=>{
      const audit=await setup(page,language);
      // Only replace the external document. Login, permissions and /preview stay real.
      for(const item of run.scope.demos.filter(item=>item.kind==='website')){
        const entry=new URL(item.src);entry.hash='';
        await page.route(entry.href,route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><h1>Local website preview fixture</h1><button id="act">Count</button><output>0</output><script>
          document.querySelector('#act').onclick=()=>document.querySelector('output').textContent=+document.querySelector('output').textContent+1;
        </script></body></html>`}));
      }
      const route=await inspectRoute(page,descriptor,language,afterURL,'after');
      if(route.kind!=='page') {
        await testInfo.attach('HTTP route transition',{body:Buffer.from(JSON.stringify(route)),contentType:'application/json'});
        return;
      }
      if(descriptor.id==='sample-admin')await loginFixture(page,afterURL,'after');
      await openPage(page,descriptor,language);
      await layout(page);
      const links=(await page.locator('a[href],area[href]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('href')))).map(link=>navigationPath(link,page.url())).filter(Boolean);
      await checkNavigation(afterURL,[...new Set(links)],run.scope.pagePaths);
      if(descriptor.generic) {
        expect(audit.problems).toEqual([]);return;
      }
      if(descriptor.id==='sample-admin') {
        await expect(page.locator('#admin-view')).toBeVisible();
        await page.locator('[data-admin-tab=machines]').click();
        await expect(page.locator('#inventory-view')).toBeVisible();
        await page.locator('#new-machine').click();
        await page.locator('#machine-form button[type=submit]').click();
        await expect(page.locator('#machine-form [aria-invalid=true]')).toHaveCount(2);
        await page.keyboard.press('Escape');await expect(page.locator('#machine-dialog')).not.toBeVisible();
      } else if(descriptor.id==='admin') {
        await expect(page.locator('#admin-login')).toBeVisible();
        const credentials=readFileSync(join(process.env.RMINTE_AFTER_FIXTURE,'services/case-access/.local/admin-login.txt'),'utf8');
        await page.locator('#admin-login input[name=username]').fill('admin');
        await page.locator('#admin-login input[name=password]').fill(credentials.match(/密码：(.*)/)[1]);
        await page.locator('#admin-login button[type=submit]').click();
        await expect(page.locator('#create-user')).toBeVisible();
        await page.locator('#change-password').click();await expect(page.locator('#password-dialog')).toBeVisible();
        await page.keyboard.press('Escape');await expect(page.locator('#password-dialog')).not.toBeVisible();
        await page.locator('#tab-inbox').click();await expect(page.locator('#inbox-panel')).toBeVisible();
        await page.locator('#logout').click();await expect(page.locator('#admin-login')).toBeVisible();
      } else if(descriptor.id==='lamp') {
        if(width===390) {
          await page.locator('#brandMenu').click();await expect(page.locator('#brandMenu')).toHaveAttribute('aria-expanded','true');
          await page.keyboard.press('Escape');await expect(page.locator('#brandMenu')).toHaveAttribute('aria-expanded','false');
        }
        const other=language==='zh'?'en-US':'zh-CN';await page.locator('#langSelect').selectOption(other);await expect(page.locator('#langSelect')).toHaveValue(other);
        await page.locator('#boardSettingsBtn').click();await expect(page.locator('#boardDialog')).toBeVisible();
        await page.keyboard.press('Escape');await expect(page.locator('#boardDialog')).not.toBeVisible();
      } else {
        if(width===390) {
          const menu=page.locator(descriptor.id==='models'?'#menuToggle':'[data-menu-toggle]');await expect(menu).toBeVisible();await menu.click();
          const overlay=page.locator('#'+await menu.getAttribute('aria-controls'));
          if(descriptor.id==='models')await expect(overlay).toHaveAttribute('open','');else await expect(overlay).toHaveAttribute('aria-hidden','false');
          await page.keyboard.press('Escape');
          if(descriptor.id==='models')await expect(overlay).not.toHaveAttribute('open','');else await expect(overlay).toHaveAttribute('aria-hidden','true');
          await expect(menu).toBeFocused();
          const focus=await menu.evaluate(el=>{const s=getComputedStyle(el);return s.outlineStyle!=='none'||s.boxShadow!=='none';});expect(focus).toBe(true);
        }
        const membership=page.locator('.footer .inception-membership');
        await expect(membership).toHaveCount(1);
        await expect(membership).toHaveAttribute('href','https://www.nvidia.com/en-us/startups/');
        await expect(membership.locator('img')).toHaveJSProperty('naturalWidth',1221);
        const markSize=await membership.locator('.inception-logo').boundingBox();
        expect(markSize.width).toBe(96);expect(markSize.height).toBe(34);
        const contact=page.locator('[data-contact-toggle]');
        await contact.scrollIntoViewIfNeeded();await contact.click();await expect(page.locator('[data-contact-popover]')).toHaveAttribute('aria-hidden','false');
        await expect(page.locator('[data-contact-popover] a[href^="mailto:"]').first()).toBeVisible();
        await page.keyboard.press('Escape');await expect(page.locator('[data-contact-popover]')).toHaveAttribute('aria-hidden','true');await expect(contact).toBeFocused();
        await page.evaluate(()=>scrollTo(0,0));
        const other=language==='zh'?'en':'zh';
        await page.locator('.language-toggle').first().click();await page.locator(`[data-language="${other}"]`).first().click();
        await expect(page.locator('html')).toHaveAttribute('lang',other==='zh'?'zh-CN':'en');
        await expect(page.locator('.footer [data-footer-text=footer]')).toHaveText(other==='zh'?'泛灵（成都）人工智能科技有限公司':'RMinte AI');
        await expect(page.locator('.footer [data-footer-text=contactButton]')).toHaveText(other==='zh'?'联系我们':'Contact');
        await page.locator('.language-toggle').first().click();await page.locator(`[data-language="${language}"]`).first().click();
        await expect(page.locator('html')).toHaveAttribute('lang',language==='zh'?'zh-CN':'en');
      }
      if(descriptor.id==='gallery') {
        const stage=page.locator('.visual-stage');
        const settled=async()=>{
          await page.locator('.product-image').evaluate(image=>image.decode());
          await expect(stage).not.toHaveClass(/is-changing/);
          // The gallery releases its input lock 420ms after the decoded image is shown.
          await page.waitForTimeout(450);
        };
        const count=page.locator('.gallery-count strong');await expect(count).toHaveText('01');
        await page.locator('[data-gallery-next]').click();await expect(count).toHaveText('02');
        await settled();await page.keyboard.press('ArrowLeft');await expect(count).toHaveText('01');
        await settled();
        const total=(await page.locator('.gallery-count span').last().textContent()).trim();
        await page.locator('[data-gallery-previous]').click();await expect(count).toHaveText(total);
        await settled();await layout(page);
        await page.locator('[data-gallery-next]').click();await expect(count).toHaveText('01');
        await settled();
        if(width===390) {
          await stage.scrollIntoViewIfNeeded();const box=await stage.boundingBox();
          const cdp=await context.newCDPSession(page),y=box.y+box.height/2;
          await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.8,y}]});
          await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width*.3,y}]});
          await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(count).toHaveText('02');
        }
        expect(await page.locator('.product-image').evaluate(e=>getComputedStyle(e).objectFit)).toBe('contain');
      }
      if(descriptor.id==='guides') {
        const input=page.locator('[data-guide-search-input]').first();await input.fill('OTA');
        const result=page.locator('[data-guide-search-result-list] a').first();await expect(result).toBeVisible();await result.click();
        await expect(page).toHaveURL(/\/guides\/(?:admin|root|network|security).*#/);
        await expect(page.locator(page.url().slice(page.url().indexOf('#')))).toBeVisible();
      }
      if(descriptor.id.startsWith('guide-')) {
        let toc=page.locator(`aside [data-lang-pane="${language}"] [data-toc-target]`).first();
        if(width===390) {await page.locator('.guide-mobile-toc summary').click();toc=page.locator('.guide-mobile-toc [data-lang-pane="'+language+'"] [data-toc-target]').first();}
        const target=await toc.getAttribute('href');await toc.click();await expect(page).toHaveURL(new RegExp(target+'$'));
        const copy=page.locator(`[data-lang-pane="${language}"] [data-copy-code]`).first();
        // Some articles have no code blocks; the source determines whether copying is applicable.
        if(await copy.count()) {
          await context.grantPermissions(['clipboard-read','clipboard-write']);await copy.click();await expect(copy).toHaveText(language==='zh'?'已复制':'Copied');
          const expected=await copy.locator('..').locator('code').textContent();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(expected);
        }
      }
      if(descriptor.id==='downloads') {
        const section=page.locator('.download-overview-item').last();const hash=await section.getAttribute('href');await section.click();await expect(page).toHaveURL(new RegExp(hash+'$'));
        const file=page.locator('a[download][href*=".pdf"]').first();const downloaded=page.waitForEvent('download');await file.click();const download=await downloaded;
        expect(readFileSync(await download.path()).subarray(0,5).toString()).toBe('%PDF-');
        expect(await page.locator('[data-tianshan-file="firmware"]').getAttribute('href')).toContain('?release=ci-fixture');
      }
      if(descriptor.id==='models') {
        await page.locator('#tabVllm').click();await expect(page.locator('#tabVllm')).toHaveAttribute('aria-selected','true');
        await page.locator('#tabCpp').click();await expect(page.locator('#tabCpp')).toHaveAttribute('aria-selected','true');
        await expect(page.locator('[data-model]').first()).toBeDisabled();
      }
      if(descriptor.id==='cases') {
        const card=page.locator('.cs-card').first();const more=card.locator('.cs-more');await more.click();await expect(more).toHaveAttribute('aria-expanded','true');
        const demo=page.locator('[data-action="demo"]').first();await demo.click();await expect(page.locator('dialog[open]')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('dialog[open]')).toHaveCount(0);
        const assetURLs=run.scope.demos.flatMap(item=>item.kind==='website'?[]:[item.route,...item.files.map(file=>item.route+'/'+file.split('/').map(encodeURIComponent).join('/'))]);
        for(const url of assetURLs)expect((await page.request.get(afterURL+url)).status(),url).toBe(401);
        for(const item of run.scope.demos.filter(item=>item.kind==='private'))expect((await page.request.get(afterURL+item.assetPath+'index.html')).status(),item.id+' stays private').toBe(404);
        const missing=afterURL+'/api/resources/ci-unregistered';
        const account=await createBrowserAccount();
        try {
          await account.setPermissions(caseIds);
          await page.locator('#access [data-action="login"]').click();
          await page.locator('#account').fill(account.username);await page.locator('#password').fill('intentionally-wrong-test-password');
          const denied=page.waitForResponse(r=>r.url()===afterURL+'/api/login'&&r.request().method()==='POST',{timeout:10000});
          await page.locator('#login-form [type=submit]').click();expect((await denied).status()).toBe(401);
          await expect(page.locator('#login-form [role=status]')).toContainText(language==='zh'?'用户名或密码不正确':'incorrect');
          await page.locator('#password').fill(account.password);
          const accepted=page.waitForResponse(r=>r.url()===afterURL+'/api/login'&&r.request().method()==='POST',{timeout:10000});
          await page.locator('#login-form [type=submit]').click();expect((await accepted).status()).toBe(200);
          await expect(page.locator('#access .who')).toHaveText(account.username);
          await expect(page.locator('#access li').first()).toHaveAttribute('data-state','ok');
          const visited=new Set(),casesURL=page.url();
          const previousURL=`${afterURL}/?lang=${language}`;
          await page.goto(previousURL,{waitUntil:'domcontentloaded'});await page.goto(casesURL,{waitUntil:'domcontentloaded'});
          await expect(page.locator('#access .who')).toHaveText(account.username);
          for(const trigger of await page.locator('[data-action="demo"]').all()) {
            const caseName=await trigger.locator('xpath=ancestor::article').getByRole('heading').innerText();
            const requested=page.waitForResponse(r=>r.request().method()==='GET'&&r.url().startsWith(afterURL+'/api/resources/')&&new URL(r.url()).pathname.endsWith('/preview'));
            const openedAt=Date.now();await trigger.click();const response=await requested,id=new URL(response.url()).pathname.split('/')[3];
            const item=run.scope.demos.find(item=>item.id===id);
            if(!item) {
              expect(response.status()).toBe(503);
              await expect(page.locator('#case-demo-modal [role=status]')).toContainText(language==='zh'?'演示或资料尚未接入':'not connected yet');

              await page.keyboard.press('Escape');await expect(trigger).toBeFocused();continue;
            }
            expect(response.status(),id).toBe(200);
            const modal=page.locator('#case-demo-modal'),close=page.locator('[data-case-demo-close]');
            const exercise=item.kind==='private'?(await import(pathToFileURL(join(process.cwd(),item.scenario)).href)).default:null;
            for(const url of assetURLs.filter(url=>url===item.route||url.startsWith(item.route+'/'))) {
              const asset=await page.request.head(afterURL+url);expect(asset.status(),url).toBe(200);
              expect(asset.headers()['cache-control'],url).toContain('no-store');expect(asset.headers()['x-frame-options'],url).toBe('SAMEORIGIN');
            }
            if(item.kind==='private')expect((await page.request.get(afterURL+item.route+'/ci-missing.js')).status()).toBe(404);
            for(const attempt of [0,1]) {
              if(attempt)await trigger.click();
              await expect(modal).toBeVisible();await expect(page).toHaveURL(casesURL);
              const frame=page.frameLocator('#case-demo-frame'),surface=modal;
              await expect(modal).toHaveAttribute('data-state','ready');if(item.kind==='private')await expect(page.locator('#case-demo-frame')).toHaveAttribute('src',new RegExp(item.route+'/'));
              await expect(frame.locator('body')).toBeVisible();
              if(!attempt&&item.kind==='private')await testInfo.attach(id+' ready timing',{body:Buffer.from(JSON.stringify({readyMilliseconds:Date.now()-openedAt,limitMilliseconds:30000})),contentType:'application/json'});
              if(!attempt)await testInfo.attach(`${id} initial`,{body:await surface.screenshot(),contentType:'image/png'});
              if(exercise)await test.step(`${id}: ${attempt?'reopen':'main click flow'}`,()=>exercise({page,frame,caseName,reopen:!!attempt,language,width,testInfo}));
              else{
                await expect(frame.locator('h1')).toHaveText('Local website preview fixture');
                await expect(frame.locator('output')).toHaveText('0');await frame.locator('#act').click();await expect(frame.locator('output')).toHaveText('1');
              }
              expect(await frame.locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),id).toBe(true);
              if(!attempt)await testInfo.attach(`${id} result`,{body:await surface.screenshot(),contentType:'image/png'});
              if(attempt){await close.focus();await page.keyboard.press('Escape');}else await close.click();
              await expect(modal).not.toBeVisible();await expect(page.locator('#case-demo-frame')).toHaveCount(0);
              await expect(page.locator('body')).not.toHaveClass(/case-demo-open/);await expect(trigger).toBeFocused();
              await page.goBack({waitUntil:'domcontentloaded'});await expect(page).toHaveURL(previousURL);
              await page.goForward({waitUntil:'domcontentloaded'});await expect(page).toHaveURL(casesURL);await expect(page.locator('#access .who')).toHaveText(account.username);
            }
            expect((await page.request.get(afterURL+item.route.replace(/demo$/,'download'))).status()).toBe(503);
            visited.add(id);
          }
          expect([...visited].sort()).toEqual(run.scope.demos.map(item=>item.id).sort());
          expect((await page.request.get(missing+'/demo')).status()).toBe(403);
          expect((await page.request.get(missing+'/download')).status()).toBe(403);
          await account.setPermissions([]);
          await demo.click();await expect(page.locator('#case-demo-modal [role=status]')).toContainText(language==='zh'?'尚未获得查看演示权限':'not yet authorised');
          await expect(page.locator('#access li').first()).not.toHaveAttribute('data-state','ok');
          for(const url of assetURLs)expect((await page.request.get(afterURL+url)).status(),url).toBe(403);
          expect((await page.request.get(missing+'/demo')).status()).toBe(403);
          expect((await page.request.get(missing+'/download')).status()).toBe(403);
          await page.keyboard.press('Escape');await page.locator('#access button.txt').click();
          await expect(page.locator('#access [data-action="login"]')).toBeVisible();
          expect((await page.request.get(missing+'/demo')).status()).toBe(401);
        } finally {await account.remove();}
      }
      expect(audit.problems).toEqual([]);
      await testInfo.attach('operation environment',{body:Buffer.from(JSON.stringify({data:'Temporary local D1 and OTA test response',externalFontIssues:audit.external})),contentType:'application/json'});
    });
  });
}

// The standalone demo owns its rendered snapshots and does not use the main site's table styles.
if(run.scope.infrastructure||run.scope.files.some(file=>file.startsWith('website/tianshanos-demo/'))) {
  for(const language of ['zh','en'])for(const width of [1440,768,390,320]) {
    test(`demo table layout survives navigation and rule execution ${language} ${width}px`,async({page})=>{
      await page.setViewportSize({width,height:1000});
      const audit=await setup(page,language);
      const columnsAlign=async selector=>{
        const failures=await page.locator(selector).evaluateAll(tables=>tables.flatMap(table=>{
          const rows=[...table.querySelectorAll('.tr')].filter(row=>row.closest('.data-table')===table&&row.getClientRects().length);
          const header=rows.find(row=>row.classList.contains('th'));
          if(!header)return [];
          const x=[...header.children].map(cell=>cell.getBoundingClientRect().left);
          return rows.filter(row=>row!==header).flatMap(row=>[...row.children].flatMap((cell,index)=>{
            const box=cell.getBoundingClientRect();
            return Math.abs(box.left-x[index])>2?[`${row.textContent.trim().slice(0,30)}: column ${index+1} misaligned`]:[];
          }));
        }));
        expect(failures).toEqual([]);
      };
      for(const route of ['system','network','files','terminal','automation','commands','security','ota']) {
        await page.goto(`${afterURL}/tianshanos-demo/${route}.html?lang=${language}`);
        await expect(page.locator('#page-content>.page')).toBeVisible();
        const expected=await page.evaluate(({route,language})=>{
          const baseline=document.createElement('div');baseline.innerHTML=window.TS_DEMO_PAGES.pages[language][route];
          baseline.querySelectorAll('.modal').forEach(node=>node.remove());return baseline.querySelectorAll('.data-table').length;
        },{route,language});
        await expect(page.locator('#page-content .data-table')).toHaveCount(expected);
        await columnsAlign('#page-content .data-table');
      }
      await page.goto(`${afterURL}/tianshanos-demo/files.html?lang=${language}`);
      const fileRows=page.locator('#file-list .file-row');
      const checkFiles=async names=>{
        await expect(fileRows.locator('.fn')).toHaveText(names);
        await expect(page.locator('#file-list>.data-table')).toHaveCount(1);
        await columnsAlign('#file-list .data-table');
        const centers=await fileRows.evaluateAll(rows=>rows.map(row=>[...row.children].map(cell=>{const r=cell.getBoundingClientRect();return r.top+r.height/2;})));
        expect(centers.every(row=>Math.max(...row)-Math.min(...row)<2)).toBe(true);
      };
      await checkFiles(['config','logs','system.json','README.txt']);
      await fileRows.locator('[data-demo-click="demoFile(\'config\',\'dir\')"]').click();
      await checkFiles(['cooling.json']);
      await page.locator('#breadcrumb button').click();
      await checkFiles(['config','logs','system.json','README.txt']);
      await fileRows.locator('[data-demo-click="demoFile(\'logs\',\'dir\')"]').click();
      await checkFiles(['system.log']);
      await page.locator('[data-demo-click="navigateToPath(\'/spiffs\')"]').click();
      await checkFiles(['index.html']);
      await page.locator('[data-demo-click="navigateToPath(\'/sdcard\')"]').click();
      await checkFiles(['config','logs','system.json','README.txt']);
      await page.locator('#lang-switch button').click();
      await checkFiles(['config','logs','system.json','README.txt']);
      await page.goto(`${afterURL}/tianshanos-demo/automation.html?lang=${language}`);
      const rule=page.locator('#rules-list .tr').nth(1),count=await page.locator('#rules-list .tr').count();
      const before=Number(await rule.locator(':scope>div').nth(5).innerText());
      for(let index=1;index<=2;index++) {
        await rule.locator('[data-demo-click^="triggerRule("]').click();
        await expect(rule).toContainText(language==='zh'?'模拟执行完成':'Simulated run complete');
        await expect(rule.locator(':scope>div').nth(5)).toHaveText(String(before+index));
        await expect(page.locator('#rules-list .tr')).toHaveCount(count);
        await columnsAlign('#rules-list .data-table');
      }
      await layout(page);expect(audit.problems).toEqual([]);
    });
  }
}
