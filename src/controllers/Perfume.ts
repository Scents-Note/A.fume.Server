import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger, LoggerHelper } from '../modules/winston';

import StatusCode from '../utils/statusCode';
import PerfumeService from '../service/PerfumeService';
import SearchHistoryService from '../service/SearchHistoryService';

import { PerfumeSearchRequest } from '../data/request/perfume';
import {
    PerfumeDetailResponse,
    PerfumeResponse,
    PerfumeRecommendResponse,
} from '../data/response/perfume';

import { PagingRequestDTO } from '../data/request/common';
import { ResponseDTO, SimpleResponseDTO } from '../data/response/common';
import PerfumeIntegralDTO from '../data/dto/PerfumeIntegralDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import PerfumeSearchResultDTO from '../data/dto/PerfumeSearchResultDTO';
import PerfumeThumbDTO from '../data/dto/PerfumeThumbDTO';
import PerfumeThumbKeywordDTO from '../data/dto/PerfumeThumbKeywordDTO';

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
} from '../utils/strings';

const LOG_TAG: string = '[Perfume/Controller]';

let Perfume: PerfumeService = new PerfumeService();
let SearchHistory: SearchHistoryService = new SearchHistoryService();

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
    Promise.all([
        Perfume.getPerfumeById(perfumeIdx, loginUserIdx),
        SearchHistory.incrementCount(loginUserIdx, perfumeIdx),
    ])
        .then(([result, _]: [PerfumeIntegralDTO, void]) => {
            return PerfumeDetailResponse.createByPerfumeIntegralDTO(result);
        })
        .then((data: PerfumeDetailResponse) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<PerfumeDetailResponse>(
                    MSG_GET_PERFUME_DETAIL_SUCCESS,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

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
    Perfume.searchPerfume(perfumeSearchRequest, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} searchPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_SEARCH_PERFUME_SUCCESS,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

const likePerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const perfumeIdx: number = req.params['perfumeIdx'];
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
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

const getRecentPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Perfume.recentSearch(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getRecentPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_RECENT_SEARCH_PERFUME_SUCCESS,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

const recommendPersonalPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Perfume.recommendByUser(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            return new ListAndCountDTO<PerfumeRecommendResponse>(
                result.count,
                result.rows.map(PerfumeRecommendResponse.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeRecommendResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} recommendPersonalPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeRecommendResponse>>(
                    MSG_GET_RECOMMEND_PERFUME_BY_USER,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

const recommendCommonPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Perfume.recommendByUser(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbKeywordDTO>) => {
            return new ListAndCountDTO<PerfumeRecommendResponse>(
                result.count,
                result.rows.map(PerfumeRecommendResponse.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeRecommendResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} recommendCommonPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeRecommendResponse>>(
                    MSG_GET_RECOMMEND_PERFUME_BY_AGE_AND_GENDER,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

const getSurveyPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    Perfume.getSurveyPerfume(loginUserIdx)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getSurveyPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_PERFUME_FOR_SURVEY_SUCCESS,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

const getNewPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Perfume.getNewPerfume(loginUserIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponse>(
                result.count,
                result.rows.map(PerfumeResponse.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getNewPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_ADDED_PERFUME_RECENT_SUCCESS,
                    data
                )
            );
        })
        .catch((err: Error) => next(err));
};

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
        .then((data: ListAndCountDTO<PerfumeResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getLikedPerfume's result = ${data}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponse>>(
                    MSG_GET_LIKED_PERFUME_LIST_SUCCESS,
                    data
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
