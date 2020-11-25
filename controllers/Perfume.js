'use strict';

var utils = require('../utils/writer.js');
var Perfume = require('../service/PerfumeService');

module.exports.createPerfume = function createPerfume (req, res, next) {
  var body = req.swagger.params['body'].value;
  Perfume.createPerfume(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deletePerfume = function deletePerfume (req, res, next) {
  var perfumeIdx = req.swagger.params['perfumeIdx'].value;
  var api_key = req.swagger.params['api_key'].value;
  Perfume.deletePerfume(perfumeIdx,api_key)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getPerfumeById = function getPerfumeById (req, res, next) {
  var perfumeIdx = req.swagger.params['perfumeIdx'].value;
  Perfume.getPerfumeById(perfumeIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.searchPerfume = function searchPerfume (req, res, next) {
  var filter = req.swagger.params['filter'].value;
  Perfume.searchPerfume(filter)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updatePerfume = function updatePerfume (req, res, next) {
  var body = req.swagger.params['body'].value;
  Perfume.updatePerfume(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
