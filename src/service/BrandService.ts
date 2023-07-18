import { logger } from '@modules/winston';

import BrandDao from '@dao/BrandDao';
import { Op } from 'sequelize';

import {
    BrandFilterDTO,
    ListAndCountDTO,
    BrandDTO,
    PagingDTO,
} from '@dto/index';
import {
    DuplicatedEntryError,
    FailedToCreateError,
} from '@src/utils/errors/errors';

const LOG_TAG: string = '[Brand/Service]';

class BrandService {
    brandDao: BrandDao;
    constructor(brandDao?: BrandDao) {
        this.brandDao = brandDao ?? new BrandDao();
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

    async readPage(offset: number, limit: number, query: any) {
        const { target, keyword } = query;
        const whereOptions = {} as any;
        if (target && keyword) {
            switch (target) {
                case 'id':
                    whereOptions.brandIdx = keyword;
                    break;
                case 'name':
                    whereOptions.name = { [Op.startsWith]: keyword };
                    break;
                case 'englishName':
                    whereOptions.englishName = { [Op.startsWith]: keyword };
                    break;
            }
        }

        const { rows, count } = await this.brandDao.readPage(
            offset,
            limit,
            whereOptions
        );
        const list = rows.map((brand) => BrandDTO.createByJson(brand));
        return new ListAndCountDTO(count, list);
    }

    async create(
        name: string,
        englishName: string,
        description: string,
        firstInitial: string
    ) {
        try {
            return await this.brandDao.create(
                name,
                englishName,
                description,
                firstInitial
            );
        } catch (err: Error | any) {
            if (
                err.original.code === 'ER_DUP_ENTRY' ||
                err.parent.errno === 1062
            ) {
                throw new DuplicatedEntryError();
            }
            throw new FailedToCreateError();
        }
    }
}

export default BrandService;
