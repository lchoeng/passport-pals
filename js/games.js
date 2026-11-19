// Passport Pals — reusable mini-game library. Every game reads the destination's data, so new destinations get games for free.
(function(){
const PP = window.PP;
const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const rnd = n=>Math.floor(Math.random()*n);
const shuffle = a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick = a=>a[rnd(a.length)];
const cap = s=>s.charAt(0).toUpperCase()+s.slice(1);
const uniq = a=>[...new Set(a)];
PP.U = {$, $$, rnd, shuffle, pick, cap, uniq};

// ---------- adaptive learning ----------
PP.child = ()=>PP.state.children[PP.state.current];
PP.isLittle = ()=>PP.state.current==='wesley';
PP.level = key=>{
  const c=PP.child(); const sk=c.skills[key]; let l=sk?sk.lvl:1;
  l += c.diff==='easier'?-1:c.diff==='harder'?1:0; return Math.max(1,Math.min(3,l));
};
PP.record = (key,ok,concept)=>{
  const c=PP.child(); const sk=c.skills[key]||(c.skills[key]={r:0,w:0,streak:0,miss:0,lvl:1});
  if(ok){sk.r++;sk.streak++;sk.miss=0;if(sk.streak>=3&&sk.lvl<3){sk.lvl++;sk.streak=0;PP.toast('Level up! Trickier challenges unlocked');}}
  else{sk.w++;sk.streak=0;sk.miss++;if(sk.miss>=2&&sk.lvl>1){sk.lvl--;sk.miss=0;}}
  if(concept){const k=c.concepts[concept]||(c.concepts[concept]={r:0,w:0});ok?k.r++:k.w++;}
  PP.save();
};
// concepts this child has missed more than mastered, so they come back again
PP.weak = prefix=>{const c=PP.child();return Object.entries(c.concepts).filter(([k,v])=>k.startsWith(prefix)&&v.w>v.r).map(([k])=>k.slice(prefix.length));};

const ALSO={grizzly:['fish'],blackbear:['bugs'],crane:['bugs','plants'],magpie:['fruit'],tanuki:['bugs'],macaque:['leaves','bugs'],koi:['bugs'],howler:['fruit'],spidermonkey:['leaves'],toucan:['bugs'],flamingo:['plants'],humpback:['fish'],dolphin:['krill'],reindeer:['leaves'],moose:['plants','grass'],axolotl:['fish'],horse:['plants'],sheep:['plants'],turtle:[],arcticfox:['fruit','fish']};
const eats = id=>[PP.ANIMALS[id].food,...(ALSO[id]||[])].filter(Boolean);
const plural = w=>/(fish|sheep|moose|koi|deer)$/.test(w)?w:/(s|x|ch|sh)$/.test(w)?w+'es':w+'s';
PP.plural=plural;
const animalWord = id=>{const a=PP.ANIMALS[id]; if(id==='koi') return 'koi'; if(id==='manta') return 'manta'; return a.short.split(' ').pop();};
const allAnimals = ()=>Object.keys(PP.ANIMALS);
const destAnimals = d=>d.animals.filter(a=>PP.ANIMALS[a]);
// choose n animals from destination, topping up from the whole library, preferring weak concepts
function chooseAnimals(d,n,prefix){
  const weak=PP.weak(prefix||'animal:').filter(a=>destAnimals(d).includes(a));
  let pool=uniq([...shuffle(weak),...shuffle(destAnimals(d))]);
  if(pool.length<n) pool=uniq([...pool,...shuffle(allAnimals())]);
  return pool.slice(0,n);
}
const others = (id,n,filter=()=>true)=>shuffle(allAnimals().filter(a=>a!==id&&filter(a))).slice(0,n);
const aniBtn = (id,label)=>({html:PP.animalSVG(id,'pic'),label});

// fact card shown after an Animal Detective answer
function factCard(id){
  const a=PP.ANIMALS[id], h=PP.HABITATS[a.hab], little=PP.isLittle();
  const rows=little?[['Lives in',h.name],['Says',a.sound[1]]]:[['Lives in',h.name],['Eats',a.diet],['Size',a.size],['Speed',a.speed],['Special skill',a.adapt]];
  return {html:`<div class="factcard">${PP.animalSVG(id,'pic')}<div><h3>${cap(little?a.short:a.name)}</h3><p class="lead">${little?a.simple:a.fact}</p>
    <dl>${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div></div>`,
    say: little?`This is the ${a.short}! ${a.simple} It lives in ${h.say}.`:`The ${a.name}. ${a.fact} It lives in ${h.say}.`};
}
// ---------- the quiz engine (tap or drag) ----------
let G = null; // current game run
function quiz(rounds, meta){
  let i=0, stars=0, locked=false;
  const host=$('#gArea');
  G={rounds,meta,repeat:()=>say(rounds[i]),hint:()=>hint()};
  const say = r=>{ if(r.sayParts) PP.audio.sayParts(r.sayParts); else PP.audio.say(r.say||r.text.replace(/<[^>]+>/g,'')); };
  const praise = ()=>pick(PP.isLittle()?['Great job!','You did it!','Yay!','Super!','Wow, amazing!']:['Excellent!','You got it!','Brilliant thinking!','Nice work, explorer!','Correct!']);
  function render(){
    if(i>=rounds.length) return finish();
    const r=rounds[i]; locked=false;
    if(!r.keep) r.choices=shuffle(r.choices);
    $('#gProg').innerHTML=rounds.map((_,k)=>`<i class="${k<i?'done':k===i?'now':''}"></i>`).join('');
    host.innerHTML=`<div class="q ${r.kind||''}"><div class="qtext">${r.text}</div>${r.stage?`<div class="stage">${r.stage}</div>`:''}
      ${r.drag?`<div class="tokenwrap"><div class="token" id="token">${r.drag}</div><div class="draghint">Drag me!</div></div>`:''}
      <div class="choices n${r.choices.length} ${r.textual?'textual':''}">${r.choices.map((c,j)=>`<button class="choice" data-j="${j}">${c.html||''}${c.label?`<span class="lbl">${c.label}</span>`:''}</button>`).join('')}</div>
      <div class="fb" hidden></div></div>`;
    $$('.choice',host).forEach(b=>b.onclick=()=>answer(+b.dataset.j));
    if(r.drag) dragify($('#token'),j=>answer(j));
    if(r.init) r.init(host);
    setTimeout(()=>say(r),250);
  }
  function answer(j){
    if(locked) return; const r=rounds[i], c=r.choices[j], btns=$$('.choice',host);
    locked=true; PP.record(r.skill,!!c.ok,r.concept);
    if(r.fact){
      const k=r.choices.findIndex(x=>x.ok); btns[k].classList.add('right'); if(!c.ok){btns[j].classList.add('wrong');btns[k].classList.add('glow');}
      if(c.ok){stars++;PP.audio.sfx('good');PP.kidReact('cheer');}else{PP.audio.sfx('soft');PP.kidReact('wow');}
      const fc=factCard(r.fact), head=c.ok?praise():(PP.isLittle()?'Good try! Here it is:':'Good try! The answer is:');
      const fb=$('.fb',host); fb.hidden=false;
      fb.innerHTML=`<div class="fbbox wide"><p class="fbhead ${c.ok?'yes':''}">${head}</p>${fc.html}<button class="big primary next" id="nextQ"><span>Next</span>${PP.ICON.check}</button></div>`;
      PP.audio.say(head+' '+fc.say);
      $('#nextQ').onclick=()=>{PP.audio.sfx('tap');i++;render();};
      return;
    }
    if(c.ok){
      btns[j].classList.add('right'); stars++; PP.audio.sfx('good'); PP.kidReact('cheer');
      const tok=$('#token'); if(tok){tok.classList.add('fed');}
      PP.audio.say(praise()+(r.after?' '+r.after:''));
      setTimeout(()=>{i++;render();}, r.after?2600:1500);
    }else{
      btns[j].classList.add('wrong'); const k=r.choices.findIndex(x=>x.ok); btns[k].classList.add('right','glow');
      PP.audio.sfx('soft'); PP.kidReact('wow');
      const fb=$('.fb',host); fb.hidden=false;
      fb.innerHTML=`<div class="fbbox"><div class="fbtext">${r.explainHtml||''}<p>${r.explain}</p></div><button class="big next" id="nextQ">${PP.ICON.check}<span>Next</span></button></div>`;
      PP.audio.say(r.explain);
      $('#nextQ').onclick=()=>{PP.audio.sfx('tap');i++;render();};
    }
  }
  function hint(){
    const r=rounds[i]; if(!r||locked) return; const btns=$$('.choice',host);
    if(PP.isLittle()){ const k=r.choices.findIndex(x=>x.ok); btns[k].classList.add('pulse'); PP.audio.say(r.hintSay||'Look at the one that is wiggling!'); }
    else { const wrong=r.choices.map((c,k)=>c.ok?-1:k).filter(k=>k>=0&&!btns[k].classList.contains('gone')); if(wrong.length>1){btns[pick(wrong)].classList.add('gone');PP.audio.say(r.hintSay||'I took away one answer. You can do it!');} else PP.audio.say(r.hintSay||'Think carefully. You are close!'); }
  }
  function finish(){ $('#gProg').innerHTML=''; PP.finishGame(meta,stars,rounds.length); }
  render();
}

function dragify(tok,onDrop){
  let sx,sy,on=false;
  tok.addEventListener('pointerdown',e=>{on=true;sx=e.clientX;sy=e.clientY;tok.setPointerCapture(e.pointerId);tok.classList.add('dragging');PP.audio.sfx('pop');});
  tok.addEventListener('pointermove',e=>{if(!on)return;tok.style.transform=`translate(${e.clientX-sx}px,${e.clientY-sy}px) scale(1.08)`;
    tok.style.pointerEvents='none'; const el=document.elementFromPoint(e.clientX,e.clientY); tok.style.pointerEvents='';
    $$('.choice').forEach(b=>b.classList.toggle('over',!!el&&b.contains(el)));});
  const end=e=>{if(!on)return;on=false;tok.classList.remove('dragging');tok.style.visibility='hidden';const el=document.elementFromPoint(e.clientX,e.clientY);tok.style.visibility='';
    $$('.choice').forEach(b=>b.classList.remove('over'));const b=el&&el.closest('.choice');tok.style.transform='';if(b)onDrop(+b.dataset.j);};
  tok.addEventListener('pointerup',end); tok.addEventListener('pointercancel',end);
}

// ---------- round generators ----------
const GEN = {};
GEN.detective = d=>{
  const little=PP.isLittle(), lvl=PP.level('animals'), n=little?4:5;
  const targets=chooseAnimals(d,Math.min(n,8)); while(targets.length<n) targets.push(pick(destAnimals(d)));
  return targets.map((id,k)=>{
    const a=PP.ANIMALS[id], nc=little?(lvl>=3?4:3):(lvl>=2?4:3);
    const pool=uniq([...destAnimals(d).filter(x=>x!==id),...others(id,6)]).filter(x=>PP.ANIMALS[x].short!==a.short);
    const opts=[id,...shuffle(pool).slice(0,nc-1)];
    const sound = little && lvl>=2 && k%2===1;
    if(little) return {skill:'animals',concept:'animal:'+id,
      text: sound?`Who says “${a.sound[1]}”?`:`Find the <b>${a.short}</b>!`,
      say: sound?`Listen! ${a.sound[1]} Who says that?`:`Can you find the ${a.short}?`,
      init: sound?()=>setTimeout(()=>PP.audio.animal(a.sound[0]),1800):null,
      choices: opts.map(x=>({html:PP.animalSVG(x,'pic'),ok:x===id})),
      explain:`This is the ${a.short}! ${a.simple}`, fact:id};
    const clues=a.clue.slice(0, lvl>=3?1:lvl>=2?2:3);
    return {skill:'animals',concept:'animal:'+id, text:`<span class="clues">${clues.map(c=>`<span>“${c}”</span>`).join('')}</span>Who am I?`,
      say:clues.join(' ')+' Who am I?', choices:opts.map(x=>({...aniBtn(x,cap(PP.ANIMALS[x].short)),ok:x===id})),
      explain:`It is the ${a.name}. ${a.fact}`, fact:id};
  });
};
GEN.feed = d=>{
  const little=PP.isLittle(), lvl=PP.level('animals');
  const fed=uniq([...destAnimals(d),...shuffle(allAnimals())]).filter(a=>PP.ANIMALS[a].food);
  const out=[];
  for(const id of fed){
    if(out.length>=(little?4:5)) break;
    const a=PP.ANIMALS[id], food=PP.FOODS[a.food];
    if(little){
      const rivals=[]; const seenFood=new Set([a.food]);
      for(const o of shuffle(uniq([...destAnimals(d),...allAnimals()]))){ const f=PP.ANIMALS[o].food; if(f&&!seenFood.has(f)&&!eats(o).includes(a.food)){seenFood.add(f);rivals.push(o);} if(rivals.length>=(lvl>=2?2:1)) break; }
      out.push({skill:'animals',concept:'food:'+id, drag:PP.foodSVG(a.food), kind:'dragq',
        text:`Who eats <b>${food.name.toLowerCase()}</b>? Drag the food to the hungry animal!`, say:`Who eats ${food.name}? Drag the food to the hungry animal!`,
        choices:[id,...rivals].map(x=>({html:PP.animalSVG(x,'pic'),ok:x===id})),
        explain:`The ${a.short} eats ${food.name.toLowerCase()}! Yum!`, explainHtml:PP.animalSVG(id,'pic sm')});
    }else{
      const typeQ = lvl>=3 && /^(Herbivore|Carnivore|Omnivore)/.test(a.diet) && out.length%2===1;
      if(typeQ){ const t=a.diet.split(/[: ]/)[0];
        out.push({skill:'science',concept:'diet:'+id, text:`Is the <b>${a.short}</b> a herbivore, carnivore or omnivore?`, stage:PP.animalSVG(id,'pic stagepic'), textual:true,
          choices:['Herbivore','Carnivore','Omnivore'].map(x=>({label:x+(x==='Herbivore'?' (plants)':x==='Carnivore'?' (meat)':' (both)'),ok:x===t})), keep:true,
          explain:`The ${a.short} is a ${t.toLowerCase()}. ${a.diet}.`});
      } else {
        const foods=shuffle(Object.keys(PP.FOODS).filter(f=>!eats(id).includes(f))).slice(0,lvl>=2?3:2);
        out.push({skill:'animals',concept:'food:'+id, text:`What does the <b>${a.short}</b> eat?`, stage:PP.animalSVG(id,'pic stagepic'),
          choices:[a.food,...foods].map(f=>({html:PP.foodSVG(f),label:PP.FOODS[f].name,ok:f===a.food})),
          explain:`The ${a.short}: ${a.diet}.`, after:a.diet+'.'});
      }
    }
  }
  return out;
};
GEN.habitat = d=>{
  const little=PP.isLittle(), lvl=PP.level('habitats');
  const ids=chooseAnimals(d,little?4:2,'hab:');
  const habRound = id=>{
    const a=PP.ANIMALS[id], h=PP.HABITATS[a.hab], n=little?(lvl>=2?3:2):(lvl>=2?4:3);
    const wrong=shuffle(Object.keys(PP.HABITATS).filter(k=>k!==a.hab&&!(a.hab==='ocean'&&k==='reef')&&!(a.hab==='reef'&&k==='ocean'))).slice(0,n-1);
    const pl=plural(a.short);
    return {skill:'habitats',concept:'hab:'+id, kind:little?'dragq':'', drag:little?PP.animalSVG(id,'pic'):null,
      text: little?`Where does the <b>${a.short}</b> live? Drag it home!`:`Where does the <b>${a.short}</b> live?`, stage:little?null:PP.animalSVG(id,'pic stagepic'),
      say: little?`Where does the ${a.short} live? Drag it to its home!`:`Where does the ${a.short} live?`,
      choices:[a.hab,...wrong].map(k=>({html:PP.habSVG(k),label:PP.HABITATS[k].name,ok:k===a.hab})),
      explain:`${cap(pl)} live in ${h.say}. It is ${h.note}!`, explainHtml:PP.habSVG(a.hab)};
  };
  const rounds=ids.map(habRound);
  if(!little){
    const bank=d.sci&&d.sci.length?d.sci:destAnimals(d).map(id=>{const a=PP.ANIMALS[id];return {q:`Which is true about the ${a.short}?`,a:a.adapt,w:[`It lives on the moon`,`It has no ${a.hab==='ocean'?'fins':'legs'}`],e:a.adapt};});
    shuffle(bank).slice(0,3).forEach(s=>rounds.push({skill:'science',concept:'sci:'+s.q.slice(0,30), text:s.q, textual:true,
      choices:[{label:s.a,ok:true},...s.w.map(w=>({label:w}))], explain:s.e, after:s.e}));
  }
  return rounds;
};
const WEATHER = {
  sunny:`<rect width="100" height="80" fill="#cfeaf7"/><circle cx="50" cy="38" r="16" fill="#f8c537"/>${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M${50+22*Math.cos(a)} ${38+22*Math.sin(a)} l${8*Math.cos(a)} ${8*Math.sin(a)}" stroke="#f8a937" stroke-width="4" stroke-linecap="round"/>`}).join('')}`,
  rainy:`<rect width="100" height="80" fill="#c9d3dc"/><ellipse cx="50" cy="28" rx="30" ry="14" fill="#8e9aa6"/>${[30,44,58,72,38,52,66].map((x,i)=>`<path d="M${x} ${46+(i>3?12:0)} l-3 8" stroke="#3f86b5" stroke-width="3" stroke-linecap="round"/>`).join('')}`,
  snowy:`<rect width="100" height="80" fill="#e3edf4"/><ellipse cx="50" cy="26" rx="30" ry="13" fill="#b9c6d2"/>${[[30,48],[48,56],[66,46],[40,66],[60,68],[74,60]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="#a9bccb"/>`).join('')}<rect y="72" width="100" height="8" fill="#fff"/>`,
  windy:`<rect width="100" height="80" fill="#d9eef0"/>${[24,40,56].map((y,i)=>`<path d="M10 ${y} q30 -10 50 0 q14 6 20 -4" stroke="#7fa8c8" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}<path d="M70 70 q4 -14 12 -16" stroke="#6aa84f" stroke-width="3" fill="none"/>`
};
const wx = k=>`<svg viewBox="0 0 100 80"><g filter="url(#wc)">${WEATHER[k]}</g></svg>`;
GEN.words = d=>{
  const little=PP.isLittle(), lvl=PP.level('words');
  if(d.weather || !d.words){
    if(little){
      const qs=[['snowy','Which picture is snowy?','Snow is cold and white. Alaska gets lots of snow in winter!'],['sunny','Which picture is sunny?','The sun is bright and warm!'],['rainy','Which picture is rainy?','Rain falls from gray clouds. Splash!'],['windy','Which picture is windy?','Wind blows the leaves and clouds!']];
      return shuffle(qs).map(([k,t,e])=>({skill:'words',concept:'wx:'+k,text:t,choices:shuffle(Object.keys(WEATHER)).filter(x=>x!==k).slice(0,lvl>=2?3:2).concat(k).map(x=>({html:wx(x),ok:x===k})),explain:e,explainHtml:wx(k)}));
    }
    const bank=[['What season comes after winter?','Spring',['Summer','Fall'],'The seasons go winter, spring, summer, then fall.'],
      ['In Alaska, summer days are…','Very long, with sun late at night',['Very short and dark','Exactly like winter'],'In summer the far north tilts toward the sun, so it stays light very late.'],
      ['How does snow form?','Water in cold clouds freezes into crystals',['Clouds melt','Ice cubes fall from planes'],'Tiny water drops in cold clouds freeze into six-sided crystals that fall as snowflakes.'],
      ['When do many bears sleep in dens?','Winter',['Summer','Spring'],'Bears eat lots in autumn, then sleep through much of the winter.'],
      ['Which keeps animals warm in the cold?','Thick fur and fat',['Thin skin','Wet feathers'],'Fur traps warm air and fat (blubber) holds in body heat.'],
      ['When do bull moose drop their antlers?','In winter, then they grow new ones',['Never','Every day'],'Bull moose shed antlers in winter and grow a new set each spring and summer.']];
    return shuffle(bank).slice(0,5).map(([q,a,w,e])=>({skill:'science',concept:'wx:'+q.slice(0,20),text:q,textual:true,choices:[{label:a,ok:true},...w.map(x=>({label:x}))],explain:e,after:e}));
  }
  const W=d.words, L=d.langCode, sayW=w=>w.orig||w.w;
  return shuffle(W).slice(0,little?4:5).map(w=>{
    const n=little?(lvl>=2?3:2):(lvl>=2?4:3);
    const wrong=shuffle(W.filter(x=>x.en!==w.en&&x.icon!==w.icon)).slice(0,n-1);
    if(little) return {skill:'words',concept:'word:'+w.w,text:`In ${d.lang}, <b>${w.w}</b> means <b>${w.en}</b>! Tap <b>${w.en}</b>.`,
      sayParts:[[`In ${d.lang},`],[sayW(w),L],[`means ${w.en}. Can you tap ${w.en}?`]],
      choices:[w,...wrong].map(x=>({html:PP.wordSVG(x.icon),ok:x===w})), explain:`${w.w} means ${w.en}!`, explainHtml:PP.wordSVG(w.icon)};
    if(lvl>=3) return {skill:'words',concept:'word:'+w.w,text:`How do you say <b>${w.en}</b> in ${d.lang}?`,textual:true,
      choices:[w,...wrong].map(x=>({label:x.w,ok:x===w})), explain:`${cap(w.en)} is ${w.w}${w.orig?` (${w.orig})`:''}.`};
    return {skill:'words',concept:'word:'+w.w,text:`What does <b>${w.w}</b>${w.orig?` <small>${w.orig}</small>`:''} mean?`,
      sayParts:[['What does'],[sayW(w),L],['mean?']],
      choices:[w,...wrong].map(x=>({html:PP.wordSVG(x.icon),label:x.en,ok:x===w})), explain:`${w.w} means ${w.en}.`};
  });
};
const SHAPE_SAY={circle:'A circle is round like a ball.',square:'A square has 4 sides that are all the same.',triangle:'A triangle has 3 sides and 3 corners.',rectangle:'A rectangle has 4 sides: 2 long and 2 short.',oval:'An oval is like a stretched circle, like an egg.',star:'A star has 5 points!',heart:'A heart is the shape of love!',hexagon:'A hexagon has 6 sides, like a honeycomb.',pentagon:'A pentagon has 5 sides.',octagon:'An octagon has 8 sides, like a stop sign.',trapezoid:'A trapezoid has 4 sides, and only 2 are parallel.'};
const COLORS=['#e8577a','#f39c33','#f8c537','#6aa84f','#3fa9c8','#5b6fd6','#9d7cd8','#2aa198'];
GEN.shapes = d=>{
  const little=PP.isLittle(), lvl=PP.level('shapes');
  const set=little?PP.SHAPES[lvl]:PP.SHAPES[3];
  const weak=PP.weak('shape:').filter(s=>set.includes(s));
  const targets=uniq([...weak,...shuffle(set)]).slice(0,5);
  return targets.map((s,k)=>{
    if(!little && k%2===1 && PP.SIDES[s]){
      const n=PP.SIDES[s]; const opts=uniq([n,...shuffle([3,4,5,6,7,8].filter(x=>x!==n)).slice(0,3)]);
      return {skill:'shapes',concept:'shape:'+s,text:`How many sides does a <b>${s}</b> have?`,stage:PP.shapeSVG(s,pick(COLORS)),
        choices:opts.map(x=>({label:String(x),ok:x===n})),textual:true,explain:SHAPE_SAY[s]};
    }
    const opts=[s,...shuffle(set.filter(x=>x!==s)).slice(0,little?(lvl>=2?3:2):3)];
    const cols=shuffle(COLORS);
    return {skill:'shapes',concept:'shape:'+s,text:`Shape hunt in ${d.name}: find the <b>${s}</b>!`,say:`Can you find the ${s}?`,
      choices:opts.map((x,j)=>({html:PP.shapeSVG(x,cols[j]),ok:x===s})),explain:`This is the ${s}. ${SHAPE_SAY[s]}`,explainHtml:PP.shapeSVG(s,cols[0])};
  });
};
GEN.letters = d=>{
  const little=PP.isLittle(), lvl=PP.level('letters');
  const ids=chooseAnimals(d,8); const AB='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const out=[];
  for(let k=0;k<(little?4:5);k++){
    const id=ids[k%ids.length], w=animalWord(id), L=w[0].toUpperCase();
    if(little){
      if(lvl===1||(lvl===2&&k%2===0)){
        const opts=[L,...shuffle(AB.split('').filter(x=>x!==L)).slice(0,lvl>=2?3:2)];
        out.push({skill:'letters',concept:'letter:'+L,text:`<b>${cap(w)}</b> starts with <b class="bigL">${L}</b>. Find the letter <b>${L}</b>!`,stage:PP.animalSVG(id,'pic stagepic'),
          say:`${cap(w)} starts with ${L}. ${L}, ${L}, ${w}! Can you find the letter ${L}?`,choices:opts.map(x=>({html:`<span class="letter">${x}</span>`,ok:x===L})),
          explain:`This is ${L}. ${L} is for ${w}!`,explainHtml:`<span class="letter">${L}</span>`});
      } else if(lvl===2){
        const rivals=shuffle(allAnimals().filter(a=>animalWord(a)[0].toUpperCase()!==L)).filter((a,i,arr)=>arr.findIndex(b=>animalWord(b)[0]===animalWord(a)[0])===i).slice(0,2);
        out.push({skill:'letters',concept:'letter:'+L,text:`Find the animal that starts with <b class="bigL">${L}</b>!`,say:`Which animal starts with ${L}?`,
          choices:[id,...rivals].map(x=>({html:PP.animalSVG(x,'pic'),ok:x===id})),explain:`${cap(w)} starts with ${L}!`,explainHtml:PP.animalSVG(id,'pic sm')});
      } else {
        const p=rnd(24), a=AB[p], nx=AB[p+1];
        const opts=[nx,...shuffle(AB.split('').filter(x=>x!==nx&&x!==a)).slice(0,2)];
        out.push({skill:'letters',concept:'abc:'+a,text:`A B C order! What comes after <b class="bigL">${a}</b>?`,say:`Let's sing the alphabet! What letter comes after ${a}?`,
          choices:opts.map(x=>({html:`<span class="letter">${x}</span>`,ok:x===nx})),explain:`After ${a} comes ${nx}! ${AB.slice(Math.max(0,p-2),p+2).split('').join(', ')}.`,explainHtml:`<span class="letter">${a} ${nx}</span>`});
      }
    } else {
      if(lvl<=2){
        const pos=lvl===1?0:1+rnd(Math.max(1,w.length-2)); const ch=w[pos].toUpperCase();
        const shown=w.toUpperCase().split('').map((c,i)=>i===pos?'_':c).join('');
        const opts=uniq([ch,...shuffle(AB.split('').filter(x=>x!==ch)).slice(0,3)]);
        out.push({skill:'letters',concept:'spell:'+w,text:`Fill in the missing letter: <b class="spell">${shown}</b>`,stage:PP.animalSVG(id,'pic stagepic'),say:`Which letter is missing in ${w}?`,
          choices:opts.map(x=>({html:`<span class="letter">${x}</span>`,ok:x===ch})),explain:`${w.toUpperCase()}: the missing letter is ${ch}.`});
      } else {
        const trio=uniq([id,...shuffle(allAnimals())]).map(a=>animalWord(a)).filter((x,i,arr)=>arr.indexOf(x)===i).slice(0,3);
        const first=[...trio].sort()[0];
        out.push({skill:'letters',concept:'abc:'+first,text:`ABC order: which word comes <b>first</b>?`,textual:true,
          choices:trio.map(x=>({label:cap(x),ok:x===first})),explain:`${cap(first)} comes first because ${first[0].toUpperCase()} comes earliest in the alphabet.`});
      }
    }
  }
  return out;
};
const icons=(id,n,cls='')=>Array.from({length:n},(_,i)=>`<span class="ct ${cls}" data-i="${i}">${PP.animalSVG(id,'mini',true)}</span>`).join('');
GEN.count = d=>{
  const little=PP.isLittle(), lvl=little?PP.level('count'):PP.level('math');
  const ids=destAnimals(d); const out=[];
  const numChoices=(ans,spread=3)=>{const s=new Set([ans]);while(s.size<3){const v=ans+rnd(spread*2+1)-spread;if(v>0&&v!==ans)s.add(v);}return [...s].map(x=>({label:String(x),ok:x===ans}));};
  for(let k=0;k<5;k++){
    const id=ids[k%ids.length], a=PP.ANIMALS[id], word=animalWord(id), pl=(n)=>n===1?word:plural(word);
    if(little){
      const addMode = lvl>=2 && k%2===1;
      if(addMode){
        const sub = lvl>=3 && rnd(2)===0; let x=1+rnd(5), y=1+rnd(4); if(sub&&y>=x){[x,y]=[y+1,x];}
        if(!sub&&x+y>10) y=10-x;
        const ans=sub?x-y:x+y;
        out.push({skill:'add',concept:(sub?'sub:':'add:')+x+'_'+y,kind:'textual',
          text: sub?`${x} ${pl(x)}. ${y} swim away. How many are left?`:`${x} ${pl(x)} and ${y} more ${pl(y)}. How many altogether?`,
          stage: sub?`<div class="row">${Array.from({length:x},(_,i)=>`<span class="ct ${i>=x-y?'away':''}">${PP.animalSVG(id,'mini',true)}</span>`).join('')}</div>`:`<div class="row">${icons(id,x)}<b class="op">+</b>${icons(id,y)}</div>`,
          choices:numChoices(ans,2),textual:true, explain: sub?`${x} take away ${y} is ${ans}.`:`${x} plus ${y} makes ${ans}! Count them: ${Array.from({length:ans},(_,i)=>i+1).join(', ')}.`});
      } else {
        const max=lvl===1?5:lvl===2?10:20; const n=Math.max(2,1+rnd(max));
        out.push({skill:'count',concept:'count:'+n,text:`How many ${pl(2)}? Tap each one to count!`,stage:`<div class="row wrap">${icons(id,n,'tapme')}</div>`,
          choices:numChoices(n,Math.min(3,Math.ceil(n/3))),textual:true,explain:`There are ${n} ${pl(n)}. ${n<=10?Array.from({length:n},(_,i)=>i+1).join(', ')+'!':''}`,
          init:host=>{let c=0;$$('.tapme',host).forEach(el=>el.onclick=()=>{if(el.dataset.n)return;c++;el.dataset.n=c;el.insertAdjacentHTML('beforeend',`<b class="num">${c}</b>`);PP.audio.sfx('pop');PP.audio.say(String(c));});}});
      }
    } else {
      const t=(lvl===1?['add','skip']:lvl===2?['mult','div','skip','word']:['mult','div','word','big'])[k%(lvl===1?2:4)];
      if(t==='add'){const x=5+rnd(10),y=2+rnd(8),sub=rnd(2)===0&&x>y;const ans=sub?x-y:x+y;
        out.push({skill:'math',concept:'addsub',text:sub?`There were ${x} ${pl(x)}. ${y} went to sleep. How many are still awake?`:`${x} ${pl(x)} met ${y} more. How many now?`,choices:numChoices(ans),textual:true,explain:`${x} ${sub?'−':'+'} ${y} = ${ans}.`});}
      else if(t==='skip'){const by=lvl===1?pick([2,5,10]):pick([3,4,5]);const start=by*(1+rnd(3));const seq=[start,start+by,start+2*by];const ans=start+3*by;
        out.push({skill:'skip',concept:'skip:'+by,text:`Count by ${by}s: <b class="spell">${seq.join(', ')}, ?</b>`,say:`Count by ${by}s. ${seq.join(', ')}. What comes next?`,choices:numChoices(ans,by).map(c=>c),textual:true,explain:`Add ${by} each time: ${[...seq,ans].join(', ')}.`});}
      else if(t==='mult'){const g=2+rnd(lvl>=3?4:3),e=2+rnd(lvl>=3?4:3),ans=g*e;
        out.push({skill:'mult',concept:`mult:${g}x${e}`,text:`${g} groups of ${e} ${pl(e)}. How many ${pl(2)} altogether?`,stage:`<div class="groups">${Array.from({length:g},()=>`<div class="grp">${icons(id,e)}</div>`).join('')}</div>`,
          choices:numChoices(ans,3),textual:true,explain:`${g} groups of ${e} is ${g} × ${e} = ${ans}. Skip count: ${Array.from({length:g},(_,i)=>(i+1)*e).join(', ')}.`});}
      else if(t==='div'){const sharers=2+rnd(3),each=2+rnd(lvl>=3?4:3),total=sharers*each;
        out.push({skill:'div',concept:`div:${total}/${sharers}`,text:`Share ${total} fish equally among ${sharers} ${pl(sharers)}. How many fish does each one get?`,stage:`<div class="row wrap">${Array.from({length:total},()=>`<span class="ct">${PP.foodSVG('fish')}</span>`).join('')}</div><div class="row">${icons(id,sharers)}</div>`,
          choices:numChoices(each,2),textual:true,explain:`${total} ÷ ${sharers} = ${each}. Each ${word} gets ${each} fish.`});}
      else if(t==='word'){const m=2+rnd(4),e=2+rnd(4),ans=m*e;const it=pick(['bananas','berries','shells','leaves']);
        out.push({skill:'mult',concept:`mult:${m}x${e}`,text:`${m} ${pl(m)} each have ${e} ${it}. How many ${it} in all?`,stage:`<div class="groups">${Array.from({length:m},()=>`<div class="grp">${PP.animalSVG(id,'mini',true)}<span class="dots">${'●'.repeat(e)}</span></div>`).join('')}</div>`,
          choices:numChoices(ans,3),textual:true,explain:`${m} × ${e} = ${ans} ${it}.`});}
      else {const x=20+rnd(60),y=10+rnd(30);out.push({skill:'math',concept:'big',text:`${x} + ${y} = ?`,choices:numChoices(x+y,10),textual:true,explain:`${x} + ${y} = ${x+y}. Add the tens, then the ones.`});}
    }
  }
  return out;
};

