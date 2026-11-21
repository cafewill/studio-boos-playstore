import {loadRegistry} from '../content/registry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {create,dispatch,restore,progress} from '../../contents/shared/core/model.js';
import {createStore,migrateLegacy} from '../../contents/shared/core/storage.js';
import {create as oldCreate,answer as oldAnswer,next as oldNext,pause as oldPause} from '../../contents/shared/engines/shape-legacy.js';
import {target as assemblyTarget} from '../../contents/shared/engines/assembly.js';
import {goal as commandGoal} from '../../contents/shared/engines/commands.js';
const batch=loadRegistry();
let sessions=0,rounds=0;
function event(s,e,d){const result=dispatch(s,e,d);assert.ok(restore(result.state,d),'전이 후 저장 상태 유효');return result.state;}
function finishRound(s,d){
 if(d.engine==='recipe'){
  assert.equal(event(s,{type:'finish'},d).phase,'playing');
  for(const index of d.params.recipe)s=event(s,{type:'ingredient',value:String(index)},d);
  return event(s,{type:'finish'},d);
 }
 if(d.engine==='rhythm'){
  for(const index of [0,5,10])s=event(s,{type:'rhythm-toggle',value:String(index)},d);
  for(let i=0;i<4;i++)s=event(s,{type:'beat'},d);
  return event(s,{type:'finish'},d);
 }
 if(d.engine==='discovery'){
  for(const pair of [[0,1],[0,2],[1,2]])for(const index of pair)s=event(s,{type:'token',value:String(index)},d);
  return event(s,{type:'finish'},d);
 }
 if(d.engine==='animation'){
  for(let i=0;i<4;i++){s=event(s,{type:'frame-show',value:String(i)},d);s=event(s,{type:'frame-place',value:String(i*2)},d);}
  for(let i=0;i<4;i++)s=event(s,{type:'frame-show',value:String(i)},d);
  return event(s,{type:'finish'},d);
 }
 if(d.engine==='words'){
  const wrong=s.data.options[s.round].find(v=>v!==String(s.round));assert.deepEqual(event(s,{type:'word',value:wrong},d),s);
  assert.deepEqual(event(s,{type:'word',value:99},d),s);
  return event(s,{type:'word',value:String(s.round)},d);
 }
 if(d.engine==='routine'){
  assert.deepEqual(event(s,{type:'step',value:'1'},d),s);
  s=event(s,{type:'step',value:'0'},d);s=event(s,{type:'routine-reset'},d);assert.deepEqual(s.data.paths[s.round],[]);
  for(let i=0;i<d.params.steps.length;i++)s=event(s,{type:'step',value:String(i)},d);return s;
 }
 if(d.engine==='scene'){
  assert.equal(event(s,{type:'finish'},d).phase,'playing');
  assert.deepEqual(event(s,{type:'place',value:'99'},d),s);assert.deepEqual(event(s,{type:'prop',value:'-1'},d),s);
  s=event(s,{type:'place',value:'0'},d);s=event(s,{type:'scene-clear'},d);assert.ok(s.data.boards[s.round].every(v=>v===null));
  for(let i=0;i<3;i++)s=event(s,{type:'place',value:String(i)},d);
  assert.equal(event(s,{type:'finish'},d).phase,'playing','같은 소품 반복은 서로 다른 소품 세 개를 대신하지 않음');
  for(let i=0;i<3;i++){s=event(s,{type:'prop',value:String(i)},d);s=event(s,{type:'place',value:String(i)},d);}
  return event(s,{type:'finish'},d);
 }
 if(d.engine==='choice'){
  const q=s.data.rounds[s.round];
  assert.equal(new Set(q.options).size,q.options.length);assert.equal(q.options.filter(v=>v===q.correct).length,1);
  if(q.kind==='number'){
   const v=q.visual;
   if(v.kind==='dots')assert.equal(q.correct,v.count);
   if(v.kind==='add')assert.equal(q.correct,v.a+v.b);
   if(v.kind==='subtract')assert.equal(q.correct,v.a-v.b);
   if(v.kind==='groups')assert.equal(q.correct,v.a*v.b);
  }
  const wrong=q.options.find(v=>v!==q.correct);const attempted=event(s,{type:'choose',value:wrong},d);assert.deepEqual(attempted,s,'오답 무벌점·진행 유지');
  return event(s,{type:'choose',value:q.correct},d);
 }
 if(d.engine==='drawing'){s=event(s,{type:'finish'},d);assert.equal(s.phase,'playing');s=event(s,{type:'stroke',points:[[.1,.2],[.8,.7]]},d);s=event(s,{type:'stamp',cell:4},d);s=event(s,{type:'undo'},d);assert.equal(s.data.strokes.length,1);return event(s,{type:'finish'},d);}
 if(d.engine==='assembly'){
  const t=assemblyTarget(d,s.round)??['square','circle','triangle','blank','blank','blank','blank','blank','blank'];
  for(let i=0;i<9;i++){s=event(s,{type:'part',value:t[i]},d);s=event(s,{type:'cell',cell:i},d);}return event(s,{type:'finish'},d);
 }
 if(d.engine==='clock'){
  const t=s.data.targets[s.round];while(s.data.values[s.round].hour!==t.hour)s=event(s,{type:'hour',value:1},d);if(s.data.values[s.round].minute!==t.minute)s=event(s,{type:'minute'},d);return event(s,{type:'finish'},d);
 }
 if(d.engine==='sound'){assert.equal(event(s,{type:'finish'},d).phase,'playing');for(const n of [0,2,4])s=event(s,{type:'play',value:n},d);return event(s,{type:'finish'},d);}
 if(d.engine==='commands'){const [x,y]=commandGoal(d,s.round);for(let i=0;i<x;i++)s=event(s,{type:'command',value:'right'},d);for(let i=0;i<y;i++)s=event(s,{type:'command',value:'down'},d);return event(s,{type:'run'},d);}
 if(d.engine==='feelings')return event(s,{type:'feeling',value:'속상해요'},d);
 throw new Error('검증 누락 엔진');
}
for(const {content:d}of batch.items){
 for(let seed=0;seed<20;seed++){
  let s=create(d,seed);assert.deepEqual(dispatch(s,null,d).state,s);assert.deepEqual(dispatch(s,{type:'next'},{...d,slug:'another'}).state,s);assert.deepEqual(create(d,seed),s);assert.deepEqual(restore(JSON.stringify(s),d),s);
  for(let i=0;i<d.roundCount;i++){
   assert.equal(s.round,i);const paused=event(s,{type:'pause'},d);assert.equal(paused.phase,'paused');assert.deepEqual(event(paused,{type:'choose',value:'circle'},d),paused);assert.deepEqual(event(paused,{type:'resume'},d),s);
   s=finishRound(s,d);assert.equal(s.phase,'feedback');assert.equal(progress(s,d),i+1);assert.deepEqual(event(s,{type:'choose',value:'circle'},d),s,'중복 입력 차단');
   s=event(s,{type:'next'},d);rounds++;
  }
  assert.equal(s.phase,'complete');assert.equal(progress(s,d),d.roundCount);assert.deepEqual(event(s,{type:'next'},d),s);
  for(const bad of ['{','null',JSON.stringify({...s,contentId:'another'}),JSON.stringify({...s,version:99}),JSON.stringify({...s,definitionVersion:99}),JSON.stringify({...s,engineVersion:99}),JSON.stringify({...s,round:99}),JSON.stringify({...s,data:{}})])assert.equal(restore(bad,d),null);
  sessions++;
 }
}
// 공통 저장소 변경이 모든 콘텐츠의 격리·장애 복구를 유지하는지 검사한다.
const values=new Map([['unrelated:v1:save','keep']]);const backend=()=>({getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)});
for(const {content:d}of batch.items){const store=createStore(d,backend);assert.ok(store.save(create(d,7)));assert.deepEqual(store.load(),create(d,7));store.setSound(true);assert.equal(store.sound(),true);store.setSound(false);assert.equal(store.sound(),false);}
const before=values.size;createStore(batch.items[0].content,backend).clear();assert.equal(values.size,before-2);assert.equal(values.get('unrelated:v1:save'),'keep');
for(const {content:d}of batch.items){const blocked=createStore(d,()=>{throw new Error('blocked')});assert.equal(blocked.load(),null);assert.equal(blocked.save(create(d,7)),false);assert.equal(blocked.clear(),false);}
// shape-garden v1의 진행 수·문항·선택 위치와 소리 설정을 잃지 않는다.
const shape=batch.items.find(i=>i.content.slug==='shape-garden').content;
for(const phase of ['playing','feedback','paused','complete']){
 let old=oldCreate(7);for(let i=0;i<(phase==='complete'?6:2);i++){old=oldAnswer(old,old.rounds[old.round].target).state;old=oldNext(old);}
 if(phase==='feedback')old=oldAnswer(old,old.rounds[old.round].target).state;
 if(phase==='paused')old=oldPause(old);
 const migrated=migrateLegacy(JSON.stringify(old),shape);assert.ok(migrated);assert.equal(migrated.round,old.round);assert.equal(migrated.phase,old.phase);
 assert.equal(migrated.data.rounds[old.round].correct,old.rounds[old.round].target);assert.deepEqual(migrated.data.rounds[old.round].options,old.rounds[old.round].choices);
}
createStore(shape,backend).clear();
values.set('shape-garden:v1:session',JSON.stringify(oldCreate(7)));values.set('shape-garden:v1:sound','on');const migratedStore=createStore(shape,backend);assert.ok(migratedStore.load());assert.equal(migratedStore.sound(),true);migratedStore.setSound(false);assert.equal(migratedStore.sound(),false);migratedStore.clear();assert.equal(values.get('shape-garden:v1:session'),undefined);assert.equal(values.get('unrelated:v1:save'),'keep');
// 범위 밖 좌표·잘못된 입력은 진행에 반영하지 않는다.
const draw=batch.items.find(i=>i.content.engine==='drawing').content;let d=create(draw,7);assert.deepEqual(event(d,{type:'stroke',points:[[Infinity,0]]},draw),d);assert.deepEqual(event(d,{type:'stroke',points:[[-1,0]]},draw),d);assert.deepEqual(event(d,{type:'stamp',cell:99},draw),d);
console.log(`통과: 콘텐츠${batch.items.length}·${sessions}개 시드 세션·${rounds}개 문항/작업, ${new Set(batch.items.map(i=>i.content.engine)).size}엔진의 완료·오답·중단·복원·저장 격리·차단·v1 마이그레이션·비정상 입력`);
const {stage}=await import('../../contents/shared/ui/stage.js');
for(const {content:d}of batch.items){const s=create(d,7),html=stage(s,d);assert.match(html,/id="question"/);assert.ok(!html.includes('undefined'));assert.ok(html.includes('button'));}
const feeling=batch.items.find(i=>i.content.engine==='feelings').content;
const changed=structuredClone(feeling);changed.params.scenes[0].title='<script>alert(1)</script>';assert.ok(stage(create(changed,7),changed).includes('&lt;script&gt;'));assert.ok(!stage(create(changed,7),changed).includes('<script>'));
console.log('표시 어댑터 통과: 등록 콘텐츠 전체 초기 화면 생성·상태 텍스트·장면 문구 이스케이프 (브라우저 검증과 별도)');

