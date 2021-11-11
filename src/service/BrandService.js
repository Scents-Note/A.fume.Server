'use strict';

import BrandFilterDTO from '../data/dto/BrandFilterDTO';
import BrandDao from '../dao/BrandDao';

const { PagingDTO } = require('../data/dto');

class BrandService {
    constructor(brandDao) {
        this.brandDao = brandDao || new BrandDao();
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
     * 브랜드 필터 조회
     *
     * @returns {Promise<BrandFilterDTO[]>} brandFilterDTO[]
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
                return new BrandFilterDTO(key, firstInitialMap[key]);
            });
        });
    }
}

module.exports = BrandService;
