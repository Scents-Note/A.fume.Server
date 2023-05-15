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
