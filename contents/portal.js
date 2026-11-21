import {CONTENTS} from './catalog.js';
import {escape} from './shared/ui/graphics.js';
import {illustration} from './portal-art.js';
import {activityArtwork} from './shared/ui/artwork.js';
const filter=document.querySelector('#families'),cards=document.querySelector('#cards'),search=document.querySelector('#search');
let family='전체';
const families=['전체',...new Set(CONTENTS.map(c=>c.category))];
filter.innerHTML=families.map(f=>`<button type="button" data-family="${escape(f)}" aria-pressed="${f===family}">${escape(f)}</button>`).join('');
function render(){
 const term=search.value.trim().toLocaleLowerCase('ko');
 const items=CONTENTS.filter(c=>(family==='전체'||c.category===family)&&`${c.title} ${c.description} ${c.category}`.toLocaleLowerCase('ko').includes(term));
 document.querySelector('#result-count').textContent=`함께 만나볼 놀이 ${items.length}개`;
 cards.innerHTML=items.length?items.map(c=>{const index=CONTENTS.indexOf(c);return `<article class="play-card tone-${index%4}"><a class="card-link" href="${escape(c.href)}"><div class="card-art">${activityArtwork(c.preview)}<span class="card-age">${escape(c.age)}</span></div><div class="card-body"><span class="card-tag">${escape(c.category)}</span><h3>${escape(c.title)}</h3><p>${escape(c.description)}</p><span class="card-action">놀이 만나기 <span aria-hidden="true">✦</span></span></div></a></article>`;}).join(''):'<div class="empty"><p>아직 찾지 못했어요. 다른 이름으로 찾아볼까요?</p><button id="reset-search" class="secondary" type="button">모든 놀이 보기</button></div>';
}
filter.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;family=b.dataset.family;filter.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));render();});
search.addEventListener('input',render);
cards.addEventListener('click',event=>{if(event.target.closest('#reset-search')){search.value='';family='전체';filter.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.family==='전체')));render();search.focus();}});
let planted=0,color=0;
const scene=document.querySelector('#garden-scene'),message=document.querySelector('#garden-message');
function drawGarden(){
 scene.innerHTML=`<span class="scene-sun"></span><span class="scene-cloud"></span><span class="scene-hill hill-back"></span><span class="scene-hill hill-front"></span><div class="scene-flowers">${illustration('garden',color)}</div>${Array.from({length:planted},(_,i)=>`<span class="new-sprout" style="--position:${17+i*14}%;--tilt:${i%2?8:-8}deg">✿</span>`).join('')}<span class="scene-label">나의 작은 정원</span>`;
}
document.querySelector('#plant-seed').addEventListener('click',()=>{planted=(planted+1)%6;drawGarden();message.textContent=planted?`새로운 꽃이 ${planted}송이 피었어요. 내 속도로 가꿔 봐요.`:'정원을 쉬게 했어요. 다시 심어도 좋아요.';document.querySelector('#plant-seed').textContent=planted===5?'정원 쉬게 하기':'씨앗 하나 더 심기';});
document.querySelector('#change-color').addEventListener('click',()=>{color=(color+1)%4;drawGarden();message.textContent=`${['살구빛과 노란빛','노란빛과 하늘빛','하늘빛과 초록빛','초록빛과 살구빛'][color]} 꽃을 만나 보세요.`;});
render();drawGarden();
