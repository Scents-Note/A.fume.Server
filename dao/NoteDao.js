const pool = require('../utils/db/pool.js');
const { NotMatchedError, FailedToCreateError } = require('../utils/errors/errors.js');

/**
 * 노트 생성
 */
const SQL_NOTE_INSERT = "INSERT INTO note(ingredient_idx, perfume_idx, type) VALUES (?, ?, ?)"
module.exports.create = async({ingredient_idx, perfume_idx, type}) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_INSERT, [ingredient_idx, perfume, type]);
    return result.affectedRows;
}

/**
 * 향수 정보로 노트 조회
 */
const SQL_NOTE_SELECT_BY_PERFUME_IDX = "SELECT ingredient_idx, type FROM note WHERE perfume_idx = ?";
module.exports.read = async (perfume_idx) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_SELECT_BY_PERFUME_IDX, [perfume_idx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    console.log(result);
    return result;
}


/**
 * 노트 업데이트
 */


/**
 * 노트 삭제
 */