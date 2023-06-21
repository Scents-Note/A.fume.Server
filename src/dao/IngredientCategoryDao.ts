import { logger } from '@modules/winston';

import { IngredientCategoryDTO } from '@src/data/dto';

import { IngredientCategories } from '@sequelize';
import { WhereOptions } from 'sequelize';

const LOG_TAG: string = '[IngredientCategory/DAO]';

class IngredientCategoryDao {
    /**
     * 재료 카테고리 조회
     *
     * @param {IngredientDTO} where
     * @return {Promise<ListAndCountDTO>} listAndCountDTO
     * @throws {NotMatchedError} if there is no ingredient
     */
    async readAll(where: any): Promise<IngredientCategoryDTO[]> {
        logger.debug(`${LOG_TAG} readAll(where = ${JSON.stringify(where)})`);
        const result = await IngredientCategories.findAll({
            where,
            nest: true,
            raw: true,
        });
        return result.map((it: any) => IngredientCategoryDTO.createByJson(it));
    }

    /**
     * 향료 카테고리 조회
     *
     * @returns {Promise<IngredientDTO[]>}
     */

    async readPage(offset: number, limit: number, where?: WhereOptions) {
        try {
            return IngredientCategories.findAll({
                offset,
                limit,
                where,

                raw: true,
                nest: true,
            });
        } catch (error) {
            // Handle the error appropriately
            console.error('Error occurred while reading page:', error);
            throw error;
        }
    }
}

export default IngredientCategoryDao;
