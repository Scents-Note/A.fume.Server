#!/bin/sh
npm install;
npm test;
pm2 reload ecosystem.json;
echo $?
