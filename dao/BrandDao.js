const pool = require('../utils/db/pool.js');

const {
    NotMatchedError,
    FailedToCreateError,
} = require('../utils/errors/errors.js');

/**
 * 브랜드 생성
 * @param {} param0 
 */
const SQL_BRAND_INSERT = 'INSERT brand(name, english_name, start_character, image_url, description) VALUES(?, ?, ?, ?, ?)';
module.exports.create = async ({
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
}) => {
    const { insertId } = await pool.queryParam_Parse(SQL_BRAND_INSERT, [name, englishName, startCharacter, imageUrl, description]);
    if(insertId == 0) {
        throw new FailedToCreateError();
    }
    return insertId;
}

/**
 * 브랜드 세부 조회 
 * 
 */
const SQL_BRAND_SELECT_BY_IDX = 'SELECT brand_idx as brandIdx, name, english_name as englishName, start_character as startCharacter, image_url as imageUrl, description FROM brand WHERE brand_idx = ?';
module.exports.read = async (brandIdx) => {
    const result = await pool.queryParam_Parse(SQL_BRAND_SELECT_BY_IDX, [brandIdx]);
    if (result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];
}

/**
 * 브랜드 전체 목록 조회
 * 
 */
const SQL_BRAND_SELECT_ALL = 'SELECT brand_idx as brandIdx, name, english_name as englishName, start_character as startCharacter, image_url as imageUrl, description FROM brand';
module.exports.readAll = () => {
    return pool.queryParam_None(SQL_BRAND_SELECT_ALL);
}

/**
 * 브랜드 수정
 * 
 */
const SQL_BRAND_UPDATE = 'UPDATE brand SET name = ?, english_name = ?, start_character = ?, image_url = ?, description = ? WHERE brand_idx = ?';
module.exports.update = async ({
    brandIdx,
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
}) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_BRAND_UPDATE, [name, englishName, startCharacter, imageUrl, description, brandIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}

/**
 * 브랜드 전체 삭제
 * 
 */
const SQL_BRAND_DELETE = 'DELETE FROM brand WHERE brand_idx = ?';
module.exports.delete = async (brandIdx) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_BRAND_DELETE, [brandIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}