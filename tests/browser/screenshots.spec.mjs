import {test,expect} from '@playwright/test';
import {run,languages,setup,openPage,inspectRoute,capture,saveRecords,beforeURL,afterURL,loginFixture} from './helpers.mjs';

// Full PNGs are the evidence here; duplicating them as DOM snapshots, filmstrips and video adds capture work.
test.use({video:'off',trace:{mode:'retain-on-failure',snapshots:false,screenshots:false}});

for(const descriptor of run.scope.pages)for(const language of languages(descriptor))for(const width of run.scope.widths)for(const [phase,base]of [['before',beforeURL],['after',afterURL]]) {
  test.describe(`${descriptor.id} ${language} ${width}px ${phase}`,()=>{
    test.use({viewport:{width,height:900},hasTouch:width<=768,locale:language==='zh'?'zh-CN':language});
    test('current commit has complete region evidence with actual languages recorded',async({page},testInfo)=>{
      const audit=await setup(page,language),records=[];
      await page.context().clearCookies();
      if(['admin','sample-admin'].includes(descriptor.id))await loginFixture(page,base,phase);
      const route=await inspectRoute(page,descriptor,language,base,phase);
      if(route.kind!=='page') {
        for(const region of descriptor.regions)records.push({...route,phase,page:descriptor.id,path:descriptor.path,language,width,region});
      } else {
        await openPage(page,descriptor,language,base,phase);
        for(const region of descriptor.regions)records.push({...await capture(page,testInfo,descriptor,language,width,phase,region,audit),...route});
      }
      saveRecords(`${descriptor.id}-${language}-${width}-${phase}`,records);
      expect(records).toHaveLength(descriptor.regions.length);
    });
  });
}
