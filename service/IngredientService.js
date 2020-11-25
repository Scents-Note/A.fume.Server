'use strict';


/**
 * 향료 삭제
 * 향료 삭제
 *
 * ingredientIdx Long 향료 ID
 * no response value expected for this operation
 **/
exports.deleteIngredient = function(ingredientIdx) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 특정 향료 조회
 * 특정 향료 조회
 *
 * ingredientIdx Long 향료 ID
 * returns IngredientInfo
 **/
exports.getIngredientByIdx = function(ingredientIdx) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "name" : "씨쏠트",
  "englishName" : "Sea Salt",
  "ingredientIdx" : 1,
  "description" : "바다 소금"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


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
  "name" : "씨쏠트",
  "englishName" : "Sea Salt",
  "ingredientIdx" : 1,
  "description" : "바다 소금"
}, {
  "name" : "씨쏠트",
  "englishName" : "Sea Salt",
  "ingredientIdx" : 1,
  "description" : "바다 소금"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * 향료 삽입
 * 향료 삽입
 *
 * body IngredientInfo Insert new ingredient info (optional)
 * no response value expected for this operation
 **/
exports.postIngredient = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}


/**
 * 향료 수정
 * 향료 수정
 *
 * ingredientIdx Long 향료 ID
 * body IngredientInfo Updated series info (optional)
 * no response value expected for this operation
 **/
exports.putIngredient = function(ingredientIdx,body) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

