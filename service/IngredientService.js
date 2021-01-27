'use strict';

const ingredientDao = require('../dao/IngredientDao.js');
const seriesDao = require('../dao/SeriesDao.js');
const { parseSortToOrder } = require('../utils/parser.js');

/**
 * 향료 삽입
 *
 * @param {Object} ingredient
 * @return {Promise<number>}
 **/
exports.postIngredient = ({ name, englishName, description, imageUrl }) => {
    return ingredientDao.create({
        name,
        englishName,
        description,
        imageUrl,
        seriesIdx: series.seriesIdx,
    });
};

/**
 * 특정 향료 조회
 *
 * @param {number} ingredientIdx
 * @returns {Promise<Ingredient>}
 **/
exports.getIngredientByIdx = (ingredientIdx) => {
    return ingredientDao.readByIdx(ingredientIdx);
};

/**
 * 향료 목록 조회
 *
 * @param {string} sort
 * @returns {Promise<Ingredient[]>}
 **/
exports.getIngredientAll = (sort) => {
    const order = parseSortToOrder(sort);
    return ingredientDao.readAll(order);
};

/**
 * 재료 검색
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {string} sort
 * @returns {Promise<Ingredient[]>}
 **/
exports.searchIngredient = (pagingIndex, pagingSize, sort) => {
    const order = parseSortToOrder(sort);
    return ingredientDao.search(pagingIndex, pagingSize, order);
};

/**
 * 향료 수정
 *
 * @param {Object} Ingredient
 * @returns {Promise<number>} affectedRows
 **/
exports.putIngredient = ({
    ingredientIdx,
    name,
    englishName,
    imageUrl,
    description,
}) => {
    return ingredientDao.update({
        ingredientIdx,
        name,
        englishName,
        imageUrl,
        description,
    });
};

/**
 * 향료 삭제
 *
 * @param {number} ingredientIdx
 * @returns {Promise<number>}
 **/
exports.deleteIngredient = (ingredientIdx) => {
    return ingredientDao.delete(ingredientIdx);
};
