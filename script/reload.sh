#!/bin/sh
npm install
prebuild.sh

npm audit fix;
# npm test;
pm2 restart ecosystem.json;
echo $?
