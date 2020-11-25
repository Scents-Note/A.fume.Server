'use strict';


/**
 * 향료 목록 조회
 * 향료 목록 반환
 *
 * returns List
 **/
exports.getIngredientList = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "name" : "만다린 오렌지",
  "ingredientIdx" : 1,
  "description" : "상큼하고 새콤한 만다린 오렌지 향이 생기 넘치는 상쾌함을 더합니다"
}, {
  "name" : "만다린 오렌지",
  "ingredientIdx" : 1,
  "description" : "상큼하고 새콤한 만다린 오렌지 향이 생기 넘치는 상쾌함을 더합니다"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

