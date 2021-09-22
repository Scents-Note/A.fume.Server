'use strict';

let Perfume = require('../service/PerfumeService');
let SearchHistory = require('../service/SearchHistoryService');

const { OK, FORBIDDEN } = require('../utils/statusCode.js');

const { PagingRequestDTO } = require('../data/request_dto');
const {
    PerfumeDetailResponseDTO,
    PerfumeResponseDTO,
    PerfumeRecommendResponseDTO,
} = require('../data/response_dto/perfume');
const { ResponseDTO } = require('../data/response_dto/common');

module.exports.getPerfume = (req, res, next) => {
    const perfumeIdx = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    Promise.all([
        Perfume.getPerfumeById(perfumeIdx, loginUserIdx),
        SearchHistory.incrementCount(loginUserIdx, perfumeIdx),
    ])
        .then(([result]) => {
            result.Keywords = result.keywordList;
            result.ingredients = result.noteDict;
            return new PerfumeDetailResponseDTO(result);
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '향수 조회 성공',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.searchPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    const { keywordList, brandList, ingredientList, searchText } = req.body;
    const { pagingIndex, pagingSize, sort } = new PagingRequestDTO(req.query);
    Perfume.searchPerfume(
        brandList,
        ingredientList,
        keywordList,
        searchText,
        pagingIndex,
        pagingSize,
        sort,
        loginUserIdx
    )
        .then(({ rows, count }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '향수 검색 성공',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.likePerfume = (req, res, next) => {
    const perfumeIdx = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    Perfume.likePerfume(loginUserIdx, perfumeIdx)
        .then((result) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: `향수 좋아요${result ? '' : ' 취소'}`,
                    data: result,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getRecentPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    const { pagingIndex, pagingSize } = new PagingRequestDTO(req.query);
    Perfume.recentSearch(loginUserIdx, pagingIndex, pagingSize)
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '최근 검색한 향수 조회',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.recommendPersonalPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    const { pagingIndex, pagingSize } = new PagingRequestDTO(req.query);
    Perfume.recommendByUser(loginUserIdx, pagingIndex, pagingSize)
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeRecommendResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '향수 개인 맞춤 추천',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.recommendCommonPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    const { pagingIndex, pagingSize } = new PagingRequestDTO(req.query);
    Perfume.recommendByUser(loginUserIdx, pagingIndex, pagingSize)
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeRecommendResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '향수 일반 추천 (성별, 나이 반영)',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getSurveyPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    Perfume.getSurveyPerfume(loginUserIdx)
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '서베이 향수 조회 성공',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getNewPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    const { pagingIndex, pagingSize } = new PagingRequestDTO(req.query);
    Perfume.getNewPerfume(loginUserIdx, pagingIndex, pagingSize)
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '새로 등록된 향수 조회 성공',
                    data,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getLikedPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    const userIdx = req.swagger.params['userIdx'].value;
    const { pagingIndex, pagingSize } = new PagingRequestDTO(req.query);
    if (loginUserIdx != userIdx) {
        res.status(FORBIDDEN).json(
            new ResponseDTO({
                message: '비정상적인 접근입니다.',
            })
        );
        return;
    }
    Perfume.getLikedPerfume(loginUserIdx, pagingIndex, pagingSize)
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => new PerfumeResponseDTO(it)),
            };
        })
        .then((data) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '유저가 좋아요한 향수 조회',
                    data,
                })
            );
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.setPerfumeService = (service) => {
    Perfume = service;
};

module.exports.setSearchHistoryService = (service) => {
    SearchHistory = service;
};
