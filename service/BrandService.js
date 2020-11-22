'use strict';


/**
 * 브랜드 전체 조회
 * 브랜드 전체 반환
 *
 * returns List
 **/
exports.getBrandList = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "name" : "조말론",
  "english_name" : "조말론(영어로)",
  "brand_id" : 0
}, {
  "name" : "조말론",
  "english_name" : "조말론(영어로)",
  "brand_id" : 0
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

