#!/bin/sh
npm install;
npm test;
pm2 reload ecosystem.config.js --only afume-server-prd;
echo $?
