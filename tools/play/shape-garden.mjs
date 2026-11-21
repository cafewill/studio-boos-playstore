// 단독 콘텐츠 검사도 동일한 공통 브라우저 시나리오를 사용한다.
process.argv.push('--slug=shape-garden');
await import('./batch60.mjs');
