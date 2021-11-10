import { NotMatchedError } from '../utils/errors/errors';

const { Ingredient, Sequelize } = require('../models');
const { IngredientDTO, ListAndCountDTO } = require('../data/dto');
const { Op } = Sequelize;

/**
 * 재료 PK로 조회
 *
 * @param {number} ingredientIdx
 * @return {Promise<IngredientDTO>} ingredientDTO
 * @throws {NotMatchedError}
 */
module.exports.readByIdx = async (ingredientIdx) => {
    const result = await Ingredient.findByPk(ingredientIdx, {
        nest: true,
        raw: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return new IngredientDTO(result);
};

/**
 * 재료 이름으로 조회
 *
 * @param {string} ingredientName
 * @return {Promise<IngredientDTO>} ingredientDTO
 * @throws {NotMatchedError}
 */
module.exports.readByName = async (ingredientName) => {
    const result = await Ingredient.findOne({
        where: { name: ingredientName },
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return new IngredientDTO(result);
};

/**
 * 재료 조회
 *
 * @param {IngredientDTO} where
 * @return {Promise<ListAndCountDTO>} listAndCountDTO
 * @throws {NotMatchedError}
 */
module.exports.readAll = async (where) => {
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
        rows: result.rows.map((it) => new IngredientDTO(it)),
    });
};

/**
 * 재료 검색
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} order
 * @returns {Promise<ListAndCountDTO<IngredientDTO>} listAndCountDTO<IngredientDTO>
 */
module.exports.search = (pagingIndex, pagingSize, order) => {
    return Ingredient.findAndCountAll({
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
        raw: true,
        nest: true,
    }).then(({ count, rows }) => {
        return new ListAndCountDTO({
            count,
            rows: rows.map((it) => new IngredientDTO(it)),
        });
    });
};

/**
 * 계열 목록에 해당하는 재료 조회
 *
 * @param {number[]} seriesIdxList
 * @return {Promise<IngredientDTO[]>} IngredientDTO[]
 */
module.exports.readBySeriesIdxList = (seriesIdxList) => {
    return Ingredient.findAll({
        where: {
            seriesIdx: {
                [Op.in]: seriesIdxList,
            },
        },
        raw: true,
        nest: true,
    }).then((result) => {
        return result.map((it) => new IngredientDTO(it));
    });
};

/**
 * 재료 검색
 *
 * @param {Object} condition
 * @returns {Promise<IngredientDTO>} ingredientDTO
 * @throws {NotMatchedError}
 */
module.exports.findIngredient = (condition) => {
    return Ingredient.findOne({
        where: { ...condition },
        raw: true,
        nest: true,
    }).then((it) => {
        if (!it) {
            throw new NotMatchedError();
        }
        return new IngredientDTO(it);
    });
};
