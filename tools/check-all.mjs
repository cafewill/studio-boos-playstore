import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const run=(cmd,args)=>execFileSync(cmd,args,{stdio:'inherit'});
run(process.execPath,['tools/content/check.mjs']);
run(process.execPath,['tools/logic/batch60.mjs']);
run(process.execPath,['tools/logic/expansion30.mjs']);
run(process.execPath,['tools/logic/shape-garden.mjs']);
run('python3',['tools/store/check-expanded.py']);
function walk(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(['node_modules','__pycache__','.git'].includes(ent.name))continue;const full=path.join(dir,ent.name);if(ent.isDirectory())walk(full);else if(/\.(?:mjs|js)$/.test(ent.name))execFileSync(process.execPath,['--check',full],{stdio:'pipe'});}}
walk('contents');walk('tools');
run('python3',['tools/content/check-docs.py']);
console.log('전체 구조·규칙·데이터·문법·문서 검사 통과. 브라우저·실제 기기 검증은 별도입니다.');
