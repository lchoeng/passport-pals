// Passport Pals — screens, navigation, saving, family photos, passport, encyclopedia and parent area.
(function(){
const PP = window.PP; const {$, $$, shuffle, pick, cap, uniq} = PP.U;
const KEY='passportpals.v1';
const esc = s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today = ()=>new Date().toISOString().slice(0,10);
const fmtDate = s=>{try{return new Date(s+'T12:00').toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});}catch(e){return s;}};

// ---------- state ----------
const newChild=(name,age)=>({name,age,diff:'auto',skills:{},concepts:{},dests:{},found:{},acc:null,companion:null,loc:null,postcards:[]});
function load(){
  let s=null; try{s=JSON.parse(localStorage.getItem(KEY));}catch(e){}
  const base={current:null,settings:{audio:true,music:.35,sfx:.8,voice:1},children:{linus:newChild('Linus',5),wesley:newChild('Wesley',3)},photoMeta:{},custom:[]};
  if(!s) return base;
  s.settings={...base.settings,...s.settings}; s.children={...base.children,...s.children}; s.photoMeta=s.photoMeta||{}; s.custom=s.custom||[];
  for(const k in s.children) s.children[k]={...newChild(k,0),...s.children[k]};
  return s;
}
PP.state=load();
let saveOK=true;
PP.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(PP.state));saveOK=true;}catch(e){if(saveOK)PP.toast('Progress could not be saved on this device');saveOK=false;}};
PP.state.custom.forEach(addCustomDest);
function addCustomDest(c){ if(!PP.DESTS.find(d=>d.id===c.id)) PP.DESTS.push(c); }
const D = id=>PP.DESTS.find(d=>d.id===id);
const CH = ()=>PP.child();
const dstate = (id,c=CH())=>c.dests[id]||(c.dests[id]={done:{},stamp:null,spots:{}});

// ---------- photos (IndexedDB for uploads, files for the trip photos) ----------
let dbp=null;
function db(){ if(dbp) return dbp; dbp=new Promise((res)=>{try{const r=indexedDB.open('passportpals',1);r.onupgradeneeded=()=>{r.result.createObjectStore('photos',{keyPath:'id'});r.result.createObjectStore('kv');};r.onsuccess=()=>res(r.result);r.onerror=()=>res(null);}catch(e){res(null);}}); return dbp; }
const tx=(store,mode,fn)=>db().then(d=>d?new Promise(res=>{try{const t=d.transaction(store,mode);const st=t.objectStore(store);const r=fn(st);t.oncomplete=()=>res(r&&r.result);t.onerror=()=>res(null);}catch(e){res(null);}}):null);
const idbAll=()=>tx('photos','readonly',s=>s.getAll()).then(r=>r||[]);
const idbPut=o=>tx('photos','readwrite',s=>s.put(o));
const idbDel=id=>tx('photos','readwrite',s=>s.delete(id));
const kvGet=k=>tx('kv','readonly',s=>s.get(k)); const kvSet=(k,v)=>tx('kv','readwrite',s=>s.put(v,k));
const BUILTIN = PP.DESTS.filter(d=>d.photo).map(d=>({id:'b-'+d.id,dest:d.id,src:d.photo,builtin:true,caption:`Our trip to ${d.name}`,date:'',desc:'',fav:true}));
PP.photoList = async(dest)=>{
  const up=(await idbAll()).map(p=>({...p,src:p.data}));
  const all=[...BUILTIN.map(b=>({...b,...(PP.state.photoMeta[b.id]||{})})).filter(b=>!b.hidden),...up];
  return dest?all.filter(p=>p.dest===dest):all;
};
const refPhotos={}; const loadRefs=()=>Promise.all(['linus','wesley'].map(k=>kvGet('ref-'+k).then(v=>{refPhotos[k]=v||null;})));
function shrink(file,max=1100){return new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.85));};im.onerror=rej;im.src=fr.result;};fr.onerror=rej;fr.readAsDataURL(file);});}

// ---------- ui helpers ----------
let current='title', prev='title';
PP.show = name=>{ $$('.screen').forEach(s=>s.classList.toggle('on',s.id==='s-'+name)); if(name!==current){prev=current;current=name;} const el=$('#s-'+name); if(el) el.scrollTop=0; };
PP.toast = msg=>{const t=$('#toast');t.textContent=msg;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,2600);};
function modal(html,onClose){const m=$('#modal');$('#mbox').innerHTML=`<button class="ibtn round mclose" id="mClose" aria-label="Close">${PP.ICON.back}</button>`+html;m.hidden=false;$('#mClose').onclick=()=>{closeModal();onClose&&onClose();};}
function closeModal(){$('#modal').hidden=true;PP.audio.hush();}
PP.kidReact = (k)=>{const s=$('#gKid .kid');if(!s)return;s.classList.remove('cheer','wave');s.dataset.e=k==='wow'?'wow':'open';if(k==='cheer'){void s.offsetWidth;s.classList.add('cheer');}clearTimeout(s._t);s._t=setTimeout(()=>{s.dataset.e='smile';s.classList.remove('cheer');},1500);};
const kid=(who,o={})=>`<img class="kid kidimg ${o.cls||''}" src="photos/${who}-cut.png" alt="${esc(PP.state.children[who]?.name||who)}" draggable="false">`;
const face=(who,cls='')=>`<span class="facec ${who} ${cls}"><img src="photos/${who}-cut.png" alt="" draggable="false"></span>`;
const tap=()=>PP.audio.sfx('tap');

// ---------- title & child select ----------
function renderTitle(){

}
$('#playBtn').onclick=()=>{PP.audio.unlock();tap();renderPick();PP.show('pick');PP.audio.say('Who is exploring today? Linus or Wesley?');};
function renderPick(){
  $('#pickRow').innerHTML=`<div class="pickhill">`+['linus','wesley'].map(k=>{const c=PP.state.children[k];
   return `<button class="pickkid ${k}" data-k="${k}" aria-label="${esc(c.name)}">${kid(k,{cls:'idle'})}<span class="tag">${refPhotos[k]?`<img class="avatar" src="${refPhotos[k]}" alt="">`:''}<span><b>${esc(c.name)}</b><small>Age ${c.age}</small>
   <span class="stampmini">${PP.DESTS.map(d=>`<i class="${dstate(d.id,c).stamp?'on':''}" style="--c:${d.color}"></i>`).join('')}</span></span></span></button>`}).join('')+`</div>`;
  $$('.pickkid').forEach(b=>b.onclick=()=>{const k=b.dataset.k;PP.state.current=k;PP.save();tap();b.classList.add('chosen');b.querySelector('.kid').classList.add('cheer');
    PP.audio.say(`Hi ${PP.state.children[k].name}! Let's go on an adventure!`);setTimeout(()=>{renderMap();PP.show('map');},700);});
}

