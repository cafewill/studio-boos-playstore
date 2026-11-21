import fs from 'node:fs';
import path from 'node:path';
import gplay from 'google-play-scraper';
const input = process.argv[2];
if (!input) throw new Error('사용: STORE_HTML_CACHE=/캐시 node --import ./tools/store/transport-hooks.mjs tools/store/import-details.mjs data/store/스냅샷.json');
const snapshot = JSON.parse(fs.readFileSync(input, 'utf8'));
let failures = 0;
let processed = 0;
const missingOnly = process.argv.includes('--missing-only');
const quiet = process.argv.includes('--quiet');
for (const row of snapshot.apps) {
  if (missingOnly && (row.detail || row.detailError)) continue;
  processed++;
  try {
    const a = await gplay.app({appId:row.appId,country:'kr',lang:'ko'});
    delete row.detailError;
    row.detail = {
      fetchedAt:new Date(fs.statSync(path.join(process.env.STORE_HTML_CACHE,`${row.appId}.html`)).mtimeMs).toISOString(),
      title:a.title??null,developer:a.developer??null,genre:a.genre??null,
      contentRating:a.contentRating??null,score:a.score??null,ratings:a.ratings??null,
      installs:a.installs??null,free:a.free??null,price:a.price??null,currency:a.currency??null,
      ads:a.adSupported??null,iap:a.offersIAP??null,iapRange:a.IAPRange??null,
      version:a.version??null,updated:a.updated?new Date(a.updated).toISOString():null,
      descriptionExcerpt:(a.description??'').slice(0,400),
      observation:'공식 상세 HTML의 표시·구조화 데이터; 직접 앱 실행 아님',
      declaredTargetAge:null,offlineSupport:null,teacherApproved:null
    };
    if (!a.title) throw new Error('제목 누락: 파싱 구조 확인 필요');
  } catch(e) { failures++; row.detailError=e.message; }
}
snapshot.detailImportAt = new Date().toISOString();
fs.writeFileSync(input,JSON.stringify(snapshot,null,2)+'\n');
console.log(`이번 처리 ${processed}개, 성공 ${processed-failures}, 실패 ${failures}; 전체 상세 ${snapshot.apps.filter(a=>a.detail&&!a.detailError).length}/${snapshot.apps.length}`);
if (!quiet) for (const a of snapshot.apps) console.log(`${a.sourceRank}\t${a.title}\t${a.detail?.installs}\t광고:${a.detail?.ads}\t${a.detail?.descriptionExcerpt?.slice(0,130).replace(/\n/g,' ')||a.detailError}`);
if(failures) process.exitCode=1;
