#!/usr/bin/env python3
"""2026-11-21 확장 스냅샷의 수동 판정을 기록·검증하고 비교 보고서를 생성한다."""
import csv
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
TS='20261121135057'
PATH=ROOT/f'data/store/{TS}-expanded-candidates-kr.json'
FIT_GROUPS=[
 ('자유 미술', [106,107,112,113,124,178,180,197,239,240,273,283,313], '자체 도형·선화 자유 색칠 또는 점 잇기; 원작 도안·그림·문구·랜덤 보상·공유 기능 제외', '3–5세'),
 ('수·연산', [134,142,143,182,184,189,214,223,236,299,308], '자체 물체 세기·숫자 대응·묶음 연산 중 한 활동; 원작 문항·시간 경쟁·효능/진단 주장 제외', '4–8세'),
 ('모양·분류·퍼즐', [120,126,138,139,144,233,268,274,298,302,306,316,321], '자체 기하 모양 짝 찾기·크기 분류·그림 조각 맞추기 중 한 활동; 원작 레벨·스킨·깜짝 보상 제외', '3–5세'),
 ('기하 조립', [270,280,303], '자체 2D 기하 부품으로 탈것 조립·꾸미기; 원작 부품·템플릿·주행 맵·온라인 작품 공유 제외', '5–8세'),
 ('시간 읽기', [136], '자체 아날로그 시계의 시침·분침을 움직여 정각·30분 탐색; 원작 화면·문항 제외', '6–8세'),
 ('감정 탐색', [304], '자체 인물·생활 상황에서 감정 이름 살펴보기·스스로 표현하기; 원작 그림·노래·정답 강요·감정 진단 제외', '3–5세'),
 ('만들기·패턴', [318], '자체 종이 장난감에 색·패턴을 골라 장식하기; 원작 캐릭터·3D 소품·음원·도안 제외', '4–8세'),
 ('소리 탐색', [200], '직접 합성한 음을 누르고 비교하는 자유 연주; 원작 동물 이미지·녹음·가상 통화·영아 이용 권장 제외', '3–5세'),
]
# 판정은 아래 고정 스냅샷을 직접 읽은 수동 기획값이다. 미래 차트 순번에 재사용하지 않는다.
EXCLUDED={108:'성인까지 포괄하는 일본어 회화·어휘 코스; 이번 아동 기초 활동 범위와 다름',109:'현장 근로자의 공수·경비·업무 기록 앱',145:'인형 뽑기·가챠 경험이 핵심; 무작위 보상을 제거하면 핵심 경험이 달라짐',147:'외국인 구인·구직 플랫폼',152:'일반 영어 회화·어휘 코스; 아동 전용 활동으로 확인되지 않음',154:'학급·가정 커뮤니티·메시징 앱',181:'25분 집중 타이머 도구; 아동 놀이학습 핵심 활동이 아님',201:'엄격한 타이밍 판정이 핵심인 리듬 게임; 현재 탐색 중심 활동과 다름',204:'VPN 네트워크 유틸리티',206:'전투·타워 디펜스 중심의 대규모 게임',213:'외부 게임과 연동하는 AI 대화·음성 서비스',234:'반복 기억·글로벌 순위 중심 N-back 훈련; 연령 근거 미확인',241:'반응 속도 훈련이 핵심; 서두르지 않는 현재 활동 방향과 다름',243:'음성 인식·AI 대화·서버 의존 회화 서비스',286:'전투 디펜스·광범위 시험 어휘 결합; 현재 아동 기초 활동과 다름',293:'무한 달리기·연속 반응·기록 경쟁이 핵심인 연산 게임',312:'탱크·장갑차 조립·주행 테마; 현재 비폭력적 일상·창작 활동 우선 범위에서 제외'}
HELD={96:'전용 파닉스 교재·챈트·음원 의존; 자체 자료 범위 확인 필요',98:'대규모 영상·학습 라이브러리 의존',116:'출판 도서·낭독·번역 라이브러리의 개별 권리 확인 필요',121:'실물 프린터 제어·출력이 핵심',131:'AI 진단·독해 검사·맞춤 수업 서비스 의존',132:'회원 전용 영어 수업·계정 의존',140:'낭독·애니메이션 도서 라이브러리가 핵심',146:'AAC 보조 의사소통 도구; 접근성 사용자 요구·자료 권리의 별도 설계 필요',153:'가입 고객 전용 독서 서비스',175:'멤버십 및 다수 캐릭터·영상 의존',177:'상용 파닉스 교재 시리즈·음원 의존',192:'동요·영상 라이브러리가 핵심; 원곡·편곡·녹음 권리 확인 필요',193:'AI 맞춤 교육·강사 강의 서비스',194:'브랜드 동요·동영상 라이브러리가 핵심',205:'상용 애니메이션 시청 플랫폼',208:'외부 로봇 하드웨어 제어',211:'실물 큐브 상태 입력·촬영·해법 안내 도구',216:'카메라 기반 양치와 라이선스 캐릭터가 핵심',219:'교재·캐릭터 연계 AR 서비스',225:'실물 로봇 원격 제어',262:'상세 구조 파싱 미확인',269:'3D·VR·AR 공룡 탐험이 핵심; 단순 웹 활동과 범위 차이',294:'외부 로봇 플랫폼·모션 제어',309:'마블 영상·만화·캐릭터 라이브러리 중심',311:'동요·이야기·캐릭터 라이브러리 권리와 독립 범위 확인 필요',288:'동화·삽화·번역·낭독 라이브러리의 개별 권리 확인 필요',317:'응급처치 절차 안내의 정확성·아동 모방 위험을 별도 검토해야 함'}
CONDITIONAL_GROUPS=[
 ('기초 언어', [115,119,123,210,215,228,230,259,296], '자체 글자·낱말 활동으로 범위를 확정하고 발음·문해 수준·교재/음원 권리 검토 필요'),
 ('외모·성별 표현 조정', [125,141,151,155,157,168,172,183,190,238,245,246,247,255,260,275,277,279,307,310], '성별 제한·외모 우열을 재현하지 않고 누구나 하는 색·질감 창작으로 전환 필요'),
 ('돌봄·의료 표현 조정', [118,188,195,212,235,251,261,282,305], '치료·투약·수술·신체 자극 표현 대신 배려·도움 요청·위생 활동으로 재설계 필요'),
 ('요리·장보기', [78,117,127,160,167,169,186,209,232,248,254,278,285,287,295], '원작 테마·레시피·손님/운영 체계와 분리하여 재료 분류·순서 한 활동으로 축소 필요'),
 ('복합 역할놀이', [87,105,110,111,122,128,129,135,137,148,150,156,159,161,163,165,166,176,179,185,196,220,221,224,226,227,229,231,237,249,250,252,253,256,258,263,264,265,266,267,271,272,284,289,290,291,292,300,301,314,315,319,320,322], '캐릭터·세계관·복합 역할·성장 보상을 제외한 단일 생활·탐색 장면으로 범위 확정 필요'),
 ('확장 상호작용', [133,158,162,164,170,171,198,202,203,217,218,242,244,257,276,281,297], '보드·코딩·시뮬레이션·연산의 세부 범위와 난이도·정확성·단순화 경계를 추가 검토해야 함'),
]
BASELINE_FAMILIES={2:'수·연산',11:'수·연산',40:'수·연산',46:'수·연산',67:'수·연산',80:'수·연산',83:'수·연산',17:'자유 미술',21:'자유 미술',77:'자유 미술',99:'자유 미술',47:'모양·분류·퍼즐',27:'모양·분류·퍼즐',79:'모양·분류·퍼즐',71:'명령 순서',91:'소리 탐색'}
HEAD='작성일: 2026년 11월 21일\n작성자: 지순이(ChatGPT), 로컬 작업자 Bill(min@cafewill.com) · 호스트 nano\n\n'
END='\n---\n\n🙏 감사합니다!\n'

