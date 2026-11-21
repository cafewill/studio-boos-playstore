export const ENGINE_NAMES=['choice','drawing','assembly','clock','sound','commands','feelings'];
export function validateDefinition(d){
 const fail=message=>{throw new Error(`콘텐츠 정의 오류: ${message}`)};
 if(!d||d.schemaVersion!==1||!Number.isInteger(d.definitionVersion)||d.definitionVersion<1)fail('버전');
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug??''))fail('슬러그');
 for(const key of ['title','objective','description','family'])if(typeof d[key]!=='string'||!d[key].trim()||d[key].length>500)fail(key);
 if(!ENGINE_NAMES.includes(d.engine)||!Number.isInteger(d.roundCount)||d.roundCount<1||d.roundCount>12)fail('엔진·문항 수');
 if(!Number.isInteger(d.ageMin)||!Number.isInteger(d.ageMax)||d.ageMin<3||d.ageMax>12||d.ageMax<d.ageMin)fail('연령 가설');
 const variants={choice:['shape','color','size','pattern','count','add','subtract','multiply','sequence','missing','compare'],drawing:['free'],assembly:['puzzle','creative'],clock:['analog'],sound:['notes'],commands:['path'],feelings:['reflect']};
 if(!variants[d.engine].includes(d.variant))fail('미등록 활동 유형');
 if(!d.params||typeof d.params!=='object'||Array.isArray(d.params))fail('설정');
 if(!/^#[0-9a-f]{6}$/i.test(d.accent??''))fail('강조색');
 if(d.engine==='choice'){
  if(!['shape','color','size','pattern','count','add','subtract','multiply','sequence','missing','compare'].includes(d.variant))fail('선택 유형');
  for(const key of ['min','max','secondMax','step'])if(key in d.params&&(!Number.isInteger(d.params[key])||d.params[key]<1||d.params[key]>30))fail(key);
  if(d.params.min>d.params.max)fail('수 범위');
 }
 if(d.params.generator!==undefined&&(d.params.generator!=='balanced-v1'||d.engine!=='choice'||d.variant!=='shape'||d.roundCount!==6))fail('과거 문항 생성 규약');
 if(d.engine==='drawing'&&!['leaf','cloud','flower','house','sky','forest','star','rainbow','waves','kite','garden','butterfly','fruit','dots','moon','snow','tree'].includes(d.params.template))fail('미등록 그림 가이드');
 if(d.engine==='assembly'&&d.variant==='puzzle'&&(!Array.isArray(d.params.targets)||d.params.targets.length!==d.roundCount||!d.params.targets.every(t=>Array.isArray(t)&&t.length===9&&t.every(p=>['blank','square','circle','triangle','leaf','flower'].includes(p)))))fail('조각 목표');
 if(d.engine==='feelings'&&(!Array.isArray(d.params.scenes)||d.params.scenes.length!==d.roundCount||!d.params.scenes.every(s=>typeof s.title==='string'&&typeof s.art==='string')))fail('감정 장면');
 return true;
}
