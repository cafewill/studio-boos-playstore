작성일: 2026년 11월 21일
작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano

# 🗺 프로젝트 빠른 참고

## 📖 개요

`studio-boos-playstore`는 Google Play 스토어에서 발견한 아동용 콘텐츠의 놀이·학습 경험을 자체 콘텐츠로 재구현한다. 참고 프로젝트는 `../studio-game-playstore`이며 이 작업에서 변경하지 않는다. TOP 100에서 고유 앱 322개로 확장 조사했고(적합 후보 60개), 적합 후보 60개를 공통 셸·7개 엔진의 MVP 정의로 구성했다. 문항·그림·테마 변형을 포함하며 고유 메커닉 60개나 최종 완료 60개를 뜻하지 않는다. Git 기준 브랜치는 `main`이며 현재 후속 작업은 feature 브랜치에서 진행한다.

## 🧩 주요 내용

### 🗂 경로와 책임

| 경로 | 역할·상태 |
|---|---|
| `AGENTS.md` | 협업·변경·커밋 규칙 |
| `README.md` | 프로젝트 소개와 문서 미리보기 |
| `docs/guide/` | 조사·구현·아동 UX 기준과 템플릿 |
| `docs/review/` | 참고 프로젝트 검토와 향후 원작 분석 |
| `docs/plan/` | 초기 계획과 향후 콘텐츠별 구현 계획 |
| `docs/tools/md_to_html.py` | 참고 프로젝트에서 재사용한 표준 라이브러리 기반 변환기 |
| `contents/{slug}/` | 생성된 콘텐츠 정의·진입·설명 60개, 모두 브라우저 검증 대기 |
| `contents/catalog.js` | 배치 정의에서 생성한 사용자 목록 |
| `contents/shared/` | 공통 모델·저장·UI·7개 엔진·토큰 |
| `data/implementation/registry.json` | 활성 배치 등록, 현재 batch60.json |
| `tools/content/` | 생성·정의 계약·구조·문서 검사 |
| `tools/logic/`, `tools/play/` | 규칙 검증·브라우저 검증 도구 |
| `test/` | 실제 검증 결과를 생성할 때 사용 |

### 🔗 문서 색인

| 문서 | 내용·현행화 시점 |
|---|---|
| [가이드 목차](docs/guide/guide.md) | 가이드 추가·변경 |
| [조사·리뷰](docs/guide/guide-content-review.md) | Google Play 스토어 조사 항목·선정·리뷰 템플릿 변경 |
| [저작권·지식재산권](docs/guide/guide-intellectual-property.md) | 독립 재구현·권리 근거·에셋·상표·공개 전 검토 |
| [Fascinating UI](docs/guide/guide-ui-design.md) | 커스텀 컴포넌트·반응형·접근성·발견 경험 변경 |
| [공통 구조·유지보수](docs/guide/guide-content-architecture.md) | 정본·생성·상태·입력·저장·버전·영향 검사·CI |
| [구현·검증](docs/guide/guide-content-build.md) | 스택·구조·실행·완료 기준 변경 |
| [아동 UX·안전](docs/guide/guide-child-safety.md) | 연령·정서·컬러 컨셉·용어·네이밍·학습·데이터·보호자 기준 변경 |
| [확장 조사 검증](test/20261121140110-expanded-candidates-check.md) | 출처·중복·기존 판정·상세·CSV/JSON/보고서 정합성 |
| [확장 322개 조사](docs/review/20261121135057-expanded-candidates-review.md) | 적합 60·조건부 178·보류 57·제외 27, 신규 적합 44개 |
| [TOP 100 조사](docs/review/20261121121009-play-top100-review.md) | 국가·수집 범위·100개 분류·근거 |
| [60개 구조·회귀 검증](test/20261121143857-batch60-architecture-check.md) | 실제 실행·통과·브라우저/기기 미실행 범위 |
| [60개 배치 계획](docs/plan/20261121140822-batch60-plan.md) | 현재 구현 정본·상태·공통 계약·영향 검사 |
| [60개 배치 리뷰](docs/review/20261121140822-batch60-review.md) | 후보별 원작·자체 목표·엔진·권리 경계 |
| [TOP 100 로드맵](docs/plan/20261121121009-play-top100-roadmap-plan.md) | 구현 순서·상태 |
| [모양 정원 리뷰](docs/review/20261121121009-shape-garden-review.md) | 첫 활동의 추상 요구·권리 경계 |
| [모양 정원 계획](docs/plan/20261121121009-shape-garden-plan.md) | 구현·검증 기준 |
| [모양 정원 README](contents/shape-garden/README.md) | 조작·출처·권리 기록 |
| [이번 검증 기록](test/20261121122929-top100-shape-garden-check.md) | 데이터·로직·정적 검증·미실행 항목 |
| [조사 도구](tools/store/README.md) | 수집·파싱·CSV·스냅샷 재현 |
| [계획 목차](docs/plan/plan.md) | 계획 추가·상태 변경 |
| [초기 계획](docs/plan/20261121114958-foundation-plan.md) | 초기 구성과 다음 작업 |
| [리뷰 목차](docs/review/review.md) | 리뷰 추가·상태 변경 |
| [참고 프로젝트 검토](docs/review/20261121114958-reference-project-review.md) | 참조 구조·채택·수정 근거 |

