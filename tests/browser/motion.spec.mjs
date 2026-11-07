import {test,expect} from '@playwright/test';
import {createHash} from 'node:crypto';
import {run,setup,afterURL} from './helpers.mjs';

test.use({video:'on'});

if(run.scope.homeMotion)for(const language of ['zh','en'])for(const width of [1440,390]) {
  test.describe(`home motion ${language} ${width}px`,()=>{
    test.use({viewport:{width,height:900},reducedMotion:'no-preference',hasTouch:width===390});
    test('video, decomposition, light and all craft steps follow actual scrolling',async({page},testInfo)=>{
      const audit=await setup(page,language);await page.goto(afterURL+'/?lang='+language,{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
      const video=page.locator('#hero video').first();await expect.poll(()=>video.evaluate(v=>v.readyState>=2&&!v.paused)).toBe(true);
      // main.js restores the initial browser scroll position through 520ms.
      // Observe a full second of actual playback before starting the scroll sequence.
      const initial=await video.evaluate(v=>v.currentTime);await expect.poll(()=>video.evaluate(v=>v.currentTime)).toBeGreaterThan(initial+1);
      const section=page.locator('#teardown'),canvas=page.locator('.teardown-canvas');
      const frames=[],images=[];
      for(const fraction of [0,.5,1,0]) {
        await section.evaluate((el,f)=>scrollTo({top:scrollY+el.getBoundingClientRect().top+(el.offsetHeight-innerHeight)*f,behavior:'instant'}),fraction);
        let observedFrame;
        const readFrame=async()=>observedFrame=Number(await canvas.getAttribute('data-current-frame'));
        if(fraction===.5)await expect.poll(async()=>Math.abs(await readFrame()-60.5),{timeout:20000}).toBeLessThan(1);
        else await expect.poll(readFrame,{timeout:20000}).toBe(fraction===0?1:120);
        frames.push(observedFrame);
        const image=await page.screenshot();images.push(createHash('sha256').update(image).digest('hex'));
        await testInfo.attach('teardown '+fraction,{body:image,contentType:'image/png'});
      }
      expect(frames[0]).toBeLessThan(frames[1]);expect(frames[1]).toBeLessThan(frames[2]);expect(frames[3]).toBe(frames[0]);
      expect(images[0]).not.toBe(images[1]);expect(images[1]).not.toBe(images[2]);
      const light=page.locator('.sapphire-light-image');await light.scrollIntoViewIfNeeded();await light.evaluate(e=>e.decode());
      const values=[];
      for(const viewportFraction of [.95,.5,.03,.5]) {
        await light.evaluate((image,f)=>{
          const rect=image.getBoundingClientRect(),scale=Math.max(rect.width/image.naturalWidth,rect.height/image.naturalHeight),position=parseFloat(getComputedStyle(image).objectPosition.split(' ')[1])/100;
          const center=scrollY+rect.top+(rect.height-image.naturalHeight*scale)*position+574*scale;scrollTo({top:center-innerHeight*f,behavior:'instant'});
        },viewportFraction);
        // CSS scroll positions round to pixels; the glow rounds to three decimals.
        if(viewportFraction===.5)await expect.poll(()=>light.evaluate(e=>Number(e.style.getPropertyValue('--sapphire-glow')))).toBeGreaterThan(.995);
        else await expect.poll(()=>light.evaluate(e=>Number(e.style.getPropertyValue('--sapphire-glow')))).toBe(0);
        values.push(await light.evaluate(e=>Number(e.style.getPropertyValue('--sapphire-glow'))));
        await testInfo.attach('sapphire '+viewportFraction,{body:await page.screenshot(),contentType:'image/png'});
      }
      expect(values[1]).toBeGreaterThan(values[0]);expect(values[3]).toBeGreaterThan(values[2]);
      for(const index of [0,1,2,3,0]) {
        await page.locator('#craft').evaluate((el,i)=>scrollTo({top:scrollY+el.getBoundingClientRect().top+(el.offsetHeight-innerHeight)*(i+.1)/4,behavior:'instant'}),index);
        await expect(page.locator('.craft-story-panel').nth(index)).toHaveClass(/is-active/);
        await testInfo.attach('craft '+index,{body:await page.screenshot(),contentType:'image/png'});
      }
      await expect(page.locator('.footer-contact')).toBeVisible();
      await page.emulateMedia({reducedMotion:'reduce'});
      await expect(page.locator('#craft')).not.toHaveClass(/is-scroll-story/);
      for(const panel of await page.locator('.craft-story-panel').all())await expect(panel).not.toHaveAttribute('aria-hidden','true');
      expect(audit.problems).toEqual([]);
      await testInfo.attach('scroll outcomes',{body:Buffer.from(JSON.stringify({frames,sapphire:values,craft:[0,1,2,3,0],reducedMotion:'all craft panels accessible'})),contentType:'application/json'});
    });
  });
}
