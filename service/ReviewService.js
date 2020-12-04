'use strict';


/**
 * 시향기 정보 가져오기
 * review 정보를 반환
 *
 * reviewIdx Long 리뷰 ID
 * returns ReviewInfo
 **/
exports.getReview = function(reviewIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "reviewIdx" : 0,
  "perfumeIdx" : 0,
  "userIdx" : 0,
  "score" : 2.4,
  "persistance" : "강함",
  "reverberance" : "보통",
  "seasonal" : [ "겨울", "가을" ],
  "generage" : "중성",
  "access" : true,
  "content" : "향수 잠시 남기기"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 향수의 시향기 정보 가져오기
 * review 반환
 *
 * perfumeIdx Long 향수 ID
 * returns List
 **/
exports.getReviewOfPerfume = function(perfumeIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "reviewIdx" : 0,
  "perfumeIdx" : 0,
  "userIdx" : 0,
  "score" : 2.4,
  "persistance" : "강함",
  "reverberance" : "보통",
  "seasonal" : [ "겨울", "가을" ],
  "generage" : "중성",
  "access" : true,
  "content" : "향수 잠시 남기기"
}, {
  "reviewIdx" : 0,
  "perfumeIdx" : 0,
  "userIdx" : 0,
  "score" : 2.4,
  "persistance" : "강함",
  "reverberance" : "보통",
  "seasonal" : [ "겨울", "가을" ],
  "generage" : "중성",
  "access" : true,
  "content" : "향수 잠시 남기기"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

/**
 * 향수의 시향기 정보 업데이트
 * review 업데이트
 *
 * reviewIdx Long 시향기 ID
 * body ReviewInfo review 정보
 * no response value expected for this operation
 **/
exports.updateReview = function(reviewIdx,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

