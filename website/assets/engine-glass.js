/* Home, inference engine section (D9): three frosted glass plates (and an SSD plate) drawn with hand-written WebGL2, no library.
   The glass refracts what is drawn behind it (the previous layers are copied into a texture before each plate), frosts it, reflects a
   small studio environment and catches light on its bevel; the cells sit inside the glass. main.js calls RMEngineGlass.setScene() when
   the visitor opens another topic. Without WebGL2 the figure shows a still of scene 0; with reduced motion it draws one still frame
   per scene and never loops. The renderer below follows design-preview/engine-glass/engine-webgl2.html. */
window.RMEngineGlass = (() => {
const stage=document.getElementById('engineArt'),cv=document.getElementById('engineGlass');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const labels=[...stage.querySelectorAll('.engine-label')];
let scene=0,sceneT=performance.now(),dirty=true,vis=false,raf=0;
// Scroll-linked opening: scrollP 0 = the plates are stacked, 1 = the layout the figure used to have. The middle of the figure
// starts opening just below the window's bottom edge (104%) and finishes 90px after the whole figure is inside the window; the
// names fade in over the last stretch. spread/--lab are eased copies of it. With reduced motion the figure is simply open.
let scrollP=1,spread=1,written='',SPREAD_MIN=.18;
function scrollProgress(){
  const r=stage.getBoundingClientRect(),vh=innerHeight,c=r.top+r.height/2,start=vh*1.04,end=vh*.92-r.height/2-90;
  return Math.max(0,Math.min(1,(start-c)/Math.max(1,start-end)));
}
function updateProgress(){scrollP=scrollProgress();dirty=true;kick()}
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
function setScene(s,names){
  // names: the accessible name of each scene. The still always shows scene 0.
  if(names) stage.setAttribute('aria-label',names[gl?s:0]);
  if(!gl) return;
  scene=s;sceneT=performance.now();stage.dataset.scene=s;dirty=true;kick();
}
const gl=cv.getContext('webgl2',{antialias:true,alpha:false,powerPreference:'high-performance'});

// math
const m4={
 persp(f,a,n,fa){const t=1/Math.tan(f/2),r=1/(n-fa);return[t/a,0,0,0,0,t,0,0,0,0,(n+fa)*r,-1,0,0,2*n*fa*r,0]},
 look(e,c,u){let z=[e[0]-c[0],e[1]-c[1],e[2]-c[2]];let l=Math.hypot(...z);z=z.map(v=>v/l);let x=[u[1]*z[2]-u[2]*z[1],u[2]*z[0]-u[0]*z[2],u[0]*z[1]-u[1]*z[0]];l=Math.hypot(...x);x=x.map(v=>v/l);const y=[z[1]*x[2]-z[2]*x[1],z[2]*x[0]-z[0]*x[2],z[0]*x[1]-z[1]*x[0]];
  return[x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*e[0]+x[1]*e[1]+x[2]*e[2]),-(y[0]*e[0]+y[1]*e[1]+y[2]*e[2]),-(z[0]*e[0]+z[1]*e[1]+z[2]*e[2]),1]},
 mul(a,b){const o=new Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o}
};

// plates: 0 SSD, 1 bottom, 2 middle, 3 top. y is the centre height.
const PW=4.5,PD=2.7,PH=.28,PR=.42,BV=.085;
const plates=[
 {w:PW,d:1.02,y:[-3.5,-3.5,-3.5],sc:[0,1,0]},
 {w:PW,d:PD,y:[-1.7,-1.7,-1.7],sc:[1,1,1]},
 {w:PW,d:PD,y:[0,.06,0],sc:[1,1,1]},
 {w:PW,d:PD,y:[1.7,1.8,1.66],sc:[1,1,1]}
];
const ps=plates.map(p=>({y:p.y[0],s:p.sc[0]}));
const W3=[1,0,0];
let az=.62,el=.47,tAz=.62,tEl=.47,px=0,py=0;
const light=[.2,.6,.75];
let backTex=null,tw=0,th=0,last=performance.now();

function view3(aspect){
  const R=23,tg=[1.1,-.1,0];
  const cam=[tg[0]+R*Math.cos(el)*Math.sin(az),tg[1]+R*Math.sin(el),tg[2]+R*Math.cos(el)*Math.cos(az)];
  const view=m4.look(cam,tg,[0,1,0]),proj=m4.persp(.31,aspect,1,60);
  return{cam,view,vp:m4.mul(proj,view)};
}
const effY=pi=>{if(pi===0)return ps[0].y;const c=ps[2].y;return c+(ps[pi].y-c)*(SPREAD_MIN+(1-SPREAD_MIN)*spread)};
// the names follow the right-most corner of each plate and move with the camera
function placeLabels(vp, drawing = cv) {
  const width = drawing.clientWidth;
  const height = drawing.clientHeight;
  const top = drawing.offsetTop;
  const right = stage.clientWidth - 2;
  for (const label of labels) {
    const index = Number(label.dataset.plate);
    const {w, d} = plates[index];
    const {y, s} = ps[index];
    let rightmostX = -Infinity;
    let rightmostY = 0;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const x = sx * w * s / 2;
      const z = sz * d * s / 2;
      const clipW = vp[3] * x + vp[7] * y + vp[11] * z + vp[15];
      const clipX = vp[0] * x + vp[4] * y + vp[8] * z + vp[12];
      const screenX = (clipX / clipW * .5 + .5) * width;
      if (screenX > rightmostX) {
        const clipY = vp[1] * x + vp[5] * y + vp[9] * z + vp[13];
        rightmostX = screenX;
        rightmostY = top + (.5 - clipY / clipW * .5) * height;
      }
    }
    // Keep the leader at the plate corner. Long translations wrap in the space to its right.
    const x = rightmostX + 8;
    label.style.setProperty('--engine-label-width', `${Math.floor(right - x)}px`);
    label.style.transform = `translate(${x.toFixed(1)}px,${rightmostY.toFixed(1)}px) translateY(-50%)`;
  }
}

