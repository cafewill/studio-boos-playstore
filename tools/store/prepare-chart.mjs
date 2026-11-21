// pinned google-play-scraper 10.0.1의 카테고리별 요청 본문을 준비한다.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const [destination, category = 'FAMILY', collection = 'topselling_free', rawCount = '100'] = process.argv.slice(2);
const num = Number(rawCount);
if (!['FAMILY','GAME_EDUCATIONAL','EDUCATION'].includes(category) || !['topselling_free','topselling_paid','topgrossing'].includes(collection) || !Number.isInteger(num) || num < 1 || num > 500) throw new Error('지원 카테고리·차트 및 개수(1–500)를 확인하세요');
if (!destination) throw new Error('사용: node tools/store/prepare-chart.mjs 출력파일 [FAMILY|GAME_EDUCATIONAL|EDUCATION] [topselling_free|topselling_paid|topgrossing] [개수]');
const source = fs.readFileSync(fileURLToPath(new URL('./node_modules/google-play-scraper/lib/list.js', import.meta.url)), 'utf8');
const start = source.indexOf('function getBodyForRequests');
const end = source.indexOf('\nfunction list');
if (start < 0 || end <= start) throw new Error('의존성 요청 구조 변경: 고정 버전을 확인하세요');
// 패키지의 고정된 로컬 소스만 사용한다. 원격 데이터나 사용자의 문자열을 실행하지 않는다.
const buildBody = new Function(source.slice(start, end) + '\nreturn getBodyForRequests;')();
fs.writeFileSync(destination, buildBody({num,collection,category}));
console.log(`요청 본문 저장: ${destination}`);
