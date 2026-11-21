import {random,shuffle,same} from '../core/utils.js';
export function create(def,seed){const rng=random(seed);return{options:Array.from({length:def.roundCount},()=>shuffle(def.params.cards.map((_,i)=>String(i)),rng)),solved:Array(def.roundCount).fill(false)};}
export function act(data,event,def,round){
 if(event.type!=='word'||!data.options[round].includes(event.value))return{data};
 if(event.value!==String(round%def.params.cards.length))return{data,notice:'그림과 낱말을 천천히 다시 살펴봐요.'};
 const solved=[...data.solved];solved[round]=true;return{data:{...data,solved},notice:'그림과 낱말이 만났어요!'};
}
export const done=(data,round)=>data.solved[round]===true;
export function validate(data,def,seed){return data&&same(data.options,create(def,seed).options)&&Array.isArray(data.solved)&&data.solved.length===def.roundCount&&data.solved.every(v=>typeof v==='boolean');}
