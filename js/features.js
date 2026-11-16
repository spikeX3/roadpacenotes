
/* ================= v4 features: drive mode, tour, passes, nights, kitchen, music, games, recap, traffic ================= */
const TOUR=[
 [0,"Ontario","Ontario was founded in 1882 by the Chaffey brothers, Canadian engineers who named it after their home province."],
 [55,"The Ridge Route","Before I-5, drivers crossed these mountains on the Ridge Route, a twisting two-lane road that opened in 1915. Parts of it still exist in the hills to the east."],
 [80,"Tejon Pass","You're near Tejon Pass, about 4,144 feet up. Just below it is Fort Tejon, where the U.S. Army tested camels as pack animals in the 1850s."],
 [125,"The big lift","A few miles east, the Edmonston Pumping Plant lifts California Aqueduct water nearly 2,000 feet over the Tehachapi Mountains, the biggest lift in the State Water Project."],
 [200,"The aqueduct","That concrete canal beside the freeway is the California Aqueduct. It carries Northern California water hundreds of miles south to farms and cities."],
 [225,"Harris Ranch","Smell that? The Harris Ranch feedyard near Coalinga holds tens of thousands of cattle. The ranch's restaurant at the Highway 198 exit is a classic I-5 stop."],
 [290,"Santa Nella","Santa Nella is home to Pea Soup Andersen's. To the west, San Luis Reservoir stores water pumped up from the Delta for the dry months."],
 [360,"Stockton","Stockton has an inland deep-water port. Ocean ships reach it through the Delta, roughly 75 miles from the Golden Gate."],
 [405,"Sacramento","Sacramento boomed after gold was found at Sutter's Mill in 1848. It became the state capital in 1854, and the Central Pacific started building the transcontinental railroad east from here in 1863."],
 [470,"Rice and ducks","The Sacramento Valley grows most of California's rice. In winter, flooded fields host millions of ducks and geese on the Pacific Flyway. Watch the sky near Willows."],
 [535,"Red Bluff","Red Bluff is home to the adobe of William B. Ide, who led the short-lived Bear Flag Republic in 1846."],
 [565,"Redding","Redding's Sundial Bridge, designed by Santiago Calatrava, is a working sundial. Its 217-foot tower casts the shadow."],
 [580,"Shasta Lake","You're crossing Shasta Lake on the Pit River Bridge, one of the tallest double-deck bridges in the country. Shasta Dam, a few miles west, is one of the largest concrete dams in the U.S."],
 [630,"Mount Shasta","Mount Shasta is a 14,179-foot volcano that rises about 10,000 feet above the land around it. The bump on its west side, Shastina, would be a big volcano on its own."],
 [645,"Weed","Weed is named for lumberman Abner Weed, who founded it in 1897. The mill town sits right under the mountain."],
 [680,"Yreka","Yreka began as an 1851 gold-rush camp. In 1941, it was named the capital of the State of Jefferson, a tongue-in-cheek push to split off from California and Oregon."],
 [707,"Welcome to Oregon","You've crossed into Oregon. Since 2023, drivers here can pump their own gas, though many stations still have attendants."],
 [712,"Siskiyou Summit","This is Siskiyou Summit, about 4,310 feet up and the highest point on all of I-5, from Mexico to Canada."],
 [727,"Ashland","Ashland hosts the Oregon Shakespeare Festival, running since 1935."],
 [762,"Grants Pass","Grants Pass sits on the Rogue River. Its downtown arch has said 'It's the climate' since the 1920s."],
 [828,"Roseburg","Roseburg is the hub of the Umpqua Valley wine region. Just south in Winston, Wildlife Safari has run a drive-through animal park since 1972."],
 [907,"Eugene","In Eugene, University of Oregon coach Bill Bowerman poured rubber into his waffle iron to make better track shoes. That experiment helped launch Nike."],
 [964,"Salem","Oregon's Capitol in Salem is topped by a gilded statue known as the Oregon Pioneer, added in 1938."],
 [995,"Champoeg","At Champoeg in 1843, settlers voted to form a provisional government, the first American-style government on the Pacific coast."],
 [1040,"The Columbia","You've met the Columbia River. Lewis and Clark followed it to the Pacific in 1805."],
 [1063,"Bonneville Dam","Bonneville Dam opened in 1938. Woody Guthrie later wrote 'Roll On, Columbia' while working for the federal power agency here."],
 [1095,"Hood River","Hood River's steady gorge winds made it one of the world's top spots for windsurfing and kiteboarding."],
 [1115,"The Dalles","For Oregon Trail emigrants, The Dalles was the end of the overland road. From here they rafted the river or took the Barlow Road around Mount Hood."],
 [1135,"Maryhill","Across the river, Maryhill has a full-size concrete Stonehenge, built by Sam Hill as a World War I memorial."],
 [1193,"Ice-age floods","Huge ice-age floods from Glacial Lake Missoula tore through here many times, roughly 15,000 years ago, scouring the gorge you just drove."],
 [1225,"Hat Rock","Near Umatilla, Lewis and Clark noted a flat-topped basalt butte in 1805. It's now Hat Rock State Park."],
 [1265,"Walla Walla","Walla Walla is famous for its sweet onions and has well over a hundred wineries. Welcome in."]
];
const PASSES=[
 {g:80,n:"Tejon Pass (the Grapevine)",el:4144,st:"CA",note:"Closes for snow or ice a few times most winters. The detour (CA-58 / US-101) adds hours."},
 {g:650,n:"Black Butte Summit (north of Mt. Shasta)",el:3912,st:"CA",note:"Snow is common here even when Redding is dry."},
 {g:712,n:"Siskiyou Summit",el:4310,st:"OR",note:"Highest point on I-5. Frequent chain controls and ice on clear mornings."},
 {g:770,n:"Sexton Mountain Pass",el:1956,st:"OR",note:"Low, but freezing fog and black ice show up on cold mornings."},
 {g:1095,n:"Columbia Gorge (wind & ice)",el:null,st:"OR",note:"Not a pass, but east winds and freezing rain can close I-84."}
];
const CA_LV=[["clear","Clear"],["carry","Chains must be carried"],["r1","R1"],["r2","R2"],["r3","R3"],["closed","Closed"]];
const OR_LV=[["clear","Clear"],["carry","Carry chains or traction tires"],["req","Chains or traction tires required"],["all","Chains on all vehicles"],["closed","Closed"]];
const REGIONS=[
 [0,130,"Desert & the Grapevine",[["California Dreamin'","The Mamas & the Papas"],["Hotel California","Eagles"],["Truckin'","Grateful Dead"],["Going to California","Led Zeppelin"]],null],
 [130,520,"Central Valley: the Bakersfield sound",[["Mama Tried","Merle Haggard"],["Act Naturally","Buck Owens"],["Lodi","Creedence Clearwater Revival"],["Green River","Creedence Clearwater Revival"]],["The Grapes of Wrath","John Steinbeck","the Joad family's road to the San Joaquin Valley"]],
 [520,707,"Shasta country",[["Take Me Home, Country Roads","John Denver"],["Free Fallin'","Tom Petty"],["Into the Mystic","Van Morrison"],["Ramblin' Man","The Allman Brothers Band"]],["Wild","Cheryl Strayed","a solo hike on the Pacific Crest Trail through these mountains"]],
 [707,1025,"Oregon's valleys",[["Portland, Oregon","Loretta Lynn & Jack White"],["Louie Louie","The Kingsmen"],["Say Yes","Elliott Smith"],["July, July!","The Decemberists"]],["Sometimes a Great Notion","Ken Kesey","an Oregon logging family"]],
 [1025,1150,"Columbia Gorge",[["Roll On, Columbia","Woody Guthrie"],["Pastures of Plenty","Woody Guthrie"],["Grand Coulee Dam","Woody Guthrie"],["Riders on the Storm","The Doors"]],["Undaunted Courage","Stephen Ambrose","Lewis and Clark's trip down this river"]],
 [1150,1266,"Wheat & wine country",[["Walla Walla","The Offspring"],["Wagon Wheel","Old Crow Medicine Show"],["Home","Edward Sharpe & the Magnetic Zeros"],["On the Road Again","Willie Nelson"]],null]
];
const CITIES=[[25,"Pasadena / I-210",1],[405,"Sacramento",0],[1030,"Portland",0]];
const DEER=[[600,740,"Mt. Shasta to Siskiyou Summit","deer and elk"],[750,830,"Grants Pass to Canyonville","deer"],[1200,1265,"Umatilla to Walla Walla","deer"]];
const MEALS={
 warm:[["Carne asada tacos",["Carne asada (pre-marinated)","Street tortillas","Salsa + limes","Avocados"],"Sear in the pan, 15 minutes."],
       ["Rotisserie chicken quesadillas",["Rotisserie chicken","Flour tortillas","Shredded cheese"],"Shred the chicken the first night, crisp the quesadillas in the pan."],
       ["Pasta with sausage sauce",["Pasta","Jar of marinara","Italian sausage"],"One pot for pasta, one pan for sauce. 20 minutes."]],
 cold:[["Chili with cornbread muffins",["Canned chili (multi-pack)","Cornbread muffins","Shredded cheese"],"One pot, 10 minutes. Hot food before bed keeps you warmer."],
       ["Loaded ramen",["Instant ramen (multi-pack)","Eggs","Frozen potstickers"],"Boil, drop in potstickers and an egg. Fast and hot."],
       ["Chicken & rice soup",["Rotisserie chicken","Microwave rice cups (heat in the pot)","Chicken broth cartons"],"Simmer 10 minutes. Great on the coldest night."]]
};
const STAPLES=[["Breakfast",["Oatmeal packets","Coffee (instant or pour-over)","Bananas or clementines","Precooked bacon"]],["Lunch on the road",["Bread or wraps","Deli meat","Cheese","Chips"]],["Snacks",["Trail mix","Jerky","Granola bars"]],["Drinks & ice",["Water (bottled case)","Block ice + cubed ice"]]];

Object.assign(S,{psi:store.get("psi",35),tires:store.get("tires",true),chains:store.get("chains",true),passLv:store.get("passLv",{}),kit:store.get("kit",[]),voice:store.get("voice",true)});

/* ---------- helpers ---------- */
function thanksgiving(y){const d=new Date(y,10,1);const off=(4-d.getDay()+7)%7;return new Date(y,10,1+off+21)}
function dayDiff(a,b){return Math.round((Date.UTC(a.getFullYear(),a.getMonth(),a.getDate())-Date.UTC(b.getFullYear(),b.getMonth(),b.getDate()))/864e5)}
function holidayNote(dt){const t=thanksgiving(dt.getFullYear()),k=dayDiff(dt,t);
  return {"-2":["warn","Tuesday before Thanksgiving: traffic builds in the afternoon, especially around cities."],"-1":["bad","Wednesday before Thanksgiving: one of the busiest travel days of the year. Start early and get through cities before noon."],"0":["warn","Thanksgiving Day: roads are usually quiet in the morning and busy late in the afternoon."],"3":["bad","Sunday after Thanksgiving: the busiest return day of the year. Expect heavy traffic everywhere, especially on I-5 through Portland and Sacramento."],"2":["warn","Saturday after Thanksgiving: return traffic starts building."]}[k]||null}
function etaAt(i,x){const d=PLAN[i];const t=toMin(S.starts[i]||"07:30");const frac=(d.b-d.a)>0?(x-d.a)/(d.b-d.a):0;return t+Math.max(0,x-d.a)/MPH*60+(d.dwell||0)*frac}
function nightLow(d){return d.area?AREAS[d.area].low:null}
function nightRain(d){if(!d.spot)return false;const g=SPOTS[d.spot][1];return WX.some(w=>Math.abs(w[0]-g)<=45&&w[2]==="rain")}
function sleepCall(i){const d=PLAN[i],tr=TRACK[i];if(!d.spot||!tr||tr.end)return null;const sp=SPOTS[d.spot],cat=sp[2],low=nightLow(d),rain=nightRain(d),wind=d.area==="A8";
  const hrsBat=tr.power?99:tr.bed/100*ANKER_WH*0.85/S.blanket;
  if(cat==="truck")return{cab:1,why:`Rest-area rules allow sleeping in the vehicle only, no tents. Low ≈${low}°F; the blanket has ≈${Math.min(24,hrsBat).toFixed(0)} h of battery on ${BLANKET.find(b=>b.k===S.blanket).t.toLowerCase()}.`};
  if(tr.power)return{cab:0,why:`Powered site: plug the blanket into the pedestal and run it all night. Low ≈${low}°F.${rain?" Rain is likely, so pitch the tarp first.":""}`};
  const r=[];if(rain)r.push("rain is likely");if(wind)r.push("gorge wind");if(low<=25)r.push(`a low near ${low}°F`);if(low<=32&&hrsBat<9)r.push(`only ≈${hrsBat.toFixed(0)} h of blanket battery`);
  return r.length?{cab:1,why:`Sleep in the cab: ${r.join(", ")}. Crack a window about an inch so condensation doesn't soak everything.`}:{cab:0,why:`Low ≈${low}°F, dry, and ≈${Math.min(24,hrsBat).toFixed(0)} h of blanket battery. ${low<=30?"It's a cold one: an insulated pad under you matters as much as the blanket on top.":"A good tent night."}`}}
function morningCheck(i){if(i===0)return null;const p=PLAN[i-1];const low=nightLow(p);if(low==null||low>42)return null;const drop=(70-low)/10,read=S.psi-drop;
  const out=[`Tires will read about ${read.toFixed(0)} psi before driving (set ${S.psi} at 70°F).`];
  if(drop>=3)out.push("The tire-pressure light may come on. If it does, add air to the door-sticker pressure while the tires are still cold.");
  if(low<=32)out.push("Frost likely: run the defroster 5 minutes and scrape. Don't pour hot water on the windshield.");
  out.push("Let the engine idle about 30 seconds, then drive gently for the first few miles.");
  if(low<=34)out.push("Bridges and shaded curves ice first. Leave extra room before the passes.");return{low,lines:out}}
function nextThing(x,list){return list.filter(o=>o.x>x+0.2).sort((a,b)=>a.x-b.x)[0]}
function mmss(min){min=Math.max(0,Math.round(min));return `${Math.floor(min/60)}h ${String(min%60).padStart(2,"0")}m`}
function spotify(t,a){return "https://open.spotify.com/search/"+encodeURIComponent(t+" "+a)}
function speak(text){if(!("speechSynthesis" in window))return false;try{const u=new SpeechSynthesisUtterance(text);u.rate=1;speechSynthesis.speak(u);return true}catch(e){return false}}

/* ---------- day-card additions ---------- */
function addDayExtras(){
  PLAN.forEach((d,i)=>{const sec=document.getElementById("day-"+(i+1));if(!sec)return;const ib=sec.querySelector(".infobar");
    const sc=sleepCall(i);if(sc)ib.insertAdjacentHTML("beforeend",`<div class="ib ${sc.cab?"cab":"tent"}"><span class="k">Tonight: tent or cab?</span><b>${sc.cab?"Sleep in the cab":"Pitch the tent"}</b><span>${esc(sc.why)}</span></div>`);
    const mc=morningCheck(i);if(mc)ib.insertAdjacentHTML("beforeend",`<div class="ib frost"><span class="k">Cold-morning truck check</span><b>Last night ≈${mc.low}°F</b><span>${mc.lines.map(esc).join(" ")}</span></div>`);
    const when=sec.querySelector(".when");when.insertAdjacentHTML("beforeend",`<span class="dark" id="dark${i}"></span>`);
    const after=sec.querySelector(".sect.sos")||sec.querySelector(".sect.journal");
    // tour
    const facts=TOUR.filter(f=>R.inR(f[0])).map(f=>({x:R.L(f[0]),t:f[1],s:f[2]})).filter(f=>f.x>=d.a-0.5&&f.x<=d.b+0.5).sort((a,b)=>a.x-b.x);
    let html="";
    if(facts.length)html+=`<details class="sect tour"><summary><span>Mile-marker tour</span><small>${facts.length} stories · read aloud</small></summary><p class="gi">Tap ▶ to hear one, or open Drive mode and they'll play as you pass each spot.</p><ul>${facts.map((f,k)=>`<li><span class="rn">${esc(f.t)}</span><span class="ro">mi ${Math.max(0,Math.round(f.x-d.a))}</span><span class="rr">${esc(f.s)}</span><span class="rb"><button type="button" class="linkb" data-say="${i}:${k}">▶ Listen</button></span></li>`).join("")}</ul></details>`;
    // soundtrack
    const gA=Math.min(R.G(d.a),R.G(d.b)),gB=Math.max(R.G(d.a),R.G(d.b));let regs=REGIONS.filter(r=>r[1]>gA+1&&r[0]<gB-1);if(R.dir<0)regs=regs.slice().reverse();
    const h=(d.b-d.a)/MPH;
    if(regs.length)html+=`<details class="sect music"><summary><span>Today's soundtrack</span><small>≈${h.toFixed(1)} h · about ${Math.round(h*60/3.8)} songs</small></summary>${regs.map(r=>{const mi=Math.min(gB,r[1])-Math.max(gA,r[0]);return `<div class="gg"><div class="gk">${esc(r[2])} · ≈${hrs(mi)}</div><ul>${r[3].map(([t,a])=>`<li><b>${esc(t)}</b><span>${esc(a)} · <a href="${spotify(t,a)}" target="_blank" rel="noopener">Spotify ↗</a></span></li>`).join("")}${r[4]?`<li><b>Audiobook: ${esc(r[4][0])}</b><span>${esc(r[4][1])}, ${esc(r[4][2])}.</span></li>`:""}</ul></div>`}).join("")}<p class="gn">Download playlists before the dead zones (Tumey Hills, Siskiyous, the Gorge).</p></details>`;
    // traffic & wildlife
    const tl=[];const dt=dateFor(i),dow=dt.getDay(),wk=dow>0&&dow<6;const hn=holidayNote(dt);if(hn)tl.push([hn[0],"Holiday traffic",hn[1]]);
    CITIES.forEach(([g,n])=>{if(!R.inR(g))return;const x=R.L(g);if(x<d.a-0.5||x>d.b+0.5)return;const t=etaAt(i,x)%1440;const am=t>=390&&t<=570,pm=t>=900&&t<=1110;
      const bad=(wk&&(am||pm))||(hn&&pm);tl.push([bad?"bad":"ok",`${n} at ≈${fmtTime(t)}`,bad?`That's ${am?"morning":"evening"} rush hour${wk?"":" on a holiday week"}. Leave about ${am?"an hour later":"an hour earlier"} to slip through, or plan a meal stop before the city.`:wk?"Outside the weekday rush (6:30–9:30 AM, 3–6:30 PM).":"Weekend: usually lighter, but expect slowdowns midday."])});
    DEER.forEach(([g1,g2,n,an])=>{const x1=R.L(R.dir>0?g1:g2),x2=R.L(R.dir>0?g2:g1);if(!(R.inR(g1)||R.inR(g2)))return;const a=Math.max(d.a,Math.min(x1,x2)),b=Math.min(d.b,Math.max(x1,x2));if(b-a<3)return;
      const t1=etaAt(i,a)%1440,t2=etaAt(i,b)%1440,pt=ptOf(i,true),sun=sunTimes(dateFor(i),pt.lat,pt.lon);const dusk=t2>=sun.set-30||t1<=sun.rise+30;
      tl.push([dusk?"warn":"ok",`Wildlife: ${n}`,dusk?`You'll be here around ${fmtTime(t1)}–${fmtTime(t2)}, near dusk or dawn, when ${an} move. Slow down and watch the shoulders; brake straight, don't swerve.`:`${an[0].toUpperCase()+an.slice(1)} cross here at dawn and dusk. You're scheduled for daylight (${fmtTime(t1)}–${fmtTime(t2)}).`])});
    if(tl.length)html+=`<details class="sect traffic"${tl.some(t=>t[0]!=="ok")?" open":""}><summary><span>Traffic, holiday & wildlife</span><small>${tl.filter(t=>t[0]!=="ok").length?tl.filter(t=>t[0]!=="ok").length+" heads-up":"all clear"}</small></summary><ul>${tl.map(([k,a,b])=>`<li class="${k}"><span class="rn">${esc(a)}</span><span class="rr">${esc(b)}</span></li>`).join("")}</ul></details>`;
    if(after)after.insertAdjacentHTML("beforebegin",html);else sec.insertAdjacentHTML("beforeend",html);
    sec.querySelectorAll("[data-say]").forEach(b=>b.addEventListener("click",()=>{const k=+b.dataset.say.split(":")[1];if(speechSynthesis?.speaking){speechSynthesis.cancel()}const f=facts[k];if(!speak(`${f.t}. ${f.s}`))b.textContent="Audio not supported here"}));
  });
  updateDark();
}
function updateDark(){PLAN.forEach((d,i)=>{const e=document.getElementById("dark"+i);if(!e||d.sunset==null)return;if(!d.spot){e.textContent="";return}
  const sc=sleepCall(i),setup=sc&&sc.hotel?10:sc&&sc.cab?15:45;const need=(d.b-d.a)/MPH*60+(d.dwell||0);const latest=d.sunset-setup-need,start=toMin(S.starts[i]||"07:30");const slack=latest-start;
  e.className="dark "+(slack>=30?"ok":slack>=0?"tight":"late");
  e.textContent=slack>=0?`Camp set up by dark: leave by ${fmtTime(latest)} (${setup} min ${sc&&sc.cab?"to settle in the cab":"to pitch the tent"}) · ${mmss(slack)} to spare`:`You'll be setting up in the dark. Leave by ${fmtTime(Math.max(0,latest))} or end the day earlier.`})}
