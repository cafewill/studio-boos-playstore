import {CONTENTS} from './catalog.js';
import {escape,glyph} from './shared/ui/graphics.js';
const filter=document.querySelector('#families'),cards=document.querySelector('#cards'),search=document.querySelector('#search');
let family='전체';
const families=['전체',...new Set(CONTENTS.map(c=>c.category))];
filter.innerHTML=families.map(f=>`<button type="button" data-family="${escape(f)}" aria-pressed="${f===family}">${escape(f)}</button>`).join('');
function render(){
 const term=search.value.trim().toLocaleLowerCase('ko');
 const items=CONTENTS.filter(c=>(family==='전체'||c.category===family)&&`${c.title} ${c.description} ${c.category}`.toLocaleLowerCase('ko').includes(term));
 document.querySelector('#result-count').textContent=`만나볼 놀이 ${items.length}개`;
 cards.innerHTML=items.length?items.map(c=>`<article><div class="card-art" aria-hidden="true">${glyph(c.engine==='clock'?'circle':c.engine==='drawing'?'flower':'leaf','#71966a')}${glyph(c.engine==='assembly'?'square':'flower','#c27f5d')}${glyph(c.engine==='feelings'?'circle':'triangle','#5f8fa6')}</div><div class="card-body"><span class="card-tag">${escape(c.age)} · ${escape(c.category)}</span><h2>${escape(c.title)}</h2><p>${escape(c.description)}</p><a class="primary" href="${escape(c.href)}" aria-label="${escape(c.title)} 만나기">놀이 만나기</a></div></article>`).join(''):'<div class="empty"><p>다른 이름으로 찾아볼까요?</p><button id="reset-search" class="secondary">모든 놀이 보기</button></div>';
}
filter.addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;family=b.dataset.family;filter.querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));render();});
search.addEventListener('input',render);
cards.addEventListener('click',event=>{if(event.target.closest('#reset-search')){search.value='';family='전체';filter.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.family==='전체')));render();search.focus();}});
render();
