#!/bin/bash

# 에러 핸들링 추가
set -e

# ecosystem.json 파일이 존재하면 pm2로 실행 중인 프로세스를 중지
if [[ -f "ecosystem.json" ]]; then
    pm2 stop ecosystem.json || true
fi

# npm run build 명령어로 프로젝트 빌드
npm run build || exit 1

# ecosystem.json 사용하여 pm2로 프로세스 재시작
if [[ -f "ecosystem.json" ]]; then
    pm2 restart ecosystem.json || exit 1
fi