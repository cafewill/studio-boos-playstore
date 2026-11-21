작성일: 2026년 11월 21일
작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano

# 🧸 studio-boos-playstore

## 📖 개요

Google Play 스토어의 아이들용 게임·교육·창작·이야기 콘텐츠를 분석하고, 핵심 활동을 자체 이름과 에셋으로 재구현하는 로컬 스튜디오다. 프로젝트 디렉터리는 `studio-boos-playstore`이며 조사 대상은 **Google Play 스토어**다.

기본 결과물은 Android 스마트폰·태블릿 Chrome을 우선 고려한 독립 웹 콘텐츠다. Android 네이티브 앱이나 Google Play 스토어 출시는 후속 범위로 결정한다. 여기서 클론은 활동 구조와 메커닉의 재구현을 뜻한다. 모든 콘텐츠는 아이들의 정서 함양과 발달에 적합한 컬러 컨셉·용어·네이밍을 항상 고려하며, 안정감·존중·호기심·자율성을 지원하도록 구성한다.

사용자 화면은 간결하고 직관적인 커스텀·반응형 UI로 개발한다. “Fascinating”(페시네이팅)은 절제된 놀라움과 호기심을 이끄는 작은 발견 경험으로 해석하며, [UI 가이드](docs/guide/guide-ui-design.md)를 따른다.

모든 단계에서 [저작권·지식재산권 가이드](docs/guide/guide-intellectual-property.md)를 적용하고 원작 표현을 복제하지 않으며, 자체 제작 또는 사용 권한이 확인된 자료만 사용한다.

## 🧩 주요 내용

### 🔄 시작 순서

1. [AGENTS.md](AGENTS.md): AI 협업 규칙
2. [GLANCE.md](GLANCE.md): 현황·경로·문서 색인
3. [가이드 목차](docs/guide/guide.md): 조사·개발·아동 안전 기준
4. [초기 계획](docs/plan/20261121114958-foundation-plan.md): 다음 작업과 완료 기준

대한민국 차트 조사를 고유 앱 322개로 확장했고 적합 후보 60개를 [배치 계획](docs/plan/20261121140822-batch60-plan.md)에 따라 구성했다. 기존 60개에 조건부 후보를 좁은 독립 활동으로 제한한 40개를 추가해 현재는 여기에 다음 후보 30개를 추가해 현재 후보별 MVP 정의는 130개·공통 엔진은 14개다. 원본 적합 후보 판정 60개는 유지한다. 문항·그림 가이드·테마 변형이 포함되므로 독립 메커닉 130개나 최종 완료 130개를 뜻하지 않는다.

[공통 구조 가이드](docs/guide/guide-content-architecture.md)에 따라 등록 레지스트리·단일 정의 원본·공통 셸·엔진·저장 경계를 사용한다. 전체 구조·로직 검증을 통과했고 브라우저·실제 기기 검증은 대기 중이다.

[확장 계획](docs/plan/20261121165203-expansion40-plan.md)과 [40개 범위 검토](docs/review/20261121165203-expansion40-review.md)에 추가 활동·출처·제외 조건을 기록했다.

[다음 후보 30개 검토](docs/review/20261121194837-expansion30-review.md)와 [130개 확장 계획](docs/plan/20261121194837-expansion30-plan.md)에 새 상호작용 4개·17개 정의와 기존 유형 확장 13개를 구분했다.

### 🚀 로컬 실행

참고 프로젝트와 동일하게 Python 기본 정적 서버를 사용한다. 터미널에서는 `npm start` 또는 아래 명령으로 실행한다. 서버는 `127.0.0.1:7904`에만 바인딩한다.

macOS에서는 루트의 [start-local.command](start-local.command)를 더블클릭한다. 서버가 시작되면 브라우저에서 `http://127.0.0.1:7904/`를 연다. 터미널을 열어 두고, 종료는 Control+C로 한다. 터미널에서는 `./start-local.command`로 같은 실행이 가능하다.

```bash
python3 docs/tools/md_to_html.py --all
python3 -m http.server 7904 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:7904/`로 놀이터, `/contents/shape-garden/`으로 첫 활동, `/docs/guide/guide.html`로 가이드를 연다. 포트 `7904`는 본 프로젝트 기본값이며 참고 프로젝트의 `7902`와 분리한다. 사용 중이면 소유 프로세스를 확인하고 임의 종료하지 않는다.

### 🧱 생성·전체 검사

```bash
node tools/content/generate.mjs
node tools/check-all.mjs
```

정본은 `data/implementation/registry.json`에 등록한 배치이며 현재 `batch60.json`·`expansion40.json`·`expansion30.json`이다. 생성 파일을 직접 편집하지 않는다. 새 배치는 같은 규약으로 등록하며 검사 개수는 레지스트리에서 계산한다.

## 📌 요약 정보

| 항목 | 기준 |
|---|---|
| 조사 대상 | 대한민국 Google Play 스토어 우선, 다른 국가는 명시하여 비교 |
| 연령 설계 | 5세 이하·6–8세·9–12세를 참고하되 콘텐츠별 구체적 대상 지정 |
| 콘텐츠 경로 | `contents/{slug}/` 정의·진입·설명 130개, 공통 코드 `contents/shared/` |
| 기본 구현 | HTML/CSS + Vanilla JavaScript ES Modules, DOM 또는 Canvas |
| 기본 운영 | 광고·결제·계정·추적·외부 통신 없음 |
| 참고 프로젝트 리뷰 | [검토 기록](docs/review/20261121114958-reference-project-review.md) |

---

🙏 감사합니다!
