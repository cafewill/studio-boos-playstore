#!/usr/bin/env python3
"""고정 확장 조사의 출처·중복 제거·분류·CSV·보고서 정합성을 검증한다."""
import csv
import json
from collections import Counter
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
TS='20261121135057'
base=json.loads((ROOT/'data/store/20261121121009-family-top-free-kr.json').read_text())
path=ROOT/f'data/store/{TS}-expanded-candidates-kr.json'
data=json.loads(path.read_text())
apps=data['apps'];summary=data['summary'];old={a['appId']:a for a in base['apps']}
assert len(apps)==322==len({a['appId'] for a in apps})==len({a['researchId'] for a in apps})
assert set(old)<={a['appId'] for a in apps}
assert sum('baselineAssessment' not in a for a in apps)==222
sources={s['key']:s for s in data['sources']}
assert len(sources)==6 and sum(s['status']=='ok' for s in sources.values())==5
assert sum(s.get('returnedCount') or 0 for s in sources.values())==428
assert sum(len(a['sources']) for a in apps)==428
assert 428-len(apps)==106==summary['duplicatesAcrossSources']
for key,source in sources.items():
 ranks=[s['rank'] for a in apps for s in a['sources'] if s['key']==key]
 if source['status']=='ok':assert sorted(ranks)==list(range(1,source['returnedCount']+1))
 else:assert source['returnedCount'] is None and not ranks
for a in apps:
 if a['appId'] in old:
  assert a['baselineAssessment']==old[a['appId']]['assessment']
  assert a['assessment']['status']==old[a['appId']]['assessment']['status']
 if a['assessment']['status']=='적합 후보':
  assert a.get('detail') and not a.get('detailError')
  assert a['assessment']['independentScope'] and a['assessment']['projectAgeHypothesis']
 assert a['url'].endswith('&hl=ko&gl=KR')
counts=Counter(a['assessment']['status'] for a in apps)
assert counts==summary['counts']=={'적합 후보':60,'조건부':178,'보류':57,'제외':27}
assert sum(counts.values())==322
assert sum(bool(a.get('detail')) and not a.get('detailError') for a in apps)==307
assert sum(bool(a.get('detailError')) for a in apps)==15
assert len(summary['fitActivityFamilies'])==9 and sum(summary['fitActivityFamilies'].values())==60
with path.with_suffix('.csv').open(encoding='utf-8-sig') as f:rows=list(csv.DictReader(f))
assert len(rows)==322
assert [(a['appId'],a['assessment']['status']) for a in apps]==[(r['패키지ID'],r['분류']) for r in rows]
report=(ROOT/f'docs/review/{TS}-expanded-candidates-review.md').read_text()
assert report.count(' | 추가 | [')==44 and report.count(' | 기존 | [')==16
for field in ['data/store/20261121135057-expanded-candidates-kr.json','data/store/20261121135057-expanded-candidates-kr.csv']:
 assert (ROOT/field).exists()
print('통과: 6요청·5유효·428노출·106중복·322고유·기존100보존·신규222·상세307/15·적합60/조건부178/보류57/제외27·CSV/JSON/보고서 일치')
