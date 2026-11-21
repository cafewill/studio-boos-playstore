import {DRAWING_PATHS} from './artwork.js';
import {COLORS,NAMES} from '../core/utils.js';
import {PARTS,target} from '../engines/assembly.js';
import {goal} from '../engines/commands.js';
import {FEELINGS} from '../engines/feelings.js';
import {glyph,escape,colorHex,clockFace,face} from './graphics.js';
const button=(label,type,value,extra='')=>`<button type="button" class="secondary" data-action="${type}" ${value!==undefined?`data-value="${escape(value)}"`:''} ${extra}>${label}</button>`;
const dots=(count,motif='circle')=>`<div class="dots" role="img" aria-label="${count}개">${Array.from({length:count},()=>glyph(motif)).join('')}</div>`;
export function stage(state,def){
 const data=state.data,r=state.round;
 if(def.engine==='words'){
  const card=def.params.cards[r];return `<div class="word-book"><span class="eyebrow">그림과 낱말의 만남</span><h2 id="question" tabindex="-1">그림에 어울리는 낱말은 무엇일까요?</h2><div class="word-picture" role="img" aria-label="${escape(card.word)} 그림">${escape(card.symbol)}</div><p>함께 읽어도 좋아요. 천천히 골라 보세요.</p><div class="word-options">${data.options[r].map(i=>button(escape(def.params.cards[Number(i)].word),'word',i)).join('')}</div></div>`;
 }
 if(def.engine==='routine')return `<div class="routine-workshop"><span class="eyebrow">한 걸음씩 이어 보기</span><h2 id="question" tabindex="-1">${escape(def.objective)}</h2><ol class="routine-path" aria-label="이어 놓은 순서">${def.params.steps.map((step,i)=>`<li class="${i<data.paths[r].length?'is-ready':''}">${i<data.paths[r].length?escape(step):'다음 한 걸음'}</li>`).join('')}</ol><div class="routine-options">${data.options[r].map(i=>button(escape(def.params.steps[Number(i)]),'step',i,data.paths[r].includes(Number(i))?'disabled':'')).join('')}</div>${button('순서 다시 살펴보기','routine-reset')}</div>`;
 if(def.engine==='scene')return `<div class="scene-workshop"><span class="eyebrow">내가 만드는 작은 세상</span><h2 id="question" tabindex="-1">${escape(def.objective)}</h2><p>소품을 고르고 놓을 자리를 눌러요. 서로 다른 소품 세 가지로 장면을 만들어요.</p><div class="prop-tray" aria-label="소품 고르기">${def.params.props.map((p,i)=>button(`<span aria-hidden="true">${escape(p.symbol)}</span><span>${escape(p.label)}</span>`,'prop',String(i),`aria-pressed="${data.selected===String(i)}"`)).join('')}</div><div class="scene-canvas backdrop-${escape(def.params.backdrop)}" aria-label="소품 놓는 공간">${data.boards[r].map((v,i)=>button(`${v===null?'<span aria-hidden="true">＋</span>':`<span aria-hidden="true">${escape(def.params.props[Number(v)].symbol)}</span>`}<span class="sr-only">${i+1}번 자리, ${v===null?'빈자리':escape(def.params.props[Number(v)].label)}. 여기에 놓기</span>`,'place',String(i))).join('')}</div><div class="actions">${button('소품 다시 놓기','scene-clear')}${button('나의 장면 완성하기','finish')}</div></div>`;
 if(def.engine==='choice'){
  const q=data.rounds[r];let sample='';
  if(q.kind==='shape')sample=glyph(q.correct);
  if(q.kind==='color')sample=`${glyph('circle',colorHex(q.correct))}<span>${COLORS.find(c=>c.id===q.correct).name}</span>`;
  if(q.kind==='size')sample=glyph(def.params.motif??'circle','#28644e',{small:.45,medium:.72,large:1}[q.correct]);
  if(q.kind==='pattern')sample=`<div class="pattern">${q.pattern.map(p=>glyph(p)).join('')}<span>?</span></div>`;
  if(q.kind==='number'){
   const v=q.visual;
   if(v.kind==='dots')sample=dots(v.count,def.params.motif);
   if(v.kind==='add'||v.kind==='subtract')sample=`${dots(v.a,def.params.motif)}<span class="operator">${v.kind==='add'?'+':'−'}</span>${dots(v.b,def.params.motif)}`;
   if(v.kind==='groups')sample=`<div class="groups">${Array.from({length:v.b},()=>dots(v.a)).join('')}</div>`;
   if(v.kind==='text')sample=`<strong class="number-display">${escape(v.text)}</strong>`;
   if(v.kind==='compare')sample='<p>세 숫자를 천천히 살펴봐요.</p>';
  }
  const label=value=>q.kind==='color'?COLORS.find(c=>c.id===value).name:q.kind==='size'?{small:'작은 것',medium:'중간 것',large:'큰 것'}[value]:NAMES[value]??String(value);
  const image=value=>q.kind==='number'?`<span class="number-choice">${value}</span>`:q.kind==='color'?glyph('circle',colorHex(value)):q.kind==='size'?glyph(def.params.motif??'circle','#28644e',{small:.45,medium:.72,large:1}[value]):glyph(value);
  const targetLabel=q.kind==='shape'?`찾을 모양: ${NAMES[q.correct]}`:q.kind==='color'?`찾을 색: ${COLORS.find(c=>c.id===q.correct).name}`:q.kind==='size'?`찾을 크기: ${{small:'작은 것',medium:'중간 것',large:'큰 것'}[q.correct]}`:q.kind==='pattern'?`이어지는 모양: ${q.pattern.map(v=>NAMES[v]).join(', ')} 다음 빈자리`:'살펴볼 수 문제';
  return `<h2 id="question" tabindex="-1">${q.prompt}</h2><div class="sample" id="target" data-correct="${escape(q.correct)}" role="group" aria-label="${escape(targetLabel)}">${sample}</div><div class="choices">${q.options.map(value=>`<button id="choice-${escape(value)}" class="choice" data-action="choose" data-value="${escape(value)}" aria-label="${escape(label(value))} 고르기">${image(value)}<span>${escape(label(value))}</span></button>`).join('')}</div>`;
 }
 if(def.engine==='drawing')return `<h2 id="question" tabindex="-1">내가 고른 선과 색으로 그려요.</h2><div class="swatches" aria-label="색 고르기">${COLORS.map(c=>button(`${glyph('circle',c.hex)}<span>${c.name}</span>`,'color',c.id,`aria-pressed="${data.color===c.id}"`)).join('')}</div><canvas id="draw-surface" width="800" height="480" aria-label="나의 그림. 마우스·터치로 그리거나 아래 위치 버튼으로 점을 찍을 수 있어요."></canvas><div class="actions">${button('한 획 되돌리기','undo')}${button('새 종이','clear')}</div><details><summary>키보드·탭으로 점 찍기</summary><div class="stamp-grid">${Array.from({length:9},(_,i)=>button(`${Math.floor(i/3)+1}행 ${i%3+1}열`,'stamp',i)).join('')}</div></details><p>선 ${data.strokes.length}개를 그렸어요. 그림에는 정해진 답이 없어요.</p>${button('내 그림 완성하기','finish')}`;
 if(def.engine==='assembly'){
  const t=target(def,r);
  return `<h2 id="question" tabindex="-1">${t?'같은 자리에 조각을 놓아요.':'조각을 모아 나만의 작품을 만들어요.'}</h2>${t?`<div class="reference-grid" aria-label="따라 만들어 볼 조각 그림">${t.map((p,i)=>`<span role="img" aria-label="${Math.floor(i/3)+1}행 ${i%3+1}열 ${NAMES[p]}">${glyph(p)}</span>`).join('')}</div>`:`<p>${escape(def.title)} · ${def.params.template==='train'?'바퀴와 몸통을 이어 보세요.':'좋아하는 모양을 골라 보세요.'}</p>`}<div class="part-tools" aria-label="조각 고르기">${PARTS.map(p=>button(`${glyph(p)}<span>${p==='blank'?'지우개':NAMES[p]}</span>`,'part',p,`aria-pressed="${data.selected===p}"`)).join('')}</div><div class="piece-grid" aria-label="내 조각 그림">${data.boards[r].map((p,i)=>button(`${glyph(p)}<span class="sr-only">${Math.floor(i/3)+1}행 ${i%3+1}열 ${NAMES[p]}</span>`,'cell',i)).join('')}</div><div class="actions">${button('처음부터 놓기','clear')}${button(t?'그림 살펴보기':'작품 완성하기','finish')}</div>`;
 }
 if(def.engine==='clock'){
  const t=data.targets[r],v=data.values[r];
  return `<h2 id="question" tabindex="-1">${t.hour}시 ${t.minute===0?'정각':'30분'}을 만들어 봐요.</h2>${clockFace(v.hour,v.minute)}<p class="clock-value">지금은 ${v.hour}시 ${v.minute}분이에요.</p><div class="actions">${button('시침 한 칸 전','hour',-1)}${button('시침 한 칸 다음','hour',1)}${button('분침 30분 바꾸기','minute')}</div>${button('시간 살펴보기','finish')}`;
 }
 if(def.engine==='sound')return `<h2 id="question" tabindex="-1">소리의 높이를 살펴봐요.</h2><p>왼쪽은 낮게, 오른쪽은 높게. 소리가 꺼져 있어도 위치와 이름을 살펴볼 수 있어요.</p><div class="note-keys">${['낮은 도','레','미','솔','높은 라'].map((name,i)=>button(`<span aria-hidden="true" class="note-dot" style="height:${40+i*14}px"></span><span>${name}</span>${data.played.includes(i)?'<span>살펴봤어요</span>':''}`,'play',i)).join('')}</div>${button('소리 산책 마치기','finish')}`;
 if(def.engine==='commands'){
  const g=goal(def,r),end=data.paths[r].at(-1),names={up:'위로',down:'아래로',left:'왼쪽',right:'오른쪽'};
  return `<h2 id="question" tabindex="-1">명령을 이어 꽃에 도착해요.</h2><div class="path-grid" role="img" aria-label="3행 3열, 시작 1행 1열, 목적지 ${g[1]+1}행 ${g[0]+1}열">${Array.from({length:9},(_,i)=>`<span>${end[0]===i%3&&end[1]===Math.floor(i/3)?'새싹':g[0]===i%3&&g[1]===Math.floor(i/3)?'꽃':''}</span>`).join('')}</div><div class="actions">${Object.entries(names).map(([v,n])=>button(n,'command',v)).join('')}</div><p class="command-list">${data.queues[r].map(v=>names[v]).join(' · ')||'명령을 하나씩 골라요.'}</p><div class="actions">${button('한 명령 지우기','undo')}${button('다시 놓기','clear')}${button('길 따라가기','run')}</div>`;
 }
 if(def.engine==='feelings'){
  const scene=def.params.scenes[r];return `<h2 id="question" tabindex="-1">${escape(scene.title)}</h2><div class="sample story-art" aria-hidden="true">${glyph(scene.art==='blocks'?'square':scene.art==='cloud'?'circle':scene.art==='tree'?'leaf':'flower')}</div><p>어떤 마음이 떠오르나요? 서로 다르게 느껴도 괜찮아요.</p><div class="feeling-choices">${FEELINGS.map((name,i)=>button(`${face(i)}<span>${name}</span>`,'feeling',name)).join('')}</div>`;
 }
 throw new Error('화면 구현이 없는 엔진입니다');
}
export function attachDrawing(root,state,def,emit){
 const canvas=root.querySelector('#draw-surface');if(!canvas)return()=>{};
 const ctx=canvas.getContext('2d');let points=[];let pointer=null;
 function draw(){ctx.clearRect(0,0,800,480);ctx.fillStyle='#fffef9';ctx.fillRect(0,0,800,480);ctx.strokeStyle='#a2b4bf';ctx.save();ctx.scale(800/340,480/220);ctx.lineWidth=1.3;ctx.setLineDash([3,4]);for(const path of DRAWING_PATHS[def.params.template])ctx.stroke(new Path2D(path));ctx.restore();ctx.setLineDash([]);
  const renderStroke=s=>{ctx.strokeStyle=colorHex(s.color);ctx.fillStyle=colorHex(s.color);ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';const first=s.points[0];ctx.beginPath();ctx.moveTo(first[0]*800,first[1]*480);for(const [x,y]of s.points)ctx.lineTo(x*800,y*480);ctx.stroke();if(s.points.length===1){ctx.beginPath();ctx.arc(first[0]*800,first[1]*480,s.stamp?13:4,0,Math.PI*2);ctx.fill();}};
  state.data.strokes.forEach(renderStroke);if(points.length)renderStroke({points,color:state.data.color});
 }
 const coordinates=e=>{const r=canvas.getBoundingClientRect();return[Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))];};
 const controller=new AbortController(),options={signal:controller.signal};
 canvas.addEventListener('pointerdown',e=>{if(state.phase!=='playing'||pointer!==null||e.button>0)return;pointer=e.pointerId;points=[coordinates(e)];canvas.setPointerCapture(pointer);draw();},options);
 canvas.addEventListener('pointermove',e=>{if(e.pointerId!==pointer)return;if(points.length<100)points.push(coordinates(e));else points[99]=coordinates(e);draw();},options);
 canvas.addEventListener('pointerup',e=>{if(e.pointerId!==pointer)return;const final=points;pointer=null;points=[];emit({type:'stroke',points:final});},options);
 canvas.addEventListener('pointercancel',()=>{pointer=null;points=[];draw();},options);
 draw();return()=>controller.abort();
}
