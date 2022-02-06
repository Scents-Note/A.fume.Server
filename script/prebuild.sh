#!/bin/sh
npm ci

npm install -g pm2
npm install -g mocha
npm install -g typescript
npm install -g ts-node
npm install -g tsconfig-paths

npm audit fix