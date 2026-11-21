import {integer,selectionIndex} from '../core/utils.js';
export const create=def=>({patterns:Array.from({length:def.roundCount},()=>Array(12).fill(false)),cursors:Array(def.roundCount).fill(0),heard:Array.from({length:def.roundCount},()=>Array(4).fill(false)),finished:Array(def.roundCount).fill(false)});
export const notesAt=(data,def,round)=>def.params.tracks.filter((_,row)=>data.patterns[round][row*4+data.cursors[round]]).map(t=>t.note);
const enough=pattern=>pattern.filter(Boolean).length>=3&&[0,1,2].filter(row=>pattern.slice(row*4,row*4+4).some(Boolean)).length>=2;
export function act(data,event,def,round){
 if(event.type==='rhythm-toggle'){
  const index=selectionIndex(event.value,11);if(index===null)return{data};
  return{data:{...data,patterns:data.patterns.map((p,i)=>i===round?p.map((v,j)=>j===index?!v:v):p),heard:data.heard.map((h,i)=>i===round?Array(4).fill(false):h)},notice:'패턴을 바꿨어요. 네 박을 다시 한 칸씩 살펴봐요.'};
 }
 if(event.type==='beat'){
  const cursor=data.cursors[round];return{data:{...data,cursors:data.cursors.map((v,i)=>i===round?(v+1)%4:v),heard:data.heard.map((h,i)=>i===round?h.map((v,j)=>j===cursor?true:v):h)},notice:`${cursor+1}번째 박을 살펴봤어요. 다음은 ${(cursor+1)%4+1}번째 박이에요.`};
 }
 if(event.type==='finish'){
  if(!enough(data.patterns[round])||!data.heard[round].every(Boolean))return{data,notice:'두 줄 이상에 세 칸 이상 켜고, 네 박을 한 번씩 살펴봐요.'};
  const finished=[...data.finished];finished[round]=true;return{data:{...data,finished},notice:'소리와 쉼으로 나만의 네 박을 엮었어요.'};
 }
 return{data};
}
export const done=(data,round)=>data.finished[round]===true;
export function validate(data,def){
 return data&&Array.isArray(data.patterns)&&data.patterns.length===def.roundCount&&data.patterns.every(p=>Array.isArray(p)&&p.length===12&&p.every(v=>typeof v==='boolean'))&&Array.isArray(data.cursors)&&data.cursors.length===def.roundCount&&data.cursors.every(v=>integer(v,0,3))&&Array.isArray(data.heard)&&data.heard.length===def.roundCount&&data.heard.every(h=>Array.isArray(h)&&h.length===4&&h.every(v=>typeof v==='boolean'))&&Array.isArray(data.finished)&&data.finished.length===def.roundCount&&data.finished.every((v,i)=>typeof v==='boolean'&&(!v||(enough(data.patterns[i])&&data.heard[i].every(Boolean))));
}
