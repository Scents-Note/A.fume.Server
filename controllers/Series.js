'use strict';

const utils = require('../utils/writer.js');
const Series = require('../service/SeriesService');

module.exports.postSeries = function postSeries (req, res, next) {
  const {name, englishName, description} = req.swagger.params['body'].value;
  Series.postSeries({name, englishName, description})
    .then(function (response) {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: 'series post 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSeriesByIdx = function getSeriesByIdx (req, res, next) {
  const seriesIdx = req.swagger.params['seriesIdx'].value;
  Series.getSeriesByIdx(seriesIdx)
    .then(function (response) {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: 'series 개별 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSeriesList = function getSeriesList (req, res, next) {
  Series.getSeriesList()
    .then(function (response) {
      console.log("controller -> series getList");
      utils.writeJson(res, utils.respondWithCode(200, {
        message: 'series 전체 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putSeries = function putSeries (req, res, next) {
  const seriesIdx = req.swagger.params['seriesIdx'].value;
  const {name, englishName, description} = req.swagger.params['body'].value;
  Series.putSeries({seriesIdx, name, englishName, description})
    .then(function (response) {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: 'series put 성공'
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteSeries = function deleteSeries (req, res, next) {
  const seriesIdx = req.swagger.params['seriesIdx'].value;
  Series.deleteSeries(seriesIdx)
    .then(function (response) {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: 'series delete 성공'
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
