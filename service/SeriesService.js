'use strict';

const seriesDAO = require('../dao/SeriesDao.js');
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
    return seriesDAO.create({ name, englishName, description });
};

/**
 * 특정 계열 조회
 *
 * @param {integer} seriesIdx
 * @returns {Promise<Series>}
 **/
exports.getSeriesByIdx = (seriesIdx) => {
    return seriesDAO.readByIdx(seriesIdx);
};

/**
 * 계열 전체 목록 조회
 *
 * @param {string} sort
 * @returns {Promise<Series[]>}
 **/
exports.getSeriesAll = (sort) => {
    const order = parseSortToOrder(sort);
    return seriesDAO.readAll(order);
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
    return seriesDAO.update({ seriesIdx, name, englishName, description });
};

/**
 * 계열 삭제
 *
 * @param {number} seriesIdx
 * @returns {Promise<number>}
 **/
exports.deleteSeries = (seriesIdx) => {
    return seriesDAO.delete(seriesIdx);
};
