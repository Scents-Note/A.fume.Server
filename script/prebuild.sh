#!/bin/bash

if [[ -f "ecosystem.json" ]]; then
    pm2 stop ecosystem.json
fi

npm ci