const _renderDays=renderDays;renderDays=function(){_renderDays();addDayExtras()};
const _etas=etas;etas=function(){_etas();updateDark()};

/* ---------- panels ---------- */
function mkPanel(id,title,note,inner){const s=document.createElement("section");s.className="panel xp";s.id=id;s.setAttribute("aria-labelledby",id+"-h");s.innerHTML=`<div class="panelhead"><h2 id="${id}-h">${title}</h2><span class="n">${note}</span></div>${inner}`;return s}
function buildPanels(){
  const anchor=document.querySelector('section[aria-labelledby="sheet-h"]');
  const wrap=document.createElement("div");wrap.className="xpanels";anchor.before(wrap);
  wrap.append(mkPanel("pass","Mountain passes","Check the sign, get a go / wait call",`<div class="passopts"><label><input type="checkbox" id="p-tires" ${S.tires?"checked":""}> M+S or snowflake tires on all four</label><label><input type="checkbox" id="p-chains" ${S.chains?"checked":""}> Chains in the truck</label><span class="n">The ZR2 is 4WD and well under 6,500 lb, so it qualifies for the 4WD rules below.</span></div><div id="passlist"></div><p class="gn">California: R1 = chains or snow tires; R2 = chains unless 4WD/AWD with snow tires on all four (chains still carried); R3 = chains on everyone. Oregon: traction tires count as chains for vehicles under 10,000 lb, and 4WD with M+S tires on all wheels is exempt if you carry chains. During closures, crews can require chains on all vehicles. Source: Caltrans and ODOT TripCheck.</p>`));
  wrap.append(mkPanel("kitchen","Camp kitchen","Menu, pantry and a kitchen log",`<div id="kitbody"></div>`));
  wrap.append(mkPanel("recap","Trip recap card","Make a shareable picture when you get home",`<div class="sheetrow"><button type="button" class="btn" id="rc-go">Make recap card</button> <button type="button" class="btn" id="rc-dl" hidden>Save PNG</button> <span class="n" id="rc-msg" aria-live="polite"></span></div><p class="n">Built from your route, journal, expenses and kitchen log. Everything stays in this browser.</p><canvas id="rc" width="1080" height="1350" hidden></canvas><img id="rc-img" alt="Trip recap card" hidden>`));
  $("#p-tires").addEventListener("change",e=>{S.tires=e.target.checked;store.set("tires",S.tires);renderPasses()});
  $("#p-chains").addEventListener("change",e=>{S.chains=e.target.checked;store.set("chains",S.chains);renderPasses()});
  $("#rc-go").addEventListener("click",makeRecap);
  $("#rc-dl").addEventListener("click",saveRecap);
  // holiday banner
  const roads=document.querySelector(".roads");const ban=document.createElement("div");ban.id="holiday";roads.after(ban);
  // drive button
  const fab=document.createElement("button");fab.type="button";fab.id="drivefab";fab.textContent="Drive mode";fab.addEventListener("click",openDrive);document.body.appendChild(fab);
  const rb=document.querySelector(".routebar");const b2=document.createElement("button");b2.type="button";b2.className="btn";b2.textContent="▶ Drive mode";b2.addEventListener("click",openDrive);rb.appendChild(b2);
}
function passVerdict(p,lv){const ca=p.st==="CA",ok4=S.tires,ch=S.chains;
  if(lv==="clear")return["go","Go","Normal driving. Still watch for ice on bridges early in the day."];
  if(lv==="closed")return["stop","Wait / Plan B","The road is closed. Stop at the Plan B spot before the pass and check again in the morning."];
  if(ca){if(lv==="carry")return ch?["go","Go","You have chains aboard."]:["stop","Don't go yet","You must carry chains here. Buy them at the last town before the pass (they sell them at the chain-up area too, at a markup)."];
    if(lv==="r1")return ok4?["go","Go","Snow tires on the drive axle count. Shift into 4WD."]:["warn","Chain up","Without M+S tires, chains go on the drive wheels."];
    if(lv==="r2")return ok4&&ch?["go","Go in 4WD","4WD with snow-rated tires on all four is exempt, as long as you carry chains. Engage 4WD before the checkpoint."]:["warn","Chain up",ch?"Without snow-rated tires on all four, you need chains on.":"You need chains on and you don't have any. Turn back or buy them before the pass."];
    if(lv==="r3")return["stop","Wait / Plan B","Chains on every vehicle, no exceptions. R3 is rare and usually means a closure is close. Wait it out."]}
  else{if(lv==="carry")return ch||ok4?["go","Go","You're carrying chains or running traction tires."]:["stop","Don't go yet","Oregon requires chains or traction tires in the vehicle here."];
    if(lv==="req")return ok4&&ch?["go","Go in 4WD","4WD with M+S tires on all wheels is exempt when you carry chains. Engage 4WD."]:["warn","Chain up","Put chains on, or use traction tires (3-peak snowflake or studded)."];
    if(lv==="all")return["stop","Wait / Plan B","Chains on all vehicles. Even if 4WD is exempted, this means bad conditions. Wait for it to ease."]}
  return["go","Go",""]}
function renderPasses(){const host=$("#passlist");if(!host)return;host.innerHTML="";
  PASSES.filter(p=>R.inR(p.g)).sort((a,b)=>R.L(a.g)-R.L(b.g)).forEach(p=>{const x=R.L(p.g),i=dayOf(x),lv=S.passLv[p.n]||"clear",[k,v,why]=passVerdict(p,lv),pb=planB(i);const L=dlabel(i);
    const card=document.createElement("div");card.className="passc "+k;
    card.innerHTML=`<div class="ph"><b>${esc(p.n)}</b><span class="n">${p.el?p.el.toLocaleString()+" ft · ":""}Day ${i+1} (${L.dow}) at ≈${fmtTime(etaAt(i,x)%1440)}</span></div><p class="n">${esc(p.note)}</p>
    <label class="psel">What does the sign or ${p.st==="CA"?"QuickMap":"TripCheck"} say?<select>${(p.st==="CA"?CA_LV:OR_LV).map(([a,b])=>`<option value="${a}" ${a===lv?"selected":""}>${b}</option>`).join("")}</select></label>
    <div class="verdict"><span class="vb">${v}</span><span>${esc(why)}${k==="stop"&&pb&&Math.abs(pb.pass.g-p.g)<20?` Plan B: ${esc(shortName(pb.spot))}.`:""}</span></div>
    <a href="${p.st==="CA"?QUICKMAP:TRIPCHECK}" target="_blank" rel="noopener">${p.st==="CA"?"Caltrans QuickMap cameras":"TripCheck cameras"} ↗</a>`;
    card.querySelector("select").addEventListener("change",e=>{S.passLv[p.n]=e.target.value;store.set("passLv",S.passLv);renderPasses()});host.appendChild(card)})}
function renderHoliday(){const b=$("#holiday");if(!b)return;const notes=PLAN.map((d,i)=>({i,n:holidayNote(dateFor(i))})).filter(o=>o.n);const t=thanksgiving(dateFor(0).getFullYear());const L=dlabel(PLAN.length-1);
  if(!notes.length){const k=dayDiff(dateFor(PLAN.length-1),t);b.className="holiday ok";b.innerHTML=k<-2&&k>-10?`<b>Thanksgiving is ${t.toLocaleString("en-US",{weekday:"short",month:"short",day:"numeric"})}.</b> You arrive ${L.dow} ${L.date}, ahead of the holiday rush. Coming home? Avoid driving the Sunday after; Monday or Tuesday is much calmer.`:"";return}
  const worst=notes.find(o=>o.n[0]==="bad")||notes[0];b.className="holiday "+worst.n[0];b.innerHTML=`<b>Thanksgiving week:</b> Day ${worst.i+1} (${dlabel(worst.i).dow} ${dlabel(worst.i).date}). ${esc(worst.n[1])}`}

/* ---------- recap ---------- */
function makeRecap(){const c=$("#rc"),x=c.getContext("2d"),W=1080,H=1350;const dark=getComputedStyle(document.documentElement);
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,"#0b2238");g.addColorStop(.6,"#123a4f");g.addColorStop(1,"#1d4a3a");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle="#f0a81c";x.font="800 30px Overpass, Arial";x.fillText(`I-5 ${R.dir>0?"NORTH":"SOUTH"} · ${dlabel(0).date.toUpperCase()} – ${dlabel(PLAN.length-1).date.toUpperCase()}`,70,100);
  x.fillStyle="#fff";x.font="800 68px Overpass, Arial";x.fillText(`${S.from} → ${S.to}`,70,180,W-140);
  // route
  const pts=routeSliceG(R.lo,R.hi);const la=pts.map(p=>p[0]),lo=pts.map(p=>p[1]);const mnA=Math.min(...la),mxA=Math.max(...la),mnO=Math.min(...lo),mxO=Math.max(...lo);
  const bx=70,by=230,bw=440,bh=1000,k=Math.min(bw/((mxO-mnO)*Math.cos(42*Math.PI/180)||1),bh/((mxA-mnA)||1));const px=p=>[bx+(p[1]-mnO)*Math.cos(42*Math.PI/180)*k,by+(mxA-p[0])*k];
  x.strokeStyle="rgba(255,255,255,.18)";x.lineWidth=18;x.lineCap="round";x.lineJoin="round";x.beginPath();pts.forEach((p,j)=>{const q=px(p);j?x.lineTo(...q):x.moveTo(...q)});x.stroke();
  x.strokeStyle="#5aa6e8";x.lineWidth=7;x.stroke();
  PLAN.forEach((d,i)=>{const q=px(routeAt(R.G(d.b)));x.fillStyle=d.spot?"#4fbf84":"#f0a81c";x.beginPath();x.arc(q[0],q[1],13,0,7);x.fill();x.fillStyle="#0b2238";x.font="800 15px Overpass, Arial";x.textAlign="center";x.fillText(i+1,q[0],q[1]+5);x.textAlign="left"});
  const o=px(routeAt(R.mO));x.fillStyle="#fff";x.beginPath();x.arc(o[0],o[1],10,0,7);x.fill();
  // stats
  const lows=PLAN.filter(d=>d.area).map(d=>nightLow(d));const spent=S.expenses.reduce((t,e)=>t+e.amt,0);const est=EST.gas+EST.camp+EST.food;
  const stats=[[Math.round(R.T).toLocaleString(),"miles"],[PLAN.length,"days"],[PLAN.filter(d=>d.spot).length,"nights out"],[lows.length?Math.min(...lows)+"°F":"–","coldest night"],["$"+Math.round(spent||est),spent?"spent":"estimated"],[(S.klog||[]).filter(e=>e.k==="cook").length,"camp meals cooked"],[PLAN.filter(d=>d.spot&&TRACK[PLAN.indexOf(d)]&&TRACK[PLAN.indexOf(d)].power).length,"hot showers"]];
  let y=290;stats.forEach(([v,l])=>{x.fillStyle="#fff";x.font="800 58px Overpass, Arial";x.fillText(v,580,y);x.fillStyle="rgba(255,255,255,.7)";x.font="600 24px Overpass, Arial";x.fillText(l.toUpperCase(),580,y+32);y+=112});
  // journal snippet
  const notes=PLAN.map((d,i)=>(S.journal[S.date+"#"+i]||"").trim()).filter(Boolean);const q=notes[0]||"Saw the whole West Coast from the driver's seat.";
  x.fillStyle="rgba(255,255,255,.1)";x.fillRect(70,1240-20,W-140,90);x.fillStyle="#fff";x.font="italic 28px Georgia, serif";const s=q.length>70?q.slice(0,68)+"…":q;x.fillText(`“${s}”`,95,1275,W-190);
  const url=c.toDataURL("image/png");const img=$("#rc-img");img.src=url;img.hidden=false;$("#rc-dl").hidden=false}

async function saveRecap(){const m=$("#rc-msg");m.textContent="";const blob=await new Promise(r=>$("#rc").toBlob(r,"image/png"));
  let dl=null;try{dl=window.claude&&window.claude.use?await window.claude.use("downloads"):null}catch(e){}
  if(dl){try{await dl.save({filename:"i5-trip-recap.png",data:blob});m.textContent="Saved."}catch(e){m.textContent=e&&e.code==="declined"?"Save cancelled.":"Saving isn't available here. Long-press or right-click the picture to save it."}return}
  try{const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="i5-trip-recap.png";document.body.appendChild(a);a.click();a.remove()}catch(e){m.textContent="Long-press or right-click the picture to save it."}}
/* ---------- drive mode ---------- */
let DRV={on:false,watch:null,x:0,last:null,lock:null,spoken:new Set()};
function gFromLatLon(lat,lon){const c=Math.cos(lat*Math.PI/180);let best={d:1e9,g:0};for(let i=1;i<ROUTE.length;i++){const a=ROUTE[i-1],b=ROUTE[i];const ax=(a[1]-lon)*c,ay=a[0]-lat,bx=(b[1]-lon)*c,by=b[0]-lat;const dx=bx-ax,dy=by-ay,L2=dx*dx+dy*dy||1;let t=-(ax*dx+ay*dy)/L2;t=Math.max(0,Math.min(1,t));const px=ax+dx*t,py=ay+dy*t,d=Math.hypot(px,py)*69;if(d<best.d)best={d,g:a[2]+(b[2]-a[2])*t}}return best}
function buildDrive(){const o=document.createElement("div");o.id="drive";o.hidden=true;o.setAttribute("role","dialog");o.setAttribute("aria-label","Drive mode");
  o.innerHTML=`<div class="dv-top"><span id="dv-day"></span><button type="button" id="dv-x" aria-label="Exit drive mode">✕ Exit</button></div><div class="dv-body"><div class="dv-mapbox"><div class="dv-mapin" id="dv-mapin"></div><div class="dv-mz" role="group" aria-label="Map zoom"><button type="button" data-mz="near" aria-pressed="true">Near</button><button type="button" data-mz="day" aria-pressed="false">Today</button><button type="button" data-mz="all" aria-pressed="false">Whole trip</button></div></div><div class="dv-info">
  <div class="dv-mile"><span id="dv-mi">0</span><small id="dv-of"></small></div><div class="dv-bar"><i id="dv-prog"></i></div>
  <div class="dv-grid"><div class="dv-c fuel"><small>Next gas</small><b id="dv-gas">–</b><span id="dv-gas2"></span></div><div class="dv-c rest"><small>Next rest area</small><b id="dv-rest">–</b><span id="dv-rest2"></span></div><div class="dv-c camp"><small>Tonight</small><b id="dv-camp">–</b><span id="dv-camp2"></span></div><div class="dv-c sun"><small>Sunset</small><b id="dv-sun">–</b><span id="dv-sun2"></span></div><div class="dv-c pass"><small>Next pass</small><b id="dv-pass">–</b><span id="dv-pass2"></span></div></div>
  <div class="dv-fact"><small>Coming up</small><b id="dv-ft"></b><span id="dv-fs"></span></div>
  <div class="dv-ctl"><button type="button" id="dv-gps">Use my GPS</button><button type="button" id="dv-voice" aria-pressed="${S.voice}">Read stories aloud</button><span id="dv-msg" aria-live="polite"></span></div>
  <label class="dv-sim">Or preview a spot on the route: <input type="range" id="dv-slide" min="0" max="${Math.round(R.T)}" value="0"></label></div></div>`;
  document.body.appendChild(o);
  $("#dv-x").addEventListener("click",closeDrive);
  $("#dv-gps").addEventListener("click",startGPS);
  $("#dv-voice").addEventListener("click",e=>{S.voice=!S.voice;store.set("voice",S.voice);e.target.setAttribute("aria-pressed",S.voice);if(!S.voice&&window.speechSynthesis)speechSynthesis.cancel()});
  $("#dv-slide").addEventListener("input",e=>{driveAt(+e.target.value,null)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&DRV.on)closeDrive()})}
async function openDrive(){if(!$("#drive"))buildDrive();const o=$("#drive");o.hidden=false;DRV.on=true;document.body.classList.add("driving");$("#dv-slide").max=Math.round(R.T);driveAt(DRV.x,null);
  try{if(navigator.wakeLock)DRV.lock=await navigator.wakeLock.request("screen")}catch(e){}}
function closeDrive(){$("#drive").hidden=true;DRV.on=false;document.body.classList.remove("driving");if(DRV.watch!=null){navigator.geolocation.clearWatch(DRV.watch);DRV.watch=null}try{DRV.lock&&DRV.lock.release()}catch(e){}DRV.lock=null;if(window.speechSynthesis)speechSynthesis.cancel()}
function startGPS(){const m=$("#dv-msg");if(!navigator.geolocation){m.textContent="GPS isn't available in this browser.";return}m.textContent="Finding you…";
  DRV.watch=navigator.geolocation.watchPosition(p=>{const r=gFromLatLon(p.coords.latitude,p.coords.longitude);if(r.d>15){m.textContent=`You're about ${Math.round(r.d)} mi from I-5. Showing the nearest point on the route.`}else m.textContent=`GPS on · ±${Math.round(p.coords.accuracy)} m`;const x=Math.max(0,Math.min(R.T,R.L(r.g)));$("#dv-slide").value=Math.round(x);driveAt(x,{lat:p.coords.latitude,lon:p.coords.longitude})},err=>{m.textContent=err.code===1?"Location permission was denied. Use the slider to preview instead.":"Couldn't get a GPS fix. Try again with a clear view of the sky."},{enableHighAccuracy:true,maximumAge:15000,timeout:20000})}
function driveAt(x,pos){DRV.x=x;const i=dayOf(x),d=PLAN[i],L=dlabel(i);
  $("#dv-day").textContent=`Day ${i+1} · ${L.dow} ${L.date} · ${ptOf(i,false).name} → ${ptOf(i,true).name}`;
  $("#dv-mi").textContent=Math.round(x-d.a);$("#dv-of").textContent=` of ${Math.round(d.b-d.a)} mi today`;$("#dv-prog").style.width=Math.min(100,(x-d.a)/(d.b-d.a||1)*100)+"%";
  const mins=m=>m<1?"here":`${Math.round(m)} mi · ≈${hrs(m)}`;
  const gas=nextThing(x,R.stops.filter(s=>s.cat==="costco"||s.cat==="fuel").map(s=>({x:s.local,n:s.name,opt:s.opt})));
  const tank=FUEL.tankAt(x);$("#dv-gas").textContent=gas?gas.n.replace(/ \(.*\)/,""):"None left on route";$("#dv-gas2").textContent=gas?`${mins(gas.x-x)} · tank est. ${Math.max(0,tank).toFixed(0)} gal`:`Tank est. ${Math.max(0,tank).toFixed(0)} gal`;
  const rest=nextThing(x,R.spots.filter(s=>s.cat==="truck").map(s=>({x:s.local,n:SPOTS[s.id][3]})));$("#dv-rest").textContent=rest?rest.n.replace(/ \(.*\)/,""):"–";$("#dv-rest2").textContent=rest?mins(rest.x-x):"";
  $("#dv-camp").textContent=d.spot?shortName(d.spot):S.to;$("#dv-camp2").textContent=`${mins(d.b-x)}${d.spot?` · ${nightLow(d)}°F low`:""}`;
  const here=pos||{lat:routeAt(R.G(x))[0],lon:routeAt(R.G(x))[1]};const now=new Date();const sun=sunTimes(now,here.lat,here.lon);const nm=now.getHours()*60+now.getMinutes();const arrive=nm+(d.b-x)/MPH*60;
  $("#dv-sun").textContent=fmtTime(sun.set);$("#dv-sun2").textContent=nm<sun.set?`${mmss(sun.set-nm)} of light left${d.spot?(arrive>sun.set-30?" · camp will be in the dark":" · camp before dark"):""}`:"after sunset now";
  const ps=nextThing(x,PASSES.filter(p=>R.inR(p.g)).map(p=>({x:R.L(p.g),n:p.n,p})));if(ps){const lv=S.passLv[ps.n]||"clear",[k,v]=passVerdict(ps.p,lv);$("#dv-pass").textContent=ps.n.replace(/ \(.*\)/,"");$("#dv-pass2").textContent=`${mins(ps.x-x)} · ${v}`;$("#dv-pass").parentElement.className="dv-c pass "+k}else{$("#dv-pass").textContent="None ahead";$("#dv-pass2").textContent=""}
  const facts=TOUR.filter(f=>R.inR(f[0])).map(f=>({x:R.L(f[0]),t:f[1],s:f[2]})).sort((a,b)=>a.x-b.x);
  const nf=facts.find(f=>f.x>=x-1.5);if(nf){$("#dv-ft").textContent=`${nf.t} · ${nf.x-x<1.5?"now":Math.round(nf.x-x)+" mi"}`;$("#dv-fs").textContent=nf.s}
  if(DRV.last!=null&&x>DRV.last&&x-DRV.last<20){facts.filter(f=>f.x>DRV.last-0.5&&f.x<=x+1&&!DRV.spoken.has(f.t)).forEach(f=>{DRV.spoken.add(f.t);if(S.voice)speak(`${f.t}. ${f.s}`)})}
  else if(DRV.last==null||Math.abs(x-DRV.last)>=20)facts.filter(f=>f.x<x-1).forEach(f=>DRV.spoken.add(f.t));
  DRV.last=x}