// ---------- non-quiz games ----------
function puzzle(d,meta){
  const little=PP.isLittle(), lvl=PP.level('puzzle');
  const [cols,rows]=little?(lvl>=2?[3,5]:[3,4]):(lvl>=3?[7,7]:lvl===2?[6,7]:[5,6]);
  PP.photoList(d.id).then(list=>{
    const src=(list.find(p=>p.fav)||list[0]||{}).src;
    const host=$('#gArea');
    if(!src){host.innerHTML=`<p class="qtext">Add a photo for ${d.name} in the Parent area to make a puzzle!</p>`;return;}
    const N=cols*rows; let order=shuffle([...Array(N).keys()]); if(order.every((v,i)=>v===i)) order.reverse();
    let sel=null;
    G={repeat:()=>PP.audio.say(`Tap two pieces to swap them, and build our ${d.name} picture!`),hint:()=>{const i=order.findIndex((v,i)=>v!==i);if(i<0)return;const j=order.indexOf(i);$$('.pc')[j]?.classList.add('pulse');$$('.pc')[i]?.classList.add('pulse');PP.audio.say('These two pieces want to swap!');}};
    host.innerHTML=`<div class="puzwrap"><div class="qtext">Build the ${d.name} picture! <small>${N} pieces</small></div><div class="puzrow"><div class="board" style="--c:${cols};--r:${rows}"></div><figure class="ref"><img src="${src}" alt=""><figcaption>Look!</figcaption></figure></div></div>`;
    const board=$('.board',host);
    const draw=()=>{board.innerHTML=order.map((v,i)=>{const c=v%cols,r=Math.floor(v/cols);return `<button class="pc ${v===i?'ok':''}" data-i="${i}" style="background-image:url('${src}');background-position:${cols>1?c/(cols-1)*100:0}% ${rows>1?r/(rows-1)*100:0}%"></button>`}).join('');};
    draw(); G.repeat();
    let down=null;
    board.onpointerdown=e=>{const b=e.target.closest('.pc');if(!b||b.classList.contains('ok'))return;down=+b.dataset.i;};
    board.onpointerup=e=>{const el=document.elementFromPoint(e.clientX,e.clientY);const b=el&&el.closest('.pc');if(down===null||!b)return;const j=+b.dataset.i;const i=down;down=null;
      if(i!==j&&!b.classList.contains('ok')){swap(i,j);return;}
      if(sel===null){sel=i;$$('.pc',board)[i].classList.add('sel');PP.audio.sfx('tap');}
      else if(sel===i){sel=null;draw();}
      else{swap(sel,i);}};
    function swap(i,j){[order[i],order[j]]=[order[j],order[i]];sel=null;const before=$$('.pc.ok',board).length;draw();const after=$$('.pc.ok',board).length;
      if(after>before){PP.audio.sfx('pop');} else PP.audio.sfx('tap');
      if(order.every((v,k)=>v===k)){PP.record('puzzle',true,'puzzle:'+d.id);board.classList.add('solved');PP.audio.sfx('win');setTimeout(()=>PP.finishGame(meta,3,3,`<img class="solvedimg" src="${src}" alt="">`),900);}}
  });
}
function memory(d,meta){
  const little=PP.isLittle(), lvl=PP.level('memory');
  const pairs=little?[3,4,6][lvl-1]:[6,8,8][lvl-1];
  const ids=uniq([...shuffle(destAnimals(d)),...shuffle(allAnimals())]).slice(0,pairs);
  const deck=shuffle([...ids,...ids]); let open=[],matched=0,busy=false,flips=0;
  G={repeat:()=>PP.audio.say('Flip two cards. Find the animals that match!'),hint:()=>{const k=deck.findIndex((x,i)=>!$$('.card')[i].classList.contains('m'));if(k<0)return;deck.forEach((x,i)=>{if(x===deck[k])$$('.card')[i].classList.add('peek');});setTimeout(()=>$$('.card').forEach(c=>c.classList.remove('peek')),1200);}};
  const host=$('#gArea');
  host.innerHTML=`<div class="qtext">Find the matching pairs!</div><div class="mem n${deck.length}">${deck.map((id,i)=>`<button class="card" data-i="${i}"><span class="back"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M14 20h12M20 14v12" stroke="#fff" stroke-width="3" opacity=".7"/></svg></span><span class="front">${PP.animalSVG(id,'pic',true)}</span></button>`).join('')}</div>`;
  G.repeat();
  $$('.card',host).forEach(c=>c.onclick=()=>{
    if(busy||c.classList.contains('up')||c.classList.contains('m'))return;
    c.classList.add('up');PP.audio.sfx('tap');flips++;const id=deck[+c.dataset.i];if(little)PP.audio.say(PP.ANIMALS[id].short);open.push(c);
    if(open.length===2){busy=true;const [a,b]=open;const ok=deck[+a.dataset.i]===deck[+b.dataset.i];
      setTimeout(()=>{if(ok){a.classList.add('m');b.classList.add('m');matched++;PP.audio.sfx('good');PP.kidReact('cheer');}else{a.classList.remove('up');b.classList.remove('up');}
        open=[];busy=false;if(matched===pairs){PP.record('memory',flips<=pairs*3,'memory:'+d.id);PP.finishGame(meta,3,3);}},ok?400:900);}
  });
}

