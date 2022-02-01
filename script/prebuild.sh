#!/bin/sh
npm ci

npm install -g mocha
npm install -g typescript
npm install -g ts-node

npm audit fix