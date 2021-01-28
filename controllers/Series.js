'use strict';

const Series = require('../service/SeriesService');
const { OK } = require('../utils/statusCode.js');

module.exports.postSeries = (req, res, next) => {
    const { name, englishName, description } = req.swagger.params['body'].value;
    Series.postSeries({ name, englishName, description })
        .then((response) => {
            res.status(OK).json({
                message: 'series post 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getSeriesByIdx = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Series.getSeriesByIdx(seriesIdx)
        .then((response) => {
            res.status(OK).json({
                message: 'series 개별 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getSeriesList = (req, res, next) => {
    Series.getSeriesAll()
        .then((response) => {
            res.status(OK).json({
                message: 'series 전체 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.searchSeries = (req, res, next) => {
    let { pagingIndex, pagingSize, sort } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 10;
    sort = sort || 'createdAt_desc';
    Series.searchSeries(pagingIndex, pagingSize, sort)
        .then((response) => {
            res.status(OK).json({
                message: '계열 검색 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.putSeries = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    const { name, englishName, description } = req.swagger.params['body'].value;
    Series.putSeries({ seriesIdx, name, englishName, description })
        .then(() => {
            res.status(OK).json({
                message: 'series put 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.deleteSeries = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Series.deleteSeries(seriesIdx)
        .then(() => {
            res.status(OK).json({
                message: 'series delete 성공',
            });
        })
        .catch((err) => next(err));
};
