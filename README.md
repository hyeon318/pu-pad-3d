# PU-PAD 3D 공장 트윈 (협의용 목업)

NVH USA PU-PAD 라인(입고 → 불출 → 리와인딩 → 숙성 → 커팅 · 포장 → 출하)을 아이소메트릭 3D 화면에서 보여주는 협의용 목업.
LOT · 창고 · 바코드 · I/F 흐름과 에러 케이스(TC01~TC09)를 단계별로 재생한다.

- 화면: `index.html` (단일 파일, 외부 라이브러리 없음 · Canvas 2D)
- 검증: `node tools/pupad-twin-smoke.js index.html` → 9개 케이스 단계 수 · 에러 코드 · 마지막 재고 출력
- 모든 I/F는 가상 시뮬레이션이며 실제 시스템에 송신하지 않는다.
