import {integer,selectionIndex} from '../core/utils.js';
export const create=def=>({rounds:Array.from({length:def.roundCount},()=>({frame:0,positions:Array(4).fill(null),reviewed:Array(4).fill(false),finished:false}))});
const ready=r=>r.positions.every(v=>v!==null)&&new Set(r.positions).size>=2&&r.reviewed.every(Boolean);
export function act(data,event,def,round){
 const current=data.rounds[round];let next;
 if(event.type==='frame-place'){
  const index=selectionIndex(event.value,8);if(index===null)return{data};
  next={...current,positions:current.positions.map((v,i)=>i===current.frame?index:v),reviewed:current.reviewed.map((v,i)=>i===current.frame?false:v)};
 }else if(event.type==='frame-show'){
  const frame=selectionIndex(event.value,3);if(frame===null)return{data};
  next={...current,frame,reviewed:current.reviewed.map((v,i)=>i===frame&&current.positions[i]!==null?true:v)};
 }else if(event.type==='finish'){
  if(!ready(current))return{data,notice:'네 장면의 위치를 채우고 두 자리 이상 다르게 놓은 뒤, 네 장면을 하나씩 다시 눌러 봐요.'};next={...current,finished:true};
 }else return{data};
 return{data:{...data,rounds:data.rounds.map((v,i)=>i===round?next:v)},notice:`${next.frame+1}번째 장면을 보고 있어요. 자동 재생 없이 내 속도로 넘겨요.`};
}
export const done=(data,round)=>data.rounds[round].finished===true;
export function validate(data,def){
 return data&&Array.isArray(data.rounds)&&data.rounds.length===def.roundCount&&data.rounds.every(r=>r&&integer(r.frame,0,3)&&Array.isArray(r.positions)&&r.positions.length===4&&r.positions.every(v=>v===null||integer(v,0,8))&&Array.isArray(r.reviewed)&&r.reviewed.length===4&&r.reviewed.every((v,i)=>typeof v==='boolean'&&(!v||r.positions[i]!==null))&&typeof r.finished==='boolean'&&(!r.finished||ready(r)));
}