/* ---------- wire up ---------- */
const _rebuild=rebuild;rebuild=function(){_rebuild();renderPasses();renderKitchen();renderHoliday();if(DRV.on)driveAt(Math.min(DRV.x,R.T),null)};
buildPanels();
(function(){const f=$("#mpg")||document.body;const host=document.querySelector('[aria-labelledby="calc-h"] .ctl');if(host){host.insertAdjacentHTML("beforeend",`<div class="row"><label for="psi">Tire pressure<br><small class="n">door sticker, cold</small></label><div class="psi"><input type="number" id="psi" min="20" max="60" step="1" value="${S.psi}"> psi</div></div>`);$("#psi").addEventListener("change",e=>{S.psi=+e.target.value||35;store.set("psi",S.psi);renderDays()})}})();
rebuild();

/* ================= v5: expense chart + custom types, map focus, drive-mode map ================= */
const EXP_BASE=[["gas","Gas"],["food","Food"],["camp","Camping"],["other","Other"]];
S.expCats=store.get("expCats",[]);
function expCats(){return[...EXP_BASE.slice(0,3),...S.expCats.map(c=>[c.k,c.t]),EXP_BASE[3]]}
function catColor(k){const order=["gas","food","camp","other",...S.expCats.map(c=>c.k)];const n=order.indexOf(k);return `var(--s${Math.max(0,n)+1})`}
function fillCatSelect(){const sel=$("#exp-cat");if(!sel)return;const v=sel.value;sel.innerHTML="";expCats().forEach(([k,t])=>sel.add(new Option(t,k)));if([...sel.options].some(o=>o.value===v))sel.value=v}
function catName(k){const c=expCats().find(c=>c[0]===k);return c?c[1]:k}
renderExpenses=function(){const tb=$("#exp-list");if(!tb)return;tb.innerHTML="";const cats=expCats(),sums=Object.fromEntries(cats.map(c=>[c[0],0]));
  S.expenses.forEach((e,k)=>{if(!(e.cat in sums))e.cat="other";sums[e.cat]+=e.amt;const tr=document.createElement("tr");tr.innerHTML=`<td>${esc(e.day)}</td><td><i class="sw" style="background:${catColor(e.cat)}"></i>${esc(catName(e.cat))}</td><td class="num">$${e.amt.toFixed(2)}</td><td>${esc(e.note||"")}</td><td><button type="button" class="linkb" aria-label="Delete expense">✕</button></td>`;tr.querySelector("button").addEventListener("click",()=>{S.expenses.splice(k,1);store.set("expenses",S.expenses);renderExpenses()});tb.appendChild(tr)});
  const plan={gas:EST.gas,food:EST.food,camp:EST.camp};const spent=Object.values(sums).reduce((a,b)=>a+b,0),est=EST.gas+EST.camp+EST.food;
  $("#exp-sum").innerHTML=cats.map(([k,l])=>`<div class="es"><span class="k"><i class="sw" style="background:${catColor(k)}"></i>${esc(l)}</span><b>$${Math.round(sums[k])}</b><span class="n">${plan[k]!=null?`of ≈$${Math.round(plan[k])} planned`:""}</span></div>`).join("")+`<div class="es tot"><span class="k">Total</span><b>$${Math.round(spent)}</b><span class="n">of ≈$${Math.round(est)} planned · ${spent<=est?"$"+Math.round(est-spent)+" left":"$"+Math.round(spent-est)+" over"}</span></div>`;
  renderExpCharts(cats,sums,plan,spent);renderCatChips()};
function renderExpCharts(cats,sums,plan,spent){let host=$("#exp-charts");if(!host){host=document.createElement("div");host.id="exp-charts";host.className="expcharts";$("#exp-sum").after(host)}
  const rows=cats.filter(([k])=>sums[k]>0||plan[k]);const max=Math.max(1,...rows.map(([k])=>Math.max(sums[k],plan[k]||0)));
  const W=520,rowH=34,top=8,lab=92,valW=118,bw=W-lab-valW;const H=top+rows.length*rowH+4;
  let a=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Spending by type compared with plan">`;
  rows.forEach(([k,t],n)=>{const y=top+n*rowH,v=sums[k],p=plan[k],w=v/max*bw;
    a+=`<g class="hb"><title>${esc(t)}: $${v.toFixed(2)} spent${p!=null?` of ≈$${Math.round(p)} planned (${p?Math.round(v/p*100):0}%)`:""}${spent?` · ${Math.round(v/spent*100)}% of all spending`:""}</title><rect x="0" y="${y}" width="${W}" height="${rowH}" fill="transparent"/>
    <text x="${lab-8}" y="${y+rowH/2+4}" text-anchor="end" class="cl">${esc(t)}</text>
    <rect x="${lab}" y="${y+9}" width="${bw}" height="16" rx="4" class="track"/>
    ${v>0?`<rect x="${lab}" y="${y+9}" width="${Math.max(4,w)}" height="16" rx="4" fill="${catColor(k)}"/>`:""}
    ${p?`<line x1="${lab+p/max*bw}" x2="${lab+p/max*bw}" y1="${y+4}" y2="${y+30}" class="plan"/>`:""}
    <text x="${lab+bw+8}" y="${y+rowH/2+4}" class="cv">$${Math.round(v)}${p!=null?`<tspan class="cm"> / $${Math.round(p)}</tspan>`:spent&&v?`<tspan class="cm"> · ${Math.round(v/spent*100)}%</tspan>`:""}</text></g>`});
  a+=`</svg>`;
  // by day stacked
  const days=PLAN.map((d,i)=>`Day ${i+1}`);const extra=[...new Set(S.expenses.map(e=>e.day).filter(d=>!days.includes(d)))];const allDays=[...days,...extra];
  const byDay=allDays.map(d=>{const o={};cats.forEach(([k])=>o[k]=0);S.expenses.filter(e=>e.day===d).forEach(e=>o[e.cat]+=e.amt);return o});
  const dmax=Math.max(1,...byDay.map(o=>Object.values(o).reduce((x,y)=>x+y,0)));const DW=Math.max(520,allDays.length*44+40),slot=(DW-40)/allDays.length,BW=Math.min(56,slot*0.62),DH=170,base=140,sc=(base-24)/dmax;
  let b=`<svg viewBox="0 0 ${DW} ${DH}" role="img" aria-label="Spending by day, stacked by type"><line x1="20" x2="${DW-10}" y1="${base}" y2="${base}" class="axis"/>`;
  allDays.forEach((d,n)=>{const x=30+n*slot+(slot-BW)/2;let y=base;const tot=Object.values(byDay[n]).reduce((p,q)=>p+q,0);const segs=cats.filter(([k])=>byDay[n][k]>0);
    segs.forEach(([k,t],j)=>{const h=byDay[n][k]*sc;const top=j===segs.length-1;y-=h;b+=`<g class="hb"><title>${esc(d)} · ${esc(t)}: $${byDay[n][k].toFixed(2)}</title>${top?`<path d="M${x} ${y+h-1} V${y+4} Q${x} ${y} ${x+4} ${y} H${x+BW-4} Q${x+BW} ${y} ${x+BW} ${y+4} V${y+h-1}Z" fill="${catColor(k)}"/>`:`<rect x="${x}" y="${y+2}" width="${BW}" height="${Math.max(0,h-2)}" fill="${catColor(k)}"/>`}</g>`});
    b+=`<text x="${x+BW/2}" y="${base+16}" text-anchor="middle" class="cl">${esc(d.replace("Day ","D"))}</text>${tot?`<text x="${x+BW/2}" y="${y-6}" text-anchor="middle" class="cv">$${Math.round(tot)}</text>`:""}`});
  b+=`</svg>`;
  const used=cats.filter(([k])=>sums[k]>0);
  let pie="";if(spent){const R0=80,R1=46,cx=100,cy=100;let ang=-Math.PI/2;const sl=used.slice().sort((p,q)=>sums[q[0]]-sums[p[0]]);
    pie=`<svg viewBox="0 0 200 200" class="pie" role="img" aria-label="Share of spending by type">`;
    sl.forEach(([k,t])=>{const f=sums[k]/spent,a2=ang+f*Math.PI*2;const pt=(r,a)=>`${(cx+r*Math.cos(a)).toFixed(2)} ${(cy+r*Math.sin(a)).toFixed(2)}`;const big=f>0.5?1:0;
      const d=f>=0.9999?`M${cx} ${cy-R0} A${R0} ${R0} 0 1 1 ${cx-0.01} ${cy-R0} L${cx-0.01} ${cy-R1} A${R1} ${R1} 0 1 0 ${cx} ${cy-R1}Z`:`M${pt(R0,ang)} A${R0} ${R0} 0 ${big} 1 ${pt(R0,a2)} L${pt(R1,a2)} A${R1} ${R1} 0 ${big} 0 ${pt(R1,ang)}Z`;
      pie+=`<g class="hb"><title>${esc(t)}: $${sums[k].toFixed(2)} · ${Math.round(f*100)}%</title>${f>=0.9999?`<circle cx="${cx}" cy="${cy}" r="${(R0+R1)/2}" fill="none" stroke="${catColor(k)}" stroke-width="${R0-R1}"/>`:`<path d="${d}" fill="${catColor(k)}" class="slice"/>`}</g>`;ang=a2});
    pie+=`<text x="${cx}" y="${cy-2}" text-anchor="middle" class="pt">$${Math.round(spent)}</text><text x="${cx}" y="${cy+16}" text-anchor="middle" class="cl">spent</text></svg>`;
    pie=`<figure><figcaption>Share of spending</figcaption><div class="piewrap">${pie}<ul class="pielist">${sl.map(([k,t])=>`<li><i class="sw" style="background:${catColor(k)}"></i><span>${esc(t)}</span><b>${Math.round(sums[k]/spent*100)}%</b><span class="n">$${Math.round(sums[k])}</span></li>`).join("")}</ul></div></figure>`}
  host.innerHTML=spent?`${pie}<figure><figcaption>Where it's going, by type <span class="n">bar = spent · line = planned</span></figcaption>${a}</figure><figure><figcaption>By day</figcaption><div class="legend">${used.map(([k,t])=>`<span><i class="sw" style="background:${catColor(k)}"></i>${esc(t)}</span>`).join("")}</div><div class="dayscroll">${b}</div></figure>`:`<figure><figcaption>Where it's going, by type <span class="n">line = planned. Log an expense and the bars fill in.</span></figcaption>${a}</figure>`}
function renderCatChips(){let host=$("#exp-cats");if(!host){host=document.createElement("div");host.id="exp-cats";host.className="expcats";$("#exp-form").after(host)}
  host.innerHTML=`<span class="n">Types:</span>${expCats().map(([k,t])=>`<span class="cchip"><i class="sw" style="background:${catColor(k)}"></i>${esc(t)}${S.expCats.some(c=>c.k===k)?`<button type="button" class="linkb" data-delcat="${k}" aria-label="Remove type ${esc(t)}">✕</button>`:""}</span>`).join("")}${S.expCats.length<4?`<form class="newcat" id="newcat"><label class="sr" for="newcat-in">New expense type</label><input id="newcat-in" type="text" maxlength="20" placeholder="New type, e.g. Parking"><button type="submit" class="linkb">+ Add type</button></form>`:`<span class="n">Up to 4 custom types.</span>`}`;
  host.querySelectorAll("[data-delcat]").forEach(b=>b.addEventListener("click",()=>{const k=b.dataset.delcat;S.expenses.forEach(e=>{if(e.cat===k)e.cat="other"});S.expCats=S.expCats.filter(c=>c.k!==k);store.set("expCats",S.expCats);store.set("expenses",S.expenses);fillCatSelect();renderExpenses()}));
  const f=$("#newcat");if(f)f.addEventListener("submit",e=>{e.preventDefault();const t=$("#newcat-in").value.trim();if(!t)return;if(expCats().some(c=>c[1].toLowerCase()===t.toLowerCase())){$("#newcat-in").select();return}const k="c"+Date.now().toString(36);S.expCats.push({k,t});store.set("expCats",S.expCats);fillCatSelect();$("#exp-cat").value=k;renderExpenses();$("#exp-amt").focus()})}
fillCatSelect();renderExpenses();

/* ---- map focus ---- */
(function(){const z=$(".mapcard .zoom");const b=document.createElement("button");b.type="button";b.id="zmax";b.setAttribute("aria-label","Focus the map (full screen)");b.setAttribute("aria-pressed","false");b.title="Focus the map";b.textContent="⤢";z.appendChild(b);
  const card=$(".mapcard");const toggle=on=>{card.classList.toggle("max",on);document.body.classList.toggle("mapmax",on);b.setAttribute("aria-pressed",on);b.textContent=on?"✕":"⤢";b.setAttribute("aria-label",on?"Exit map focus":"Focus the map (full screen)");setVB({...VB})};
  b.addEventListener("click",()=>toggle(!card.classList.contains("max")));document.addEventListener("keydown",e=>{if(e.key==="Escape"&&card.classList.contains("max")&&!selId)toggle(false)})})();

/* ---- drive-mode map ---- */
const DVM={svg:null,feats:[],mode:"near",me:null};
function dvClone(){const host=$("#dv-mapin");if(!host)return;const c=$("#map").cloneNode(true);c.id="dv-svg";c.classList.remove("dragging");c.setAttribute("aria-label","Map around your position");c.querySelectorAll("[tabindex]").forEach(e=>e.removeAttribute("tabindex"));c.querySelectorAll(".pin.sel").forEach(e=>e.classList.remove("sel"));
  host.innerHTML="";host.appendChild(c);DVM.svg=c;DVM.feats=[];c.querySelectorAll("g[transform]").forEach(g=>{const m=/translate\(([-\d.]+)[ ,]([-\d.]+)\)\s*scale\(/.exec(g.getAttribute("transform"));if(m)DVM.feats.push({g,x:+m[1],y:+m[2]})});
  const me=document.createElementNS(ns,"g");me.setAttribute("class","dv-me");me.innerHTML=`<circle r="22" class="halo"/><circle r="11" class="dot"/><path d="M0 -8 L6 6 L0 3 L-6 6Z" class="arrow"/>`;c.appendChild(me);DVM.me={g:me,x:0,y:0,rot:0};}
function dvSetVB(v){const c=DVM.svg;if(!c)return;c.setAttribute("viewBox",`${v.x} ${v.y} ${v.w} ${v.h}`);const k=v.w/500;DVM.feats.forEach(f=>f.g.setAttribute("transform",`translate(${f.x} ${f.y}) scale(${k})`));const m=DVM.me;m.g.setAttribute("transform",`translate(${m.x} ${m.y}) scale(${k}) rotate(${m.rot})`);DVM.k=k}
function updDriveMap(x,pos){if(!DVM.svg)dvClone();if(!DVM.svg)return;const g=R.G(x);const here=pos?[pos.lat,pos.lon]:routeAt(g);const[mx,my]=P(here[0],here[1]);const ah=routeAt(g+R.dir*3),bh=routeAt(g-R.dir*0.5);const[ax,ay]=P(ah[0],ah[1]),[bx,by]=P(bh[0],bh[1]);
  DVM.me.x=mx;DVM.me.y=my;DVM.me.rot=Math.atan2(ax-bx,-(ay-by))*180/Math.PI;
  const box=$("#dv-mapin"),ar=(box.clientHeight||400)/(box.clientWidth||400);let v;
  if(DVM.mode==="all")v={...FULL};
  else if(DVM.mode==="day"){const d=PLAN[dayOf(x)];const ps=routeSliceG(R.G(d.a),R.G(d.b)).map(p=>P(p[0],p[1]));const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]);const pad=30;let w=Math.max(Math.max(...xs)-Math.min(...xs)+pad*2,(Math.max(...ys)-Math.min(...ys)+pad*2)/ar);const h=w*ar;v={x:(Math.min(...xs)+Math.max(...xs))/2-w/2,y:(Math.min(...ys)+Math.max(...ys))/2-h/2,w,h}}
  else{const w=70,h=w*ar;const lead=0.18*h;const dx=(ax-mx),dy=(ay-my),L=Math.hypot(dx,dy)||1;v={x:mx-w/2+dx/L*lead*0.6,y:my-h/2+dy/L*lead,w,h}}
  dvSetVB(v)}
const _driveAt0=driveAt;driveAt=function(x,pos){_driveAt0(x,pos);updDriveMap(x,pos)};
const _openDrive0=openDrive;openDrive=async function(){if(!$("#drive")){buildDrive();document.querySelectorAll("#drive [data-mz]").forEach(b=>b.addEventListener("click",()=>{DVM.mode=b.dataset.mz;document.querySelectorAll("#drive [data-mz]").forEach(o=>o.setAttribute("aria-pressed",o===b));updDriveMap(DRV.x,null)}))}dvClone();return _openDrive0()};
document.getElementById("drivefab").onclick=null;
(function(){const f=$("#drivefab");const nf=f.cloneNode(true);f.replaceWith(nf);nf.addEventListener("click",()=>openDrive());const rb=[...document.querySelectorAll(".routebar .btn")].find(b=>b.textContent.includes("Drive mode"));if(rb){const n2=rb.cloneNode(true);rb.replaceWith(n2);n2.addEventListener("click",()=>openDrive())}})();
const _rebuild2=rebuild;rebuild=function(){_rebuild2();if(DRV.on){dvClone();updDriveMap(DRV.x,null)}};
window.addEventListener("resize",()=>{if(DRV.on)updDriveMap(DRV.x,null)});

