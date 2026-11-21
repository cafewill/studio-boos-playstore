import {CONTENTS} from './catalog.js';
import {catalogSummary} from './portal-catalog.js';
import {escape} from './shared/ui/graphics.js';
import {illustration} from './portal-art.js';
import {activityArtwork} from './shared/ui/artwork.js';
const filter=document.querySelector('#families'),cards=document.querySelector('#cards'),search=document.querySelector('#search');
let family='전체';
const summary=catalogSummary(CONTENTS),summaryFilter=document.querySelector('#summary-families');
const families=[{name:'전체',count:summary.total},...summary.categories];
document.querySelector('#total-play-count').textContent=summary.total.toLocaleString('ko');
document.querySelector('#category-total').textContent=summary.categories.length;
const familyButtons=()=>families.map(({name,count})=>`<button type="button" data-family="${escape(name)}" aria-label="${escape(name)} 놀이 ${count}개 보기" aria-pressed="${name===family}"><span>${escape(name)}</span><span class="category-count">${count}</span></button>`).join('');
filter.innerHTML=familyButtons();summaryFilter.innerHTML=familyButtons();
function syncFamily(){
 for(const nav of [filter,summaryFilter])nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.family===family)));
}
function render(){
 const term=search.value.trim().toLocaleLowerCase('ko');
 const items=CONTENTS.filter(c=>(family==='전체'||c.category===family)&&`${c.title} ${c.description} ${c.category}`.toLocaleLowerCase('ko').includes(term));
 document.querySelector('#result-count').textContent=`함께 만나볼 놀이 ${items.length}개`;
 cards.innerHTML=items.length?items.map(c=>{const index=CONTENTS.indexOf(c);return `<article class="play-card tone-${index%4}"><a class="card-link" href="${escape(c.href)}"><div class="card-art">${activityArtwork(c.preview)}<span class="card-age">${escape(c.age)}</span></div><div class="card-body"><span class="card-tag">${escape(c.category)}</span><h3>${escape(c.title)}</h3><p>${escape(c.description)}</p><span class="card-action">놀이 만나기 <span aria-hidden="true">✦</span></span></div></a></article>`;}).join(''):'<div class="empty"><p>아직 찾지 못했어요. 다른 이름으로 찾아볼까요?</p><button id="reset-search" class="secondary" type="button">모든 놀이 보기</button></div>';
}
for(const nav of [filter,summaryFilter])nav.addEventListener('click',event=>{
 const b=event.target.closest('button[data-family]');if(!b)return;
 family=b.dataset.family;
 if(nav===summaryFilter)search.value='';
 syncFamily();render();
 if(nav===summaryFilter){const heading=document.querySelector('#explore-title');heading.focus({preventScroll:true});heading.scrollIntoView({block:'start'});}
});
search.addEventListener('input',render);
cards.addEventListener('click',event=>{if(event.target.closest('#reset-search')){search.value='';family='전체';syncFamily();render();search.focus();}});
let planted=0,color=0;
const scene=document.querySelector('#garden-scene'),message=document.querySelector('#garden-message');
function drawGarden(){
 scene.innerHTML=`<span class="scene-sun"></span><span class="scene-cloud"></span><span class="scene-hill hill-back"></span><span class="scene-hill hill-front"></span><div class="scene-flowers">${illustration('garden',color)}</div>${Array.from({length:planted},(_,i)=>`<span class="new-sprout" style="--position:${17+i*14}%;--tilt:${i%2?8:-8}deg">✿</span>`).join('')}<span class="scene-label">나의 작은 정원</span>`;
}
document.querySelector('#plant-seed').addEventListener('click',()=>{planted=(planted+1)%6;drawGarden();message.textContent=planted?`새로운 꽃이 ${planted}송이 피었어요. 내 속도로 가꿔 봐요.`:'정원을 쉬게 했어요. 다시 심어도 좋아요.';document.querySelector('#plant-seed').textContent=planted===5?'정원 쉬게 하기':'씨앗 하나 더 심기';});
document.querySelector('#change-color').addEventListener('click',()=>{color=(color+1)%4;drawGarden();message.textContent=`${['살구빛과 노란빛','노란빛과 하늘빛','하늘빛과 초록빛','초록빛과 살구빛'][color]} 꽃을 만나 보세요.`;});
render();drawGarden();
