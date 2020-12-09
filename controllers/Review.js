'use strict';

var utils = require('../utils/writer.js');
var Review = require('../service/ReviewService');

module.exports.postReview = function postReview (req, res, next) {
  const perfumeIdx = req.swagger.params['perfumeIdx'].value;
  const userIdx = req.middlewareToken.loginUserIdx;
  const {score, longevity, sillage, seasonal, gender, access, content} = req.swagger.params['body'].value;
  Review.postReview({perfumeIdx, userIdx, score, longevity, sillage, seasonal, gender, access, content})
    .then(() => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '시향노트 추가 성공'
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.getReviewByIdx = function getReviewByIdx (req, res, next) {
  var reviewIdx = req.swagger.params['reviewIdx'].value;
  Review.getReviewByIdx(reviewIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '시향노트 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.getReviewOfPerfumeByLike = function getReviewOfPerfumeByLike (req, res, next) {
  var perfumeIdx = req.swagger.params['perfumeIdx'].value;
  Review.getReviewOfPerfumeByLike(perfumeIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '특정 향수의 시향노트 목록 인기순 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.getReviewOfPerfumeByScore = function getReviewOfPerfumeByScore (req, res, next) {
  var perfumeIdx = req.swagger.params['perfumeIdx'].value;
  Review.getReviewOfPerfumeByScore(perfumeIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '특정 향수의 시향노트 목록 별점순 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.getReviewByUser = function getReviewByUser (req, res, next) {
  const userIdx = req.middlewareToken.loginUserIdx;
  Review.getReviewByUser(userIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '마이퍼퓸 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.getReviewOfPerfumeByRecent = function getReviewOfPerfumeByRecent (req, res, next) {
  var perfumeIdx = req.swagger.params['perfumeIdx'].value;
  Review.getReviewOfPerfumeByRecent(perfumeIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '특정 향수의 시향노트 목록 최신순 조회 성공',
        data: response
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.updateReview =  (req, res, next) => {
  var reviewIdx = req.swagger.params['reviewIdx'].value;
  const userIdx = req.middlewareToken.loginUserIdx;
  var {score, longevity, sillage, seasonal, gender, access, content} = req.swagger.params['body'].value;
  Review.updateReview({reviewIdx, userIdx, score, longevity, sillage, seasonal, gender, access, content})
    .then(() => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '시향노트 수정 성공'
      }));
    })
    .catch(function (response) {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.deleteReview = (req, res, next) => {
  const reviewIdx = req.swagger.params['reviewIdx'].value;
  const userIdx = req.middlewareToken.loginUserIdx;
  Review.deleteReview({reviewIdx, userIdx})
    .then(() => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '시향노트 삭제 성공'
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.likeReview = (req, res, next) => {
  const reviewIdx = req.swagger.params['reviewIdx'].value;
  const userIdx = req.middlewareToken.loginUserIdx;
  Review.likeReview(reviewIdx, userIdx)
    .then((result) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '시향노트 좋아요 상태 변경 성공',
        data: result
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};