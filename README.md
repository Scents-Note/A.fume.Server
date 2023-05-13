# A.fume.Server

> A.fume Backend Server Repository 입니다.

# [서비스 소개](./docs/about_service.md)

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

# [시작하기](./docs/getting_started.md)

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

-   0.0.9
    -   User gender, birth nullable 로 변경
    -   엔드포인트 변경 - `/system/supportable` 내 deviceOS 파라미터 추가
    -   recommendPersonalPerfume 에서 유효 시향노트 3개 이상인 향수 랜덤 조회하도록 변경
-   0.0.8
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
