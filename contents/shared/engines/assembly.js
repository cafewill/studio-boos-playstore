import {integer} from '../core/utils.js';
export const PARTS=['blank','square','circle','triangle','leaf','flower'];
export const create=def=>({boards:Array.from({length:def.roundCount},()=>Array(9).fill('blank')),selected:'square',accepted:Array(def.roundCount).fill(false)});
export function target(def,round){return def.params.targets?.[round%def.params.targets.length]??null;}
export function act(data,event,def,round){
 if(event.type==='part'&&PARTS.includes(event.value))return{data:{...data,selected:event.value}};
 if(event.type==='cell'&&integer(event.cell,0,8)){const boards=data.boards.map(b=>[...b]);boards[round][event.cell]=data.selected;return{data:{...data,boards}};}
 if(event.type==='clear'){const boards=data.boards.map(b=>[...b]);boards[round]=Array(9).fill('blank');return{data:{...data,boards}};}
 if(event.type==='finish'){
  const goal=target(def,round),board=data.boards[round];
  const success=goal?goal.every((v,i)=>board[i]===v):board.filter(v=>v!=='blank').length>=3;
  if(!success)return{data,notice:goal?'그림과 조각의 자리를 천천히 살펴봐요.':'조각을 세 개 이상 놓고 나만의 작품을 만들어 봐요.'};
  const accepted=[...data.accepted];accepted[round]=true;return{data:{...data,accepted},notice:'조각들이 모여 나만의 작품이 되었어요.'};
 }
 return{data};
}
export const done=(data,round)=>data.accepted[round];
export function validate(data,def){return data&&PARTS.includes(data.selected)&&Array.isArray(data.boards)&&data.boards.length===def.roundCount&&data.boards.every(b=>Array.isArray(b)&&b.length===9&&b.every(v=>PARTS.includes(v)))&&Array.isArray(data.accepted)&&data.accepted.length===def.roundCount&&data.accepted.every((v,i)=>typeof v==='boolean'&&(!v||(target(def,i)?target(def,i).every((p,j)=>data.boards[i][j]===p):data.boards[i].filter(p=>p!=='blank').length>=3)));}
