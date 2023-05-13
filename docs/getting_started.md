# 시작하기

## 설치/실행 방법

1. .env 파일 생성

project_root에 .env 생성

2. 의존성 설치

```sh
./script/rebuild.sh
```

3. 서버 실행

```sh
npm start
```

> pm2를 활용한 서버 실행

project_root 경로에 .ecosystem.json 생성

```sh
./script/reload.sh
```

## 테스트 수행

전체 테스트 코드 수행

```sh
npm test
```

하나의 테스트 코드 수행

```sh
npm run test-each ./test/...
```
