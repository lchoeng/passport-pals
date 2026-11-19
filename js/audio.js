// Passport Pals — narration (speech synthesis), sound effects and gentle music, all generated in the browser.
(function(){
const PP = window.PP;
let ctx=null, master=null, musicGain=null, sfxGain=null, musicTimer=null, voice=null;
const S = ()=>PP.state.settings;
function ensure(){
  if(ctx) { if(ctx.state==='suspended') ctx.resume().catch(()=>{}); return ctx; }
  try{
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain(); master.connect(ctx.destination);
    musicGain=ctx.createGain(); musicGain.connect(master);
    sfxGain=ctx.createGain(); sfxGain.connect(master);
    PP.audio.apply();
  }catch(e){ ctx=null; }
  return ctx;
}
const FEM=/\b(Ava|Zoe|Allison|Samantha|Susan|Nicky|Joelle|Serena|Kate|Karen|Moira|Tessa|Fiona|Veena|Isha|Martha|Catherine|Jenny|Aria|Emma|Michelle|Ana|Sonia|Libby|Natasha|Clara|Zira|Hazel|Linda|Heera|Ashley|Cora|Elizabeth|Jane|Nancy|Sara|Amber|Monica|Female)\b/i;
const BAD=/Fred|Albert|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Bad News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Junior|Ralph|Kathy|Male/i;
const fixSay=t=>String(t).replace(/\bLinus\b/g,'Lie-nus').replace(/\bLinus’s\b/g,'Lie-nus’s');
function score(v){
  if(!/^en/i.test(v.lang)||BAD.test(v.name)) return -1;
  let s=0; const n=v.name;
  if(/Stephanie/i.test(n)) s+=500;
  if(/Natural|Neural|Online/i.test(n)) s+=100; else if(/Premium/i.test(n)) s+=90; else if(/Enhanced/i.test(n)) s+=80; else if(/^Google/i.test(n)) s+=55;
  if(FEM.test(n)||/Google US English|Google UK English Female/i.test(n)) s+=40; else s-=40;
  if(/Ava|Zoe|Jenny|Aria|Emma|Allison|Samantha/i.test(n)) s+=8;
  if(/en[-_]US/i.test(v.lang)) s+=5;
  if(v.localService===false && !/Natural|Online/i.test(n)) s-=5;
  return s;
}
function allVoices(){ try{ return speechSynthesis.getVoices().map(v=>({v,s:score(v)})).filter(x=>x.s>=0).sort((a,b)=>b.s-a.s); }catch(e){return [];} }
function pickVoice(){
  const list=allVoices(); const want=PP.state&&PP.state.settings.voiceName;
  if(want){ const m=list.find(x=>x.v.name===want); if(m) return m.v; }
  return list[0]?list[0].v:null;
}
try{ speechSynthesis.onvoiceschanged=()=>{voice=pickVoice();}; voice=pickVoice(); }catch(e){}

const FEMALE=/Yuna|Sora|Kyoko|O-Ren|Mizuki|Haruka|Nanami|Paulina|Monica|Mónica|Marisol|Soledad|Angelica|Dalia|Elena|Gudrun|Guðrún|Dora|Sun-Hi|SunHi|Heami|Female|Neural|Natural/i;
function langVoice(l){ try{ const vs=speechSynthesis.getVoices().filter(v=>v.lang&&v.lang.replace('_','-').toLowerCase().startsWith(l.slice(0,2).toLowerCase())); return vs.find(v=>FEMALE.test(v.name)&&/premium|enhanced|natural|neural/i.test(v.name))||vs.find(v=>FEMALE.test(v.name))||vs[0]||null; }catch(e){return null;} }
function tone(f,t0,dur,type='sine',vol=.25,dest){
  const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+.02);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);
  o.connect(g);g.connect(dest||sfxGain);o.start(t0);o.stop(t0+dur+.05);return o;
}
function noise(t0,dur,freq,q=1,vol=.3){
  const b=ctx.createBuffer(1,ctx.sampleRate*dur,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const s=ctx.createBufferSource();s.buffer=b;const f=ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=freq;f.Q.value=q;
  const g=ctx.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(f);f.connect(g);g.connect(sfxGain);s.start(t0);return f;
}

PP.audio = {
  unlock(){ ensure(); if(!voice) voice=pickVoice(); },
  voices(){ return allVoices().map(x=>x.v); },
  setVoice(name){ PP.state.settings.voiceName=name||null; voice=pickVoice(); },
  current(){ return voice&&voice.name; },
  apply(){
    const s=S(); if(!ctx) return;
    master.gain.value = s.audio?1:0; musicGain.gain.value = .5*s.music; sfxGain.gain.value = s.sfx;
    if(s.audio && s.music>0) this.music(true); else this.music(false);
  },
  say(text,lang){
    const s=S(); if(!voice) voice=pickVoice(); if(!s.audio||s.voice<=0||!text) return;
    try{
      speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(lang?text:fixSay(text));
      if(lang){u.lang=lang; const v=langVoice(lang); if(v)u.voice=v; else if(voice)u.voice=voice;}
      else if(voice) u.voice=voice;
      u.rate = lang?.8:.94; u.pitch=1.0; u.volume=s.voice;
      speechSynthesis.speak(u);
    }catch(e){}
  },
  // say a list of [text,lang] parts in order
  sayParts(parts){
    const s=S(); if(!s.audio||s.voice<=0) return;
    try{ speechSynthesis.cancel(); for(const [t,l] of parts){ const u=new SpeechSynthesisUtterance(l?t:fixSay(t)); if(l){u.lang=l;const v=langVoice(l); if(v)u.voice=v;} else if(voice)u.voice=voice; u.rate=l?.8:.94; u.pitch=1.0; u.volume=s.voice; speechSynthesis.speak(u);} }catch(e){}
  },
  hush(){ try{speechSynthesis.cancel();}catch(e){} },
  sfx(kind){
    if(!ensure()||!S().audio) return; const t=ctx.currentTime;
    if(kind==='tap'){tone(660,t,.08,'triangle',.18);}
    else if(kind==='good'){[523,659,784].forEach((f,i)=>tone(f,t+i*.09,.25,'triangle',.22));}
    else if(kind==='soft'){tone(392,t,.18,'sine',.16);tone(330,t+.14,.25,'sine',.14);}
    else if(kind==='win'){[523,659,784,1047,784,1047].forEach((f,i)=>tone(f,t+i*.11,.3,'triangle',.22));}
    else if(kind==='stamp'){noise(t,.12,300,.7,.6);tone(110,t,.2,'sine',.4);}
    else if(kind==='whoosh'){const f=noise(t,1.2,600,.6,.25);f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(1600,t+1);}
    else if(kind==='pop'){tone(880,t,.06,'sine',.2);tone(1320,t+.04,.08,'sine',.12);}
    else if(kind==='sparkle'){[1319,1568,1760,2093].forEach((f,i)=>tone(f,t+i*.06,.2,'sine',.1));}
  },
  // synthesized stand-ins for animal calls (Parent area explains how to add real recordings)
  animal(type){
    if(!ensure()||!S().audio) return; const t=ctx.currentTime;
    const sweep=(a,b,d,ty='sawtooth',v=.18,st=0)=>{const o=tone(a,t+st,d,ty,v);o.frequency.exponentialRampToValueAtTime(b,t+st+d*.9);};
    switch(type){
      case 'growl': {const f=noise(t,.9,180,2,.7); sweep(90,70,.9,'sawtooth',.12); break;}
      case 'chirp': [0,.14,.28].forEach(s=>sweep(2200,3200,.1,'sine',.14,s)); break;
      case 'honk': sweep(420,360,.35,'square',.08); sweep(420,360,.35,'square',.08,.45); break;
      case 'squeak': [0,.18].forEach(s=>sweep(1800,2600,.12,'sine',.14,s)); break;
      case 'bubble': [0,.12,.22,.36].forEach((s,i)=>sweep(300+i*80,900+i*100,.08,'sine',.16,s)); break;
      case 'monkey': [0,.2,.4,.6].forEach((s,i)=>sweep(i%2?700:500,i%2?1100:900,.15,'triangle',.14,s)); break;
      case 'howl': sweep(180,260,1,'sawtooth',.1); noise(t,1,300,3,.3); break;
      case 'yip': [0,.16,.32].forEach(s=>sweep(900,1400,.1,'triangle',.15,s)); break;
      case 'grunt': sweep(160,110,.3,'sawtooth',.14); sweep(150,100,.3,'sawtooth',.12,.38); break;
      case 'click': for(let i=0;i<8;i++) tone(3000,t+i*.05,.02,'square',.06); sweep(1800,3200,.5,'sine',.1,.45); break;
      case 'whale': sweep(220,480,1.1,'sine',.18); sweep(480,260,1,'sine',.14,1.1); break;
      case 'croak': [0,.22].forEach(s=>{for(let i=0;i<5;i++)tone(240,t+s+i*.025,.03,'square',.08);}); break;
      case 'neigh': {const o=tone(700,t,.9,'sawtooth',.08);o.frequency.setValueAtTime(700,t);o.frequency.linearRampToValueAtTime(1100,t+.2);o.frequency.linearRampToValueAtTime(500,t+.8); break;}
      case 'baa': {const o=tone(330,t,.7,'sawtooth',.1);const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=12;lg.gain.value=20;l.connect(lg);lg.connect(o.frequency);l.start(t);l.stop(t+.7);break;}
      default: tone(440,t,.3);
    }
  },
  music(on){
    if(!on){ clearInterval(musicTimer); musicTimer=null; return; }
    if(musicTimer||!ensure()) return;
    const scale=[262,294,330,392,440,523,587,659], chords=[[131,196],[110,165],[147,220],[98,147]]; let step=0;
    const play=()=>{ if(!ctx) return; const t=ctx.currentTime+.05;
      const c=chords[Math.floor(step/8)%4]; if(step%8===0){c.forEach(f=>tone(f,t,2.4,'sine',.08,musicGain));}
      if(Math.random()<.7){const f=scale[(step*3+Math.floor(Math.random()*3))%scale.length];tone(f,t,.6,'triangle',.05,musicGain);}
      step++; };
    play(); musicTimer=setInterval(play,320);
  }
};
document.addEventListener('visibilitychange',()=>{ if(document.hidden){PP.audio.music(false);PP.audio.hush();} else if(PP.state) PP.audio.apply(); });
})();