// 신규 엔진은 조작 이력·선택 범위·완료 조건이 손상된 저장을 복구하지 않는다.
for(const engine of ['words','routine','scene']){
 const def=batch.items.find(i=>i.content.engine===engine)?.content;if(!def)continue;
 const state=create(def,7),bad=structuredClone(state);
 if(engine==='words')bad.data.options[0]=['99'];
 if(engine==='routine')bad.data.paths[0]=[1];
 if(engine==='scene')bad.data.finished[0]=true;
 assert.equal(restore(bad,def),null,`${engine} 손상 저장 거부`);
}
console.log('확장 엔진 통과: 낱말 오답·생활 순서 초기화·장면 소품 선택/배치/완료·손상 저장 거부');

const {validateDefinition}=await import('../../contents/shared/core/definition.js');
for(const [engine,corrupt] of [
 ['words',d=>{d.params.cards[1].word=d.params.cards[0].word;}],
 ['routine',d=>{d.params.steps=['한 걸음','한 걸음','다음 걸음'];}],
 ['scene',d=>{d.params.backdrop='unknown';}]
]){
 const def=batch.items.find(i=>i.content.engine===engine)?.content;if(!def)continue;
 const bad=structuredClone(def);corrupt(bad);assert.throws(()=>validateDefinition(bad));
}
for(const engine of ['words','routine','scene']){
 const def=batch.items.find(i=>i.content.engine===engine)?.content;if(!def)continue;
 const changed=structuredClone(def),text='<img src=x onerror=alert(1)>';
 if(engine==='words')changed.params.cards[0].word=text;
 if(engine==='routine')changed.params.steps[0]=text;
 if(engine==='scene')changed.params.props[0].label=text;
 const html=stage(create(changed,7),changed);assert.ok(!html.includes(text));assert.ok(html.includes('&lt;img'));
}
console.log('확장 계약 통과: 중복 낱말·중복 순서·미등록 배경 거부, 신규 표시 3종 사용자 문자열 이스케이프');