if(!gl){
  // no WebGL2: the still of scene 0 stays, the names are placed once for it
  const still=stage.querySelector('.engine-still');still.src=still.dataset.src;
  stage.classList.add('is-still');stage.style.setProperty('--lab',1);
  const place=()=>{if(still.clientWidth&&still.clientHeight)placeLabels(view3(still.clientWidth/still.clientHeight).vp,still)};
  place();new ResizeObserver(place).observe(stage);
  return{setScene};
}

/* ---------- WebGL ---------- */
if(!reduce){
  scrollP=spread=scrollProgress();
  addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);
}
const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o),s);return o};
const prog=(v,f)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,'#version 300 es\n'+v));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'#version 300 es\nprecision highp float;\n'+f));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))console.error(gl.getProgramInfoLog(p));return p};
const U=(p,n)=>gl.getUniformLocation(p,n);

/* glass plate geometry: rounded-rectangle outline with a circular-arc bevel */
function slabGeo(W,D,H,R,b){
  const pts=[],nor=[];const cs=[[1,1,0],[-1,1,90],[-1,-1,180],[1,-1,270]];
  for(const [sx,sz,a0] of cs){for(let k=0;k<=14;k++){const th=(a0+k*90/14)*Math.PI/180;pts.push([sx*(W/2-R)+R*Math.cos(th),sz*(D/2-R)+R*Math.sin(th)]);nor.push([Math.cos(th),Math.sin(th)])}}
  const rings=[];const S=7;
  rings.push({inset:b,y:-H/2,c:0,s:-1});
  for(let k=1;k<=S;k++){const f=-Math.PI/2+k*(Math.PI/2)/S;rings.push({inset:b-b*Math.cos(f),y:-H/2+b+b*Math.sin(f),c:Math.cos(f),s:Math.sin(f)})}
  for(let k=1;k<=S;k++){const f=k*(Math.PI/2)/S;rings.push({inset:b-b*Math.cos(f),y:H/2-b+b*Math.sin(f),c:Math.cos(f),s:Math.sin(f)})}
  const v=[],idx=[];
  rings.forEach(r=>pts.forEach((p,i)=>{v.push(p[0]-nor[i][0]*r.inset,r.y,p[1]-nor[i][1]*r.inset,nor[i][0]*r.c,r.s,nor[i][1]*r.c)}));
  const n=pts.length;
  for(let r=0;r<rings.length-1;r++)for(let i=0;i<n;i++){const j=(i+1)%n,a=r*n+i,b2=r*n+j,c=(r+1)*n+i,d=(r+1)*n+j;idx.push(a,b2,c,b2,d,c)}
  // top and bottom caps
  const capV=(y,ny,ring)=>{const base=v.length/6;v.push(0,y,0,0,ny,0);pts.forEach((p,i)=>v.push(p[0]-nor[i][0]*ring.inset,y,p[1]-nor[i][1]*ring.inset,0,ny,0));for(let i=0;i<n;i++)idx.push(base,base+1+i,base+1+(i+1)%n)};
  capV(H/2,1,rings[rings.length-1]);capV(-H/2,-1,rings[0]);
  return{v:new Float32Array(v),i:new Uint32Array(idx)}
}
const g=slabGeo(PW,PD,PH,PR,BV);
const slabVao=gl.createVertexArray();gl.bindVertexArray(slabVao);
let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,g.v,gl.STATIC_DRAW);
gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
b=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,b);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,g.i,gl.STATIC_DRAW);const slabN=g.i.length;

