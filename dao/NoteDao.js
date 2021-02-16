const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');

const { Note } = require('../models');

/**
 * 노트 생성
 *
 * @param {Object} Note
 * @returns {Promise<Note>}
 */
module.exports.create = ({ ingredientIdx, perfumeIdx, type }) => {
    return Note.create({ ingredientIdx, perfumeIdx, type })
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
            throw err;
        });
};

/**
 * 향수 정보로 노트 전체 조회
 *
 * @param {number} perfumeIdx
 * @returns {Promise<Note[]>}
 */
module.exports.read = (perfumeIdx) => {
    return Note.findAll({ where: { perfumeIdx } });
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
    return Note.destroy({ where: { perfumeIdx, ingredientIdx } });
};
