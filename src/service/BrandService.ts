import { logger } from '@modules/winston';

import BrandDao from '@dao/BrandDao';

import { PagingRequestDTO } from '@request/common';

import {
    BrandFilterDTO,
    ListAndCountDTO,
    BrandDTO,
    PagingDTO,
} from '@dto/index';

const LOG_TAG: string = '[Brand/Service]';

class BrandService {
    brandDao: BrandDao;
    constructor(brandDao?: BrandDao) {
        this.brandDao = brandDao ?? new BrandDao();
    }
    /**
     * 브랜드 검색
     *
     * @param {PagingRequestDTO} pagingRequestDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    searchBrand(
        pagingRequestDTO: PagingRequestDTO
    ): Promise<ListAndCountDTO<BrandDTO>> {
        logger.debug(
            `${LOG_TAG} searchBrand(pagingRequestDTO = ${pagingRequestDTO})`
        );
        const pagingDTO = PagingDTO.create(pagingRequestDTO);
        return this.brandDao.search(pagingDTO);
    }
    /**
     * 브랜드 전체 조회
     *
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    getBrandAll(): Promise<ListAndCountDTO<BrandDTO>> {
        logger.debug(`${LOG_TAG} getBrandAll()`);
        return this.brandDao.readAll();
    }

    /**
     * 브랜드 조회
     *
     * @param {number} brandIdx
     * @returns {Promise<BrandDTO>} brandDTO
     **/
    getBrandByIdx(brandIdx: number): Promise<BrandDTO> {
        logger.debug(`${LOG_TAG} getBrandByIdx(brandIdx = ${brandIdx})`);
        return this.brandDao.read(brandIdx);
    }

    /**
     * 브랜드 필터 조회
     *
     * @returns {Promise<BrandFilterDTO[]>} brandFilterDTO[]
     */
    getFilterBrand(): Promise<BrandFilterDTO[]> {
        logger.debug(`${LOG_TAG} getFilterBrand()`);
        return this.brandDao.readAll().then((result) => {
            const firstInitialMap = result.rows.reduce(
                (prev: Map<string, BrandDTO[]>, cur: BrandDTO) => {
                    if (!prev.has(cur.firstInitial)) {
                        prev.set(cur.firstInitial, []);
                    }
                    prev.get(cur.firstInitial)!!.push(cur);
                    return prev;
                },
                new Map<string, BrandDTO[]>()
            );
            return Array.from(firstInitialMap.keys()).map((key: string) => {
                return new BrandFilterDTO(key, firstInitialMap.get(key) || []);
            });
        });
    }
}

export default BrandService;