const glassP=prog(`layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;
uniform mat4 uVP;uniform vec3 uOff;uniform vec3 uSc;out vec3 vW;out vec3 vN;
void main(){vec3 w=aP*uSc+uOff;vW=w;vN=aN;gl_Position=uVP*vec4(w,1.);}`,
`in vec3 vW;in vec3 vN;out vec4 o;
uniform vec3 uCam;uniform sampler2D uBack;uniform vec2 uRes;uniform mat4 uView;uniform float uT;uniform vec3 uLight;
float strip(vec3 r,vec3 d,vec3 a,float w){return exp(-pow(dot(r,a)/w,2.))*smoothstep(.1,.6,dot(r,d));}
vec3 env(vec3 r){
  float h=r.y*.5+.5;
  vec3 e=mix(vec3(.012,.013,.016),vec3(.06,.065,.075),h);
  e+=vec3(.95,.97,1.)*pow(max(dot(r,normalize(vec3(.1,1.,-.25))),0.),5.)*.9;
  e+=vec3(.9,.93,1.)*pow(max(dot(r,normalize(vec3(-.15,.42,-.9))),0.),3.)*.55;
  e+=vec3(1.)*strip(r,normalize(vec3(-1.,.25,.15)),normalize(vec3(0.,0.,1.)),.09)*1.5;
  e+=vec3(.9,.94,1.)*strip(r,normalize(vec3(.7,.2,-.8)),normalize(vec3(.7,0.,.7)),.08)*1.3;
  e+=vec3(1.)*strip(r,normalize(vec3(.2,.35,1.)),normalize(vec3(1.,0.,0.)),.07)*.9;
  e+=vec3(1.)*pow(max(dot(r,uLight),0.),30.)*1.6;
  return e;}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec3 N=normalize(vN);
  // slow, small ripples so the big flat faces reflect like a liquid
  float tt=uT*.35;
  N=normalize(N+vec3(sin(vW.x*1.7+tt)*.012+sin(vW.z*3.1-tt*1.3)*.008,0.,cos(vW.z*1.9+tt*.8)*.012+cos(vW.x*2.3+tt)*.008)*step(.9,N.y));
  vec3 V=normalize(uCam-vW);
  float cosv=max(dot(N,V),0.);
  float F=.04+.96*pow(1.-cosv,5.);
  vec2 uv=gl_FragCoord.xy/uRes;
  vec3 nv=(uView*vec4(N,0.)).xyz,nu=(uView*vec4(0.,1.,0.,0.)).xyz;
  vec2 off=(nv.xy-nu.xy)*38.+vec2(0.,-3.);
  float bevel=1.-abs(N.y);
  float rad=1.1+length(off)*.18;
  vec3 acc=vec3(0.),fro=vec3(0.);
  for(int i=0;i<9;i++){
    float a=float(i)*2.39996,r=sqrt((float(i)+.5)/9.)*rad;
    vec2 d=vec2(cos(a),sin(a))*r;
    vec2 u0=uv+(off+d)/uRes;
    acc.r+=textureLod(uBack,u0+off*.06/uRes,.4).r;
    acc.g+=textureLod(uBack,u0,.4).g;
    acc.b+=textureLod(uBack,u0-off*.06/uRes,.4).b;
  }
  acc/=9.;
  // frost: a wide scattering layer, bright spots bloom into a soft haze
  float flat_=smoothstep(.6,.95,N.y);
  vec3 f1=textureLod(uBack,uv+off/uRes,2.4).rgb,f2=textureLod(uBack,uv+off/uRes,3.6).rgb;
  fro=f1*.6+f2*.4;
  vec3 refr=mix(acc,acc*.62+fro*.55,flat_*.85);
  refr+=vec3(.022,.024,.028)*flat_;
  vec3 tint=vec3(.94,.96,.98);
  vec3 col=refr*tint*(1.-F*.5);
  vec3 R=reflect(-V,N);
  col+=env(R)*(F*1.5+.16);
  // edge light on the bevel
  col+=vec3(.8,.84,.92)*pow(bevel,1.3)*(.16+.26*step(0.,N.y))*(.5+.5*env(R).g);
  col+=(hash(gl_FragCoord.xy+uT)-.5)/255.;
  o=vec4(col,1.);}`);
