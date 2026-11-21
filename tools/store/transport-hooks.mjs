// google-play-scraper 10.0.1의 요청 모듈만 오프라인 캐시 어댑터로 연결한다.
import { registerHooks } from 'node:module';
const adapter = new URL('./cached-request.mjs', import.meta.url).href;
registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.endsWith('/utils/request.js') && context.parentURL?.includes('/google-play-scraper/')) {
    return { url: adapter, shortCircuit: true };
  }
  if (specifier === './request.js' && context.parentURL?.includes('/google-play-scraper/lib/utils/')) {
    return { url: adapter, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}});
