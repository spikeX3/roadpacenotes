
/* ================= road-trip background scene ================= */
(function(){
const cv=document.getElementById("bg");if(!cv||!cv.getContext)return;
const ctx=cv.getContext("2d");
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
let W=0,H=0,DPR=1;
function size(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+"px";cv.style.height=H+"px";ctx.setTransform(DPR,0,0,DPR,0,0)}
size();addEventListener("resize",()=>{size();draw()});
const isDark=()=>{const t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme:dark)").matches};

/* color helpers */
const hex=h=>{h=h.replace("#","");return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
const rgb=(c,a=1)=>`rgba(${c[0]},${c[1]},${c[2]},${a})`;
/* sky keyframes over the journey: dawn → morning → afternoon → dusk → night */
const SKY=[
 {p:0,   top:"#3b4a7a",mid:"#e9a07a",bot:"#f6d3a1",sun:"#ffd28a"},
 {p:.22, top:"#5d9bd6",mid:"#a9d2ef",bot:"#e4f1f6",sun:"#fff3c4"},
 {p:.55, top:"#4a8fd3",mid:"#9ccbeb",bot:"#e8f2f1",sun:"#fff6d8"},
 {p:.8,  top:"#3d3f78",mid:"#e0795a",bot:"#f4b26b",sun:"#ffb36b"},
 {p:1,   top:"#0b1430",mid:"#1c2a52",bot:"#2f3b63",sun:"#f4f1e6"}
];
function skyAt(p){for(let i=1;i<SKY.length;i++){const a=SKY[i-1],b=SKY[i];if(p<=b.p){const t=(p-a.p)/(b.p-a.p);return{top:mix(hex(a.top),hex(b.top),t),mid:mix(hex(a.mid),hex(b.mid),t),bot:mix(hex(a.bot),hex(b.bot),t),sun:mix(hex(a.sun),hex(b.sun),t)}}}const z=SKY[SKY.length-1];return{top:hex(z.top),mid:hex(z.mid),bot:hex(z.bot),sun:hex(z.sun)}}

/* scenes by route mile (northbound miles from Ontario) */
const SCENES={
 desert:{name:"Mojave edge & the Grapevine",layers:[{c:"#b88a63",base:.62,amp:.10,f:1.3,k:"hills"},{c:"#9a6f4c",base:.70,amp:.07,f:2.2,k:"hills"},{c:"#7a5a3e",base:.78,amp:.04,f:3.5,k:"scrub"}]},
 valley:{name:"Central Valley",layers:[{c:"#a8b39a",base:.66,amp:.03,f:1.2,k:"hills"},{c:"#7f9a5e",base:.74,amp:.012,f:2,k:"orchard"},{c:"#6a8a4c",base:.80,amp:.008,f:3,k:"rows"}]},
 shasta:{name:"Mt. Shasta",layers:[{c:"#8d9bb3",base:.66,amp:.05,f:1.4,k:"volcano"},{c:"#4f6b5a",base:.73,amp:.06,f:2.6,k:"pines"},{c:"#35503f",base:.80,amp:.04,f:4,k:"pines"}]},
 forest:{name:"Oregon forest",layers:[{c:"#5d7a72",base:.62,amp:.08,f:1.6,k:"hills"},{c:"#3f5f4c",base:.70,amp:.06,f:2.8,k:"pines"},{c:"#2b4636",base:.79,amp:.05,f:4.2,k:"pines"}]},
 gorge:{name:"Columbia River Gorge",layers:[{c:"#7d8597",base:.58,amp:.10,f:1.1,k:"cliffs"},{c:"#5c6678",base:.68,amp:.07,f:1.8,k:"cliffs"},{c:"#5b86a8",base:.76,amp:0,f:1,k:"river"},{c:"#3e5a4a",base:.81,amp:.03,f:3.2,k:"pines"}]},
 palouse:{name:"Walla Walla wheat & vines",layers:[{c:"#c9b27a",base:.66,amp:.05,f:1.2,k:"hills"},{c:"#b39a5c",base:.73,amp:.04,f:1.9,k:"wheat"},{c:"#7e7a45",base:.80,amp:.02,f:3,k:"vines"}]}
};
const sceneFor=g=>g<200?"desert":g<470?"valley":g<700?"shasta":g<1000?"forest":g<1150?"gorge":"palouse";

/* deterministic noise */
function rnd(s){let x=Math.sin(s*12.9898)*43758.5453;return x-Math.floor(x)}
function noise(x,seed){const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return rnd(i+seed*101)*(1-u)+rnd(i+1+seed*101)*u}
function ridge(x,L,seed){return noise(x*L.f*.004,seed)*.6+noise(x*L.f*.011,seed+7)*.3+noise(x*L.f*.03,seed+3)*.1}

function drawLayer(L,li,off,tint,alpha,seed){
  const base=H*L.base,amp=H*L.amp;ctx.save();ctx.globalAlpha=alpha;
  const col=mix(hex(L.c),tint.c,tint.t);ctx.fillStyle=rgb(col);
  const step=6,sx=-off;
  if(L.k==="river"){ctx.fillStyle=rgb(mix(col,tint.sky,.35));ctx.fillRect(0,base-6,W,22);ctx.strokeStyle=rgb(mix(col,[255,255,255],.35),.5);ctx.lineWidth=1;for(let i=0;i<14;i++){const y=base+(i%3)*5,x=((i*137+off*1.3)%(W+80))-40;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+28,y);ctx.stroke()}ctx.restore();return}
  ctx.beginPath();ctx.moveTo(0,H);
  for(let x=0;x<=W+step;x+=step){let y=base-ridge(x+sx,L,seed+li)*amp;
    if(L.k==="cliffs"){const r=ridge(x+sx,L,seed+li);y=base-(r>.5?amp*1.0:amp*(r*1.6))}
    if(L.k==="volcano"){const cx=W*.68-off*.15,dx=Math.abs(x-cx),peak=H*.30;if(dx<W*.32){const v=base-peak*(1-dx/(W*.32))**1.25;y=Math.min(y,v)}}
    ctx.lineTo(x,y)}
  ctx.lineTo(W,H);ctx.closePath();ctx.fill();
  if(L.k==="volcano"){const cx=W*.68-off*.15,peak=H*.30,top=base-peak;ctx.fillStyle=rgb(mix([248,250,252],tint.sky,.25),.92);ctx.beginPath();ctx.moveTo(cx,top);const sw=W*.32*.28;ctx.lineTo(cx-sw,top+peak*.28);for(let i=0;i<=6;i++){ctx.lineTo(cx-sw+i*sw/3,top+peak*(.24+(i%2)*.07))}ctx.lineTo(cx+sw,top+peak*.28);ctx.closePath();ctx.fill()}
  // decorations along the ridge line
  const dec=(fn)=>{for(let x=0;x<W;x+=1){const xx=x+sx;if(rnd(Math.floor(xx/9)+seed*7+li*13)>fn.d||Math.floor(xx)%9!==0)continue;const y=base-ridge(x+sx,L,seed+li)*amp;fn.draw(x,y,rnd(Math.floor(xx/9)+li))}};
  if(L.k==="pines"){ctx.fillStyle=rgb(col);dec({d:.42,draw:(x,y,r)=>{const h=14+r*30*(1+li*.3),w=h*.38;ctx.beginPath();ctx.moveTo(x,y-h);ctx.lineTo(x-w,y+2);ctx.lineTo(x+w,y+2);ctx.closePath();ctx.fill()}})}
  if(L.k==="orchard"){ctx.fillStyle=rgb(mix(col,[30,60,30],.25));dec({d:.55,draw:(x,y,r)=>{ctx.beginPath();ctx.arc(x,y-4,4+r*3,0,7);ctx.fill()}})}
  if(L.k==="scrub"){ctx.fillStyle=rgb(mix(col,[60,70,40],.4));dec({d:.25,draw:(x,y,r)=>{ctx.beginPath();ctx.ellipse(x,y-2,4+r*5,2+r*3,0,0,7);ctx.fill()}})}
  if(L.k==="vines"||L.k==="rows"){ctx.strokeStyle=rgb(mix(col,[30,40,20],.3),.6);ctx.lineWidth=1.2;for(let i=1;i<5;i++){const y=base+i*7;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}}
  if(L.k==="wheat"){ctx.strokeStyle=rgb(mix(col,[255,240,200],.3),.35);ctx.lineWidth=1;for(let x=-((off*.6)%14);x<W;x+=14){const y=base-ridge(x+sx,L,seed+li)*amp;ctx.beginPath();ctx.moveTo(x,y+3);ctx.lineTo(x+40,H);ctx.stroke()}}
  ctx.restore();
}

function drawRoad(off,night){
  const top=H*.86;ctx.fillStyle=night?"#1b1f27":"#3a3f47";ctx.beginPath();ctx.moveTo(0,top);ctx.lineTo(W,top);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  ctx.fillStyle=night?"#2a2f38":"#545a63";ctx.fillRect(0,top,W,3);ctx.fillRect(0,H-6,W,6);
  // center dashes (yellow) moving with scroll and time
  const y=top+(H-top)/2-2,len=38,gap=30,shift=(off*2.2)%(len+gap);
  ctx.fillStyle=night?"rgba(240,200,90,.75)":"#f2c14e";for(let x=-shift;x<W;x+=len+gap)ctx.fillRect(x,y,len,4);
  // headlights glow at night
  if(night>0.05){const g=ctx.createRadialGradient(W*.18,y,2,W*.18,y,90);g.addColorStop(0,`rgba(255,240,200,${.5*night})`);g.addColorStop(1,"rgba(255,240,200,0)");ctx.fillStyle=g;ctx.fillRect(W*.18-90,top,180,H-top)}
  // a little truck
  const tx=W*.14,ty=top+6;ctx.fillStyle=night?"#556070":"#c8102e";ctx.fillRect(tx,ty,34,12);ctx.fillRect(tx+20,ty-8,12,9);ctx.fillStyle=night?"#9fb7d6":"#cfe6f7";ctx.fillRect(tx+22,ty-6,8,5);ctx.fillStyle="#111";ctx.beginPath();ctx.arc(tx+7,ty+13,4.5,0,7);ctx.arc(tx+27,ty+13,4.5,0,7);ctx.fill();
}

let curScene="desert",prevScene="desert",fade=1,lastT=0,anim=0;
function progress(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);return Math.min(1,Math.max(0,scrollY/max))}
function detectScene(){
  let g=null;const days=document.querySelectorAll(".day");let best=Infinity;
  days.forEach((d,i)=>{const r=d.getBoundingClientRect();const c=Math.abs((r.top+r.bottom)/2-innerHeight*.45);if(r.bottom>0&&r.top<innerHeight&&c<best&&typeof PLAN!=="undefined"&&PLAN[i]&&typeof R!=="undefined"){best=c;g=R.G((PLAN[i].a+PLAN[i].b)/2)}});
  if(g==null&&typeof R!=="undefined"){g=scrollY<innerHeight*1.2?R.mO:R.mD}
  return sceneFor(g??0)}
function draw(ts=0){
  const p=progress(),sk=skyAt(p),dark=isDark();
  const night=Math.max(0,(p-.82)/.18);
  // sky
  const gr=ctx.createLinearGradient(0,0,0,H*.86);const dim=dark?.45:0;
  gr.addColorStop(0,rgb(mix(sk.top,[8,12,24],dim)));gr.addColorStop(.55,rgb(mix(sk.mid,[20,24,40],dim)));gr.addColorStop(1,rgb(mix(sk.bot,[30,34,50],dim)));
  ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
  // stars
  const starA=Math.max(night,dark?.35:0);if(starA>0.02){for(let i=0;i<140;i++){const x=rnd(i)*W,y=rnd(i+500)*H*.55,tw=reduce?1:.6+.4*Math.sin(ts/700+i);ctx.fillStyle=`rgba(255,255,255,${starA*tw*(.4+rnd(i+900)*.6)})`;ctx.fillRect(x,y,1.4,1.4)}}
  // sun / full moon along an arc
  const ax=W*(.1+.8*p),ay=H*.62-Math.sin(Math.PI*Math.min(1,p/.9))*H*.45;
  const isMoon=p>.86;const body=isMoon?[244,241,230]:sk.sun;
  const halo=ctx.createRadialGradient(ax,ay,4,ax,ay,isMoon?70:120);halo.addColorStop(0,rgb(body,.55));halo.addColorStop(1,rgb(body,0));ctx.fillStyle=halo;ctx.fillRect(ax-130,ay-130,260,260);
  ctx.fillStyle=rgb(body);ctx.beginPath();ctx.arc(isMoon?W*.82:ax,isMoon?H*.16:ay,isMoon?20:26,0,7);ctx.fill();
  // terrain with parallax; crossfade between scenes
  const off=scrollY*.35+(reduce?0:anim);
  const tint={c:mix(sk.top,[10,14,28],dark?.6:.15),t:Math.min(.75,night*.7+(dark?.35:.08)),sky:sk.mid};
  const drawScene=(name,a)=>{const S=SCENES[name];S.layers.forEach((L,li)=>drawLayer(L,li,off*(.25+li*.35),tint,a,name.length*17))};
  if(fade<1&&prevScene!==curScene)drawScene(prevScene,1-fade);
  drawScene(curScene,fade<1?fade:1);
  drawRoad(off,Math.max(night,dark?.6:0));
  // scene caption
  const cap=document.getElementById("bgcap");if(cap)cap.textContent=SCENES[curScene].name;
}
function tick(ts){
  const s=detectScene();if(s!==curScene){prevScene=curScene;curScene=s;fade=0}
  const dt=Math.min(64,ts-lastT||16);lastT=ts;
  if(fade<1)fade=Math.min(1,fade+dt/600);
  if(!reduce)anim+=dt*.02;
  draw(ts);
  if(!document.hidden)requestAnimationFrame(tick);
}
document.addEventListener("visibilitychange",()=>{if(!document.hidden){lastT=0;requestAnimationFrame(tick)}});
if(reduce){const once=()=>{const s=detectScene();if(s!==curScene){prevScene=curScene;curScene=s}fade=1;draw()};addEventListener("scroll",once,{passive:true});once()}
else requestAnimationFrame(tick);
})();

