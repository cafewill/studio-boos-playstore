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
console.log(`통과: 콘텐츠${batch.items.length}·${sessions}개 시드 세션·${rounds}개 문항/작업, 7엔진의 완료·오답·중단·복원·저장 격리·차단·v1 마이그레이션·비정상 입력`);
const {stage}=await import('../../contents/shared/ui/stage.js');
for(const {content:d}of batch.items){const s=create(d,7),html=stage(s,d);assert.match(html,/id="question"/);assert.ok(!html.includes('undefined'));assert.ok(html.includes('button'));}
const feeling=batch.items.find(i=>i.content.engine==='feelings').content;
const changed=structuredClone(feeling);changed.params.scenes[0].title='<script>alert(1)</script>';assert.ok(stage(create(changed,7),changed).includes('&lt;script&gt;'));assert.ok(!stage(create(changed,7),changed).includes('<script>'));
console.log('표시 어댑터 통과: 등록 콘텐츠 전체 초기 화면 생성·상태 텍스트·장면 문구 이스케이프 (브라우저 검증과 별도)');
