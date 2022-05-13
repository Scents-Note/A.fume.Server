import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger, LoggerHelper } from '@modules/winston';

import {
    MSG_GET_PERFUME_DETAIL_SUCCESS,
    MSG_GET_SEARCH_PERFUME_SUCCESS,
    LIKE_PERFUME,
    LIKE_PERFUME_CANCEL,
    MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS,
    MSG_GET_RECOMMEND_PERFUME_BY_USER,
    MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER,
    MSG_GET_PERFUME_FOR_SURVEY_SUCCESS,
    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
    MSG_GET_LIKED_PERFUME_LIST_SUCCESS,
    MSG_ABNORMAL_ACCESS,
} from '@utils/strings';

import StatusCode from '@utils/statusCode';

import PerfumeService from '@services/PerfumeService';
import SearchHistoryService from '@services/SearchHistoryService';

import { PerfumeSearchRequest } from '@request/index';
import {
    PerfumeDetailResponse,
    PerfumeResponse,
    PerfumeRecommendResponse,
} from '@response/perfume';

import { PagingRequestDTO } from '@request/index';
import { ResponseDTO, SimpleResponseDTO } from '@response/index';
import {
    PerfumeIntegralDTO,
    ListAndCountDTO,
    PerfumeSearchResultDTO,
    PerfumeThumbDTO,
    PerfumeThumbKeywordDTO,
} from '@dto/index';

const LOG_TAG: string = '[Perfume/Controller]';

let Perfume: PerfumeService = new PerfumeService();
let SearchHistory: SearchHistoryService = new SearchHistoryService();

/**
 * @swagger
 * definitions:
 *   PerfumeInfo:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       englishName:
 *         type: string
 *       brandIdx:
 *         type: integer
 *       imageUrl:
 *         type: string
 *     example:
 *       name: 154 코롱
 *       englishName: 154 kolon
 *       brandIdx: 1
 *       imageUrl: https://contents.lotteon.com/itemimage/_v065423/LE/12/04/59/50/19/_1/22/48/08/13/9/LE1204595019_1224808139_1.jpg/dims/resizef/554X554
 *   Perfume:
 *     allOf:
 *     - $ref: '#/definitions/PerfumeInfo'
 *     - type: object
 *       properties:
 *         perfumeIdx:
 *           type: integer
 *     example:
 *       perfumeIdx: 1
 *       name: 154 코롱
 *       imageUrl: https://contents.lotteon.com/itemimage/_v065423/LE/12/04/59/50/19/_1/22/48/08/13/9/LE1204595019_1224808139_1.jpg/dims/resizef/554X554
 *       brandName: (테스트)조말론
 *   PerfumeDetailInfo:
 *     properties:
 *       story:
 *         type: string
 *       abundanceRate:
 *         type: string
 *         enum:
 *         - None
 *         - 오 드 코롱
 *         - 코롱
 *         - 오 드 뚜왈렛
 *         - 오 드 퍼퓸
 *         - 퍼퓸
 *       imageUrls:
 *         type: array
 *         items:
 *           type: string
 *       volumeAndPrice:
 *         type: array
 *         items:
 *           type: string
 *     example:
 *       story: 조 말론 런던 1호점이 위치한 런던의 거리 번호입니다. 광범위한 후각적 탐구를 요하는 이 향수는 만다린, 그레이프 프루트\
 *         , 바질, 너트맥, 베티버와 같은 브랜드를 대표하는 성분들을 모두 함유하고 있습니다. 다양한 느낌을 연출하는 향입니다.
 *       abundanceRate: 코롱
 *       volumeAndPrice:
 *       - 90,000/30ml
 *       - 100,000/50ml
 *       - 190,000/100ml
 *       imageUrls: []
 *   PerfumeSummary:
 *     properties:
 *       score:
 *         type: number
 *         description: 점수 평균 값
 *         minimum: 0
 *         maximum: 5
 *       longevity:
 *         type: object
 *         description: 지속감
 *         properties:
 *           veryWeak:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 매우 약함
 *           weak:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 약함
 *           medium:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 보통
 *           strong:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 강함
 *           veryStrong:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 매우 강함
 *       sillage:
 *         type: object
 *         description: 잔향감
 *         properties:
 *           light:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 약함
 *           normal:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 보통
 *           heavy:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 강함
 *       seasonal:
 *         type: object
 *         properties:
 *           spring:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 봄
 *           summer:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 여름
 *           fall:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 가을
 *           winter:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 겨울
 *     example:
 *       score: 5.4
 *       seasonal:
 *         spring: 0
 *         summer: 30
 *         fall: 30
 *         winter: 40
 *       sillage:
 *         light: 40
 *         medium: 20
 *         heavy: 40
 *       longevity:
 *         veryWeak: 10
 *         weak: 10
 *         normal: 20
 *         strong: 20
 *         veryStrong: 10
 *   PerfumeNote:
 *     properties:
 *       noteType:
 *         type: integer
 *         description: 0은 일반 노트, 1은 single 노트
 *       ingredients:
 *         $ref: '#/definitions/IngredientMap'
 * */

