#!/bin/sh
npm install;
npm test;
NODE_ENV=prd
PORT=3001
pm2 reload afume-server-prd --update-env;
echo $?
