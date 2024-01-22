#!/bin/bash

# 에러 핸들링 추가
set -e

# ecosystem.json 파일이 존재하면 pm2로 실행 중인 프로세스 중지
if [[ -f "ecosystem.json" ]]; then
    pm2 stop ecosystem.json || true
fi

# 종속성 설치
npm ci || exit 1

# 프로젝트 빌드
npm run build || exit 1

# Exit code를 출력하여 스크립트가 성공적으로 실행되었는지 확인
echo $?