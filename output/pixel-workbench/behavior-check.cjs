const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.resolve('website/tools/emoji2pixel/app.js'), 'utf8');
class Pixels { constructor(data,width,height) { this.data=data; this.width=width; this.height=height; } }
const canvas = () => ({width:0,height:0,getContext:()=>({clearRect(){},putImageData(data){this.data=data;},drawImage(){}})});
const context = vm.createContext({document:{addEventListener(){},querySelector(){return null;},createElement:canvas},ImageData:Pixels,Uint8ClampedArray,Blob,console,setTimeout,clearTimeout,URL,Date});
vm.runInContext(source+'\nglobalThis.Editor = Emoji2Pixel;',context);
const proto=context.Editor.prototype;
const test=(name,fn)=>Promise.resolve().then(fn).then(()=>console.log('PASS',name));
const pixel=(value)=>new Pixels(new Uint8ClampedArray([value,20,30,255,40,50,60,255,70,80,90,255,100,110,120,255]),2,2);
function editor(frames=[]) {
 const e=Object.create(proto);
 Object.assign(e,{frames,currentFrameIndex:0,gridWidth:2,gridHeight:2,processUndo:null,addingFrame:false,mode:'edit',isPlaying:false,emojiInput:{value:'different pending Emoji'},mainCanvas:{width:40,height:40},ctx:{clearRect(){}},animSpeedInput:{value:500},tweenFramesInput:{value:5},speedValue:{},tweenFrames:5,pauseAnimation(){},clearSelectionState(){},refreshWorkbench(){},selectFrame(i){this.currentFrameIndex=i;},updateFramesList(){},showToast(message){this.messages.push(message);},messages:[],t(k){return k;},getGlobalRenderSettings(){return {quantizeEnabled:false,sharpenMode:'none',sharpenStrength:0};}});
 return e;
}
(async()=>{
 await test('source replacement keeps one frame, preserves the exact edited frame for Undo',()=>{
  const original={name:'edited',imageData:pixel(12),baseImageData:pixel(12),processOps:[{type:'erase-rect',x:0,y:0,w:1,h:1}],transform:{scale:120},renderOverrides:{quantizeEnabled:true}};
  const e=editor([original]);e.acceptSourceFrame({name:'replacement',imageData:pixel(200)});assert.equal(e.frames.length,1);assert.equal(e.frames[0].name,'replacement');e.undoProcess();assert.equal(e.frames[0],original);assert.equal(e.frames[0].transform.scale,120);assert.equal(e.frames[0].processOps.length,1);
 });
 await test('explicit Add appends once, following selection replaces the new frame',()=>{
  const e=editor([{name:'first'}]);e.addingFrame=true;e.acceptSourceFrame({name:'second'});assert.equal(e.frames.length,2);assert.equal(e.currentFrameIndex,1);assert.equal(e.addingFrame,false);e.acceptSourceFrame({name:'third'});assert.equal(e.frames.length,2);assert.equal(e.frames[1].name,'third');
 });
 await test('current-frame export uses edited pixels and its own override, ignoring input text',()=>{
  const target={imageData:pixel(133),renderOverrides:{quantizeEnabled:false,sharpenMode:'none',sharpenStrength:0}};
  const e=editor([{imageData:pixel(1)},target]);e.currentFrameIndex=1;const actual=e.getActivePixelData();assert.equal(actual.imageData,target.imageData);assert.equal(actual.renderSettings,target.renderOverrides);assert.equal(actual.imageData.data[0],133);
 });
 await test('GIF undo restores original frames and timing as one operation',()=>{
  const old={name:'old'};const e=editor([old]);e.rememberWorkspace();e.processUndo.timing={tween:5,speed:'500'};e.frames=[{name:'gif1'},{name:'gif2'}];e.tweenFrames=0;e.animSpeedInput.value=90;e.undoProcess();assert.equal(e.frames[0],old);assert.equal(e.tweenFrames,5);assert.equal(e.animSpeedInput.value,'500');
 });
 await test('touch rectangle and touch color use the corresponding tools, not move',()=>{
  const e=editor([{}]);e.isColorSelecting=false;let down,move,picked;e.onCanvasMouseDown=p=>down=p;e.onCanvasMouseMove=p=>move=p;e.selectByColorAtPoint=p=>picked=p;const event={touches:[{clientX:4,clientY:9}],preventDefault(){}};e.onCanvasTouchStart(event);e.onCanvasTouchMove(event);assert.equal(down.clientX,4);assert.equal(move.clientY,9);e.isColorSelecting=true;e.onCanvasTouchStart(event);assert.equal(picked.clientY,9);
 });
 await test('Unicode parser excludes comments and strips version labels',()=>{
  const e=editor();const data=e.parseEmojiTest('# group: Smileys & Emotion\n# fully-qualified : ignored\n1F600 ; fully-qualified # 😀 E1.0 grinning face\n');assert.equal(data[0].emojis.length,1);assert.equal(data[0].emojis[0].name,'grinning face');
 });
 for(const scenario of ['success','uploadFailure','displayFailure']) await test('device request chain: '+scenario,async()=>{
  const e=editor([{imageData:pixel(1)}]);Object.assign(e,{tianshanHost:'unit-test.invalid',tianshanImageDir:'/sdcard/images',tianshanDevice:'matrix',buildTianshanFilename:()=> 'fixture.png',createExportCanvas:type=>{assert.equal(type,'raw');return {canvas:{toBlob:done=>done(new Blob(['test']))}};}});
  const requests=[];context.fetch=async(url,options)=>{requests.push({url,options});if(scenario==='displayFailure'&&url.endsWith('/led/image'))throw Error('offline');return {ok:!(scenario==='uploadFailure'&&url.includes('/file/upload')),status:500,json:async()=>({code:0})};};
  await e.uploadToTianshan();assert.ok(requests[0].url.endsWith('/storage/mkdir'));assert.ok(requests[1].url.includes('/file/upload?path='));if(scenario==='success'){assert.equal(requests.length,3);const body=JSON.parse(requests[2].options.body);assert.equal(body.device,'matrix');assert.equal(body.path,'/sdcard/images/fixture.png');assert.ok(e.messages.includes('tianshanUploaded'));}else{assert.ok(!e.messages.includes('tianshanUploaded'));assert.ok(e.messages.includes('tianshanUploadFailed'));if(scenario==='uploadFailure')assert.equal(requests.length,2);}
 });
})().catch(err=>{console.error(err);process.exitCode=1;});
