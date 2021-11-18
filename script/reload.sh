#!/bin/sh

# npm test;
pm2 restart ecosystem.json;
echo $?