const uG={vp:U(glassP,'uVP'),off:U(glassP,'uOff'),sc:U(glassP,'uSc'),cam:U(glassP,'uCam'),back:U(glassP,'uBack'),res:U(glassP,'uRes'),view:U(glassP,'uView'),t:U(glassP,'uT'),light:U(glassP,'uLight')};

/* background: a very faint graphite pool of light, something for the glass to refract */
const bgP=prog(`out vec2 vU;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vU=p;gl_Position=vec4(p*2.-1.,.9999,1.);}`,
`in vec2 vU;out vec4 o;uniform vec2 uC;uniform float uA;void main(){vec2 d=(vU-uC)*vec2(1.,.8);float k=exp(-dot(d,d)*22.);o=vec4(vec3(.045,.05,.06)*k*uA,1.);}`);
const bgVao=gl.createVertexArray();

/* glowing cells: unit cubes with small rounded corners (instanced) */
const cubeV=[],cubeI=[];
{const RU=.17,inn=.5-RU,G=[];const strip=[0,.3,.65,1];
 strip.forEach(t=>G.push(-.5+t*RU));[inn*-0+(-inn)].length;
 const lo=strip.map(t=>-.5+t*RU),hi=lo.map(v=>-v).reverse();const grid=[...lo,...hi];const N=grid.length;
 [[0,1,2,1],[0,1,2,-1],[1,2,0,1],[1,2,0,-1],[2,0,1,1],[2,0,1,-1]].forEach(([a,b2,c,sg])=>{
  const base=cubeV.length/6;
  for(let i=0;i<N;i++)for(let j=0;j<N;j++){const q=[0,0,0];q[a]=grid[i];q[b2]=grid[j];q[c]=.5*sg;
   const cc=q.map(v=>Math.max(-inn,Math.min(inn,v))),d=q.map((v,k)=>v-cc[k]),l=Math.hypot(...d)||1;
   const n=d.map(v=>v/l),p=cc.map((v,k)=>v+n[k]*RU);cubeV.push(...p,...n)}
  for(let i=0;i<N-1;i++)for(let j=0;j<N-1;j++){const v0=base+i*N+j,v1=v0+1,v2=v0+N,v3=v2+1;cubeI.push(v0,v1,v3,v0,v3,v2)}
 });}
