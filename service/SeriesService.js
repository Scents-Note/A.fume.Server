'use strict';

const seriesDao = require('../dao/SeriesDao.js');
const ingredientDao = require('../dao/IngredientDao');
const noteDao = require('../dao/NoteDao.js');

const { PagingRequestDTO } = require('../data/request_dto');

const { PagingVO, ListAndCountDTO, SeriesFilterDTO } = require('../data/dto');

/**
 * 계열 삽입
 *
 * @param {SeriesInputDTO} seriesInputDTO
 * @returns {Promise<integer>} insertIdx
 **/
exports.postSeries = (seriesInputDTO) => {
    return seriesDao.create(seriesInputDTO);
};

/**
 * 특정 계열 조회
 *
 * @param {integer} seriesIdx
 * @returns {Promise<SeriesDTO>}
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
    return seriesDao.readAll(new PagingVO(pagingRequestDTO));
};

/**
 * 계열 검색
 *
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<ListAndCountDTO<SeriesDTO>>} listAndCountDTO
 **/
exports.searchSeries = (pagingRequestDTO) => {
    return seriesDao.search(new PagingVO(pagingRequestDTO));
};

/**
 * 계열 수정
 *
 * @param {SeriesInputDTO} seriesInputDTO
 * @returns {Promise<number>} affectedRows
 **/
exports.putSeries = (seriesInputDTO) => {
    return seriesDao.update(seriesInputDTO);
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
 * @param {pagingVO} pagingVO
 * @returns {Promise<ListAndCountDTO<SeriesFilterDTO>>} listAndCountDTO
 */
exports.getFilterSeries = async (pagingVO) => {
    const result = await seriesDao.readAll(pagingVO);
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
