import * as choice from '../engines/choice.js';
import * as drawing from '../engines/drawing.js';
import * as assembly from '../engines/assembly.js';
import * as clock from '../engines/clock.js';
import * as sound from '../engines/sound.js';
import * as commands from '../engines/commands.js';
import * as feelings from '../engines/feelings.js';
import * as words from '../engines/words.js';
import * as routine from '../engines/routine.js';
import * as scene from '../engines/scene.js';
import {integer} from './utils.js';
export const ENGINE_VERSION=1;
export const ENGINES=Object.freeze({choice,drawing,assembly,clock,sound,commands,feelings,words,routine,scene});
export function create(def,seed=Date.now()>>>0){return{version:2,contentId:def.slug,definitionVersion:def.definitionVersion,engineVersion:ENGINE_VERSION,seed:seed>>>0,phase:'playing',previous:null,round:0,data:ENGINES[def.engine].create(def,seed>>>0)};}
export function dispatch(state,event,def){
 if(!event||typeof event.type!=='string'||state.contentId!==def.slug||state.definitionVersion!==def.definitionVersion||state.engineVersion!==ENGINE_VERSION)return{state};
 if(event.type==='pause')return{state:['playing','feedback'].includes(state.phase)?{...state,previous:state.phase,phase:'paused'}:state};
 if(event.type==='resume')return{state:state.phase==='paused'?{...state,phase:state.previous,previous:null}:state};
 if(event.type==='next')return{state:state.phase!=='feedback'?state:state.round+1>=def.roundCount?{...state,phase:'complete'}:{...state,round:state.round+1,phase:'playing'}};
 if(state.phase!=='playing')return{state};
 const result=ENGINES[def.engine].act(state.data,event,def,state.round);
 return{state:{...state,data:result.data,phase:ENGINES[def.engine].done(result.data,state.round)?'feedback':'playing'},notice:result.notice??''};
}
export function restore(raw,def){
 try{
  const s=typeof raw==='string'?JSON.parse(raw):raw;
  if(!s||s.version!==2||s.contentId!==def.slug||s.definitionVersion!==def.definitionVersion||s.engineVersion!==ENGINE_VERSION||!integer(s.seed,0,4294967295)||!integer(s.round,0,def.roundCount-1))return null;
  if(!['playing','feedback','paused','complete'].includes(s.phase)||(s.phase==='paused'?!['playing','feedback'].includes(s.previous):s.previous!==null))return null;
  const engine=ENGINES[def.engine];if(!engine.validate(s.data,def,s.seed))return null;
  const underlying=s.phase==='paused'?s.previous:s.phase;
  for(let i=0;i<s.round;i++)if(!engine.done(s.data,i))return null;
  for(let i=s.round+1;i<def.roundCount;i++)if(engine.done(s.data,i))return null;
  if((underlying==='feedback'||underlying==='complete')&&!engine.done(s.data,s.round))return null;
  if(underlying==='playing'&&engine.done(s.data,s.round))return null;
  if(underlying==='complete'&&s.round!==def.roundCount-1)return null;
  return{version:2,contentId:s.contentId,definitionVersion:s.definitionVersion,engineVersion:ENGINE_VERSION,seed:s.seed,phase:s.phase,previous:s.previous,round:s.round,data:s.data};
 }catch{return null;}
}
export const progress=(s,def)=>s.phase==='complete'?def.roundCount:s.round+(ENGINES[def.engine].done(s.data,s.round)?1:0);