### 🔍 조사 현황

| 항목 | 초기 조사 | 확장 조사 |
|---|---|---|
| 고유 앱 | 100개 | 322개(신규 222개) |
| 적합 후보 | 16개 | 60개(신규 44개) |
| 조건부·보류·제외 | 54·20·10개 | 178·57·27개 |
| 상세 파싱·미확인 | 96·4개 | 307·15개 |

FAMILY·학습 게임의 무료·유료·최고 매출 6차트를 요청해 5개 유효 응답, 노출 428건에서 중복 106건을 제거했다. 이를 공식 통합 TOP 322 순위로 표시하지 않는다. 적합 앱 60개는 9개 상위 활동 유형이다. 현재 60개 후보별 MVP 정의·7개 엔진으로 구성했고 초기 12개 구상과 합산하지 않는다.

### 🧩 콘텐츠 현황

| 집계 | 현재 상태 |
|---|---|
| 후보 매핑·MVP 정의 | 60개, 모두 공통 구조 사용 |
| 공통 엔진 | 7개 (선택·그리기·조립·명령·소리·시계·감정) |
| 정적·계약·로직 | 60개 전체 통과, 1,200세션·4,520문항/작업 |
| 브라우저·실제 기기 | 60개 대기, 현재 환경의 서버 포트 제한 |
| 최종 검증 완료 | 0개 |

전체 자체 이름·슬러그·출처·목표·엔진은 배치 리뷰와 레지스트리 정본을 따른다. 모양 정원은 공통 구조로 이관했고 v1 진행·문항·소리 설정 호환을 검증했다. 후보 수·같은 엔진의 설정 변형·고유 상호작용·최종 완료를 분리한다.

### 🔄 작업·기록 기준

- 조사 → 리뷰 → 계획 → 구현 → 실제 입력·규칙·안전 검증 → 로컬 리뷰 순으로 진행한다.
- 모든 단계에서 정서 함양과 발달에 적합한 컬러 컨셉·용어·네이밍을 필수 검토한다. 팔레트·자체 이름·주요 피드백 문구와 선정 이유를 기록하며, 상세 기준은 [아동 UX·안전](docs/guide/guide-child-safety.md)을 따른다.
- 사용자 화면은 간결한 커스텀·반응형 UI를 기본으로 한다. Fascinating은 절제된 놀라움과 호기심을 이끄는 작은 발견 경험이며, [UI 가이드](docs/guide/guide-ui-design.md)의 컴포넌트·접근성·검증 기준을 적용한다.
- 콘텐츠 상태: `후보 → 리뷰 완료 → 계획 완료 → 구현 중 → 검증 중 → 리뷰 대기 → 리뷰 완료`. 현재 60개 MVP 정의는 `검증 중`이다.
- 리뷰: `docs/review/{TS}-{slug}-review.md`, 계획: `docs/plan/{TS}-{slug}-plan.md`.
- 검증: `test/{TS}-{slug}-check.md` 및 같은 접두사의 스크린샷·로그. `{TS}`는 KST 생성 시각이다.
- 이슈: `docs/issue/{TS}-{issue-key}.md`. 디렉터리 신설 시 같은 이름의 목차를 추가한다.
- 자체 슬러그는 `^[a-z0-9]+(-[a-z0-9]+)*$`. 원작 상표를 사용하지 않는다.
- 새 콘텐츠를 등록하면 이 문서에 연령·유형·상태·리뷰·계획·검증 링크 표를 추가한다. 사용자 포털에는 개발 상태·문서 링크를 노출하지 않는다.

