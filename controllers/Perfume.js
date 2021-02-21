'use strict';

const Perfume = require('../service/PerfumeService');
const SearchHistory = require('../service/SearchHistoryService');
const { OK, FORBIDDEN } = require('../utils/statusCode.js');

module.exports.postPerfume = (req, res, next) => {
    const body = req.body;
    body.imageThumbnailUrl = body.imageUrl;
    Perfume.createPerfume(body)
        .then((response) => {
            res.status(OK).json({
                message: '향수 생성 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getPerfume = (req, res, next) => {
    const perfumeIdx = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    Promise.all([
        Perfume.getPerfumeById(perfumeIdx, loginUserIdx),
        SearchHistory.incrementCount(loginUserIdx, perfumeIdx),
    ])
        .then(([response]) => {
            res.status(OK).json({
                message: '향수 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.searchPerfume = (req, res, next) => {
    let { series, brand, keyword, pagingIndex, pagingSize, sort } = req.query;
    const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
    series = (series && series.split('%')) || [];
    brand = (brand && brand.split('%')) || [];
    keyword = (keyword && keyword.split('%')) || [];
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 100;
    Perfume.searchPerfume(
        { series, brands: brand, keywords: keyword },
        pagingIndex,
        pagingSize,
        sort,
        loginUserIdx
    )
        .then((response) => {
            res.status(OK).json({
                message: '향수 검색 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.putPerfume = (req, res, next) => {
    const body = req.swagger.params['body'].value;
    Perfume.updatePerfume(body)
        .then(() => {
            res.status(OK).json({
                message: '향수 수정 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.likePerfume = (req, res, next) => {
    const perfumeIdx = req.swagger.params['perfumeIdx'].value;
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    Perfume.likePerfume(loginUserIdx, perfumeIdx)
        .then((result) => {
            res.status(OK).json({
                message: `향수 좋아요${result ? '' : ' 취소'}`,
                data: result,
            });
        })
        .catch((err) => next(err));
};

module.exports.getRecentPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    let { pagingIndex, pagingSize } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 100;
    Perfume.recentSearch(loginUserIdx, pagingIndex, pagingSize)
        .then((result) => {
            res.status(OK).json({
                message: '최근 검색한 향수 조회',
                data: result,
            });
        })
        .catch((err) => next(err));
};

module.exports.recommendPersonalPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    let { pagingIndex, pagingSize } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 10;
    Perfume.recommendByUser(loginUserIdx, pagingIndex, pagingSize)
        .then((result) => {
            res.status(OK).json({
                message: '향수 개인 맞춤 추천',
                data: result,
            });
        })
        .catch((err) => next(err));
};

module.exports.recommendCommonPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    let { pagingIndex, pagingSize } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 10;
    Perfume.recommendByUser(loginUserIdx, pagingIndex, pagingSize)
        .then((result) => {
            res.status(OK).json({
                message: '향수 일반 추천 (성별, 나이 반영)',
                data: result,
            });
        })
        .catch((err) => next(err));
};

module.exports.getSurveyPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    Perfume.getSurveyPerfume(loginUserIdx)
        .then((result) => {
            res.status(OK).json({
                message: '서베이 향수 조회 성공',
                data: result,
            });
        })
        .catch((err) => next(err));
};

module.exports.deletePerfume = (req, res, next) => {
    const perfumeIdx = req.swagger.params['perfumeIdx'].value;
    Perfume.deletePerfume(perfumeIdx)
        .then(() => {
            res.status(OK).json({
                message: '향수 삭제 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.getNewPerfume = (req, res, next) => {
    let { pagingIndex, pagingSize } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 10;
    Perfume.getNewPerfume(pagingIndex, pagingSize)
        .then((result) => {
            res.status(OK).json({
                message: '새로 등록된 향수 조회 성공',
                data: result,
            });
        })
        .catch((err) => next(err));
};

module.exports.getLikedPerfume = (req, res, next) => {
    const loginUserIdx = req.middlewareToken.loginUserIdx;
    const userIdx = req.swagger.params['userIdx'].value;
    let { pagingIndex, pagingSize } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 10;
    if (loginUserIdx != userIdx) {
        res.status(FORBIDDEN).json({
            message: '비정상적인 접근입니다.',
        });
        return;
    }
    Perfume.getLikedPerfume(loginUserIdx, pagingIndex, pagingSize)
        .then((response) => {
            res.status(OK).json({
                message: '유저가 좋아요한 향수 조회',
                data: response,
            });
        })
        .catch((err) => {
            next(err);
        });
};
