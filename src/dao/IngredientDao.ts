import { logger } from '@modules/winston';

import { NotMatchedError } from '@errors';

import { IngredientDTO, ListAndCountDTO, PagingDTO } from '@dto/index';
import { Series, Ingredient, IngredientCategories } from '@sequelize';
import { Op, WhereOptions } from 'sequelize';

const LOG_TAG: string = '[Ingredient/DAO]';

class IngredientDao {
    /**
     * 재료 조회
     *
     * @param {IngredientDTO} where
     * @return {Promise<ListAndCountDTO>} listAndCountDTO
     * @throws {NotMatchedError} if there is no ingredient
     */
    async readAll(
        where: any,
        pagingDTO?: PagingDTO
    ): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} readAll(where = ${JSON.stringify(where)})`);
        const result = await Ingredient.findAndCountAll(
            Object.assign(
                {
                    where,
                    raw: true,
                    nest: true,
                },
                pagingDTO ? pagingDTO.sequelizeOption() : {}
            )
        );
        if (!result) {
            throw new NotMatchedError();
        }
        return new ListAndCountDTO<IngredientDTO>(
            result.count,
            result.rows.map((it: any) => IngredientDTO.createByJson(it))
        );
    }

    /**
     * 계열 목록에 해당하는 재료 조회
     *
     * @param {number[]} seriesIdxList
     * @return {Promise<IngredientDTO[]>} IngredientDTO[]
     */
    async readBySeriesIdxList(
        seriesIdxList: number[]
    ): Promise<IngredientDTO[]> {
        logger.debug(
            `${LOG_TAG} readBySeriesIdxList(seriesIdxList = ${seriesIdxList})`
        );
        return Ingredient.findAll({
            where: {
                seriesIdx: {
                    [Op.in]: seriesIdxList,
                },
            },
            raw: true,
            nest: true,
        }).then((result: any) => {
            return result.map((it: any) => IngredientDTO.createByJson(it));
        });
    }
    /**
     * 카테고리 리스트에 해당하는 ingredientIdx 리스트 조회
     *
     * @param {string[]} categoryList
     * @returns {Promise<IngredientDTO[]>} listAndCountDTO<IngredientDTO>
     */
    async getIngredientIdxByCategories(
        categoryIdxList: number[]
    ): Promise<Ingredient[]> {
        logger.debug(`${LOG_TAG} getIngredientIdxByCategories()`);
        return Ingredient.findAll({
            raw: true,
            nest: true,
            where: {
                categoryIdx: {
                    [Op.in]: categoryIdxList,
                },
            },
        });
    }

    /**
     * 향수 전체 조회
     *
     * @returns {Promise<IngredientDTO[]>}
     */
    async readPage(offset: number, limit: number, where?: WhereOptions) {
        logger.debug(`${LOG_TAG} readAll()`);
        return Ingredient.findAndCountAll({
            offset,
            limit,
            include: [
                { model: Series, as: 'Series' },
                { model: IngredientCategories, as: 'IngredientCategories' },
            ],
            where,
            raw: true,
            nest: true,
            order: [['createdAt', 'desc']],
        });
    }
}

export default IngredientDao;
