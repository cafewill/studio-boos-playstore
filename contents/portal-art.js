// 포털 전용 독립 제작 벡터 그림. 콘텐츠 정의·규칙과 분리한다.
export function illustration(engine, variant=0){
 const colors=['#ee987b','#eebf5f','#9cb6e5','#94bca1'];
 const accent=colors[variant%colors.length];
 const flower=(x,y,c)=>`<g transform="translate(${x} ${y})"><path d="M0 0V65M0 40Q-32 14-30 38Q-10 56 0 48M0 30Q28 9 30 30Q12 46 0 40" fill="#5d997c" stroke="#5d997c" stroke-width="5"/><g fill="${c}"><ellipse rx="17" ry="32"/><ellipse rx="17" ry="32" transform="rotate(60)"/><ellipse rx="17" ry="32" transform="rotate(120)"/></g><circle r="12" fill="#fff2ba"/></g>`;
 const art={
 words:`<path d="M65 55Q116 35 170 55Q224 35 275 55V170Q220 150 170 170Q115 150 65 170Z" fill="#fffcf4" stroke="#8ca5ba" stroke-width="4"/><path d="M170 55v115M195 85h50m-50 24h40m-40 24h46" stroke="#8ca5ba" stroke-width="5" stroke-linecap="round"/>${flower(118,95,accent)}`,
 routine:`<path d="M65 160h74v-54h75V55h55" fill="none" stroke="#fffaf0" stroke-width="25" stroke-linejoin="round"/>${[ [65,160],[139,106],[214,55] ].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="22" fill="${colors[(variant+i)%4]}"/><path d="m${x-9} ${y} 6 7 13-15" fill="none" stroke="#385a49" stroke-width="3"/>`).join('')}`,
 scene:`<path d="m58 94 112-65 112 65v93H58Z" fill="#fffaf0"/><rect x="91" y="85" width="52" height="46" rx="6" fill="#b9d5e0"/><path d="M117 85v46M91 108h52" stroke="#fff" stroke-width="4"/><rect x="179" y="132" width="55" height="38" rx="9" fill="${accent}"/><path d="M180 170v13m53-13v13" stroke="#6d8972" stroke-width="6"/>${flower(260,116,'#e5bd69')}`,

 garden:`${flower(100,102,accent)}${flower(174,82,colors[(variant+1)%4])}${flower(244,116,colors[(variant+2)%4])}`,
 drawing:`<rect x="88" y="35" width="155" height="135" rx="14" fill="#fffcf4" transform="rotate(-8 165 100)"/>${flower(155,95,accent)}<path d="m225 159 42-100 16 7-42 100-16 15Z" fill="#637fbc"/><path d="m225 159 16 7-16 15Z" fill="#d1a580"/>`,
 assembly:`<rect x="62" y="116" width="74" height="64" rx="12" fill="#8bb3a6"/><rect x="143" y="116" width="69" height="64" rx="12" fill="${accent}"/><path d="m142 108 35-60 37 60Z" fill="#e8bc68"/><rect x="101" y="40" width="42" height="42" rx="10" fill="#9db9df" transform="rotate(-13 122 61)"/><circle cx="248" cy="151" r="29" fill="#b6a9d5"/>`,
 sound:`${[84,126,168,210,252].map((x,i)=>`<rect x="${x}" y="${100-i*12}" width="32" height="${72+i*12}" rx="16" fill="${[accent,'#e8c06e','#96bc9e','#8fb3cf','#b5a2cf'][i]}"/>`).join('')}<path d="M106 60V35l28-7v25" fill="none" stroke="#426652" stroke-width="6"/><circle cx="100" cy="61" r="9" fill="#426652"/>`,
 clock:`<circle cx="170" cy="108" r="77" fill="#fff9e8" stroke="${accent}" stroke-width="12"/><path d="M170 60v48l33 22" fill="none" stroke="#426652" stroke-width="9" stroke-linecap="round"/><circle cx="170" cy="108" r="7" fill="#426652"/>`,
 feelings:`<circle cx="127" cy="112" r="58" fill="#e9bd6c"/><circle cx="225" cy="100" r="48" fill="#a9c8c3"/><g fill="#355c4d"><circle cx="109" cy="104" r="4"/><circle cx="143" cy="104" r="4"/><circle cx="211" cy="94" r="4"/><circle cx="239" cy="94" r="4"/></g><path d="M109 127q18 22 36 0M212 115h26" fill="none" stroke="#355c4d" stroke-width="4" stroke-linecap="round"/>`,
 commands:`<path d="M66 162h70v-54h70V55h65" fill="none" stroke="#fffaf0" stroke-width="35" stroke-linejoin="round"/><circle cx="70" cy="162" r="17" fill="#709e87"/><path d="m253 40 25 15-25 15" fill="none" stroke="#526f98" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,
 choice:variant%2?`${flower(100,102,accent)}${flower(174,82,'#eac671')}${flower(244,116,'#a99cc9')}`:`<circle cx="102" cy="123" r="37" fill="${accent}"/><rect x="151" y="80" width="69" height="72" rx="18" fill="#8fb4a7" transform="rotate(-12 185 115)"/><path d="m257 72 43 83h-86Z" fill="#eac574"/>`
 };
 return `<svg viewBox="0 0 340 220" aria-hidden="true"><ellipse cx="172" cy="189" rx="115" ry="10" fill="#355d4b" opacity=".07"/>${art[engine]||art.choice}<circle cx="46" cy="61" r="4" fill="${accent}"/><path d="M287 36v15m-7-7h14" stroke="#7c9f89" stroke-width="3" stroke-linecap="round"/></svg>`;
}
