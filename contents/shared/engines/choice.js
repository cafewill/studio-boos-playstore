import {create as createLegacy} from './shape-legacy.js';
import {random,shuffle,same,SHAPES,NAMES,integer} from '../core/utils.js';
function question(def,index,rng) {
 const p=def.params, v=def.variant;
 const pick=(min,max)=>min+Math.floor(rng()*(max-min+1));
 if(['shape','color','size','pattern'].includes(v)){
  const values=v==='color'?['green','blue','orange']:v==='size'?['small','medium','large']:SHAPES;
  const correct=values[index%values.length];
  return {kind:v,correct,options:shuffle(values,rng),prompt:v==='pattern'?'다음에는 어떤 모양이 올까요?':v==='size'?'같은 크기를 찾아볼까요?':v==='color'?'같은 색을 찾아볼까요?':'같은 모양을 찾아볼까요?',pattern:v==='pattern'?[values[(index+1)%3],correct,values[(index+1)%3]]:null};
 }
 let a=pick(p.min??1,p.max??5),b=pick(1,p.secondMax??3),correct,prompt,visual;
 if(v==='count'){correct=a;prompt='몇 개가 있는지 골라 볼까요?';visual={kind:'dots',count:a};}
 else if(v==='add'){correct=a+b;prompt=`${a}개와 ${b}개를 모으면 몇 개일까요?`;visual={kind:'add',a,b};}
 else if(v==='subtract'){b=Math.min(a,b);correct=a-b;prompt=`${a}개에서 ${b}개를 나누어 주면 몇 개가 남을까요?`;visual={kind:'subtract',a,b};}
 else if(v==='multiply'){correct=a*b;prompt=`${a}개씩 ${b}묶음이에요. 모두 몇 개일까요?`;visual={kind:'groups',a,b};}
 else if(v==='sequence'){correct=a+(p.step??1);prompt='다음 숫자를 찾아볼까요?';visual={kind:'text',text:`${a}  ·  ?`};}
 else if(v==='missing'){correct=b;prompt='빈자리에 들어갈 수를 찾아요.';visual={kind:'text',text:`${a} + ? = ${a+b}`};}
 else if(v==='compare'){const values=shuffle([a,a+1,a+3],rng);correct=p.direction==='less'?Math.min(...values):Math.max(...values);return{kind:'number',correct,options:values,prompt:p.direction==='less'?'더 적은 수를 골라 볼까요?':'더 많은 수를 골라 볼까요?',visual:{kind:'compare'}};}
 else throw new Error(`지원하지 않는 선택 활동: ${v}`);
 const options=shuffle([correct,...shuffle(Array.from({length:Math.max(correct+5,10)},(_,i)=>i).filter(n=>n!==correct),rng).slice(0,2)],rng);
 return {kind:'number',correct,options,prompt,visual};
}
export function create(def,seed){const rng=random(seed);const rounds=def.params.generator==='balanced-v1'?createLegacy(seed).rounds.map(r=>({kind:'shape',correct:r.target,options:r.choices,prompt:'같은 모양을 찾아볼까요?',pattern:null})):Array.from({length:def.roundCount},(_,i)=>question(def,i,rng));return{rounds,solved:Array(def.roundCount).fill(false)};}
export function act(data,event,def,round){if(event.type!=='choose'||!data.rounds[round].options.includes(event.value))return{data,notice:''};const q=data.rounds[round];if(q.correct!==event.value)return{data,notice:'천천히 살펴보고 다시 골라 볼까요?'};const solved=[...data.solved];solved[round]=true;return{data:{...data,solved},notice:'찾았어요. 작은 발견이 하나 더 생겼네요!'};}
export const done=(data,round)=>data.solved[round]===true;
export function validate(data,def,seed){return data&&same(data.rounds,create(def,seed).rounds)&&Array.isArray(data.solved)&&data.solved.length===def.roundCount&&data.solved.every(v=>typeof v==='boolean');}
