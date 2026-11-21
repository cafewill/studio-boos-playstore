export const FEELINGS=['기뻐요','속상해요','차분해요','설레요'];
export const create=def=>({selections:Array(def.roundCount).fill(null)});
export function act(data,event,def,round){if(event.type!=='feeling'||!FEELINGS.includes(event.value))return{data};const selections=[...data.selections];selections[round]=event.value;return{data:{...data,selections},notice:`${event.value}라고 느낄 수도 있어요. 서로 다른 마음도 괜찮아요.`};}
export const done=(d,r)=>d.selections[r]!==null;
export const validate=(d,def)=>d&&Array.isArray(d.selections)&&d.selections.length===def.roundCount&&d.selections.every(v=>v===null||FEELINGS.includes(v));