/* ================= v6: camp kitchen ================= */
const FOODART={
 taco:`<path d="M6 34a18 18 0 0 1 36 0z" fill="#f2c26b"/><path d="M10 33c3-6 7-9 14-9s11 3 14 9" fill="none" stroke="#5aa02c" stroke-width="4" stroke-linecap="round"/><circle cx="17" cy="28" r="2.6" fill="#d9472b"/><circle cx="27" cy="26" r="2.6" fill="#d9472b"/><circle cx="33" cy="30" r="2.2" fill="#8a4b2a"/><path d="M6 34h36" stroke="#d9a344" stroke-width="2.5" stroke-linecap="round"/>`,
 bowl:`<path d="M15 10c-2 3 2 5 0 8M24 8c-2 3 2 5 0 8M33 10c-2 3 2 5 0 8" fill="none" stroke="#9aa5ab" stroke-width="2" stroke-linecap="round"/><path d="M6 24h36a18 16 0 0 1-36 0z" fill="#c2410c"/><ellipse cx="24" cy="24" rx="18" ry="4" fill="#8f2d0a"/><circle cx="18" cy="23" r="2" fill="#f2c26b"/><circle cx="28" cy="24" r="2" fill="#f2c26b"/><path d="M17 40h14" stroke="#7a2a0c" stroke-width="3" stroke-linecap="round"/>`,
 ramen:`<path d="M30 4 18 22M38 6 24 22" stroke="#8a5a2b" stroke-width="2.5" stroke-linecap="round"/><path d="M6 24h36a18 16 0 0 1-36 0z" fill="#e5e9ea"/><path d="M6 24h36a18 16 0 0 1-36 0z" fill="none" stroke="#c9d0d3" stroke-width="1.5"/><ellipse cx="24" cy="24" rx="18" ry="4" fill="#f2c26b"/><path d="M12 24c3-2 5 2 8 0s5 2 8 0 5 2 8 0" fill="none" stroke="#e0a73a" stroke-width="2"/><circle cx="30" cy="23" r="3.2" fill="#fff"/><circle cx="30" cy="23" r="1.6" fill="#f0a81c"/><path d="M14 22l4 2" stroke="#5aa02c" stroke-width="2.5" stroke-linecap="round"/>`,
 quesadilla:`<path d="M24 24 6 14a20 20 0 0 1 18-8z" fill="#f2c26b" stroke="#d9a344" stroke-width="1.5"/><path d="M24 24 42 14a20 20 0 0 0-18-8z" fill="#efb95a" stroke="#d9a344" stroke-width="1.5"/><path d="M24 26 8 36a20 20 0 0 0 32 0z" fill="#f2c26b" stroke="#d9a344" stroke-width="1.5"/><path d="M10 15l14 9 14-9M10 35l14-9 14 9" fill="none" stroke="#f7d774" stroke-width="2.5"/><circle cx="19" cy="12" r="1.3" fill="#c98b2e"/><circle cx="28" cy="33" r="1.3" fill="#c98b2e"/>`,
 pasta:`<ellipse cx="24" cy="30" rx="20" ry="9" fill="#e5e9ea" stroke="#c9d0d3" stroke-width="1.5"/><path d="M11 28c4-8 8 4 12-4s8 4 12-3" fill="none" stroke="#f2c26b" stroke-width="3.5" stroke-linecap="round"/><path d="M13 31c4-6 8 3 12-3s7 3 10-1" fill="none" stroke="#e8b04f" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="26" r="3" fill="#c2410c"/><circle cx="28" cy="27" r="3" fill="#c2410c"/><path d="M36 6v16M33 6v6a3 3 0 0 0 6 0V6" fill="none" stroke="#9aa5ab" stroke-width="2" stroke-linecap="round"/>`,
 sandwich:`<path d="M6 30 24 12l18 18z" fill="#f2c26b" stroke="#c98b2e" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 30h32" stroke="#f7d774" stroke-width="4" stroke-linecap="round"/><path d="M8 34h32" stroke="#d9472b" stroke-width="3" stroke-linecap="round"/><path d="M6 38 24 38 42 38" stroke="#e8b04f" stroke-width="5" stroke-linecap="round"/><circle cx="38" cy="12" r="6" fill="#d9472b"/><path d="M36 7c1-2 3-2 4 0" stroke="#5aa02c" stroke-width="2" fill="none"/>`,
 pan:`<path d="M30 30h14" stroke="#3b3b3b" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="28" r="15" fill="#3b4348"/><circle cx="20" cy="28" r="12" fill="#2a3136"/><path d="M12 24c3-2 6 1 9-1s6 1 8-1M11 32c3-1 6 1 9 0" stroke="#c2410c" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="18" cy="28" r="5.5" fill="#fff"/><circle cx="18" cy="28" r="2.6" fill="#f0a81c"/>`,
 hotdog:`<rect x="5" y="24" width="38" height="12" rx="6" fill="#f2c26b"/><rect x="3" y="20" width="42" height="8" rx="4" fill="#c2410c"/><path d="M8 24c3-3 5 3 8 0s5 3 8 0 5 3 8 0 5 3 8 0" fill="none" stroke="#f0a81c" stroke-width="2.5" stroke-linecap="round"/><path d="M12 14c-2 2 2 3 0 5M24 12c-2 2 2 3 0 5M36 14c-2 2 2 3 0 5" stroke="#9aa5ab" stroke-width="2" fill="none" stroke-linecap="round"/>`,
 oats:`<path d="M6 24h36a18 16 0 0 1-36 0z" fill="#5aa6e8"/><ellipse cx="24" cy="24" rx="18" ry="4" fill="#ead7b0"/><circle cx="18" cy="23" r="2.2" fill="#6250d6"/><circle cx="23" cy="25" r="2.2" fill="#6250d6"/><path d="M28 22h7" stroke="#f2c26b" stroke-width="3" stroke-linecap="round"/><path d="M38 6l-8 16" stroke="#9aa5ab" stroke-width="2.5" stroke-linecap="round"/>`,
 plate:`<circle cx="24" cy="26" r="18" fill="#e5e9ea" stroke="#c9d0d3" stroke-width="1.5"/><circle cx="24" cy="26" r="12" fill="#f4f5f2"/><path d="M18 22c3 6 9 6 12 0" stroke="#c2410c" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="29" r="2.5" fill="#5aa02c"/><circle cx="28" cy="29" r="2.5" fill="#f2c26b"/>`
};
const ART_NAMES={taco:"Taco",bowl:"Stew / chili",ramen:"Noodles",quesadilla:"Quesadilla",pasta:"Pasta",sandwich:"Sandwich",pan:"Skillet",hotdog:"Hot dog / brats",oats:"Breakfast bowl",plate:"Plate"};
function art(k,sz){return `<svg viewBox="0 0 48 48" width="${sz||48}" height="${sz||48}" class="foodart" aria-hidden="true">${FOODART[k]||FOODART.plate}</svg>`}
const MEAL_LIB=[
 {id:"m-tacos",n:"Carne asada tacos",icon:"taco",ing:["Carne asada (pre-marinated)","Street tortillas","Salsa","Limes","Avocados"],prep:"Sear the meat hot in the skillet, 4–5 min a side. Warm the tortillas in the same pan.",min:15,cold:0},
 {id:"m-ques",n:"Rotisserie chicken quesadillas",icon:"quesadilla",ing:["Rotisserie chicken","Flour tortillas","Shredded cheese","Salsa"],prep:"Shred the chicken, fill, and crisp in a dry pan 2–3 min a side.",min:15,cold:0},
 {id:"m-pasta",n:"Pasta with sausage sauce",icon:"pasta",ing:["Pasta","Marinara (jar)","Italian sausage","Parmesan"],prep:"Boil pasta in one pot; brown sausage and simmer with sauce in the pan. Save some pasta water.",min:25,cold:0},
 {id:"m-brats",n:"Brats & peppers",icon:"hotdog",ing:["Bratwurst","Hot dog buns","Bell peppers","Onion","Mustard"],prep:"Brown the brats, then add sliced peppers and onion; cover and cook through.",min:20,cold:0},
 {id:"m-chili",n:"Chili with cornbread muffins",icon:"bowl",ing:["Canned chili","Cornbread muffins","Shredded cheese","Onion"],prep:"Heat the chili in one pot. Hot food right before bed helps you stay warm.",min:10,cold:1},
 {id:"m-ramen",n:"Loaded ramen",icon:"ramen",ing:["Instant ramen","Eggs","Frozen potstickers","Green onions"],prep:"Boil water, add potstickers 3 min, then noodles and a cracked egg. Top with onions.",min:12,cold:1},
 {id:"m-soup",n:"Chicken & rice soup",icon:"bowl",ing:["Rotisserie chicken","Microwave rice cups","Chicken broth","Carrots"],prep:"Simmer broth with sliced carrots, add rice and chicken, 10 minutes.",min:15,cold:1},
 {id:"m-hash",n:"Breakfast-for-dinner hash",icon:"pan",ing:["Frozen hash browns","Eggs","Precooked bacon","Shredded cheese"],prep:"Crisp the hash browns, make wells, crack in eggs, cover until set.",min:20,cold:1},
 {id:"m-grilled",n:"Grilled cheese & tomato soup",icon:"sandwich",ing:["Bread","Sliced cheese","Butter","Tomato soup (carton)"],prep:"Heat soup in the pot; butter and toast sandwiches low and slow in the pan.",min:15,cold:1}
];
MEAL_LIB.forEach(m=>m.t="Dinner");
MEAL_LIB.push(
 {id:"b-oats",t:"Breakfast",n:"Oatmeal, fruit & coffee",icon:"oats",ing:["Oatmeal packets","Coffee","Clementines"],prep:"Boil water once for oatmeal and coffee.",min:5},
 {id:"b-burrito",t:"Breakfast",n:"Breakfast burritos",icon:"taco",ing:["Flour tortillas","Eggs","Precooked bacon","Shredded cheese","Salsa"],prep:"Scramble eggs with the bacon, roll up with cheese and salsa. Wrap in foil to eat on the road.",min:12},
 {id:"b-skillet",t:"Breakfast",n:"Eggs & bacon skillet",icon:"pan",ing:["Eggs","Precooked bacon","Bread","Coffee"],prep:"Warm the bacon, fry the eggs in the fat, toast bread in the pan.",min:12},
 {id:"b-bagel",t:"Breakfast",n:"Bagels & cream cheese",icon:"sandwich",ing:["Bagels","Cream cheese","Coffee"],prep:"No cooking: good for cold, rushed mornings.",min:3},
 {id:"l-deli",t:"Lunch",n:"Deli sandwiches",icon:"sandwich",ing:["Bread","Deli meat","Sliced cheese","Mustard","Chips"],prep:"Make them at breakfast so lunch is grab-and-go.",min:5},
 {id:"l-wraps",t:"Lunch",n:"Chicken wraps",icon:"taco",ing:["Flour tortillas","Rotisserie chicken","Shredded cheese","Salsa"],prep:"Roll at a rest area. Uses up the rotisserie chicken.",min:5},
 {id:"s-trail",t:"Snack",n:"Road snacks",icon:"plate",ing:["Trail mix","Jerky","Granola bars"],prep:"Keep a bag up front.",min:0}
);
const SLOTS=["Breakfast","Lunch","Dinner","Snack"];
Object.assign(S,{meals:store.get("meals",[]),menu:store.get("menu",{}),dayMenu:store.get("dayMenu",{}),pantry:store.get("pantry",[]),klog:store.get("klog",[]),shopExtra:store.get("shopExtra",[]),build:store.get("build",{ing:[]})});
const norm=t=>String(t).trim().toLowerCase();
function allMeals(){return[...MEAL_LIB,...S.meals]}
function mealById(id){return allMeals().find(m=>m.id===id)}
function pantryQty(name){const p=S.pantry.find(x=>norm(x.n)===norm(name));return p?p.q:0}
function savePantry(){S.pantry=S.pantry.filter(p=>p.q>0||p.keep);store.set("pantry",S.pantry)}
function pantryAdd(name,q,why,kind){name=name.trim();if(!name)return;const p=S.pantry.find(x=>norm(x.n)===norm(name));if(p)p.q=Math.max(0,p.q+q);else if(q>0)S.pantry.push({n:name,q});savePantry();if(why)klog(why,kind)}
function klog(text,k){S.klog.unshift({t:Date.now(),text,k:k||"note"});S.klog=S.klog.slice(0,200);store.set("klog",S.klog)}
let _eid=0;const eid=()=>"e"+Date.now().toString(36)+(_eid++);
function defaultDay(i,rot){const d=PLAN[i],out=[{id:"d"+i+"b",slot:"Breakfast",meal:"b-oats",add:[]}];if(d&&d.spot){const low=nightLow(d),cold=low<=34;const pool=MEAL_LIB.filter(m=>m.t==="Dinner"&&!!m.cold===cold);const m=mealById(S.menu[i])||pool[(cold?rot.c++:rot.w++)%pool.length];out.push({id:"d"+i+"d",slot:"Dinner",meal:m.id,add:[]})}return out}
function dayMenus(){const rot={c:0,w:0};return PLAN.map((d,i)=>{const def=defaultDay(i,rot);return S.dayMenu[i]||def})}
function saveDay(i,list){const all=dayMenus();all[i]=list;all.forEach((l,k)=>S.dayMenu[k]=l);store.set("dayMenu",S.dayMenu)}
function entryIng(e){const m=mealById(e.meal);return[...(m?m.ing:[]),...(e.add||[])]}
function needs(){const need=new Map();const add=(t,c,src)=>{const k=norm(t);const o=need.get(k)||{n:t,c:0,src:[]};o.c+=c;if(src&&!o.src.includes(src))o.src.push(src);need.set(k,o)};
  dayMenus().forEach((l,i)=>l.filter(e=>!e.cooked).forEach(e=>entryIng(e).forEach(t=>add(t,1,`Day ${i+1} ${e.slot.toLowerCase()}`))));
  S.shopExtra.forEach(x=>add(x.n,x.q,"added by you"));
  return[...need.values()].map(o=>({...o,have:pantryQty(o.n),short:Math.max(0,o.c-pantryQty(o.n)),mine:S.shopExtra.some(x=>norm(x.n)===norm(o.n))}))}
