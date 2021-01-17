const {
    NotMatchedError,
    FailedToCreateError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { Ingredient, JoinSeriesIngredient, sequelize } = require('../models');

/**
 * 재료 생성
 *
 * @param {Object} Series
 * @return {Promise<number>}
 */
module.exports.create = ({
    name,
    englishName,
    description,
    imageUrl,
    seriesIdx,
}) => {
    return sequelize
        .transaction(async (t) => {
            const ingredient = await Ingredient.create(
                {
                    name,
                    englishName,
                    description,
                    imageUrl,
                },
                { transaction: t }
            );
            if (!ingredient) {
                throw new FailedToCreateError();
            }
            const joinSeriesIngredient = await JoinSeriesIngredient.create(
                {
                    ingredientIdx: ingredient.ingredientIdx,
                    seriesIdx,
                },
                { transaction: t }
            );
            if (!joinSeriesIngredient) {
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
    const result = await Ingredient.findByPk(ingredientIdx);
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
        where: { name: ingredientName },
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 재료 전체 조회
 */
module.exports.readAll = (order = [['createdAt', 'desc']]) => {
    return Ingredient.findAll({
        order,
    });
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
        offset: (pagingIndex - 1) * pagingSize,
        limit: pagingSize,
        order,
    });
};

/**
 * 재료 수정
 *
 */
module.exports.update = async ({
    ingredientIdx,
    name,
    englishName,
    description,
    imageUrl,
}) => {
    const [affectedRows] = await Ingredient.update(
        { name, englishName, description, imageUrl },
        { where: { ingredientIdx } }
    );
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
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
