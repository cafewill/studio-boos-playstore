import {create,restore} from './model.js';
import {restore as restoreLegacy} from '../engines/shape-legacy.js';
// 호환 변환은 이 경계에서만 수행한다. 콘텐츠별 UI에서 저장 버전을 분기하지 않는다.
export function migrateLegacy(raw,def){
 if(def.slug!=='shape-garden')return null;
 const old=restoreLegacy(raw);if(!old)return null;
 const fresh=create(def,old.seed);
 for(let i=0;i<old.round;i++)fresh.data.solved[i]=true;
 if(old.phase==='feedback'||old.phase==='complete'||(old.phase==='paused'&&old.previous==='feedback'))fresh.data.solved[old.round]=true;
 fresh.round=old.round;fresh.phase=old.phase;fresh.previous=old.previous;
 return restore(fresh,def);
}
export function createStore(def,backend=()=>globalThis.localStorage){
 const prefix=`${def.slug}:v2:`;
 const safeRead=key=>{try{const value=backend().getItem(key);return value&&value.length<=1000000?value:null;}catch{return null;}};
 const safeWrite=(key,value)=>{try{backend().setItem(key,value);return true;}catch{return false;}};
 return {
  load(){const current=restore(safeRead(prefix+'session'),def);if(current)return current;const migrated=migrateLegacy(safeRead(`${def.slug}:v1:session`),def);if(migrated)safeWrite(prefix+'session',JSON.stringify(migrated));return migrated;},
  save(state){return safeWrite(prefix+'session',JSON.stringify(state));},
  sound(){const current=safeRead(prefix+'sound');return current!==null?current==='on':def.slug==='shape-garden'&&safeRead('shape-garden:v1:sound')==='on';},
  setSound(on){return safeWrite(prefix+'sound',on?'on':'off');},
  clear(){try{const keys=[prefix+'session',prefix+'sound'];if(def.slug==='shape-garden')keys.push('shape-garden:v1:session','shape-garden:v1:sound');for(const key of keys)backend().removeItem(key);return true;}catch{return false;}}
 };
}
