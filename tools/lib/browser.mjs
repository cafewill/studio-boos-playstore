import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function browser() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'boos-browser-'));
  const port = 9600 + Math.floor(Math.random() * 300);
  const process = spawn(globalThis.process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new','--disable-gpu',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--no-first-run','about:blank'], {stdio:'ignore'});
  let ws;
  const cleanup = () => { ws?.close(); process.kill(); try { fs.rmSync(profile,{recursive:true,force:true}); } catch {} };
  process.on('error', e => { console.error(e.message); });
  try {
    let endpoint;
    for (let i=0;i<60;i++) {
      try { endpoint=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==='page')?.webSocketDebuggerUrl; } catch {}
      if(endpoint) break;
      await wait(150);
    }
    if(!endpoint) throw new Error('Chrome CDP 연결 실패');
    ws=new WebSocket(endpoint);
    await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
    let next=0;const pending=new Map(),errors=[],requests=[];
    ws.addEventListener('message',event=>{
      const msg=JSON.parse(event.data);
      if(msg.id && pending.has(msg.id)){pending.get(msg.id)(msg);pending.delete(msg.id);return;}
      if(msg.method==='Network.responseReceived' && msg.params.response.status>=400)errors.push(`HTTP ${msg.params.response.status}: ${msg.params.response.url}`);
      if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text);
      if(msg.method==='Runtime.consoleAPICalled' && ['error','warning'].includes(msg.params.type))errors.push(msg.params.type);
      if(msg.method==='Network.requestWillBeSent')requests.push(msg.params.request.url);
    });
    const send=(method,params={})=>new Promise((resolve,reject)=>{
      const id=++next;
      const timer=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP 시간 초과: ${method}`));},15000);
      pending.set(id,msg=>{clearTimeout(timer);msg.error?reject(new Error(msg.error.message)):resolve(msg.result);});
      ws.send(JSON.stringify({id,method,params}));
    });
    await send('Runtime.enable');await send('Page.enable');await send('Network.enable');
    const evaluate=async expression=>{
      const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
      if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);
      return result.result.value;
    };
    const goto=async url=>{await send('Page.navigate',{url});for(let i=0;i<50;i++){await wait(100);if(await evaluate(`document.readyState==='complete' && location.href===${JSON.stringify(new URL(url).href)} && !!document.querySelector('#start, article')`))return;}throw new Error('화면 로드 실패');};
    const click=async selector=>{
      const box=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)return null;e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
      if(!box)throw new Error(`요소 없음: ${selector}`);
      await send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...box});
      await send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...box});
    };
    const tap=async selector=>{
      const box=await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
      await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[box]});await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    };
    return {send,evaluate,goto,click,tap,errors,requests,wait,cleanup};
  } catch(e) { cleanup();throw e; }
}
