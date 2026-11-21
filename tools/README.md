작성일: 2026년 11월 21일
작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano

# 🧰 조사·검증 도구

## 📖 개요

스토어 조사와 자체 활동 검증을 구분한다. 실제 검증 상태는 GLANCE와 test 기록을 따른다.

## 🧩 주요 내용

| 도구 | 용도·실행 |
|---|---|
| [store](store/README.md) | Google Play TOP 100 수집·상세 파싱·수동 분류 |
| `logic/shape-garden.mjs` | `node tools/logic/shape-garden.mjs`: 이전 v1 규칙·저장 호환 회귀 검사 |
| `play/shape-garden.mjs` | 공통 배치 시나리오의 모양 정원 단독 실행, 현재 미실행 |
| `lib/browser.mjs` | 임시 Chrome 프로필·CDP·클릭·터치·로그·요청 수집 |

브라우저 도구는 기본 포트 `7904`를 사용한다. `ORIGIN`으로 로컬 서버 주소, `CHROME`으로 브라우저 실행 파일을 지정할 수 있다. 소유한 Chrome 프로세스·임시 프로필은 종료 시 정리한다. `node_modules`·임시 상세 HTML·인증정보를 커밋하지 않는다.

## 🧱 공통 구조 검사

등록 배치는 `data/implementation/registry.json`, 현재 정의는 `batch60.json`이 정본이다. `node tools/content/generate.mjs`로 생성하고 `node tools/check-all.mjs`로 구조·로직·데이터·문서 전체를 검사한다. 콘텐츠 개수는 레지스트리에서 계산한다.

브라우저 검증은 서버·Chrome 사용 가능 환경에서 `node tools/play/batch60.mjs --representatives` 후 `node tools/play/batch60.mjs`로 진행한다. 기존 `tools/play/shape-garden.mjs`도 공통 시나리오를 호출한다. GitHub Actions에는 정적·계약·로직 검사를 구성했으며 원격 실행 결과는 아직 없다.


## 📌 요약 정보

로직 검증 통과가 브라우저·실제 기기·아동 관찰·법적 검토 완료를 뜻하지 않는다.

---

🙏 감사합니다!
