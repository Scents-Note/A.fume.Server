const {
    NotMatchedError,
    DuplicatedEntryError,
    InvalidInputError,
} = require('../utils/errors/errors.js');

const { Note, Ingredient, sequelize, Sequelize } = require('../../models');
const { Op } = Sequelize;
const { NoteDTO } = require('../data/dto');

const {
    NOTE_TYPE_SINGLE,
    NOTE_TYPE_TOP,
    NOTE_TYPE_MIDDLE,
    NOTE_TYPE_BASE,
} = require('../utils/constantUtil');
/**
 * 노트 생성
 *
 * @param {Object} Note
 * @returns {Promise<Note>}
 */
module.exports.create = ({ ingredientIdx, perfumeIdx, type }) => {
    if (
        [
            NOTE_TYPE_SINGLE,
            NOTE_TYPE_TOP,
            NOTE_TYPE_MIDDLE,
            NOTE_TYPE_BASE,
        ].indexOf(type) == -1
    ) {
        return new Promise((resolve, reject) => {
            reject(new InvalidInputError());
        });
    }
    return Note.create(
        { ingredientIdx, perfumeIdx, type },
        {
            raw: true,
            note: true,
        }
    )
        .then((note) => {
            return note;
        })
        .catch((err) => {
            if (
                err.parent.errno === 1062 ||
                err.parent.code === 'ER_DUP_ENTRY'
            ) {
                throw new DuplicatedEntryError();
            }
            if (
                err.parent.errno === 1452 ||
                err.parent.code === 'ER_NO_REFERENCED_ROW_2'
            ) {
                throw new NotMatchedError();
            }
            throw err;
        });
};

/**
 * 노트 조회
 *
 * @param {Object} where
 * @returns {Promise<Note[]>}
 */
module.exports.read = (where) => {
    return Note.findAll({
        attributes: {
            exclude: ['updatedAt', 'createdAt'],
        },
        where,
        nest: true,
        raw: true,
    });
};

/**
 * 노트 타입 업데이트
 *
 * @param {Object}
 * @returns {Promise<number>} affectedRows
 */
module.exports.updateType = async ({ type, perfumeIdx, ingredientIdx }) => {
    const [affectedRows] = await Note.update(
        { type },
        { where: { ingredientIdx, perfumeIdx } }
    );
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 노트 삭제
 *
 * @param {number} perfumeIdx
 * @param {number} ingredientIdx
 * @returns {Promise}
 */
module.exports.delete = (perfumeIdx, ingredientIdx) => {
    return Note.destroy({
        where: { perfumeIdx, ingredientIdx },
    });
};

/**
 * 재료별 사용된 향수 개수 카운트
 *
 * @param {number[]} ingredientIdxList
 * @returns {Promise<Ingredient>}
 */
module.exports.countIngredientUsed = async (ingredientIdxList) => {
    const result = await Note.findAll({
        attributes: {
            include: [
                [sequelize.fn('count', sequelize.col('perfume_idx')), 'count'],
            ],
        },
        where: {
            ingredientIdx: {
                [Op.in]: ingredientIdxList,
            },
        },
        group: ['ingredient_idx'],
        raw: true,
        nest: true,
    });

    return result;
};

/**
 * 향수에 해당하는 재료 조회
 *
 * @param {number} perfumeIdx
 * @return {Promise<NoteDTO[]>} NoteDTO[]
 */
module.exports.readByPerfumeIdx = async (perfumeIdx) => {
    const result = await Note.findAll({
        include: [
            {
                model: Ingredient,
                as: 'Ingredients',
                attributes: ['name'],
            },
        ],
        where: {
            perfumeIdx,
        },
        raw: true,
        nest: true,
    });
    return result.map(
        (it) =>
            new NoteDTO(
                Object.assign({}, it, { ingredientName: it.Ingredients.name })
            )
    );
};
