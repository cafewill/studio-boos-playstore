import {random,shuffle,same,integer} from '../core/utils.js';
export function create(def,seed){const rng=random(seed);return{options:Array.from({length:def.roundCount},()=>shuffle(def.params.steps.map((_,i)=>String(i)),rng)),paths:Array.from({length:def.roundCount},()=>[])};}
export function act(data,event,def,round){
 const path=data.paths[round];
 if(event.type==='routine-reset'){const paths=data.paths.map((p,i)=>i===round?[]:p);return{data:{...data,paths}};}
 if(event.type!=='step'||!data.options[round].includes(event.value))return{data};
 if(event.value!==String(path.length))return{data,notice:'다음에 할 일을 함께 살펴볼까요? 시간은 충분해요.'};
 const paths=data.paths.map((p,i)=>i===round?[...p,Number(event.value)]:p);return{data:{...data,paths},notice:path.length+1===def.params.steps.length?'차근차근 순서를 이어 보았어요.':'한 걸음 이어졌어요.'};
}
export const done=(data,round)=>data.paths[round].length===data.options[round].length;
export function validate(data,def,seed){return data&&same(data.options,create(def,seed).options)&&Array.isArray(data.paths)&&data.paths.length===def.roundCount&&data.paths.every(p=>Array.isArray(p)&&p.length<=def.params.steps.length&&p.every((v,i)=>integer(v,0,def.params.steps.length-1)&&v===i));}
