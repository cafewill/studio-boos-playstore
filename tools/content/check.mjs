import {loadRegistry} from './registry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {validateDefinition,ENGINE_NAMES} from '../../contents/shared/core/definition.js';
import {ENGINES} from '../../contents/shared/core/model.js';
import {CONTENTS} from '../../contents/catalog.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
execFileSync(process.execPath,['tools/content/generate.mjs','--check'],{cwd:root,stdio:'inherit'});
const batch=loadRegistry();
const eligible=new Map();
for(const sourceBatch of batch.batches){
 assert.ok(fs.existsSync(path.join(root,sourceBatch.reviewDocument)));assert.ok(fs.existsSync(path.join(root,sourceBatch.planDocument)));
 const survey=JSON.parse(fs.readFileSync(path.join(root,'data/store',sourceBatch.sourceSnapshot),'utf8'));
 const available=new Map(survey.apps.filter(a=>a.assessment.status==='적합 후보').map(a=>[a.researchId,a]));
 const selected=sourceBatch.selectedCandidateIds??[...available.keys()];
 assert.deepEqual(new Set(sourceBatch.items.map(i=>i.candidateId)),new Set(selected));
 for(const item of sourceBatch.items){assert.ok(available.has(item.candidateId));assert.equal(item.sourceAppId,available.get(item.candidateId).appId);eligible.set(item.sourceAppId,available.get(item.candidateId));}
}
assert.equal(CONTENTS.length,batch.items.length);
const contentDirs=fs.readdirSync(path.join(root,'contents'),{withFileTypes:true}).filter(e=>e.isDirectory()&&e.name!=='shared').map(e=>e.name);assert.deepEqual(new Set(contentDirs),new Set(batch.items.map(i=>i.content.slug)),'미등록·누락 콘텐츠 디렉터리');
assert.equal(new Set(batch.items.map(i=>i.sourceAppId)).size,batch.items.length,'현재 규약: 후보당 MVP 1개, 중복 활동 추가는 정의 계약 검토 필요');
assert.equal(new Set(CONTENTS.map(c=>c.slug)).size,batch.items.length);assert.equal(new Set(CONTENTS.map(c=>c.title)).size,batch.items.length);
assert.deepEqual(Object.keys(ENGINES).sort(),[...ENGINE_NAMES].sort());
const legacyFiles=new Set(['contents/shape-garden/src/activity.js','contents/shape-garden/src/storage.js']);
const runtime=[];
function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){const full=path.join(directory,entry.name);if(entry.isDirectory())walk(full);else if(entry.name.endsWith('.js'))runtime.push(full);}}
walk(path.join(root,'contents'));
for(const item of batch.items){
 const d=item.content;validateDefinition(d);assert.equal(item.sourceAppId,eligible.get(item.sourceAppId).appId);
 const module=await import(pathToFileURL(path.join(root,'contents',d.slug,'content.js')));
 assert.deepEqual(module.definition,d);
 for(const file of fs.readdirSync(path.join(root,'contents',d.slug,'src'))){assert.ok(file==='main.js'||legacyFiles.has(`contents/${d.slug}/src/${file}`),`단독 코드 추가는 공통 엔진·정식 확장 경로를 검토해야 합니다: ${d.slug}/${file}`);}
 assert.ok(!fs.existsSync(path.join(root,'contents',d.slug,'style.css')),`개별 CSS 복제: ${d.slug}`);
 const defSource=fs.readFileSync(path.join(root,'contents',d.slug,'content.js'),'utf8');
 assert.ok(!defSource.includes(item.sourceAppId),`사용자 정의에 원작 패키지 혼입: ${d.slug}`);
}
for(const full of runtime){
 const relative=path.relative(root,full);const source=fs.readFileSync(full,'utf8');
 if(relative.startsWith('contents/shared/engines/'))assert.ok(!/\b(?:document|window|localStorage|AudioContext|fetch)\b/.test(source),`규칙 엔진의 브라우저 의존: ${relative}`);
 assert.ok(!/\bMath\.random\s*\(/.test(source),`시드 없는 무작위: ${relative}`);
 if(source.includes('localStorage'))assert.ok(['contents/shared/core/storage.js','contents/shared/core/legacy-storage.js'].includes(relative),`저장 경계 위반: ${relative}`);
 for(const [,specifier]of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){
  assert.ok(specifier.startsWith('.'),`런타임 외부 의존: ${relative} -> ${specifier}`);
  const target=path.resolve(path.dirname(full),specifier);assert.ok(fs.existsSync(target),`깨진 모듈: ${relative} -> ${specifier}`);
  assert.ok(target.startsWith(path.join(root,'contents')+path.sep),`런타임 조사·도구 코드 참조: ${relative}`);
  if(relative.startsWith('contents/shared/'))assert.ok(target.startsWith(path.join(root,'contents/shared')+path.sep),`공통 모듈의 개별 콘텐츠 역참조: ${relative}`);
 }
}
console.log(`구조 통과: 후보${batch.items.length}·정의${CONTENTS.length}·엔진${ENGINE_NAMES.length}·등록 배치${batch.batches.length}·단일 생성 원본·같은 진입 규약·저장 격리·순수 규칙·역참조/코드/CSS 복제 방지`);
