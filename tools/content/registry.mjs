import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export function loadRegistry(){
 const directory=path.join(ROOT,'data/implementation');const registry=JSON.parse(fs.readFileSync(path.join(directory,'registry.json'),'utf8'));
 if(registry.schemaVersion!==1||!Array.isArray(registry.batches)||!registry.batches.length||new Set(registry.batches).size!==registry.batches.length)throw new Error('구현 레지스트리 오류');
 const batches=registry.batches.map(name=>{if(!/^[a-z0-9-]+\.json$/.test(name))throw new Error('배치 파일명 오류');const batch=JSON.parse(fs.readFileSync(path.join(directory,name),'utf8'));if(!/^docs\/review\/[a-z0-9-]+\.md$/.test(batch.reviewDocument??'')||!/^docs\/plan\/[a-z0-9-]+\.md$/.test(batch.planDocument??'')||!Array.isArray(batch.items))throw new Error('배치 문서·항목 규약 오류');return {...batch,definitionFile:`data/implementation/${name}`};});
 return{batches,items:batches.flatMap(b=>b.items.map(i=>({...i,reviewDocument:b.reviewDocument,planDocument:b.planDocument,definitionSource:b.definitionFile})))};
}