const cellP=prog(`layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;layout(location=2) in vec3 iP;layout(location=3) in vec3 iS;layout(location=4) in vec4 iC;
uniform mat4 uVP;out vec3 vN;out vec4 vC;out vec3 vL;
void main(){vC=iC;vL=aN;gl_Position=uVP*vec4(aP*iS+iP,1.);vN=normalize(aN/iS);}`,
`in vec3 vN;in vec4 vC;in vec3 vL;out vec4 o;
void main(){vec3 n=normalize(vN);float l=max(dot(n,normalize(vec3(-.3,.9,.35))),0.);float side=1.-abs(n.y);
  vec3 c=vC.rgb*(.5+.5*l)*(1.-side*.25)+vec3(.5,.55,.6)*pow(l,8.)*.12;
  o=vec4(c,1.);}`);
const haloP=prog(`layout(location=0) in vec2 aP;layout(location=2) in vec3 iP;layout(location=3) in vec3 iS;layout(location=4) in vec4 iC;
uniform mat4 uVP;out vec2 vU;out vec4 vC;
void main(){vU=aP;vC=iC;vec3 s=iS+vec3(.3,0.,.3)*(.4+iC.a*.6);gl_Position=uVP*vec4(iP+vec3(aP.x*s.x,iS.y*.5+.03,aP.y*s.z),1.);}`,
`in vec2 vU;in vec4 vC;out vec4 o;
void main(){float d=length(vU);float k=exp(-d*d*2.6)*vC.a;o=vec4(vC.rgb*k*.07,1.);}`);
const stride=44;
function instVao(maxN){
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  let vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(cubeV),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,24,12);
  const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(cubeI),gl.STATIC_DRAW);
  const inb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,inb);gl.bufferData(gl.ARRAY_BUFFER,maxN*stride,gl.DYNAMIC_DRAW);
  [[2,3,0],[3,3,12],[4,4,24]].forEach(([l,n,o])=>{gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,n,gl.FLOAT,false,stride,o);gl.vertexAttribDivisor(l,1)});
  return{vao,buf:inb}
}
// the halo uses a unit quad and the same instance buffer
const quadVao=(buf)=>{const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const qb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,qb);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,-1,1,1,-1,1]),gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,8,0);
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  [[2,3,0],[3,3,12],[4,4,24]].forEach(([l,n,o])=>{gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,n,gl.FLOAT,false,stride,o);gl.vertexAttribDivisor(l,1)});
  return vao};
const uC={vp:U(cellP,'uVP')},uH={vp:U(haloP,'uVP')};

/* ---------- scene content ---------- */
const WH=[.8,.82,.86],SIL=[.68,.71,.76],MID=[.46,.49,.54],DIM=[.13,.145,.17],SAP=[.6,.65,.82];
const hsh=i=>(((i*2654435761)>>>0)%100);
const inst=[[],[],[],[]];
const add=(p,o)=>{inst[p].push(o)};
const PMX=.36,PMZ=.3; // plate inner margins
// bottom layer 12x5
{const cols=12,rows=5,aw=PW-PMX*2,ad=PD-PMZ*2,cw=aw/cols,cd=ad/rows;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const i=r*cols+c,h=hsh(i);
  add(1,{x:-aw/2+cw*(c+.5),z:-ad/2+cd*(r+.5),sx:cw*.76,sz:cd*.7,sy:.07,
   f:(c0)=>{const lit=[h<12,h<38,h<88];let k=0,col=[0,0,0];for(let s=0;s<3;s++){const w=c0.w[s];col=col.map((v,j)=>v+w*(lit[s]?SIL[j]:DIM[j]));k+=w*(lit[s]?(s===2?.7+.3*Math.sin(c0.t*1.2+c*.5+r):1):0)}
    return{col:col.map(v=>v*(lit[2]&&c0.w[2]>.5?(.8+.2*Math.sin(c0.t*1.2+c*.5+r)):1)),glow:k,vis:1}}})}}