// ---------- world map ----------
const NUDGE={seoul:[-3.4,-1],tokyo:[2.6,3],mexico:[-2.4,-1],costarica:[1.8,3.5]};
const pos = (d,raw)=>{let [x,y]=PP.proj(d.lon,d.lat);x=Math.max(30,Math.min(994,x));const n=!raw&&NUDGE[d.id]||[0,0];return [x/1024*100+n[0],y/400*100+n[1]];};
function renderMap(){
  const c=CH(); $('#whoChip').innerHTML=`${face(PP.state.current)}${esc(c.name)}`;
  const box=$('#mapBox'); const home=pos(PP.HOME); const here=c.loc?pos(D(c.loc)||PP.HOME,true):home;
  box.innerHTML=PP.mapSVG()+`<span class="home" style="left:${home[0]}%;top:${home[1]}%" title="Home"></span>`+
    PP.DESTS.map(d=>{const [x,y]=pos(d);const st=dstate(d.id).stamp;return `<button class="marker" data-id="${d.id}" style="left:${x}%;top:${y}%;--c:${d.color}"><span class="pin">${PP.markerSVG(d)}</span><span class="nm">${esc(d.name)}</span>${st?`<span class="done">${PP.stampSVG(d)}</span>`:''}</button>`}).join('')+
    `<div class="mapkid" style="left:${here[0]}%;top:${here[1]}%">${kid(PP.state.current,{cls:'idle'})}</div>`+(c.companion?`<div class="mapcomp" style="left:${here[0]}%;top:${here[1]}%">${PP.animalSVG(c.companion)}</div>`:'');
  $$('.marker',box).forEach(m=>m.onclick=()=>fly(D(m.dataset.id)));
  const done=PP.DESTS.filter(d=>dstate(d.id).stamp).length;
  $('#mapTip').textContent=done?`${done} of ${PP.DESTS.length} stamps collected! Tap a place to fly there.`:'Tap a place to fly there!';
  const sc=$('#mapScroll'); requestAnimationFrame(()=>{sc.scrollLeft=(here[0]/100)*box.offsetWidth-sc.clientWidth/2;});
}
let flying=false;
function fly(d){
  if(flying) return; flying=true; tap(); PP.audio.sfx('whoosh'); PP.audio.say(`Let's fly to ${d.name}!`);
  const c=CH(); const box=$('#mapBox'); const from=c.loc&&D(c.loc)?PP.proj(D(c.loc).lon,D(c.loc).lat):PP.proj(PP.HOME.lon,PP.HOME.lat); let to=PP.proj(d.lon,d.lat); to[0]=Math.max(30,Math.min(994,to[0]));
  const mx=(from[0]+to[0])/2, dist=Math.hypot(to[0]-from[0],to[1]-from[1]), my=Math.min(from[1],to[1])-Math.max(40,dist*.3);
  const path=`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`;
  box.insertAdjacentHTML('beforeend',`<svg class="flight" viewBox="0 0 1024 400"><path id="fpath" d="${path}" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 10" stroke-linecap="round"/>
   <g id="plane"><path d="M-26 0 C-20 -8 18 -8 26 0 C18 8 -20 8 -26 0z" fill="#fff" stroke="#3b2f2a" stroke-opacity=".3" stroke-width="2"/><path d="M-4 -2 L-14 -24 L-6 -24 L10 -2z M-4 2 L-14 24 L-6 24 L10 2z" fill="${d.color}"/><path d="M-22 -2 L-30 -14 L-24 -14 L-16 -2z" fill="${d.color}"/><circle cx="14" cy="-1" r="3.5" fill="#bfe3f2"/><circle cx="6" cy="-1" r="3" fill="#bfe3f2"/></g></svg>`);
  const fp=$('#fpath'),plane=$('#plane'),L=fp.getTotalLength(); fp.style.strokeDashoffset=0;
  const sc=$('#mapScroll'); const t0=performance.now(), dur=2400;
  const step=t=>{const k=Math.min(1,(t-t0)/dur), e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2; const p=fp.getPointAtLength(L*e), q=fp.getPointAtLength(Math.min(L,L*e+1));
    const a=Math.atan2(q.y-p.y,q.x-p.x)*180/Math.PI; const s=1+Math.sin(Math.PI*e)*.5; plane.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${a}) scale(${s})`);
    sc.scrollLeft=(p.x/1024)*box.offsetWidth-sc.clientWidth/2;
    if(k<1) requestAnimationFrame(step); else { c.loc=d.id; PP.save(); setTimeout(()=>{flying=false; openIntro(d);},350);} };
  requestAnimationFrame(step);
}
$('#whoChip').onclick=()=>{tap();renderPick();PP.show('pick');};

// ---------- intro ----------
let D_ = null;
async function openIntro(d){
  D_=d; document.documentElement.style.setProperty('--acc',d.color);
  $('#introScene').innerHTML=PP.sceneArt(d.scene);
  $('#introName').textContent=d.name+(d.country&&d.country!==d.name?`, ${d.country}`:'');
  $('#introText').textContent=d.intro;
  const ph=(await PP.photoList(d.id)); const p=ph.find(x=>x.fav)||ph[0];
  $('#introPhoto').innerHTML=p?`<span class="photo-tag">Our real photo</span><img src="${esc(p.src)}" alt="Family photo from ${esc(d.name)}"><figcaption>${esc(p.caption||d.name)}</figcaption>`:`<figcaption>Add a photo in the Parent area</figcaption>`;
  $('#introPhoto').hidden=false;
  PP.show('intro'); setTimeout(()=>PP.audio.say(d.intro),300);
}
$('#introSay').innerHTML=PP.ICON.speak; $('#introSay').onclick=()=>PP.audio.say(D_.intro);
$('#exploreBtn').onclick=()=>{tap();openDest(D_);};

// ---------- destination exploration ----------
function openDest(d){
  D_=d; document.documentElement.style.setProperty('--acc',d.color); const c=CH(), ds=dstate(d.id);
  $('#destTitle').textContent=d.name; renderStampProg();
  const slots=PP.SLOTS[d.id]||{}; const spots=PP.SPOTS[d.id]||[];
  const sc=$('#destScene'); const IMG=PP.SCENE_IMG[d.scene];
  sc.classList.toggle('img',!!IMG); $('.scenewrap').style.maxWidth=IMG?`min(1180px, calc(58vh * ${IMG.ar}))`:''; sc.style.aspectRatio=IMG?String(IMG.ar):'';
  if(IMG){
    sc.innerHTML=PP.sceneArt(d.scene)+d.animals.map(id=>{const h=IMG.hot[id];if(!h)return '';const f=c.found[id];
      return `<button class="ani-btn hot ${f?'found':'new'}" data-a="${id}" aria-label="${esc(PP.ANIMALS[id].short)}" style="left:${h[0]}%;top:${h[1]}%;width:${h[2]}%;height:${h[3]}%"></button>${f?`<span class="badge" style="left:${h[0]+h[2]-2}%;top:${h[1]+3}%">${PP.ICON.check}</span>`:''}`}).join('')+
      Object.entries(IMG.overlay||{}).filter(([id])=>d.animals.includes(id)).map(([id,o])=>{const f=c.found[id];return `<button class="ani-btn" data-a="${id}" aria-label="${esc(PP.ANIMALS[id].short)}">${PP.animalSVG(id,f?'found':'new').replace('<svg ',`<svg style="left:${o[0]}%;top:${o[1]}%;width:${o[2]}%" `)}</button>${f?`<span class="badge" style="left:${o[0]+o[2]*.45}%;top:${o[1]-o[2]*.4}%">${PP.ICON.check}</span>`:''}`}).join('')+
      (d.spots||[]).map((sp,i)=>{const p=IMG.stars[i];if(!p)return '';return `<button class="spot painted ${ds.spots[i]?'seen':''}" data-s="${i}" style="left:${p[0]}%;top:${p[1]}%" aria-label="${esc(sp.n)}"></button>`}).join('');
  } else
  sc.innerHTML=PP.sceneSVG(d.scene)+
    d.animals.map((id,i)=>{const s=slots[id]||PP.GENERIC_SLOTS[i%PP.GENERIC_SLOTS.length];const f=c.found[id];
      return `<button class="ani-btn" data-a="${id}" aria-label="${esc(PP.ANIMALS[id].short)}">${PP.animalSVG(id,f?'found':'new').replace('<svg ',`<svg style="left:${s[0]+s[2]/2}%;top:${s[1]}%;width:${s[2]}%" `)}</button>${f?`<span class="badge" style="left:${s[0]+s[2]*.9}%;top:${s[1]-s[2]*.45}%">${PP.ICON.check}</span>`:''}`}).join('')+
    (d.spots||[]).map((sp,i)=>{const p=spots[i];if(!p)return '';return `<button class="spot ${ds.spots[i]?'seen':''}" data-s="${i}" style="left:${p[0]}%;top:${p[1]}%" aria-label="${esc(sp.n)}">${PP.ICON.star}</button>`}).join('')+
    `<div class="walker" id="walker" style="left:50%">${kid(PP.state.current,{cls:'idle'})}</div>`;
  sc.onclick=e=>{
    const a=e.target.closest('.ani-btn'), s=e.target.closest('.spot'); const r=sc.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*100;
    $('.bubble',sc)?.remove();
    walkTo(x).then(()=>{ if(a) discover(a.dataset.a); else if(s) spotFact(+s.dataset.s,s); });
  };
  renderTiles();
  const ph=`${PP.ICON.photo}<span>Our ${esc(d.name)} photos</span>`; $('#destPhotos').innerHTML=ph; $('#destPhotos').onclick=()=>{tap();openMemories(d.id,'dest');};
  PP.show('dest');
  const left=d.animals.filter(a=>!c.found[a]).length;
  $('#sceneTip').classList.remove('fact');$('#sceneTip').textContent=left?`Tap the animals and the sparkles! ${left} animal${left>1?'s':''} to discover.`:'You found every animal here! Play a game below.';
  PP.audio.say(left?`Let's explore ${d.name}! Tap the animals and the sparkles.`:`Pick a game to play in ${d.name}!`);
}
function walkTo(x){
  return new Promise(res=>{const w=$('#walker'); if(!w) return res(); const k=w.querySelector('.kid'); const cur=parseFloat(w.style.left)||50; const tx=Math.max(6,Math.min(94,x));
    if(Math.abs(tx-cur)<3){res();return;} k.classList.remove('idle');k.classList.add('walk'); k.style.transform=tx<cur?'scaleX(-1)':''; w.style.left=tx+'%';
    setTimeout(()=>{k.classList.remove('walk');k.classList.add('idle');k.style.transform='';res();},1100);});
}
function spotFact(i,el){
  const d=D_, sp=d.spots[i], sc=$('#destScene'); const ds=dstate(d.id);
  if(!ds.spots[i]){ds.spots[i]=true;PP.save();PP.audio.sfx('sparkle');}
  el.classList.add('seen'); const k=$('#walker .kid'); if(k){k.classList.add('point'); setTimeout(()=>k.classList.remove('point'),2500);}
  if(window.innerWidth<700){const t=$('#sceneTip');t.classList.add('fact');t.innerHTML=`<b>${esc(sp.n)}</b>${esc(sp.t)}`;PP.audio.say(sp.n+'. '+sp.t);return;}
  const tp=parseFloat(el.style.top); sc.insertAdjacentHTML('beforeend',`<div class="bubble ${tp<45?'below':''}" style="left:${Math.max(25,Math.min(75,parseFloat(el.style.left)))}%;top:${tp<45?tp+5:tp}%"><b>${esc(sp.n)}</b>${esc(sp.t)}</div>`);
  PP.audio.say(sp.n+'. '+sp.t);
}
function discover(id){
  const a=PP.ANIMALS[id], c=CH(), first=!c.found[id];
  if(first){c.found[id]=D_.id;PP.save();PP.audio.sfx('sparkle');}
  const little=PP.isLittle();
  modal(`<div class="discover">${first?`<p style="color:var(--leaf);font-weight:800;margin:0">New animal for your book!</p>`:''}${PP.animalSVG(id)}<h2>${esc(cap(little?a.short:a.name))}</h2>
    <p>${esc(little?a.simple:a.fact)}</p><div class="row gap"><button class="big" id="hearA">${PP.ICON.speak}<span>Hear it</span></button><button class="big primary" id="okA"><span>Yay!</span></button></div></div>`,()=>openDest(D_));
  const talk=()=>{PP.audio.animal(a.sound[0]);setTimeout(()=>PP.audio.say((little?`The ${a.short}! ${a.simple}`:`The ${a.name}. ${a.fact}`)+` It says: ${a.sound[1]}`),first?900:600);};
  talk(); $('#hearA').onclick=talk; $('#okA').onclick=()=>{closeModal();openDest(D_);};
}
const NEED=3;
function renderStampProg(){
  const d=D_, ds=dstate(d.id), n=Object.keys(ds.done).length;
  $('#stampProg').innerHTML=ds.stamp?`<span class="st">${PP.stampSVG(d)}</span>`:Array.from({length:NEED},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')+`<span class="st" style="opacity:.35">${PP.stampSVG(d,false)}</span>`;
}
function renderTiles(){
  const d=D_, ds=dstate(d.id);
  $('#gameTiles').innerHTML=PP.GAMES.map(g=>`<button class="tile" data-g="${g.key}"><span class="ic">${g.icon()}</span>${g.key==='words'&&(d.weather||!d.words)?'Weather & Seasons':g.name}${ds.done[g.key]?`<span class="tick">${PP.ICON.check}</span>`:''}</button>`).join('');
  $$('.tile').forEach(t=>t.onclick=()=>{tap();startGame(t.dataset.g);});
}
let lastGame=null;
function startGame(key){ lastGame=key; $('#gKid').innerHTML=kid(PP.state.current); PP.startGame(key,D_); }
$('#gBack').onclick=()=>{tap();PP.audio.hush();openDest(D_);};
$('#gSay').onclick=()=>PP.gameRepeat(); $('#gHint').onclick=()=>PP.gameHint();
PP.finishGame=(meta,stars,total,extra='')=>{
  const d=D(meta.dest), ds=dstate(d.id); const had=!!ds.stamp;
  ds.done[meta.key]=Math.max(ds.done[meta.key]||0,stars); PP.save();
  const n=Math.max(1,stars);
  $('#gArea').innerHTML=`<div class="finish">${extra}${kid(PP.state.current,{cls:'cheer',expr:'open'})}<h2>${pick(['You did it!','Hooray!','Amazing exploring!'])}</h2>
    <div class="stars">${Array.from({length:Math.min(n,10)},(_,i)=>`<span style="animation-delay:${i*.12}s">${PP.ICON.star}</span>`).join('')}</div>
    <div class="row gap" style="justify-content:center"><button class="big" id="again"><span>Play again</span></button><button class="big primary" id="backD"><span>Back to ${esc(d.name)}</span></button></div></div>`;
  PP.audio.sfx('win'); PP.audio.say(`You did it, ${CH().name}! You found ${n} star${n>1?'s':''}!`);
  $('#again').onclick=()=>{tap();startGame(meta.key);}; $('#backD').onclick=()=>{tap();openDest(d);};
  if(!had && Object.keys(ds.done).length>=NEED){ ds.stamp=today(); const acc=PP.ACCESSORY[d.id]; PP.save(); setTimeout(()=>stampCeremony(d,acc),1600); }
};
function stampCeremony(d,acc){
  PP.audio.sfx('stamp');
  modal(`<div class="stampshow">${PP.stampSVG(d)}<h2 style="margin:0;font-size:32px">${esc(d.name)} stamp!</h2><p style="font-weight:700;margin:0">Stamped ${fmtDate(today())} in ${esc(CH().name)}’s passport.</p>
    ${acc?`<p style="font-weight:800;color:var(--leaf);margin:0">New explorer badge: ${PP.ACC_NAMES[acc]}!</p>`:''}<button class="big primary" id="stOk"><span>Hooray!</span></button></div>`);
  setTimeout(()=>PP.audio.say(`Stamp! You earned the ${d.name} passport stamp!${acc?' And a new '+PP.ACC_NAMES[acc]+' badge!':''}`),500);
  $('#stOk').onclick=()=>{closeModal();};
}

// ---------- encyclopedia ----------
function renderBook(){
  const c=CH(); const ids=uniq(PP.DESTS.flatMap(d=>d.animals)).filter(a=>PP.ANIMALS[a]);
  const n=ids.filter(a=>c.found[a]).length; $('#bookCount').textContent=`${n} / ${ids.length}`;
  $('#bookGrid').innerHTML=ids.map(id=>{const f=c.found[id],a=PP.ANIMALS[id];const where=PP.DESTS.filter(d=>d.animals.includes(id)).map(d=>d.name).join(', ');
    return `<button class="bcard ${f?'':'locked'}" data-a="${id}">${PP.animalSVG(id,'',true)}${f?esc(cap(a.short)):'?'}<span class="where">${esc(where)}</span></button>`}).join('');
  $$('.bcard').forEach(b=>b.onclick=()=>{const id=b.dataset.a;if(!c.found[id]){PP.audio.say(`Find this animal in ${PP.DESTS.find(d=>d.animals.includes(id)).name}!`);return;}tap();entry(id);});
}
function entry(id){
  const a=PP.ANIMALS[id], h=PP.HABITATS[a.hab], little=PP.isLittle();
  const facts=little?'':`<dl class="facts"><dt>Diet</dt><dd>${esc(a.diet)}</dd><dt>Size</dt><dd>${esc(a.size)}</dd><dt>Weight</dt><dd>${esc(a.weight)}</dd><dt>Speed</dt><dd>${esc(a.speed)}</dd><dt>Lifespan</dt><dd>${esc(a.life)}</dd><dt>Predators</dt><dd>${esc(a.pred)}</dd><dt>Adaptations</dt><dd>${esc(a.adapt)}</dd><dt>Wow fact</dt><dd>${esc(a.fact)}</dd></dl>`;
  const quizOpts=shuffle([a.hab,...shuffle(Object.keys(PP.HABITATS).filter(k=>k!==a.hab)).slice(0,2)]);
  modal(`<div class="entry"><div class="art">${PP.animalSVG(id)}</div><div><h2>${esc(little?cap(a.short):a.name)}</h2>
    <p style="font-weight:700">${esc(a.simple)}</p><div class="habrow">${PP.habSVG(a.hab)}<span>Lives in: ${esc(h.name)}</span></div>${facts}
    <div class="row gap" style="margin-top:10px"><button class="big" id="eHear">${PP.ICON.speak}<span>Sound</span></button></div>
    ${little?'':`<div class="pcard" style="margin-top:12px"><b>Quick question: where does it live?</b><div class="row gap" style="margin-top:8px">${quizOpts.map(k=>`<button class="chip" data-h="${k}">${PP.HABITATS[k].name}</button>`).join('')}</div><p id="eRes" style="font-weight:700"></p></div>`}</div></div>`);
  const talk=()=>{PP.audio.animal(a.sound[0]);setTimeout(()=>PP.audio.say(little?`${a.short}. ${a.simple} It lives in ${h.say}.`:`${a.name}. ${a.fact}`),800);};
  talk(); $('#eHear').onclick=talk;
  $$('[data-h]').forEach(b=>b.onclick=()=>{const ok=b.dataset.h===a.hab;PP.record('habitats',ok,'hab:'+id);PP.audio.sfx(ok?'good':'soft');const t=ok?`Yes! ${cap(PP.plural(a.short))} live in ${h.say}.`:`Good try! ${cap(PP.plural(a.short))} live in ${h.say}. It is ${h.note}.`;$('#eRes').textContent=t;PP.audio.say(t);});
}

// ---------- passport ----------
function renderPassport(){
  const k=PP.state.current, c=CH(); $('#ppTitle').textContent=`${c.name}’s Passport`;
  const unlocked=PP.DESTS.filter(d=>dstate(d.id).stamp).map(d=>PP.ACCESSORY[d.id]).filter(Boolean);
  const found=Object.keys(c.found).filter(a=>PP.ANIMALS[a]);
  const games=Object.values(c.dests).reduce((s,x)=>s+Object.keys(x.done||{}).length,0);
  $('#passportBody').innerHTML=`<div class="pphead"><div class="face">${refPhotos[k]?`<img src="${refPhotos[k]}" alt="">`:face(k,'big')}</div><div><h3>${esc(c.name)}</h3><p>Explorer, age ${c.age}</p><p>${PP.DESTS.filter(d=>dstate(d.id).stamp).length} stamps · ${found.length} animals · ${games} adventures</p></div></div>
   <div class="stampgrid">${PP.DESTS.map(d=>{const st=dstate(d.id).stamp;return `<div class="spage">${PP.stampSVG(d,!!st)}${st?fmtDate(st):esc(d.name)}</div>`}).join('')}</div>
   <h3 class="sect">Animal stickers</h3><div class="stickers">${found.length?found.map(a=>`<span class="sticker" title="${esc(PP.ANIMALS[a].short)}">${PP.animalSVG(a,'',true)}</span>`).join(''):'<p>Tap animals in each place to collect stickers!</p>'}</div>
   <h3 class="sect">Explorer badges</h3><div class="accs">${Object.entries(PP.ACC_NAMES).map(([key,nm])=>`<span class="acc ${unlocked.includes(key)?'on':''}" ${unlocked.includes(key)?'':'style="opacity:.4"'}>${nm}</span>`).join('')}</div>
   <h3 class="sect">Animal companion</h3><div class="stickers">${found.length?found.map(a=>`<button class="sticker ${c.companion===a?'on':''}" data-comp="${a}" style="${c.companion===a?'box-shadow:0 0 0 4px var(--sun)':''}">${PP.animalSVG(a,'',true)}</button>`).join('')+`<button class="acc" data-comp="">None</button>`:'<p>Discover animals to pick a friend who travels with you!</p>'}</div>`;
  $$('[data-acc]').forEach(b=>b.onclick=()=>{c.acc=b.dataset.acc||null;PP.save();tap();renderPassport();});
  $$('[data-comp]').forEach(b=>b.onclick=()=>{c.companion=b.dataset.comp||null;PP.save();tap();if(c.companion)PP.audio.say(`The ${PP.ANIMALS[c.companion].short} will travel with you!`);renderPassport();});
}

// ---------- memories ----------
let memDest='all', memFrom='map';
async function openMemories(dest='all',from='map'){memDest=dest;memFrom=from;await renderMemories();PP.show('memories');PP.audio.say('Our family adventures! Tap a photo to look closer.');}
async function renderMemories(){
  const list=await PP.photoList(memDest==='all'?null:memDest);
  $('#memTabs').innerHTML=[['all','All'],...PP.DESTS.map(d=>[d.id,d.name])].map(([id,n])=>`<button class="chip ${memDest===id?'on':''}" data-m="${id}">${esc(n)}</button>`).join('');
  $$('[data-m]').forEach(b=>b.onclick=()=>{memDest=b.dataset.m;tap();renderMemories();});
  $('#gallery').innerHTML=list.length?list.map((p,i)=>`<button class="polaroid ${p.fav?'fav':''}" data-p="${esc(p.id)}" style="--rot:${(i%3-1)*2.5}deg"><img src="${esc(p.src)}" alt="" loading="lazy"><figcaption>${esc(p.caption||D(p.dest)?.name||'')}</figcaption></button>`).join(''):'<p>No photos here yet. A grown-up can add some in the Parent area.</p>';
  $$('#gallery .polaroid').forEach(b=>b.onclick=()=>{const p=list.find(x=>x.id===b.dataset.p);tap();
    modal(`<figure class="polaroid" style="width:min(520px,100%);margin:6px auto 0;transform:none"><span class="photo-tag">Our real photo</span><img src="${esc(p.src)}" alt=""><figcaption>${esc(p.caption||'')}</figcaption></figure><p style="text-align:center;font-weight:700;margin-top:14px">${esc(D(p.dest)?.name||'')}${p.date?' · '+fmtDate(p.date):''}</p>${p.desc?`<p style="text-align:center">${esc(p.desc)}</p>`:''}`);
    PP.audio.say((p.caption||'')+'. '+(D(p.dest)?.name||'')+(p.desc?'. '+p.desc:''));});
  const c=CH(); $('#pcHead').hidden=!c.postcards.length; const all=await PP.photoList();
  $('#postcards').innerHTML=c.postcards.map(pc=>{const p=all.find(x=>x.id===pc.photo);const d=D(pc.dest);if(!p||!d)return '';return `<div class="postcard"><img src="${esc(p.src)}" alt=""><div class="msg"><span>${esc(pc.msg)}</span>${PP.animalSVG(pc.ani,'',true)}</div><span class="pst">${PP.stampSVG(d)}</span></div>`}).join('');
}
$('#memBack').onclick=()=>{tap();if(memFrom==='dest'&&D_)openDest(D_);else{renderMap();PP.show('map');}};
$('#whereBtn').onclick=async()=>{
  tap(); const all=(await PP.photoList()).filter(p=>D(p.dest)); if(!all.length) return;
  let round=0; const next=()=>{ if(round>0&&$('#modal').hidden) return; if(round++>=Math.min(5,all.length)){closeModal();PP.toast('Great remembering!');return;}
    const p=pick(all), d=D(p.dest); const opts=shuffle([d,...shuffle(PP.DESTS.filter(x=>x.id!==d.id)).slice(0,2)]);
    modal(`<h2 style="text-align:center;margin:0 0 8px">Where were we?</h2><figure class="polaroid" style="width:min(280px,70%);margin:0 auto 14px;transform:rotate(-2deg)"><img src="${esc(p.src)}" alt=""></figure>
      <div class="choices n3">${opts.map(o=>`<button class="choice" data-d="${o.id}"><span class="ic" style="width:60px">${PP.markerSVG(o)}</span><span class="lbl">${esc(o.name)}</span></button>`).join('')}</div><p id="wRes" style="text-align:center;font-weight:800;font-size:20px"></p>`);
    PP.audio.say('Where were we in this photo?');
    $$('[data-d]').forEach(b=>b.onclick=()=>{const ok=b.dataset.d===d.id;PP.record('memory',ok,'where:'+d.id);b.classList.add(ok?'right':'wrong');$$('[data-d]').find(x=>x.dataset.d===d.id).classList.add('right');
      PP.audio.sfx(ok?'good':'soft');const t=ok?`Yes! That was ${d.name}!`:`That photo is from ${d.name}! Do you remember?`;$('#wRes').textContent=t;PP.audio.say(t);setTimeout(next,2400);});};
  next();
};
$('#postBtn').onclick=async()=>{
  tap(); const all=(await PP.photoList(memDest==='all'?null:memDest)).filter(p=>D(p.dest)); if(!all.length) return; const c=CH();
  let sel={photo:all[0].id,ani:Object.keys(c.found)[0]||D(all[0].dest).animals[0],msg:''};
  const draw=()=>{const p=all.find(x=>x.id===sel.photo), d=D(p.dest); const msgs=[`Greetings from ${d.name}!`,'Wish you were here!','We love you!','Best trip ever!'];if(!sel.msg||!msgs.includes(sel.msg))sel.msg=msgs[0];
    const anis=uniq([...d.animals,...Object.keys(c.found)]).filter(a=>PP.ANIMALS[a]).slice(0,8);
    modal(`<div class="pcbuild"><h2 style="margin:0">Make a postcard</h2><b>1. Pick a photo</b><div class="pick3">${all.map(x=>`<button data-ph="${esc(x.id)}" class="${x.id===sel.photo?'on':''}"><img src="${esc(x.src)}" alt=""></button>`).join('')}</div>
      <b>2. Pick an animal sticker</b><div class="pick3">${anis.map(a=>`<button data-an="${a}" class="${a===sel.ani?'on':''}">${PP.animalSVG(a,'',true)}</button>`).join('')}</div>
      <b>3. Pick a message</b><div class="pick3">${msgs.map(m=>`<button class="txt ${m===sel.msg?'on':''}" data-ms="${esc(m)}">${esc(m)}</button>`).join('')}</div>
      <div class="postcard"><img src="${esc(p.src)}" alt=""><div class="msg"><span>${esc(sel.msg)}</span>${PP.animalSVG(sel.ani,'',true)}</div><span class="pst">${PP.stampSVG(d)}</span></div>
      <button class="big primary" id="pcSave"><span>Save postcard</span></button></div>`);
    $$('[data-ph]').forEach(b=>b.onclick=()=>{sel.photo=b.dataset.ph;sel.msg='';tap();draw();});
    $$('[data-an]').forEach(b=>b.onclick=()=>{sel.ani=b.dataset.an;tap();PP.audio.say(PP.ANIMALS[sel.ani].short);draw();});
    $$('[data-ms]').forEach(b=>b.onclick=()=>{sel.msg=b.dataset.ms;tap();PP.audio.say(sel.msg);draw();});
    $('#pcSave').onclick=()=>{c.postcards.unshift({...sel,dest:d.id,date:today()});c.postcards=c.postcards.slice(0,30);PP.save();PP.audio.sfx('win');closeModal();renderMemories();PP.toast('Postcard saved!');};};
  draw(); PP.audio.say('Make a postcard! Pick a photo, an animal and a message.');
};

// ---------- navigation buttons ----------
$$('[data-go]').forEach(b=>{const g=b.dataset.go; b.innerHTML=PP.ICON[{passport:'passport',book:'book',memories:'photo',map:'map'}[g]];
  b.onclick=()=>{tap();PP.audio.hush();if(g==='map'){renderMap();PP.show('map');}else if(g==='book'){renderBook();PP.show('book');PP.audio.say('Your animal book!');}else if(g==='passport'){renderPassport();PP.show('passport');PP.audio.say('Your passport!');}else if(g==='memories')openMemories('all','map');};});
['#gBack','#parentBack'].forEach(s=>$(s).innerHTML=PP.ICON.back); $('#memBack').innerHTML=PP.ICON.back; $('#gSay').innerHTML=PP.ICON.speak; $('#gHint').innerHTML=PP.ICON.hint;

// ---------- parent gate: hold 2 seconds, then a grown-up sum ----------
$$('[data-gate]').forEach(b=>{let t=null,st=0;
  const stop=()=>{cancelAnimationFrame(t);b.style.setProperty('--p',0);};
  b.addEventListener('pointerdown',e=>{e.preventDefault();st=performance.now();const f=now=>{const p=Math.min(100,(now-st)/20);b.style.setProperty('--p',p);if(p>=100){stop();gate();}else t=requestAnimationFrame(f);};t=requestAnimationFrame(f);});
  ['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,stop));
  b.addEventListener('click',()=>{if(performance.now()-st<1500)PP.toast('Grown-ups: press and hold');});});
function gate(){
  const a=23+Math.floor(Math.random()*50), b=14+Math.floor(Math.random()*40);
  modal(`<div class="gatebox"><h2 style="margin:0">Grown-ups only</h2><p>What is ${a} + ${b}?</p><form id="gForm"><input id="gIn" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Answer"><br><button class="btn" type="submit">Enter</button></form></div>`);
  setTimeout(()=>$('#gIn')?.focus(),100);
  $('#gForm').onsubmit=e=>{e.preventDefault();if(+$('#gIn').value===a+b){closeModal();openParent();}else{$('#gIn').value='';PP.toast('Not quite, try again');}};
}

// ---------- parent area ----------
let pTab='progress', parentFrom='title';
function openParent(){parentFrom=current;PP.audio.music(false);renderParent();PP.show('parent');}
$('#parentBack').onclick=()=>{PP.audio.apply();if(parentFrom==='map'){renderMap();}else if(parentFrom==='pick'){renderPick();}PP.show(parentFrom==='parent'?'title':parentFrom);};
const SK=[['count','Counting'],['add','Add & subtract (small)'],['math','Add & subtract (big)'],['mult','Multiplication'],['div','Division & sharing'],['skip','Skip counting'],['letters','Alphabet'],['shapes','Shapes'],['animals','Animal ID'],['habitats','Habitats'],['science','Animal science'],['words','Words & weather'],['puzzle','Puzzles'],['memory','Memory']];
const conceptLabel=k=>{const [t,v]=k.split(/:(.*)/);const m={animal:'Recognizing the ',hab:'Habitat of the ',food:'What the ',shape:'Shape: ',letter:'Letter ',abc:'ABC order near ',spell:'Spelling ',count:'Counting to ',add:'Adding ',sub:'Subtracting ',mult:'Times: ',div:'Sharing: ',skip:'Skip counting by ',word:'Word: ',sci:'',wx:'Weather: ',diet:'Diet of the ',where:'Photo from ',memory:'Memory ',puzzle:'Puzzle '}[t]??'';
  let val=v; if(['animal','hab','food','diet'].includes(t)) val=(PP.ANIMALS[v]?.short||v)+(t==='food'?' eats':''); if(t==='where') val=D(v)?.name||v; if(t==='add'||t==='sub') val=v.replace('_',t==='add'?' + ':' − '); return m+val;};
async function renderParent(){
  const tabs=[['progress','Progress'],['photos','Photos'],['kids','Children'],['places','Places'],['sound','Sound'],['reset','Reset'],['assets','Assets']];
  $('#pTabs').innerHTML=tabs.map(([k,n])=>`<button class="${pTab===k?'on':''}" data-t="${k}">${n}</button>`).join('');
  $$('#pTabs button').forEach(b=>b.onclick=()=>{pTab=b.dataset.t;renderParent();});
  const B=$('#pBody'); const S=PP.state;
  if(pTab==='progress'){
    B.innerHTML=['linus','wesley'].map(k=>{const c=S.children[k];const stamps=PP.DESTS.filter(d=>dstate(d.id,c).stamp);
      const weak=Object.entries(c.concepts).filter(([_,v])=>v.w>v.r||(v.w>=2&&v.r/(v.r+v.w)<.6)).sort((a,b)=>b[1].w-a[1].w).slice(0,10);
      return `<div class="pcard"><h3>${esc(c.name)} · age ${c.age}</h3><p><b>${stamps.length}</b> of ${PP.DESTS.length} adventures completed${stamps.length?': '+stamps.map(d=>d.name).join(', '):''}. <b>${Object.keys(c.found).length}</b> animals discovered.</p>
      ${SK.map(([s,n])=>{const v=c.skills[s];if(!v)return `<div class="skill"><span>${n}</span><span class="meter"><i style="width:0"></i></span><span class="v">not yet</span></div>`;const tot=v.r+v.w,p=Math.round(v.r/tot*100);
        return `<div class="skill"><span>${n}</span><span class="meter"><i style="width:${p}%"></i></span><span class="v">${p}% · L${v.lvl}</span></div>`}).join('')}
      <p style="margin-top:10px"><b>Needs more practice</b></p><div class="tags">${weak.length?weak.map(([k])=>`<span>${esc(conceptLabel(k))}</span>`).join(''):'<span style="background:#e6f2df;color:#3f6b2a">Nothing flagged yet</span>'}</div>
      <table class="ftable" style="margin-top:12px"><tr><th>Place</th><th>Games done</th><th>Stamp</th></tr>${PP.DESTS.map(d=>{const ds=dstate(d.id,c);return `<tr><td>${esc(d.name)}</td><td>${Object.keys(ds.done).map(g=>PP.gameNames[g]).join(', ')||'—'}</td><td>${ds.stamp?fmtDate(ds.stamp):'—'}</td></tr>`}).join('')}</table>
      <p class="note">Percent = correct answers. L1–L3 = current difficulty level; it rises after 3 right in a row and eases after 2 misses. Missed ideas come back more often in later games.</p></div>`}).join('');
  }
  else if(pTab==='photos'){
    const list=await PP.photoList();
    B.innerHTML=`<div class="pcard"><h3>Add trip photos</h3><div class="form"><label>Destination<select id="upDest">${PP.DESTS.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></label>
      <label>Photos<input type="file" id="upFiles" accept="image/*" multiple></label><p class="note">Photos stay on this device only (stored in this browser), shown exactly as taken inside an illustrated frame.</p></div></div>
      <div class="pcard"><h3>All photos (${list.length})</h3><div class="plist">${list.map(p=>`<div class="pitem" data-id="${esc(p.id)}"><img src="${esc(p.src)}" alt=""><div class="form">
        <div class="two"><label>Destination<select data-f="dest">${PP.DESTS.map(d=>`<option value="${d.id}" ${d.id===p.dest?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label><label>Date<input type="date" data-f="date" value="${esc(p.date||'')}"></label></div>
        <label>Caption<input data-f="caption" value="${esc(p.caption||'')}"></label><label>Description<textarea data-f="desc" rows="2">${esc(p.desc||'')}</textarea></label>
        <div class="row gap"><label class="switch"><input type="checkbox" data-f="fav" ${p.fav?'checked':''}> Favorite</label><button class="btn ghost" data-del>${p.builtin?'Hide':'Delete'}</button></div></div></div>`).join('')}</div>
        ${Object.values(S.photoMeta).some(m=>m.hidden)?`<button class="btn ghost" id="unhide" style="margin-top:10px">Show hidden trip photos</button>`:''}</div>`;
    $('#upFiles').onchange=async e=>{const files=[...e.target.files];const dest=$('#upDest').value;for(const f of files){try{const data=await shrink(f);await idbPut({id:'u-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),dest,data,caption:'',date:'',desc:'',fav:false});}catch(err){PP.toast('One photo could not be read');}}PP.toast(`${files.length} photo${files.length>1?'s':''} added`);renderParent();};
    $$('.pitem').forEach(row=>{const id=row.dataset.id;const p=list.find(x=>x.id===id);
      const upd=async(f,v)=>{if(p.builtin){S.photoMeta[id]={...(S.photoMeta[id]||{}),[f]:v};PP.save();}else{const all=await idbAll();const o=all.find(x=>x.id===id);if(o){o[f]=v;await idbPut(o);}}};
      $$('[data-f]',row).forEach(inp=>inp.onchange=()=>upd(inp.dataset.f,inp.type==='checkbox'?inp.checked:inp.value));
      $('[data-del]',row).onclick=async()=>{if(p.builtin)await upd('hidden',true);else await idbDel(id);renderParent();};});
    $('#unhide')&&($('#unhide').onclick=()=>{for(const k in S.photoMeta)delete S.photoMeta[k].hidden;PP.save();renderParent();});
  }
  else if(pTab==='kids'){
    B.innerHTML=['linus','wesley'].map(k=>{const c=S.children[k];return `<div class="pcard" data-k="${k}"><h3>${esc(c.name)}</h3><div class="form"><div class="two"><label>Name<input data-f="name" value="${esc(c.name)}"></label><label>Age<input data-f="age" type="number" min="2" max="9" value="${c.age}"></label></div>
      <label>Difficulty<select data-f="diff"><option value="auto" ${c.diff==='auto'?'selected':''}>Automatic (adapts to answers)</option><option value="easier" ${c.diff==='easier'?'selected':''}>A bit easier</option><option value="harder" ${c.diff==='harder'?'selected':''}>A bit harder</option></select></label>
      <label>Reference photo (shown on ${esc(c.name)}’s card and passport)<input type="file" accept="image/*" data-ref></label>${refPhotos[k]?`<div class="row gap"><img src="${refPhotos[k]}" style="width:80px;height:80px;object-fit:cover;border-radius:12px" alt=""><button class="btn ghost" data-unref>Remove photo</button></div>`:''}
      <p class="note">${k==='wesley'?'Wesley’s mode is fully spoken with picture answers, so no reading is needed.':'Linus gets clue-based riddles, multiplication, division, skip counting and science questions.'}</p></div></div>`}).join('');
    $$('[data-k]',B).forEach(card=>{const k=card.dataset.k,c=S.children[k];
      $$('[data-f]',card).forEach(i=>i.onchange=()=>{c[i.dataset.f]=i.dataset.f==='age'?+i.value:i.value;PP.save();});
      $('[data-ref]',card).onchange=async e=>{const f=e.target.files[0];if(!f)return;const d=await shrink(f,500);await kvSet('ref-'+k,d);refPhotos[k]=d;renderParent();};
      $('[data-unref]',card)&&($('[data-unref]',card).onclick=async()=>{await kvSet('ref-'+k,null);refPhotos[k]=null;renderParent();});});
  }
  else if(pTab==='places'){
    B.innerHTML=`<div class="pcard"><h3>Add a destination</h3><p class="note">New places get a painted scene, a map marker, a stamp and all nine games, built from the animals you choose.</p>
      <form class="form" id="addD"><div class="two"><label>Place name<input name="name" required placeholder="e.g. Vancouver"></label><label>Country<input name="country" required placeholder="e.g. Canada"></label></div>
      <div class="two"><label>Latitude<input name="lat" type="number" step="any" required placeholder="49.3"></label><label>Longitude<input name="lon" type="number" step="any" required placeholder="-123.1"></label></div>
      <div class="two"><label>Scenery<select name="scene"><option value="city">City</option><option value="beach">Beach</option><option value="mountain">Mountains</option><option value="forest">Forest</option><option value="snow">Snow</option><option value="desert">Desert</option></select></label><label>Stamp color<input name="color" type="color" value="#8a5cc7"></label></div>
      <label>Welcome sentence<input name="intro" placeholder="Welcome to …"></label>
      <div class="two"><label>Local word for hello (optional)<input name="hello"></label><label>Local word for thank you (optional)<input name="thanks"></label></div>
      <label>Animals (pick 3–6)</label><div class="checks">${Object.entries(PP.ANIMALS).map(([id,a])=>`<label><input type="checkbox" name="ani" value="${id}"> ${esc(cap(a.short))}</label>`).join('')}</div>
      <button class="btn" type="submit">Add destination</button></form></div>
      ${S.custom.length?`<div class="pcard"><h3>Your added places</h3>${S.custom.map(c=>`<p class="row gap"><b>${esc(c.name)}</b>, ${esc(c.country)} <button class="btn ghost" data-rm="${c.id}">Remove</button></p>`).join('')}</div>`:''}
      <div class="pcard"><h3>Built-in places</h3><p>${PP.DESTS.filter(d=>!d.id.startsWith('c-')).map(d=>esc(d.name)).join(' · ')}</p><p class="note">To edit built-in content (facts, words, questions), change js/data.js — every game reads from it.</p></div>`;
    $('#addD').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const anis=f.getAll('ani');if(anis.length<2){PP.toast('Pick at least 2 animals');return;}
      const words=[];if(f.get('hello'))words.push({w:f.get('hello'),en:'hello',icon:'wave'});if(f.get('thanks'))words.push({w:f.get('thanks'),en:'thank you',icon:'heart'});
      const name=f.get('name').trim(); const d={id:'c-'+Date.now(),name,country:f.get('country').trim(),lat:+f.get('lat'),lon:+f.get('lon'),scene:f.get('scene'),color:f.get('color'),animals:anis.slice(0,8),
        intro:(f.get('intro')||`Welcome to ${name}!`).trim(),spots:[],words:words.length>=2?words:null,lang:'the local language',langCode:null};
      S.custom.push(d);addCustomDest(d);PP.save();PP.toast(`${name} added to the map`);renderParent();};
    $$('[data-rm]').forEach(b=>b.onclick=()=>{const id=b.dataset.rm;S.custom=S.custom.filter(c=>c.id!==id);const i=PP.DESTS.findIndex(d=>d.id===id);if(i>=0)PP.DESTS.splice(i,1);PP.save();renderParent();});
  }
  else if(pTab==='sound'){
    const s=S.settings;
    B.innerHTML=`<div class="pcard"><h3>Sound</h3><label class="switch"><input type="checkbox" id="aOn" ${s.audio?'checked':''}> All audio on</label>
      ${[['music','Music'],['sfx','Sound effects'],['voice','Narration']].map(([k,n])=>`<div class="range"><span>${n}</span><input type="range" min="0" max="1" step=".05" data-v="${k}" value="${s[k]}"><span>${Math.round(s[k]*100)}%</span></div>`).join('')}
      <button class="btn ghost" id="testV">Test narration</button>
      <h3 style="margin-top:16px">Narrator voice</h3><p class="note">The best natural-sounding female voices on this device are listed first. Tap Try to hear one, then Use to keep it.</p>
      <div class="plist" id="vList"></div><p class="note">Narration uses this device’s built-in voices. On iPhone/iPad, extra voices (including Korean, Japanese and Icelandic) can be downloaded in Settings › Accessibility › Spoken Content › Voices.</p></div>`;
    $('#aOn').onchange=e=>{s.audio=e.target.checked;PP.save();PP.audio.apply();PP.audio.music(false);};
    $$('[data-v]').forEach(r=>r.oninput=()=>{s[r.dataset.v]=+r.value;r.nextElementSibling.textContent=Math.round(r.value*100)+'%';PP.save();PP.audio.apply();PP.audio.music(false);});
    $('#testV').onclick=()=>{PP.audio.unlock();PP.audio.say('Hello! Ready for an adventure?');};
    const vl=()=>{const cur=PP.audio.current();const vs=PP.audio.voices().slice(0,12);$('#vList').innerHTML=vs.length?vs.map(v=>`<div class="row gap" style="justify-content:space-between;border-bottom:1px solid #eee;padding:6px 0"><span><b>${esc(v.name)}</b> <span class="note">${esc(v.lang)}</span>${v.name===cur?' <b style="color:var(--leaf)">· in use</b>':''}</span><span class="row gap"><button class="btn ghost" data-try="${esc(v.name)}">Try</button><button class="btn" data-use="${esc(v.name)}">Use</button></span></div>`).join(''):'<p class="note">No voices found yet. Tap Test narration, then reopen this tab.</p>';
      $$('[data-try]').forEach(b=>b.onclick=()=>{const prev=s.voiceName;PP.audio.setVoice(b.dataset.try);PP.audio.say('Hi Linus and Wesley! Let\'s go on an adventure together.');PP.audio.setVoice(prev);});
      $$('[data-use]').forEach(b=>b.onclick=()=>{PP.audio.setVoice(b.dataset.use);PP.save();PP.audio.say('This is my new voice. Let\'s explore!');vl();});};
    vl(); try{speechSynthesis.onvoiceschanged=()=>{PP.audio.setVoice(s.voiceName);vl();};}catch(e){}
  }
  else if(pTab==='reset'){
    B.innerHTML=['linus','wesley'].map(k=>{const c=S.children[k];return `<div class="pcard"><h3>${esc(c.name)}</h3><div class="form"><label>Reset one place<select data-rd="${k}">${PP.DESTS.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('')}</select></label>
      <div class="row gap"><button class="btn ghost" data-rdo="${k}">Reset this place’s games & stamp</button><button class="btn warn" data-all="${k}">Reset all of ${esc(c.name)}’s progress</button></div></div></div>`}).join('')+`<p class="note">Resetting cannot be undone. Photos are not affected.</p>`;
    $$('[data-rdo]').forEach(b=>b.onclick=()=>{const k=b.dataset.rdo,id=$(`[data-rd="${k}"]`).value;delete S.children[k].dests[id];PP.save();PP.toast(`${D(id).name} reset for ${S.children[k].name}`);});
    $$('[data-all]').forEach(b=>{let armed=false;b.onclick=()=>{const k=b.dataset.all;if(!armed){armed=true;b.textContent='Tap again to confirm';setTimeout(()=>{armed=false;b.textContent=`Reset all of ${S.children[k].name}’s progress`;},3000);return;}
      const c=S.children[k];S.children[k]={...newChild(c.name,c.age),diff:c.diff};PP.save();PP.toast('Progress reset');renderParent();};});
  }
  else if(pTab==='assets'){
    B.innerHTML=`<div class="pcard"><h3>What’s included and what to add next</h3>
      <p><b>Artwork.</b> Every scene, animal, character, stamp and map is original illustrated SVG art drawn in code with a watercolor-style filter, so it loads instantly and works offline. No image-generation service was available while building, so there is no AI-painted artwork yet. Painted scene backgrounds can replace <code>PP.sceneSVG</code> in js/art.js one place at a time.</p>
      <p><b>Animal sounds.</b> Sounds are friendly synthesized stand-ins plus a spoken imitation, not real recordings. Real recordings can be added per animal (the <code>sound</code> field in js/data.js) and played in <code>PP.audio.animal</code>.</p>
      <p><b>Narration.</b> Uses the device’s text-to-speech voice. Recorded narration could replace <code>PP.audio.say</code>.</p>
      <p><b>Reference photos</b> are shown on each child’s card and passport. The illustrated Linus (yellow shirt, short black hair) and Wesley (blue shirt, longer hair with a top-knot) are drawn to match the family photos.</p>
      <p><b>Saving.</b> Progress, photos and settings are saved in this browser on this device. Using the same device and browser keeps everything; clearing website data erases it.</p></div>`;
  }
}

// ---------- boot ----------
document.addEventListener('pointerdown',()=>PP.audio.unlock(),{once:true});
loadRefs().then(()=>{renderTitle();PP.show('title');});
})();
