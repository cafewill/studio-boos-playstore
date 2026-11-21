import {COLORS,integer} from '../core/utils.js';
export const create=()=>({strokes:[],color:'green',accepted:false});
export function act(data,event){
 if(event.type==='color'&&COLORS.some(c=>c.id===event.value))return{data:{...data,color:event.value}};
 if(event.type==='undo')return{data:{...data,strokes:data.strokes.slice(0,-1)}};
 if(event.type==='clear')return{data:{...data,strokes:[]}};
 if(event.type==='stroke'&&Array.isArray(event.points)&&event.points.length>0&&event.points.length<=100&&event.points.every(point=>Array.isArray(point)&&point.length===2&&point.every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1))&&data.strokes.length<160)return{data:{...data,strokes:[...data.strokes,{color:data.color,points:event.points}]}};
 if(event.type==='stamp'&&integer(event.cell,0,8)&&data.strokes.length<160){const x=(event.cell%3+.5)/3,y=(Math.floor(event.cell/3)+.5)/3;return{data:{...data,strokes:[...data.strokes,{color:data.color,points:[[x,y]],stamp:true}]}};}
 if(event.type==='finish')return data.strokes.length?{data:{...data,accepted:true},notice:'나만의 그림이 완성됐어요.'}:{data,notice:'선을 그리거나 점을 찍어 볼까요?'};
 return{data};
}
export const done=data=>data.accepted;
export function validate(data){return data&&typeof data.accepted==='boolean'&&COLORS.some(c=>c.id===data.color)&&Array.isArray(data.strokes)&&data.strokes.length<=160&&(!data.accepted||data.strokes.length>0)&&data.strokes.every(s=>COLORS.some(c=>c.id===s.color)&&(!('stamp'in s)||typeof s.stamp==='boolean')&&Array.isArray(s.points)&&s.points.length>0&&s.points.length<=100&&s.points.every(p=>Array.isArray(p)&&p.length===2&&p.every(n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=1)));}
