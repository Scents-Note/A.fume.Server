const pool = require('../utils/db/pool.js');
const { NotMatchedError, FailedToCreateError } = require('../utils/errors/errors.js');

/**
 * 노트 생성
 */
const SQL_NOTE_INSERT = "INSERT INTO note(ingredient_idx, perfume_idx, type) VALUES (?, ?, ?)"
module.exports.create = async({ingredient_idx, perfume_idx, type}) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_INSERT, [ingredient_idx, perfume_idx, type]);
    return result.affectedRows;
}

/**
 * 향수 정보로 노트 전체 조회
 */
const SQL_NOTE_SELECT_BY_PERFUME_IDX = "SELECT ingredient_idx as ingredientIdx, type FROM note WHERE perfume_idx = ?";
module.exports.read = async (perfume_idx) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_SELECT_BY_PERFUME_IDX, [perfume_idx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    return result;
}


/**
 * 노트 업데이트
 */
const SQL_NOTE_UPDATE = "UPDATE note SET ingredient_idx = ?, type = ? WHERE perfume_idx = ?";
module.exports.update = async ({ingredient_idx, type, perfume_idx}) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_UPDATE, [ingredient_idx, type, perfume_idx]);
    return result.affectedRows;
}


/**
 * 노트 삭제
 */
const SQL_NOTE_DELETE = "DELETE FROM note WHERE perfume_idx = ? AND ingredient_idx = ?";
module.exports.delete = async (perfume_idx, ingredient_idx) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_DELETE, [perfume_idx, ingredient_idx]);   
    return result.affectedRows;
}