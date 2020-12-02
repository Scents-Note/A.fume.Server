const pool = require('../utils/db/pool.js');
const { NotMatchedError, FailedToCreateError } = require('../utils/errors/errors.js');

/**
 * 재료 생성
 * - Ingredient Table에 재료 추가
 * - join_series_ingredient 테이블에 재료가 어떤 Series인지도 추가
 * - Transaction 처리 부탁드립니다.
 */
const SQL_INGREDIENT_INSERT = "INSERT INTO ingredient(name, english_name, description) VALUES(?, ?, ?)"
const SQL_SERIES_INGREDIENT_INSERT = "INSERT INTO join_series_ingredient(ingredient_idx, series_idx) VALUES (?,?)"
module.exports.create = async ({name, english_name, description, series_idx}) => {
    const result = await pool.Transaction(async (connection) => {
        const ingredientResult = await connection.query(SQL_INGREDIENT_INSERT, [name, english_name, description]);
        if(ingredientResult.insertId == 0){
            throw new FailedToCreateError();
        }
        const ingredient_idx = ingredientResult.insertId;
        const ingredientSeriesResult = await connection.query(SQL_SERIES_INGREDIENT_INSERT, [ingredient_idx, series_idx]);
        if(ingredientSeriesResult.affectedRows==0){
            throw new FailedToCreateError();
        }
        return ingredient_idx;
    });
    return result[0];
}


/**
 * 재료 조회
 * 
 */
const SQL_INGREDIENT_SELECT_BY_IDX = "SELECT ingredient_idx as ingredientIdx, name, english_name as englishName FROM ingredient WHERE ingredient_idx = ?";
module.exports.read = async (ingredient_idx) => {
    const result = await pool.queryParam_Parse(SQL_INGREDIENT_SELECT_BY_IDX, [ingredient_idx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    // console.log(result);
    return result[0].name;
}


/**
 * 재료 전체 조회
 */
const SQL_INGREDIENT_SELECT_ALL = "SELECT ingredient_idx as ingredientIdx, name, english_name as englishName FROM ingredient";
module.exports.readAll = async () => {
    const result = await pool.queryParam_None(SQL_INGREDIENT_SELECT_ALL);
    return result.length;
}


/**
 * 재료 수정
 * 
 */
const SQL_INGREDIENT_UPDATE = "UPDATE ingredient SET name = ?, english_name = ? WHERE ingredient_idx = ?"
module.exports.update = async({ingredient_idx, name, english_name}) => {
    const result = await pool.queryParam_Parse(SQL_INGREDIENT_UPDATE, [name, english_name, ingredient_idx]);
    return result.affectedRows;
}


/**
 * 재료 삭제
 */
const SQL_INGREDIENT_DELETE = "DELETE FROM ingredient WHERE ingredient_idx = ?"
module.exports.delete = async(ingredient_idx) => {  
    const result = await pool.queryParam_Parse(SQL_INGREDIENT_DELETE, [ingredient_idx]); 
    return result.affectedRows;
}