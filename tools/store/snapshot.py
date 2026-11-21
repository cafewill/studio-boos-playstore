#!/usr/bin/env python3
"""Google Play FAMILY TOP_FREE 응답을 사실 데이터 스냅샷으로 변환한다."""
import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


def import_chart(raw_path, output_path):
    raw = Path(raw_path).read_bytes()
    envelope = json.loads(raw.decode().split('\n')[3])
    payload = json.loads(envelope[0][2])
    apps = payload[0][1][0][28][0]
    rows = []
    for i, app in enumerate(apps, 1):
        a = app[0]
        rows.append({'sourceRank': i, 'appId': a[0][0], 'title': a[3],
                     'developer': a[14],
                     'url': f'https://play.google.com/store/apps/details?id={a[0][0]}&hl=ko&gl=KR'})
    if len(rows) != 100 or len({a['appId'] for a in rows}) != 100:
        raise ValueError('서로 다른 100개 앱 응답이 아닙니다. 기존 결과를 덮어쓰지 않습니다.')
    stamp = datetime.fromtimestamp(Path(raw_path).stat().st_mtime, timezone.utc).isoformat()
    result = {'collectedAt': stamp, 'country': 'KR', 'language': 'ko',
              'category': 'FAMILY', 'collection': 'TOP_FREE', 'requestedCount': 100,
              'rankMeaning': 'FAMILY TOP_FREE KR 비로그인 요청의 응답 순서; 전체 아동 앱 통합 순위나 기기 UI 순위 검증 아님',
              'sourceUrl': 'https://play.google.com/store/apps/category/FAMILY?hl=ko&gl=KR',
              'rawResponseSha256': hashlib.sha256(raw).hexdigest(), 'apps': rows}
    Path(output_path).write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(f'{len(rows)}개 저장: {output_path}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('raw', help='curl로 저장한 batchexecute 응답')
    parser.add_argument('output', help='신규 스냅샷 JSON 경로; 상세 파싱 전 사용')
    args = parser.parse_args()
    if Path(args.output).exists():
        parser.error('출력 파일이 이미 있습니다. 새로운 시각의 파일명을 사용하세요.')
    import_chart(args.raw, args.output)
