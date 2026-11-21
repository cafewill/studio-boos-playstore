import {escape} from './graphics.js';
const text=(x,y,label,size=24)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${size}" fill="#294b41">${escape(label)}</text>`;
export function dishArtwork(params,stack=params.recipe){
 const ingredients=stack.map(i=>params.ingredients[i]);let art='<ellipse cx="170" cy="192" rx="123" ry="13" fill="#c6d6d0"/>';
 const dish=params.dish;
 if(dish==='pizza'){
  art+='<circle cx="170" cy="105" r="86" fill="#dbbc87"/>';
  art+=ingredients.map((v,i)=>`<circle cx="170" cy="105" r="${75-i*13}" fill="${escape(v.color)}"/>${text(170+(i%2?40:-40),65+i*25,v.symbol,27)}`).join('');
 }else if(dish==='cone'){
  art+='<path d="m126 119 44 83 44-83Z" fill="#d1ad7a" stroke="#b48c61" stroke-width="3"/>';
  art+=ingredients.map((v,i)=>`<ellipse cx="170" cy="${148-i*27}" rx="${49-i*3}" ry="25" fill="${escape(v.color)}"/>${text(170,156-i*27,v.symbol,23)}`).join('');
 }else if(dish==='cup'){
  art+=ingredients.map((v,i)=>`<path d="M${114-i*3} ${169-i*26}h${112+i*6}l-4 23H${118-i*3}Z" fill="${escape(v.color)}"/>${text(170,187-i*26,v.symbol,22)}`).join('');
  art+='<path d="m99 46 17 149h108l17-149" fill="none" stroke="#7b9ba8" stroke-width="5" stroke-linejoin="round"/>';
 }else if(['cake','sandwich'].includes(dish)){
  art+=ingredients.map((v,i)=>`<rect x="${dish==='cake'?83:71}" y="${166-i*29}" width="${dish==='cake'?174:198}" height="27" rx="${dish==='cake'?7:12}" fill="${escape(v.color)}"/>${text(170,187-i*29,v.symbol,22)}`).join('');
 }else{
  art+='<ellipse cx="170" cy="123" rx="116" ry="55" fill="#f7eddb" stroke="#b4c4c5" stroke-width="5"/>';
  if(dish==='bowl')art+='<path d="M55 123Q72 198 170 195Q268 198 285 123" fill="#c5d9d5"/>';
  art+=ingredients.map((v,i)=>`<ellipse cx="${112+(i%2)*110}" cy="${85+Math.floor(i/2)*43}" rx="39" ry="23" fill="${escape(v.color)}"/>${text(112+(i%2)*110,94+Math.floor(i/2)*43,v.symbol,27)}`).join('');
 }
 return `<svg viewBox="0 0 340 220" aria-hidden="true">${art}</svg>`;
}
export function expansionArtwork(def){
 const p=def.params;
 if(def.engine==='recipe')return dishArtwork(p);
 let art='';
 if(def.engine==='rhythm'){
  art=p.tracks.map((track,row)=>`${text(51,67+row*52,track.label,13)}${[0,1,2,3].map(col=>`<rect x="${107+col*48}" y="${39+row*52}" width="38" height="38" rx="11" fill="${col===row?'#859cbd':'#fff7e8'}" stroke="#a9b6bd"/>`).join('')}`).join('')+text(201,211,'1    2    3    4',17);
 }else if(def.engine==='discovery'){
  art=p.tokens.map((t,i)=>`<circle cx="${66+i*105}" cy="75" r="39" fill="${escape(t.color)}"/>${text(66+i*105,86,t.symbol,34)}${text(66+i*105,137,t.label,16)}`).join('');
  art+=`<path d="M66 149Q170 193 277 149" fill="none" stroke="#8ea7a1" stroke-width="3"/>${text(170,208,p.results[0].label,18)}`;
 }else if(def.engine==='animation'){
  art=[0,1,2,3].map((i)=>`<rect x="${22+i*81}" y="36" width="69" height="130" rx="10" fill="#fff8ea" stroke="#a69eb6" stroke-width="3"/>${text(56+i*81,152-i*23,p.symbol,29)}${text(56+i*81,193,`${i+1}장면`,14)}`).join('');
 }
 return `<svg viewBox="0 0 340 220" aria-hidden="true">${art}</svg>`;
}
