import { logger } from '@modules/winston';

import IngredientDao from '@dao/IngredientDao';

import {
    IngredientCategoryDTO,
    IngredientDTO,
    ListAndCountDTO,
    PagingDTO,
} from '@dto/index';
import { Op } from 'sequelize';
import {
    DuplicatedEntryError,
    FailedToCreateError,
} from '@src/utils/errors/errors';

const LOG_TAG: string = '[Ingredient/Service]';

class IngredientService {
    ingredientDao: IngredientDao;

    constructor(ingredientDao?: IngredientDao) {
        this.ingredientDao = ingredientDao ?? new IngredientDao();
    }

    /**
     * 향료 목록 조회
     *
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
     * @throws {NotMatchedError} if there is no Ingredient
     **/
    getIngredientAll(
        pagingDTO?: PagingDTO
    ): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} getIngredientAll()`);
        return this.ingredientDao.readAll({}, pagingDTO);
    }

    /**
     * 계열에 해당하는 재료 조회
     *
     * @param {number} seriesIdx
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} ListAndCountDTO<IngredientDTO>
     * @throws {NotMatchedError} if there is no Ingredient
     */
    getIngredientList(
        seriesIdx: number
    ): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} getIngredientList(seriesIdx = ${seriesIdx})`);
        return this.ingredientDao.readAll({ seriesIdx });
    }

    setIngredientDao(dao: IngredientDao) {
        this.ingredientDao = dao;
    }

    async readPage(offset: number, limit: number, query: any) {
        const { target, keyword } = query;
        const whereOptions = {} as any;
        if (target && keyword) {
            switch (target) {
                case 'id':
                    whereOptions.ingredientIdx = keyword;
                    break;
                case 'name':
                    whereOptions.name = { [Op.startsWith]: keyword };
                    break;
                case 'englishName':
                    whereOptions.englishName = { [Op.startsWith]: keyword };
                    break;
            }
        }

        const { rows, count } = await this.ingredientDao.readPage(
            offset,
            limit,
            whereOptions
        );
        const perfumesWithCategory = rows.map((perfume) => {
            return {
                ...perfume,
                IngredientCategory: IngredientCategoryDTO.createByJson(perfume),
            };
        });
        return new ListAndCountDTO(count, perfumesWithCategory);
    }

    async create(name: string, seriesIdx: number, categoryIdx: number) {
        try {
            return await this.ingredientDao.create(
                name,
                seriesIdx,
                categoryIdx
            );
        } catch (err: Error | any) {
            if (err.parent.errno === 1062) {
                throw new DuplicatedEntryError();
            }

            throw new FailedToCreateError();
        }
    }
}

export default IngredientService;
