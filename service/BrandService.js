'use strict';

const brandDao = require('../dao/BrandDao.js');
const { parseSortToOrder } = require('../utils/parser.js');

const { updateList, removeKeyJob } = require('../utils/func.js');

/**
 * 브랜드 검색
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {string} sort
 * @returns {Promise<Brand[]>}
 **/
exports.searchBrand = (pagingIndex, pagingSize, sort) => {
    const order = parseSortToOrder(sort);
    return brandDao.search(pagingIndex, pagingSize, order);
};

/**
 * 브랜드 전체 조회
 *
 * @returns {Promise<Brand[]>}
 **/
exports.getBrandAll = () => {
    return brandDao.readAll();
};

/**
 * 브랜드 조회
 *
 * @param {number} brandIdx
 * @returns {Promise<Brand>}
 **/
exports.getBrandByIdx = (brandIdx) => {
    return brandDao.read(brandIdx);
};

/**
 * 브랜드 삽입
 *
 * @param {Object} Brand
 * @returns {Promise}
 **/
exports.insertBrand = ({
    name,
    englishName,
    firstInitial,
    imageUrl,
    description,
}) => {
    return brandDao.create({
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    });
};

/**
 * 브랜드 수정
 *
 * @param {Object} Brand
 * @returns {Promise}
 **/
exports.putBrand = ({
    brandIdx,
    name,
    englishName,
    firstInitial,
    imageUrl,
    description,
}) => {
    return brandDao.update({
        brandIdx,
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    });
};

/**
 * 브랜드 삭제
 *
 * @param {number} brandIdx
 * @returns {Promise}
 **/
exports.deleteBrand = (brandIdx) => {
    return brandDao.delete(brandIdx);
};

/**
 * 브랜드 필터 조회
 *
 * @returns {Promise}
 */
exports.getFilterBrand = () => {
    return brandDao.readAll().then((result) => {
        const firstInitialMap = result.rows.reduce((prev, cur) => {
            if (!prev[cur.firstInitial]) {
                prev[cur.firstInitial] = [];
            }
            prev[cur.firstInitial].push(cur);
            return prev;
        }, {});
        return Object.keys(firstInitialMap).map((key) => {
            return {
                firstInitial: key,
                brands: updateList(
                    firstInitialMap[key],
                    removeKeyJob(
                        'englishName',
                        'description',
                        'imageUrl',
                        'firstInitial'
                    )
                ),
            };
        });
    });
};

/**
 * 브랜드 영어 이름으로 조회
 *
 * @param {string} englishName
 * @returns {Promise<Brand>}
 **/
exports.findBrandByEnglishName = (englishName) => {
    return brandDao.findBrand({ englishName });
};
