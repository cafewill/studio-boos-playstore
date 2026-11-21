작성일: 2026년 11월 21일
작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano

# 🗺 프로젝트 빠른 참고

## 📖 개요

`studio-boos-playstore`는 Google Play 스토어에서 발견한 아동용 콘텐츠의 놀이·학습 경험을 자체 콘텐츠로 재구현한다. 참고 프로젝트는 `../studio-game-playstore`이며 이 작업에서 변경하지 않는다. 현재는 문서 기반 초기 구성, Git 초기화 완료(`main`), 구현 콘텐츠 0개다.

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
| `contents/{slug}/` | 향후 독립 콘텐츠, 아직 없음 |
| `contents/catalog.js` | 향후 포털 목록, 아직 없음 |
| `tools/logic/`, `tools/play/` | 향후 규칙·브라우저 검증 도구, 아직 없음 |
| `test/` | 실제 검증 결과를 생성할 때 사용 |

### 🔗 문서 색인

| 문서 | 내용·현행화 시점 |
|---|---|
| [가이드 목차](docs/guide/guide.md) | 가이드 추가·변경 |
| [조사·리뷰](docs/guide/guide-content-review.md) | Google Play 스토어 조사 항목·선정·리뷰 템플릿 변경 |
| [Fascinating UI](docs/guide/guide-ui-design.md) | 커스텀 컴포넌트·반응형·접근성·발견 경험 변경 |
| [구현·검증](docs/guide/guide-content-build.md) | 스택·구조·실행·완료 기준 변경 |
| [아동 UX·안전](docs/guide/guide-child-safety.md) | 연령·정서·컬러 컨셉·용어·네이밍·학습·데이터·보호자 기준 변경 |
| [계획 목차](docs/plan/plan.md) | 계획 추가·상태 변경 |
| [초기 계획](docs/plan/20261121114958-foundation-plan.md) | 초기 구성과 다음 작업 |
| [리뷰 목차](docs/review/review.md) | 리뷰 추가·상태 변경 |
| [참고 프로젝트 검토](docs/review/20261121114958-reference-project-review.md) | 참조 구조·채택·수정 근거 |

### 🔄 작업·기록 기준

- 조사 → 리뷰 → 계획 → 구현 → 실제 입력·규칙·안전 검증 → 로컬 리뷰 순으로 진행한다.
- 모든 단계에서 정서 함양과 발달에 적합한 컬러 컨셉·용어·네이밍을 필수 검토한다. 팔레트·자체 이름·주요 피드백 문구와 선정 이유를 기록하며, 상세 기준은 [아동 UX·안전](docs/guide/guide-child-safety.md)을 따른다.
- 사용자 화면은 간결한 커스텀·반응형 UI를 기본으로 한다. Fascinating은 절제된 놀라움과 호기심을 이끄는 작은 발견 경험이며, [UI 가이드](docs/guide/guide-ui-design.md)의 컴포넌트·접근성·검증 기준을 적용한다.
- 콘텐츠 상태: `후보 → 리뷰 완료 → 계획 완료 → 구현 중 → 검증 중 → 리뷰 대기 → 리뷰 완료`. 현재 등록된 콘텐츠는 없다.
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

현재 진입 URL은 `http://127.0.0.1:7904/docs/guide/guide.html`이다. 루트 포털 자동 이동과 `tools/check-all.sh`는 아직 구현하지 않았다.

`docs/`의 MD와 같은 이름의 HTML을 함께 관리한다. 루트 MD는 변환 대상이 아니다. 문서 변경 시 디렉터리 목차와 이 색인을 갱신한다. 자동 생성기는 헤더·표·목록·코드펜스 등 제한된 문법을 지원한다.

### 🎨 문서 보기 설정 표준

상속한 변환기는 sticky 헤더와 목차, PDF 인쇄, 보기 설정을 제공한다. 주간·야간은 OS 설정을 기본으로 하고 기본 그린·봄·여름·가을·겨울 5종 스킨과 글자 크기 12–20px를 제공한다. `boos-guide-theme`, `boos-guide-skin`, `boos-guide-font` 키에 저장하고 저장소 접근 실패 시 기본값으로 표시한다. Escape로 설정을 닫고 트리거로 포커스를 복원한다. 표는 가로 스크롤, 좁은 화면은 목차·헤더 재배치, 인쇄는 조작 UI 숨김을 유지한다. 변경 시 변환기와 이 기준 및 전체 생성 HTML을 함께 갱신한다.

## 📌 요약 정보

| 항목 | 기준 |
|---|---|
| REPO / TOOL | `studio-boos-playstore` / `boos` |
| BASE_BRANCH | `main` |
| 현재 실행 | 문서 미리보기만 가능, 포트 `7904` |
| 다음 작업 | 대상 연령·유형에 맞는 Google Play 스토어 후보 조사 |
| 원격 저장소 | `https://github.com/cafewill/studio-boos-playstore.git` |
| 초기 Git 구성 | 오빠가 초기화·원격 설정 완료, 최초 커밋은 `main` 직접 진행 |
| 외부 배포 | 미수행 |

---

🙏 감사합니다!
