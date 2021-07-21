'use strict';

const brandDao = require('../dao/BrandDao.js');

const { updateList, removeKeyJob } = require('../utils/func.js');

const { PagingVO, BrandFilterDTO } = require('../data/dto');

/**
 * 브랜드 검색
 *
 * @param {PagingRequestDTO} pagingRequestDTO
 * @returns {Promise<ListAndCountDTO<BrandDTO>>}
 **/
exports.searchBrand = (pagingRequestDTO) => {
    const pagingVO = new PagingVO(pagingRequestDTO);
    return brandDao.search(pagingVO);
};

/**
 * 브랜드 전체 조회
 *
 * @returns {Promise<ListAndCountDTO<BrandDTO>>}
 **/
exports.getBrandAll = () => {
    return brandDao.readAll();
};

/**
 * 브랜드 조회
 *
 * @param {number} brandIdx
 * @returns {Promise<BrandDTO>}
 **/
exports.getBrandByIdx = (brandIdx) => {
    return brandDao.read(brandIdx);
};

/**
 * 브랜드 삽입
 *
 * @param {BrandInputDTO} brandInputDto
 * @returns {Promise<CreatedResultDTO<Brand>>}
 **/
exports.insertBrand = (brandInputDTO) => {
    return brandDao.create(brandInputDTO);
};

/**
 * 브랜드 수정
 *
 * @param {BrandInputDTO} brandInputDto
 * @returns {Promise}
 **/
exports.putBrand = (brandInputDTO) => {
    return brandDao.update(brandInputDTO);
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
            return new BrandFilterDTO({
                firstInitial: key,
                brands: firstInitialMap[key],
            });
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
    return brandDao.findBrand({ englishName }).then((result) => {
        return removeKeyJob('createdAt', 'updatedAt')(result);
    });
};
