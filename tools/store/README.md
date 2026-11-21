작성일: 2026년 11월 21일
작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano

# 🔍 Google Play 확장 후보 조사 도구

## 📖 개요

FAMILY·GAME_EDUCATIONAL의 KR 비로그인 차트 응답과 공식 앱 상세 HTML을 수집·파싱한다. 기존 TOP 100과 확장 322개 조사의 원출처·순번·패키지·확인 시각을 구분한다. 데이터 구조는 비공식 패키지 `google-play-scraper` 10.0.1에 의존한다. 외부 패키지 코드는 MIT 라이선스이며 npm 설치 시 라이선스·고지를 유지한다. 원작 앱 코드·이미지는 사용하지 않는다.

## 🧩 주요 내용

### 🔄 재현 순서

```bash
# 패키지는 이 도구 안에만 설치한다. node_modules는 커밋하지 않는다.
npm ci --prefix tools/store
node tools/store/prepare-chart.mjs /tmp/boos-chart-body.txt
curl -sS --fail --max-time 30 -X POST -H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8' --data-binary @/tmp/boos-chart-body.txt 'https://play.google.com/_/PlayStoreUi/data/batchexecute?rpcids=vyAe2&source-path=%2Fstore%2Fapps&rt=c&hl=ko&gl=kr' -o /tmp/boos-chart-response.txt
python3 tools/store/snapshot.py /tmp/boos-chart-response.txt data/store/{새로운TS}-family-top-free-kr.json
```

`{새로운TS}`는 실제 KST 생성 시각으로 바꾼다. 스냅샷이 이미 있으면 덮어쓰지 않는다. 100개·고유 패키지·응답 경로를 검사하고 구조가 다르면 실패한다. 응답 순서는 기기 UI·전체 아동 앱 통합 순위로 확장 해석하지 않는다.

각 앱 상세 URL을 `curl`로 조회해 임시 캐시의 `{패키지ID}.html`에 저장한 뒤 다음 명령으로 파싱한다. 이번 조사 캐시는 `/tmp/boos-playstore-details`에 두었다.

```bash
STORE_HTML_CACHE=/tmp/boos-playstore-details node --import ./tools/store/transport-hooks.mjs tools/store/import-details.mjs data/store/{TS}-family-top-free-kr.json
```

Node 22.15 이상이 필요하며 이번 환경은 22.22.3이다. `transport-hooks.mjs`는 해당 파서의 요청만 읽기 전용 로컬 캐시로 바꾼다. 네트워크나 원작 리소스를 조작하는 도구가 아니다. 캐시 원문·이미지·APK는 저장소에 포함하지 않고 결과에는 사실 메타데이터와 짧은 설명 발췌만 남긴다.

### 🗂 파일

| 파일 | 역할 |
|---|---|
| `prepare-chart.mjs` | 카테고리·차트·요청 수(1–500)를 받아 고정 버전 요청 본문 준비 |
| `snapshot.py` | 기존 단일 차트 TOP 100 전용 가져오기, 100개 응답을 검증 |
| `merge-expanded.py` | 이번 6개 원차트 응답·해시를 병합하고 패키지 중복 제거, 기존 100개 보존 |
| `check-expanded.py` | 확장 원출처·기존 판정 보존·상세 근거·중복 제거·CSV/JSON/보고서 정합성 검증 |
| `review-expanded.py` | 이번 322개에 수동 판정 적용, 기존 판정 유지·누락 검증, CSV·비교 보고서 생성 |
| `import-details.mjs` | 캐시 상세 파싱, 실패를 항목별 기록하고 비정상 종료 |
| `cached-request.mjs`, `transport-hooks.mjs` | 오프라인 캐시만 읽는 파서 어댑터 |
| `build-report.py` | 이번 100개 스냅샷에 수동 기획 분류를 적용, CSV·리뷰 생성 |

`build-report.py`의 분류·우선순위는 **이번 스냅샷 전용 수동 기획값**이다. 다음 조사에 순번을 그대로 재사용하지 않고 패키지·설명·연령·권리 근거부터 재검토해야 한다. 원문 파싱 오류와 실제 서비스 중지는 구분한다. null·미확인은 false·미지원·광고 없음으로 해석하지 않는다.

### 🔄 확장 조사 재현

`prepare-chart.mjs`의 추가 인수는 출력파일·카테고리·차트·요청 수다. 예:

```bash
node tools/store/prepare-chart.mjs /tmp/boos-expanded-family-free-body.txt FAMILY topselling_free 500
node tools/store/prepare-chart.mjs /tmp/boos-expanded-educational-free-body.txt GAME_EDUCATIONAL topselling_free 200
```

동일한 curl POST URL에 준비한 본문을 전달하고 `/tmp/boos-expanded-{출처키}-response.txt`로 저장한다. `merge-expanded.py`의 SOURCES가 이번 6개 요청을 정의한다. FAMILY 무료·유료·최고 매출, 학습 게임 무료·유료·최고 매출을 조회했으며 5개에서 유효 목록을 받았다. 학습 유료의 미확인 응답을 0개로 취급하지 않는다. 500개를 요청해도 FAMILY 무료에서 반환한 것은 200개이므로 요청 수를 확보 수로 보고하지 않는다.

이번 병합은 `python3 tools/store/merge-expanded.py`로 수행했다. 기존 100개 데이터를 그대로 보존하고 222개 신규 패키지만 상세를 조회했다. 각 패키지의 URL은 JSON에 있다. 다운로드는 `curl -sS --compressed --fail --max-time 30`으로 제한된 동시 요청 수를 유지하고 정상 종료 후 파일을 파싱한다. 불완전한 전송을 정상 수집으로 간주하지 않는다.

```bash
STORE_HTML_CACHE=/tmp/boos-expanded-details node --import ./tools/store/transport-hooks.mjs tools/store/import-details.mjs data/store/20261121135057-expanded-candidates-kr.json --missing-only --quiet
python3 tools/store/review-expanded.py
```

`--missing-only`는 기존 상세 또는 기존 오류 기록이 있는 행을 건너뛰어 원기록을 보존한다. 재수집하려면 복사한 새 스냅샷에서 해당 상세·오류를 명시적으로 제거한 뒤 수행한다. `--quiet`는 원문 발췌를 터미널에 대량 출력하지 않는다.

확장 판정 스크립트도 **이번 고정 스냅샷 전용 수동 기획값**이다. E 식별자는 순위가 아니며 미래 조사에 그대로 재사용하지 않는다. 기존 100개의 분류를 유지하는지 검증하고 신규 적합 앱에는 상세 근거·자체 활동·연령 가설·권리 경계를 기록한다. 보고서·CSV·JSON의 분류 건수와 합계가 일치해야 한다.

## 📌 요약 정보

초기 결과는 100개·상세 96개이고 확장 결과는 322개·상세 307개·미확인 15개다. 확장 적합 후보는 60개이며 실제 구현 수는 1개다. 재시도 전 원자료를 보존한다. 도구는 사실 수집을 돕고 교육·정서·법적 적합성을 자동 판정하지 않는다.

---

🙏 감사합니다!
