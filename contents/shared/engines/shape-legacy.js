export const SHAPES = ['circle', 'square', 'triangle'];
export const NAMES = { circle: '동그라미', square: '네모', triangle: '세모' };
export const TOTAL = 6;
function random(seed) {
  let value = seed >>> 0 || 1;
  return () => { value ^= value << 13; value ^= value >>> 17; value ^= value << 5; return (value >>> 0) / 4294967296; };
}
function shuffle(values, rng) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
export function create(seed = Date.now() >>> 0) {
  const rng = random(seed);
  return { version: 1, seed: seed >>> 0, round: 0, phase: 'playing', previous: null,
    rounds: shuffle([...SHAPES, ...SHAPES], rng).map(target => ({ target, choices: shuffle(SHAPES, rng), tones: shuffle(['mint','peach','sky'], rng) })) };
}
export function answer(state, shape) {
  if (state.phase !== 'playing' || !SHAPES.includes(shape)) return { state, result: 'ignored' };
  if (state.rounds[state.round].target !== shape) return { state, result: 'try-again' };
  return { state: { ...state, phase: 'feedback' }, result: 'correct' };
}
export function next(state) {
  if (state.phase !== 'feedback') return state;
  return state.round === TOTAL - 1 ? { ...state, phase: 'complete' } : { ...state, round: state.round + 1, phase: 'playing' };
}
export function pause(state) {
  return ['playing','feedback'].includes(state.phase) ? { ...state, previous: state.phase, phase: 'paused' } : state;
}
export function resume(state) {
  return state.phase === 'paused' ? { ...state, phase: state.previous, previous: null } : state;
}
export function flowers(state) {
  return state.phase === 'complete' ? TOTAL : state.round + ((state.phase === 'feedback' || (state.phase === 'paused' && state.previous === 'feedback')) ? 1 : 0);
}
export function restore(raw) {
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!value || value.version !== 1 || !Number.isInteger(value.seed) || value.seed < 0 || value.seed > 4294967295) return null;
    if (!Number.isInteger(value.round) || value.round < 0 || value.round >= TOTAL) return null;
    if (!['playing','feedback','paused','complete'].includes(value.phase)) return null;
    if (value.phase === 'paused' ? !['playing','feedback'].includes(value.previous) : value.previous !== null) return null;
    if (value.phase === 'complete' && value.round !== TOTAL - 1) return null;
    // 저장된 문항은 신뢰하지 않고 자체 생성 규칙과 일치하는지 확인한다.
    const fresh = create(value.seed);
    if (JSON.stringify(value.rounds) !== JSON.stringify(fresh.rounds)) return null;
    return { ...fresh, round: value.round, phase: value.phase, previous: value.previous };
  } catch { return null; }
}
