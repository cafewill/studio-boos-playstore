import {selectionIndex} from '../core/utils.js';
export const create=def=>({rounds:Array.from({length:def.roundCount},()=>({selected:null,seen:[],last:null,finished:false}))});
export function act(data,event,def,round){
 const current=data.rounds[round];let next;
 if(event.type==='token'){
  const index=selectionIndex(event.value,2);if(index===null)return{data};
  if(current.selected===null)next={...current,selected:index};
  else{
   if(current.selected===index)return{data,notice:'서로 다른 두 요소를 골라 봐요.'};
   const pair=[current.selected,index].sort((a,b)=>a-b).join('-');
   next={...current,selected:null,last:pair,seen:current.seen.includes(pair)?current.seen:[...current.seen,pair]};
  }
 }else if(event.type==='discovery-clear')next={selected:null,seen:[],last:null,finished:false};
 else if(event.type==='finish'){
  if(current.seen.length!==3)return{data,notice:'서로 다른 세 쌍을 모두 살펴봐요. 이미 찾은 조합은 수첩에서 볼 수 있어요.'};next={...current,finished:true};
 }else return{data};
 return{data:{...data,rounds:data.rounds.map((v,i)=>i===round?next:v)},notice:next.last&&current.last!==next.last?'두 요소가 만나 새로운 조합 그림이 되었어요.':'선택한 요소를 살펴봐요.'};
}
export const done=(data,round)=>data.rounds[round].finished===true;
export function validate(data,def){
 const keys=def.params.results.map(r=>r.pair);
 return data&&Array.isArray(data.rounds)&&data.rounds.length===def.roundCount&&data.rounds.every(r=>r&&(r.selected===null||Number.isInteger(r.selected)&&r.selected>=0&&r.selected<3)&&Array.isArray(r.seen)&&r.seen.length<=3&&new Set(r.seen).size===r.seen.length&&r.seen.every(k=>keys.includes(k))&&(r.last===null?r.seen.length===0:r.seen.includes(r.last))&&typeof r.finished==='boolean'&&(!r.finished||r.seen.length===3));
}
