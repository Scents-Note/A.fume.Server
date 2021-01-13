const pool = require('../utils/db/pool.js');
const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');

/**
 * 노트 생성
 */
const SQL_NOTE_INSERT =
    'INSERT INTO note(ingredient_idx, perfume_idx, type) ' +
    'VALUES ((SELECT ingredient_idx FROM ingredient WHERE name = ?), (SELECT perfume_idx FROM perfume WHERE name = ?), ?)';
module.exports.create = async ({ ingredientName, perfumeName, type }) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_INSERT, [
        ingredientName,
        perfumeName,
        type,
    ]);
    if (result.affectedRows == 0) {
        throw new FailedToCreateError();
    }
    return result.affectedRows;
};

/**
 * 향수 정보로 노트 전체 조회
 */
const SQL_NOTE_SELECT_BY_PERFUME_IDX =
    'SELECT b.ingredient_idx, b.name, b.english_name, b.description, b.image_url, a.type ' +
    'FROM note a inner JOIN ingredient b ON (a.ingredient_idx = b.ingredient_idx) where perfume_idx = ?';
module.exports.read = async (perfume_idx) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_SELECT_BY_PERFUME_IDX, [
        perfume_idx,
    ]);
    if (result.length == 0) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 노트 타입 업데이트
 */
const SQL_NOTE_TYPE_UPDATE =
    'UPDATE note SET type = ? WHERE perfume_idx = (SELECT perfume_idx FROM perfume WHERE name = ?) AND ingredient_idx = (SELECT ingredient_idx FROM ingredient WHERE name = ?)';
module.exports.updateType = async ({ type, perfumeName, ingredientName }) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_NOTE_TYPE_UPDATE, [
        type,
        perfumeName,
        ingredientName,
    ]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 노트 삭제
 */
const SQL_NOTE_DELETE =
    'DELETE FROM note WHERE perfume_idx = ? AND ingredient_idx = ?';
module.exports.delete = async (perfume_idx, ingredient_idx) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_NOTE_DELETE, [
        perfume_idx,
        ingredient_idx,
    ]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};
