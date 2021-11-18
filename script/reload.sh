#!/bin/sh

# npm test;
npm run build
pm2 restart ecosystem.json;
echo $?
