#!/bin/sh

# npm test;
pm2 stop ecosystem.json
npm run build
pm2 restart ecosystem.json
echo $?