function knownIngredients(){return[...new Set([...allMeals().flatMap(m=>m.ing),...S.pantry.map(p=>p.n),...S.shopExtra.map(x=>x.n),...Object.values(S.dayMenu).flat().flatMap(e=>e.add||[])])].sort((a,b)=>a.localeCompare(b))}
function mealOptions(sel,slot){const groups=SLOTS.map(t=>[t,allMeals().filter(m=>(m.t||"Dinner")===t)]).filter(g=>g[1].length);groups.sort((a,b)=>(b[0]===slot)-(a[0]===slot));return groups.map(([t,ms])=>`<optgroup label="${t}">${ms.map(m=>`<option value="${m.id}" ${m.id===sel?"selected":""}>${esc(m.n)}${m.custom?" (yours)":""}</option>`).join("")}</optgroup>`).join("")}
var KREADY;
function renderKitchen(){const host=$("#kitbody");if(!host||!KREADY)return;if(S.kday==null)S.kday=store.get("kday","all");if(S.kday!=="all"&&+S.kday>=PLAN.length)S.kday="all";const dm=dayMenus(),nd=needs(),short=nd.filter(o=>o.short>0);const tab=S.ktab||"menu";
  const chip=t=>`<span class="ing ${pantryQty(t)>0?"have":"miss"}">${pantryQty(t)>0?"✓":"+"} ${esc(t)}</span>`;
  const entryCard=(e,i,k)=>{const m=mealById(e.meal)||{n:"Pick a meal",icon:"plate",ing:[]};const ing=entryIng(e);const ok=ing.filter(t=>pantryQty(t)>0).length;
    return `<article class="mcard ${e.cooked?"done":""}" data-e="${i}:${k}"><div class="mart">${art(m.icon,56)}</div><div class="mbody"><div class="mslot">${e.slot}${m.min?` · ≈${m.min} min`:""}</div>
    <label class="sr" for="ms${i}-${k}">${e.slot} for day ${i+1}</label><select id="ms${i}-${k}" data-pick>${mealOptions(e.meal,e.slot)}</select>
    <div class="ings">${(m.ing||[]).map(chip).join("")}${(e.add||[]).map((t,j)=>`<span class="ing extra ${pantryQty(t)>0?"have":"miss"}">${pantryQty(t)>0?"✓":"+"} ${esc(t)}<button type="button" data-rmadd="${j}" aria-label="Remove ${esc(t)}">✕</button></span>`).join("")}</div>
    ${e.cooked?"":`<form class="addone" data-addone><label class="sr" for="ai${i}-${k}">Add an ingredient</label><input id="ai${i}-${k}" list="ingnames" placeholder="+ ingredient" autocomplete="off"><button type="submit" class="linkb">Add</button></form>`}
    ${m.prep?`<p class="mprep">${esc(m.prep)}</p>`:""}
    <div class="mfoot"><span class="n">${ok} of ${ing.length} on hand</span><span>${e.cooked?`<span class="cookedtag">${e.slot==="Snack"?"Eaten":"Cooked"} ✓</span> <button type="button" class="linkb" data-uncook>Undo</button>`:`<button type="button" class="pbb" data-cook>${e.slot==="Snack"||!m.min?"Ate it":"Cooked it"}</button>`} <button type="button" class="linkb" data-rme aria-label="Remove this ${e.slot.toLowerCase()}">Remove</button></span></div></div></article>`};
  const B=S.build;
  host.innerHTML=`<datalist id="ingnames">${knownIngredients().map(t=>`<option value="${esc(t)}">`).join("")}</datalist>
  <div class="ktabs" role="tablist">${[["menu","Menu"],["pantry",`Pantry <small>${S.pantry.filter(p=>p.q>0).length}</small>`],["shop",`Shopping list <small>${short.length}</small>`],["lib","Meal library"],["log","Kitchen log"]].map(([k,t])=>`<button type="button" role="tab" data-kt="${k}" aria-selected="${tab===k}">${t}</button>`).join("")}</div>
  <div class="kpane" data-kp="menu">
    <details class="builder" id="builder" ${S.buildOpen?"open":""}><summary><span>＋ Build a meal</span><small>name it, pick a picture, add any ingredients</small></summary>
    <form id="build-form" class="mealform">
      <div class="mfrow"><label class="grow">Meal name<input id="bf-n" maxlength="60" value="${esc(B.n||"")}" placeholder="e.g. Salmon foil packets" required></label><label>Meal<select id="bf-t">${SLOTS.map(t=>`<option ${t===(B.t||"Dinner")?"selected":""}>${t}</option>`).join("")}</select></label></div>
      <fieldset class="artpick"><legend>Picture</legend>${Object.keys(FOODART).map(k=>`<label title="${ART_NAMES[k]}"><input type="radio" name="bf-icon" value="${k}" ${k===(B.icon||"plate")?"checked":""}><span>${art(k,40)}</span><span class="sr">${ART_NAMES[k]}</span></label>`).join("")}</fieldset>
      <div><div class="flab">Ingredients <small class="n">type one and press Enter; anything works, not just the list</small></div><div class="ings bchips">${(B.ing||[]).map((t,j)=>`<span class="ing extra">${esc(t)}<button type="button" data-bdel="${j}" aria-label="Remove ${esc(t)}">✕</button></span>`).join("")||`<span class="n">No ingredients yet.</span>`}</div>
        <div class="addrow"><label class="sr" for="bf-i">Ingredient</label><input id="bf-i" list="ingnames" placeholder="e.g. Salmon" autocomplete="off"><button type="button" class="btn sm" id="bf-iadd">Add ingredient</button></div></div>
      <label>How to cook it<textarea id="bf-p" rows="2" placeholder="Steps, time, tips">${esc(B.p||"")}</textarea></label>
      <div class="mfrow"><label>Minutes<input id="bf-m" type="number" min="0" max="240" value="${B.m??15}"></label><label class="chk"><input type="checkbox" id="bf-c" ${B.c?"checked":""}> Good for cold nights</label>
        <label>Put it on<select id="bf-d"><option value="">Save to library only</option>${PLAN.map((d,i)=>`<option value="${i}" ${String(B.d)===String(i)?"selected":""}>Day ${i+1} · ${dlabel(i).dow}</option>`).join("")}</select></label></div>
      <div class="mfrow"><button type="submit" class="btn">Save meal</button><span class="n" id="bf-msg" aria-live="polite"></span></div>
    </form></details>
    <div class="kdayf" role="group" aria-label="Show meals for">${[["all","Whole trip"],...PLAN.map((d,i)=>[String(i),`Day ${i+1} · ${dlabel(i).dow}`])].map(([k,t])=>`<button type="button" data-kday="${k}" aria-pressed="${(S.kday??"all")===k}">${t}</button>`).join("")}</div>
    <div class="daysmenu">${dm.map((list,i)=>{const d=PLAN[i];if((S.kday??"all")!=="all"&&String(i)!==S.kday)return "";return `<section class="kday"><div class="kdh"><b>Day ${i+1} · ${dlabel(i).dow} ${dlabel(i).date}</b><span class="n">${d.spot?`${esc(shortName(d.spot))} · ${nightLow(d)}°F low`:`arrive ${esc(S.to)}`}</span></div>
      <div class="menugrid">${list.map((e,k)=>entryCard(e,i,k)).join("")||`<p class="n">No meals planned.</p>`}</div>
      <form class="addmeal" data-addmeal="${i}"><label class="sr" for="am-s${i}">Meal</label><select id="am-s${i}" data-slot>${SLOTS.map(t=>`<option ${t===(list.some(e=>e.slot==="Lunch")?"Snack":"Lunch")?"selected":""}>${t}</option>`).join("")}</select><label class="sr" for="am-m${i}">Which meal</label><select id="am-m${i}" data-meal>${mealOptions(null,list.some(e=>e.slot==="Lunch")?"Snack":"Lunch")}</select><button type="submit" class="linkb">＋ Add to Day ${i+1}</button></form></section>`}).join("")}</div>
    <p class="gn">Cooler: one block of ice plus a bag of cubes from Costco Ontario lasts about three November days. Drain and add ice around Day 3, and keep food in the truck at night (Oregon state parks require it).</p></div>
  <div class="kpane" data-kp="pantry"><form class="kadd" id="pan-form"><label>Ingredient<input id="pan-n" list="ingnames" placeholder="Anything, e.g. Hot sauce" autocomplete="off"></label><label>How many<input id="pan-q" type="number" min="1" step="1" value="1"></label><button type="submit" class="btn">Add to pantry</button></form>
    ${S.pantry.length?`<ul class="pantry">${S.pantry.slice().sort((a,b)=>a.n.localeCompare(b.n)).map(p=>{const used=nd.find(o=>norm(o.n)===norm(p.n)&&o.src.length);return `<li class="${p.q>0?"":"out"}"><span class="pn">${esc(p.n)}${used?` <small>for ${esc(used.src.slice(0,3).join(", "))}${used.src.length>3?"…":""}</small>`:""}</span><span class="qty"><button type="button" class="qb" data-pq="${esc(p.n)}" data-d="-1" aria-label="One less ${esc(p.n)}">−</button><b>${p.q}</b><button type="button" class="qb" data-pq="${esc(p.n)}" data-d="1" aria-label="One more ${esc(p.n)}">+</button></span><button type="button" class="linkb" data-prm="${esc(p.n)}" aria-label="Remove ${esc(p.n)}">✕</button></li>`}).join("")}</ul>`:`<p class="n">Nothing logged yet. Add what's in the cooler and the bins, or check things off on the shopping list and they'll land here.</p>`}</div>
  <div class="kpane" data-kp="shop"><form class="kadd" id="shop-form"><label>Add to the list<input id="shop-n" list="ingnames" placeholder="e.g. Paper towels, Ice, Hot sauce" autocomplete="off"></label><label>How many<input id="shop-q" type="number" min="1" step="1" value="1"></label><button type="submit" class="btn">Add item</button></form>
    ${short.length?`<p class="n">What your meals still need, minus what's in the pantry, plus anything you added. Check an item when you buy it and it moves into the pantry.</p><ul class="shop">${short.map(o=>`<li><label><input type="checkbox" data-buy="${esc(o.n)}" data-c="${o.short}"><span>${esc(o.n)}${o.short>1?` ×${o.short}`:""} <small>${esc(o.src.slice(0,3).join(", "))}${o.src.length>3?"…":""}${o.have?` · have ${o.have}`:""}</small></span></label>${o.mine?`<button type="button" class="linkb" data-sdel="${esc(o.n)}" aria-label="Remove ${esc(o.n)} from the list">✕</button>`:""}</li>`).join("")}</ul><button type="button" class="btn" id="buyall">Bought everything: add all to pantry</button>`:`<p class="n">You have everything your meals call for.</p>`}
    <p class="gn">Costco sizes are big. Buy the rotisserie chicken the day you leave and use it in the first two days.</p></div>
  <div class="kpane" data-kp="lib"><p class="n">Every meal you can put on a day. To add one, use <button type="button" class="linkb" id="lib-build">＋ Build a meal</button> on the Menu tab.</p>${SLOTS.map(t=>{const ms=allMeals().filter(m=>(m.t||"Dinner")===t);return ms.length?`<div class="gk">${t}</div><div class="libgrid">${ms.map(m=>`<article class="lcard"><div class="mart">${art(m.icon,48)}</div><div><b>${esc(m.n)}</b>${m.cold?` <span class="tag">cold nights</span>`:""}${m.custom?` <span class="tag mine">yours</span>`:""}<div class="n">${esc(m.ing.join(" · "))}</div>${m.prep?`<p class="mprep">${esc(m.prep)}</p>`:""}${m.custom?`<button type="button" class="linkb" data-mdel="${m.id}">Remove meal</button>`:""}</div></article>`).join("")}</div>`:""}).join("")}</div>
  <div class="kpane" data-kp="log"><form class="kadd" id="log-form"><label>Note<input id="log-t" placeholder="e.g. Ice from Safeway in Redding, cooler at 38°F"></label><button type="submit" class="btn">Add note</button></form>
    ${S.klog.length?`<ol class="klog">${S.klog.map(e=>`<li class="${e.k}"><time>${new Date(e.t).toLocaleString("en-US",{weekday:"short",hour:"numeric",minute:"2-digit"})}</time><span>${esc(e.text)}</span></li>`).join("")}</ol><button type="button" class="linkb" id="log-clear">Clear log</button>`:`<p class="n">Cooking, buying and using ingredients show up here automatically. Add your own notes too.</p>`}</div>`;
  host.querySelectorAll(".kpane").forEach(p=>p.hidden=p.dataset.kp!==tab);
  const re=(focusSel)=>{renderKitchen();if(focusSel){const f=host.querySelector(focusSel);if(f)f.focus()}};
  host.querySelectorAll("[data-kt]").forEach(b=>b.addEventListener("click",()=>{S.ktab=b.dataset.kt;re(`[data-kt="${S.ktab}"]`)}));
  host.querySelectorAll("[data-kday]").forEach(b=>b.addEventListener("click",()=>{S.kday=b.dataset.kday;store.set("kday",S.kday);re(`[data-kday="${S.kday}"]`)}));
  // entries
  host.querySelectorAll("[data-e]").forEach(card=>{const[i,k]=card.dataset.e.split(":").map(Number);const list=dm[i].map(x=>({...x,add:[...(x.add||[])]})),e=list[k];
    card.querySelector("[data-pick]").addEventListener("change",ev=>{e.meal=ev.target.value;saveDay(i,list);re(`#ms${i}-${k}`)});
    card.querySelectorAll("[data-rmadd]").forEach(b=>b.addEventListener("click",()=>{e.add.splice(+b.dataset.rmadd,1);saveDay(i,list);re(`#ai${i}-${k}`)}));
    const af=card.querySelector("[data-addone]");if(af)af.addEventListener("submit",ev=>{ev.preventDefault();const v=af.querySelector("input").value.trim();if(!v)return;e.add.push(v);saveDay(i,list);re(`#ai${i}-${k}`)});
    card.querySelector("[data-rme]").addEventListener("click",()=>{list.splice(k,1);saveDay(i,list);re(`[data-addmeal="${i}"] select`)});
    const ck=card.querySelector("[data-cook]");if(ck)ck.addEventListener("click",()=>{const used=[],missing=[];entryIng(e).forEach(t=>{if(pantryQty(t)>0){pantryAdd(t,-1);used.push(t)}else missing.push(t)});e.cooked=true;e.used=used;saveDay(i,list);const m=mealById(e.meal);
      klog(`${e.slot} on Day ${i+1}: ${m?m.n:"meal"}. Used ${used.length?used.join(", "):"nothing from the pantry"}${missing.length?`; not in pantry: ${missing.join(", ")}`:""}.`,"cook");re()});
    const uk=card.querySelector("[data-uncook]");if(uk)uk.addEventListener("click",()=>{(e.used||[]).forEach(t=>pantryAdd(t,1));e.cooked=false;e.used=[];saveDay(i,list);klog(`Undid ${e.slot.toLowerCase()} on Day ${i+1}; ingredients returned to the pantry.`);re()})});
  host.querySelectorAll("[data-addmeal]").forEach(f=>{const i=+f.dataset.addmeal;const ss=f.querySelector("[data-slot]"),ms=f.querySelector("[data-meal]");ss.addEventListener("change",()=>{ms.innerHTML=mealOptions(null,ss.value)});
    f.addEventListener("submit",ev=>{ev.preventDefault();const list=dm[i].map(x=>({...x}));list.push({id:eid(),slot:ss.value,meal:ms.value,add:[]});list.sort((a,b)=>SLOTS.indexOf(a.slot)-SLOTS.indexOf(b.slot));saveDay(i,list);re()})});
  // builder
  const bd=$("#builder");bd.addEventListener("toggle",()=>{S.buildOpen=bd.open});
  const keep=()=>{S.build={...S.build,n:$("#bf-n").value,t:$("#bf-t").value,icon:(host.querySelector('[name="bf-icon"]:checked')||{}).value,p:$("#bf-p").value,m:$("#bf-m").value,c:$("#bf-c").checked,d:$("#bf-d").value};store.set("build",S.build)};
  ["#bf-n","#bf-t","#bf-p","#bf-m","#bf-c","#bf-d"].forEach(sel=>$(sel).addEventListener("change",keep));host.querySelectorAll('[name="bf-icon"]').forEach(r=>r.addEventListener("change",keep));
  const addIng=()=>{const v=$("#bf-i").value.trim();if(!v)return;keep();S.build.ing=[...(S.build.ing||[]),...v.split(",").map(t=>t.trim()).filter(Boolean)];store.set("build",S.build);re("#bf-i")};
  $("#bf-i").addEventListener("keydown",ev=>{if(ev.key==="Enter"){ev.preventDefault();addIng()}});$("#bf-iadd").addEventListener("click",addIng);
  host.querySelectorAll("[data-bdel]").forEach(b=>b.addEventListener("click",()=>{keep();S.build.ing.splice(+b.dataset.bdel,1);store.set("build",S.build);re("#bf-i")}));
  $("#build-form").addEventListener("submit",ev=>{ev.preventDefault();keep();const B=S.build;const pend=$("#bf-i").value.trim();if(pend)B.ing=[...(B.ing||[]),...pend.split(",").map(t=>t.trim()).filter(Boolean)];
    if(!B.n.trim()){$("#bf-n").focus();return}if(!(B.ing||[]).length){$("#bf-msg").textContent="Add at least one ingredient.";$("#bf-i").focus();return}
    const m={id:"u"+Date.now().toString(36),t:B.t||"Dinner",n:B.n.trim(),icon:B.icon||"plate",ing:B.ing,prep:(B.p||"").trim(),min:+B.m||0,cold:B.c?1:0,custom:1};S.meals.push(m);store.set("meals",S.meals);
    if(B.d!==""&&B.d!=null){const i=+B.d,list=dm[i].map(x=>({...x}));const same=list.findIndex(e=>e.slot===m.t&&!e.cooked);if(same>=0)list[same]={...list[same],meal:m.id};else list.push({id:eid(),slot:m.t,meal:m.id,add:[]});list.sort((a,b)=>SLOTS.indexOf(a.slot)-SLOTS.indexOf(b.slot));saveDay(i,list)}
    klog(`Added meal: ${m.n}${B.d!==""&&B.d!=null?` (Day ${+B.d+1} ${m.t.toLowerCase()})`:""}.`);S.build={ing:[],t:B.t,icon:"plate"};store.set("build",S.build);S.buildOpen=false;re()});
  // pantry
  $("#pan-form").addEventListener("submit",e=>{e.preventDefault();const n=$("#pan-n").value.trim(),q=Math.max(1,parseInt($("#pan-q").value)||1);if(!n){$("#pan-n").focus();return}pantryAdd(n,q,`Added ${q} × ${n} to the pantry.`,"buy");re("#pan-n")});
  host.querySelectorAll("[data-pq]").forEach(b=>b.addEventListener("click",()=>{const n=b.dataset.pq,dl=+b.dataset.d;const p=S.pantry.find(x=>x.n===n);if(!p)return;p.q=Math.max(0,p.q+dl);p.keep=true;store.set("pantry",S.pantry);klog(dl>0?`Added 1 × ${n} (now ${p.q}).`:`Used 1 × ${n} (${p.q} left).`,dl>0?"buy":"use");re(`[data-pq="${CSS.escape(n)}"][data-d="${dl}"]`)}));
  host.querySelectorAll("[data-prm]").forEach(b=>b.addEventListener("click",()=>{S.pantry=S.pantry.filter(x=>x.n!==b.dataset.prm);store.set("pantry",S.pantry);klog(`Removed ${b.dataset.prm} from the pantry.`);re()}));
  // shopping
  $("#shop-form").addEventListener("submit",e=>{e.preventDefault();const n=$("#shop-n").value.trim(),q=Math.max(1,parseInt($("#shop-q").value)||1);if(!n){$("#shop-n").focus();return}const x=S.shopExtra.find(o=>norm(o.n)===norm(n));if(x)x.q+=q;else S.shopExtra.push({n,q});store.set("shopExtra",S.shopExtra);klog(`Added ${q} × ${n} to the shopping list.`);re("#shop-n")});
  host.querySelectorAll("[data-sdel]").forEach(b=>b.addEventListener("click",()=>{S.shopExtra=S.shopExtra.filter(o=>norm(o.n)!==norm(b.dataset.sdel));store.set("shopExtra",S.shopExtra);re()}));
  const clearExtra=n=>{const x=S.shopExtra.find(o=>norm(o.n)===norm(n));if(x){S.shopExtra=S.shopExtra.filter(o=>o!==x);store.set("shopExtra",S.shopExtra)}};
  host.querySelectorAll("[data-buy]").forEach(c=>c.addEventListener("change",()=>{if(!c.checked)return;const n=c.dataset.buy,q=+c.dataset.c;const x=S.shopExtra.find(o=>norm(o.n)===norm(n));const needQ=q;pantryAdd(n,needQ,`Bought ${needQ} × ${n}.`,"buy");clearExtra(n);setTimeout(()=>re(),250)}));
  const ba=$("#buyall");if(ba)ba.addEventListener("click",()=>{short.forEach(o=>{pantryAdd(o.n,o.short);clearExtra(o.n)});klog(`Shopping run: added ${short.length} items to the pantry.`,"buy");re()});
  // library + log
  $("#lib-build").addEventListener("click",()=>{S.ktab="menu";S.buildOpen=true;re("#bf-n")});
  host.querySelectorAll("[data-mdel]").forEach(b=>b.addEventListener("click",()=>{const id=b.dataset.mdel,m=mealById(id);S.meals=S.meals.filter(x=>x.id!==id);Object.keys(S.dayMenu).forEach(k=>{S.dayMenu[k]=S.dayMenu[k].filter(e=>e.meal!==id)});store.set("meals",S.meals);store.set("dayMenu",S.dayMenu);klog(`Removed meal: ${m.n}.`);re()}));
  $("#log-form").addEventListener("submit",e=>{e.preventDefault();const t=$("#log-t").value.trim();if(!t)return;klog(t,"note");re("#log-t")});
  const lc=$("#log-clear");if(lc)lc.addEventListener("click",()=>{S.klog=[];store.set("klog",[]);re()});
}
KREADY=true;renderKitchen();

