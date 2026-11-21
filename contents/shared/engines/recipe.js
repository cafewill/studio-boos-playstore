import {selectionIndex,same} from '../core/utils.js';
export const create=def=>({stacks:Array.from({length:def.roundCount},()=>[]),finished:Array(def.roundCount).fill(false)});
export function act(data,event,def,round){
 const stack=data.stacks[round];let next;
 if(event.type==='ingredient'){
  const index=selectionIndex(event.value,def.params.ingredients.length-1);
  if(index===null||stack.length>=6)return{data};next=[...stack,index];
 }else if(event.type==='recipe-undo')next=stack.slice(0,-1);
 else if(event.type==='recipe-clear')next=[];
 else if(event.type==='finish'){
  if(!same(stack,def.params.recipe))return{data,notice:'주문표와 쌓은 재료를 비교해 봐요. 한 층씩 되돌릴 수 있어요.'};
  const finished=[...data.finished];finished[round]=true;return{data:{...data,finished},notice:'재료의 순서를 살펴보았어요. 나눌 준비가 되었네요!'};
 }else return{data};
 return{data:{...data,stacks:data.stacks.map((s,i)=>i===round?next:s)},notice:'그림 재료를 놓았어요. 실제 조리 도구는 필요하지 않아요.'};
}
export const done=(data,round)=>data.finished[round]===true;
export function validate(data,def){
 return data&&Array.isArray(data.stacks)&&data.stacks.length===def.roundCount&&data.stacks.every(s=>Array.isArray(s)&&s.length<=6&&s.every(v=>Number.isInteger(v)&&v>=0&&v<def.params.ingredients.length))&&Array.isArray(data.finished)&&data.finished.length===def.roundCount&&data.finished.every((v,i)=>typeof v==='boolean'&&(!v||same(data.stacks[i],def.params.recipe)));
}
