# 환경

-   dev
    -   목적: 개발환경에서 사용.
    -   기준 브랜치: dev
-   production-1
    -   목적: ios 용 엔드포인트
-   production-2
    -   목적: android 용 엔드포인트

*   production 이 현재 1과 2, 2개가 공존하는 상황. 초기에 안전성을 위해 분리한 것으로 보이나, 불필요한 분리여서 합치는 것이 좋다고 판단.

# 배포

-   dev 환경
    -   dev 브랜치에 병합시 자동으로 배포됨
-   production-1, production-2
    -   [저장소의 깃헙액션 페이지](https://github.com/Scents-Note/A.fume.Server/actions) 에서 각 환경에 해당하는 워크플로우 진입 후, 아래 과정을 따라 수행
        -   Run workflow 드랍다운 클릭
        -   배포를 원하는 브랜치 선택
        -   초록색 Run workflow 버튼 클릭
