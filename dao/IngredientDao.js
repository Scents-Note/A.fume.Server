const {
    NotMatchedError,
    FailedToCreateError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { Ingredient, Series, Note, Sequelize } = require('../models');
const { Op } = Sequelize;

/**
 * 재료 생성
 *
 * @param {Object} Series
 * @return {Promise<number>}
 */
module.exports.create = ({
    seriesIdx,
    name,
    englishName,
    description,
    imageUrl,
}) => {
    return Ingredient.create({
        seriesIdx,
        name,
        englishName,
        description,
        imageUrl,
    })
        .then((ingredient) => {
            if (!ingredient) {
                throw new FailedToCreateError();
            }
            return ingredient.ingredientIdx;
        })
        .catch((err) => {
            if (
                err.parent &&
                (err.parent.errno === 1062 ||
                    err.parent.code === 'ER_DUP_ENTRY')
            ) {
                throw new DuplicatedEntryError();
            }
            throw err;
        });
};

/**
 * 재료 PK로 조회
 *
 * @param {number} ingredientIdx
 * @return {Promise<Ingredient>}
 */
module.exports.readByIdx = async (ingredientIdx) => {
    const result = await Ingredient.findByPk(ingredientIdx, {
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        nest: true,
        raw: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 재료 이름으로 조회
 *
 * @param {string} ingredientName
 * @return {Promise<Ingredient>}
 */
module.exports.readByName = async (ingredientName) => {
    const result = await Ingredient.findOne({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: { name: ingredientName },
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 재료 조회
 */
module.exports.readAll = async (where) => {
    const result = await Ingredient.findAndCountAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where,
        nest: true,
        raw: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 재료 검색
 *
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @param {array} order
 * @returns {Promise<Ingredient[]>}
 */
module.exports.search = (pagingIndex, pagingSize, order) => {
    return Ingredient.findAndCountAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
    });
};

/**
 * 재료 수정
 *
 */
module.exports.update = ({
    ingredientIdx,
    name,
    englishName,
    description,
    imageUrl,
}) => {
    return Ingredient.update(
        { name, englishName, description, imageUrl },
        { where: { ingredientIdx } }
    )
        .then(([affectedRows]) => {
            if (affectedRows == 0) {
                throw new NotMatchedError();
            }
            return affectedRows;
        })
        .catch((err) => {
            if (
                err.parent &&
                (err.parent.errno === 1062 ||
                    err.parent.code === 'ER_DUP_ENTRY')
            ) {
                throw new DuplicatedEntryError();
            }
            throw err;
        });
};

/**
 * 재료 삭제
 *
 * @param {number} ingredientIdx
 * @returns {Promise<number>} affectedRow
 */
module.exports.delete = (ingredientIdx) => {
    return Ingredient.destroy({ where: { ingredientIdx } });
};

/**
 * 계열 목록에 해당하는 재료 조회
 *
 * @param {number[]} seriesIdxList
 * @return {Promise<Ingredients[]>}
 */
module.exports.readBySeriesIdxList = async (seriesIdxList) => {
    const result = await Ingredient.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt'],
        },
        where: {
            seriesIdx: {
                [Op.in]: seriesIdxList,
            },
        },
        raw: true,
        nest: true,
    });
    return result;
};

/**
 * 재료 검색
 *
 * @param {Object} condition
 * @returns {Promise<Ingredient>}
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
        return it;
    });
};
