'use strict';
const ingredientDAO = require('../dao/IngredientDao.js');


/**
 * 향료 삽입
 * 향료 삽입
 *
 * body IngredientInfo Insert new ingredient info (optional)
 * no response value expected for this operation
 **/
exports.postIngredient = ({name, englishName, description, seriesName}) => {
  return ingredientDAO.create({name, englishName, description, seriesName});
};


/**
 * 특정 향료 조회
 * 특정 향료 조회
 *
 * ingredientIdx Long 향료 ID
 * returns IngredientInfo
 **/
exports.getIngredientByIdx = (ingredientIdx) => {
  return ingredientDAO.read(ingredientIdx);
};


/**
 * 향료 목록 조회
 * 향료 목록 반환
 *
 * returns List
 **/
exports.getIngredientList = () => {
  return ingredientDAO.readAll();
};



/**
 * 향료 수정
 * 향료 수정
 *
 * ingredientIdx Long 향료 ID
 * body IngredientInfo Updated series info (optional)
 * no response value expected for this operation
 **/
exports.putIngredient = ({ingredientIdx, name, englishName, description}) => {
  return ingredientDAO.update({ingredientIdx, name, englishName, description});
};


/**
 * 향료 삭제
 * 향료 삭제
 *
 * ingredientIdx Long 향료 ID
 * no response value expected for this operation
 **/
exports.deleteIngredient = (ingredientIdx) => {
  return ingredientDAO.delete(ingredientIdx);
};