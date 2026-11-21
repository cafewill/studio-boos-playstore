import {integer} from '../core/utils.js';
export const create=def=>({selected:'0',boards:Array.from({length:def.roundCount},()=>Array(6).fill(null)),finished:Array(def.roundCount).fill(false)});
export function act(data,event,def,round){
 if(event.type==='prop'&&typeof event.value==='string'&&def.params.props[Number(event.value)]&&String(Number(event.value))===event.value)return{data:{...data,selected:event.value}};
 if(event.type==='place'&&typeof event.value==='string'&&/^[0-5]$/.test(event.value)){const boards=data.boards.map((b,i)=>i===round?b.map((v,j)=>j===Number(event.value)?data.selected:v):b);return{data:{...data,boards},notice:'나만의 자리에 놓았어요.'};}
 if(event.type==='scene-clear')return{data:{...data,boards:data.boards.map((b,i)=>i===round?Array(6).fill(null):b)}};
 if(event.type==='finish'&&new Set(data.boards[round].filter(v=>v!==null)).size>=3){const finished=[...data.finished];finished[round]=true;return{data:{...data,finished},notice:'서로 다른 소품이 모여 나만의 장면이 되었어요.'};}
 return{data,notice:event.type==='finish'?'서로 다른 소품 세 가지 이상을 놓아 볼까요?':''};
}
export const done=(data,round)=>data.finished[round]===true;
export function validate(data,def){
 const valid=v=>typeof v==='string'&&/^[0-9]+$/.test(v)&&String(Number(v))===v&&integer(Number(v),0,def.params.props.length-1);
 return data&&valid(data.selected)&&Array.isArray(data.boards)&&data.boards.length===def.roundCount&&data.boards.every(b=>Array.isArray(b)&&b.length===6&&b.every(v=>v===null||valid(v)))&&Array.isArray(data.finished)&&data.finished.length===def.roundCount&&data.finished.every((v,i)=>typeof v==='boolean'&&(!v||new Set(data.boards[i].filter(x=>x!==null)).size>=3));
}
