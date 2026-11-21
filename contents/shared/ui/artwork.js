import {expansionArtwork} from './expansion-artwork.js';
import {escape,glyph} from './graphics.js';
// 직접 작성한 선 그림. 미술 카드와 실제 그리기 안내선이 같은 정본을 쓴다.
export const DRAWING_PATHS=Object.freeze({
 leaf:['M170 175C65 122 84 38 243 43C259 135 220 175 170 175Z','M124 146 218 69M155 119l-9-34M181 96l30 5'],
 cloud:['M76 145C40 142 43 96 82 93C88 40 157 37 177 79C223 44 273 82 254 111C295 112 288 151 255 151H76Z'],
 flower:['M170 115V189M170 156Q113 120 128 157Q147 179 170 175M170 149Q224 115 214 151Q190 174 170 167','M170 111C111 140 103 81 140 76C107 26 168 13 175 60C217 18 248 75 202 87C253 123 199 151 177 114Z'],
 house:['M89 180V98L170 38 251 98V180Z','M149 180V128H188V180M111 105H138V132H111ZM206 105H234V132H206Z'],
 sky:['M50 163Q80 130 112 161T177 159T244 159T303 159','M81 84C69 53 116 38 127 68C162 50 172 91 143 94H84ZM223 46 233 65 255 68 238 84 242 106 222 95 203 106 207 83 191 68 213 65Z'],
 forest:['M62 170 102 70 143 170ZM129 175 177 33 225 175ZM209 175 250 81 292 175Z','M102 171V194M177 176V199M250 176V195'],
 star:['M170 29 190 87 253 88 204 126 224 186 170 150 117 186 135 126 87 88 150 87Z','M47 67v24M35 79h24M285 139v24M273 151h24'],
 rainbow:['M47 173C47 10 293 10 293 173','M77 173C77 49 263 49 263 173','M107 173C107 89 233 89 233 173','M137 173C137 129 203 129 203 173'],
 waves:['M35 68Q68 27 101 68T167 68T233 68T299 68','M35 112Q68 71 101 112T167 112T233 112T299 112','M35 157Q68 116 101 157T167 157T233 157'],
 kite:['M170 27 230 92 170 154 110 92Z','M170 27V154M110 92H230M170 154Q130 178 171 188Q203 197 177 211'],
 garden:['M79 183V94M168 183V73M258 183V113','M79 94C31 99 46 44 79 61C113 37 131 96 79 94ZM168 73C121 79 134 22 168 39C204 17 218 78 168 73ZM258 113C213 119 223 65 258 78C291 52 308 117 258 113Z','M40 191Q170 165 304 192'],
 butterfly:['M169 79C75 0 52 79 110 113C31 178 129 220 169 136C207 222 307 174 228 113C289 75 263 0 169 79Z','M169 72V151M169 77 150 48M169 77 189 48'],
 fruit:['M123 84C58 45 44 150 99 179C122 191 132 177 146 183C200 161 196 67 143 83Z','M132 86Q124 44 153 31M141 54Q188 21 189 55Q172 73 141 54ZM220 80C181 84 181 118 219 117C181 117 183 154 220 154C252 156 268 121 245 104C271 84 251 66 220 80Z'],
 dots:['M57 68a10 10 0 1 0 20 0a10 10 0 1 0-20 0M125 115a14 14 0 1 0 28 0a14 14 0 1 0-28 0M208 62a11 11 0 1 0 22 0a11 11 0 1 0-22 0M244 152a16 16 0 1 0 32 0a16 16 0 1 0-32 0M77 169a8 8 0 1 0 16 0a8 8 0 1 0-16 0'],
 moon:['M204 37C122 24 87 142 167 175C204 190 245 169 259 140C197 172 146 98 204 37Z','M74 52 81 66 96 68 84 79 87 94 74 87 61 94 64 79 53 68 68 66Z'],
 snow:['M170 28V192M99 69 241 151M99 151 241 69','M151 46 170 65 189 46M151 174 170 155 189 174M109 92 135 90 135 65M205 155 205 130 231 128M110 128 135 130 136 155M205 65 205 90 231 92'],
 tree:['M155 190V133H184V190Z','M113 133C44 130 74 67 109 73C95 12 181 12 187 56C253 21 288 108 236 117C255 158 192 167 177 135C157 161 126 154 113 133Z']
});
const text=(x,y,value,size=24)=>`<text x="${x}" y="${y}" text-anchor="middle" font-size="${size}" fill="#294d43" font-family="system-ui,sans-serif">${escape(value)}</text>`;
const card=(x,y,w,h,fill='#fffaf0')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${fill}"/>`;
export function activityArtwork(def){
 if(['recipe','rhythm','discovery','animation'].includes(def.engine))return expansionArtwork(def);
 const p=def.params,e=def.engine,v=def.variant,presentation=def.presentation??{symbol:'',detail:def.objective??''};
 let art='';
 if(e==='drawing')art=`${card(40,15,260,190)}<g fill="none" stroke="#638ba4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${DRAWING_PATHS[p.template].map(d=>`<path d="${d}"/>`).join('')}</g><path d="m265 180 27-80 10 4-27 80-12 10Z" fill="#bd7956"/>`;
 if(e==='words')art=`${card(35,25,125,165,'#fdf7e7')}${card(179,50,130,115,'#dce9e7')}${text(97,125,p.cards[0].symbol,65)}${text(244,115,p.cards[0].word,27)}${p.cards[0].hint?text(244,145,p.cards[0].hint,16):''}${text(170,197,p.cards.slice(1).map(c=>c.word).join(' · '),16)}`;
 if(e==='routine')art=`<path d="M62 146H170V85H280" fill="none" stroke="#c1d3bd" stroke-width="18" stroke-linejoin="round"/>${text(63,124,presentation.symbol,45)}${card(123,35,93,52)}${text(170,70,'차근차근',15)}${card(210,123,110,55)}${text(265,157,presentation.detail,16)}${text(170,207,p.steps[0].slice(0,20),14)}`;
 if(e==='scene'){
 const surfaces={room:'#dce7df',garden:'#c6dab5',table:'#e9d5b8',studio:'#e4ddeb'};
 art=`${card(30,25,280,175,surfaces[p.backdrop])}${p.props.map((prop,i)=>`${card(49+(i%2)*132,42+Math.floor(i/2)*73,110,61,'#fffaf0cc')}${text(103+(i%2)*132,88+Math.floor(i/2)*73,prop.symbol,38)}`).join('')}`;
 }
 if(e==='choice'){
  if(['count','add','subtract','multiply','compare','sequence','missing'].includes(v)){
   const a=p.min??1,b=Math.min(p.secondMax??2,3);
   const value={count:String(a),add:`${a} + ${b}`,subtract:`${a} − ${Math.min(a,b)}`,multiply:`${a} × ${b}`,compare:p.direction==='less'?'작은 수 찾기':'큰 수 찾기',sequence:`${a} · ${a+(p.step??1)} · ?`,missing:`${a} + ? = ${a+b}`}[v];
   art=`${card(42,32,256,117)}${text(170,111,value,v==='compare'?29:44)}${text(170,184,presentation.detail,19)}`;
   if(v==='count')art+=Array.from({length:Math.min(a,10)},(_,i)=>`<circle cx="${100+(i%5)*35}" cy="${134+Math.floor(i/5)*19}" r="6" fill="#719f87"/>`).join('');
  }else{
   const types=v==='pattern'?['circle','triangle','circle']:['circle','square','triangle'];
   art=types.map((t,i)=>`<g transform="translate(${40+i*94} 53) scale(.7)">${glyph(t,v==='color'?['#477a53','#456f99','#b86335'][i]:'#6c91a6').replace('<svg viewBox="0 0 100 100"','<svg width="100" height="100" viewBox="0 0 100 100"')}</g>`).join('')+text(170,185,presentation.detail,19);
  }
 }
 if(e==='assembly'){
  art=`${card(55,20,230,180,'#faf5e8')}`;
  const pieces=v==='puzzle'?p.targets[0]:['square','triangle','circle','circle','square','leaf','blank','square','circle'];
  art+=pieces.map((piece,i)=>`<g transform="translate(${91+(i%3)*58} ${29+Math.floor(i/3)*54})">${glyph(piece,['#739c89','#dcb36e','#8da3c6'][i%3]).replace('<svg viewBox="0 0 100 100"','<svg width="47" height="47" viewBox="0 0 100 100"')}</g>`).join('');
 }
 if(e==='clock')art=`<circle cx="170" cy="108" r="80" fill="#fff9e5" stroke="#dfb966" stroke-width="9"/>${[12,3,6,9].map((n,i)=>text([170,232,170,108][i],[54,115,174,115][i],n,21)).join('')}<path d="M170 61V108l41 26" stroke="#507664" stroke-width="7" fill="none" stroke-linecap="round"/>`;
 if(e==='commands')art=`<path d="M48 165H125V107H212V51H292" stroke="#b1c8a2" fill="none" stroke-width="26" stroke-linejoin="round"/>${text(52,177,'출발',17)}${text(289,58,'도착',17)}${text(170,211,'위 · 아래 · 왼쪽 · 오른쪽',17)}`;
 if(e==='sound')art=[0,1,2,3,4].map((i)=>`${card(47+i*51,60-i*6,41,115+i*6,['#ba8e72','#dab86d','#8aaf90','#86a6c1','#a999be'][i])}${text(68+i*51,158,['도','레','미','솔','라'][i],17)}`).join('')+text(170,208,p.timbre==='sine'?'부드러운 울림':'서로 다른 높이',17);
 if(e==='feelings')art=['기쁨','차분함','설렘'].map((value,i)=>`${card(34+i*100,54,86,104,['#edd29b','#c6dfd0','#ddc8de'][i])}${text(77+i*100,103,['◡','−','◡'][i],38)}${text(77+i*100,140,value,17)}`).join('');
 return `<svg viewBox="0 0 340 220" aria-hidden="true">${art}</svg>`;
}
