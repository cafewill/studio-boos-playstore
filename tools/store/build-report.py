#!/usr/bin/env python3
"""확인한 TOP 100 스냅샷에 수동 기획 분류를 적용해 CSV·리뷰를 생성한다."""
import csv
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT/'data/store/20261121121009-family-top-free-kr.json'
REPORT = ROOT/'docs/review/20261121121009-play-top100-review.md'
GROUPS = [
 ('수 개념·연산', [2,11,40,46,67,80,83,94], '적합 후보', '물체 세기·수량 비교·묶음 연산을 자체 문항으로 구성', '4–8세'),
 ('한글·영어·읽기', [18,19,20,25,31,39,41,43,73,85], '조건부', '자체 단어·도형으로 기초 읽기·따라쓰기만 추출; 음성·교재·구독 서비스 제외', '5–8세'),
 ('미술·색·모양', [17,21,47,77,99], '적합 후보', '자체 도형·선·색 팔레트로 분류·그리기 활동 설계', '3–5세'),
 ('퍼즐·코딩·실험', [3,50,71,79,84,98], '조건부', '자체 퍼즐·명령·도형으로 단일 활동화; 카메라·센서 의존 제외', '6–8세'),
 ('생활·돌봄·요리', [16,26,29,35,37,54,56,57,58,60,65,74,78,82,86,87,89,90,91,93,96,100], '조건부', '배려·순서·선택을 자체 일상 놀이로 재설계; 공포·성별 고정관념·의료 행위 모방 제외', '3–5세'),
 ('가상세계·창작', [13,22,23,24,44,49,53,62,66,68,69,70,75,88,92], '조건부', '공간 꾸미기·창작 한 장면만 자체 구성; IP·커뮤니티·대형 월드 제외', '6–8세'),
 ('영상·종합·음악', [1,27,32,33,48,51,55,61,63,76], '조건부', '영상·곡·이야기·퀴즈 라이브러리 대신 자체 짧은 활동 1개만 구현', '4–8세'),
 ('회원·하드웨어 의존', [10,12,28,30,42,45,52,59,64,72], '보류', '회원·실물 교구·AR·음성·전용 학습환경 의존을 제거할 독립 범위부터 확인', '미정'),
 ('범위 밖·온라인 의존', [4,5,6,9,14,34,36,38,81,97], '제외', '유틸리티·고등 학습·온라인·유명 IP 전투 등 이번 아동 로컬 MVP 범위와 맞지 않음', '미정'),
 ('상세 파싱 미확인', [7,8,15,95], '보류', '차트 식별 정보만 확인; 상세 파싱 실패로 활동·권리·연령 적합성 확정 불가', '미정'),
]
OVERRIDES = {
 3:('조건부','자체 도형 프레임 편집만 참고; 촬영·원작 영상과 UI 제외','6–8세'),
 27:('적합 후보','기초 수·도형 활동만 자체 설계; 원작 캐릭터·교재·종합 학습경로 제외','4–8세'),
 47:('적합 후보','일반적인 모양 식별만 참고; 원작 놀이공원·캐릭터·색 조합·문항·화면 복제 제외','3–5세'),
 71:('적합 후보','명령 순서로 이동하는 자체 격자 퍼즐; 원작 고양이·맵·40개 레벨 제외','6–8세'),
 79:('적합 후보','자체 기하 조각 맞추기; 원작 이미지·퍼즐·난이도 배열 제외','3–5세'),
 91:('적합 후보','직접 합성한 음으로 자유 연주; 원작 곡·악기 그림·효능 문구 제외','3–5세'),
 16:('조건부','공포·충혈·신체 치료 연출을 제외하고 편안한 돌봄 행동으로 전환','4–8세'),
 57:('조건부','공주·외모 서열·성별 제한을 재현하지 않고 누구나 하는 꾸미기로 전환','4–8세'),
 74:('조건부','여아 전용·외모 평가를 제외하고 누구나 선택하는 색·질감 창작으로 전환','4–8세'),
 76:('보류','종교적 이야기와 번역문의 권리를 별도 확인; 첫 중립 활동 후보에서는 보류','미정'),
 84:('보류','실측 센서가 핵심인 과학 활동; 가상 데이터로 대체하면 원작과 다른 경험이므로 별도 기획','9–12세'),
 68:('보류','범용 전문 그림 도구 전체 재현은 과도함; 별도 단순 창작 활동만 추후 검토','9–12세'),
 1:('보류','외부 동영상 플랫폼·추천·서버가 핵심; 자체 활동 MVP와 구분','미정'),
 32:('조건부','실시간 공유·사용자 퀴즈·랭킹을 제외한 자체 로컬 퀴즈로 축소','6–8세'),
 48:('보류','멤버십·다수 라이선스 IP 의존; 독립 미니 활동으로 분리 가능한 경우만 재검토','미정'),
 69:('보류','별도 Netflix 판: 동일 핵심 활동 중복 및 멤버십·원작 IP 제외','미정'),
 94:('조건부','초등·중등 시험 전체 대신 자체 저학년 수 개념 문항만 제한적으로 참고','6–8세'),
}
PRIORITY = [47,80,17,79,71,91,39,43,89,56,58,83]
HEAD='작성일: 2026년 11월 21일\n작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano\n\n'
END='\n---\n\n🙏 감사합니다!\n'

