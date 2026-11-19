// Passport Pals — original illustrated art (SVG). Soft painted look comes from the #wc / #grain filters in index.html.
(function(){
const PP = window.PP;
const ST = 'stroke="#3b2f2a" stroke-opacity=".28" stroke-width="2" stroke-linejoin="round"';
const E = (x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#2a211d"/><circle cx="${x+r*.35}" cy="${y-r*.38}" r="${r*.4}" fill="#fff"/>`;
const BL = (x,y)=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="3.5" fill="#ff7f7f" opacity=".35"/>`;
const SH = (w=60,cx=100)=>`<ellipse cx="${cx}" cy="149" rx="${w}" ry="7" fill="#1d2a30" opacity=".12"/>`;
const HI = (cx,cy,rx,ry)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".14"/>`;
const BRANCH = y=>`<path d="M12 ${y} Q100 ${y-10} 190 ${y+4}" stroke="#6b4a2e" stroke-width="8" stroke-linecap="round" fill="none"/><ellipse cx="30" cy="${y-8}" rx="12" ry="6" fill="#5f9a52" transform="rotate(-20 30 ${y-8})"/><ellipse cx="172" cy="${y-6}" rx="12" ry="6" fill="#6aa85c" transform="rotate(25 172 ${y-6})"/>`;

const A = {};
A.bear = v=>{
  const P={black:['#34302f','#c9a582','#55504e'],grizzly:['#8b5a35','#caa070','#6d4426'],polar:['#f3efe6','#e5ddcc','#d7cdb9']}[v];
  const [c,m,e]=P;
  return SH(64,105)+`<g ${ST}><rect x="120" y="112" width="24" height="36" rx="11" fill="${e}"/><rect x="150" y="110" width="22" height="36" rx="10" fill="${e}"/>
  <ellipse cx="118" cy="104" rx="60" ry="38" fill="${c}"/>${v==='grizzly'?`<ellipse cx="96" cy="78" rx="32" ry="18" fill="${c}"/>`:''}
  <rect x="64" y="114" width="24" height="36" rx="11" fill="${c}"/><rect x="92" y="116" width="22" height="34" rx="10" fill="${c}"/>
  <circle cx="40" cy="58" r="12" fill="${c}"/><circle cx="82" cy="54" r="12" fill="${c}"/><circle cx="62" cy="80" r="31" fill="${c}"/></g>
  <circle cx="40" cy="59" r="5.5" fill="${e}"/><circle cx="82" cy="55" r="5.5" fill="${e}"/>
  ${v==='black'?'<path d="M72 106 l13 14 l13 -14" stroke="#f4efe4" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>':''}
  <ellipse cx="56" cy="92" rx="16" ry="12" fill="${m}"/><ellipse cx="52" cy="86" rx="6.5" ry="5" fill="#231c1a"/><path d="M52 92 q-1 8 -8 8 M52 92 q2 8 9 7" stroke="#231c1a" stroke-width="1.8" fill="none"/>
  ${E(50,74,4.6)}${E(74,73,4.6)}${BL(42,86)}${BL(80,84)}${HI(124,82,36,10)}`;
};
A.otter = ()=>SH(44)+`<g ${ST}><path d="M118 132 q44 8 62 -18 q-22 10 -56 2z" fill="#6d4a30"/><ellipse cx="100" cy="104" rx="32" ry="42" fill="#7d5536"/>
  <circle cx="80" cy="38" r="7" fill="#7d5536"/><circle cx="120" cy="38" r="7" fill="#7d5536"/><circle cx="100" cy="56" r="26" fill="#7d5536"/></g>
  <ellipse cx="100" cy="114" rx="20" ry="28" fill="#c99d70"/><ellipse cx="100" cy="68" rx="16" ry="11" fill="#dcb88f"/><ellipse cx="100" cy="62" rx="5.5" ry="4" fill="#231c1a"/>
  ${E(89,52,4.2)}${E(111,52,4.2)}<path d="M85 68 l-17 -3 M85 72 l-16 4 M115 68 l17 -3 M115 72 l16 4" stroke="#5a3b25" stroke-width="1.2"/>
  <circle cx="100" cy="94" r="8" fill="#9aa6ad"/><ellipse cx="89" cy="94" rx="7" ry="5" fill="#6d4a30"/><ellipse cx="111" cy="94" rx="7" ry="5" fill="#6d4a30"/>
  <ellipse cx="86" cy="144" rx="10" ry="5" fill="#5a3b25"/><ellipse cx="114" cy="144" rx="10" ry="5" fill="#5a3b25"/>${BL(84,64)}${BL(116,64)}`;
A.crane = ()=>SH(44,112)+`<path d="M100 100 L95 146 M116 100 L122 146" stroke="#4a4a4a" stroke-width="3.5"/>
  <path d="M138 70 q34 4 34 28 q-16 -8 -38 -2z" fill="#222"/><ellipse cx="110" cy="84" rx="42" ry="24" fill="#fbfaf6" ${ST}/>
  <path d="M92 80 q22 -12 46 0" stroke="#d9d6cc" stroke-width="2" fill="none"/>
  <path d="M82 76 C70 50 60 36 64 22" stroke="#222" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M90 72 C82 56 74 42 72 30" stroke="#fbfaf6" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="64" cy="20" r="10" fill="#fbfaf6" ${ST}/><circle cx="64" cy="14" r="5.5" fill="#d8352a"/><path d="M56 21 L34 27 L56 26z" fill="#7c8a6a"/><circle cx="61" cy="20" r="2.2" fill="#222"/>`;
A.magpie = ()=>BRANCH(132)+`<path d="M120 100 L190 128 L184 138 L114 112z" fill="#2a5168"/><path d="M120 104 L186 132" stroke="#3f7b8c" stroke-width="2"/>
  <ellipse cx="96" cy="96" rx="30" ry="22" fill="#151515" ${ST}/><path d="M76 102 q20 22 42 2 q-12 -6 -42 -2z" fill="#f6f6f2"/>
  <path d="M92 86 q30 -4 40 18 q-26 4 -40 -18z" fill="#22303f"/><ellipse cx="104" cy="92" rx="10" ry="5" fill="#fff"/>
  <circle cx="70" cy="76" r="17" fill="#151515"/><path d="M55 74 L40 78 L55 81z" fill="#222"/><circle cx="66" cy="72" r="3.2" fill="#333"/><circle cx="67" cy="71" r="1.3" fill="#fff"/>
  <path d="M92 116 l-2 14 M102 116 l2 14" stroke="#222" stroke-width="2.5"/>`;
A.axolotl = ()=>{
  const g=(x,y,a)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0 q-5 -13 0 -26" stroke="#e45d86" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="-4" cy="-9" r="3" fill="#ef7fa0"/><circle cx="-4" cy="-17" r="3" fill="#ef7fa0"/><circle cx="0" cy="-26" r="3.4" fill="#ef7fa0"/></g>`;
  return SH(74,108)+`<path d="M138 104 q44 -8 56 10 q-32 14 -56 4z" fill="#f4a9c0" ${ST}/><g ${ST}><ellipse cx="80" cy="128" rx="9" ry="6" fill="#f2a3bb"/><ellipse cx="136" cy="128" rx="9" ry="6" fill="#f2a3bb"/>
  <ellipse cx="112" cy="110" rx="50" ry="20" fill="#f7b8cb"/></g>${g(38,92,-70)}${g(40,84,-40)}${g(46,78,-12)}${g(88,92,70)}${g(86,84,40)}${g(80,78,12)}
  <ellipse cx="63" cy="96" rx="34" ry="25" fill="#f9c4d4" ${ST}/>${E(51,92,3.6)}${E(76,92,3.6)}<path d="M50 106 q13 9 27 0" stroke="#a5455f" stroke-width="2" fill="none" stroke-linecap="round"/>${BL(44,102)}${BL(83,102)}
  <path d="M90 92 q30 -8 60 4" stroke="#fde1ea" stroke-width="4" fill="none" opacity=".7"/>`;
};
A.jaguar = ()=>{
  const ros=[[92,92],[112,86],[132,92],[150,100],[102,108],[124,106],[144,116],[84,110]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="none" stroke="#3a2716" stroke-width="2.6" stroke-dasharray="8 3"/><circle cx="${x}" cy="${y}" r="1.8" fill="#3a2716"/>`).join('');
  return SH(70,110)+`<path d="M164 96 C186 92 192 70 182 56" stroke="#d9a441" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="182" cy="58" r="3" fill="#3a2716"/>
  <g ${ST}><rect x="130" y="110" width="20" height="38" rx="9" fill="#c8913a"/><ellipse cx="114" cy="100" rx="56" ry="30" fill="#d9a441"/><rect x="74" y="112" width="20" height="38" rx="9" fill="#d9a441"/><rect x="100" y="114" width="20" height="36" rx="9" fill="#d9a441"/>
  <circle cx="40" cy="58" r="10" fill="#d9a441"/><circle cx="76" cy="56" r="10" fill="#d9a441"/><circle cx="58" cy="82" r="29" fill="#d9a441"/></g>
  <circle cx="40" cy="59" r="5" fill="#5a3a1f"/><circle cx="76" cy="57" r="5" fill="#5a3a1f"/><ellipse cx="114" cy="118" rx="38" ry="9" fill="#f3e2bf" opacity=".8"/>${ros}
  <circle cx="44" cy="70" r="2" fill="#3a2716"/><circle cx="74" cy="68" r="2" fill="#3a2716"/><circle cx="60" cy="64" r="2" fill="#3a2716"/>
  <ellipse cx="56" cy="96" rx="15" ry="11" fill="#f6ead2"/><path d="M50 88 l6 5 l6 -5z" fill="#5a2f22"/><path d="M56 93 q-2 7 -8 7 M56 93 q2 7 8 7" stroke="#5a2f22" stroke-width="1.6" fill="none"/>${E(48,76,4.4)}${E(68,76,4.4)}`;
};
A.monkey = v=>{
  const [f,fa,tail]={spider:['#4a3628','#d7b08a',1],macaque:['#b09b84','#e6786a',0],howler:['#2f2620','#4a3a30',1]}[v];
  return SH(40)+(tail?`<path d="M122 130 q52 8 50 -34 q-2 -22 -18 -18 q-12 4 -4 16" stroke="${f}" stroke-width="7" fill="none" stroke-linecap="round"/>`:`<ellipse cx="126" cy="128" rx="7" ry="5" fill="${f}"/>`)+
  `<g ${ST}><ellipse cx="100" cy="108" rx="28" ry="34" fill="${f}"/><path d="M78 92 q-18 22 -8 46" stroke="${f}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M122 92 q18 22 8 46" stroke="${f}" stroke-width="12" fill="none" stroke-linecap="round"/>
  <ellipse cx="84" cy="140" rx="14" ry="8" fill="${f}"/><ellipse cx="116" cy="140" rx="14" ry="8" fill="${f}"/>
  <circle cx="74" cy="62" r="8" fill="${fa}"/><circle cx="126" cy="62" r="8" fill="${fa}"/><circle cx="100" cy="60" r="27" fill="${f}"/></g>
  ${v==='macaque'?`<circle cx="100" cy="60" r="30" fill="none" stroke="#c9b59d" stroke-width="5" stroke-dasharray="3 4"/>`:''}
  ${v==='howler'?`<ellipse cx="100" cy="88" rx="16" ry="10" fill="#1f1914"/><path d="M74 96 q-6 20 4 36 M126 96 q6 20 -4 36" stroke="#a07a3c" stroke-width="4" fill="none" opacity=".8"/>`:''}
  <ellipse cx="100" cy="68" rx="17" ry="15" fill="${fa}"/><ellipse cx="92" cy="57" rx="9" ry="8" fill="${fa}"/><ellipse cx="108" cy="57" rx="9" ry="8" fill="${fa}"/>
  ${E(93,60,3.6)}${E(107,60,3.6)}<circle cx="97" cy="70" r="1.3" fill="#2a211d"/><circle cx="103" cy="70" r="1.3" fill="#2a211d"/><path d="M93 76 q7 5 14 0" stroke="#2a211d" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
};
A.flamingo = ()=>SH(36,104)+`<path d="M100 100 L100 148" stroke="#e98aa0" stroke-width="3.5"/><path d="M108 100 L122 122 L104 126" stroke="#e98aa0" stroke-width="3.5" fill="none"/>
  <ellipse cx="112" cy="88" rx="36" ry="20" fill="#f48aa6" ${ST}/><path d="M142 84 l14 4 l-12 6z" fill="#2b2b2b"/><path d="M98 84 q24 -14 44 0 q-20 10 -44 0z" fill="#ef6f90"/>
  <path d="M82 82 C60 70 86 40 72 26 C64 18 54 26 58 34" stroke="#f48aa6" stroke-width="8.5" fill="none" stroke-linecap="round"/>
  <circle cx="62" cy="26" r="9.5" fill="#f7a0b6" ${ST}/><path d="M54 26 q-10 4 -8 16 q4 -6 10 -8z" fill="#f4f0e8"/><path d="M46 36 q0 6 2 6 q2 -4 4 -6z" fill="#222"/><circle cx="63" cy="23" r="2.2" fill="#222"/>`;
A.tanuki = ()=>SH(56,105)+`<path d="M140 108 q38 -6 42 20 q-22 10 -42 -6z" fill="#7d6650" ${ST}/><path d="M170 120 q10 4 12 8 q-6 4 -12 2z" fill="#3a2f26"/>
  <g ${ST}><rect x="80" y="118" width="14" height="28" rx="6" fill="#3a2f26"/><rect x="124" y="118" width="14" height="28" rx="6" fill="#3a2f26"/><ellipse cx="108" cy="106" rx="44" ry="30" fill="#9c8468"/>
  <ellipse cx="54" cy="60" rx="9" ry="10" fill="#5a4636"/><ellipse cx="88" cy="60" rx="9" ry="10" fill="#5a4636"/><circle cx="70" cy="84" r="27" fill="#a68d70"/></g>
  <ellipse cx="70" cy="96" rx="23" ry="14" fill="#ece0cb"/><ellipse cx="59" cy="82" rx="11" ry="8" fill="#3a2f26" transform="rotate(15 59 82)"/><ellipse cx="81" cy="82" rx="11" ry="8" fill="#3a2f26" transform="rotate(-15 81 82)"/>
  <circle cx="60" cy="81" r="3.8" fill="#111"/><circle cx="61.5" cy="79.5" r="1.6" fill="#fff"/><circle cx="80" cy="81" r="3.8" fill="#111"/><circle cx="81.5" cy="79.5" r="1.6" fill="#fff"/>
  <ellipse cx="70" cy="95" rx="5" ry="4" fill="#231c1a"/><path d="M66 102 q4 3 8 0" stroke="#231c1a" stroke-width="1.5" fill="none"/>`;
A.fish = v=>{
  if(v==='koi') return `<path d="M30 92 q20 -16 40 -6" stroke="#9fd0e6" stroke-width="3" fill="none" opacity=".6"/><path d="M150 88 L184 64 Q176 90 186 116 L150 94z" fill="#f4813a" ${ST} opacity=".9"/>
   <path d="M40 90 C60 60 130 58 154 90 C130 120 60 120 40 90z" fill="#fff6ec" ${ST}/><ellipse cx="92" cy="80" rx="20" ry="11" fill="#f26b2e"/><ellipse cx="126" cy="96" rx="14" ry="8" fill="#f26b2e"/><ellipse cx="70" cy="98" rx="8" ry="5" fill="#2a2a2a"/>
   <path d="M86 108 q-8 18 -24 18 q10 -10 14 -20z" fill="#f7a36b" opacity=".85"/><path d="M80 66 q20 -16 46 -4 q-20 2 -46 4z" fill="#f4813a"/>
   ${E(56,86,3.6)}<path d="M42 94 q-8 4 -12 12 M44 96 q-4 8 -2 14" stroke="#c96b3a" stroke-width="1.5" fill="none"/>`;
  return `<path d="M150 90 L182 70 L180 112z" fill="#e8d9a6" ${ST}/><path d="M40 90 L92 52 L150 80 L150 100 L92 128z" fill="#efe0ac" ${ST}/>
   <path d="M92 52 L120 66 L104 120 L92 128 L70 112z" fill="#2c2c2c" opacity=".88"/><path d="M60 78 L74 70 M58 86 L76 76 M58 94 L76 84" stroke="#3f8fd6" stroke-width="3"/>
   <path d="M120 66 L150 80 L150 100 L110 112z" fill="#e2c55a"/><path d="M128 84 l18 2 M128 92 l18 0" stroke="#2c2c2c" stroke-width="3"/>
   <path d="M86 52 l-6 -18 l10 16" fill="#2c2c2c"/><path d="M40 90 l-6 2 l6 3z" fill="#f2b632"/><circle cx="56" cy="84" r="5" fill="#f2b632"/>${E(56,84,3.2)}`;
};
A.turtle = ()=>`<path d="M140 108 q26 6 38 22 q-26 -2 -42 -14z" fill="#8a9a5f" ${ST}/><path d="M96 76 q-14 -26 -40 -32 q12 24 32 40z" fill="#7a8a52" ${ST}/>
  <ellipse cx="112" cy="92" rx="48" ry="31" fill="#6e7d45" ${ST}/><path d="M98 74 l14 -6 l14 6 l0 16 l-14 6 l-14 -6z M84 92 l14 -2 l0 -16 M140 92 l-14 -2 l0 -16 M98 90 l-6 14 M126 90 l6 14 M112 96 l0 16" fill="#7f8f50" stroke="#c9b27a" stroke-width="2" stroke-opacity=".8"/>
  <path d="M66 100 q46 24 94 0" stroke="#e6d6a4" stroke-width="4" fill="none"/>${HI(110,74,30,8)}
  <path d="M84 106 q-22 18 -50 22 q14 -22 42 -32z" fill="#8a9a5f" ${ST}/><ellipse cx="56" cy="86" rx="19" ry="13" fill="#9aa86a" ${ST}/>
  <path d="M46 80 l6 -4 l6 4 l-6 4z" fill="#7f8f50" opacity=".7"/>${E(48,84,3.6)}<path d="M38 92 q6 3 12 1" stroke="#4a5530" stroke-width="1.6" fill="none"/>`;
A.seal = v=>{
  const [c,l,d]=v==='monk'?['#8d9096','#cbc8c0','#6f7277']:['#a7a49c','#d8d4ca','#7a776f'];
  const spots=v==='harbor'?[[90,100],[110,96],[130,104],[150,112],[100,112],[122,116],[70,96]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="3" fill="#6b685f" opacity=".7"/>`).join(''):'';
  return `<path d="M14 140 q86 -22 178 4 l0 10 l-178 0z" fill="${v==='monk'?'#ead9ae':'#7a7468'}"/>
  <path d="M40 110 C40 80 80 70 120 90 C150 104 170 118 186 112 C176 132 150 136 120 132 C80 132 40 136 40 110z" fill="${c}" ${ST}/>
  <path d="M52 122 q60 16 120 4" stroke="${l}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".75"/>${spots}
  <path d="M180 110 l14 -10 l-4 14 l8 6 l-16 -2z" fill="${d}"/><path d="M80 116 q8 18 -6 22 q-4 -12 6 -22z" fill="${d}"/>
  <circle cx="56" cy="92" r="23" fill="${c}" ${ST}/><ellipse cx="54" cy="101" rx="11" ry="7" fill="${l}"/>${E(47,88,4.8)}${E(64,88,4.8)}
  <ellipse cx="54" cy="98" rx="4.5" ry="3.2" fill="#231c1a"/><path d="M48 102 l-14 -2 M48 105 l-13 3 M60 102 l14 -2 M60 105 l13 3" stroke="#3b3b3b" stroke-width="1"/>${HI(110,92,26,7)}`;
};
A.manta = ()=>SH(80)+`<path d="M100 120 Q104 145 114 156" stroke="#2c3f5c" stroke-width="3" fill="none"/>
  <path d="M100 50 C130 60 172 70 194 98 C162 96 132 104 112 118 L100 124 L88 118 C68 104 38 96 6 98 C28 70 70 60 100 50z" fill="#2f4463" ${ST}/>
  <path d="M30 94 C60 92 80 98 96 112 M170 94 C140 92 120 98 104 112" stroke="#e9eef3" stroke-width="3" fill="none" opacity=".5"/>
  <path d="M92 52 q-9 -14 -3 -22 q7 6 7 20z M108 52 q9 -14 3 -22 q-7 6 -7 20z" fill="#2f4463"/>${E(90,62,3.2)}${E(110,62,3.2)}<path d="M94 72 q6 4 12 0" stroke="#e9eef3" stroke-width="2" fill="none"/>${HI(100,72,30,6)}`;
A.dolphin = ()=>`<path d="M20 140 q20 -8 40 0 t40 0 t40 0 t40 0" stroke="#7fc3e0" stroke-width="4" fill="none" opacity=".7"/>
  <path d="M104 66 q10 -24 26 -28 q-6 14 -2 30z" fill="#6b889f"/><path d="M30 100 C60 60 130 50 170 80 C176 86 184 86 192 82 C186 92 184 98 190 110 C178 104 170 100 164 96 C130 92 90 110 60 112 C48 113 38 110 30 100z" fill="#86a3ba" ${ST}/>
  <path d="M36 104 C70 112 110 100 150 92" stroke="#e3ecf2" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M30 100 q-14 2 -18 8 q14 0 22 -2z" fill="#86a3ba"/>
  <path d="M72 108 q0 18 -14 24 q2 -16 4 -24z" fill="#6b889f"/>${E(48,92,3.6)}<path d="M16 106 q12 4 24 -1" stroke="#4d6577" stroke-width="1.8" fill="none"/>${HI(110,72,30,6)}`;
A.moose = ()=>SH(64,112)+`<g ${ST}><rect x="146" y="100" width="12" height="46" rx="5" fill="#3e2c20"/><rect x="128" y="102" width="12" height="44" rx="5" fill="#4a3426"/>
  <ellipse cx="118" cy="92" rx="52" ry="28" fill="#5a3f2c"/><ellipse cx="88" cy="76" rx="26" ry="18" fill="#5a3f2c"/><rect x="80" y="104" width="12" height="44" rx="5" fill="#4a3426"/><rect x="98" y="104" width="12" height="44" rx="5" fill="#5a3f2c"/>
  <path d="M74 82 C62 70 52 70 42 78 L22 98 C18 106 30 114 40 108 L62 96z" fill="#664832"/></g>
  <path d="M52 100 q2 18 -6 22 q-2 -12 0 -22z" fill="#3e2c20"/><ellipse cx="66" cy="68" rx="10" ry="5" fill="#664832" transform="rotate(-30 66 68)"/>
  <path d="M60 64 C46 40 30 40 20 30 l7 9 l-9 -3 l9 9 l-11 0 l13 8 C36 64 50 68 60 66z" fill="#d8c6a0" ${ST}/><path d="M70 62 C80 36 100 34 110 22 l-2 11 l9 -6 l-4 11 l11 -4 l-9 11 C94 54 82 62 72 66z" fill="#e2d2ae" ${ST}/>
  ${E(44,84,3.4)}<ellipse cx="24" cy="100" rx="5" ry="3.5" fill="#231c1a"/>${HI(120,76,30,8)}`;
A.eagle = ()=>BRANCH(140)+`<path d="M106 120 l14 26 l-22 0z" fill="#f6f4ee" ${ST}/><ellipse cx="104" cy="98" rx="28" ry="34" fill="#4a3324" ${ST}/>
  <path d="M118 72 q22 30 4 58 q-18 -26 -4 -58z" fill="#3a271b"/><path d="M92 128 l-6 12 M100 128 l0 12 M108 128 l4 12" stroke="#f2b632" stroke-width="4" stroke-linecap="round"/>
  <circle cx="96" cy="58" r="21" fill="#f6f4ee" ${ST}/><path d="M80 56 q-15 0 -17 11 q6 5 11 0 l8 -3z" fill="#f2b632"/>
  <circle cx="89" cy="53" r="4" fill="#f2c94c"/><circle cx="88.6" cy="53" r="2" fill="#222"/><path d="M83 48 l13 -2" stroke="#bdb8ac" stroke-width="2.4"/>`;
A.whale = v=>{
  if(v==='orca') return `<path d="M96 72 q4 -38 14 -50 q4 30 6 52z" fill="#1f2328"/>
  <path d="M20 96 C30 70 80 60 130 72 C150 76 166 84 176 92 L196 76 C192 90 192 98 196 112 L176 100 C150 116 90 124 50 118 C30 114 18 108 20 96z" fill="#22262c" ${ST}/>
  <path d="M28 106 C70 124 120 118 162 104 C120 110 70 112 28 104z" fill="#f4f4f2"/><ellipse cx="50" cy="84" rx="11" ry="5.5" fill="#f4f4f2" transform="rotate(-12 50 84)"/>
  <ellipse cx="114" cy="74" rx="15" ry="4" fill="#8b9096"/><path d="M62 110 q-4 20 -16 24 q0 -16 6 -24z" fill="#22262c"/><circle cx="38" cy="90" r="2.2" fill="#000"/><circle cx="38.8" cy="89.3" r=".9" fill="#fff"/>
  <path d="M20 100 q8 6 18 4" stroke="#555" stroke-width="1.5" fill="none"/>`;
  return `<path d="M14 92 C30 66 90 60 140 74 C156 78 168 84 176 90 L196 74 C192 88 192 98 196 112 L176 100 C150 116 90 122 44 114 C24 110 12 104 14 92z" fill="#4f5b66" ${ST}/>
  <path d="M24 104 C60 116 110 114 160 102" stroke="#cfd8df" stroke-width="5" fill="none"/><path d="M30 108 l90 2 M34 111 l80 3" stroke="#cfd8df" stroke-width="1.5" opacity=".7"/>
  <path d="M120 74 q6 -10 14 -10 q-2 6 -2 12z" fill="#4f5b66"/><path d="M66 108 q-10 30 -42 40 q16 -24 32 -42z" fill="#dfe5ea" ${ST}/>
  <circle cx="26" cy="86" r="2.5" fill="#3c4650"/><circle cx="34" cy="82" r="2.5" fill="#3c4650"/><circle cx="42" cy="80" r="2.5" fill="#3c4650"/>${E(52,94,3)}${HI(100,78,40,6)}`;
};
A.sloth = ()=>`<path d="M8 32 Q100 18 194 34" stroke="#6b4a2e" stroke-width="10" stroke-linecap="round" fill="none"/><ellipse cx="34" cy="22" rx="14" ry="6" fill="#5f9a52"/><ellipse cx="164" cy="22" rx="14" ry="6" fill="#6aa85c"/>
  <g ${ST}><path d="M72 36 C68 60 74 82 86 96" stroke="#a58a68" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M130 34 C134 60 128 82 116 96" stroke="#a58a68" stroke-width="13" fill="none" stroke-linecap="round"/>
  <ellipse cx="100" cy="108" rx="30" ry="34" fill="#a58a68"/><path d="M84 132 q-6 14 -2 22 M116 132 q6 14 2 22" stroke="#a58a68" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="100" cy="76" r="23" fill="#c4ab86"/></g>
  <path d="M66 30 q6 -6 12 0 M124 28 q6 -6 12 0" stroke="#3a2c20" stroke-width="3" fill="none"/><ellipse cx="96" cy="112" rx="14" ry="10" fill="#8fa070" opacity=".35"/>
  <ellipse cx="100" cy="80" rx="17" ry="13" fill="#efe1c6"/><path d="M83 76 q8 -5 13 4 M117 76 q-8 -5 -13 4" stroke="#3a2c20" stroke-width="6" fill="none" stroke-linecap="round"/>
  ${E(90,78,2.6)}${E(110,78,2.6)}<ellipse cx="100" cy="84" rx="4" ry="3" fill="#2a211d"/><path d="M93 89 q7 5 14 0" stroke="#2a211d" stroke-width="1.6" fill="none"/>`;
A.toucan = ()=>BRANCH(136)+`<path d="M118 110 l12 30 l-16 0z" fill="#111"/><ellipse cx="112" cy="94" rx="25" ry="33" fill="#151515" ${ST}/>
  <ellipse cx="100" cy="82" rx="14" ry="16" fill="#f6d43a"/><ellipse cx="118" cy="124" rx="8" ry="5" fill="#d8352a"/><circle cx="104" cy="62" r="16" fill="#151515"/>
  <path d="M92 56 C70 42 34 48 18 66 C40 70 70 74 92 72z" fill="#86c443" ${ST}/><path d="M18 66 C32 50 50 46 58 46 L60 72 C46 72 30 70 18 66z" fill="#f39c33"/>
  <path d="M18 66 C22 58 28 54 32 52 L34 70z" fill="#d8352a"/><path d="M92 70 C70 74 40 70 22 66 C40 76 70 80 92 74z" fill="#3a7fc4"/>
  <circle cx="104" cy="58" r="6.5" fill="#9fd36b"/>${E(104,58,3)}<path d="M104 126 l-4 10 M114 126 l2 10" stroke="#5b8fd1" stroke-width="3"/>`;
A.frog = ()=>SH(56)+`<path d="M60 120 q-26 10 -12 26 q22 -2 32 -16z M140 120 q26 10 12 26 q-22 -2 -32 -16z" fill="#2f63c9" ${ST}/>
  <ellipse cx="100" cy="106" rx="43" ry="30" fill="#e0342e" ${ST}/><path d="M80 120 q-6 16 -16 22 M120 120 q6 16 16 22" stroke="#2f63c9" stroke-width="7" fill="none" stroke-linecap="round"/>
  <circle cx="80" cy="80" r="15" fill="#e0342e" ${ST}/><circle cx="120" cy="80" r="15" fill="#e0342e" ${ST}/>${E(80,80,7.5)}${E(120,80,7.5)}
  <circle cx="90" cy="118" r="2.2" fill="#6b120e"/><circle cx="112" cy="122" r="2" fill="#6b120e"/><circle cx="122" cy="108" r="1.8" fill="#6b120e"/><circle cx="78" cy="106" r="1.8" fill="#6b120e"/>
  <path d="M80 102 q20 12 40 0" stroke="#7a1612" stroke-width="2.5" fill="none" stroke-linecap="round"/>${BL(72,98)}${BL(128,98)}${HI(100,92,28,8)}`;
A.fox = ()=>SH(52,110)+`<path d="M128 120 C170 132 192 100 178 78 C172 100 150 110 124 104z" fill="#f7f6f2" ${ST}/>
  <g ${ST}><ellipse cx="112" cy="106" rx="34" ry="33" fill="#f2f0ea"/><rect x="88" y="116" width="13" height="30" rx="6" fill="#ecebe5"/><rect x="106" y="118" width="13" height="28" rx="6" fill="#e6e4dc"/>
  <path d="M70 58 l2 -20 l15 12z" fill="#f7f6f2"/><path d="M98 50 l13 -14 l4 20z" fill="#f7f6f2"/><circle cx="88" cy="72" r="24" fill="#f7f6f2"/><path d="M66 76 q-15 4 -20 9 q15 7 28 0z" fill="#f7f6f2"/></g>
  <path d="M73 56 l1 -11 l7 6z M101 50 l7 -8 l2 11z" fill="#d6c9c4"/><circle cx="46" cy="84" r="3.8" fill="#231c1a"/>${E(78,70,3.6)}${E(96,69,3.6)}${BL(70,80)}${BL(102,79)}`;
A.puffin = ()=>`<path d="M26 142 q74 -18 154 0 l0 10 l-154 0z" fill="#7d8a6a"/><path d="M40 138 l4 -8 l3 8 M150 138 l3 -9 l3 9" stroke="#9fb27a" stroke-width="2"/>
  <path d="M88 136 l-9 8 l19 0z M108 136 l-7 8 l19 0z" fill="#f08a2c"/><ellipse cx="100" cy="100" rx="31" ry="38" fill="#1b1b1e" ${ST}/>
  <ellipse cx="94" cy="108" rx="21" ry="28" fill="#f8f7f3"/><path d="M110 78 q17 20 5 52 q-15 -20 -5 -52z" fill="#0f0f12"/>
  <circle cx="96" cy="58" r="22" fill="#1b1b1e"/><ellipse cx="90" cy="60" rx="15" ry="13" fill="#f2f1ec"/>
  <path d="M77 52 C64 52 58 62 60 74 C68 72 74 66 79 64z" fill="#f05a28" ${ST}/><path d="M79 51 l-4 14 l6 0z" fill="#5d6b80"/><path d="M73 55 l-2 11" stroke="#f6c844" stroke-width="2"/>
  <circle cx="89" cy="56" r="5" fill="none" stroke="#e44" stroke-width="1.6"/>${E(89,56,3)}<path d="M84 50 l6 2 l-1 -5z" fill="#6b6f78"/>`;
A.horse = ()=>{const c='#9a5b34',m='#efdca8';return SH(62,110)+`<path d="M156 84 q26 6 16 48 q-14 -14 -18 -42z" fill="${m}" ${ST}/>
  <g ${ST}><rect x="140" y="98" width="15" height="44" rx="6" fill="#86492a"/><rect x="122" y="100" width="15" height="42" rx="6" fill="${c}"/><ellipse cx="114" cy="90" rx="50" ry="27" fill="${c}"/>
  <rect x="76" y="100" width="15" height="42" rx="6" fill="#86492a"/><rect x="94" y="102" width="15" height="40" rx="6" fill="${c}"/>
  <path d="M80 84 L62 50 L86 42 L98 80z" fill="${c}"/><path d="M60 46 C54 40 40 52 34 64 C32 70 38 76 46 72 L68 60z" fill="${c}"/></g>
  <rect x="76" y="140" width="15" height="7" rx="3" fill="#2a211d"/><rect x="94" y="140" width="15" height="7" rx="3" fill="#2a211d"/><rect x="122" y="140" width="15" height="7" rx="3" fill="#2a211d"/><rect x="140" y="140" width="15" height="7" rx="3" fill="#2a211d"/>
  <path d="M64 38 C72 34 92 50 100 76 L88 74 C82 56 72 48 60 48z" fill="${m}"/><path d="M58 44 q-9 6 -4 15 q6 -4 8 -13z" fill="${m}"/><path d="M64 42 l2 -12 l7 10z" fill="${c}"/>
  ${E(52,54,3.2)}<circle cx="38" cy="68" r="1.6" fill="#2a211d"/>${HI(118,76,32,8)}`;};
A.deer = ()=>{const c='#8c7a66';return SH(56,110)+`<g ${ST}><rect x="138" y="98" width="11" height="46" rx="5" fill="#6f604f"/><rect x="122" y="100" width="11" height="44" rx="5" fill="${c}"/><ellipse cx="114" cy="90" rx="46" ry="25" fill="${c}"/>
  <rect x="80" y="100" width="11" height="44" rx="5" fill="#6f604f"/><rect x="96" y="102" width="11" height="42" rx="5" fill="${c}"/>
  <path d="M80 86 L64 54 L86 48 L98 82z" fill="${c}"/><path d="M62 52 C56 46 44 56 38 66 C36 72 42 76 50 72 L70 62z" fill="${c}"/></g>
  <path d="M60 46 C52 32 54 16 60 6 M57 30 l-11 -6 M59 18 l9 -6 M68 44 C76 30 86 22 94 14 M80 30 l2 -12 M88 22 l9 2" stroke="#d9c9a6" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <path d="M68 50 l6 -8 l2 8z" fill="${c}"/><path d="M70 64 q-8 16 6 28 q10 -4 12 -14z" fill="#ece5d6"/>${E(56,58,3.2)}<ellipse cx="40" cy="69" rx="3.5" ry="2.5" fill="#2a211d"/><path d="M90 96 q-4 10 0 16" stroke="#e8e0d0" stroke-width="6" fill="none"/>`;};
A.sheep = ()=>SH(56,108)+`<g ${ST}><rect x="86" y="112" width="9" height="34" rx="4" fill="#5d5248"/><rect x="104" y="114" width="9" height="32" rx="4" fill="#6a5d50"/><rect x="124" y="114" width="9" height="32" rx="4" fill="#5d5248"/><rect x="140" y="112" width="9" height="34" rx="4" fill="#6a5d50"/>
  ${[[90,96,22],[112,88,24],[136,96,22],[100,112,22],[128,112,22],[114,102,28],[150,104,16]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#f6f1e6"/>`).join('')}
  <ellipse cx="44" cy="80" rx="10" ry="4.5" fill="#e7dcc6" transform="rotate(-15 44 80)"/><ellipse cx="80" cy="80" rx="10" ry="4.5" fill="#e7dcc6" transform="rotate(15 80 80)"/><ellipse cx="62" cy="88" rx="17" ry="21" fill="#efe4cf"/></g>
  <circle cx="62" cy="68" r="10" fill="#f6f1e6"/>${E(56,86,3.2)}${E(68,86,3.2)}<path d="M58 100 q4 4 8 0" stroke="#5d5248" stroke-width="2" fill="none"/><ellipse cx="62" cy="96" rx="4" ry="2.6" fill="#b88a7a"/>`;

PP.animalInner = id=>{const a=PP.ANIMALS[id]; if(!a) return ''; const [k,v]=a.art; return A[k]?A[k](v):'';};
PP.animalSVG = (id,cls='',plain=false)=>`<svg class="ani ${cls}" viewBox="0 0 200 160" aria-label="${PP.ANIMALS[id]?.name||''}"><g${plain?'':' filter="url(#wc)"'}>${PP.animalInner(id)}</g></svg>`;

// ---------- Linus & Wesley ----------
const KID = {
  linus:{skin:'#f0c8a2',hair:'#1c1a1d',shirt:'#f5c242',shirt2:'#e4ae2e',pants:'#e8743b',shoe:'#7a7f88',shorts:true},
  wesley:{skin:'#f2cba6',hair:'#3a261c',shirt:'#4f8fd6',shirt2:'#3f7bc0',pants:'#2d3e66',shoe:'#c0543e',shorts:false}
};
const ACC = {
  cap:`<path d="M31 50 C32 24 88 24 89 50z" fill="#d9534f"/><path d="M86 48 l24 4 l-24 4z" fill="#b8433f"/><circle cx="60" cy="27" r="3" fill="#b8433f"/>`,
  sunhat:`<ellipse cx="60" cy="44" rx="42" ry="9" fill="#e9c46a"/><path d="M37 44 C39 18 81 18 83 44z" fill="#f4d58d"/><rect x="38" y="36" width="44" height="6" fill="#e76f51"/>`,
  headband:`<rect x="30" y="44" width="60" height="8" rx="4" fill="#fff"/><circle cx="60" cy="48" r="4" fill="#d8352a"/>`,
  lei:`${Array.from({length:11},(_,i)=>{const a=Math.PI*(.12+.76*i/10);return `<circle cx="${60-30*Math.cos(a)}" cy="${90+12*Math.sin(a)}" r="5" fill="${['#f78fb3','#f9d56e','#fff','#f26b6b'][i%4]}"/>`}).join('')}`,
  beanie:`<path d="M29 54 C29 18 91 18 91 54z" fill="#3a6ea5"/><rect x="28" y="46" width="64" height="11" rx="5" fill="#2c5684"/><circle cx="60" cy="20" r="7" fill="#f4f1ea"/>`,
  binoculars:`<path d="M44 92 q16 22 32 0" stroke="#4a3a2a" stroke-width="2" fill="none"/><rect x="48" y="108" width="10" height="14" rx="4" fill="#333"/><rect x="62" y="108" width="10" height="14" rx="4" fill="#333"/><rect x="57" y="111" width="6" height="5" fill="#555"/>`,
  woolhat:`<path d="M29 54 C29 18 91 18 91 54z" fill="#f2ede1"/><rect x="28" y="46" width="64" height="10" rx="5" fill="#3d4f6e"/><path d="M32 40 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6" stroke="#3d4f6e" stroke-width="3" fill="none"/><circle cx="60" cy="19" r="7" fill="#1b1b1e"/><path d="M56 19 l-5 3 l5 1z" fill="#f05a28"/>`
};
PP.kidSVG = (who,o={})=>{
  const k=KID[who]; const acc=o.acc&&ACC[o.acc]?ACC[o.acc]:'';
  const W = who==='wesley';
  const hairBack = W?`<path d="M27 62 C24 26 96 26 93 62 L95 94 C87 98 81 92 83 82 L37 82 C39 92 33 98 25 94z" fill="${k.hair}"/>`:'';
  const hairFront = W?`<path d="M31 56 C35 30 85 30 89 56 C80 44 68 44 61 50 C52 42 40 46 31 56z" fill="${k.hair}"/>${o.acc&&/hat|beanie|cap/.test(o.acc)?'':`<circle cx="60" cy="26" r="8" fill="${k.hair}"/><rect x="55" y="31" width="10" height="4" rx="2" fill="#d8453a"/>`}`
     : `<path d="M30 60 C27 20 93 20 90 60 C88 50 80 45 60 45 C40 45 32 50 30 60z" fill="${k.hair}"/><path d="M32 58 C31 52 33 46 36 44 L36 60z M88 58 C89 52 87 46 84 44 L84 60z" fill="#6d6670" opacity=".55"/>`;
  const legs = k.shorts?
    `<g class="leg leg-l" style="transform-origin:52px 140px"><rect x="46" y="138" width="11" height="40" rx="5" fill="${k.skin}"/><ellipse cx="50" cy="182" rx="10" ry="6" fill="${k.shoe}"/></g>
     <g class="leg leg-r" style="transform-origin:68px 140px"><rect x="63" y="138" width="11" height="40" rx="5" fill="${k.skin}"/><ellipse cx="70" cy="182" rx="10" ry="6" fill="${k.shoe}"/></g>
     <path d="M40 126 L80 126 L82 152 L62 152 L60 140 L58 152 L38 152z" fill="${k.pants}"/>`
   : `<g class="leg leg-l" style="transform-origin:52px 140px"><rect x="45" y="128" width="13" height="50" rx="6" fill="${k.pants}"/><ellipse cx="50" cy="182" rx="10" ry="6" fill="${k.shoe}"/></g>
      <g class="leg leg-r" style="transform-origin:68px 140px"><rect x="62" y="128" width="13" height="50" rx="6" fill="${k.pants}"/><ellipse cx="70" cy="182" rx="10" ry="6" fill="${k.shoe}"/></g>`;
  const arm = (side)=>{const L=side==='l',x=L?40:80,hx=L?30:90;return `<g class="arm arm-${side}" style="transform-origin:${x}px 98px"><path d="M${x} 98 C${L?30:90} 112 ${L?28:92} 124 ${hx} 134" stroke="${k.shirt2}" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="${hx}" cy="138" r="6.5" fill="${k.skin}"/></g>`;};
  const inner = `<ellipse cx="60" cy="190" rx="30" ry="6" fill="#1d2a30" opacity=".15"/>${legs}${arm('l')}
   <path d="M38 98 C38 88 82 88 82 98 L84 132 C70 136 50 136 36 132z" fill="${k.shirt}" stroke="#3b2f2a" stroke-opacity=".2" stroke-width="2"/>
   ${who==='linus'?'<path d="M56 106 l4 6 l4 -6" stroke="#e4ae2e" stroke-width="2" fill="none"/>':'<circle cx="60" cy="112" r="6" fill="#f5f0e0" opacity=".9"/><path d="M57 112 l2 2 l4 -4" stroke="#4f8fd6" stroke-width="1.8" fill="none"/>'}
   ${arm('r')}<g class="head" style="transform-origin:60px 90px">${hairBack}<rect x="54" y="84" width="12" height="10" fill="${k.skin}"/>
   <circle cx="32" cy="66" r="6" fill="${k.skin}"/><circle cx="88" cy="66" r="6" fill="${k.skin}"/><circle cx="60" cy="62" r="29" fill="${k.skin}" stroke="#3b2f2a" stroke-opacity=".18" stroke-width="2"/>
   ${hairFront}<g class="eyes"><ellipse cx="49" cy="65" rx="4.6" ry="6" fill="#2a1f1a"/><ellipse cx="71" cy="65" rx="4.6" ry="6" fill="#2a1f1a"/><circle cx="50.8" cy="62.5" r="2" fill="#fff"/><circle cx="72.8" cy="62.5" r="2" fill="#fff"/><circle cx="47.6" cy="67.6" r=".9" fill="#fff"/><circle cx="69.6" cy="67.6" r=".9" fill="#fff"/></g>
   <path d="M44 55 q5 -3 9 0 M67 55 q5 -3 9 0" stroke="${k.hair}" stroke-width="2" fill="none" stroke-linecap="round"/>
   <ellipse cx="42" cy="74" rx="5.5" ry="3" fill="#ff8a80" opacity=".4"/><ellipse cx="78" cy="74" rx="5.5" ry="3" fill="#ff8a80" opacity=".4"/>
   <path class="m m-smile" d="M53 77 q7 6 14 0" stroke="#7a3b30" stroke-width="2.2" fill="none" stroke-linecap="round"/>
   <path class="m m-open" d="M51 75 q9 13 18 0z" fill="#8a3b3b"/><path class="m m-open" d="M55 80 q5 3 10 0" stroke="#e98585" stroke-width="2.4" fill="none"/>
   <ellipse class="m m-wow" cx="60" cy="79" rx="4" ry="5" fill="#8a3b3b"/>${acc}</g>`;
  const body = W?`<g transform="translate(7 26) scale(.88)">${inner}</g>`:inner;
  return `<svg class="kid ${o.cls||''}" data-e="${o.expr||'smile'}" viewBox="0 0 120 200" aria-label="${who==='linus'?'Linus':'Wesley'}"><g filter="url(#wc)">${body}</g></svg>`;
};

// ---------- small icons ----------
PP.ICON = {
  map:`<svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="2"/></svg>`,
  back:`<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  speak:`<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  book:`<svg viewBox="0 0 24 24"><path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6v14" stroke="currentColor" stroke-width="2"/></svg>`,
  passport:`<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="10" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  photo:`<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="2" fill="currentColor"/><path d="M4 18l5-5 4 3 3-3 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  lock:`<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  star:`<svg viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.8-4.4 4.2 1.1 6.1L12 16.8 6.5 19.7l1.1-6.1L3.2 9.4l6.1-.8z" fill="currentColor"/></svg>`,
  home:`<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  check:`<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  hint:`<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  plane:`<svg viewBox="0 0 24 24"><path d="M2 13l8-1 5-8h2l-2 8 5-.5 2-2.5h1.5l-1 4 1 4H22l-2-2.5-5-.5 2 8h-2l-5-8-8-1z" fill="currentColor"/></svg>`
};

// food, word & habitat pictures
const FOOD = {
  fish:`<path d="M14 40 C24 24 50 22 60 40 C50 58 24 56 14 40z" fill="#7fb0d6" ${ST}/><path d="M60 40 l12 -10 l0 20z" fill="#6a9cc4"/>${E(24,37,3)}`,
  leaves:`<path d="M40 70 C40 50 40 30 40 14" stroke="#4f7d3a" stroke-width="3"/><path d="M40 30 C20 26 14 12 16 8 C30 8 40 18 40 30z M40 42 C60 38 66 24 64 20 C50 20 40 30 40 42z M40 56 C22 54 16 42 18 38 C30 38 40 46 40 56z" fill="#6aa84f" ${ST}/>`,
  fruit:`<path d="M20 50 C24 66 52 70 62 52 C50 58 30 58 20 50z" fill="#f4d03f" ${ST}/><circle cx="34" cy="30" r="9" fill="#7d3c98"/><circle cx="48" cy="28" r="9" fill="#8e44ad"/><circle cx="41" cy="18" r="8" fill="#6c3483"/><path d="M41 10 l2 -6" stroke="#4f7d3a" stroke-width="3"/>`,
  grass:`${[14,22,30,38,46,54,62].map((x,i)=>`<path d="M${x} 70 Q${x+(i%2?6:-6)} 44 ${x+(i%2?2:-2)} ${20+(i%3)*8}" stroke="${i%2?'#7fb33b':'#5f9a2e'}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join('')}`,
  bugs:`<ellipse cx="30" cy="34" rx="14" ry="12" fill="#e0342e" ${ST}/><path d="M30 22 v24" stroke="#222" stroke-width="2"/><circle cx="24" cy="32" r="3" fill="#222"/><circle cx="36" cy="38" r="3" fill="#222"/><circle cx="30" cy="20" r="5" fill="#222"/>
    <path d="M40 62 q8 -10 16 0 q8 10 16 0" stroke="#e39b8a" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  krill:`${[[22,24],[50,30],[30,54],[56,58]].map(([x,y])=>`<path d="M${x} ${y} q10 -8 18 2 q-4 8 -14 6z" fill="#f28c6b" ${ST}/><path d="M${x} ${y} l-6 -4 M${x} ${y} l-6 2" stroke="#f28c6b" stroke-width="1.5"/>`).join('')}`,
  plants:`<path d="M24 74 C14 54 32 44 22 22 M40 74 C50 54 32 40 44 14 M58 74 C50 56 64 44 56 26" stroke="#3c8f6a" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="22" cy="22" r="4" fill="#55b089"/><circle cx="44" cy="14" r="4" fill="#55b089"/>`
};
PP.foodSVG = k=>`<svg viewBox="0 0 80 80"><g filter="url(#wc)">${FOOD[k]||''}</g></svg>`;
const WORD = {
  wave:`<path d="M30 70 C18 58 16 44 22 38 L30 46 L28 18 C28 12 36 12 36 18 L37 36 L38 12 C38 6 46 6 46 12 L46 36 L48 16 C48 10 56 10 56 16 L55 38 L58 24 C58 18 66 18 65 24 L62 52 C60 64 52 72 30 70z" fill="#f2c9a3" ${ST}/><path d="M68 10 q6 6 4 14 M12 22 q-4 8 0 14" stroke="#e98a2f" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  heart:`<path d="M40 68 C14 50 10 34 18 24 C26 14 38 18 40 28 C42 18 54 14 62 24 C70 34 66 50 40 68z" fill="#e8577a" ${ST}/>${HI(30,30,8,5)}`,
  drop:`<path d="M40 10 C52 30 62 42 62 52 a22 22 0 0 1 -44 0 C18 42 28 30 40 10z" fill="#5fb3e6" ${ST}/>${HI(32,48,5,8)}`,
  sun:`<circle cx="40" cy="40" r="16" fill="#f8c537"/>${Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return `<path d="M${40+22*Math.cos(a)} ${40+22*Math.sin(a)} L${40+30*Math.cos(a)} ${40+30*Math.sin(a)}" stroke="#f8a937" stroke-width="5" stroke-linecap="round"/>`}).join('')}`,
  '123':`<circle cx="18" cy="40" r="10" fill="#e8577a"/><circle cx="40" cy="40" r="10" fill="#f8c537"/><circle cx="62" cy="40" r="10" fill="#5fb3e6"/><text x="18" y="45" font-size="14" text-anchor="middle" fill="#fff" font-weight="800">1</text><text x="40" y="45" font-size="14" text-anchor="middle" fill="#fff" font-weight="800">2</text><text x="62" y="45" font-size="14" text-anchor="middle" fill="#fff" font-weight="800">3</text>`
};
PP.wordSVG = icon=>{
  if(icon.startsWith('a:')) return PP.animalSVG(icon.slice(2));
  if(/^n\d$/.test(icon)){const n=+icon[1];return `<svg viewBox="0 0 80 80">${Array.from({length:n},(_,i)=>`<circle cx="${14+(i%3)*26}" cy="${n>3?(i<3?26:54):40}" r="10" fill="${['#e8577a','#f8c537','#5fb3e6','#6aa84f','#9d7cd8'][i]}"/>`).join('')}</svg>`;}
  return `<svg viewBox="0 0 80 80"><g filter="url(#wc)">${WORD[icon]||''}</g></svg>`;
};
const HAB = {
  ocean:`<rect width="120" height="90" fill="#bfe3f2"/><path d="M0 40 q15 -8 30 0 t30 0 t30 0 t30 0 V90 H0z" fill="#3f86b5"/><path d="M0 56 q15 -6 30 0 t30 0 t30 0 t30 0" stroke="#9fd0ea" stroke-width="3" fill="none"/><path d="M80 70 q8 -6 16 0 q-8 6 -16 0z" fill="#f2b632"/>`,
  reef:`<rect width="120" height="90" fill="#7fd3df"/><path d="M0 70 q30 -6 60 0 t60 0 V90 H0z" fill="#f2deb0"/><path d="M20 70 C18 50 26 46 24 36 M24 52 l10 -8 M22 60 l-8 -6" stroke="#ef6f90" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="70" cy="62" r="10" fill="#f4a64a"/><path d="M92 70 C92 54 100 50 98 40" stroke="#9d7cd8" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M50 30 l10 -6 l0 12z M58 30 q-8 -8 -14 0 q6 8 14 0z" fill="#f2c937"/>`,
  rainforest:`<rect width="120" height="90" fill="#cfe8c8"/>${[[10,40,22,'#2f7d4a'],[40,30,26,'#3f9b5a'],[78,36,24,'#2f7d4a'],[106,30,20,'#5bb26a'],[24,64,24,'#3f9b5a'],[64,66,28,'#2a6e40'],[100,64,24,'#3f9b5a']].map(([x,y,r,c])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join('')}<path d="M60 90 V60" stroke="#5a3e2a" stroke-width="5"/>`,
  forest:`<rect width="120" height="90" fill="#e3efd9"/><rect y="74" width="120" height="16" fill="#8fb36b"/>${[14,40,66,92,112].map((x,i)=>`<path d="M${x} ${20+i%2*8} L${x+14} 78 L${x-14} 78z" fill="${i%2?'#3f6f45':'#2f5d3a'}"/>`).join('')}`,
  arctic:`<rect width="120" height="90" fill="#e8f3fa"/><path d="M0 60 L30 44 L54 58 L84 40 L120 56 V90 H0z" fill="#fff"/><path d="M0 74 L120 70 V90 H0z" fill="#9fcbe0"/><path d="M30 44 L36 56 L24 54z M84 40 L92 54 L78 52z" fill="#cfe4f0"/>${[[20,16],[50,24],[90,14],[104,28]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2" fill="#9fb8c8"/>`).join('')}`,
  grassland:`<rect width="120" height="90" fill="#f4ecc8"/><circle cx="96" cy="22" r="10" fill="#f8c537"/><path d="M0 56 q30 -12 60 0 t60 0 V90 H0z" fill="#a8b85a"/>${[10,30,50,70,90,110].map(x=>`<path d="M${x} 80 l-3 -12 M${x} 80 l3 -12 M${x} 80 l0 -14" stroke="#7d9a3a" stroke-width="2"/>`).join('')}`,
  wetland:`<rect width="120" height="90" fill="#dcefe8"/><path d="M0 50 L120 50 V90 H0z" fill="#5aa49a"/><path d="M10 50 q50 -10 100 0" fill="#7fb36b"/>${[16,24,96,104].map(x=>`<path d="M${x} 74 V40" stroke="#6b8f3a" stroke-width="3"/><ellipse cx="${x}" cy="38" rx="3" ry="7" fill="#7a4f2e"/>`).join('')}<ellipse cx="60" cy="66" rx="12" ry="3" fill="#8fd0c4"/>`,
  desert:`<rect width="120" height="90" fill="#fbe6c4"/><circle cx="24" cy="22" r="11" fill="#f8b537"/><path d="M0 60 q40 -18 80 0 t40 -6 V90 H0z" fill="#e2b679"/><path d="M84 74 V40 M84 52 h-8 v-8 M84 58 h8 v-10" stroke="#5f9a52" stroke-width="7" fill="none" stroke-linecap="round"/>`
};
PP.habSVG = k=>`<svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice"><g filter="url(#wc)">${HAB[k]||''}</g></svg>`;

const SHP = {
  circle:'<circle cx="50" cy="50" r="38"/>', square:'<rect x="14" y="14" width="72" height="72" rx="4"/>',
  triangle:'<path d="M50 10 L90 86 L10 86z"/>', rectangle:'<rect x="6" y="28" width="88" height="46" rx="4"/>',
  oval:'<ellipse cx="50" cy="50" rx="44" ry="28"/>', heart:'<path d="M50 88 C14 62 6 40 18 26 C30 12 46 18 50 32 C54 18 70 12 82 26 C94 40 86 62 50 88z"/>',
  star:'<path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 72 L21 92 L32 58 L4 38 L38 38z"/>',
  hexagon:poly(6,42,0), pentagon:poly(5,42,-90), octagon:poly(8,42,22.5), trapezoid:'<path d="M28 22 L72 22 L94 80 L6 80z"/>'
};
function poly(n,r,rot){let p=[];for(let i=0;i<n;i++){const a=(rot+i*360/n)*Math.PI/180;p.push((50+r*Math.cos(a)).toFixed(1)+' '+(50+r*Math.sin(a)).toFixed(1));}return `<path d="M${p.join(' L')}z"/>`;}
PP.shapeSVG = (k,c)=>`<svg viewBox="0 0 100 100"><g fill="${c}" stroke="#3b2f2a" stroke-opacity=".3" stroke-width="3" filter="url(#wc)">${SHP[k]}</g></svg>`;

// ---------- scenes (800x450) ----------
const cloud=(x,y,s=1,o=.85)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="${o}"><ellipse cx="0" cy="0" rx="46" ry="16"/><ellipse cx="-22" cy="-8" rx="22" ry="16"/><ellipse cx="14" cy="-14" rx="26" ry="20"/></g>`;
const pine=(x,y,h,c='#2f5d4a')=>`<path d="M${x} ${y-h} L${x+h*.28} ${y-h*.45} L${x+h*.16} ${y-h*.45} L${x+h*.36} ${y} L${x-h*.36} ${y} L${x-h*.16} ${y-h*.45} L${x-h*.28} ${y-h*.45}z" fill="${c}"/>`;
const blob=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const tree=(x,y,r,c,t='#6b4a2e')=>`<path d="M${x} ${y} L${x} ${y-r*1.2}" stroke="${t}" stroke-width="${r*.22}"/>${blob(x-r*.5,y-r*1.3,r*.7,c)}${blob(x+r*.5,y-r*1.25,r*.72,c)}${blob(x,y-r*1.7,r*.8,c)}`;
const palm=(x,y,h)=>`<path d="M${x} ${y} Q${x+14} ${y-h/2} ${x+6} ${y-h}" stroke="#8a6a44" stroke-width="9" fill="none"/>${[-150,-110,-60,-20,20].map(a=>{const r=a*Math.PI/180;return `<path d="M${x+6} ${y-h} q${Math.cos(r)*30} ${Math.sin(r)*30-14} ${Math.cos(r)*58} ${Math.sin(r)*58+8}" stroke="#3f9b5a" stroke-width="10" fill="none" stroke-linecap="round"/>`}).join('')}`;
const grad=(id,a,b)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const SC = {
 seoul:()=>`<defs>${grad('sk-seoul','#9fd0ec','#ffe8cc')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-seoul)"/>${cloud(140,70)}${cloud(560,50,.8)}
  <path d="M0 250 L60 190 L110 225 L170 150 L230 210 L300 175 L360 225 L420 196 L480 235 L560 185 L640 225 L720 172 L800 214 V450 H0z" fill="#a9bccb"/>
  <path d="M520 260 C560 190 680 180 760 262z" fill="#8fb27a"/><path d="M640 196 V120 M632 140 h16 v10 h-16z" stroke="#e9e3d8" stroke-width="5"/><rect x="628" y="128" width="24" height="12" rx="4" fill="#f4efe6"/><path d="M640 120 V96" stroke="#d9534f" stroke-width="2"/>
  ${[[0,60,90],[70,40,70],[120,52,110],[180,36,80],[380,46,95],[440,40,70],[490,56,120],[760,40,90]].map(([x,w,h])=>`<rect x="${x}" y="${300-h}" width="${w}" height="${h}" fill="#c3cfda"/>${Array.from({length:Math.floor(h/22)},(_,i)=>`<rect x="${x+8}" y="${300-h+10+i*20}" width="${w-16}" height="6" fill="#e6edf3" opacity=".8"/>`).join('')}`).join('')}
  <rect x="0" y="300" width="800" height="150" fill="#a8c98a"/><rect x="190" y="290" width="200" height="60" fill="#d9cdb8"/><path d="M270 350 V318 a20 20 0 0 1 40 0 V350z" fill="#5a4636"/>
  <rect x="206" y="244" width="168" height="46" fill="#4f9a7a"/>${[214,246,278,310,342,362].map(x=>`<rect x="${x}" y="250" width="8" height="40" fill="#b8433f"/>`).join('')}
  <path d="M176 248 C220 244 246 226 290 222 C334 226 360 244 404 248 C380 254 340 250 290 248 C240 250 200 254 176 248z" fill="#3d4a4f"/>
  <path d="M220 222 C250 218 268 204 290 202 C312 204 330 218 360 222 C340 226 316 224 290 222 C264 224 240 226 220 222z" fill="#3d4a4f"/><rect x="236" y="222" width="108" height="10" fill="#4f9a7a"/>
  <rect x="470" y="356" width="330" height="10" fill="#7a8794"/><g><rect x="520" y="330" width="200" height="26" rx="10" fill="#e9eef2"/><rect x="520" y="340" width="200" height="6" fill="#3f9b5a"/>${[540,575,610,645,680].map(x=>`<rect x="${x}" y="333" width="22" height="7" rx="2" fill="#7fa8c8"/>`).join('')}</g>
  <path d="M420 400 L500 400 L494 372 L426 372z" fill="#f4e3c4"/><path d="M420 372 h80 l-6 -16 h-68z" fill="#d9534f"/><path d="M430 372 h12 l-2 -16 M456 372 h12 l-2 -16 M482 372 h12 l-2 -16" stroke="#fff" stroke-width="5"/><ellipse cx="460" cy="386" rx="16" ry="6" fill="#e2452a"/>
  <ellipse cx="130" cy="410" rx="120" ry="26" fill="#86c3d6"/><ellipse cx="110" cy="404" rx="70" ry="8" fill="#b5e0ec"/>
  ${tree(60,330,40,'#f7c6d4','#7a5236')}${tree(760,340,44,'#f4b7c9','#7a5236')}${tree(400,300,24,'#f7d0dc','#7a5236')}`,
 mexico:()=>`<defs>${grad('sk-mx','#a8d8ea','#ffe0b3')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-mx)"/>${cloud(200,70)}${cloud(620,90,.7)}
  <path d="M520 240 L630 150 L660 158 L700 150 L800 230 V300 H520z" fill="#b3a6c9"/><path d="M612 166 L630 150 L660 158 L700 150 L716 166 C690 172 640 172 612 166z" fill="#fff"/><path d="M660 150 q-6 -20 6 -30 q10 -10 4 -24" stroke="#e7e1ee" stroke-width="10" fill="none" opacity=".7" stroke-linecap="round"/>
  <rect x="396" y="110" width="12" height="190" fill="#e8dfc8"/><rect x="386" y="290" width="32" height="20" fill="#d9cdb2"/><path d="M402 110 l-10 -14 l10 -10 l10 10z M394 98 l-18 -10 l16 4z M410 98 l18 -10 l-16 4z" fill="#e8b93a"/>
  ${[[0,'#e86fa0',110],[70,'#f4c542',90],[130,'#39a9a1',120],[200,'#ef8a3c',96],[260,'#4f7fc4',110],[470,'#f4c542',104],[540,'#e86fa0',90],[600,'#39a9a1',116],[670,'#ef8a3c',100],[730,'#9d7cd8',112]].map(([x,c,h])=>`<rect x="${x}" y="${320-h}" width="72" height="${h}" fill="${c}"/><rect x="${x}" y="${320-h}" width="72" height="8" fill="#fff" opacity=".35"/>${[0,1].map(i=>`<rect x="${x+12+i*30}" y="${330-h+16}" width="16" height="22" rx="8" fill="#5a4636" opacity=".55"/><rect x="${x+8+i*30}" y="${330-h+38}" width="24" height="4" fill="#3b2f2a" opacity=".6"/>`).join('')}`).join('')}
  <rect x="0" y="318" width="800" height="132" fill="#c9b892"/>${tree(340,330,36,'#9d7cd8')}${tree(470,330,30,'#b195e3')}${tree(40,340,30,'#9d7cd8')}
  <rect x="0" y="380" width="800" height="70" fill="#5fb3b3"/><path d="M0 396 q40 -6 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#a6dede" stroke-width="3" fill="none"/>
  <g><path d="M520 400 h180 l-14 22 h-152z" fill="#e8577a"/><path d="M536 400 v-24 h148 v24" stroke="#f4c542" stroke-width="6" fill="none"/><rect x="560" y="364" width="100" height="16" rx="4" fill="#39a9a1"/><text x="610" y="376" font-size="11" text-anchor="middle" fill="#fff" font-weight="700">LUPITA</text></g>
  <g><rect x="170" y="340" width="70" height="40" rx="4" fill="#f3e2bf"/><path d="M164 340 h82 l-8 -16 h-66z" fill="#39a9a1"/><circle cx="190" cy="356" r="7" fill="#f2c94c"/><circle cx="212" cy="358" r="7" fill="#e98a2f"/></g>`,
 tokyo:()=>`<defs>${grad('sk-tk','#bcdcf2','#fde2e4')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-tk)"/>${cloud(620,70)}${cloud(90,110,.6)}
  <path d="M40 270 L190 150 L210 146 L230 150 L380 270z" fill="#8fa8c8"/><path d="M160 174 L190 150 L210 146 L230 150 L262 176 C240 184 222 172 210 182 C196 172 178 186 160 174z" fill="#fff"/>
  ${[[300,40,80],[350,60,120],[420,44,96],[640,50,110],[700,40,84],[750,50,130]].map(([x,w,h])=>`<rect x="${x}" y="${290-h}" width="${w}" height="${h}" fill="#b7c3d6"/>${Array.from({length:Math.floor(h/18)},(_,i)=>`<rect x="${x+6}" y="${290-h+8+i*16}" width="${w-12}" height="5" fill="#e3e9f2" opacity=".8"/>`).join('')}`).join('')}
  <g><path d="M520 80 L560 290 L480 290z" fill="none" stroke="#e8603c" stroke-width="6"/><path d="M520 80 L548 230 L492 230z" fill="#e8603c" opacity=".25"/>${[[120,'#fff'],[160,'#e8603c'],[200,'#fff'],[240,'#e8603c']].map(([y,c])=>`<path d="M${520-(y-80)*.19} ${y} H${520+(y-80)*.19}" stroke="${c}" stroke-width="7"/>`).join('')}<rect x="504" y="168" width="32" height="12" fill="#f4efe6"/><path d="M520 80 V56" stroke="#e8603c" stroke-width="3"/>
   <path d="M500 290 a20 20 0 0 1 40 0" fill="#fde2e4"/></g>
  <rect x="0" y="290" width="800" height="12" fill="#7a8794"/><g><path d="M90 268 C120 258 160 256 200 256 H600 V290 H100 C60 290 50 282 90 268z" fill="#f6f7f8" stroke="#9aa6b1" stroke-width="2"/><rect x="140" y="274" width="460" height="6" fill="#2f5fb3"/>${[220,280,340,400,460,520,580].map(x=>`<rect x="${x}" y="262" width="34" height="9" rx="3" fill="#6b8aa6"/>`).join('')}</g>
  <rect x="0" y="302" width="800" height="148" fill="#9fc58a"/><ellipse cx="420" cy="390" rx="200" ry="40" fill="#7fc0d6"/><ellipse cx="400" cy="384" rx="140" ry="12" fill="#a9d9e8"/>
  <path d="M330 380 Q420 330 510 380" stroke="#c8453b" stroke-width="9" fill="none"/><path d="M350 370 v14 M390 356 v20 M450 356 v20 M490 370 v14" stroke="#c8453b" stroke-width="4"/>
  <g><rect x="690" y="330" width="10" height="40" fill="#9a958c"/><rect x="678" y="320" width="34" height="14" fill="#b5afa4"/><path d="M672 320 L695 304 L718 320z" fill="#8a857c"/><rect x="684" y="370" width="22" height="8" fill="#9a958c"/></g>
  <g><path d="M70 400 C80 360 110 340 120 320" stroke="#5a3e2a" stroke-width="10" fill="none"/>${[[100,316,30],[140,320,24],[70,336,24],[120,296,22]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.45}" fill="#2f5d3a"/>`).join('')}</g>${tree(260,330,26,'#d9534f','#5a3e2a')}`,
 hawaii:()=>`<defs>${grad('sk-hi','#8fd3f0','#ffe3b3')}${grad('oc-hi','#46b3d9','#2a7fae')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-hi)"/>${cloud(320,60)}${cloud(700,40,.7)}
  <path d="M520 250 L640 150 L680 154 L800 240 V270 H520z" fill="#7f6a54"/><path d="M640 150 L660 140 L680 154 L700 170 C670 176 640 172 620 166z" fill="#5f8f4e"/><path d="M660 140 q-10 -30 10 -50 q16 -16 6 -40" stroke="#e7e2dc" stroke-width="16" fill="none" opacity=".7" stroke-linecap="round"/>
  <path d="M0 80 C60 70 160 100 220 160 L250 270 H0z" fill="#3f8f50"/><path d="M0 120 C60 110 140 130 190 180 L210 270 H0z" fill="#2f7d4a"/><path d="M130 140 C134 180 128 220 136 270" stroke="#eef8fb" stroke-width="12" fill="none"/><path d="M136 140 C140 180 134 220 142 270" stroke="#bfe6f2" stroke-width="3" fill="none"/>
  <rect x="0" y="250" width="800" height="110" fill="url(#oc-hi)"/>${[[460,320,60],[620,340,50],[300,330,40]].map(([x,y,r])=>`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="12" fill="#7fd3df" opacity=".55"/>`).join('')}
  <path d="M0 268 q40 -6 80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0 t80 0" stroke="#bfe7f5" stroke-width="3" fill="none"/>
  <path d="M0 360 C200 340 600 340 800 360 V450 H0z" fill="#f3dfae"/><path d="M0 362 C200 346 600 346 800 362" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>
  ${palm(700,420,150)}${palm(760,430,110)}${palm(40,430,120)}<g><path d="M300 408 l14 28 h20 l14 -28z" fill="#fff"/><path d="M300 408 q24 -34 48 0z" fill="#f26b6b"/><path d="M310 400 q14 -18 28 -4" fill="#f9d56e"/></g>`,
 alaska:()=>`<defs>${grad('sk-ak','#a9c3d6','#e3ecf1')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-ak)"/><circle cx="660" cy="200" r="26" fill="#ffd9a0" opacity=".8"/>${cloud(160,70,1.2,.9)}${cloud(500,50,1,.9)}
  <path d="M0 260 L110 130 L170 170 L260 90 L360 190 L440 120 L540 210 L640 110 L740 180 L800 150 V300 H0z" fill="#6e7f92"/>
  <path d="M80 166 L110 130 L140 150 L170 170 L150 176 L120 160z M220 130 L260 90 L300 132 L280 140 L260 122 L240 142z M410 150 L440 120 L480 160 L460 166 L440 146z M600 150 L640 110 L690 146 L660 156 L640 140 L620 160z" fill="#fff"/>
  <path d="M250 120 C270 180 300 230 330 280 L420 280 C380 230 330 190 280 110z" fill="#bfe3f2"/><path d="M280 150 C300 200 330 240 360 280" stroke="#e8f6fb" stroke-width="5" fill="none"/>
  <rect x="0" y="280" width="800" height="70" fill="#8fb6c9"/><path d="M0 300 h800" stroke="#b9d4e0" stroke-width="2"/>${[40,90,150,600,660,720,770].map((x,i)=>pine(x,300,50+i%3*14,'#36614c')).join('')}
  <rect x="0" y="346" width="800" height="104" fill="#93a56e"/>${[20,80,130,520,580,650,720,780].map((x,i)=>pine(x,380+i%2*20,90+i%3*20,i%2?'#2f5d4a':'#284f3f')).join('')}
  <path d="M220 450 C240 400 300 380 360 380 C420 380 460 400 480 450z" fill="#8a9a5f"/>`,
 costarica:()=>`<defs>${grad('sk-cr','#b9e2d0','#f2f8e8')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-cr)"/>
  <path d="M400 240 L520 90 L556 92 L680 240z" fill="#6f8a6a"/><path d="M500 116 L520 90 L556 92 L574 116 C550 124 524 122 500 116z" fill="#5a6d58"/>${cloud(540,84,.9,.9)}
  ${[[0,230,60,'#5bb26a'],[90,220,70,'#4aa060'],[200,236,60,'#5bb26a'],[300,240,50,'#3f9b5a'],[660,232,64,'#4aa060'],[760,226,70,'#5bb26a']].map(([x,y,r,c])=>blob(x,y,r,c)).join('')}
  <rect x="0" y="240" width="800" height="210" fill="#3f9b5a"/>
  <path d="M640 160 C660 220 650 300 660 380" stroke="#eef8fb" stroke-width="20" fill="none"/><path d="M648 160 C668 220 658 300 668 380" stroke="#bfe6f2" stroke-width="5" fill="none"/><ellipse cx="664" cy="390" rx="60" ry="14" fill="#8fd0e6"/>
  <path d="M120 300 L120 140 M380 300 L380 150" stroke="#6b4a2e" stroke-width="14"/><path d="M120 190 Q250 250 380 196" stroke="#8a6a44" stroke-width="4" fill="none"/><path d="M120 176 Q250 232 380 182" stroke="#8a6a44" stroke-width="3" fill="none"/>
  ${Array.from({length:12},(_,i)=>{const t=(i+.5)/12,x=120+260*t,y=190+ (1-Math.pow(2*t-1,2))*54-6*t;return `<path d="M${x} ${y} V${y-14}" stroke="#8a6a44" stroke-width="2"/>`}).join('')}
  ${[[60,130,46,'#2f7d4a'],[150,110,52,'#2a6e40'],[350,120,48,'#2f7d4a'],[430,130,40,'#3f9b5a']].map(([x,y,r,c])=>blob(x,y,r,c)).join('')}
  ${[[30,420,'#2f7d4a',-30],[110,440,'#3a8a52',10],[760,430,'#2f7d4a',30],[420,450,'#2a6e40',-10]].map(([x,y,c,a])=>`<ellipse cx="${x}" cy="${y}" rx="70" ry="28" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('')}`,
 iceland:()=>`<defs>${grad('sk-is','#1b2a4c','#7d93bf')}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#sk-is)"/>
  ${[[60,30],[180,60],[300,24],[420,50],[700,30],[760,80],[540,40]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8" fill="#fff" opacity=".8"/>`).join('')}
  <g filter="url(#blur6)" opacity=".75"><path d="M60 140 C160 40 260 120 360 60 C460 10 560 90 760 40 L760 90 C560 140 460 70 360 120 C260 170 160 100 60 190z" fill="#6ef2b0"/><path d="M300 90 C400 40 520 100 640 60 L640 90 C520 130 400 80 300 130z" fill="#b48cf2"/></g>
  <path d="M0 250 L120 190 L260 230 L380 180 L520 220 L640 170 L800 210 V280 H0z" fill="#eaf2f8"/><path d="M0 262 L800 252 V290 H0z" fill="#c9dce8"/>
  <path d="M600 250 L660 196 L720 250z" fill="#3a3a44"/><path d="M660 196 q-10 -20 4 -34" stroke="#d9dde6" stroke-width="10" fill="none" opacity=".6" stroke-linecap="round"/>
  <path d="M-20 290 V196 C40 180 140 172 230 170 C280 168 312 174 336 186 L350 290z" fill="#5c6a52"/><path d="M-20 200 C40 184 140 176 230 174 C280 172 312 178 336 190 L336 198 C300 186 260 182 230 182 C140 184 40 192 -20 210z" fill="#7f9a5f"/><path d="M0 290 C120 270 260 280 360 300 V340 H0z" fill="#6f8f5a"/><path d="M180 170 C176 220 184 260 180 300" stroke="#f4fbff" stroke-width="30" fill="none"/><path d="M186 170 C182 220 190 260 186 300" stroke="#cfe8f4" stroke-width="6" fill="none"/>
  <ellipse cx="184" cy="310" rx="60" ry="12" fill="#e9f5fb" opacity=".85"/><rect x="330" y="290" width="470" height="60" fill="#7fa06a"/>
  <ellipse cx="520" cy="320" rx="60" ry="14" fill="#8fd6e0"/><path d="M500 312 q-8 -20 4 -36 M530 310 q8 -20 -4 -40" stroke="#eef" stroke-width="8" fill="none" opacity=".55" stroke-linecap="round"/>
  <path d="M0 340 H800 V450 H0z" fill="#2b2b33"/><path d="M420 380 C560 360 700 370 800 360 V450 H420z" fill="#3f5f7a"/><path d="M430 384 C560 366 700 376 800 366" stroke="#dfe9f2" stroke-width="4" fill="none"/>`
};
PP.sceneSVG = key=>{
  const f = SC[key] || (()=>genericScene(key));
  return `<svg class="scene-svg" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice"><g filter="url(#wc)">${f()}</g><rect width="800" height="450" filter="url(#grain)" opacity=".5"/></svg>`;
};
function genericScene(style){
  const p={beach:['#8fd3f0','#ffe3b3','#46b3d9','#f3dfae'],mountain:['#a9c3d6','#e3ecf1','#6e7f92','#93a56e'],forest:['#cfe8c8','#f2f8e8','#4aa060','#3f9b5a'],city:['#bcdcf2','#fde2e4','#b7c3d6','#9fc58a'],snow:['#bcd2e6','#f2f6fa','#dfeaf2','#f4f8fb'],desert:['#9fd0ec','#fbe6c4','#e2b679','#f0cf98']}[style]||['#cfe8c8','#f2f8e8','#4aa060','#3f9b5a'];
  const id='sk-g'+style;
  return `<defs>${grad(id,p[0],p[1])}</defs><rect x="-20" y="-20" width="840" height="490" fill="url(#${id})"/>${cloud(200,80)}${cloud(600,60,.8)}
   <path d="M0 260 L120 170 L240 230 L380 150 L520 230 L660 160 L800 220 V450 H0z" fill="${p[2]}"/><path d="M0 320 C200 290 600 300 800 320 V450 H0z" fill="${p[3]}"/>
   ${style==='beach'?palm(680,420,140):style==='city'?[60,140,600,680].map(x=>`<rect x="${x}" y="200" width="56" height="120" fill="#c3cfda"/>`).join(''):style==='desert'?'':[60,130,680,750].map(x=>pine(x,380,100,'#2f5d4a')).join('')}`;
}
// where animals and fun spots sit in each scene, in % of the scene box [x,y,width]
PP.SLOTS = {
  seoul:{blackbear:[6,52,20],otter:[22,74,14],crane:[34,62,14],magpie:[78,22,13]},
  mexico:{axolotl:[30,82,15],jaguar:[60,62,20],spidermonkey:[10,44,14],flamingo:[84,58,14]},
  tokyo:{macaque:[6,60,15],tanuki:[76,64,15],crane:[30,58,14],koi:[54,80,13]},
  hawaii:{turtle:[40,60,16],monkseal:[30,80,18],manta:[64,62,16],dolphin:[12,54,16],reeffish:[52,74,11]},
  alaska:{moose:[6,62,20],grizzly:[74,72,20],eagle:[68,16,13],orca:[38,58,16],polarbear:[48,74,18]},
  costarica:{sloth:[30,20,14],toucan:[6,22,13],frog:[48,82,10],howler:[60,40,14],jaguar:[72,74,19]},
  iceland:{puffin:[40,56,13],arcticfox:[4,62,15],horse:[50,54,15],reindeer:[66,56,14],sheep:[22,60,13],orca:[86,80,13],humpback:[62,82,18],harborseal:[28,80,15]}
};
// painted scene images: hotspots [x,y,w,h] and star spots [x,y] in % of the image
PP.SCENE_IMG = {
  alaska:{src:'photos/alaska-scene.jpg?v=2',ar:1.6011,
    hot:{moose:[2.7,41.2,17.2,33.3],orca:[31.2,41.2,11.1,21.7],eagle:[70.0,7.6,10.8,16.3],polarbear:[63.7,65.1,14.6,30.4],grizzly:[78.4,59.0,12.0,20.3]},
    stars:[[38.2,38.0],[84.3,39.8],[91.1,74.1],[57.4,23.5]]}
};
Object.assign(PP.SCENE_IMG,{
  costarica:{src:'photos/costarica-scene.jpg',ar:1.5947,hot:{toucan:[7,17,10,16],sloth:[35,10,10,18],spidermonkey:[65,34,9,14],jaguar:[75,68,15,16]},
    overlay:{frog:[30,80,7]},stars:[[32,39],[67,26],[83,52.5],[18.5,86]]},
  seoul:{src:'photos/seoul-scene.jpg',ar:1.6129,hot:{blackbear:[10,44,17,23],crane:[27,55,9,16],otter:[23,74,14,23],magpie:[83,22,14,13]},stars:[[37,49],[80.5,29],[80,70],[13.5,83]]},
  tokyo:{src:'photos/tokyo-scene.jpg',ar:1.6478,hot:{macaque:[10,46,10,18],tanuki:[79,54,13,14],koi:[50,86,40,14]},stars:[[65.5,25.5],[38,52],[27,17.5],[72,84],[26.5,68]]},
  mexico:{src:'photos/mexico-scene.jpg',ar:1.6393,hot:{spidermonkey:[5,32,8,13],axolotl:[7,74,27,20],jaguar:[63,52,16,18],flamingo:[84,48,10,21]},stars:[[51,23],[17,27],[26,70.5],[85.5,92]]},
  hawaii:{src:'photos/hawaii-scene.jpg',ar:1.6113,hot:{dolphin:[14,47,16,12],turtle:[43,53,8,11],manta:[64,53,15,17],monkseal:[32,74,16,12]},stars:[[81.5,38],[17.5,44],[40,87.5]]},
  iceland:{src:'photos/iceland-scene.jpg',ar:1.6162,hot:{arcticfox:[4,54,11,14],sheep:[25,54,8,10],puffin:[49.5,39,6,11],horse:[56,41,11,18],reindeer:[69,43,9,19],harborseal:[24,73,16,13],wbdolphin:[64,75,19,11],orca:[86,69,14,11]},stars:[[22.5,47],[70,14],[69,67],[24.5,84]]}
});
PP.sceneArt = key=>PP.SCENE_IMG[key]?`<img class="scene-img" src="${PP.SCENE_IMG[key].src}" alt="">`:PP.sceneSVG(key);
PP.GENERIC_SLOTS=[[8,60,17],[30,70,15],[52,62,15],[74,68,17],[62,36,13],[20,38,13],[86,44,13],[40,46,13]];
PP.SPOTS = {seoul:[[37,58],[80,30],[78,73],[57,82]],mexico:[[51,24],[78,86],[44,72],[27,77]],tokyo:[[65,32],[38,61],[25,40],[52,86]],
  hawaii:[[82,38],[60,70],[17,45],[40,92]],alaska:[[42,40],[56,28],[90,80],[83,46]],costarica:[[31,42],[66,26],[82,52],[18,88]],iceland:[[23,50],[70,16],[65,70],[30,88],[52,56]]};

// stamps
const STAMPSHAPE={seoul:'circle',mexico:'scallop',tokyo:'square',hawaii:'circle',alaska:'hex',costarica:'scallop',iceland:'circle'};
const STAMPANI={seoul:'crane',mexico:'axolotl',tokyo:'macaque',hawaii:'turtle',alaska:'moose',costarica:'toucan',iceland:'puffin'};
PP.stampSVG = (d,stamped=true)=>{
  const c=d.color, sh=STAMPSHAPE[d.id]||'circle', ani=STAMPANI[d.id]||d.animals[0];
  let border;
  if(sh==='square') border=`<rect x="12" y="12" width="176" height="176" rx="18" fill="none" stroke="${c}" stroke-width="6"/><rect x="22" y="22" width="156" height="156" rx="12" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="4 4"/>`;
  else if(sh==='hex') border=`<path d="${'M'+[0,1,2,3,4,5].map(i=>{const a=(i*60-90)*Math.PI/180;return (100+88*Math.cos(a)).toFixed(1)+' '+(100+88*Math.sin(a)).toFixed(1)}).join(' L')+'z'}" fill="none" stroke="${c}" stroke-width="6"/>`;
  else if(sh==='scallop') border=`<path d="${'M'+Array.from({length:48},(_,i)=>{const a=i*Math.PI/24,r=i%2?82:90;return (100+r*Math.cos(a)).toFixed(1)+' '+(100+r*Math.sin(a)).toFixed(1)}).join(' L')+'z'}" fill="none" stroke="${c}" stroke-width="5"/>`;
  else border=`<circle cx="100" cy="100" r="88" fill="none" stroke="${c}" stroke-width="6"/><circle cx="100" cy="100" r="78" fill="none" stroke="${c}" stroke-width="2"/>`;
  const extra = d.id==='iceland'?`<path d="M44 70 C70 40 110 66 156 46" stroke="#6ef2b0" stroke-width="8" fill="none" opacity=".6"/>`:'';
  return `<svg class="stamp ${stamped?'':'empty'}" viewBox="0 0 200 200"><defs><path id="sp-${d.id}" d="M30 100 a70 70 0 0 1 140 0"/><path id="spb-${d.id}" d="M36 112 a64 64 0 0 0 128 0"/></defs>
  <g opacity="${stamped?1:.28}" transform="rotate(${stamped?-6:0} 100 100)">${border}${extra}<svg x="50" y="58" width="100" height="80" viewBox="0 0 200 160">${PP.animalInner(ani)}</svg>
  <text font-size="17" font-weight="800" fill="${c}" letter-spacing="2"><textPath href="#sp-${d.id}" startOffset="50%" text-anchor="middle">${d.name.toUpperCase()}</textPath></text>
  ${d.country&&d.country!==d.name?`<text font-size="12" font-weight="700" fill="${c}"><textPath href="#spb-${d.id}" startOffset="50%" text-anchor="middle">${d.country.toUpperCase()}</textPath></text>`:''}</g></svg>`;
};

// map markers (40x40)
const MK = {
  seoul:`<path d="M6 22 C12 20 16 12 20 12 C24 12 28 20 34 22 C26 23 14 23 6 22z" fill="#3d4a4f"/><rect x="11" y="22" width="18" height="10" fill="#4f9a7a"/><path d="M13 22v10M20 22v10M27 22v10" stroke="#b8433f" stroke-width="2.5"/>`,
  mexico:`<rect x="18" y="12" width="4" height="22" fill="#e8dfc8"/><path d="M20 12 l-4 -5 l4 -4 l4 4z" fill="#e8b93a"/><path d="M14 9l-6-3 6 1zM26 9l6-3-6 1z" fill="#e8b93a"/><rect x="14" y="32" width="12" height="4" fill="#d9cdb2"/>`,
  tokyo:`<path d="M20 4 L28 36 L12 36z" fill="none" stroke="#e8603c" stroke-width="2.5"/><path d="M16 18h8M14 27h12" stroke="#e8603c" stroke-width="3"/>`,
  hawaii:`<path d="M18 36 Q22 24 20 14" stroke="#8a6a44" stroke-width="3" fill="none"/><path d="M20 14 q-8 -2 -14 4 M20 14 q8 -4 14 2 M20 14 q-2 -8 -8 -10 M20 14 q4 -8 10 -8" stroke="#3f9b5a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
  alaska:`<path d="M2 34 L14 14 L20 22 L26 10 L38 34z" fill="#6e7f92"/><path d="M11 19 L14 14 L17 19z M23 15 L26 10 L29 15z" fill="#fff"/>${pine(32,36,14,'#2f5d4a')}`,
  costarica:`<path d="M6 34 L18 12 L24 12 L34 34z" fill="#6f8a6a"/><ellipse cx="21" cy="10" rx="9" ry="4" fill="#fff" opacity=".9"/><circle cx="10" cy="30" r="6" fill="#3f9b5a"/><circle cx="30" cy="30" r="6" fill="#4aa060"/>`,
  iceland:`<path d="M4 14 C14 6 24 14 36 8" stroke="#6ef2b0" stroke-width="4" fill="none"/><rect x="6" y="18" width="12" height="18" fill="#5c6a52"/><path d="M18 18 v18" stroke="#cfe8f4" stroke-width="5"/><rect x="21" y="22" width="14" height="14" fill="#5c6a52"/>`
};
PP.markerSVG = d=>`<svg viewBox="0 0 40 40">${MK[d.id]||`<circle cx="20" cy="20" r="8" fill="${d.color}"/>`}</svg>`;

// ---------- world map: Pacific-centred, lon 100E → 4W ----------
const PROJ = (lon,lat)=>{let L=lon<0?lon+360:lon; if(L<60)L+=360; return [(L-100)*4,(76-lat)*5];};
PP.proj = PROJ;
const LAND = {
 asia:[[95,78],[115,74],[130,72],[140,72.5],[160,70],[170,70],[180,68.5],[190,66],[190,65.5],[180,64.5],[177,62],[170,60],[163,58],[162,56],[156,51],[156,57],[160,61],[155,59.5],[143,59],[137,54.5],[141,52],[140,48],[135,43],[131,42.5],[129,40.5],[129.5,37],[129,35.2],[126.5,34.5],[126.2,37.5],[125,39.5],[122,40],[121.5,39],[119,39.5],[117.7,38.5],[119,37],[122.5,37],[120.5,36],[119.5,34.5],[121,32],[122,30],[120,27],[117,23.5],[113,22],[110,20.5],[108,21.5],[106,20],[109,15],[109,11.5],[106,9],[104.5,10.5],[101,13],[100,8],[103,4],[104,1.3],[102,2.5],[98,8],[95,10]],
 japan:[[130,31.2],[131.5,31.5],[132,33.8],[135,33.5],[136,34.2],[137,34.6],[139,34.9],[140.5,35.3],[141,37.5],[142,39.5],[141.5,41.4],[140,40.5],[139.8,38.5],[138.5,37.3],[136.8,37],[135.5,35.6],[133,35.5],[131,34.4],[129.7,33.2]],
 hokkaido:[[140,41.5],[141.5,42.5],[143.3,42],[145.5,43.3],[144.5,44],[141.8,45.4],[141.5,43.3],[140.3,43.2]],
 taiwan:[[120.1,23],[121,25.2],[121.9,24.9],[120.8,21.9]], luzon:[[120.5,18.5],[122.5,18.4],[122,16],[124,13.5],[122,13.8],[120.6,14.5],[119.8,16.3]],
 borneo:[[109,1.5],[111,2.9],[113,3.5],[116,6.9],[119,5],[118,1],[117,-1],[116,-4],[110,-3],[109,-0.5]],
 newguinea:[[131,-1],[135,-3.2],[138,-1.5],[141,-2.6],[145,-4],[148,-6],[150,-10.5],[142,-9],[138,-8.5],[137,-5],[132,-4]],
 namerica:[[-168,65.6],[-166,68.8],[-163,70],[-156.5,71.3],[-152,70.8],[-145,70],[-140,69.6],[-135,69.4],[-128,70.3],[-120,69.5],[-114,68.5],[-108,68.5],[-100,67.8],[-95,68],[-90,69],[-85,69.5],[-82,67],[-86,64],[-92,63],[-94.5,60],[-93,57],[-88,56],[-82.5,55],[-82,52.5],[-79.5,51.5],[-78.5,55],[-77,60],[-78,62.5],[-73,62],[-69,59],[-65,60],[-62,58],[-60,55.5],[-56,52],[-59,47.5],[-64.5,49],[-66,45.5],[-70,43.6],[-70.5,41.8],[-74,40.5],[-75.5,38],[-76,35],[-78.5,33.8],[-81,31.5],[-80.2,27],[-80.1,25.4],[-81.7,25.5],[-82.7,28],[-84,30],[-87,30.4],[-90,29.2],[-94,29.5],[-97.2,27.5],[-97.5,24.5],[-97.5,21.8],[-96.2,19.2],[-94.5,18.2],[-91,18.7],[-90.4,21],[-87.1,21.5],[-87.6,18.5],[-88.3,16],[-86,15.8],[-83.3,15],[-83.6,11],[-82,9],[-79.5,9.5],[-77.5,8.5],[-77.4,7.2],[-78.5,7],[-80,7.5],[-81.5,8],[-83.5,8.4],[-85.7,10],[-85.8,11.2],[-87.5,13],[-91.4,13.9],[-94.5,16.2],[-96.5,15.6],[-100,17],[-105.5,20.5],[-105.3,22.5],[-108,25.3],[-112,29],[-114.7,31.5],[-112.8,28],[-110,23.2],[-112,24.8],[-114.5,28],[-115.8,30.3],[-117.1,32.5],[-118.5,34],[-120.6,34.6],[-122.5,37.5],[-123.8,40],[-124.2,43],[-124,46.2],[-124.7,48.4],[-123,49],[-127,50.5],[-130,54],[-132.5,56.5],[-136,58.2],[-139.5,59.8],[-144,60],[-148,60.5],[-151.5,59.2],[-154,57.5],[-158,56.5],[-162,55],[-164.5,54.5],[-159,58.5],[-162,59.8],[-165,61.3],[-164.8,63],[-161,64.5],[-166,64.6]],
 samerica:[[-77.4,7.2],[-75.5,10.5],[-72,12],[-70,12.2],[-66,10.6],[-62,10.5],[-60.5,8.5],[-57,6],[-52,5],[-50,1.5],[-48,-1],[-44,-2.5],[-40,-3],[-35,-5.5],[-35,-14],[-81,-14],[-81,-5.5],[-80,-2.5],[-80.5,0],[-78.5,2.5],[-77.5,4],[-77.3,6.5]],
 greenland:[[-73,78],[-60,82],[-30,83],[-20,81],[-18,77],[-22,72],[-22,70],[-27,68.5],[-35,66],[-40,65],[-43,60],[-48,61],[-51,64],[-53,66.5],[-54,70],[-58,75.5],[-68,77]],
 baffin:[[-80,73.5],[-71,71],[-66,68],[-62,66.5],[-65,62.8],[-71,63.2],[-75,64.5],[-73,67.5],[-81,69.5],[-90,71.5]],
 iceland:[[-24,65.5],[-22,66.4],[-18,66.2],[-15,66.4],[-13.5,65.3],[-14.5,64.4],[-18,63.4],[-21,63.8],[-22.7,64],[-22,64.8],[-24,65]],
 cuba:[[-85,21.8],[-81.5,23.1],[-77,22],[-74.1,20.2],[-77.5,19.8],[-80,21.7],[-84,21.9]], hisp:[[-74.5,19.8],[-72,19.9],[-68.5,18.5],[-71,17.6],[-74.5,18.3]],
 ireland:[[-10,51.6],[-6,52.2],[-5.5,54.5],[-8,55.3],[-10,54.2]], britain:[[-5.7,50],[-3,50.6],[-3,53.4],[-3,54.8],[-5,55],[-6,56.5],[-5,58.6],[-3,58.6],[-1.8,57.5],[0,56],[2,52],[1,51]]
};
function smooth(pts){const P=pts.map(([lo,la])=>PROJ(lo,la));const n=P.length;const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];let m=mid(P[n-1],P[0]);let d=`M${m[0].toFixed(1)} ${m[1].toFixed(1)}`;for(let i=0;i<n;i++){const p=P[i],q=mid(P[i],P[(i+1)%n]);d+=` Q${p[0].toFixed(1)} ${p[1].toFixed(1)} ${q[0].toFixed(1)} ${q[1].toFixed(1)}`;}return d+'z';}
PP.mapSVG = ()=>{
  const land=Object.values(LAND).map(smooth).join(' ');
  const hi=[[-155.5,19.6,9],[-156.3,20.8,5],[-157.9,21.45,4],[-159.5,22.05,4]].map(([lo,la,r])=>{const [x,y]=PROJ(lo,la);return `<circle cx="${x}" cy="${y}" r="${r}"/>`}).join('');
  const waves=Array.from({length:22},(_,i)=>{const x=(i*137)%1000+20,y=60+((i*89)%320);return `<path d="M${x} ${y} q8 -6 16 0 t16 0" stroke="#e8f4f8" stroke-width="2.5" fill="none" opacity=".7"/>`}).join('');
  return `<svg class="mapsvg" viewBox="0 0 1024 400" preserveAspectRatio="xMidYMid meet">
   <defs><radialGradient id="seaG" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#b7e1ee"/><stop offset="1" stop-color="#7dbfd8"/></radialGradient></defs>
   <rect width="1024" height="400" fill="url(#seaG)"/>${waves}
   <g filter="url(#wc)"><path d="${land}" fill="#e9dcb4" stroke="#8a7a5a" stroke-opacity=".5" stroke-width="2.5"/><g fill="#e9dcb4" stroke="#8a7a5a" stroke-opacity=".5" stroke-width="1.5">${hi}</g>
   <path d="${land}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="6" transform="translate(0 2)" opacity=".4"/></g>
   ${[[40,72],[130,200],[300,120],[880,330],[760,40]].map(([x,y])=>`<g opacity=".5">${cloud(x,y,.5,.9)}</g>`).join('')}
   <g fill="#5d8aa8" font-size="16" font-style="italic" opacity=".7"><text x="330" y="300">Pacific Ocean</text><text x="850" y="240">Atlantic</text></g>
   <g transform="translate(960 340)"><circle r="26" fill="#f6efe0" opacity=".9"/><path d="M0 -22 L6 0 L0 22 L-6 0z" fill="#c4553d"/><path d="M-22 0 L0 -5 L22 0 L0 5z" fill="#7a8794"/><text y="-28" font-size="12" text-anchor="middle" fill="#5a4636" font-weight="700">N</text></g>
   <rect width="1024" height="400" filter="url(#grain)" opacity=".45"/></svg>`;
};
PP.HOME = {name:'Home', lat:37, lon:-120};
})();