/* ================= v8: sign styling, dock ================= */
const SIGNICON={
 pass:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="10" width="44" height="44" rx="5" transform="rotate(45 32 32)" fill="#f6c315" stroke="#1b1b1b" stroke-width="3"/><path d="M17 41 27 27l5 6 6-10 9 18z" fill="#1b1b1b"/><path d="M36 23l2.5 4 2.5-4" fill="none" stroke="#f6c315" stroke-width="1.6"/></svg>`,
 kitchen:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#1d4f9c" stroke="#fff" stroke-width="3"/><rect x="11" y="11" width="42" height="42" rx="5" fill="#fff"/><path d="M25 16v13a3.5 3.5 0 0 1-3 3.5V48h-3V32.5A3.5 3.5 0 0 1 16 29V16h2v11h2V16h2v11h2V16z" fill="#1d4f9c"/><path d="M41 16c-4 1-6 6-6 12 0 3 1 5 3 5v15h3z" fill="#1d4f9c"/></svg>`,
 recap:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#6b3f1d" stroke="#fff" stroke-width="3"/><rect x="14" y="22" width="36" height="24" rx="4" fill="#fff"/><rect x="24" y="17" width="12" height="7" rx="2" fill="#fff"/><circle cx="32" cy="34" r="8" fill="#6b3f1d"/><circle cx="32" cy="34" r="4.5" fill="#fff"/><circle cx="44" cy="27" r="1.8" fill="#6b3f1d"/></svg>`,
 sheet:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#0f6a46" stroke="#fff" stroke-width="3"/><path d="M19 14h18l8 8v28H19z" fill="#fff"/><path d="M37 14v8h8" fill="#cfe5d9"/><path d="M24 28h16M24 33h16M24 38h10" stroke="#0f6a46" stroke-width="2.4" stroke-linecap="round"/><path d="M36 44h3v4h-3zM40.5 41h3v7h-3z" fill="#0f6a46"/><path d="M33 40l12 10" stroke="#c2410c" stroke-width="2.6" stroke-linecap="round"/></svg>`
};
(function(){
  // panel colour families
  const fam={"calc-h":"plan","chk-h":"plan","pack-h":"plan","exp-h":"svc","sheet-h":"plan","pass-h":"warn","kitchen-h":"svc","recap-h":"rec"};
  const ico={plan:`<svg viewBox="0 0 24 24"><path d="M12 3v18M12 7l-4 4M12 7l4 4" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,svc:`<svg viewBox="0 0 24 24"><text x="12" y="18" text-anchor="middle" font-family="Overpass,Arial" font-weight="900" font-size="17" fill="currentColor">i</text></svg>`,warn:`<svg viewBox="0 0 24 24"><path d="M12 6v8M12 17.5v.5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>`,rec:`<svg viewBox="0 0 24 24"><path d="M4 18l5-8 3 4 3-5 5 9z" fill="currentColor"/></svg>`};
  Object.entries(fam).forEach(([id,f])=>{const h=document.getElementById(id);if(!h)return;const p=h.closest(".panel");p.classList.add("sp","sp-"+f);if(!h.querySelector(".sbadge"))h.insertAdjacentHTML("afterbegin",`<span class="sbadge ${f}" aria-hidden="true">${ico[f]}</span>`)});
  document.querySelector('section[aria-label="Route"]')?.classList.add("sp","sp-plan");
  // header: gantry, bolts, exit tab, sheen
  const hd=document.querySelector("header.sign");
  if(hd&&!hd.querySelector(".gantry")){hd.classList.add("sign2");hd.insertAdjacentHTML("afterbegin",`<div class="gantry" aria-hidden="true"><i class="post l"></i><i class="truss"></i><i class="post r"></i><i class="hang l"></i><i class="hang r"></i></div><div class="exittab" id="exittab"></div><i class="bolt tl"></i><i class="bolt tr"></i><i class="bolt bl"></i><i class="bolt br"></i><i class="sheen" aria-hidden="true"></i>`)}
  // dock
  const grid=document.querySelector(".wrap > .grid")||document.querySelector(".grid");
  const items=[["pass","Mountain passes","pass"],["kitchen","Camp kitchen","kitchen"],["recap","Trip recap card","recap"],["sheetp","Offline trip sheet","sheet"]];
  const sheet=document.querySelector('section[aria-labelledby="sheet-h"]');if(sheet)sheet.id="sheetp";
  const dock=document.createElement("nav");dock.className="dock";dock.setAttribute("aria-label","Trip tools");
  dock.innerHTML=`<div class="dockbar">${items.map(([id,t,ic])=>`<button type="button" class="dk-i" data-dock="${id}" aria-expanded="false" aria-controls="${id}"><span class="dk-ic">${SIGNICON[ic]}</span><span class="dk-t">${t}</span><i class="dk-dot"></i></button>`).join("")}</div><p class="dk-hint">Tap a sign to open it</p>`;
  const holder=document.createElement("div");holder.className="dockpanels";
  grid.after(dock);dock.after(holder);
  items.forEach(([id])=>{const p=document.getElementById(id);if(p){holder.appendChild(p);p.hidden=true;p.classList.add("docked")}});
  document.querySelector(".xpanels")?.remove();
  const open=id=>{items.forEach(([k])=>{const p=document.getElementById(k);const on=k===id;if(p)p.hidden=!on;const b=dock.querySelector(`[data-dock="${k}"]`);b.setAttribute("aria-expanded",on);b.classList.toggle("on",on)});dock.querySelector(".dk-hint").textContent=id?"Tap the sign again to close":"Tap a sign to open it";
    if(id){const p=document.getElementById(id);requestAnimationFrame(()=>p.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth",block:"start"}));if(id==="kitchen")renderKitchen();if(id==="pass")renderPasses()}};
  dock.querySelectorAll("[data-dock]").forEach(b=>b.addEventListener("click",()=>open(b.classList.contains("on")?null:b.dataset.dock)));
  // mac-style neighbour magnify
  const btns=[...dock.querySelectorAll(".dk-i")];btns.forEach((b,k)=>{b.addEventListener("mouseenter",()=>{btns.forEach((o,j)=>o.dataset.near=Math.abs(j-k)===1?"1":Math.abs(j-k)===0?"0":"")});});
  dock.querySelector(".dockbar").addEventListener("mouseleave",()=>btns.forEach(o=>o.dataset.near=""));
  window.openDock=open;
})();
(function(){const t=[...document.querySelectorAll('.shieldbox svg text')].find(x=>x.textContent==='INTERSTATE');if(t){t.setAttribute('textLength','48');t.setAttribute('lengthAdjust','spacingAndGlyphs');t.setAttribute('font-size','8.5')}})();
function renderExitTab(){const t=$("#exittab");if(!t)return;const L=dlabel(0);t.innerHTML=`<b>DEPART</b> ${L.dow.toUpperCase()} ${L.date.toUpperCase()}`}
function decorateDests(){const nav=$("#dests");if(!nav)return;nav.querySelectorAll("a").forEach((a,i)=>{if(a.querySelector(".darr"))return;const sp=a.querySelectorAll("span");const mi=sp[1];a.insertAdjacentHTML("afterbegin",`<span class="darr" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M10 17V4M4.5 9.5 10 4l5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="dday">${dlabel(i).dow.toUpperCase()}</span>`);if(mi&&!/mi/.test(mi.textContent))mi.textContent=mi.textContent+" mi"})}
const _rh=renderHeader;renderHeader=function(){_rh();decorateDests();renderExitTab()};
renderHeader();

/* ================= v9: clearer day header ================= */
function darkInfo(i){const d=PLAN[i];if(!d||!d.spot||d.sunset==null)return null;const sc=sleepCall(i),setup=sc&&sc.hotel?10:sc&&sc.cab?15:45;const need=(d.b-d.a)/MPH*60+(d.dwell||0);const latest=d.sunset-setup-need,start=toMin(S.starts[i]||"07:30");return{latest,slack:latest-start,setup,cab:sc&&sc.cab,act:sc&&sc.hotel?"check in":sc&&sc.cab?"settle in the cab":"pitch the tent"}}
function restructureHead(sec,i,d){const head=sec.querySelector(".dayhead");if(!head||head.classList.contains("v2"))return;head.classList.add("v2");
  const dnum=head.querySelector(".dnum"),h2=head.querySelector("h2"),dh=head.querySelector(".dh"),when=head.querySelector(".when");
  const inp=when.querySelector("input[type=time]"),nav=when.querySelector("a.nav"),ck=when.querySelector(".navb"),ckm=when.querySelector(".ckmsg");
  const hidden=document.createElement("div");hidden.hidden=true;[...when.querySelectorAll(".sunl,.arr,.dark")].forEach(e=>hidden.appendChild(e));
  const span=d.b-d.a;
  const top=document.createElement("div");top.className="dh2-top";top.append(dnum,h2);
  const chips=document.createElement("div");chips.className="dh2-chips";
  chips.innerHTML=`<span class="chip2"><b>${Math.round(span)}</b> mi</span><span class="chip2"><b>≈${hrs(span)}</b> driving</span>${S.straight?"":`<span class="chip2 lim${S.dayHours[i]!=null?" custom":""}">limit <b>${d.H} h</b>${S.dayHours[i]!=null?" (custom)":""}</span>`}${d.forced?`<span class="chip2 pb">Plan B stop</span>`:""}${d.over?`<span class="chip2 bad">Over your limit: no closer overnight spot</span>`:""}`;
  head.innerHTML="";head.append(top,chips);
  if(dh){const hm=dh.querySelector(`#hm${i}`),hp=dh.querySelector(`#hp${i}`),hr=dh.querySelector(`#hr${i}`);
    hm.className="step minus";hm.innerHTML=`<span class="sg" aria-hidden="true">−</span><span class="st"><b>Shorter day</b><small>${hm.disabled?"no earlier stop":"stop one camp sooner"}</small></span>`;
    hp.className="step plus";hp.innerHTML=`<span class="st"><b>Longer day</b><small>${hp.disabled?"last day":"reach the next camp"}</small></span><span class="sg" aria-hidden="true">+</span>`;
    const ctl=document.createElement("div");ctl.className="dh2-ctl";ctl.setAttribute("role","group");ctl.setAttribute("aria-label",`Change how far you drive on day ${i+1}`);
    ctl.innerHTML=`<span class="ctl-l">Adjust today</span>`;ctl.append(hm,hp);if(hr){hr.className="reset2";hr.textContent="↺ Back to default";ctl.append(hr)}head.append(ctl)}
  const tiles=document.createElement("div");tiles.className="dh2-tiles";
  tiles.innerHTML=`<div class="t2 leave"><label class="t2l" for="start${i}">Leave at</label><div class="t2v" id="t-leave${i}"></div></div>
    <div class="t2 arrive" id="t-arr${i}"><span class="t2l">Arrive</span><b class="t2v">–</b><small></small></div>
    <div class="t2 sun" id="t-sun${i}"><span class="t2l">Daylight</span><b class="t2v">–</b><small></small></div>
    ${d.spot&&!S.straight?`<div class="t2 dark" id="t-dark${i}"><span class="t2l">Camp by dark</span><b class="t2v">–</b><small></small></div>`:""}`;
  tiles.querySelector(`#t-leave${i}`).appendChild(inp);head.append(tiles);
  const act=document.createElement("div");act.className="dh2-act";nav.classList.add("act-btn","maps");ck.classList.add("act-btn","copy");act.append(nav,ck,ckm);head.append(act,hidden)}
function updateTiles(){PLAN.forEach((d,i)=>{const a=document.getElementById("t-arr"+i);if(!a||d.arrive==null)return;
  const end=ptOf(i,true),st=ptOf(i,false),dt=dateFor(i),sunE=sunTimes(dt,end.lat,end.lon),sunS=sunTimes(dt,st.lat,st.lon);
  const diff=d.sunset+1440*Math.floor(d.arrive/1440)-d.arrive;
  a.className="t2 arrive "+(S.straight?"late":diff>=30?"ok":diff>=0?"tight":"late");a.querySelector("b").textContent="≈"+fmtTime(d.arrive);
  a.querySelector("small").textContent=S.straight?"no sleep stops":diff>=0?`${Math.floor(diff/60)}h ${String(Math.round(diff%60)).padStart(2,"0")}m before dark`:"after sunset";
  const s=document.getElementById("t-sun"+i);s.querySelector("b").textContent=`${fmtTime(sunS.rise)} – ${fmtTime(sunE.set)}`;s.querySelector("small").textContent="sunrise here · sunset at tonight's stop";
  const k=document.getElementById("t-dark"+i),di=darkInfo(i);if(k&&di){k.className="t2 dark "+(di.slack>=30?"ok":di.slack>=0?"tight":"late");k.querySelector("b").textContent=`Leave by ${fmtTime(Math.max(0,di.latest))}`;k.querySelector("small").textContent=di.slack>=0?`${mmss(di.slack)} to spare · ${di.setup} min to ${di.act}`:`you'd set up in the dark · leave earlier or stop sooner`}})}
const _ade=addDayExtras;addDayExtras=function(){_ade();PLAN.forEach((d,i)=>{const sec=document.getElementById("day-"+(i+1));if(sec)restructureHead(sec,i,d)});updateTiles()};
const _etas2=etas;etas=function(){_etas2();updateTiles()};
renderDays();

/* ================= v10: mobile layout (phones only) ================= */
const MQ=matchMedia("(max-width: 760px)");
const MOB={on:false,built:false,moved:[],view:"trip"};
S.mday=store.get("mday",0);
const MI={
 trip:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M8 21 10 3M16 21 14 3M12 6v2M12 11v2M12 16v2"/></svg>`,
 map:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg>`,
 kitchen:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 4-3 7 0 2 1 3 3 3v8"/></svg>`,
 more:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg>`,
 sliders:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>`,
 layers:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 8l10 5 10-5z"/><path d="M2 13l10 5 10-5"/></svg>`
};
const TOOLICON={
 settings:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#0f6a46" stroke="#fff" stroke-width="3"/><path d="M18 22h28M18 32h28M18 42h28" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="38" cy="22" r="4.5" fill="#0f6a46" stroke="#fff" stroke-width="3"/><circle cx="26" cy="32" r="4.5" fill="#0f6a46" stroke="#fff" stroke-width="3"/><circle cx="40" cy="42" r="4.5" fill="#0f6a46" stroke="#fff" stroke-width="3"/></svg>`,
 chk:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#0f6a46" stroke="#fff" stroke-width="3"/><path d="M20 33l8 8 16-18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 pack:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#0f6a46" stroke="#fff" stroke-width="3"/><rect x="16" y="22" width="32" height="26" rx="4" fill="#fff"/><path d="M26 22v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" fill="none" stroke="#fff" stroke-width="3"/><path d="M16 32h32" stroke="#0f6a46" stroke-width="3"/></svg>`,
 exp:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#1d4f9c" stroke="#fff" stroke-width="3"/><text x="32" y="44" text-anchor="middle" font-family="Overpass,Arial" font-weight="900" font-size="32" fill="#fff">$</text></svg>`,
 pass:SIGNICON.pass,recap:SIGNICON.recap,sheet:SIGNICON.sheet,
 sos:`<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="5" width="54" height="54" rx="8" fill="#c2410c" stroke="#fff" stroke-width="3"/><path d="M32 16v32M16 32h32" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`
};
const TOOLS=[["settings","Trip settings"],["chk","Before you go"],["pack","Packing list"],["exp","Expenses"],["pass","Mountain passes"],["recap","Trip recap card"],["sheet","Offline trip sheet"],["sos","Emergency"]];
function mk(html){const t=document.createElement("template");t.innerHTML=html.trim();return t.content.firstElementChild}
function buildMobileShell(){if(MOB.built)return;MOB.built=true;
  const wrap=document.querySelector(".wrap");
  wrap.prepend(mk(`<div id="mviews">
    <section id="v-trip" class="mview" aria-label="Trip">
      <header class="mbar"><svg class="mshield" viewBox="0 0 74 78" aria-hidden="true"><path d="M6 10 Q37 0 68 10 L68 30 Q68 62 37 76 Q6 62 6 30Z" fill="#fff"/><path d="M9 12 Q37 3 65 12 L65 24 L9 24Z" fill="#c8102e"/><path d="M9 27 L65 27 L65 31 Q65 59 37 72 Q9 59 9 31Z" fill="#003f87"/><text x="37" y="61" text-anchor="middle" font-family="Overpass,Arial" font-weight="800" font-size="32" fill="#fff">5</text></svg>
        <div class="mbt"><div class="mbword">Road Pace Notes</div><div class="mbtitle" id="mb-title"></div><div class="mbsub" id="mb-sub"></div></div>
        <button type="button" class="mbset" data-sheet="settings" aria-label="Trip settings">${MI.sliders}</button></header>
      <nav class="mdays" id="mdays" aria-label="Pick a day"></nav>
      <div id="m-tripbody"></div>
    </section>
    <section id="v-map" class="mview" aria-label="Map" hidden></section>
    <section id="v-kitchen" class="mview" aria-label="Camp kitchen" hidden></section>
    <section id="v-more" class="mview" aria-label="Trip tools" hidden>
      <header class="mmore"><h1>Trip tools</h1><p>Each one opens full screen.</p></header>
      <div class="mtools" id="mtools">${TOOLS.map(([k,t])=>`<button type="button" class="mtool" data-sheet="${k}"><span class="mti">${TOOLICON[k]}</span><b>${t}</b><small id="mts-${k}"></small></button>`).join("")}</div>
      <div id="m-foot"></div>
    </section></div>`));
  document.body.appendChild(mk(`<nav class="mtabs" aria-label="Main">
    <button type="button" class="mtab" data-view="trip">${MI.trip}<span>Trip</span></button>
    <button type="button" class="mtab" data-view="map">${MI.map}<span>Map</span></button>
    <button type="button" class="mtab drive" data-view="drive" aria-label="Drive mode"><span class="dball"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><span>Drive</span></button>
    <button type="button" class="mtab" data-view="kitchen">${MI.kitchen}<span>Kitchen</span></button>
    <button type="button" class="mtab" data-view="more">${MI.more}<span>More</span></button></nav>`));
  const sh=document.createElement("div");sh.id="msheets";document.body.appendChild(sh);
  TOOLS.forEach(([k,t])=>sh.appendChild(mk(`<div class="msheet" id="ms-${k}" role="dialog" aria-modal="true" aria-labelledby="msh-${k}" hidden><header class="mshead"><button type="button" class="msback" data-close>‹ Back</button><h2 id="msh-${k}">${t}</h2><span></span></header><div class="msbody"></div></div>`)));
  document.querySelectorAll(".mtab").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.view;if(v==="drive"){openDrive();return}setView(v)}));
  document.addEventListener("click",e=>{const o=e.target.closest("[data-sheet]");if(o&&MOB.on){openSheet(o.dataset.sheet);return}
    if(e.target.closest("[data-close]")){closeSheets();return}
    if(!MOB.on)return;
    if(e.target.closest("#days [data-show]")||e.target.closest("#days .stop")&&!e.target.closest("a")||e.target.closest("#days .smark"))setTimeout(()=>setView("map"),0)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&MOB.on&&document.querySelector(".msheet:not([hidden])"))closeSheets()});
  // map tools
  const mv=$("#v-map");mv.appendChild(mk(`<button type="button" class="mlayers" id="m-layers" aria-label="Choose what the map shows" aria-expanded="false">${MI.layers}</button>`));
  $("#m-layers").addEventListener("click",()=>{const f=$("#filters");const on=!f.classList.contains("mopen");f.classList.toggle("mopen",on);$("#m-layers").setAttribute("aria-expanded",on)});
}
function moveInto(sel,parent){const el=typeof sel==="string"?document.querySelector(sel):sel;if(!el||!parent)return;const ph=document.createComment("m-home");el.before(ph);MOB.moved.push({el,ph,hidden:el.hidden});parent.appendChild(el);el.hidden=false}
function mobileOn(){if(MOB.on)return;buildMobileShell();MOB.on=true;document.body.classList.add("m");
  const body=k=>$(`#ms-${k} .msbody`);
  moveInto("#wxlive",$("#m-tripbody"));moveInto("#holiday",$("#m-tripbody"));moveInto("#days",$("#m-tripbody"));
  moveInto(".mapcard",$("#v-map"));moveInto("#filters",$("#v-map"));
  moveInto("#kitchen",$("#v-kitchen"));
  moveInto('section[aria-label="Route"]',body("settings"));moveInto(".tiles",body("settings"));moveInto('section[aria-labelledby="calc-h"]',body("settings"));
  moveInto('section[aria-labelledby="chk-h"]',body("chk"));moveInto('section[aria-labelledby="pack-h"]',body("pack"));moveInto('section[aria-labelledby="exp-h"]',body("exp"));
  moveInto(".roads",body("pass"));moveInto("#pass",body("pass"));moveInto("#recap",body("recap"));moveInto("#sheetp",body("sheet"));
  moveInto("footer",$("#m-foot"));
  setView(MOB.view);updateMobile()}
function mobileOff(){if(!MOB.on)return;closeSheets();MOB.on=false;document.body.classList.remove("m","m-sheet");delete document.body.dataset.view;
  MOB.moved.reverse().forEach(({el,ph,hidden})=>{ph.replaceWith(el);el.hidden=hidden});MOB.moved=[];
  $("#filters")?.classList.remove("mopen");document.querySelector(".mapcard")?.classList.remove("has-sel");setVB({...VB})}
function setView(v){MOB.view=v;document.body.dataset.view=v;["trip","map","kitchen","more"].forEach(k=>{const s=$("#v-"+k);if(s)s.hidden=k!==v});
  document.querySelectorAll(".mtab").forEach(b=>{if(b.dataset.view===v)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
  window.scrollTo(0,0);if(v==="map")requestAnimationFrame(()=>setVB({...VB}));if(v==="kitchen")renderKitchen();if(v==="more")updateTools()}
function openSheet(k){closeSheets(true);const s=$("#ms-"+k);if(!s)return;if(k==="sos")renderSOS();if(k==="pass")renderPasses();s.hidden=false;s.scrollTop=0;document.body.classList.add("m-sheet");s.querySelector(".msback").focus()}
function closeSheets(keep){document.querySelectorAll(".msheet").forEach(s=>s.hidden=true);if(!keep)document.body.classList.remove("m-sheet");if(MOB.view==="more")updateTools()}
function renderSOS(){const b=$("#ms-sos .msbody");b.innerHTML=`<section class="panel sp sp-sos"><ul class="msos"><li><a class="mcall" href="tel:911"><b>911</b><span>Emergencies. Works with weak signal on any carrier.</span></a></li>${R.hi>OR_LINE?`<li><a class="mcall" href="tel:*677"><b>*677</b><span>Oregon State Police, non-emergency road help.</span></a></li>`:""}<li><a class="mcall" href="tel:18002224357"><b>AAA</b><span>1-800-222-4357, if you're a member.</span></a></li></ul>
  ${PLAN.map((d,i)=>{const hs=hospFor(d);return `<h3 class="msosh">Day ${i+1} · ${esc(dlabel(i).dow)} · near ${esc(ptOf(i,true).name)}</h3><ul class="msos">${hs.map(([n,t])=>`<li><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join("")||`<li><span>Call 911.</span></li>`}</ul>`}).join("")}</section>`}
function updateTools(){const set=(k,t)=>{const e=$("#mts-"+k);if(e)e.textContent=t};
  set("settings",`${S.hours} h a day · ${S.mpg} mpg`);set("chk",$("#chk-n")?.textContent||"");set("pack",$("#pack-n")?.textContent||"");
  const spent=S.expenses.reduce((t,e)=>t+e.amt,0);set("exp",`$${Math.round(spent)} of ≈$${Math.round(EST.gas+EST.camp+EST.food)} planned`);
  const ps=PASSES.filter(p=>R.inR(p.g)),bad=ps.filter(p=>passVerdict(p,S.passLv[p.n]||"clear")[0]!=="go").length;set("pass",bad?`${bad} need${bad>1?"":"s"} attention`:`All ${ps.length} clear`);
  set("recap","Make it when you're home");set("sheet","Copy before dead zones");set("sos","Nearest ER, 911"+(R.hi>OR_LINE?", *677":""))}
function updateMobile(){if(!MOB.on)return;const L0=dlabel(0),L1=dlabel(PLAN.length-1);
  $("#mb-title").textContent=`${S.from} → ${S.to}`;$("#mb-sub").textContent=`${L0.dow} ${L0.date} – ${L1.dow} ${L1.date} · ${PLAN.length} day${PLAN.length>1?"s":""} · ≈$${Math.round(EST.gas+EST.camp+EST.food)}`;
  if(S.mday>=PLAN.length)S.mday=PLAN.length-1;if(S.mday<0)S.mday=0;
  const nav=$("#mdays");nav.innerHTML=PLAN.map((d,i)=>{const L=dlabel(i);return `<button type="button" class="mdc" data-mday="${i}" aria-pressed="${i===S.mday}"><span class="k">${L.dow} ${L.date.split(" ")[1]}</span><b>${esc(ptOf(i,true).name)}</b><small>${Math.round(d.b-d.a)} mi</small></button>`}).join("");
  nav.querySelectorAll("[data-mday]").forEach(b=>b.addEventListener("click",()=>{setMDay(+b.dataset.mday);window.scrollTo(0,0)}));
  applyMDay();updateTools()}
function setMDay(i){S.mday=Math.max(0,Math.min(PLAN.length-1,i));store.set("mday",S.mday);applyMDay()}
function applyMDay(){document.querySelectorAll("#days > .day").forEach((s,i)=>s.classList.toggle("mcur",i===S.mday));document.querySelectorAll("#mdays [data-mday]").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.mday===S.mday));
  const cur=$(`#mdays [data-mday="${S.mday}"]`);if(cur&&MOB.on)cur.scrollIntoView({block:"nearest",inline:"center"})}
function mobileDayExtras(){PLAN.forEach((d,i)=>{const sec=document.getElementById("day-"+(i+1));if(!sec||sec.querySelector(".mtonight,.mdaynav"))return;
  const head=sec.querySelector(".dayhead");
  if(d.spot){const sp=SPOTS[d.spot],cat=sp[2],sc=sleepCall(i),tr=TRACK[i];
    const kind=cat==="free"?"free · dispersed":cat==="camp"?`paid campground${sp[5]?` · ≈$${sp[5]}`:""}`:"rest area · sleep in the truck";
    head.insertAdjacentHTML("afterend",`<section class="mtonight monly" aria-label="Tonight"><div class="mtt"><span class="k">Tonight</span><span>${esc(kind)}</span></div><b class="mtn">${esc(sp[3])}</b>
      <div class="mtchips"><span>${nightLow(d)}°F low</span>${sc?`<button type="button" class="mtchip" data-sleepjump="${i}">${sc.hotel?"Hotel night":sc.cab?"Sleep in the cab":"Pitch the tent"} ▾</button>`:""}${tr&&!tr.end?`<span>Anker ${Math.round(tr.bed)} → ${Math.round(tr.morning)}%</span>`:""}</div>
      <div class="mtbtns"><a class="mtgo" href="https://www.google.com/maps/dir/?api=1&destination=${sp[6]},${sp[7]}" target="_blank" rel="noopener">Navigate</a><button type="button" class="mtck" data-ck="${i}">Send check-in</button></div></section>`)}
  else head.insertAdjacentHTML("afterend",`<section class="mtonight monly arrive" aria-label="Arrival"><div class="mtt"><span class="k">Arriving</span><span>destination</span></div><b class="mtn">${esc(S.to)}</b><div class="mtbtns"><a class="mtgo" href="https://www.google.com/maps/dir/?api=1&destination=${R.dest.lat},${R.dest.lon}" target="_blank" rel="noopener">Navigate</a><button type="button" class="mtck" data-ck="${i}">Send check-in</button></div></section>`);
  const ck=sec.querySelector("[data-ck]");ck.addEventListener("click",async()=>{const t=checkinText(i);if(navigator.share){try{await navigator.share({text:t});return}catch(e){if(e&&e.name==="AbortError")return}}document.getElementById("ck"+i)?.click();ck.textContent="Copied";setTimeout(()=>ck.textContent="Send check-in",1800)});
  sec.querySelectorAll(".infobar .ib").forEach(ib=>{ib.tabIndex=0;ib.setAttribute("role","button");ib.setAttribute("aria-expanded","false");const tog=e=>{if(!MOB.on||e.target.closest("button,a,select,input"))return;const o=!ib.classList.contains("open");ib.classList.toggle("open",o);ib.setAttribute("aria-expanded",o)};ib.addEventListener("click",tog);ib.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();tog(e)}})});
  const opts=[...sec.querySelectorAll(".stops > li")].filter(li=>li.querySelector(".opt"));opts.forEach(li=>li.classList.add("isopt"));
  if(opts.length){const b=document.createElement("button");b.type="button";b.className="mopt monly";b.textContent=`Show ${opts.length} optional stop${opts.length>1?"s":""}`;b.setAttribute("aria-expanded","false");sec.querySelector(".stops").after(b);b.addEventListener("click",()=>{const o=!sec.classList.contains("showopt");sec.classList.toggle("showopt",o);b.setAttribute("aria-expanded",o);b.textContent=o?"Hide optional stops":`Show ${opts.length} optional stop${opts.length>1?"s":""}`})}
  sec.insertAdjacentHTML("beforeend",`<nav class="mdaynav monly" aria-label="Other days">${i>0?`<button type="button" data-go="${i-1}">‹ Day ${i}</button>`:"<span></span>"}${i<PLAN.length-1?`<button type="button" data-go="${i+1}">Day ${i+2} ›</button>`:"<span></span>"}</nav>`);
  sec.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>{setMDay(+b.dataset.go);window.scrollTo(0,0)}))})}
