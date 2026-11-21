import {integer} from '../core/utils.js';
export const create=()=>({played:[],accepted:false});
export function act(data,event){
 if(event.type==='play'&&integer(event.value,0,4))return{data:{...data,played:[...new Set([...data.played,event.value])]},notice:'소리의 높이를 하나 살펴봤어요.'};
 if(event.type==='finish')return data.played.length>=3?{data:{...data,accepted:true},notice:'나만의 작은 소리 산책을 마쳤어요.'}:{data,notice:'소리 버튼 세 개를 천천히 살펴볼까요? 소리가 꺼져 있어도 괜찮아요.'};
 return{data};
}
export const done=d=>d.accepted;
export const validate=d=>d&&typeof d.accepted==='boolean'&&Array.isArray(d.played)&&d.played.length<=5&&new Set(d.played).size===d.played.length&&d.played.every(n=>integer(n,0,4))&&(!d.accepted||d.played.length>=3);
