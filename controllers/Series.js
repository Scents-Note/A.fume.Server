'use strict';

var utils = require('../utils/writer.js');
var Series = require('../service/SeriesService');

module.exports.deleteSeries = function deleteSeries (req, res, next) {
  var seriesIdx = req.swagger.params['seriesIdx'].value;
  Series.deleteSeries(seriesIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSeriesByIdx = function getSeriesByIdx (req, res, next) {
  var seriesIdx = req.swagger.params['seriesIdx'].value;
  Series.getSeriesByIdx(seriesIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getSeriesList = function getSeriesList (req, res, next) {
  Series.getSeriesList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postSeries = function postSeries (req, res, next) {
  var body = req.swagger.params['body'].value;
  Series.postSeries(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putSeries = function putSeries (req, res, next) {
  var seriesIdx = req.swagger.params['seriesIdx'].value;
  var body = req.swagger.params['body'].value;
  Series.putSeries(seriesIdx,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
