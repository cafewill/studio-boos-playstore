import {escape,glyph} from './graphics.js';
// 첫 화면의 조작은 셸이 담당하고, 활동별 미리보기만 이곳에서 구성한다.
export function welcomeArt(def){
 if(def.engine==='words')return `<div class="welcome-word" aria-hidden="true"><span>${escape(def.params.cards[0].symbol)}</span><span>${escape(def.params.cards[0].word)}</span><span>그림과 낱말이 만나요</span></div>`;
 if(def.engine==='routine')return `<ol class="routine-path welcome-routine" aria-hidden="true">${def.params.steps.slice(0,3).map(s=>`<li class="is-ready">${escape(s)}</li>`).join('')}</ol>`;
 if(def.engine==='scene')return `<div class="welcome-scene backdrop-${escape(def.params.backdrop)}" aria-hidden="true">${def.params.props.map(p=>`<span>${escape(p.symbol)}</span>`).join('')}</div>`;
 return `<div class="welcome-glyphs" aria-hidden="true">${glyph('leaf','#71966a')}${glyph('flower','#c27f5d')}${glyph('triangle','#5f8fa6')}</div>`;
}
