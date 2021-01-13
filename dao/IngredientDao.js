const pool = require('../utils/db/pool.js');
const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');

/**
 * 재료 생성
 * - Ingredient Table에 재료 추가
 * - join_series_ingredient 테이블에 재료가 어떤 Series인지도 추가
 * - Transaction 처리 부탁드립니다.
 */
const SQL_INGREDIENT_INSERT =
    'INSERT INTO ingredient(name, english_name, description) VALUES(?, ?, ?)';
const SQL_SERIES_INGREDIENT_INSERT =
    'INSERT INTO join_series_ingredient(ingredient_idx, series_idx) ' +
    'VALUES (?, (SELECT series_idx FROM series WHERE name = ? OR english_name = ?))';
module.exports.create = async ({
    name,
    englishName,
    description,
    seriesName,
}) => {
    const result = await pool.Transaction(async (connection) => {
        const ingredientResult = await connection.query(SQL_INGREDIENT_INSERT, [
            name,
            englishName,
            description,
        ]);
        if (ingredientResult.insertId == 0) {
            throw new FailedToCreateError();
        }
        const ingredientIdx = ingredientResult.insertId;
        const ingredientSeriesResult = await connection.query(
            SQL_SERIES_INGREDIENT_INSERT,
            [ingredientIdx, seriesName, seriesName]
        );
        if (ingredientSeriesResult.affectedRows == 0) {
            throw new FailedToCreateError();
        }
        return ingredientIdx;
    });
    return result[0];
};

/**
 * 재료 조회
 *
 */
const SQL_INGREDIENT_SELECT_BY_IDX =
    'SELECT ingredient_idx as ingredientIdx, name, english_name as englishName FROM ingredient WHERE ingredient_idx = ?';
module.exports.read = async (ingredientIdx) => {
    const result = await pool.queryParam_Parse(SQL_INGREDIENT_SELECT_BY_IDX, [
        ingredientIdx,
    ]);
    if (result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];
};

/**
 * 재료 전체 조회
 */
const SQL_INGREDIENT_SELECT_ALL =
    'SELECT ingredient_idx as ingredientIdx, name, english_name as englishName FROM ingredient';
module.exports.readAll = async () => {
    const result = await pool.queryParam_None(SQL_INGREDIENT_SELECT_ALL);
    return result;
};

/**
 * 재료 수정
 *
 */
const SQL_INGREDIENT_UPDATE =
    'UPDATE ingredient SET name = ?, english_name = ?, description = ? WHERE ingredient_idx = ?';
module.exports.update = async ({
    ingredientIdx,
    name,
    englishName,
    description,
}) => {
    const { affectedRows } = await pool.queryParam_Parse(
        SQL_INGREDIENT_UPDATE,
        [name, englishName, description, ingredientIdx]
    );
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 재료 삭제
 */
const SQL_INGREDIENT_DELETE = 'DELETE FROM ingredient WHERE ingredient_idx = ?';
module.exports.delete = async (ingredientIdx) => {
    const { affectedRows } = await pool.queryParam_Parse(
        SQL_INGREDIENT_DELETE,
        [ingredientIdx]
    );
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};
