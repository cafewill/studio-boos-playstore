import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {loadRegistry} from '../content/registry.mjs';
import {create,dispatch,restore} from '../../contents/shared/core/model.js';
import {validateDefinition} from '../../contents/shared/core/definition.js';
import {notesAt} from '../../contents/shared/engines/rhythm.js';
import {stage} from '../../contents/shared/ui/stage.js';
import {activityArtwork} from '../../contents/shared/ui/artwork.js';
const {items,batches}=loadRegistry();
const added=batches.find(b=>b.definitionFile.endsWith('/expansion30.json'));
assert.ok(added);assert.equal(added.items.length,30);
const survey=JSON.parse(fs.readFileSync(new URL(`../../data/store/${added.sourceSnapshot}`,import.meta.url),'utf8'));
for(const item of added.items){
 const source=survey.apps.find(a=>a.researchId===item.candidateId),text=source.detail.descriptionExcerpt.trim();
 assert.equal(source.assessment.status,'조건부');assert.ok(item.scopeReview.difference.trim());
 assert.equal(crypto.createHash('sha256').update(text).digest('hex'),item.scopeReview.evidenceSha256);
 assert.ok(text.includes(item.scopeReview.evidenceExcerpt));
}

const def=engine=>items.find(i=>i.content.engine===engine).content;
function send(s,d,type,value){const next=dispatch(s,{type,value},d).state;assert.ok(restore(next,d),'조작 중 상태가 저장·복원 가능');return next;}
const recipe=def('recipe');let s=create(recipe,7);
for(const bad of [null,0,'','00','-1','1e0','99'])assert.deepEqual(send(s,recipe,'ingredient',bad),s);
for(let i=0;i<6;i++)s=send(s,recipe,'ingredient','0');
assert.equal(s.data.stacks[0].length,6);assert.deepEqual(send(s,recipe,'ingredient','1'),s,'재료 6층 상한');
assert.equal(send(s,recipe,'finish').phase,'playing','잘못된 주문은 완료되지 않음');
s=send(s,recipe,'recipe-undo');assert.equal(s.data.stacks[0].length,5);s=send(s,recipe,'recipe-clear');
for(const index of recipe.params.recipe)s=send(s,recipe,'ingredient',String(index));
assert.equal(send(s,recipe,'finish').phase,'feedback');
const rhythm=def('rhythm');s=create(rhythm,7);
for(const i of [0,1,2])s=send(s,rhythm,'rhythm-toggle',String(i));
for(let i=0;i<4;i++)s=send(s,rhythm,'beat');assert.equal(send(s,rhythm,'finish').phase,'playing','한 트랙만 켜면 두 트랙 조건 미충족');
s=send(s,rhythm,'rhythm-toggle','5');assert.equal(s.data.heard[0].filter(Boolean).length,0,'편집 뒤 다시 듣기');
assert.equal(send(s,rhythm,'finish').phase,'playing');
assert.deepEqual(notesAt(s.data,rhythm,0),[rhythm.params.tracks[0].note]);
for(let i=0;i<4;i++)s=send(s,rhythm,'beat');assert.equal(send(s,rhythm,'finish').phase,'feedback');
const discovery=def('discovery');s=create(discovery,7);
s=send(s,discovery,'token','0');assert.deepEqual(send(s,discovery,'token','0'),s,'같은 요소 두 번은 새 조합이 아님');
s=send(s,discovery,'token','1');const pair=s.data.rounds[0].last;
s=send(s,discovery,'token','1');s=send(s,discovery,'token','0');assert.equal(s.data.rounds[0].last,pair);assert.equal(s.data.rounds[0].seen.length,1,'순서를 바꾸어도 같은 조합');
s=send(s,discovery,'discovery-clear');assert.equal(s.data.rounds[0].seen.length,0);
for(const pair of [['2','1'],['2','0'],['1','0']])for(const token of pair)s=send(s,discovery,'token',token);
assert.equal(send(s,discovery,'finish').phase,'feedback');
const animation=def('animation');s=create(animation,7);
for(let frame=0;frame<4;frame++){s=send(s,animation,'frame-show',String(frame));s=send(s,animation,'frame-place','0');}
for(let frame=0;frame<4;frame++)s=send(s,animation,'frame-show',String(frame));
assert.equal(send(s,animation,'finish').phase,'playing','모든 장면이 같으면 위치 변화가 없음');
s=send(s,animation,'frame-place','8');assert.equal(send(s,animation,'finish').phase,'playing','편집된 프레임은 다시 살펴보기 필요');
s=send(s,animation,'frame-show','3');assert.equal(send(s,animation,'finish').phase,'feedback');
for(const engine of ['recipe','rhythm','discovery','animation']){
 const d=def(engine);s=create(d,7);const corrupt=structuredClone(s);
 if(engine==='recipe')corrupt.data.finished[0]=true;
 if(engine==='rhythm')corrupt.data.patterns[0][0]='yes';
 if(engine==='discovery')corrupt.data.rounds[0].seen=['0-1','0-1'];
 if(engine==='animation')corrupt.data.rounds[0].reviewed[0]=true;
 assert.equal(restore(corrupt,d),null,`${engine} 손상 저장 거부`);
 for(const bad of ['99',null,'-1']){
  const type={recipe:'ingredient',rhythm:'rhythm-toggle',discovery:'token',animation:'frame-place'}[engine];assert.deepEqual(send(s,d,type,bad),s);
 }
 const malformed=structuredClone(d);
 if(engine==='recipe')malformed.params.recipe=[99,0,1];
 if(engine==='rhythm')malformed.params.tracks[1].note=malformed.params.tracks[0].note;
 if(engine==='discovery')malformed.params.results[2].pair='0-1';
 if(engine==='animation')malformed.params.frameCount=0;
 assert.throws(()=>validateDefinition(malformed));
 const changed=structuredClone(d),payload='<script>bad()</script>';
 if(engine==='recipe')changed.params.ingredients[0].label=payload;
 if(engine==='rhythm')changed.params.tracks[0].label=payload;
 if(engine==='discovery')changed.params.tokens[0].label=payload;
 if(engine==='animation')changed.params.symbol=payload;
 const html=stage(create(changed,7),changed),art=activityArtwork(changed);
 assert.ok(!html.includes(payload));assert.ok(!art.includes(payload));
 assert.ok(html.includes('&lt;script&gt;')||engine==='animation');
}
const firstLetter=added.items.find(i=>i.candidateId==='E259').content;
assert.equal(firstLetter.params.mode,'initial');assert.match(stage(create(firstLetter,7),firstLetter),/첫 글자/);assert.match(stage(create(firstLetter,7),firstLetter),/apple/);
console.log('확장30 통과: 주문 순서/6층 상한·편집 후 재청취·순서 무관 조합·프레임 이동/재검토·입력/스키마/저장 손상·표시 이스케이프·첫 글자 단서');
