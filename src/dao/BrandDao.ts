import { logger } from '@modules/winston';
import { NotMatchedError } from '@errors';

import { BrandDTO, PagingDTO, ListAndCountDTO } from '@dto/index';

import { Brand } from '@sequelize';
import { WhereOptions } from 'sequelize';
const LOG_TAG: string = '[Brand/DAO]';

class BrandDao {
    /**
     * 브랜드 세부 조회
     *
     * @param {number} brandIdx
     * @returns {Promise<BrandDTO>}
     * @throws {NotMatchedError} if there is no brand
     */
    async read(brandIdx: number): Promise<BrandDTO> {
        logger.debug(`${LOG_TAG} read(brandIdx = ${brandIdx})`);
        const result = await Brand.findByPk(brandIdx, {
            nest: true,
            raw: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return BrandDTO.createByJson(result);
    }

    /**
     * 브랜드 전체 목록 조회
     *
     * @params {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<BrandDTO>>}
     */
    async readAll(pagingDTO?: PagingDTO): Promise<ListAndCountDTO<BrandDTO>> {
        logger.debug(`${LOG_TAG} readAll(pagingDTO = ${pagingDTO})`);
        return Brand.findAndCountAll(
            Object.assign(
                {
                    raw: true,
                    nest: true,
                },
                pagingDTO ? pagingDTO.sequelizeOption() : {}
            )
        ).then((result: any) => {
            return new ListAndCountDTO<BrandDTO>(
                result.count,
                result.rows.map(BrandDTO.createByJson)
            );
        });
    }

    /**
     * 브랜드 전체 조회
     *
     * @returns {Promise<Brand[]>}
     */
    async readPage(offset: number, limit: number, where?: WhereOptions) {
        logger.debug(`${LOG_TAG} readAll()`);
        return Brand.findAndCountAll({
            offset,
            limit,
            where,
            raw: true,
            nest: true,
            order: [['createdAt', 'desc']],
        });
    }

    async create(
        name: string,
        englishName: string,
        description: string,
        firstInitial: string
    ) {
        return Brand.create({
            name,
            englishName,
            description,
            firstInitial,
        });
    }
}

export default BrandDao;