const _rd10=renderDays;renderDays=function(){_rd10();mobileDayExtras();applyMDay()};
const _rb10=rebuild;rebuild=function(){_rb10();updateMobile()};
const _sel10=select;select=function(id,src){_sel10(id,src);const mc=document.querySelector(".mapcard");if(mc)mc.classList.toggle("has-sel",!!selId);if(MOB.on&&selId){const dt=$("#detail");if(dt&&!dt.querySelector(".mclose"))dt.insertAdjacentHTML("afterbegin",`<button type="button" class="mclose" aria-label="Close stop details">✕</button>`);dt.querySelector(".mclose").onclick=()=>clearSel();
    let la,lo;if(id.startsWith("sp-")){const p=SPOTS[id.slice(3)];la=p[6];lo=p[7]}else{const p=STOPS[+id.slice(2)];if(p){la=p[5];lo=p[6]}}
    const li=listItems[id],sec=li&&li.closest(".day"),di=sec?+sec.id.slice(4)-1:-1;const go=$("#dgo");
    if(go){const n=go.cloneNode(false);n.textContent=di>=0?`See in Day ${di+1}`:"Center on map";go.replaceWith(n);n.addEventListener("click",()=>{if(di>=0){setMDay(di);setView("trip");requestAnimationFrame(()=>{li.scrollIntoView({block:"center"});li.focus({preventScroll:true})})}else centerOn(la,lo)});
      if(la!=null)n.insertAdjacentHTML("beforebegin",`<a class="mnav" href="https://www.google.com/maps/dir/?api=1&destination=${la},${lo}" target="_blank" rel="noopener">Navigate</a>`)}}};
const _cs10=clearSel;clearSel=function(){_cs10();document.querySelector(".mapcard")?.classList.remove("has-sel")};
const _sd10=selectDay;selectDay=function(n,zoom,noScroll){_sd10(n,zoom,MOB.on?true:noScroll);if(MOB.on&&n>0&&MOB.view==="map"){S.mday=n-1;store.set("mday",S.mday);applyMDay()}};
mobileDayExtras();
if(MQ.matches)mobileOn();
MQ.addEventListener("change",e=>e.matches?mobileOn():mobileOff());

/* ================= v11: drive mode redesign ================= */
S.dvNight=store.get("dvNight","auto");
const DVI={
 pump:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/><path d="M8 7h4v4H8z"/></svg>`,
 rest:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 19h16M6 19v-5h12v5M8 14V9h8v5M12 9V5"/></svg>`,
 tent:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 3 20h18z"/><path d="M12 4v16M9 20l3-6 3 6"/></svg>`,
 mtn:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 20 9 8l4 6 3-4 6 10z"/></svg>`,
 play:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>`,
 stop:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`,
 skip:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5v14l9-7zM15 5h3v14h-3z"/></svg>`,
 moon:`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4a8.5 8.5 0 1 0 11.5 11.5z"/></svg>`,
 gps:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
 x:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`
};
function restyleDrive(){const o=$("#drive");if(!o||o.classList.contains("v2"))return;o.classList.add("v2");
  const keep=document.createElement("div");keep.hidden=true;keep.className="dv-old";
  const wrap=mk(`<div class="dv2">
   <header class="dv2-top"><div class="dv2-day"></div><button type="button" class="dv2-ib" id="dv-night" aria-label="Night mode">${DVI.moon}<span id="dv-night-l"></span></button><button type="button" class="dv2-ib dv2-x" id="dv2-exit" aria-label="Exit drive mode">${DVI.x}</button></header>
   <div class="dv2-main"><div class="dv2-map"></div>
   <div class="dv2-side">
   <section class="dv2-hero" aria-label="Today's progress">
     <svg class="dv2-ring" viewBox="0 0 120 120" role="img" aria-labelledby="dv2-ringt"><title id="dv2-ringt">Miles driven today</title><circle cx="60" cy="60" r="50" class="trk"/><circle cx="60" cy="60" r="50" class="arc" id="dv2-arc" stroke-dasharray="314.16" stroke-dashoffset="314.16"/><text x="60" y="58" text-anchor="middle" class="big" id="dv2-mi">0</text><text x="60" y="78" text-anchor="middle" class="sm" id="dv2-of">of 0 mi</text></svg>
     <div class="dv2-arr"><span class="lab">Arrive</span><b id="dv2-arrive">–</b><span id="dv2-tonight" class="tn"></span>
       <svg class="dv2-sun" viewBox="0 0 200 64" role="img" aria-labelledby="dv2-sunt"><title id="dv2-sunt">Daylight</title><path d="M10 58 A90 50 0 0 1 190 58" class="sky"/><path id="dv2-lit" d="M10 58 A90 50 0 0 1 190 58" class="lit"/><circle id="dv2-arrdot" r="5" class="arrdot"/><circle id="dv2-sundot" r="7" class="sundot"/><text x="10" y="64" class="t" id="dv2-rise"></text><text x="190" y="64" text-anchor="end" class="t" id="dv2-set"></text></svg>
       <span id="dv2-sunmsg" class="sunmsg"></span></div>
   </section>
   <section class="dv2-cards" id="dv2-cards" aria-label="Next up, swipe for more">
     <article class="sg gas"><div class="tabx">NEXT GAS</div><div class="sgb"><span class="sgi">${DVI.pump}</span><div><b id="dv2-gas">–</b><span id="dv2-gas2"></span></div></div></article>
     <article class="sg rest"><div class="tabx">REST AREA</div><div class="sgb"><span class="sgi">${DVI.rest}</span><div><b id="dv2-rest">–</b><span id="dv2-rest2"></span></div></div></article>
     <article class="sg camp"><div class="tabx" id="dv2-campt">TONIGHT</div><div class="sgb"><span class="sgi">${DVI.tent}</span><div><b id="dv2-camp">–</b><span id="dv2-camp2"></span></div></div></article>
     <article class="sg pass" id="dv2-passc"><div class="tabx">NEXT PASS</div><div class="sgb"><span class="sgi dia">${DVI.mtn}</span><div><b id="dv2-pass">–</b><span id="dv2-pass2"></span></div></div></article>
   </section>
   <div class="dv2-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
   <section class="dv2-radio" aria-label="Mile-marker stories"><button type="button" class="rbtn" id="dv2-play" aria-label="Play this story">${DVI.play}</button><div class="rtxt"><span class="lab" id="dv2-rlab">Coming up</span><b id="dv2-rt">–</b><span id="dv2-rs"></span></div><button type="button" class="rbtn sm" id="dv2-skip" aria-label="Next story">${DVI.skip}</button></section>
   <div class="dv2-foot"></div>
   </div></div></div>`);
  o.prepend(wrap);
  // move live pieces
  wrap.querySelector(".dv2-day").appendChild($("#dv-day"));
  wrap.querySelector(".dv2-map").append($("#dv-mapin"),$("#drive .dv-mz"));
  const foot=wrap.querySelector(".dv2-foot");const gps=$("#dv-gps");gps.innerHTML=`${DVI.gps}<span>Use my GPS</span>`;const voice=$("#dv-voice");voice.textContent="Auto-play stories";
  foot.append(gps,voice,$("#dv-msg"));const det=mk(`<details class="dv2-prev"><summary>Preview another spot on the route</summary></details>`);det.appendChild($(".dv-sim"));foot.appendChild(det);
  [...o.children].forEach(c=>{if(c!==wrap)keep.appendChild(c)});o.appendChild(keep);
  $("#dv2-exit").addEventListener("click",closeDrive);
  $("#dv-night").addEventListener("click",()=>{S.dvNight={auto:"on",on:"off",off:"auto"}[S.dvNight];store.set("dvNight",S.dvNight);applyNight()});
  const cards=$("#dv2-cards"),dots=[...o.querySelectorAll(".dv2-dots i")];const upd=()=>{const w=cards.firstElementChild.getBoundingClientRect().width+10;const k=Math.round(cards.scrollLeft/w);dots.forEach((d,j)=>d.classList.toggle("on",j===k))};cards.addEventListener("scroll",upd,{passive:true});upd();
  $("#dv2-play").addEventListener("click",()=>{if(window.speechSynthesis&&speechSynthesis.speaking){speechSynthesis.cancel();setPlay(false);return}const f=DRV.rf;if(!f)return;if(speak(`${f.t}. ${f.s}`)){setPlay(true);const iv=setInterval(()=>{if(!speechSynthesis.speaking){setPlay(false);clearInterval(iv)}},400)}});
  $("#dv2-skip").addEventListener("click",()=>{const fs=dvFacts();const cur=DRV.rf?fs.findIndex(f=>f.t===DRV.rf.t):-1;DRV.ri=Math.min(fs.length-1,cur+1);if(window.speechSynthesis)speechSynthesis.cancel();setPlay(false);renderRadio(DRV.x)});
}
function setPlay(on){const b=$("#dv2-play");if(!b)return;b.innerHTML=on?DVI.stop:DVI.play;b.setAttribute("aria-label",on?"Stop the story":"Play this story")}
function dvFacts(){return TOUR.filter(f=>R.inR(f[0])).map(f=>({x:R.L(f[0]),t:f[1],s:f[2]})).sort((a,b)=>a.x-b.x)}
function renderRadio(x){const fs=dvFacts();let f;if(DRV.ri!=null&&fs[DRV.ri])f=fs[DRV.ri];else f=fs.find(q=>q.x>=x-1.5);DRV.rf=f||null;
  if(!f){$("#dv2-rt").textContent="No more stories today";$("#dv2-rs").textContent="";$("#dv2-rlab").textContent="Stories";return}
  const dmi=f.x-x;$("#dv2-rlab").textContent=dmi<1.5&&dmi>-1.5?"Now":dmi<0?"Earlier":`In ${Math.round(dmi)} mi`;$("#dv2-rt").textContent=f.t;$("#dv2-rs").textContent=f.s}
function applyNight(auto){const o=$("#drive");if(!o)return;const on=S.dvNight==="on"||(S.dvNight==="auto"&&!!auto);o.classList.toggle("night",on);const l=$("#dv-night-l");if(l)l.textContent={auto:"Auto",on:"On",off:"Off"}[S.dvNight];DRV.nightAuto=auto}
function arcPt(f){const a=Math.PI*(1-Math.max(0,Math.min(1,f)));return[100+90*Math.cos(a),58-50*Math.sin(a)]}
function driveV2(x,pos){if(!$("#drive.v2"))return;const i=dayOf(x),d=PLAN[i],span=d.b-d.a||1,done=Math.max(0,Math.min(span,x-d.a));
  $("#dv2-mi").textContent=Math.round(done);$("#dv2-of").textContent=`of ${Math.round(span)} mi`;$("#dv2-arc").setAttribute("stroke-dashoffset",(314.16*(1-done/span)).toFixed(1));
  const here=pos||{lat:routeAt(R.G(x))[0],lon:routeAt(R.G(x))[1]};
  const now=new Date(),t=pos?now.getHours()*60+now.getMinutes():etaAt(i,x)%1440;const arrive=t+(d.b-x)/MPH*60+(d.dwell||0)*((d.b-x)/span);
  const sun=sunTimes(pos?now:dateFor(i),here.lat,here.lon);const dayLen=sun.set-sun.rise;
  $("#dv2-arrive").textContent=d.b-x<0.5?"Here":"≈"+fmtTime(arrive);$("#dv2-tonight").textContent=d.spot?`at ${shortName(d.spot)} · ${nightLow(d)}°F low`:`in ${S.to}`;
  const fs=(t-sun.rise)/dayLen,fa=(arrive-sun.rise)/dayLen;const[sx,sy]=arcPt(fs),[ax,ay]=arcPt(fa);
  const sd=$("#dv2-sundot");sd.setAttribute("cx",sx.toFixed(1));sd.setAttribute("cy",sy.toFixed(1));sd.classList.toggle("down",fs<0||fs>1);
  const ad=$("#dv2-arrdot");ad.setAttribute("cx",ax.toFixed(1));ad.setAttribute("cy",ay.toFixed(1));
  const[lx,ly]=arcPt(Math.min(1,Math.max(0,fs)));$("#dv2-lit").setAttribute("d",`M10 58 A90 50 0 0 1 ${lx.toFixed(1)} ${ly.toFixed(1)}`);
  $("#dv2-rise").textContent=fmtTime(sun.rise).replace(" AM","a").replace(" PM","p");$("#dv2-set").textContent=fmtTime(sun.set).replace(" AM","a").replace(" PM","p");
  const left=sun.set-t,margin=sun.set-arrive;const sm=$("#dv2-sunmsg");sm.className="sunmsg "+(margin>=45?"ok":margin>=0?"tight":"late");
  sm.textContent=left<=0?"After sunset":d.b-x<0.5?`${mmss(left)} of light left`:margin>=0?`Arrive ${mmss(margin)} before dark`:`Arrive ${mmss(-margin)} after dark`;
  applyNight(t>sun.set+10||t<sun.rise-10);
  const mins=m=>m<1?"Here now":`${Math.round(m)} mi · ≈${hrs(m)}`;
  const gas=nextThing(x,R.stops.filter(s=>s.cat==="costco"||s.cat==="fuel").map(s=>({x:s.local,n:s.name})));const tank=Math.max(0,FUEL.tankAt(x));
  $("#dv2-gas").textContent=gas?gas.n.replace(/ \(.*\)|, .*/,""):"No more planned";$("#dv2-gas2").textContent=gas?`${mins(gas.x-x)} · tank ≈${tank.toFixed(0)} gal`:`Tank ≈${tank.toFixed(0)} gal`;
  const rest=nextThing(x,R.spots.filter(s=>s.cat==="truck").map(s=>({x:s.local,n:SPOTS[s.id][3]})));$("#dv2-rest").textContent=rest?rest.n.replace(/ rest area.*| \(.*\)/i,""):"None ahead";$("#dv2-rest2").textContent=rest?mins(rest.x-x):"";
  $("#dv2-campt").textContent=d.spot?"TONIGHT":"DESTINATION";$("#dv2-camp").textContent=d.spot?shortName(d.spot):S.to;$("#dv2-camp2").textContent=`${mins(d.b-x)}${d.spot?` · ${nightLow(d)}°F`:""}`;
  const ps=nextThing(x,PASSES.filter(p=>R.inR(p.g)).map(p=>({x:R.L(p.g),n:p.n,p})));const pc=$("#dv2-passc");
  if(ps){const[k,v]=passVerdict(ps.p,S.passLv[ps.n]||"clear");$("#dv2-pass").textContent=ps.n.replace(/ \(.*\)/,"");$("#dv2-pass2").textContent=`${mins(ps.x-x)} · ${v}`;pc.className="sg pass "+k}else{$("#dv2-pass").textContent="None ahead";$("#dv2-pass2").textContent="";pc.className="sg pass"}
  if(DRV.lastV2!=null&&Math.abs(x-DRV.lastV2)>2)DRV.ri=null;DRV.lastV2=x;renderRadio(x)}
const _od11=openDrive;openDrive=async function(){const r=_od11();if(!$("#drive.v2")){restyleDrive();requestAnimationFrame(()=>updDriveMap(DRV.x,null))}driveV2(DRV.x,null);applyNight(DRV.nightAuto);return r};
const _da11=driveAt;driveAt=function(x,pos){_da11(x,pos);driveV2(x,pos)};

/* ================= v12: live NWS refresh (works when the page can reach weather.gov) ================= */
let LIVE=store.get("liveWx",null);// {at, pts:{key:{periods:[...]}}}
const lkey=(la,lo)=>`${(+la).toFixed(3)},${(+lo).toFixed(3)}`;
const ymd=dt=>`${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`;
function livePeriods(la,lo){return LIVE&&LIVE.pts&&LIVE.pts[lkey(la,lo)]?LIVE.pts[lkey(la,lo)]:null}
function liveFor(la,lo,dt){const ps=livePeriods(la,lo);if(!ps)return null;const day=ymd(dt);const D=ps.find(p=>p.d===day&&p.day),N=ps.find(p=>p.d===day&&!p.day);if(!D&&!N)return null;return{hi:D?D.t:null,lo:N?N.t:null,pop:Math.max(D?D.pop||0:0,N?N.pop||0:0),short:(D||N).s,nshort:N?N.s:"",wind:(N||D).w}}
const _nl12=nightLow;nightLow=function(d){if(d&&d.spot){const sp=SPOTS[d.spot],i=PLAN.indexOf(d);if(i>=0){const L=liveFor(sp[6],sp[7],dateFor(i));if(L&&L.lo!=null)return L.lo}}return _nl12(d)};
const _nr12=nightRain;nightRain=function(d){if(d&&d.spot){const sp=SPOTS[d.spot],i=PLAN.indexOf(d);if(i>=0){const L=liveFor(sp[6],sp[7],dateFor(i));if(L)return(L.pop||0)>=50||/rain|showers|snow/i.test(L.nshort)}}return _nr12(d)};
function wxIcon(s){return /snow|sleet|ice|freez/i.test(s)?"cold":/rain|shower|drizzle|storm/i.test(s)?"rain":/sunny|clear/i.test(s)&&!/partly|mostly cloudy/i.test(s)?"sun":"part"}
function applyLiveWx(){if(!LIVE)return;PLAN.forEach((d,i)=>{const sec=document.getElementById("day-"+(i+1));if(!sec)return;const wx=R.wx.filter(x=>x.local>=d.a-5&&x.local<=d.b+5);const cards=sec.querySelectorAll(".wxrow .wxc");let any=0;
  wx.forEach(({w,local},k)=>{const c=cards[k];if(!c)return;const L=liveFor(w[5],w[6],dateFor(i));if(!L)return;any++;c.classList.add("live");c.classList.remove("typ");
    const ic=c.querySelector("svg");if(ic)ic.outerHTML=WXI[wxIcon(L.short)];const sm=c.querySelector(".pl small");if(sm)sm.textContent=`mi ${Math.max(0,Math.round(local-d.a))} · NWS forecast`;
    const tp=c.querySelector(".tp");if(tp)tp.innerHTML=`${L.hi??"–"}° / ${L.lo??"–"}° <span>${L.pop||0}% precip</span>`;
    let tip=c.querySelector(".tip");if(!tip){tip=document.createElement("div");tip.className="tip";c.querySelector(".tp").after(tip)}tip.textContent=`${L.short}${L.nshort&&L.nshort!==L.short?` · night: ${L.nshort}`:""}${L.wind?` · wind ${L.wind}`:""}`});
  const h=sec.querySelector(".wxhead");if(h&&any)h.textContent=`Weather · NWS forecast, updated ${new Date(LIVE.at).toLocaleString("en-US",{weekday:"short",hour:"numeric",minute:"2-digit"})}${any<wx.length?" · others typical":""}`})}
function liveTargets(){const m=new Map();R.wx.forEach(({w})=>m.set(lkey(w[5],w[6]),[w[5],w[6],w[1]]));PLAN.forEach(d=>{if(d.spot){const sp=SPOTS[d.spot];m.set(lkey(sp[6],sp[7]),[sp[6],sp[7],sp[3]])}});return[...m.values()]}
async function nwsFetch(url){const r=await fetch(url,{headers:{Accept:"application/geo+json"}});if(!r.ok)throw new Error("HTTP "+r.status);return r.json()}
async function refreshLive(){const btn=$("#wx-go"),msg=$("#wx-msg");if(!btn)return;btn.disabled=true;btn.classList.add("busy");msg.textContent="Getting forecasts from weather.gov…";
  const tg=liveTargets(),pts={...(LIVE&&LIVE.pts||{})};let ok=0,fail=0,blocked=false;const fcache=store.get("nwsPts",{});
  const one=async([la,lo])=>{const k=lkey(la,lo);try{let fu=fcache[k];if(!fu){const p=await nwsFetch(`https://api.weather.gov/points/${(+la).toFixed(4)},${(+lo).toFixed(4)}`);fu=p.properties&&p.properties.forecast;if(!fu)throw new Error("no forecast");fcache[k]=fu}
      const f=await nwsFetch(fu);pts[k]=(f.properties.periods||[]).map(p=>({d:p.startTime.slice(0,10),day:!!p.isDaytime,t:p.temperatureUnit==="C"?Math.round(p.temperature*9/5+32):p.temperature,pop:p.probabilityOfPrecipitation?p.probabilityOfPrecipitation.value||0:0,s:p.shortForecast||"",w:p.windSpeed||""}));ok++;msg.textContent=`Getting forecasts… ${ok} of ${tg.length}`}
    catch(e){fail++;if(e instanceof TypeError)blocked=true}};
  for(let j=0;j<tg.length;j+=4){await Promise.all(tg.slice(j,j+4).map(one));if(blocked&&!ok)break}
  store.set("nwsPts",fcache);btn.disabled=false;btn.classList.remove("busy");
  if(!ok){msg.textContent=blocked?"Can't reach weather.gov from here. Inside claude.ai the page isn't allowed online; open your downloaded copy of the page and tap Refresh there.":"weather.gov didn't answer. Try again in a minute.";renderLiveBar(true);return}
  LIVE={at:Date.now(),pts};store.set("liveWx",LIVE);rebuild();renderLiveBar();
  const far=PLAN.some((d,i)=>{const sp=d.spot?SPOTS[d.spot]:null;return sp&&!liveFor(sp[6],sp[7],dateFor(i))});
  $("#wx-msg").textContent=`Updated ${ok} place${ok>1?"s":""}${fail?`, ${fail} didn't answer`:""}.${far?" Nights beyond the 7-day forecast still use typical lows.":""} Lows, tent-or-cab calls and battery advice now use the forecast.`}
