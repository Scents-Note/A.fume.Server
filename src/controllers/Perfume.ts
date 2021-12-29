import { Request, Response, NextFunction, RequestHandler } from 'express';

import StatusCode from '../utils/statusCode';
import PerfumeService from '../service/PerfumeService';

import { PerfumeSearchRequestDTO } from '../data/request/perfume';
import {
    PerfumeDetailResponseDTO,
    PerfumeResponseDTO,
    PerfumeRecommendResponseDTO,
} from '../data/response/perfume';

import { PagingRequestDTO } from '../data/request/common';
import { ResponseDTO, SimpleResponseDTO } from '../data/response/common';
import PerfumeIntegralDTO from '../data/dto/PerfumeIntegralDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import PerfumeSearchResultDTO from '../data/dto/PerfumeSearchResultDTO';
import PerfumeThumbDTO from '../data/dto/PerfumeThumbDTO';
import PerfumeThumbKeywordDTO from '../data/dto/PerfumeThumbKeywordDTO';

let Perfume = new PerfumeService();
let SearchHistory = require('../service/SearchHistoryService');

const getPerfume: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
): any => {
    const perfumeIdx: number = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx: number = req.middlewareToken.loginUserIdx || -1;
    Promise.all([
        Perfume.getPerfumeById(perfumeIdx, loginUserIdx),
        SearchHistory.incrementCount(loginUserIdx, perfumeIdx),
    ])
        .then(([result, _]: [PerfumeIntegralDTO, any]) => {
            return PerfumeDetailResponseDTO.createByPerfumeIntegralDTO(result);
        })
        .then((data: PerfumeDetailResponseDTO) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<PerfumeDetailResponseDTO>(
                    '향수 조회 성공',
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
    const perfumeSearchRequestDTO: PerfumeSearchRequestDTO =
        PerfumeSearchRequestDTO.createByJson(
            Object.assign({ userIdx: loginUserIdx }, req.body)
        );
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Perfume.searchPerfume(perfumeSearchRequestDTO, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeSearchResultDTO>) => {
            return new ListAndCountDTO<PerfumeResponseDTO>(
                result.count,
                result.rows.map(PerfumeResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponseDTO>>(
                    '향수 검색 성공',
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
    const perfumeIdx: number = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx: number = req.middlewareToken.loginUserIdx;
    Perfume.likePerfume(loginUserIdx, perfumeIdx)
        .then((result: boolean) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<boolean>(
                    `향수 좋아요${result ? '' : ' 취소'}`,
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
            return new ListAndCountDTO<PerfumeResponseDTO>(
                result.count,
                result.rows.map(PerfumeResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponseDTO>>(
                    '최근 검색한 향수 조회',
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
            return new ListAndCountDTO<PerfumeRecommendResponseDTO>(
                result.count,
                result.rows.map(PerfumeRecommendResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeRecommendResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeRecommendResponseDTO>>(
                    '향수 개인 맞춤 추천',
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
            return new ListAndCountDTO<PerfumeRecommendResponseDTO>(
                result.count,
                result.rows.map(PerfumeRecommendResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeRecommendResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeRecommendResponseDTO>>(
                    '향수 일반 추천 (성별, 나이 반영)',
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
            return new ListAndCountDTO<PerfumeResponseDTO>(
                result.count,
                result.rows.map(PerfumeResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponseDTO>>(
                    '서베이 향수 조회 성공',
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
            return new ListAndCountDTO<PerfumeResponseDTO>(
                result.count,
                result.rows.map(PerfumeResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponseDTO>>(
                    '새로 등록된 향수 조회 성공',
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
    const userIdx: number = req.swagger.params['userIdx'].value;
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    if (loginUserIdx != userIdx) {
        res.status(StatusCode.FORBIDDEN).json(
            new SimpleResponseDTO('비정상적인 접근입니다.')
        );
        return;
    }
    Perfume.getLikedPerfume(userIdx, pagingRequestDTO)
        .then((result: ListAndCountDTO<PerfumeThumbDTO>) => {
            return new ListAndCountDTO<PerfumeResponseDTO>(
                result.count,
                result.rows.map(PerfumeResponseDTO.createByJson)
            );
        })
        .then((data: ListAndCountDTO<PerfumeResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<PerfumeResponseDTO>>(
                    '유저가 좋아요한 향수 조회',
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

module.exports.setSearchHistoryService = (service: any) => {
    SearchHistory = service;
};