// middle layer: s0 eighteen small blocks on the left and one whole block on the right; s1 KV cache; s2 three blocks closing up
{const aw=PW-PMX*2,ad=PD-PMZ*2;
 // s0
 for(let r=0;r<3;r++)for(let c=0;c<6;c++){const cw=(aw*.46)/6;
  add(2,{x:-aw/2+cw*(c+.5),z:-ad/2+ad*.08+(ad*.84/3)*(r+.5),sx:cw*.78,sz:(ad*.84/3)*.72,sy:.08,d:(r*6+c)*18,
   f:(c0)=>({col:WH.map(v=>v*.9),glow:.6,vis:c0.s(0,(r*6+c)*14)})})}
 add(2,{x:aw*.26,z:0,sx:aw*.46,sz:ad*.84,sy:.09,
   f:(c0)=>({col:[.54,.57,.62],glow:.6,vis:c0.s(0,260)})});
 // s1 KV 5x12
 const cols=12,rows=5,cw=aw/cols,cd=ad/rows;
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
  let k=-1;if(r<3){if(c<12-3-r)k=r}else if(r===3){if(c<9)k=1}else{if(c<6)k=0}
  const sh=k>=0&&c<3,col=k<0?DIM:sh?SAP:[WH,SIL,MID][k===0?0:k===1?1:2];
  const i=r*cols+c;
  add(2,{x:-aw/2+cw*(c+.5),z:-ad/2+cd*(r+.5),sx:cw*.78,sz:cd*.7,sy:.07,
   f:(c0)=>({col:col,glow:k<0?0:.55+(sh?.3:0),vis:c0.s(1,i*9)})})}
 // s2 three operators, closing up step by step
 [[-1,'projection'],[0,'attention'],[1,'activation']].forEach(([n,t])=>{
  add(2,{x:0,z:0,sx:aw*.3,sz:ad*.5,sy:.09,
   f:(c0)=>{const m=c0.m;return{x:n*(aw*.36*(1-m)+aw*.3*m),col:MID.map((v,j)=>v+(SIL[j]-v)*m*.3),glow:.4+.1*m,vis:c0.s(2,0)}}})});
 // the fused frame (thin edges)
 [[0,-.28,.92,.014],[0,.28,.92,.014]].forEach(([x,z,w,d])=>{add(2,{x:0,z:z*ad,sx:aw*.92,sz:ad*.024,sy:.05,f:(c0)=>({col:WH,glow:.9,vis:c0.m>.6?c0.s(2,0):0})})});
 [-.46,.46].forEach(x=>add(2,{x:x*aw,z:0,sx:aw*.012,sz:ad*.56,sy:.05,f:(c0)=>({col:WH,glow:.9,vis:c0.m>.6?c0.s(2,0):0})}));
}
// top layer: s0 three lines; s1 three streams; s2 eight scanning layers
{const aw=PW-PMX*2,ad=PD-PMZ*2;
 [[-.28,.92],[0,.64],[.28,.78]].forEach(([z,w],i)=>add(3,{x:-aw/2+aw*w/2,z:z*ad,sx:aw*w,sz:.045,sy:.05,
  f:(c0)=>({col:WH,glow:.9,vis:c0.s(0,i*90)})}));
 [[-.3,WH,.5],[0,SIL,.36],[.3,MID,.62]].forEach(([z,col,sp],li)=>{
  for(let k=0;k<6;k++)add(3,{x:0,z:z*ad,sx:.46,sz:.12,sy:.06,
   f:(c0)=>{const L=aw+.9,p=((c0.t*sp+k*(L/6))%L),x=-aw/2-.45+p,fade=Math.min(1,Math.min(p,L-p)/.5);return{x:x,col:col,glow:.8*fade,vis:c0.s(1,k*40)*fade}}})});
 for(let k=0;k<8;k++)add(3,{x:0,z:-ad*.42+k*(ad*.84/7),sx:aw*.9,sz:.05,sy:.05,
  f:(c0)=>{const q=.5+.5*Math.sin(c0.t*2.4-k*.7);return{col:SIL.map(v=>v*(.35+.65*q)),glow:q*.9,vis:c0.s(2,k*40)}}});
}
// SSD
{const aw=PW-.5,ad=1.02-.34,cols=12,cw=aw/cols;
 for(let c=0;c<cols;c++)add(0,{x:-aw/2+cw*(c+.5),z:0,sx:cw*.72,sz:ad*.7,sy:.06,f:(c0)=>({col:MID,glow:.3,vis:c0.s(1,c*25)})})}