def main():
 data=json.loads(SOURCE.read_text()); groups={}
 for group, ranks, status, motif, age in GROUPS:
  for rank in ranks:
   if rank in groups: raise ValueError(f'분류 중복 {rank}')
   groups[rank]=(group,status,motif,age)
 assert set(groups)==set(range(1,101))
 assert len(data['apps'])==100 and len({a['appId'] for a in data['apps']})==100
 for a in data['apps']:
  group,status,motif,age=groups[a['sourceRank']]
  status,motif,age=OVERRIDES.get(a['sourceRank'],(status,motif,age))
  a['assessment']={'status':status,'activityGroup':group,'projectAgeHypothesis':age,
    'independentScope':motif,'priority':PRIORITY.index(a['sourceRank'])+1 if a['sourceRank'] in PRIORITY else None,
    'ipReview':'공식 원작 식별은 분석 문서에만 사용; 코드·브랜드·아트·음원·UI·문항·레벨 복제 제외. 권리 무위험 판정 아님',
    'basis':'상세 설명 발췌 기반 개발자 기획 분류; 직접 플레이·아동 관찰 아님'}
 SOURCE.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 csvpath=SOURCE.with_suffix('.csv')
 with csvpath.open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.writer(f,lineterminator="\n");w.writerow(['응답순번','이름','개발사','패키지ID','URL','수집시각UTC','활동분류','기획분류','프로젝트연령가설','콘텐츠등급','평점','평가수','다운로드구간','가격','통화','광고','인앱결제','버전','업데이트UTC','TeacherApproved','오프라인','독립구현범위','파싱오류'])
  for a in data['apps']:
   d=a.get('detail',{});q=a['assessment'];w.writerow([a['sourceRank'],a['title'],a['developer'],a['appId'],a['url'],d.get('fetchedAt',data['collectedAt']),q['activityGroup'],q['status'],q['projectAgeHypothesis'],d.get('contentRating','미확인'),d.get('score','미확인'),d.get('ratings','미확인'),d.get('installs','미확인'),d.get('price','미확인'),d.get('currency','미확인'),d.get('ads','미확인'),d.get('iap','미확인'),d.get('version','미확인'),d.get('updated','미확인'),'미확인','미확인',q['independentScope'],a.get('detailError','')])
 counts=Counter(a['assessment']['status'] for a in data['apps'])
 lines=[HEAD+'# 🔍 Google Play KR FAMILY 인기 무료 TOP 100 조사',
 '## 📖 개요',
 f"조사 응답 저장 시각: `{data['collectedAt']}` (KST 2026년 11월 21일 12:11). 대한민국·한국어·비로그인 조건에서 FAMILY/TOP_FREE를 100개 요청해 서로 다른 앱 100개를 확보했다. 상세 HTML 100개를 조회했으며 96개 파싱 성공, 4개 파싱 실패다.",
 '**범위:** 아래 순번은 공식 Google Play 비공개 RPC의 FAMILY 인기 무료 응답 순서다. 전체 아동용 앱 통합 순위·다운로드 순위·직접 확인한 기기 UI 순위로 일반화하지 않는다. Kids 편집 추천과 별개이며 FAMILY 응답에 성인·범용 도구가 섞여 있어 전부 아동 적합 앱으로 판단하지 않는다.',
 '정보는 공식 스토어 HTML과 구조화 응답으로 확인했다. APK 설치·직접 플레이·화면 캡처·아동 사용자 관찰은 하지 않았다. 광고·결제는 표시 메타데이터이고 실제 실행에서의 노출 검증이 아니다. 개발사 효능 주장을 교육 효과의 검증 결과로 쓰지 않는다.',
 '## 🧩 주요 내용',
 '### 🔗 출처·재현 자료',
 '- [Google Play KR Kids/Family](https://play.google.com/store/apps/category/FAMILY?hl=ko&gl=KR)',
 '- [원본 수집값·100개 기획 분류 JSON](../../data/store/20261121121009-family-top-free-kr.json)',
 '- [전체 메타데이터 CSV](../../data/store/20261121121009-family-top-free-kr.csv)',
 '- [도구와 재현 절차](../../tools/store/README.md)',
 '수집기는 참고 프로젝트의 고정 버전 google-play-scraper 10.0.1 요청 형식·파서를 사용했다. 공식 응답을 해석하는 비공식 도구이며 데이터 구조 변경 가능성이 있다. 원응답·상세 HTML의 SHA-256을 JSON에 기록했다. 상세 원문 전체·원작 이미지·APK는 저장소에 포함하지 않는다.',
 '### ✅ 100개 분류 결과',
 '| 분류 | 개수 | 의미 |','|---|---|---|']
 meanings={'적합 후보':'활동 단위 독립 재구현 검토 가능; 법적 승인·연령 검증 완료 뜻 아님','조건부':'특정 경험만 참고하고 계정·IP·자극적 표현 등 변경 필요','보류':'자료·회원·교구·라이선스·기능 의존 확인 후 재검토','제외':'현재 아동 로컬 MVP 범위에 맞지 않음'}
 for key in meanings:lines.append(f'| {key} | {counts[key]} | {meanings[key]} |')
 lines += ['### 🗂 TOP 100 전체 목록',
 '연령 열은 **자체 구현을 위한 설계 가설**이며 원작의 신고 연령이 아니다. 상세 미확인 4개는 차트 식별값만 사용했다. 모든 원작 링크는 국가·언어를 고정한다. 다운로드·평점·가격·버전 등 전체 값은 CSV·JSON에서 확인한다.',
 '| 응답 순번 | 원작·공식 출처 | 개발사 | 활동 | 분류 | 자체 연령 가설 | 독립 재구현 범위·사유 |','|---|---|---|---|---|---|---|']
 for a in data['apps']:
  q=a['assessment'];title=a['title'].replace('|','·');dev=a['developer'].replace('|','·')
  lines.append(f"| {a['sourceRank']} | [{title}]({a['url']}) | {dev} | {q['activityGroup']} | {q['status']} | {q['projectAgeHypothesis']} | {q['independentScope']} |")
 lines += ['### 🧩 프로젝트 구현 우선순위',
 '스토어 순위와 별개의 기획 순서다. 정서·표현·독립 제작 가능성을 먼저 통과한 활동 중 한국어·기초 인지·로컬 검증 용이성·활동 다양성을 고려했다. 추정 점수나 교육 효과 순위를 만들지 않았다.',
 '| 우선 | 자체 콘텐츠 가칭 | 참고 응답 순번 | 한 가지 활동 |','|---|---|---|---|']
 projects=[('모양 정원','같은 기하 모양 고르기'),('차근차근 수 놀이터','1–5개 물체와 숫자 연결'),('색이 피는 숲','자체 도형 자유 색칠'),('조각 오솔길','기하 조각 맞추기'),('새싹 길찾기','앞으로·돌기 명령 순서'),('소리 이슬','합성음 자유 연주'),('선을 따라 산책','자체 곡선·숫자 따라가기'),('한글 씨앗','자체 글자·낱말 연결'),('다정한 장바구니','물건 분류·수량 맞추기'),('포근한 작은 주방','재료 순서 맞추기'),('함께 돌보는 하루','도움이 필요한 상황과 돌봄 선택'),('묶음 꽃밭','같은 수씩 묶어 세기')]
 for i,(name,activity) in enumerate(projects):lines.append(f'| {i+1} | {name} | {PRIORITY[i]} | {activity} |')
 lines += ['### 🛡 저작권·정서·확인 한계',
 '원작의 구체적 테마·브랜드·캐릭터·이미지·문항·음원·레벨·화면 배열을 사용하지 않는다. 동일 일반 활동의 참고 가능성만 검토했으며 법적 무위험 판정이 아니다. 자체 이름은 가칭이고 공개 전 유사 명칭·상표를 재검토한다.',
 '컬러·문구·네이밍 평가는 원작 화면을 직접 보지 않은 항목까지 확정하지 않는다. 자체 구현은 정서적 안정·자율성·존중을 목표로 하고 과도한 자극·공포·외모 서열·성별 고정관념을 배제한다.',
 '파싱 실패: 순번 7 NEOBOT, 8 공룡 3D, 15 펀치펀치 놀이터, 95 Phonics Monster. 오류는 파서의 구조 접근 실패이며 판매 중지·설치 불가의 증거가 아니다. 원작의 오프라인 지원·Teacher Approved·비공개 대상 연령은 전체 목록에서 별도 확인 전 미확인으로 남겼다.',
 '## 📌 요약 정보',
 f"100개 확보·96개 상세 파싱·{dict(counts)}. 첫 활동은 ‘모양 정원’으로 일반 모양 식별만 독립 구현한다. 후속 작업은 [구현 로드맵](../plan/20261121121009-play-top100-roadmap-plan.md)을 따른다.",END]
 output = []
 for i, line in enumerate(lines):
  output.append(line)
  upcoming = lines[i+1] if i+1 < len(lines) else ''
  contiguous = (line.startswith('|') and upcoming.startswith('|')) or (line.startswith('- ') and upcoming.startswith('- '))
  output.append('\n' if contiguous else '\n\n')
 REPORT.write_text(''.join(output).rstrip()+'\n')
 print(f'100개 분류: {dict(counts)}; CSV·JSON·리뷰 생성')

if __name__=='__main__':main()
