// 이전 공개 API의 회귀 검사 전용. 신규 셸은 createStore(v2)를 사용한다.
export function createLegacyStore(slug,restore){
 const prefix=`${slug}:v1:`;
 const read=key=>{try{return localStorage.getItem(prefix+key);}catch{return null;}};
 const write=(key,value)=>{try{localStorage.setItem(prefix+key,value);return true;}catch{return false;}};
 return{read,write,load:()=>restore(read('session')),save:state=>write('session',JSON.stringify(state)),clear:()=>{try{['session','sound'].forEach(key=>localStorage.removeItem(prefix+key));return true;}catch{return false;}}};
}