const bufs=inst.map(a=>instVao(a.length+4));
const quadVaos=bufs.map(b=>quadVao(b.buf));
const cpu=inst.map(a=>new Float32Array(a.length*11));

/* ---------- state and drawing ---------- */
function size(){const dpr=Math.min(devicePixelRatio||1,2),w=Math.round(cv.clientWidth*dpr),h=Math.round(cv.clientHeight*dpr);
  if(w!==tw||h!==th){tw=cv.width=w;th=cv.height=h;
   if(backTex)gl.deleteTexture(backTex);backTex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,backTex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,w,h,0,gl.RGB,gl.UNSIGNED_BYTE,null);
   gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)}
  return dpr}
stage.addEventListener('pointermove',e=>{if(reduce)return;const r=stage.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;tAz=.62+px*.22;tEl=.47-py*.1});
stage.addEventListener('pointerleave',()=>{tAz=.62;tEl=.47;px=py=0});
function draw(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;const t=reduce?3:now/1000;const fl=reduce?0:Math.sin(t*.7);
  size();
  // scene weights and plate positions
  for(let s=0;s<3;s++){const tgt=s===scene?1:0;W3[s]+= (tgt-W3[s])*(reduce?1:1-Math.exp(-dt*(tgt?2.6:5)))}
  const sinceScene=reduce?1e9:(now-sceneT);
  for(let i=0;i<4;i++){const p=plates[i];let ty=0,ts=0;for(let s=0;s<3;s++){ty+=p.y[s]*(s===scene?1:0);ts+=p.sc[s]*(s===scene?1:0)}
    ps[i].y+=(ty-ps[i].y)*(reduce?1:1-Math.exp(-dt*3.2));ps[i].s+=(ts-ps[i].s)*(reduce?1:1-Math.exp(-dt*3.6))}
  spread+=(scrollP-spread)*(reduce?1:1-Math.exp(-dt*7));
  const lab=sm(.78,.98,spread).toFixed(3);
  if(lab!==written){written=lab;stage.style.setProperty('--lab',lab)}
  const cellK=sm(.12,.7,spread);
  az+=(tAz-az)*(1-Math.exp(-dt*5));el+=(tEl-el)*(1-Math.exp(-dt*5));
  const {cam,view,vp}=view3(tw/th);
  const ctx={w:W3,t,m:Math.max(0,Math.min(1,(W3[2]-.35)/.65)),
    s:(sc,delay)=>{const w=W3[sc];if(sc!==scene)return w>.01?w:0;const k=Math.max(0,Math.min(1,(sinceScene-delay)/450));const e=1-Math.pow(1-k,3);return Math.min(e,w*1.4)}};
  gl.viewport(0,0,tw,th);gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  // background
  gl.useProgram(bgP);gl.depthMask(false);gl.uniform2f(U(bgP,'uC'),.45,.46);gl.uniform1f(U(bgP,'uA'),1);gl.bindVertexArray(bgVao);gl.drawArrays(gl.TRIANGLES,0,3);gl.depthMask(true);
  light[0]=-.1+px*.9+(reduce?0:Math.sin(t*.25)*.35);light[1]=.55-py*.5;light[2]=.75;const ll=Math.hypot(...light);
  const order=[0,1,2,3];
  for(const pi of order){
    const P=plates[pi],y=effY(pi)+fl*.025*(pi-1.5)*(pi?sm(.3,1,spread):1),sc=ps[pi].s;
    if(sc<.02)continue;
    // content
    const arr=cpu[pi];let n=0;
    inst[pi].forEach(o=>{const r=o.f(ctx);const v=(r.vis===undefined?1:r.vis);
      const x=(r.x!==undefined?r.x:o.x)*sc,z=(r.z!==undefined?r.z:o.z)*sc;
      const k=v*sc*(pi===0?1:cellK);
      arr[n++]=x;arr[n++]=y-.045*sc;arr[n++]=z;arr[n++]=o.sx*k;arr[n++]=o.sy*Math.max(k,.0001);arr[n++]=o.sz*k;
      arr[n++]=r.col[0];arr[n++]=r.col[1];arr[n++]=r.col[2];arr[n++]=r.glow*v;arr[n++]=0});
    // packed at a 44-byte stride: x y z sx sy sz r g b glow pad, eleven floats
    gl.bindBuffer(gl.ARRAY_BUFFER,bufs[pi].buf);gl.bufferSubData(gl.ARRAY_BUFFER,0,arr);
    gl.useProgram(cellP);gl.uniformMatrix4fv(uC.vp,false,vp);gl.bindVertexArray(bufs[pi].vao);
    // attribute layout: iP(0) iS(12) iC(24); stride 44
    gl.drawElementsInstanced(gl.TRIANGLES,cubeI.length,gl.UNSIGNED_SHORT,0,inst[pi].length);
    gl.useProgram(haloP);gl.uniformMatrix4fv(uH.vp,false,vp);gl.bindVertexArray(quadVaos[pi]);
    gl.blendFunc(gl.ONE,gl.ONE);gl.enable(gl.BLEND);gl.depthMask(false);
    gl.drawArraysInstanced(gl.TRIANGLES,0,6,inst[pi].length);
    gl.depthMask(true);gl.disable(gl.BLEND);
    // copy what is drawn so far, for the glass to refract
    gl.bindTexture(gl.TEXTURE_2D,backTex);gl.copyTexSubImage2D(gl.TEXTURE_2D,0,0,0,0,0,tw,th);gl.generateMipmap(gl.TEXTURE_2D);
    gl.useProgram(glassP);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(uG.back,0);
    gl.uniformMatrix4fv(uG.vp,false,vp);gl.uniformMatrix4fv(uG.view,false,view);
    gl.uniform3f(uG.off,0,y,0);gl.uniform3f(uG.sc,sc*(P.w/PW),sc,sc*(P.d/PD));
    gl.uniform3f(uG.cam,cam[0],cam[1],cam[2]);gl.uniform2f(uG.res,tw,th);gl.uniform1f(uG.t,t);gl.uniform3f(uG.light,light[0]/ll,light[1]/ll,light[2]/ll);
    gl.bindVertexArray(slabVao);gl.drawElements(gl.TRIANGLES,slabN,gl.UNSIGNED_INT,0);
  }
  placeLabels(vp);
}
// Only while the figure is on screen. With motion it loops; with reduced motion it draws once per change.
function frame(now){
  raf=0;
  if(!vis) return;
  if(!reduce||dirty){draw(now);dirty=false}
  if(!reduce) raf=requestAnimationFrame(frame);
}
function kick(){if(vis&&!raf)raf=requestAnimationFrame(frame)}
new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis){last=performance.now();dirty=true;kick()}}).observe(stage);
new ResizeObserver(()=>{dirty=true;kick()}).observe(stage);
return{setScene};
})();
