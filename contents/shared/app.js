import {create,dispatch,progress} from './core/model.js';
import {validateDefinition} from './core/definition.js';
import {createStore} from './core/storage.js';
import {stage,attachDrawing} from './ui/stage.js';
import {glyph,escape,garden} from './ui/graphics.js';
import {createAudio} from './ui/audio.js';
export function mount(def){
 validateDefinition(def);
 const root=document.querySelector('#app'),announce=document.querySelector('#announcement'),store=createStore(def),audio=createAudio();
 document.title=`${def.title} · 작은 발견 놀이터`;
 document.documentElement.style.setProperty('--green',def.accent);
 let state=store.load(),welcome=true,sound=store.sound(),detach=()=>{},confirmErase=false;
 const dialog=document.querySelector('#care-dialog');
 const say=text=>{announce.textContent=text;};
 const remember=()=>{if(state)store.save(state);};
 function soundLabel(){const el=document.querySelector('#sound');el.textContent=sound?'소리 끄기':'소리 켜기';el.setAttribute('aria-pressed',String(sound));}
 function play(index,timbre){if(sound&&!audio.play(index,timbre)){sound=false;store.setSound(false);soundLabel();say('소리 없이도 함께 놀 수 있어요.');}}
 function focusDefault(){return state?.phase==='complete'?'done-title':state?.phase==='paused'?'resume':state?.phase==='feedback'?'next':'question';}
 function render(focusId){
  detach();const count=state?progress(state,def):0;
  const actions=welcome?`<div class="actions"><button class="primary" id="start">${state&&state.phase!=='complete'?'새로 시작하기':'함께 시작하기'}</button>${state&&state.phase!=='complete'?'<button class="secondary" id="continue">이어서 하기</button>':''}</div><p class="small-note">${def.ageMin}–${def.ageMax}세와 함께 · 시간 제한 없이</p>`:`<div class="actions">${['playing','feedback'].includes(state.phase)?'<button class="secondary" id="rest">잠깐 쉬기</button>':''}<a class="quiet" href="../">놀이터로 돌아가기</a></div>`;
  let board='';
  if(welcome)board=`<section class="board welcome-board"><span class="eyebrow">작은 발견 하나</span><div class="welcome-glyphs" aria-hidden="true">${glyph('leaf','#71966a')}${glyph('flower','#c27f5d')}${glyph('triangle','#5f8fa6')}</div><h2>오늘은 ${escape(def.title)}</h2><p>${escape(def.objective)}</p><p class="small-note">직접 눌러 보고 천천히 살펴봐요.</p></section>`;
  else if(state.phase==='paused')board=`<section class="board pause-panel"><h2 id="pause-title" tabindex="-1">잠깐 쉬어도 괜찮아요.</h2>${garden(count,def.roundCount)}<p>돌아오면 여기서 이어갈 수 있어요.</p><button id="resume" class="primary">이어서 하기</button></section>`;
  else if(state.phase==='complete')board=`<section class="board complete"><span class="eyebrow">오늘의 작은 발견</span><h2 id="done-title" tabindex="-1">${escape(def.title)}, 함께 해냈어요.</h2>${garden(def.roundCount,def.roundCount)}<p>나만의 발견을 차곡차곡 모았어요.<br>이제 쉬거나 다시 만나도 괜찮아요.</p><div class="actions"><button id="again" class="primary">다시 만나기</button><a href="../" class="secondary">놀이터로 돌아가기</a></div></section>`;
  else board=`<section class="board"><div class="board-top"><span>${escape(def.title)}</span><span>${state.round+1} / ${def.roundCount}</span></div><div class="progress" role="progressbar" aria-label="마친 활동" aria-valuemin="0" aria-valuemax="${def.roundCount}" aria-valuenow="${count}"><span style="width:${count/def.roundCount*100}%"></span></div><div id="stage">${stage(state,def)}</div><div id="feedback" class="feedback" role="status">${state.phase==='feedback'?`<p>${def.engine==='feelings'?'서로 다른 마음도 괜찮아요. 내 마음을 살펴봤네요.':'작은 발견이 하나 더 생겼어요.'}</p><button id="next" class="primary">${state.round===def.roundCount-1?'오늘의 발견 보기':'다음 발견 만나기'}</button>`:'<p>천천히 살펴봐도 괜찮아요.</p>'}</div>${garden(count,def.roundCount)}</section>`;
  root.innerHTML=`<div class="layout"><section class="intro"><span class="eyebrow">보고, 고르고, 나만의 발견</span><h1>${escape(def.title)}</h1><p>${escape(def.description)}</p>${actions}</section>${board}</div>`;
  if(state&&!welcome&&state.phase==='feedback')root.querySelectorAll('#stage button').forEach(b=>{b.disabled=true;});
  if(state&&!welcome)detach=attachDrawing(root,state,def,send);
  if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
 }
 function send(event){
  if(!state)return;
  const before=state;const result=dispatch(state,event,def);state=result.state;remember();
  if(event.type==='play'&&before.phase==='playing'&&Number.isInteger(event.value)&&event.value>=0&&event.value<=4)play(event.value,def.params.timbre);
  else if(state.phase==='feedback'&&before.phase==='playing')play(2,'sine');
  const focused=document.activeElement;
  const focusId=before.phase!==state.phase?focusDefault():null;
  const selector=focused?.dataset.action?`[data-action="${CSS.escape(focused.dataset.action)}"]${focused.dataset.value!==undefined?`[data-value="${CSS.escape(focused.dataset.value)}"]`:''}`:null;
  render(focusId);
  if(!focusId&&selector)root.querySelector(selector)?.focus({preventScroll:true});
  if(result.notice){say(result.notice);if(state.phase==='playing'){const box=document.querySelector('#feedback');if(box)box.textContent=result.notice;}}
 }
 function begin(){const value=new URL(location.href).searchParams.get('seed');state=create(def,value!==null&&/^\d{1,10}$/.test(value)?Number(value)>>>0:Date.now()>>>0);welcome=false;remember();render('question');say(def.objective);}
 root.addEventListener('click',event=>{
  const el=event.target.closest('button');if(!el||el.disabled)return;
  if(['start','again'].includes(el.id)){begin();return;}
  if(el.id==='continue'){welcome=false;state=dispatch(state,{type:'resume'},def).state;remember();render(focusDefault());return;}
  if(el.id==='resume'){send({type:'resume'});return;}
  if(el.id==='rest'){send({type:'pause'});return;}
  if(el.id==='next'){send({type:'next'});return;}
  if(el.dataset.action){let value=el.dataset.value;if(['play','stamp','cell','hour'].includes(el.dataset.action))value=Number(value);if(el.dataset.action==='choose'&&state.data.rounds[state.round].kind==='number')value=Number(value);send({type:el.dataset.action,value,cell:value});}
 });
 document.querySelector('#sound').addEventListener('click',()=>{sound=!sound;store.setSound(sound);soundLabel();if(sound)play(2,def.params.timbre);else audio.suspend();});
 document.querySelector('#care').addEventListener('click',()=>{if(state&&!welcome){state=dispatch(state,{type:'pause'},def).state;remember();render();}confirmErase=false;const erase=document.querySelector('#erase');erase.disabled=false;erase.textContent='이 활동의 기록 지우기';document.querySelector('#erase-note').textContent='';document.querySelector('#care-content').textContent=`${def.title}의 진행과 소리 설정만 이 기기에 저장해요. 다른 놀이의 기록은 지우지 않아요.`;dialog.showModal();});
 document.querySelector('#close-care').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>document.querySelector('#care').focus());
 document.querySelector('#erase').addEventListener('click',()=>{
  if(!confirmErase){confirmErase=true;document.querySelector('#erase').textContent='이 활동의 기록 지우기 확인';document.querySelector('#erase-note').textContent='진행과 소리 설정을 지울까요? 한 번 더 눌러 주세요.';return;}
  const success=store.clear();state=null;welcome=true;sound=false;audio.suspend();soundLabel();render();document.querySelector('#erase').disabled=true;document.querySelector('#erase-note').textContent=success?'이 활동의 기록을 지웠어요.':'저장소에 접근할 수 없어요. 이번 화면은 처음으로 돌아왔어요.';
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(state&&!welcome){state=dispatch(state,{type:'pause'},def).state;remember();render();}audio.suspend();}});
 window.addEventListener('pagehide',()=>{remember();detach();audio.dispose();});
 soundLabel();render();
}
