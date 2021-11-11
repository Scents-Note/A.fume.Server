'use strict';

import IngredientDao from '../dao/IngredientDao';
import PagingDTO from '../data/dto/PagingDTO';

let seriesDao = require('../dao/SeriesDao.js');
let ingredientDao = new IngredientDao();
let noteDao = require('../dao/NoteDao.js');

// TODO Service Class로 변경
module.exports.setSeriesDao = (dao) => {
    seriesDao = dao;
};
module.exports.setIngredientDao = (dao) => {
    ingredientDao = dao;
};
module.exports.setNoteDao = (dao) => {
    noteDao = dao;
};

const { PagingRequestDTO } = require('../data/request_dto');

const { ListAndCountDTO, SeriesFilterDTO } = require('../data/dto');

/**
 * 특정 계열 조회
 *
 * @param {integer} seriesIdx
 * @returns {Promise<SeriesDTO>} seriesDTO
 **/
exports.getSeriesByIdx = (seriesIdx) => {
    return seriesDao.readByIdx(seriesIdx);
};

/**
 * 계열 전체 목록 조회
 *
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
 **/
exports.getSeriesAll = (pagingRequestDTO) => {
    return seriesDao.readAll(PagingDTO.create(pagingRequestDTO));
};

/**
 * 계열 검색
 *
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
 **/
exports.searchSeries = (pagingRequestDTO) => {
    return seriesDao.search(PagingDTO.create(pagingRequestDTO));
};

const FILTER_INGREDIENT_LIMIT_USED_COUNT = 10;
async function filterByUsedCount(ingredientList) {
    const ingredientIdxList = ingredientList.map((it) => it.ingredientIdx);
    const countMap = (
        await noteDao.countIngredientUsed(ingredientIdxList)
    ).reduce((prev, cur) => {
        prev[cur.ingredientIdx] = cur.count;
        return prev;
    }, {});
    return ingredientList.filter((it) => {
        return countMap[it.ingredientIdx] > FILTER_INGREDIENT_LIMIT_USED_COUNT;
    });
}

/**
 * 필터에서 보여주는 Series 조회
 *
 * @param {pagingDTO} pagingDTO
 * @returns {Promise<ListAndCountDTO<SeriesFilterDTO>>} listAndCountDTO
 */
exports.getFilterSeries = async (pagingDTO) => {
    const result = await seriesDao.readAll(pagingDTO);
    const seriesIdxList = result.rows.map((it) => it.seriesIdx);
    const ingredientList = await ingredientDao.readBySeriesIdxList(
        seriesIdxList
    );
    const ingredientFilteredList = await filterByUsedCount(ingredientList);
    const ingredientMap = ingredientFilteredList.reduce((prev, cur) => {
        delete cur.Series;
        if (!prev[cur.seriesIdx]) {
            prev[cur.seriesIdx] = [];
        }
        prev[cur.seriesIdx].push(cur);
        return prev;
    }, {});
    return new ListAndCountDTO({
        count: result.count,
        rows: result.rows.map((it) => {
            return new SeriesFilterDTO({
                series: it,
                ingredients: ingredientMap[it.seriesIdx] || [],
            });
        }),
    });
};

/**
 * 계열 영어 이름으로 조회
 *
 * @param {string} englishName
 * @returns {Promise<SeriesDTO>}
 **/
exports.findSeriesByEnglishName = (englishName) => {
    return seriesDao.findSeries({ englishName });
};
