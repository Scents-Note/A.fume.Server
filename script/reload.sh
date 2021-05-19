#!/bin/sh
npm install;
npm audit fix;
npm test;
pm2 reload ecosystem.json;
echo $?
