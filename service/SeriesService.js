'use strict';

const seriesDao = require('../dao/SeriesDao.js');
const ingredientDao = require('../dao/IngredientDao');
const { parseSortToOrder } = require('../utils/parser.js');

/**
 * 계열 삽입
 *
 * @param {string} name
 * @param {string} englishName
 * @param {string} description
 * @returns {Promise<integer>} insertIdx
 **/
exports.postSeries = ({ name, englishName, description }) => {
    return seriesDao.create({ name, englishName, description });
};

/**
 * 특정 계열 조회
 *
 * @param {integer} seriesIdx
 * @returns {Promise<Series>}
 **/
exports.getSeriesByIdx = (seriesIdx) => {
    return seriesDao.readByIdx(seriesIdx);
};

/**
 * 계열 전체 목록 조회
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise<Series[]>}
 **/
exports.getSeriesAll = (pagingIndex, pagingSize) => {
    return seriesDao.readAll(pagingIndex, pagingSize);
};

/**
 * 계열 검색
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {string} sort
 * @returns {Promise<Series[]>}
 **/
exports.searchSeries = (pagingIndex, pagingSize, sort) => {
    const order = parseSortToOrder(sort);
    return seriesDao.search(pagingIndex, pagingSize, order);
};

/**
 * 계열 수정
 *
 * @param {Object} Series
 * @returns {Promise<number>} affectedRows
 **/
exports.putSeries = ({ seriesIdx, name, englishName, description }) => {
    return seriesDao.update({ seriesIdx, name, englishName, description });
};

/**
 * 계열 삭제
 *
 * @param {number} seriesIdx
 * @returns {Promise<number>}
 **/
exports.deleteSeries = (seriesIdx) => {
    return seriesDao.delete(seriesIdx);
};

/**
 * 계열에 해당하는 재료 조회
 *
 * @param {number} seriesIdx
 * @returns {Promise<Ingredient[]>}
 */
exports.getIngredientList = (seriesIdx) => {
    return ingredientDao.readBySeriesIdx(seriesIdx).then((it) => {
        delete it.JoinSeriesIngredient;
        return it;
    });
};
