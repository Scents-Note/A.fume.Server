# A.fume.Server

> A.fume Backend Server Repository 입니다.

# 서비스 소개

![A.fume](https://user-images.githubusercontent.com/9072200/153219391-98452915-2508-4643-b488-2cbbdde17b0c.jpg)

## 🎯 MISSION - 쉽고 즐거운 향수라이프를 만듭니다.

누구나 쉽고 즐겁게 나다운 향을 발견하고, 진정으로 그 향을 즐길 수 있기를 희망합니다.

내가 원하는, 그리고 나와 어울리는 향을 통해 자신을 표현해보세요.

## 🤝 CORE VALUE - 3E

-   **EASY**

어퓸에서는 쉽습니다. 어렵고 번거롭지 않습니다.

어퓸에서는 원하는 향수를 쉽게 찾을 수 있고, 다양하고 자세한 정보로 향수를 쉽게 알 수 있습니다.

-   **ENJOY**

어퓸과 함께하면 즐거운 향수라이프가 가능합니다. 향수는 즐거운 취미생활이어야 합니다.

어퓸에서는 향수에 대한 다양한 정보를 하나의 재미있는 콘텐츠처럼 볼 수 있습니다.

이를 통해 나만의 향수를 찾는 과정이 즐거워집니다.

-   **EMOTIONAL**

어퓸은 감성적입니다.

향수라는 아주 매력적이고 감성적인 아이템을 다루는 서비스인만큼

서비스의 모든 곳에서 감성을 느낄 수 있습니다.

## 🔑 솔루션 - 향수 정보 서비스, 어퓸을 소개합니다.

어퓸은 향수만을 전문으로하여 정보를 제공하는 향수 정보 서비스입니다.

어퓸에서는 내가 원하는 향수를 쉽게 찾을 수 있고, 향수에 대한 정보를 쉽고 자세하게 확인할 수 있습니다.

화장품을 알아볼 땐 화해가 있다면 향수를 알아볼 땐 어퓸이 있는거죠.

## 어퓸의 주요 기능

-   **향수 추천** : 흔한 향수 추천이 아닌, 당신의 취향에 맞는 향수들을 골라 추천해드립니다.

-   **향수 검색** : 향 계열별 필터를 통해 내가 원하는 향의 향수들만 한 번에 모아볼 수 있습니다.

-   **향수 정보** : 향수의 노트 구성, 조향 스토리, 브랜드, 가격, 시향기 등 향수에 대한 모든 정보들을 한 곳에서 모아볼 수 있습니다.

-   **시향 위시리스트** : 혹시 나중에 맡아보고싶은 향수가 생겼나요? 위시리스트에 추가하여 보세요. 나중에 시향할 때 한 번에 볼 수 있습니다.

-   **시향 노트** : 시향을 하셨나요? 그 순간 어떻게 느꼈는지 까먹기 전에 나만의 시향 노트에 적어보세요. 단순 메모뿐만 아니라 계절감, 성별, 지속력, 잔향감 등도 선택할 수 있습니다.

-   **향수 컬렉션** : 그 동안 내가 썼던 향수들, 한 곳에 모아보세요. 나의 향수 취향을 한 눈에 파악할 수 있을거에요.

# 프로젝트 구조

![image](https://user-images.githubusercontent.com/9072200/153235195-01b9024b-4f44-41bd-9dc6-dca90ac81157.png)

# 기술 스택

| 분류          | 기술 스택                            |
| :------------ | ------------------------------------ |
| 런타임        | nodejs                               |
| framework     | express                              |
| language      | typescript, javascript, shell script |
| open api      | swagger                              |
| CI/CD         | pm2, github action                   |
| cloud service | EC2, RDS, S3                         |
| test library  | mocha                                |
| logging       | winston, morgan                      |

# 설치 방법

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

# 라이센스

`GNU GENERAL PUBLIC LICENSE Version 3` 라이센스를 준수하며 `LICENSE`에서 자세한 정보를 확인할 수 있습니다.

# 기여 방법

## A. 오픈 소스를 통한 참여

1. (<https://github.com/yourname/yourproject/fork>)을 포크합니다.
2. (`git checkout -b feature/fooBar`) 명령어로 새 브랜치를 만드세요.
3. (`git commit -am 'Add some fooBar'`) 명령어로 커밋하세요.
4. (`git push origin feature/fooBar`) 명령어로 브랜치에 푸시하세요.
5. 풀리퀘스트를 보내주세요.

## B. 팀원으로 참여

사이드프로젝트 팀원으로 참여하고 싶으신분은 주저하지 말고 아래 연락처로 연락 주세요 :)
| name | role | email |
|:---|:---|:---|
| 이신일 | PM | |
| 윤희성 | Server | quokkaman@kaka.com |

# 팀원 소개

-   윤희성 / @heesung6701 / quokkaman@kakao.com

-   조하담 / @ChoHadam /

# 업데이트 내역

-   snapshot
    -   ioredis 의존 추가
    -   엔드포인트 추가 - 비슷한 향수 추천 데이터 DB 반영
    -   엔드포인트 추가 - 비슷한 향수 추천 데이터 조회
    -   엔드포인트 추가 - 비밀번호 확인
    -   모니터링 기능 추가
-   0.0.7
    -   향수 세부 정보에서 시향 노트 정보 적용되지 않는 버그
-   0.0.6
    -   새로 추가된 향수 개수 변경 7 -> 50
    -   키워드 제한 제거
    -   정보 없음 추가
    -   시향 정보 상세에서 normal로 보내지던거 medium으로 변경
    -   시향노트 없는 경우 0 반환
    -   향수 이미지 버그 수정
-   0.0.5
    -   getPerfume 에서 지속력 보통이 api의 expect(medium)와 actual(normal) 불일치 하는 버그 수정
-   0.0.4
    -   perfume search 기능에서 keyword, ingredient 에서 Score로직 삭제하고 AND 조건으로 변경
    -   getLikedPerfume `/user/{userIdx}/perfume/liked:`에서 response type 변경(`PerfumeResponse` -> `PerfumeWishedResponse`)
-   0.0.3

    -   default review 컨셉 제거
    -   ingredient category 개념 추가
        -   Ingredient_category table 추가
        -   ingredient Model에 category_idx 추가
    -   추천 정보가 존재하지 않는 경우 random 데이터 반환
    -   safe delete(deleted_at) 추가
    -   SearchHistory 로직 개선
    -   영어 검색 지원
    -   향수 추천시 최소 7개 보장하도록 수정
    -   비슷한 향수 추천 엔드포인트(/perfume/{perfumeIdx}/similar) 추가

-   0.0.2

    -   paging방식 lastPosition + pagingSize로 변경
    -   base path 변경

-   0.0.1
    -   Typescript 적용
    -   swagger 적용
    -   FullText Index 적용
    -   Logging winston 적용
    -   alias 적용

# 기술 블로그

[Layer-Architecture](https://github.com/A-fume/A.fume.Server/wiki/Layer-Architecture)

[모델 세분화](https://github.com/A-fume/A.fume.Server/wiki/%EB%8D%B0%EC%9D%B4%ED%84%B0-Model-%EC%84%B8%EB%B6%84%ED%99%94)

[github-action](https://github.com/A-fume/A.fume.Server/wiki/Github-Aciton)

[ER-Diagram]()

# 연관 프로젝트

[A.fume.RawConverter](https://github.com/A-fume/A.fume.RawConverter)

Database <-> Excel 을 수행하는 Python script이다.
여러개의 Table을 하나의 Excel파일로 변환하며
Excel파일 내에서 배경색상이 변경된 부분에 해당하는 값을 Database에 Update하는 역할을 수행한다.

[A.fume.Crawler](https://github.com/A-fume/A.fume.Crawler)

향수와 관련된 데이터를 수집하기 위한 크롤러

# 관련 문서

[wiki]: https://github.com/A-fume/A.fume.Server/wiki
