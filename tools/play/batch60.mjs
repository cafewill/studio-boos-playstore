import {loadRegistry} from '../content/registry.mjs';
// 서버·Chrome을 사용할 수 있는 환경에서만 실행한다. 성공 시에만 결과 JSON을 쓴다.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {browser} from '../lib/browser.mjs';
import {create} from '../../contents/shared/core/model.js';
import {goal} from '../../contents/shared/engines/commands.js';
import {target} from '../../contents/shared/engines/assembly.js';
const batch=loadRegistry();
const arg=process.argv.find(a=>a.startsWith('--slug='));
let items=arg?batch.items.filter(i=>i.content.slug===arg.slice(7)):batch.items;
if(process.argv.includes('--representatives')){const found=new Set();items=items.filter(i=>!found.has(i.content.engine)&&found.add(i.content.engine));}
assert.ok(items.length,'검증 대상 없음');
const base=process.env.ORIGIN||'http://127.0.0.1:7904';
// 브라우저를 띄우기 전에 서버 연결을 확인하여 환경 오류를 빠르게 알린다.
const response=await fetch(`${base}/contents/`);assert.ok(response.ok,'로컬 서버 확인 필요');
const b=await browser();const passed=[];
const tapAction=(action,value)=>b.tap(`[data-action="${action}"]${value!==undefined?`[data-value="${value}"]`:''}`);
try{
 await b.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await b.send('Emulation.setTouchEmulationEnabled',{enabled:true});
 for(const {content:d}of items){
  await b.goto(`${base}/contents/${d.slug}/?seed=7`);assert.equal(await b.evaluate('document.body.dataset.contentId'),d.slug);
  await b.tap('#start');await b.tap('#rest');assert.ok(await b.evaluate("!!document.querySelector('#resume')"));await b.tap('#resume');
  const initial=create(d,7);
  for(let r=0;r<d.roundCount;r++){
   if(d.engine==='choice'){const correct=await b.evaluate("document.querySelector('#target').dataset.correct");await b.tap(`#choice-${correct}`);}
   if(d.engine==='drawing'){await tapAction('stamp',4);await tapAction('finish');}
   if(d.engine==='assembly'){
    const t=target(d,r)??['square','circle','triangle','blank','blank','blank','blank','blank','blank'];
    for(let i=0;i<9;i++){await tapAction('part',t[i]);await tapAction('cell',i);}await tapAction('finish');
   }
   if(d.engine==='clock'){const t=initial.data.targets[r];for(let i=0;i<t.hour%12;i++)await tapAction('hour',1);if(t.minute===30)await tapAction('minute');await tapAction('finish');}
   if(d.engine==='sound'){for(const n of [0,2,4])await tapAction('play',n);await tapAction('finish');}
   if(d.engine==='commands'){const [x,y]=goal(d,r);for(let i=0;i<x;i++)await tapAction('command','right');for(let i=0;i<y;i++)await tapAction('command','down');await tapAction('run');}
   if(d.engine==='feelings')await tapAction('feeling','속상해요');
   assert.ok(await b.evaluate("!!document.querySelector('#next')"),`${d.slug} 완료 피드백`);await b.tap('#next');
  }
  assert.ok(await b.evaluate("!!document.querySelector('#done-title')"),`${d.slug} 최종 완료`);
  await b.tap('#again');await b.tap('#rest');await b.goto(`${base}/contents/${d.slug}/?seed=7`);assert.ok(await b.evaluate("!!document.querySelector('#continue')"));await b.tap('#continue');
  await b.evaluate("localStorage.setItem('unrelated:v1:test','keep')");await b.tap('#care');await b.tap('#erase');await b.tap('#erase');await b.tap('#close-care');
  assert.equal(await b.evaluate(`localStorage.getItem('${d.slug}:v2:session')`),null);assert.equal(await b.evaluate("localStorage.getItem('unrelated:v1:test')"),'keep');assert.equal(await b.evaluate('document.activeElement.id'),'care');
  for(const [width,height]of [[360,640],[390,844],[768,1024],[1024,768],[1280,800]]){await b.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<800});assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),`${d.slug} 가로 넘침 ${width}`);}
  await b.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await b.evaluate("document.documentElement.style.fontSize='200%'");assert.ok(await b.evaluate('document.documentElement.scrollWidth<=innerWidth'),`${d.slug} 확대`);await b.evaluate("document.documentElement.style.fontSize=''");
  passed.push(d.slug);console.log(`브라우저 통과: ${d.slug}`);
 }
 await b.goto(`${base}/contents/`);assert.equal(await b.evaluate('document.querySelectorAll("article").length'),batch.items.length);
 await b.evaluate("document.querySelector('#search').value='없는이름';document.querySelector('#search').dispatchEvent(new Event('input'))");assert.equal(await b.evaluate('document.querySelectorAll("article").length'),0);await b.tap('#reset-search');assert.equal(await b.evaluate('document.querySelectorAll("article").length'),batch.items.length);
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:"Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})"});
 await b.goto(`${base}/contents/shape-garden/?seed=7`);await b.tap('#start');assert.ok(await b.evaluate("!!document.querySelector('#target')"));
 assert.equal(b.errors.length,0,b.errors.join('\n'));assert.equal(b.requests.filter(url=>/^https?:/.test(url)&&!url.startsWith(base+'/')).length,0);
 const ts=new Date(Date.now()+9*3600000).toISOString().replace(/[-:T]/g,'').slice(0,14);
 const screenshot=await b.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`test/${ts}-batch60-mobile.png`,Buffer.from(screenshot.data,'base64'));
 fs.writeFileSync(`test/${ts}-batch60-browser.json`,JSON.stringify({passed,environment:'Chrome CDP 터치 에뮬레이션',coverage:['완료','중단','복원','삭제 격리','5화면','확대','포털','저장 차단','모션 감소 설정','콘솔','외부 요청'],notCovered:['실제 Android 기기','스크린리더 수동 관찰','실제 아동 관찰','시각 품질 수동 검수','음원 청취']},null,2)+'\n');
}finally{b.cleanup();}
