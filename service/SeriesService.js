'use strict';


/**
 * 계열 삭제
 * 계열 삭제
 *
 * seriesIdx Long 계열 ID
 * no response value expected for this operation
 **/
exports.deleteSeries = function(seriesIdx) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 특정 계열 조회
 * 특정 계열 조회
 *
 * seriesIdx Long 계열 ID
 * returns SeriesInfo
 **/
exports.getSeriesByIdx = function(seriesIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "꿀",
  "englishName" : "Honey",
  "description" : "화이트 허니, 허니",
  "seriesIdx" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 계열 전체 목록 조회
 * 계열 전체 목록 반환
 *
 * returns List
 **/
exports.getSeriesList = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "name" : "꿀",
  "englishName" : "Honey",
  "description" : "화이트 허니, 허니",
  "seriesIdx" : 1
}, {
  "name" : "꿀",
  "englishName" : "Honey",
  "description" : "화이트 허니, 허니",
  "seriesIdx" : 1
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 계열 삽입
 * 계열 삽입
 *
 * body SeriesInfo Insert new series info (optional)
 * no response value expected for this operation
 **/
exports.postSeries = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 계열 수정
 * 계열 수정
 *
 * seriesIdx Long 계열 ID
 * body SeriesInfo Updated series info (optional)
 * no response value expected for this operation
 **/
exports.putSeries = function(seriesIdx,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

