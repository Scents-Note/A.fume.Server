'use strict';


/**
 * 향수 정보 추가
 * 향수 정보를 추가한다.
 *
 * body Perfume  (optional)
 * no response value expected for this operation
 **/
exports.createPerfume = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * Deletes a perfume
 * 
 *
 * perfumeIdx Long Pet id to delete
 * api_key String  (optional)
 * no response value expected for this operation
 **/
exports.deletePerfume = function(perfumeIdx,api_key) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 향수 세부 정보 조회
 * 향수 세부 정보를 반환한다.
 *
 * perfumeIdx Long ID of perfume to return
 * returns PerfumeDetail
 **/
exports.getPerfumeById = function(perfumeIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 향수 검색
 * 검색 조건에 해당하는 향수를 반환한다.
 *
 * filter Filter 검색 필터 (optional)
 * returns List
 **/
exports.searchPerfume = function(filter) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 향수 정보 업데이트
 * 
 *
 * body Perfume  (optional)
 * no response value expected for this operation
 **/
exports.updatePerfume = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

