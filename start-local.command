#!/bin/zsh
# 참고 프로젝트와 동일한 Python 기본 정적 서버를 실행한다.
set -eu
cd -- "$(dirname -- "$0")"
print '작은 발견 놀이터: http://127.0.0.1:7904/'
print '서버가 시작되면 위 주소를 브라우저에서 여세요. 종료는 Control+C입니다.'
exec python3 -m http.server 7904 --bind 127.0.0.1
