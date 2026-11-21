import {random,integer,same} from '../core/utils.js';
export function create(def,seed){const rng=random(seed);return{targets:Array.from({length:def.roundCount},(_,i)=>({hour:1+Math.floor(rng()*12),minute:def.params.halfHours&&i%2?30:0})),values:Array.from({length:def.roundCount},()=>({hour:12,minute:0})),accepted:Array(def.roundCount).fill(false)};}
export function act(data,event,def,round){
 if(event.type==='hour'&&[-1,1].includes(event.value)){const values=data.values.map(v=>({...v}));values[round].hour=((values[round].hour-1+event.value+12)%12)+1;return{data:{...data,values}};}
 if(event.type==='minute'){const values=data.values.map(v=>({...v}));values[round].minute=values[round].minute===0?30:0;return{data:{...data,values}};}
 if(event.type==='finish'){
  if(!same(data.targets[round],data.values[round]))return{data,notice:'짧은 바늘과 긴 바늘을 천천히 살펴봐요.'};
  const accepted=[...data.accepted];accepted[round]=true;return{data:{...data,accepted},notice:'시계가 같은 시간을 가리키네요.'};
 }
 return{data};
}
export const done=(d,r)=>d.accepted[r];
export function validate(d,def,seed){return d&&same(d.targets,create(def,seed).targets)&&Array.isArray(d.values)&&d.values.length===def.roundCount&&d.values.every(v=>integer(v.hour,1,12)&&[0,30].includes(v.minute))&&Array.isArray(d.accepted)&&d.accepted.length===def.roundCount&&d.accepted.every((v,i)=>typeof v==='boolean'&&(!v||same(d.targets[i],d.values[i])));}
