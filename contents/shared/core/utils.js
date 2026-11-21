export function random(seed) {
  let value = seed >>> 0 || 1;
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296; };
}
export function shuffle(items, rng) {
  const result = [...items];
  for (let i=result.length-1;i>0;i--) { const j=Math.floor(rng()*(i+1)); [result[i],result[j]]=[result[j],result[i]]; }
  return result;
}
export const same = (a,b) => JSON.stringify(a)===JSON.stringify(b);
export const integer = (n,min,max) => Number.isInteger(n)&&n>=min&&n<=max;
export const SHAPES = ['circle','square','triangle'];
export const NAMES = {circle:'동그라미',square:'네모',triangle:'세모',leaf:'잎',flower:'꽃',blank:'빈칸'};
export const COLORS = [{id:'green',name:'초록',hex:'#477a53'},{id:'blue',name:'파랑',hex:'#456f99'},{id:'orange',name:'주황',hex:'#b86335'},{id:'purple',name:'보라',hex:'#83628e'},{id:'yellow',name:'노랑',hex:'#b39132'}];
