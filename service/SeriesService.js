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
exports.postSeries = ({ name, englishName, description, imageUrl }) => {
    return seriesDao.create({ name, englishName, description, imageUrl });
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
    return ingredientDao.readAll({ seriesIdx }).then((it) => {
        delete it.JoinSeriesIngredient;
        return it;
    });
};

/**
 * 필터에서 보여주는 Series 조회
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 */
exports.getFilterSeries = async (pagingIndex, pagingSize) => {
    const result = await seriesDao.readAll(pagingIndex, pagingSize);
    const seriesIdxList = result.rows.map((it) => it.seriesIdx);
    const ingredientList = await ingredientDao.readBySeriesIdxList(
        seriesIdxList
    );
    const ingredientMap = ingredientList.reduce((prev, cur) => {
        delete cur.Series;
        if (!prev[cur.seriesIdx]) {
            prev[cur.seriesIdx] = [];
        }
        prev[cur.seriesIdx].push(cur);
        return prev;
    }, {});
    result.rows.forEach((it) => {
        it.ingredients = ingredientMap[it.seriesIdx] || [];
    });
    return result;
};

/**
 * 계열 영어 이름으로 조회
 *
 * @param {string} englishName
 * @returns {Promise<Series>}
 **/
exports.findSeriesByEnglishName = (englishName) => {
    return seriesDao.findSeries({ englishName });
};
