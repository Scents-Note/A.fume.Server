import { logger } from '@modules/winston';

import BrandDao from '@dao/BrandDao';

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
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    searchBrand(pagingDTO: PagingDTO): Promise<ListAndCountDTO<BrandDTO>> {
        logger.debug(`${LOG_TAG} searchBrand(pagingDTO = ${pagingDTO})`);
        return this.brandDao.search(pagingDTO);
    }
    /**
     * 브랜드 전체 조회
     *
     * @params {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>} listAndCountDTO
     **/
    getBrandAll(pagingDTO?: PagingDTO): Promise<ListAndCountDTO<BrandDTO>> {
        logger.debug(`${LOG_TAG} getBrandAll(pagingDTO = ${pagingDTO})`);
        return this.brandDao.readAll(pagingDTO);
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
