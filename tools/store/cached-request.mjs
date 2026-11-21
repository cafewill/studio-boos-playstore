// 상세 페이지를 네트워크 요청 없이 파싱하기 위한 읽기 전용 어댑터.
import fs from 'node:fs/promises';
import path from 'node:path';
export default async function request(opts) {
  const id = new URL(String(opts.url)).searchParams.get('id');
  if (!id || !/^[a-zA-Z0-9_.]+$/.test(id)) throw new Error('앱 상세 URL만 지원합니다');
  if (!process.env.STORE_HTML_CACHE) throw new Error('STORE_HTML_CACHE를 지정하세요');
  return fs.readFile(path.join(process.env.STORE_HTML_CACHE, `${id}.html`), 'utf8');
}
