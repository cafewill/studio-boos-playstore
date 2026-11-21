#!/usr/bin/env python3
"""원차트 응답별 순서를 보존하고 패키지 ID 기준으로 확장 표본을 병합한다."""
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
TS='20261121135057'
SOURCES=[('family-free','FAMILY','TOP_FREE',500),('family-paid','FAMILY','TOP_PAID',100),('family-gross','FAMILY','GROSSING',200),('educational-free','GAME_EDUCATIONAL','TOP_FREE',200),('educational-paid','GAME_EDUCATIONAL','TOP_PAID',200),('educational-gross','GAME_EDUCATIONAL','GROSSING',200)]

def main():
 old=json.loads((ROOT/'data/store/20261121121009-family-top-free-kr.json').read_text())
 previous={a['appId']:a for a in old['apps']}
 rows={};sources=[]
 for key,category,collection,requested in SOURCES:
  path=Path(f'/tmp/boos-expanded-{key}-response.txt');raw=path.read_bytes()
  meta={'key':key,'category':category,'collection':collection,'requestedCount':requested,'collectedAt':datetime.fromtimestamp(path.stat().st_mtime,timezone.utc).isoformat(),'rawSha256':hashlib.sha256(raw).hexdigest(),'sourceUrl':f'https://play.google.com/store/apps/category/{category}?hl=ko&gl=KR'}
  try:
   envelope=json.loads(raw.decode().split('\n')[3]);payload=json.loads(envelope[0][2]);apps=payload[0][1][0][28][0]
   if not isinstance(apps,list) or not apps:raise ValueError('빈 목록·미지원 응답')
   if len({a[0][0][0] for a in apps})!=len(apps):raise ValueError('동일 차트 내 패키지 중복')
  except (TypeError,IndexError,ValueError) as e:
   meta.update(status='unavailable',returnedCount=None,error=str(e));sources.append(meta);continue
  meta.update(status='ok',returnedCount=len(apps));sources.append(meta)
  for rank,item in enumerate(apps,1):
   a=item[0];id=a[0][0]
   if not isinstance(id,str) or not re.fullmatch(r'[A-Za-z0-9_.]+',id):raise ValueError('패키지 ID 형식 오류')
   if id not in rows:
    row={'researchId':f'E{len(rows)+1:03}','appId':id,'title':a[3],'developer':a[14],'url':f'https://play.google.com/store/apps/details?id={id}&hl=ko&gl=KR','sources':[]}
    if id in previous:
     for field in ['detail','detailError','detailHtmlSha256']:
      if field in previous[id]:row[field]=previous[id][field]
     row['baselineAssessment']=previous[id]['assessment'];row['baselineSourceRank']=previous[id]['sourceRank']
    rows[id]=row
   rows[id]['sources'].append({'key':key,'rank':rank})
 # 기존 100개를 묵시적으로 제거하지 않고 이전 출처로 보존한다.
 for id,a in previous.items():
  if id not in rows:
   row={k:v for k,v in a.items() if k not in ['assessment','sourceRank']}
   row.update(researchId=f'E{len(rows)+1:03}',sources=[{'key':'baseline-family-free','rank':a['sourceRank']}],baselineAssessment=a['assessment'],baselineSourceRank=a['sourceRank']);rows[id]=row
 output={'surveyStartedAt':'2026-11-21T04:50:57+00:00','country':'KR','language':'ko','baselineSnapshot':'20261121121009-family-top-free-kr.json','baselineCount':len(previous),'method':'6차트 요청·5차트 유효 응답; 차트별 응답 순서 보존, 패키지 중복 제거. 합성 인기 순위 아님','sources':sources,'apps':list(rows.values())}
 path=ROOT/f'data/store/{TS}-expanded-candidates-kr.json'
 if path.exists():raise FileExistsError('확장 결과가 이미 존재합니다. 덮어쓰지 않습니다.')
 path.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'unique':len(rows),'baselineRetained':sum('baselineAssessment' in a for a in rows.values()),'new':sum('baselineAssessment' not in a for a in rows.values()),'occurrences':sum(s.get('returnedCount') or 0 for s in sources),'output':str(path)},ensure_ascii=False))

if __name__=='__main__':main()
