// PU-PAD 3D 트윈 목업 헤드리스 검증 — 9개 케이스를 시작 단계부터 끝까지 자동 재생하고 에러 코드 · 마지막 재고를 찍는다.
// 사용: node pupad-twin-smoke.js "C:\SVN\AutoMES\DOC\NVH_USA\PU_PAD\PU-PAD 3D 트윈 목업.html"
// 목업 HTML 안의 <script> 를 꺼내 캔버스 · DOM 을 흉내 낸 스텁 위에서 실행한다 (우리가 만든 목업 파일만 대상으로 쓸 것).
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.log('script 없음'); process.exit(1); }
const src = m[1].replace('playing=false,', 'playing=true,');   // 기본 멈춤 → 자동 재생
const noop = new Proxy(function () {}, { get: (t, k) => k === 'measureText' ? () => ({ width: 50 }) : k === 'createRadialGradient' ? () => ({ addColorStop() {} }) : noop, set: () => true, apply: () => noop });
const els = {};
function el(id) { return els[id] || (els[id] = { id, textContent: '', innerHTML: '', style: {}, clientWidth: 1200, getContext: () => noop, getBoundingClientRect: () => ({ left: 0, top: 150, width: 100, bottom: 50, right: 100 }), onclick: null }); }
global.document = { getElementById: el };
global.window = { innerHeight: 950, scrollY: 0, devicePixelRatio: 1, addEventListener() {} };
let t = 0, frames = 0, ci = 0, errs = new Set();
global.performance = { now: () => t };
const strip = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
global.requestAnimationFrame = f => {
  frames++;
  const h = els.side ? els.side.innerHTML : '';
  const n = h.match(/<span class="n">(\d+) \/ (\d+)<\/span>/);
  const e = h.match(/⛔ (PP\d+)|⚠ (PP\d+)/);
  if (e && n) errs.add(n[1] + ':' + (e[1] || e[2]));
  if (n && n[1] === n[2] && /✓ 성공/.test(h)) {
    const inv = strip(h).match(/④ 창고 재고(.*?)⑤/);
    console.log('케이스', ci + 1, '단계', n[2], '| 에러', [...errs].join(' ') || '-', '\n   재고:', inv ? inv[1].replace(/ \S+ \S+ —/g, '').trim() : '?');
    errs = new Set(); ci++;
    const cases = (src.match(/\{id:'TC\d+'/g) || []).length;
    if (ci >= cases) return;
    els.sCase.onchange.call({ value: String(ci) });
  }
  if (frames > 900000) { console.log('TIMEOUT 케이스', ci + 1, strip(h).slice(0, 400)); return; }
  t += 33; setImmediate(() => f(t));
};
eval(src);
