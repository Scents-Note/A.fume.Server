'use strict';

let ingredientDao = require('../dao/IngredientDao.js');

/**
 * 향료 목록 조회
 *
 * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
 **/
exports.getIngredientAll = () => {
    return ingredientDao.readAll();
};

/**
 * 재료 검색
 *
 * @param {IngredientConditionDTO} ingredientConditionDTO
 * @returns {Promise<IngredientDTTO>} ingredientDTO
 **/
exports.findIngredient = (ingredientConditionDTO) => {
    return ingredientDao.findIngredient(ingredientConditionDTO);
};

/**
 * 계열에 해당하는 재료 조회
 *
 * @param {number} seriesIdx
 * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
 */
exports.getIngredientList = (seriesIdx) => {
    return ingredientDao.readAll({ seriesIdx });
};

module.exports.setIngredientDao = (dao) => {
    ingredientDao = dao;
};
