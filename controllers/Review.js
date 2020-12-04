'use strict';

var utils = require('../utils/writer.js');
var Review = require('../service/ReviewService');

module.exports.getReview = function getReview (req, res, next) {
  var reviewIdx = req.swagger.params['reviewIdx'].value;
  Review.getReview(reviewIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getReviewOfPerfume = function getReviewOfPerfume (req, res, next) {
  var perfumeIdx = req.swagger.params['perfumeIdx'].value;
  Review.getReviewOfPerfume(perfumeIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateReview = function updateReview (req, res, next) {
  var reviewIdx = req.swagger.params['reviewIdx'].value;
  var body = req.swagger.params['body'].value;
  Review.updateReview(reviewIdx,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
