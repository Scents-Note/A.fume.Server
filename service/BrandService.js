'use strict';

const { BrandFilterDTO, PagingDTO } = require('../data/dto');

class BrandService {
    constructor(brandDao) {
        this.brandDao = brandDao || require('../dao/BrandDao.js');
    }
    /**
     * 브랜드 검색
     *
     * @param {PagingRequestDTO} pagingRequestDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    searchBrand(pagingRequestDTO) {
        const pagingDTO = PagingDTO.create(pagingRequestDTO);
        return this.brandDao.search(pagingDTO);
    }
    /**
     * 브랜드 전체 조회
     *
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    getBrandAll() {
        return this.brandDao.readAll();
    }

    /**
     * 브랜드 조회
     *
     * @param {number} brandIdx
     * @returns {Promise<BrandDTO>} brandDTO
     **/
    getBrandByIdx(brandIdx) {
        return this.brandDao.read(brandIdx);
    }

    /**
     * 브랜드 삽입
     *
     * @param {BrandInputDTO} brandInputDto
     * @returns {Promise<CreatedResultDTO<Brand>>} createdResultDTO
     **/
    insertBrand(brandInputDTO) {
        return this.brandDao.create(brandInputDTO);
    }

    /**
     * 브랜드 수정
     *
     * @param {BrandInputDTO} brandInputDto
     * @returns {Promise}
     **/
    putBrand(brandInputDTO) {
        return this.brandDao.update(brandInputDTO);
    }

    /**
     * 브랜드 삭제
     *
     * @param {number} brandIdx
     * @returns {Promise}
     **/
    deleteBrand(brandIdx) {
        return this.brandDao.delete(brandIdx);
    }

    /**
     * 브랜드 필터 조회
     *
     * @returns {Promise<BrandFilterVO[]>} brandFilterVO[]
     */
    getFilterBrand() {
        return this.brandDao.readAll().then((result) => {
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
    }

    /**
     * 브랜드 영어 이름으로 조회
     *
     * @param {string} englishName
     * @returns {Promise<BrandDTO>} brandDTO
     **/
    findBrandByEnglishName(englishName) {
        return this.brandDao.findBrand({ englishName });
    }
}

module.exports = BrandService;
