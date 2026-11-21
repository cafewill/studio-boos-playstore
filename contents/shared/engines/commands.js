import {integer} from '../core/utils.js';
const MOVES={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
export const create=def=>({queues:Array.from({length:def.roundCount},()=>[]),paths:Array.from({length:def.roundCount},()=>[[0,0]]),accepted:Array(def.roundCount).fill(false)});
export const goal=(def,round)=>[[2,0],[2,2],[0,2]][round%3];
export function trace(queue){let x=0,y=0;const path=[[0,0]];for(const step of queue){const delta=MOVES[step];x+=delta[0];y+=delta[1];if(!integer(x,0,2)||!integer(y,0,2))return{path,valid:false};path.push([x,y]);}return{path,valid:true};}
export function act(data,event,def,round){
 const queues=data.queues.map(q=>[...q]);
 if(event.type==='command'&&Object.hasOwn(MOVES,event.value)&&queues[round].length<10){queues[round].push(event.value);return{data:{...data,queues}};}
 if(event.type==='undo'){queues[round].pop();return{data:{...data,queues}};}
 if(event.type==='clear'){queues[round]=[];return{data:{...data,queues}};}
 if(event.type==='run'){
  const result=trace(queues[round]),end=result.path.at(-1),target=goal(def,round),paths=data.paths.map(p=>[...p]);paths[round]=result.path;
  if(!result.valid||end[0]!==target[0]||end[1]!==target[1])return{data:{...data,paths},notice:'도착할 길을 다시 생각해 볼까요? 명령은 언제든 바꿀 수 있어요.'};
  const accepted=[...data.accepted];accepted[round]=true;return{data:{...data,paths,accepted},notice:'명령이 이어져 목적지에 도착했어요.'};
 }
 return{data};
}
export const done=(d,r)=>d.accepted[r];
export function validate(d,def){return d&&Array.isArray(d.queues)&&d.queues.length===def.roundCount&&d.queues.every(q=>Array.isArray(q)&&q.length<=10&&q.every(v=>Object.hasOwn(MOVES,v)))&&Array.isArray(d.paths)&&d.paths.length===def.roundCount&&d.paths.every(p=>Array.isArray(p)&&p.length<=11&&p.every(v=>Array.isArray(v)&&v.length===2&&v.every(n=>integer(n,0,2))))&&Array.isArray(d.accepted)&&d.accepted.length===def.roundCount&&d.accepted.every((v,i)=>typeof v==='boolean'&&(!v||(trace(d.queues[i]).valid&&trace(d.queues[i]).path.at(-1).every((n,j)=>n===goal(def,i)[j]))));}