def cleaned(text):
 text=re.split(r'-*\s*개발자 연락처\s*[:：]?',text,maxsplit=1)[0]
 text=re.sub(r'\b(?:0\d{1,2}[- ]\d{3,4}[- ]\d{4}|\d{3,4}-\d{4})\b','[연락처 생략]',text)
 return text

def main():
 data=json.loads(PATH.read_text());fit={};conditional={}
 for group,ids,scope,age in FIT_GROUPS:
  for n in ids:
   assert n not in fit
   fit[n]=(group,scope,age)
 for group,ids,reason in CONDITIONAL_GROUPS:
  for n in ids:conditional[n]=(group,reason)
 for a in data['apps']:
  n=int(a['researchId'][1:]);is_old='baselineAssessment' in a
  if is_old:
   # 기존 16개를 부풀리지 않고 이전 분류를 그대로 보존한다.
   a['assessment']=dict(a['baselineAssessment'])
   a['assessment']['activityFamily']=BASELINE_FAMILIES.get(a['baselineSourceRank'],a['assessment']['activityGroup'])
   a['assessment']['reviewMethod']='기존 판정 유지'
   continue
  raw=Path('/tmp/boos-expanded-details')/(a['appId']+'.html')
  a['detailHtmlSha256']=hashlib.sha256(raw.read_bytes()).hexdigest()
  a['fetchStatus']='curl --compressed 정상 종료; 상세 HTML 수집'
  detail=a.get('detail')
  if detail:detail['descriptionExcerpt']=cleaned(detail['descriptionExcerpt'])
  if a.get('detailError') or not detail:
   status,group,scope,age='보류','상세 미확인','공식 상세 HTML을 받았으나 구조 파싱 실패; 제목만으로 적합 판정하지 않음','미정'
  elif n in fit:
   group,scope,age=fit[n];status='적합 후보'
  elif n in EXCLUDED:
   status,group,scope,age='제외','범위 밖',EXCLUDED[n],'미정'
  elif n in HELD:
   status,group,scope,age='보류','의존·권리 확인',HELD[n],'미정'
  elif n in conditional:
   group,scope=conditional[n];status,age='조건부','콘텐츠별 재검토'
  else:
   raise ValueError(f'수동 판정 누락: {a["researchId"]} {a["title"]}')
  a['assessment']={'status':status,'activityFamily':group,'projectAgeHypothesis':age,'independentScope':scope,
    'basis':'공식 설명을 읽은 개발자 1차 기획 판정; 직접 플레이·아동 관찰·권리 무위험 판정 아님',
    'reviewMethod':'패키지별 수동 분류, 미래 스냅샷 재사용 금지',
    'evidenceExcerpt':detail['descriptionExcerpt'][:180] if detail else None,
    'ipReview':'코드·캐릭터·로고·아트·문항·레벨·UI·음원 복제 제외; 자체 표현·권리 근거·공개 전 검토 필수'}
 assert len(data['apps'])==322 and len({a['appId'] for a in data['apps']})==322
 old=[a for a in data['apps'] if 'baselineAssessment' in a];new=[a for a in data['apps'] if 'baselineAssessment' not in a]
 assert len(old)==100 and len(new)==222
 assert all(a['assessment']['status']==a['baselineAssessment']['status'] for a in old)
 assert all(a.get('detail') and not a.get('detailError') for a in data['apps'] if a['assessment']['status']=='적합 후보')
 counts=Counter(a['assessment']['status'] for a in data['apps']);newcounts=Counter(a['assessment']['status'] for a in new)
 fits=[a for a in data['apps'] if a['assessment']['status']=='적합 후보']
 data['summary']={'uniqueApps':322,'baselineApps':100,'additionalApps':222,'sourceOccurrences':428,'duplicatesAcrossSources':106,'detailParsed':sum(bool(a.get('detail')) and not a.get('detailError') for a in data['apps']),'detailUnconfirmed':sum(bool(a.get('detailError')) for a in data['apps']),'counts':dict(counts),'additionalCounts':dict(newcounts),'fitActivityFamilies':dict(Counter(a['assessment']['activityFamily'] for a in fits))}
 PATH.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
 csvpath=PATH.with_suffix('.csv')
 with csvpath.open('w',newline='',encoding='utf-8-sig') as f:
  w=csv.writer(f,lineterminator="\n");w.writerow(['조사ID','기존/추가','앱명','개발사','패키지ID','공식URL','차트별응답순번','분류','활동유형','자체연령가설','독립구현범위/판정사유','내용등급','다운로드구간','평점','평가수','광고표시','인앱결제','가격','버전','상세확인UTC','파싱오류'])
  for a in data['apps']:
   d=a.get('detail',{});q=a['assessment'];w.writerow([a['researchId'],'기존' if 'baselineAssessment' in a else '추가',a['title'],a['developer'],a['appId'],a['url'],'; '.join(f'{s["key"]}:{s["rank"]}' for s in a['sources']),q['status'],q['activityFamily'],q['projectAgeHypothesis'],q['independentScope'],d.get('contentRating','미확인'),d.get('installs','미확인'),d.get('score','미확인'),d.get('ratings','미확인'),d.get('ads','미확인'),d.get('iap','미확인'),d.get('price','미확인'),d.get('version','미확인'),d.get('fetchedAt','미확인'),a.get('detailError','')])
 report=ROOT/f'docs/review/{TS}-expanded-candidates-review.md'
 lines=[HEAD+'# 🔍 TOP 100 초과 확장 조사·적합 후보 비교','## 📖 개요',
 '기존 적합 후보 16개가 적다는 요청에 따라 2026년 11월 21일 대한민국·한국어·비로그인 차트 범위를 확대했다. 순위 깊이만 늘리지 않고 FAMILY·학습 게임의 무료·유료·최고 매출을 조회했다. 합성된 전체 인기 순위를 만들지 않았으며 원차트별 응답 순서를 보존했다.',
 '**조사 범위:** 유효 차트 노출 428건에서 패키지 중복 106건을 제거한 고유 앱 322개. 기존 100개를 모두 포함하고 추가 앱은 222개다. 기존 100개 상세는 앞선 스냅샷의 확인 시각을 보존해 재사용했고 추가 222개는 새로 조회했다.',
 '**판정 유지:** 기존 16개를 조건 완화로 늘리지 않고 기존 100개의 분류를 그대로 유지했다. 적합은 일반 활동을 자체 제작하기 위한 기획 적합성이며 원작 전체 복제·법적 승인·검증된 교육 효과를 의미하지 않는다.',
 '## 🧩 주요 내용','### 🗂 확장 범위와 실제 반환값',
 '| 출처 키 | 카테고리 | 차트 | 요청 | 실제 반환 | 확인 |','|---|---|---|---|---|---|']
 for s in data['sources']:
  lines.append(f'| {s["key"]} | {s["category"]} | {s["collection"]} | {s["requestedCount"]} | {s["returnedCount"] if s["status"]=="ok" else "미확인"} | {s["collectedAt"]} |')
 lines += ['FAMILY 무료는 500개 요청에 200개가 반환됐다. 이 숫자를 TOP 500 확보로 표현하지 않는다. 학습 게임 유료 응답은 파싱 가능한 목록이 없어 미확인으로 기록했으며 0개 앱 존재로 단정하지 않는다. 반환 수가 적은 차트는 별도 추정·패딩하지 않았다.',
 '출처: [Google Play KR Kids/Family](https://play.google.com/store/apps/category/FAMILY?hl=ko&gl=KR), [학습 게임](https://play.google.com/store/apps/category/GAME_EDUCATIONAL?hl=ko&gl=KR). 공식 RPC를 고정 버전 비공식 파서로 해석했으며 실제 기기 UI 순위·Teacher Approved 여부·국가별 비공개 대상 연령은 별도로 검증하지 않았다.',
 '### ✅ 이전 대비 분류 결과',
 '| 분류 | 기존 100개 | 추가 222개 | 합계 322개 |','|---|---|---|---|']
 oldcounts=Counter(a['assessment']['status'] for a in old)
 for status in ['적합 후보','조건부','보류','제외']:lines.append(f'| {status} | {oldcounts[status]} | {newcounts[status]} | {counts[status]} |')
 lines += [f'적합 후보는 **16개 → {len(fits)}개**, 추가 **{newcounts["적합 후보"]}개**, 기존 대비 **{len(fits)/16:.2f}배**다. 비율은 16.0%에서 {len(fits)/322*100:.1f}%로 바뀌었다. 적합+조건부는 {counts["적합 후보"]+counts["조건부"]}개이며 조건부를 확정 후보로 합산하지 않는다.',
 '### 🧠 적합 앱과 실제 활동 수의 구분',
 f'적합 앱 {len(fits)}개는 아래 {len(data["summary"]["fitActivityFamilies"])}개 **상위 활동 유형**으로 묶인다. 같은 색칠·연산 앱이 여러 개 포함돼 있으며 이 앱 수를 새로운 콘텐츠 {len(fits)}개로 치환하지 않는다. 같은 상위 유형 안에도 세부 활동이 여러 개 있을 수 있다. 상위 유형 수는 구현 확정 개수가 아니다.',
 '| 상위 활동 유형 | 적합 앱 수 |','|---|---|']
 for group,count in data['summary']['fitActivityFamilies'].items():lines.append(f'| {group} | {count} |')
 lines += ['### 🌱 우선 검토할 신규 활동',
 '| 자체 활동 가칭 | 참고 조사 ID | 경험·검토 방향 |','|---|---|---|',
 '| 오늘의 마음 날씨 | E304 | 감정 이름 살펴보기·자기 표현. 아이의 감정에 정답을 강요하지 않음 |',
 '| 하루 시계 정원 | E136 | 정각·30분과 일상의 시간 연결, 시침·분침 탐색 |',
 '| 작은 바퀴 공방 | E270·E280·E303 | 자체 2D 기하 부품으로 탈것 조립, 원작 부품·맵 미사용 |',
 '| 다정한 선물 공방 | E318 | 자체 종이 장난감에 색·패턴을 고르는 창작 |',
 '| 크기 바구니 | E138·E233 | 큰 것·작은 것 분류, 색 외에 형태·크기 단서 제공 |',
 '| 구슬 수 산책 | E308·E299 | 자체 구슬·물체로 수량 비교·세기 |',
 '위 이름은 기획 가칭이다. 기존 12개 로드맵과 중복을 검토하고 상세 리뷰·권리·연령·UI 검증 후 구현 수를 확정한다. 이번 요청에서는 조사·분류만 확장했고 실제 콘텐츠 구현 수는 1개로 유지했다.',
 f'### 🗂 적합 후보 {len(fits)}개 전체',
 '조사 ID는 식별자이며 순위가 아니다. 연령은 자체 구현 설계 가설이다. 모든 링크는 공식 KR 상세이며 원작 이름은 출처 식별용으로만 쓴다.',
 '| ID | 구분 | 원작·공식 출처 | 개발사 | 활동 | 자체 연령 가설 | 독립 구현 범위 |','|---|---|---|---|---|---|---|']
 for a in fits:
  q=a['assessment'];title=a['title'].replace('|','·');dev=a['developer'].replace('|','·')
  lines.append(f'| {a["researchId"]} | {"기존" if "baselineAssessment" in a else "추가"} | [{title}]({a["url"]}) | {dev} | {q["activityFamily"]} | {q["projectAgeHypothesis"]} | {q["independentScope"]} |')
 lines += ['### 🛡 판정 기준·한계',
 '- 적합: 설명에서 일반적인 활동을 식별할 수 있고 자체 코드·기하/문항/음원으로 핵심 경험의 로컬 MVP를 구성하기에 타당한 경우.',
 '- 조건부: 성별·외모 서열·공포·의료 표현을 바꾸거나 복합 세계·교재·학습 흐름을 단일 활동으로 확정하는 추가 설계가 필요한 경우.',
 '- 보류: 상세 파싱 미확인 또는 교구·회원·카메라·라이브러리·정확성·개별 권리 의존을 먼저 확인해야 하는 경우.',
 '- 제외: 업무 도구·외부 소셜/AI 서비스·현재 방향과 다른 속도 경쟁/전투 중심 경험 등.',
 f'상세 파싱은 {data["summary"]["detailParsed"]}개 성공·{data["summary"]["detailUnconfirmed"]}개 미확인이다. 파싱 실패는 서비스 중단의 증거가 아니다. 직접 설치·플레이·원작 화면 비교·아동 관찰·공개 전 명칭/상표 검토는 수행하지 않았다. UI와 컬러의 실제 적합성·정서/발달 효과·모든 권리의 안전을 확정하지 않는다.',
 '원작 코드·아이콘·이미지·소리·책·문항·레벨·화면 배열은 구현 자원으로 사용하지 않는다. 외부 자료는 권리 근거가 있는 경우에만 적용하며 자체 색·문구·이름은 기존 아동 UX·Fascinating UI·지식재산권 지침을 따른다. 설명 발췌에는 불필요한 연락처를 생략했다.',
 '### 🔗 전체 근거',
 f'- [322개 JSON](../../data/store/{TS}-expanded-candidates-kr.json): 출처별 순번·메타데이터·개별 판정·확인 시각·해시.',
 f'- [322개 CSV](../../data/store/{TS}-expanded-candidates-kr.csv): 적합·조건부·보류·제외 전체 목록.',
 '- [기존 100개 조사](20261121121009-play-top100-review.md): 비교 기준을 보존.',
 '- [조사 도구](../../tools/store/README.md): 준비·병합·파싱·보고서 재현 기준.',
 '## 📌 요약 정보',
 f'확장 표본 322개·추가 222개·적합 {len(fits)}개(신규 {newcounts["적합 후보"]}개). 동일 활동 앱 중복을 고려하여 후속 상세 기획을 진행한다. 이 조사 당시 구현 1개·브라우저 검증 대기 기록을 보존하며 최신 구현 상태는 루트 GLANCE.md와 배치 계획을 따른다.',END]
 output=[]
 for i,line in enumerate(lines):
  output.append(line);nxt=lines[i+1] if i+1<len(lines) else ''
  contiguous=(line.startswith('|') and nxt.startswith('|')) or (line.startswith('- ') and nxt.startswith('- '))
  output.append('\n' if contiguous else '\n\n')
 report.write_text(''.join(output).rstrip()+'\n');print(json.dumps(data['summary'],ensure_ascii=False,indent=2))

if __name__=='__main__':main()
