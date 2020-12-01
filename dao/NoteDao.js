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
const SQL_NOTE_SELECT_BY_PERFUME_IDX = "SELECT b.ingredient_idx, b.name, b.english_name, b.description, b.image_url, a.type " + 
"FROM note a inner JOIN ingredient b ON (a.ingredient_idx = b.ingredient_idx) where perfume_idx = ?";
module.exports.read = async (perfume_idx) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_SELECT_BY_PERFUME_IDX, [perfume_idx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    return result;
}


/**
 * 노트 타입 업데이트
 */
const SQL_NOTE_TYPE_UPDATE = "UPDATE note SET type = ? WHERE perfume_idx = ? AND ingredient_idx = ?";
module.exports.updateType = async ({ingredient_idx, type, perfume_idx}) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_TYPE_UPDATE, [type, perfume_idx, ingredient_idx]);
    return result.affectedRows;
}


/**
 * 노트 재료 업데이트
 */
const SQL_NOTE_INGREDIENT_UPDATE = "UPDATE note SET ingredient_idx = ? WHERE perfume_idx = ? AND type = ?";
module.exports.updateIngredient = async ({ingredient_idx, type, perfume_idx}) => {
    const result = await pool.queryParam_Parse(SQL_NOTE_INGREDIENT_UPDATE, [ingredient_idx, perfume_idx, type]);
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