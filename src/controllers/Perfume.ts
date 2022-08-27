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
    PerfumeSearchDTO,
    PagingDTO,
} from '@dto/index';
import { GenderMap } from '@src/utils/enumType';
import {
    DEFAULT_RECOMMEND_REQUEST_SIZE,
    DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE,
} from '@utils/constants';
import _ from 'lodash';

const LOG_TAG: string = '[Perfume/Controller]';

let Perfume: PerfumeService = new PerfumeService();
let SearchHistory: SearchHistoryService = new SearchHistoryService();

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
 *                 - $ref: '#/definitions/PerfumeDetailResponse'
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
        SearchHistory.recordInquire(
            loginUserIdx,
            perfumeIdx,
            '' /* 향후 경로가 다양화 되면 경로 기록 용 */
        ),
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
 *           $ref: '#/definitions/PerfumeSearchRequest'
 *       - name: sort
 *         in: query
 *         type: string
 *         enum:
 *         - createdAt_asc
 *         - createdAt_desc
 *         required: false
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/PerfumeResponse'
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
        PerfumeSearchRequest.createByJson(req.body);
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} likePerfume(userIdx = ${loginUserIdx}, query = ${req.query}, body = ${req.body})`
    );
    const perfumeSearchDTO: PerfumeSearchDTO =
        perfumeSearchRequest.toPerfumeSearchDTO(loginUserIdx);
    Perfume.searchPerfume(perfumeSearchDTO, pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
            return result.convertType(PerfumeResponse.createByJson);
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
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/PerfumeResponse'
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
    req.query.requestSize =
        req.query.requestSize || DEFAULT_RECENT_ADDED_PERFUME_REQUEST_SIZE;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} getRecentPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    Perfume.recentSearch(loginUserIdx, pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return result.convertType(PerfumeResponse.createByJson);
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
 *       description: 데이터를 활용해서 향수를 추천해준다. <br/> 반환 되는 정보 [향수, 좋아요 여부] <br/> <h3> 미 로그인 시 랜덤 기반 향수 추천 </h3> <br/>
 *       operationId: recommendPersonalPerfume
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/PerfumeRecommendResponse'
 *       x-swagger-router-controller: Perfume
 * */
const recommendPersonalPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    req.query.requestSize =
        req.query.requestSize || DEFAULT_RECOMMEND_REQUEST_SIZE;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} recommendPersonalPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    const pagingDTO: PagingDTO = pagingRequestDTO.toPageDTO();
    return (
        loginUserIdx > 0
            ? Perfume.recommendByUser(loginUserIdx, pagingDTO)
            : Perfume.getPerfumesByRandom(pagingDTO.limit)
    )
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            const needSize: number = pagingDTO.limit - result.rows.length;
            if (needSize <= 0) {
                return result;
            }
            return Perfume.getPerfumesByRandom(needSize).then(
                (randomList: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
                    return new ListAndCountDTO<PerfumeThumbKeywordDTO>(
                        pagingDTO.limit,
                        _.concat(
                            result.rows,
                            randomList.rows.slice(0, needSize)
                        )
                    );
                }
            );
        })
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            return result.convertType(PerfumeRecommendResponse.createByJson);
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
 *       - name: age
 *         in: query
 *         type: integer
 *         required: false
 *       - name: gender
 *         in: query
 *         type: string
 *         enum:
 *         - MAN
 *         - WOMAN
 *         required: false
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/PerfumeRecommendResponse'
 *       x-swagger-router-controller: Perfume
 * */
const recommendCommonPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    req.query.requestSize =
        req.query.requestSize || DEFAULT_RECOMMEND_REQUEST_SIZE;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    const ageGroup: number = Math.floor(req.query.age / 10) * 10;
    const gender: number = GenderMap[req.query.gender];
    logger.debug(
        `${LOG_TAG} recommendCommonPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    const pagingDTO: PagingDTO = pagingRequestDTO.toPageDTO();
    Perfume.recommendByUser(loginUserIdx, pagingDTO, ageGroup, gender)
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            const needSize: number = pagingDTO.limit - result.rows.length;
            if (needSize <= 0) {
                return result;
            }
            return Perfume.getPerfumesByRandom(needSize).then(
                (randomList: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
                    return new ListAndCountDTO<PerfumeThumbKeywordDTO>(
                        pagingDTO.limit,
                        _.concat(
                            result.rows,
                            randomList.rows.slice(0, needSize)
                        )
                    );
                }
            );
        })
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            return result.convertType(PerfumeRecommendResponse.createByJson);
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
 *                       allOf:
 *                       - $ref: '#/definitions/PerfumeResponse'
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
            return result.convertType(PerfumeResponse.createByJson);
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
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/PerfumeResponse'
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
    req.query.requestSize =
        req.query.requestSize || DEFAULT_RECOMMEND_REQUEST_SIZE;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    logger.debug(
        `${LOG_TAG} getNewPerfume(userIdx = ${loginUserIdx}, query = ${req.query})`
    );
    Perfume.getNewPerfume(loginUserIdx, pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return result.convertType(PerfumeResponse.createByJson);
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
 *       - name: requestSize
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
 *                   - $ref: '#/definitions/PerfumeResponse'
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
    Perfume.getLikedPerfume(userIdx, pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return result.convertType(PerfumeResponse.createByJson);
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
