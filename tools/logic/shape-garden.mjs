import assert from 'node:assert/strict';
import { create, answer, next, pause, resume, restore, flowers, SHAPES, TOTAL } from '../../contents/shape-garden/src/activity.js';
for(let seed=0;seed<200;seed++){
 let s=create(seed);
 assert.deepEqual(create(seed),s);
 for(const round of s.rounds){assert.equal(new Set(round.choices).size,3);assert.deepEqual([...round.choices].sort(),[...SHAPES].sort());}
 for(const shape of SHAPES)assert.equal(s.rounds.filter(r=>r.target===shape).length,2);
 for(let i=0;i<TOTAL;i++){
  const target=s.rounds[i].target;
  assert.equal(answer(s,SHAPES.find(x=>x!==target)).result,'try-again');
  assert.equal(flowers(s),i);
  const paused=pause(s);assert.equal(answer(paused,target).result,'ignored');assert.deepEqual(resume(paused),s);
  s=answer(s,target).state;
  assert.equal(flowers(s),i+1);assert.equal(answer(s,target).result,'ignored');
  assert.deepEqual(restore(JSON.stringify(s)),s);assert.deepEqual(resume(pause(s)),s);
  s=next(s);
 }
 assert.equal(s.phase,'complete');assert.equal(flowers(s),6);assert.equal(next(s),s);
}
for(const bad of ['{','null','{}',JSON.stringify({...create(1),round:10}),JSON.stringify({...create(1),seed:-1}),JSON.stringify({...create(1),phase:'complete'}),JSON.stringify({...create(1),rounds:[]}),JSON.stringify({...create(1),phase:'paused',previous:'complete'})])assert.equal(restore(bad),null);
console.log('통과: 200개 시드·1,200문항, 모양 균형·결정성·오답·중복 입력·일시정지·완료·저장 복구·손상 거부');
const storage = await import('../../contents/shape-garden/src/storage.js');
const values=new Map([['other:v1:session','keep']]);
globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
assert.ok(storage.save(create(3)));assert.deepEqual(storage.load(),create(3));
assert.ok(storage.clear());assert.equal(values.get('other:v1:session'),'keep');assert.equal(storage.load(),null);
globalThis.localStorage={getItem(){throw new Error('blocked')},setItem(){throw new Error('blocked')},removeItem(){throw new Error('blocked')}};
assert.equal(storage.load(),null);assert.equal(storage.save(create(3)),false);assert.equal(storage.clear(),false);
delete globalThis.localStorage;
console.log('통과: 저장·삭제 대상 분리·타 콘텐츠 키 보존·저장소 차단 복구');