### ✅ 실행 및 문서 관리

```bash
python3 docs/tools/md_to_html.py --all
python3 -m http.server 7904 --bind 127.0.0.1
```

`npm start`와 `npm run dev`는 위와 동일한 Python 기본 서버를 실행한다. macOS의 `start-local.command`도 같은 명령을 실행한다. 서버가 시작되면 표시된 주소로 브라우저에서 접속한다.

참고 프로젝트 README의 서버 방식과 동일함을 확인했다. 현재 Codex 실행 환경에서는 일반 실행·TTY·npm start 모두 socket.bind에서 Operation not permitted로 실패했으며, 서버 구동 성공이나 로컬 접속 완료로 표시하지 않는다.

사용자 진입은 `http://127.0.0.1:7904/` → `/contents/`이며, 첫 활동은 `/contents/shape-garden/`이다. 가이드 진입은 `/docs/guide/guide.html`이다. 전체 검사 진입점은 `node tools/check-all.mjs`이며 루트 `npm run check`도 같은 검사를 실행한다.

로직 검증: `node tools/logic/batch60.mjs`. 브라우저 검증: 서버 실행 후 `node tools/play/batch60.mjs --representatives`와 `node tools/play/batch60.mjs`. 현재 환경에서는 서버 포트 열기가 차단되어 브라우저 검증은 미실행이다.

`docs/`의 MD와 같은 이름의 HTML을 함께 관리한다. 루트 MD는 변환 대상이 아니다. 문서 변경 시 디렉터리 목차와 이 색인을 갱신한다. 자동 생성기는 헤더·표·목록·코드펜스 등 제한된 문법을 지원한다.

### 🎨 문서 보기 설정 표준

상속한 변환기는 sticky 헤더와 목차, PDF 인쇄, 보기 설정을 제공한다. 주간·야간은 OS 설정을 기본으로 하고 기본 그린·봄·여름·가을·겨울 5종 스킨과 글자 크기 12–20px를 제공한다. `boos-guide-theme`, `boos-guide-skin`, `boos-guide-font` 키에 저장하고 저장소 접근 실패 시 기본값으로 표시한다. Escape로 설정을 닫고 트리거로 포커스를 복원한다. 표는 가로 스크롤, 좁은 화면은 목차·헤더 재배치, 인쇄는 조작 UI 숨김을 유지한다. 변경 시 변환기와 이 기준 및 전체 생성 HTML을 함께 갱신한다.

## 📌 요약 정보

| 항목 | 기준 |
|---|---|
| REPO / TOOL | `studio-boos-playstore` / `boos` |
| BASE_BRANCH | `main` |
| 현재 실행 | 사용자 포털·후보별 MVP 정의 60개·문서, 포트 `7904` |
| 다음 작업 | 7개 엔진 대표·전체 60개 브라우저 검증, 실제 Android·아동 관찰 |
| 원격 저장소 | `https://github.com/cafewill/studio-boos-playstore.git` |
| 초기 Git 구성 | 최초 커밋 `fd1e664` 푸시 완료, 이번 작업은 미커밋 |
| 외부 배포 | 미수행 |

---

🙏 감사합니다!