PP.GAMES = [
  {key:'detective',name:'Animal Detective',icon:()=>`<svg viewBox="0 0 60 60"><circle cx="25" cy="25" r="14" fill="#fff" stroke="#5a4636" stroke-width="5"/><path d="M35 35 L50 50" stroke="#5a4636" stroke-width="7" stroke-linecap="round"/><circle cx="25" cy="25" r="8" fill="#bfe3f2"/></svg>`,gen:GEN.detective},
  {key:'feed',name:'Feed the Animals',icon:()=>PP.foodSVG('fruit'),gen:GEN.feed},
  {key:'habitat',name:'Habitat Explorer',icon:()=>PP.habSVG('rainforest'),gen:GEN.habitat},
  {key:'count',name:'Counting & Math',icon:()=>PP.wordSVG('123'),gen:GEN.count},
  {key:'shapes',name:'Shape Detective',icon:()=>PP.shapeSVG('star','#f8c537'),gen:GEN.shapes},
  {key:'letters',name:'Letter Explorer',icon:()=>`<svg viewBox="0 0 60 60"><text x="30" y="44" font-size="38" text-anchor="middle" font-weight="800" fill="#5b6fd6" font-family="Baloo 2, sans-serif">Aa</text></svg>`,gen:GEN.letters},
  {key:'words',name:'Words & World',icon:()=>PP.wordSVG('wave'),gen:GEN.words},
  {key:'puzzle',name:'Photo Puzzle',icon:()=>`<svg viewBox="0 0 60 60"><path d="M8 8h20v6a4 4 0 1 0 8 0V8h16v20h-6a4 4 0 1 0 0 8h6v16H8z" fill="#f39c33" stroke="#5a4636" stroke-width="2.5" stroke-opacity=".4"/></svg>`,run:puzzle},
  {key:'memory',name:'Memory Match',icon:()=>`<svg viewBox="0 0 60 60"><rect x="6" y="10" width="22" height="30" rx="4" fill="#5b6fd6"/><rect x="32" y="18" width="22" height="30" rx="4" fill="#e8577a"/></svg>`,run:memory}
];
PP.gameNames = Object.fromEntries(PP.GAMES.map(g=>[g.key,g.name]));
PP.startGame = (key,d)=>{
  const g=PP.GAMES.find(x=>x.key===key); const meta={key,dest:d.id,name:g.name};
  $('#gTitle').textContent=g.key==='words'&&(d.weather||!d.words)?'Weather & Seasons':g.name;
  PP.show('game');
  if(g.run) return g.run(d,meta);
  const rounds=g.gen(d); if(!rounds.length){PP.finishGame(meta,0,0);return;}
  quiz(rounds,meta);
};
PP.gameRepeat=()=>G&&G.repeat&&G.repeat();
PP.gameHint=()=>G&&G.hint&&G.hint();
})();