const {welcomeArt}=await import('../../contents/shared/ui/welcome.js');
for(const {content:def} of batch.items){const html=welcomeArt(def);assert.ok(html.length>20&&!html.includes('undefined'));}
for(const engine of ['words','routine','scene']){
 const original=batch.items.find(i=>i.content.engine===engine)?.content;if(!original)continue;
 const d=structuredClone(original),text='<script>bad()</script>';
 if(engine==='words')d.params.cards[0].word=text;
 if(engine==='routine')d.params.steps[0]=text;
 if(engine==='scene')d.params.props[0].symbol=text;
 assert.ok(welcomeArt(d).includes('&lt;script&gt;'));assert.ok(!welcomeArt(d).includes(text));
}
console.log('시작 미리보기 통과: 전체 정의·신규 3유형 문자열 이스케이프');

// 소개가 같은 상용 문구나 엔진 공통 그림으로 되돌아가지 않도록 정본과의 대응을 확인한다.
const {CONTENTS:catalog}=await import('../../contents/catalog.js');
const {activityArtwork,DRAWING_PATHS}=await import('../../contents/shared/ui/artwork.js');
assert.equal(new Set(batch.items.map(i=>i.content.description)).size,batch.items.length,'소개는 실제 활동 데이터를 설명한다');
assert.equal(new Set(Object.values(DRAWING_PATHS).map(p=>JSON.stringify(p))).size,17,'17개 그리기 안내선을 구분한다');
for(const {content:def}of batch.items){
 const entry=catalog.find(c=>c.slug===def.slug);assert.equal(entry.description,def.description);assert.deepEqual(entry.preview.params,def.params);
 const html=activityArtwork(entry.preview);assert.ok(html.startsWith('<svg')&&!/undefined|NaN/.test(html));
 assert.equal(welcomeArt(def),`<div class="activity-preview">${html}</div>`,'카드와 시작 화면 그림 일치');
}
const drawingPreviews=batch.items.filter(i=>i.content.engine==='drawing').map(i=>activityArtwork(i.content));
assert.equal(new Set(drawingPreviews).size,17,'색뿐 아니라 안내선이 다름');
console.log(`소개·그림 계약 통과: ${batch.items.length}개 소개 대응·17종 안내선·카드/시작 화면 그림 일치`);
