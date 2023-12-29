#!/bin/bash

# 에러 핸들링 추가
set -e

# ecosystem.json 사용하여 pm2로 프로세스 재시작
if [[ -f "ecosystem.json" ]]; then
    pm2 restart ecosystem.json || exit 1
fi