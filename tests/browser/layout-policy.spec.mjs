import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {layout,screenshotRegion} from './helpers.mjs';

test('a hidden ancestor cannot conceal clipped text or gallery photography',async({page})=>{
  await page.setContent('<main><div style="width:90px;height:22px;overflow:hidden"><h1 style="width:320px;margin:0">Clipped product heading</h1></div></main>');
  await expect(layout(page)).rejects.toThrow(/text clipped/);
  await page.setContent('<main><figure class="visual-stage" style="width:100px;overflow:hidden;margin:0"><img class="product-image" width="300" height="150" alt="test fixture"></figure></main>');
  await expect(layout(page)).rejects.toThrow(/gallery image clipped/);
});

test('intentional scrollable content remains accessible and is not classified as clipping',async({page})=>{
  await page.setContent('<main><div style="width:100px;overflow:auto"><h1 style="width:320px;margin:0">Scrollable product heading</h1></div></main>');
  await expect(layout(page)).resolves.toBeUndefined();
});

test('whole-page evidence includes fixed navigation and the footer outside main',async({page},testInfo)=>{
  await page.setContent('<body style="margin:0"><header style="position:fixed;top:0;height:100px">Fixed navigation</header><main style="height:1800px"><h1>Long page</h1></main><footer style="height:500px">Footer outside main</footer></body>');
  await page.evaluate(()=>scrollTo(0,1200));
  const file=testInfo.outputPath('whole-page.png');await screenshotRegion(page,'body',file);
  const bytes=readFileSync(file),height=bytes.readUInt32BE(20);
  expect(height).toBe(await page.evaluate(()=>document.documentElement.scrollHeight));
  expect(height).toBeGreaterThan(await page.locator('main').evaluate(el=>el.offsetHeight));
  expect(await page.evaluate(()=>scrollY)).toBe(0);
});

test.describe('long capture with touch at device scale 2',()=>{
  test.use({deviceScaleFactor:2,hasTouch:true});
  test('long-page bands retain boundary pixels, fixed navigation and the final footer without changing the viewport',async({page},testInfo)=>{
    await page.setViewportSize({width:390,height:900});
    await page.setContent(`<style>* {transition-duration:1ms!important} h1{font-size:4vw;margin:0}</style><body style="margin:0"><header style="position:fixed;z-index:1;top:0;width:100%;height:40px;background:#ff0000">Navigation</header><main style="height:33000px;position:relative;background:#111111"><h1>Long document</h1><div style="position:absolute;top:29999px;height:1px;width:100%;background:#ffff00"></div><div style="position:absolute;top:30000px;height:1px;width:100%;background:#00ffff"></div></main><footer style="height:17px;line-height:17px;background:#0000ff">Footer</footer><div style="position:fixed;z-index:2;right:0;bottom:0;width:10px;height:10px;background:#ff00ff"></div></body>`);
    const before=await page.evaluate(()=>({width:innerWidth,height:innerHeight,documentHeight:document.documentElement.scrollHeight,scale:devicePixelRatio,scrollY,touch:matchMedia('(pointer:coarse)').matches,hover:matchMedia('(hover:none)').matches,styles:document.querySelectorAll('style').length}));
    const result=await screenshotRegion(page,'body',testInfo.outputPath('long-page.png'));
    expect(result.canvas).toEqual({width:390,height:33017});expect(result.images).toHaveLength(2);
    const pixel=async(file,x,y)=>page.evaluate(async({base64,x,y})=>{
      const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
      const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}),x,y,1,1);
      const context=new OffscreenCanvas(1,1).getContext('2d');context.drawImage(bitmap,0,0);bitmap.close();
      return [...context.getImageData(0,0,1,1).data];
    },{base64:readFileSync(file).toString('base64'),x,y});
    expect(await pixel(result.images[0].path,200,10)).toEqual([255,0,0,255]);
    expect(await pixel(result.images[0].path,200,29999)).toEqual([255,255,0,255]);
    expect(await pixel(result.images[0].path,385,890)).toEqual([17,17,17,255]);
    expect(await pixel(result.images[1].path,200,0)).toEqual([0,255,255,255]);
    expect(await pixel(result.images[1].path,200,3016)).toEqual([0,0,255,255]);
    expect(await pixel(result.images[1].path,385,890)).toEqual([17,17,17,255]);
    expect(await pixel(result.images[1].path,385,3016)).toEqual([255,0,255,255]);
    expect(await page.evaluate(()=>({width:innerWidth,height:innerHeight,documentHeight:document.documentElement.scrollHeight,scale:devicePixelRatio,scrollY,touch:matchMedia('(pointer:coarse)').matches,hover:matchMedia('(hover:none)').matches,styles:document.querySelectorAll('style').length}))).toEqual(before);
    await page.evaluate(()=>setTimeout(()=>{document.body.dataset.scriptRestored='yes';},0));
    await expect(page.locator('body')).toHaveAttribute('data-script-restored','yes');
  });
});
