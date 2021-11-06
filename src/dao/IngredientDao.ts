import IngredientDTO from '../data/dto/IngredientDTO';

const { NotMatchedError } = require('../utils/errors/errors.js');

const { Ingredient, Sequelize } = require('../models');
const { ListAndCountDTO } = require('../data/dto');
const { Op } = Sequelize;

class IngredientDao {
    /**
     * 재료 PK로 조회
     *
     * @param {number} ingredientIdx
     * @return {Promise<IngredientDTO>} ingredientDTO
     * @throws {NotMatchedError}
     */
    async readByIdx(ingredientIdx: number) {
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
     * @throws {NotMatchedError}
     */
    async readByName(ingredientName: string) {
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
     * @throws {NotMatchedError}
     */
    async readAll(where: any) {
        const result = await Ingredient.findAndCountAll({
            where,
            nest: true,
            raw: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        return new ListAndCountDTO({
            count: result.count,
            rows: result.rows.map((it: any) => IngredientDTO.createByJson(it)),
        });
    }
    /**
     * 재료 검색
     *
     * @param {number} pagingIndex
     * @param {number} pagingSize
     * @param {array} order
     * @returns {Promise<ListAndCountDTO<IngredientDTO>} listAndCountDTO<IngredientDTO>
     */
    async search(pagingIndex: number, pagingSize: number, order: string[]) {
        return Ingredient.findAndCountAll({
            offset: (pagingIndex - 1) * pagingSize,
            limit: pagingSize,
            order,
            raw: true,
            nest: true,
        }).then((result: any) => {
            const { count, rows } = result;
            return new ListAndCountDTO({
                count,
                rows: rows.map((it: any) => IngredientDTO.createByJson(it)),
            });
        });
    }

    /**
     * 계열 목록에 해당하는 재료 조회
     *
     * @param {number[]} seriesIdxList
     * @return {Promise<IngredientDTO[]>} IngredientDTO[]
     */
    async readBySeriesIdxList(seriesIdxList: number[]) {
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
     * @throws {NotMatchedError}
     */
    async findIngredient(condition: any) {
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
}

export default IngredientDao;