/**
 * @swagger
 *   /perfume/{perfumeIdx}:
 *     get:
 *       tags:
 *       - perfume
 *       summary: 향수 세부 정보 조회
 *       operationId: getPerfume
 *       security:
 *         - userToken: []
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: perfumeIdx
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 세부 조회 성공
 *               data:
 *                 allOf:
 *                 - $ref: '#/definitions/Perfume'
 *                 - type: object
 *                   properties:
 *                     isLiked:
 *                       type: integer
 *                     reviewIdx:
 *                       type: integer
 *                     Keywords:
 *                       type: array
 *                       items:
 *                         $ref: '#/definitions/KeywordInfo'
 *                 - $ref: '#/definitions/PerfumeDetailInfo'
 *                 - $ref: '#/definitions/PerfumeNote'
 *                 - $ref: '#/definitions/PerfumeSummary'
 *                 example:
 *                   isLiked: true
 *                   story: 조 말론 런던 1호점이 위치한 런던의 거리 번호입니다. 광범위한 후각적 탐구를 요하는 이 향수는 만다린, 그레이프 프루트\                        , 바질, 너트맥, 베티버와 같은 브랜드를 대표하는 성분들을 모두 함유하고 있습니다. 다양한 느낌을 연출하는 향입니다.
 *                   abundanceRate: 코롱
 *                   imageUrls: []
 *                   volumeAndPrice:
 *                   - 90,000/30ml
 *                   - 100,000/50ml
 *                   - 19,000/100ml
 *                   Keywords:
 *                   - 시원한
 *                   - 차가운
 *                   noteType: 0
 *                   reviewIdx: 1
 *                   ingredients:
 *                     top: 재료1, 재료5
 *                     middle: 재료2, 재료6
 *                     base: 재료3, 재료4, 재료7
 *                     single: ''
 *                   score: 5.4
 *                   seasonal:
 *                     spring: 0
 *                     summer: 30
 *                     fall: 30
 *                     winter: 40
 *                   sillage:
 *                     light: 40
 *                     medium: 20
 *                     heavy: 40
 *                   longevity:
 *                     veryWeak: 10
 *                     weak: 10
 *                     normal: 20
 *                     strong: 20
 *                     veryStrong: 10
 *         401:
 *           description: Token is missing or invalid
 *         404:
 *           description: Perfume not found
 *       x-swagger-router-controller: Perfume
 * */
const getPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const perfumeIdx: number = req.params['perfumeIdx'];
    if (isNaN(perfumeIdx)) {
        next();
        return;
    }
    const loginUserIdx: number = req.middlewareToken.loginUserIdx || -1;
    logger.debug(
        `${LOG_TAG} likePerfume(userIdx = ${loginUserIdx}, params = ${req.params})`
    );
    Promise.all([
        Perfume.getPerfumeById(perfumeIdx, loginUserIdx),
        SearchHistory.incrementCount(loginUserIdx, perfumeIdx),
    ])
        .then(([result, _]: [PerfumeIntegralDTO, void]) => {
            return PerfumeDetailResponse.createByPerfumeIntegralDTO(result);
        })
        .then((response: PerfumeDetailResponse) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<PerfumeDetailResponse>(
                    MSG_GET_PERFUME_DETAIL_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/search:
 *     post:
 *       tags:
 *       - perfume
 *       summary: 향수 검색
 *       description: 카테코리(키워드, 브랜드, 재료)는 AND 검색이며 카테고리 내 선택은 OR 검색이다. <br/> 반환 되는 정보 [향수, 좋아요 여부]
 *       operationId: searchPerfume
 *       security:
 *         - userToken: []
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             searchText:
 *               type: string
 *               example: 'Tom'
 *             keywordList:
 *               type: array
 *               items:
 *                 type: integer
 *               example: []
 *             ingredientList:
 *               type: array
 *               items:
 *                 type: integer
 *               example: []
 *             brandList:
 *               type: array
 *               items:
 *                 type: integer
 *               example: []
 *       - name: sort
 *         in: query
 *         type: string
 *         enum:
 *         - createdAt_asc
 *         - createdAt_desc
 *         required: false
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 검색 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                       - $ref: '#/definitions/Perfume'
 *                       - type: object
 *                         properties:
 *                           isLiked:
 *                             type: boolean
 *                         example:
 *                           isLiked: true
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Perfume
 * */
const searchPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx || -1;
    const perfumeSearchRequest: PerfumeSearchRequest =
        PerfumeSearchRequest.createByJson(
            Object.assign({ userIdx: loginUserIdx }, req.body)
        );
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} likePerfume(userIdx = ${loginUserIdx}, query = ${req.query}, body = ${req.body})`
    );
    Perfume.searchPerfume(perfumeSearchRequest, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} searchPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_SEARCH_PERFUME_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/{perfumeIdx}/like:
 *     post:
 *       tags:
 *       - perfume
 *       summary: 향수 좋아요
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 향수 좋아요 / 좋아요 취소를 수행한다. <br/> 반환 되는 정보 [최종 좋아요 상태]
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       operationId: likePerfume
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: perfumeIdx
 *         in: path
 *         required: true
 *         type: integer
 *         format: int64
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 세부 조회 성공
 *               data:
 *                 type: boolean
 *                 example: true
 *                 description: 요청 이후 좋아요 상태
 *         401:
 *           description: Token is missing or invalid
 *         404:
 *           description: Perfume not found
 *       x-swagger-router-controller: Perfume
 * */
const likePerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const perfumeIdx: number = req.params['perfumeIdx'];
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    logger.debug(
        `${LOG_TAG} likePerfume(userIdx = ${loginUserIdx}, params = ${req.params})`
    );
    Perfume.likePerfume(loginUserIdx, perfumeIdx)
        .then((result: boolean) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} likePerfume's result = ${result}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<boolean>(
                    result ? LIKE_PERFUME : LIKE_PERFUME_CANCEL,
                    result
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/recent:
 *     get:
 *       tags:
 *       - perfume
 *       summary: 최근 조회한 향수 조회
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 최근에 향수 세부 보기를 수행한 향수들을 조회한다. <br/> 반환 되는 정보 [향수, 좋아요 여부]
 *       operationId: getRecentPerfume
 *       security:
 *       - userToken: []
 *       x-security-scopes:
 *       - user
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 검색 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                       - $ref: '#/definitions/Perfume'
 *                       - type: object
 *                         properties:
 *                           isLiked:
 *                             type: boolean
 *                         example:
 *                           isLiked: true
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Perfume
 * */
const getRecentPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} recommendPersonalPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    Perfume.recentSearch(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getRecentPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/recommend/personal:
 *     get:
 *       tags:
 *       - perfume
 *       summary: 향수 개인 맞춤 추천
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 데이터를 활용해서 향수를 추천해준다. <br/> 반환 되는 정보 [향수, 좋아요 여부]
 *       operationId: recommendPersonalPerfume
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 검색 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                       - $ref: '#/definitions/Perfume'
 *                       - type: object
 *                         properties:
 *                           isLiked:
 *                             type: boolean
 *                         example:
 *                          isLiked: true
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Perfume
 * */
const recommendPersonalPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} recommendPersonalPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    Perfume.recommendByUser(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            return new ListAndCountDTO<PerfumeRecommendResponse>(
                result.count,
                result.rows.map(PerfumeRecommendResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeRecommendResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} recommendPersonalPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeRecommendResponse>>(
                    MSG_GET_RECOMMEND_PERFUME_BY_USER,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/recommend/common:
 *     get:
 *       tags:
 *       - perfume
 *       summary: 향수 일반 추천 (성별, 나이 반영)
 *       description: 유저 연령, 성별에 따른 향수를 추천해준다. (로그인 이전의 경우 20대 여성 기본 값) <br/> 반환 되는 정보 [향수, 좋아요 여부]
 *       operationId: recommendCommonPerfume
 *       security:
 *         - userToken: []
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 검색 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                       - $ref: '#/definitions/Perfume'
 *                       - type: object
 *                         properties:
 *                           isLiked:
 *                             type: boolean
 *                         example:
 *                           isLiked: true
 *       x-swagger-router-controller: Perfume
 * */
const recommendCommonPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} recommendCommonPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    Perfume.recommendByUser(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            return new ListAndCountDTO<PerfumeRecommendResponse>(
                result.count,
                result.rows.map(PerfumeRecommendResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeRecommendResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} recommendCommonPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeRecommendResponse>>(
                    MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/survey:
 *     get:
 *       tags:
 *       - perfume
 *       summary: 서베이 추천 향수 조회
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 유저의 성별에 따라서 다른 향수 리스트를 반환한다. <br/> 반환 되는 정보 [향수]
 *       operationId: getSurveyPerfume
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       produces:
 *       - application/json
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 서베이 추천 향수 조회 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       $ref: '#/definitions/Perfume'
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Perfume
 * */
const getSurveyPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    logger.debug(`${LOG_TAG} getSurveyPerfume(userIdx = ${loginUserIdx})`);
    Perfume.getSurveyPerfume(loginUserIdx)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getSurveyPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_PERFUME_FOR_SURVEY_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /perfume/new:
 *     get:
 *       tags:
 *       - perfume
 *       summary: 새로 등록한 향수 조회
 *       description: 최근에 서버에 등록된 향수를 조회한다. <br/> 반환 되는 정보 [향수, 좋아요 여부]
 *       operationId: getNewPerfume
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 향수 검색 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                       - $ref: '#/definitions/Perfume'
 *                       - type: object
 *                         properties:
 *                           isLiked:
 *                             type: boolean
 *                         example:
 *                           isLiked: true
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Perfume
 * */
const getNewPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} getNewPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    Perfume.getNewPerfume(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getNewPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /user/{userIdx}/perfume/liked:
 *     get:
 *       tags:
 *       - perfume
 *       summary: read user's likedPerfume
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 유저가 좋아요한 향수 조회 <br/> 반환 되는 정보 [향수]
 *       operationId: getLikedPerfume
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: userIdx
 *         in: path
 *         required: true
 *         type: string
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 유저가 좋아요한 향수 조회 성공
 *               data:
 *                 type: array
 *                 items:
 *                   allOf:
 *                   - $ref: '#/definitions/Perfume'
 *         default:
 *           description: successful operation
 *       x-swagger-router-controller: Perfume
 * */
const getLikedPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const userIdx: number = req.params['userIdx'];
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} getLikedPerfume(userIdx = ${userIdx}, loginUserIdx = ${loginUserIdx}, query = ${req.query})`
    );
    if (loginUserIdx != userIdx) {
        res.status(StatusCode.FORBIDDEN).json(
            new SimpleResponseDTO(MSG_ABNORMAL_ACCESS)
        );
        return;
    }
    Perfume.getLikedPerfume(userIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getLikedPerfume's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_LIKED_PERFUME_LIST_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => {
            next(err);
        });
};

module.exports.getPerfume = getPerfume;
module.exports.searchPerfume = searchPerfume;
module.exports.likePerfume = likePerfume;
module.exports.getRecentPerfume = getRecentPerfume;
module.exports.recommendPersonalPerfume = recommendPersonalPerfume;
module.exports.recommendCommonPerfume = recommendCommonPerfume;
module.exports.getSurveyPerfume = getSurveyPerfume;
module.exports.getNewPerfume = getNewPerfume;
module.exports.getLikedPerfume = getLikedPerfume;

module.exports.setPerfumeService = (service: PerfumeService) => {
    Perfume = service;
};

module.exports.setSearchHistoryService = (service: SearchHistoryService) => {
    SearchHistory = service;
};