function renderLiveBar(keepMsg){let b=$("#wxlive");if(!b){const wasM=MOB.on;if(wasM)mobileOff();b=document.createElement("div");b.id="wxlive";b.className="wxlive";b.setAttribute("aria-label","Live conditions");document.querySelector(".roads").after(b);if(wasM){mobileOn()}}
  const age=LIVE?Math.round((Date.now()-LIVE.at)/36e5):null;const msg=keepMsg?($("#wx-msg")?.textContent||""):"";
  b.innerHTML=`<div class="wxl-t"><b>${LIVE?"Weather: NWS forecast":"Weather: typical for late November"}</b><span>${LIVE?`updated ${new Date(LIVE.at).toLocaleString("en-US",{weekday:"short",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}${age>=12?` · ${age} h old, refresh before you go`:""}`:"Tap refresh to pull the latest National Weather Service forecast for every stop."}</span></div>
  <button type="button" class="btn wxl-b" id="wx-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>Refresh conditions</button>${LIVE?`<button type="button" class="linkb" id="wx-clear">Use typical</button>`:""}<p class="wxl-m" id="wx-msg" aria-live="polite">${esc(msg)}</p>`;
  $("#wx-go").addEventListener("click",refreshLive);const c=$("#wx-clear");if(c)c.addEventListener("click",()=>{LIVE=null;store.set("liveWx",null);rebuild();renderLiveBar()})}
const _ade12=addDayExtras;addDayExtras=function(){_ade12();applyLiveWx()};
renderLiveBar();if(LIVE){rebuild()}

/* ================= v14: Tonight chooser (tent / cab / hotel) ================= */
// Hotel prices: Expedia listings checked Nov 15, 2026 (nightly, before taxes; each hotel's sample date shown).
const HOTELS={
 A1:{town:"Coalinga / Santa Nella",q:"hotels in Coalinga, CA",lo:80,hi:135,list:[["Sun Star Inn, Los Banos",80,"Nov 16"],["Motel 6 Santa Nella, on I-5",87,"Nov 16"],["Motel 6 Coalinga East",89,"Nov 16"],["Baymont by Wyndham Coalinga",97,"Nov 26"],["Best Western Plus Coalinga Inn",131,"Nov 21"]]},
 A2:{town:"Williams",q:"hotels in Williams, CA",lo:60,hi:115,list:[["SureStay by Best Western Williams",60,"Nov 21"],["Motel 6 Williams",65,"Nov 16"],["Stage Stop Inn",78,"Dec 16"],["Granzella's Inn",114,"Dec 3"]]},
 A3:{town:"Red Bluff / Corning",q:"hotels in Red Bluff, CA",lo:50,hi:70,list:[["Rodeway Inn Red Bluff I-5",51,"Dec 6"],["Travelodge by Wyndham Red Bluff",60,"Nov 16"],["Econo Lodge Inn & Suites Corning",68,"Dec 5"]]},
 A4:{town:"Weed / Mt. Shasta",q:"hotels in Weed, CA",lo:80,hi:155,list:[["Hi-Lo Motel, Weed",89,"Nov 16"],["Strawberry Valley Inn, Mt. Shasta",98,"Nov 19"],["Comfort Inn Mount Shasta Area",113,"Nov 29"],["Best Western Plus Tree House",155,"Nov 16"]]},
 A5:{town:"Medford / Central Point",q:"hotels in Medford, OR",lo:65,hi:110,list:[["Pine Tree Inn, Medford",66,"Dec 16"],["Signature Inn Medford Downtown",68,"Nov 22"],["Rodeway Inn Medford South I-5",74,"Dec 5"],["Super 8 Central Point Medford",83,"Oct 26"],["La Quinta Central Point",107,"Oct 5"]]},
 A6:{town:"Roseburg",q:"hotels in Roseburg, OR",lo:50,hi:80,list:[["Rosewood Inn and Suites",47,"Nov 17"],["Motel 6 Sutherlin",56,"Dec 1"],["Super 8 Roseburg",70,"Nov 29"],["Best Western Garden Villa Inn",76,"Nov 22"]]},
 A7:{town:"Woodburn / Salem / Wilsonville",q:"hotels in Woodburn, OR",lo:80,hi:105,list:[["La Quinta Woodburn",78,"Dec 6"],["Best Western Premier Keizer/Salem",92,"Nov 22"],["La Quinta Salem",93,"Nov 18"],["Holiday Inn Wilsonville (I-5 S)",97,"Nov 22"]]},
 A8:{town:"The Dalles",q:"hotels in The Dalles, OR",lo:70,hi:100,list:[["Super 8 The Dalles",70,"Dec 15"],["Motel 6 The Dalles",74,"Nov 16"],["Celilo Inn",90,"Dec 16"],["Comfort Inn Columbia Gorge",98,"Dec 13"]]},
 A9:{town:"Boardman / Hermiston",q:"hotels in Boardman, OR",lo:70,hi:90,list:[["Rodeway Inn Boardman",71,"Dec 13"],["Hermiston Inn & Suites",73,"Nov 19"],["Motel 6 Hermiston",76,"Nov 16"],["Knights Inn Boardman",77,"Nov 20"]]},
 R1:{town:"Buttonwillow",q:"hotels in Buttonwillow, CA"},R2:{town:"Patterson / Westley",q:"hotels near Westley, CA"},R3:{town:"Redding",q:"hotels in Redding, CA"},R4:{town:"Redding",q:"hotels in Redding, CA"},
 R5:{town:"Yreka",q:"hotels in Yreka, CA",lo:50,hi:90,list:[["Motel 6 Yreka",52,"Nov 23"]]},R6:{ref:"A5"},R7:{ref:"A5"},R8:{town:"Cottage Grove",q:"hotels in Cottage Grove, OR"},R9:{town:"Eugene / Albany",q:"hotels near Albany, OR"}
};
const CAMPNOTES={
 A1:[["San Luis Reservoir SRA (Basalt)","Temporarily closed for a dam safety project. Call 209-826-1197 before counting on it.","closed"]],
 A3:[["Woodson Bridge SRA, Corning","Closed October 1 – March 31.","closed"]],
 A4:[["Castle Crags State Park","Main campground loops and Riverside close in winter; the whole park can close in storms.","closed"]],
 A8:[["Deschutes River SRA, near Biggs","Open in winter: A-Loop electric sites (tents OK), first come, first served. Water off; showers and flush toilets closed Nov 1 – Mar 31.","open"]]
};
S.sleep=store.get("sleep",{});S.tentKind={};
function hotelFor(d){if(!d||!d.area)return null;let H=HOTELS[d.area];if(H&&H.ref)H=HOTELS[H.ref];return H||null}
function gHotels(H,dt){return `https://www.google.com/travel/search?q=${encodeURIComponent(H.q+" "+dt.toLocaleString("en-US",{month:"short",day:"numeric"}))}`}
const _sc14=sleepCall;sleepCall=function(i){const r=_sc14(i);const m=S.sleep[i];if(!r||!m)return r;const d=PLAN[i],low=nightLow(d),cat=SPOTS[d.spot][2];
  if(m==="hotel"){const H=hotelFor(d);return{cab:0,hotel:1,why:H&&H.lo?`Hotel in ${H.town}: about $${H.lo}–${H.hi} a night before tax. A warm bed, a shower and a full charge for the Anker.`:`Hotel near ${H?H.town:"tonight's stop"}. Check prices with the link below.`}}
  if(m==="cab")return{cab:1,why:r.cab?r.why:`You picked the cab. Low ≈${low}°F. Crack a window about an inch to cut condensation.`};
  if(m==="tent"){if(cat==="truck")return{cab:0,why:"Rest areas don't allow tents. Pick a campsite below, or switch to Cab."};return{cab:0,why:r.cab?`You picked the tent. Heads-up: ${r.why.replace(/^Sleep in the cab: /,"").replace(/ Crack a window.*$/,"")}`:r.why}}
  return r};
simulateCamp=function(){let pct=100,since=0;return PLAN.map((d,i)=>{const drive=(d.b-d.a)/MPH;pct=Math.min(100,pct+drive*TRUCK_W/ANKER_WH*100);if(!d.spot)return{end:true,pct};
  const hotel=S.sleep[i]==="hotel",power=hotel||SPOTS[d.spot][2]==="camp";if(power){since=0;pct=100;return{bed:100,morning:100,since,power,hotel}}
  const bed=pct;pct=Math.max(0,pct-S.blanket*BLANKET_H/ANKER_WH*100);since++;return{bed,morning:pct,since,power,nudge:pct<25||since>=2}})};
const _rc14=recalc;recalc=function(){_rc14();let add=0,n=0;PLAN.forEach((d,i)=>{if(d.spot&&S.sleep[i]==="hotel"){const H=hotelFor(d);if(H&&H.lo){add+=Math.round((H.lo+H.hi)/2*1.12)-SPOTS[d.spot][5];n++}}});if(!n)return;
  EST.camp+=add;$("#t-camp").textContent="≈"+money(EST.camp);$("#t-camp-n").textContent+=` · ${n} hotel night${n>1?"s":""}`;$("#t-total").textContent="≈"+money(EST.gas+EST.camp+EST.food);$("#t-total-n").textContent=`gas ${money(EST.gas)} + camp/hotel ${money(EST.camp)} + food ${money(EST.food)}`};
function setSleep(i,m){if(m==="auto")delete S.sleep[i];else S.sleep[i]=m;store.set("sleep",S.sleep);S.openSleep=i;rebuild()}
function sleepPanel(i){const d=PLAN[i],sc=sleepCall(i),m=S.sleep[i]||(sc.hotel?"hotel":sc.cab?"cab":"tent"),cat=SPOTS[d.spot][2];let h="";
  if(m==="tent"){const kind=S.tentKind[i]||(cat==="camp"?"camp":"free");const list=R.spots.filter(s=>s.area===d.area&&s.cat===kind);
    h+=`<div class="sub2" role="group" aria-label="Kind of tent site"><button type="button" data-tk="free" aria-pressed="${kind==="free"}">Free / BLM</button><button type="button" data-tk="camp" aria-pressed="${kind==="camp"}">Campgrounds</button></div>`;
    h+=list.length?`<ul class="sl">${list.map(s=>{const sp=SPOTS[s.id];return `<li><b>${esc(sp[3])}</b><span>${esc(sp[4])}</span>${s.id===d.spot?`<em class="cur">Tonight's stop</em>`:`<button type="button" class="pbb" data-stay="${s.id}">Stay here instead</button>`}</li>`}).join("")}</ul>`:`<p class="none">${kind==="free"?"No free or BLM sites in the plan near tonight's stop.":"No campgrounds in the plan near tonight's stop."}</p>`;
    const notes=(CAMPNOTES[d.area]||[]).filter(n=>kind==="camp");if(notes.length)h+=`<div class="gk">Also checked</div><ul class="sl notes">${notes.map(([n,t,k])=>`<li class="${k}"><b>${esc(n)}</b><span>${esc(t)}</span></li>`).join("")}</ul>`}
  else if(m==="cab"){const rs=nearestRest(i);h+=`<ul class="sl">${cat!=="camp"?`<li><b>${esc(SPOTS[d.spot][3])}</b><span>${cat==="truck"?"Tonight's stop is a rest area: sleeping in the vehicle is allowed.":"Free sites allow sleeping in the truck too."}</span><em class="cur">Tonight's stop</em></li>`:""}${rs.map(r=>{const sp=SPOTS[r.id];return `<li><b>${esc(sp[3])}</b><span>${Math.abs(r.off)<1?"at your stop":`${Math.round(Math.abs(r.off))} mi ${r.off<0?"before":"past"} it`} · ${esc(sp[4])}</span><button type="button" class="pbb" data-rest2="${r.id}">Sleep here</button></li>`}).join("")}</ul>`}
  else{const H=hotelFor(d),dt=dateFor(i);if(H&&H.lo)h+=`<p class="hrange"><b>≈$${H.lo}–${H.hi}</b> a night before tax in ${esc(H.town)}</p><ul class="sl">${H.list.map(([n,p,dd])=>`<li class="hrow"><b>${esc(n)}</b><span class="hp">$${p}</span><span class="hd">seen for ${esc(dd)}</span></li>`).join("")}</ul>`;else h+=`<p class="hrange">No price sample for ${esc(H?H.town:"this stop")}.</p>`;
    h+=`<a class="hbook" href="${gHotels(H||{q:"hotels near "+shortName(d.spot)},dt)}" target="_blank" rel="noopener">Check prices for ${esc(dlabel(i).dow)} ${esc(dlabel(i).date)} ↗</a><p class="gn">Sample prices from Expedia listings checked Nov 15, 2026, for the dates shown. Taxes add about 10–15%, and Thanksgiving week can run higher.</p>`}
  return h}
function sleepChooser(i){const d=PLAN[i],sc=sleepCall(i);if(!sc)return"";const m=S.sleep[i],cur=sc.hotel?"hotel":sc.cab?"cab":"tent";const lab={tent:"Pitch the tent",cab:"Sleep in the cab",hotel:"Hotel night"}[cur];
  return `<div class="ib sleepch ${cur}${S.openSleep===i?" open":""}" data-sleep="${i}"><span class="k">Tonight: tent, cab or hotel?</span><b>${lab}${m?"":` <small class="sugg">suggested</small>`}</b>
  <div class="seg3" role="group" aria-label="How you'll sleep on day ${i+1}">${["tent","cab","hotel"].map(k=>`<button type="button" data-sl="${k}" aria-pressed="${cur===k}">${{tent:"Tent",cab:"Cab",hotel:"Hotel"}[k]}</button>`).join("")}</div>
  <span class="why">${esc(sc.why)}</span>${sleepReasons(i,cur,!m)}<div class="slx">${sleepPanel(i)}</div>${m?`<button type="button" class="linkb back" data-sl="auto">↺ Back to the suggestion</button>`:""}</div>`}
function mountChoosers(){PLAN.forEach((d,i)=>{const sec=document.getElementById("day-"+(i+1));if(!sec)return;const old=sec.querySelector(".infobar .ib.tent,.infobar .ib.cab");if(!old)return;
  const w=document.createElement("div");w.innerHTML=sleepChooser(i);const el=w.firstElementChild;old.replaceWith(el);
  el.querySelectorAll("[data-sl]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();setSleep(i,b.dataset.sl)}));
  el.querySelectorAll("[data-tk]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();S.tentKind[i]=b.dataset.tk;el.querySelector(".slx").innerHTML=sleepPanel(i);bindPanel(el,i);el.querySelectorAll("[data-tk]").forEach(o=>o.setAttribute("aria-pressed",o===b))}));
  bindPanel(el,i);
  {el.tabIndex=0;el.setAttribute("aria-expanded",el.classList.contains("open"));el.addEventListener("click",e=>{if(!MOB.on||e.target.closest("button,a"))return;const o=!el.classList.contains("open");el.classList.toggle("open",o);el.setAttribute("aria-expanded",o)})}});
  document.querySelectorAll("[data-sleepjump]").forEach(b=>b.addEventListener("click",()=>{const el=document.querySelector(`[data-sleep="${b.dataset.sleepjump}"]`);if(!el)return;el.classList.add("open");el.setAttribute("aria-expanded","true");el.scrollIntoView({behavior:"smooth",block:"center"})}));
  S.openSleep=null}
function bindPanel(el,i){el.querySelectorAll("[data-stay]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();const id=b.dataset.stay;S.picks[SPOTS[id][0]]=id;store.set("picks",S.picks);if(S.sleep[i]==="hotel"||S.sleep[i]==="cab"){delete S.sleep[i];store.set("sleep",S.sleep)}S.openSleep=i;rebuild()}));
  el.querySelectorAll("[data-rest2]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();S.dayEnd[i]=b.dataset.rest2;store.set("dayEnd",S.dayEnd);S.sleep[i]="cab";store.set("sleep",S.sleep);S.openSleep=i;rebuild()}))}
const _rd14=renderDays;renderDays=function(){_rd14();mountChoosers()};
TRACK=simulateCamp();renderDays();recalc();

/* v15: detailed reasons for the tonight suggestion */
function sleepReasons(i,cur,auto){const d=PLAN[i],sp=SPOTS[d.spot],cat=sp[2],tr=TRACK[i],low=nightLow(d),rain=nightRain(d);const R2=[];
  const L=LIVE&&liveFor(sp[6],sp[7],dateFor(i));
  if(cur==="hotel"){const H=hotelFor(d);R2.push(["ok",`Warm room, hot shower and a full Anker charge for tomorrow.`]);if(H&&H.lo)R2.push(["info",`Adds about $${Math.round((H.lo+H.hi)/2*1.12)} with tax (middle of the ${H.town} range).`]);}
  R2.push(cat==="truck"?["bad",`${sp[3]} is a rest area: vehicles only, no tents.`]:cat==="camp"?["ok",`Campground tent site with power${/shower/i.test(sp[4])?" and showers":""}.`]:["ok",`Free site: tents and sleeping in the truck are both allowed.`]);
  R2.push(low>32?["ok",`Low ≈${low}°F: above freezing.`]:low>25?["warn",`Low ≈${low}°F: below freezing, but fine with a 15°F-rated bag, an insulated pad and the heated blanket.`]:["bad",`Low ≈${low}°F: colder than is comfortable in a tent; the cab holds heat better.`]);
  R2.push(rain?["warn",`Rain likely${L&&L.pop?` (${L.pop}%)`:""}: you'd pack up a wet tent. The tarp helps; the cab stays dry.`]:["ok",`Dry night expected${L?` (${L.pop||0}% chance of rain)`:""}.`]);
  if(d.area==="A8")R2.push(["warn","Columbia Gorge wind can flatten a tent; stake and guy it out, or use the cab."]);
  if(tr&&!tr.end){if(tr.power)R2.push(["ok",cur==="hotel"?"No battery needed tonight.":"Plug the blanket into site power: no battery limit."]);else{const h=tr.bed/100*ANKER_WH*0.85/S.blanket;R2.push(h>=10?["ok",`Anker at ${Math.round(tr.bed)}% runs the blanket ≈${Math.min(24,h).toFixed(0)} h on ${BLANKET.find(b=>b.k===S.blanket).t.toLowerCase()}; a long night needs ~10 h.`]:["warn",`Anker at ${Math.round(tr.bed)}% runs the blanket only ≈${h.toFixed(0)} h; turn it to low or charge it while driving.`])}}
  if(d.arrive!=null&&d.sunset!=null){const m=d.sunset-d.arrive;R2.push(m>=45?["ok",`You arrive ${mmss(m)} before dark: plenty of light to ${cur==="tent"?"pitch the tent":"settle in"}.`]:m>=0?["warn",`Only ${mmss(m)} of daylight after you arrive; pitch first, cook second.`]:["warn","You'd arrive after dark; the cab is quicker to set up by headlamp."])}
  if(tr&&!tr.end&&!tr.power&&tr.since>=2)R2.push(["warn",`Night ${tr.since} without a shower: a campground or hotel tonight would help.`]);
  R2.push(["info",L?`Weather from the NWS forecast (updated ${new Date(LIVE.at).toLocaleString("en-US",{weekday:"short",hour:"numeric",minute:"2-digit"})}).`:"Weather is typical for late November; tap Refresh conditions near the top of the page for the real forecast."]);
  const title=auto?`Why ${cur==="tent"?"the tent":cur==="cab"?"the cab":"a hotel"} is suggested`:"How tonight looks";
  return `<div class="whyb"><div class="gk">${title}</div><ul class="whyl">${R2.map(([k,t])=>`<li class="${k}"><span class="wi" aria-hidden="true">${{ok:"✓",warn:"!",bad:"✕",info:"i"}[k]}</span><span>${esc(t)}</span></li>`).join("")}</ul></div>`}
renderDays();

