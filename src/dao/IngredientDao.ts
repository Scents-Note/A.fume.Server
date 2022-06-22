import { logger } from '@modules/winston';

import { NotMatchedError } from '@errors';

import { IngredientDTO, ListAndCountDTO, PagingDTO } from '@dto/index';

const { Ingredient, Sequelize } = require('@sequelize');
const { Op } = Sequelize;

const LOG_TAG: string = '[Ingredient/DAO]';

class IngredientDao {
    /**
     * 재료 PK로 조회
     *
     * @param {number} ingredientIdx
     * @return {Promise<IngredientDTO>} ingredientDTO
     * @throws {NotMatchedError} if there is no ingredient
     */
    async readByIdx(ingredientIdx: number): Promise<IngredientDTO> {
        logger.debug(`${LOG_TAG} readByIdx(ingredientIdx = ${ingredientIdx})`);
        const result: any = await Ingredient.findByPk(ingredientIdx, {
            nest: true,
            raw: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return IngredientDTO.createByJson(result);
    }

    /**
     * 재료 이름으로 조회
     *
     * @param {string} ingredientName
     * @return {Promise<IngredientDTO>} ingredientDTO
     * @throws {NotMatchedError} if there is no ingredient
     */
    async readByName(ingredientName: string): Promise<IngredientDTO> {
        logger.debug(
            `${LOG_TAG} readByName(ingredientName = ${ingredientName})`
        );
        const result = await Ingredient.findOne({
            where: { name: ingredientName },
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return IngredientDTO.createByJson(result);
    }

    /**
     * 재료 조회
     *
     * @param {IngredientDTO} where
     * @return {Promise<ListAndCountDTO>} listAndCountDTO
     * @throws {NotMatchedError} if there is no ingredient
     */
    async readAll(where: any): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} readAll(where = ${JSON.stringify(where)})`);
        const result = await Ingredient.findAndCountAll({
            where,
            nest: true,
            raw: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return new ListAndCountDTO<IngredientDTO>(
            result.count,
            result.rows.map((it: any) => IngredientDTO.createByJson(it))
        );
    }
    /**
     * 재료 검색
     *
     * @param {PagingDTO} pagingDTO
     * @returns {Promise<ListAndCountDTO<IngredientDTO>>} listAndCountDTO<IngredientDTO>
     */
    async search(
        pagingDTO: PagingDTO
    ): Promise<ListAndCountDTO<IngredientDTO>> {
        logger.debug(`${LOG_TAG} search(pagingDTO = ${pagingDTO})`);
        return Ingredient.findAndCountAll(
            Object.assign(
                {
                    raw: true,
                    nest: true,
                },
                pagingDTO.sequelizeOption
            )
        ).then((result: any) => {
            const { count, rows } = result;
            return new ListAndCountDTO<IngredientDTO>(
                count,
                rows.map((it: any) => IngredientDTO.createByJson(it))
            );
        });
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
     * 재료 검색
     *
     * @param {Object} condition
     * @returns {Promise<IngredientDTO>} ingredientDTO
     * @throws {NotMatchedError} if there is no ingredient
     */
    async findIngredient(condition: any): Promise<IngredientDTO> {
        logger.debug(
            `${LOG_TAG} findIngredient(condition = ${JSON.stringify(
                condition
            )})`
        );
        // reason for converting json is remove key that has undefined value
        condition = JSON.parse(JSON.stringify(condition));
        return Ingredient.findOne({
            where: condition,
            raw: true,
            nest: true,
        }).then((result: any) => {
            if (!result) {
                throw new NotMatchedError();
            }
            return IngredientDTO.createByJson(result);
        });
    }

    /**
     * 재료 카테고리 리스트 조회
     *
     * @returns {Promise<String[]>} listAndCountDTO<String>
     */
    async getCategoryList(): Promise<String[]> {
        logger.debug(`${LOG_TAG} getCategoryList()`);
        return Ingredient.findAll({
            attributes: [
                [
                    Sequelize.fn('DISTINCT', Sequelize.col('category')),
                    'category',
                ],
            ],
            raw: true,
            nest: true,
        }).then((result: any[]) => {
            return result.map((it) => it.category);
        });
    }

    /**
     * 카테고리 리스트에 해당하는 ingredientIdx 리스트 조회
     *
     * @param {string[]} categoryList
     * @returns {Promise<IngredientDTO[]>} listAndCountDTO<IngredientDTO>
     */
    async getIngredientIdxByCategories(
        categoryList: string[]
    ): Promise<IngredientDTO[]> {
        logger.debug(`${LOG_TAG} getCategoryList()`);
        return Ingredient.findAll({
            raw: true,
            nest: true,
            where: {
                category: {
                    [Op.in]: categoryList,
                },
            },
        });
    }
}

export default IngredientDao;
