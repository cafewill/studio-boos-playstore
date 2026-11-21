작성일: 2026년 11월 21일
작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano

# 🧸 studio-boos-playstore

## 📖 개요

Google Play 스토어의 아이들용 게임·교육·창작·이야기 콘텐츠를 분석하고, 핵심 활동을 자체 이름과 에셋으로 재구현하는 로컬 스튜디오다. 프로젝트 디렉터리는 `studio-boos-playstore`이며 조사 대상은 **Google Play 스토어**다.

기본 결과물은 Android 스마트폰·태블릿 Chrome을 우선 고려한 독립 웹 콘텐츠다. Android 네이티브 앱이나 Google Play 스토어 출시는 후속 범위로 결정한다. 여기서 클론은 활동 구조와 메커닉의 재구현을 뜻한다. 모든 콘텐츠는 아이들의 정서 함양과 발달에 적합한 컬러 컨셉·용어·네이밍을 항상 고려하며, 안정감·존중·호기심·자율성을 지원하도록 구성한다.

사용자 화면은 간결하고 직관적인 커스텀·반응형 UI로 개발한다. “Fascinating”(페시네이팅)은 절제된 놀라움과 호기심을 이끄는 작은 발견 경험으로 해석하며, [UI 가이드](docs/guide/guide-ui-design.md)를 따른다.

## 🧩 주요 내용

### 🔄 시작 순서

1. [AGENTS.md](AGENTS.md): AI 협업 규칙
2. [GLANCE.md](GLANCE.md): 현황·경로·문서 색인
3. [가이드 목차](docs/guide/guide.md): 조사·개발·아동 안전 기준
4. [초기 계획](docs/plan/20261121114958-foundation-plan.md): 다음 작업과 완료 기준

현재는 지침과 가이드만 구성되어 있으며 구현 콘텐츠·포털·자동 브라우저 검증 도구는 없다.

### 🚀 문서 미리보기

```bash
python3 docs/tools/md_to_html.py --all
python3 -m http.server 7904 --bind 127.0.0.1
```

브라우저에서 `http://127.0.0.1:7904/docs/guide/guide.html`을 연다. 포트 `7904`는 본 프로젝트 기본값이며 참고 프로젝트의 `7902`와 분리한다. 사용 중이면 소유 프로세스를 확인하고 임의 종료하지 않는다.

## 📌 요약 정보

| 항목 | 기준 |
|---|---|
| 조사 대상 | 대한민국 Google Play 스토어 우선, 다른 국가는 명시하여 비교 |
| 연령 설계 | 5세 이하·6–8세·9–12세를 참고하되 콘텐츠별 구체적 대상 지정 |
| 콘텐츠 경로 | 향후 `contents/{slug}/` |
| 기본 구현 | HTML/CSS + Vanilla JavaScript ES Modules, DOM 또는 Canvas |
| 기본 운영 | 광고·결제·계정·추적·외부 통신 없음 |
| 참고 프로젝트 리뷰 | [검토 기록](docs/review/20261121114958-reference-project-review.md) |

---

🙏 감사합니다!
