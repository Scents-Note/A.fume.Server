'use strict';

const Series = require('../service/SeriesService');
const { OK, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.postSeries = function postSeries(req, res, next) {
    const { name, englishName, description } = req.swagger.params['body'].value;
    Series.postSeries({ name, englishName, description })
        .then(function (response) {
            res.status(OK).json({
                message: 'series post 성공',
                data: response,
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.getSeriesByIdx = function getSeriesByIdx(req, res, next) {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Series.getSeriesByIdx(seriesIdx)
        .then(function (response) {
            res.status(OK).json({
                message: 'series 개별 조회 성공',
                data: response,
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.getSeriesList = function getSeriesList(req, res, next) {
    Series.getSeriesList()
        .then(function (response) {
            console.log('controller -> series getList');
            res.status(OK).json({
                message: 'series 전체 조회 성공',
                data: response,
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.putSeries = function putSeries(req, res, next) {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    const { name, englishName, description } = req.swagger.params['body'].value;
    Series.putSeries({ seriesIdx, name, englishName, description })
        .then(function (response) {
            res.status(OK).json({
                message: 'series put 성공',
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.deleteSeries = function deleteSeries(req, res, next) {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Series.deleteSeries(seriesIdx)
        .then(function (response) {
            res.status(OK).json({
                message: 'series delete 성공',
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};
