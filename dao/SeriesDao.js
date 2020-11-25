const pool = require('../utils/db/pool.js');
const {
    NotMatchedError, FailedToCreateError
} = require('../utils/errors/errors.js');

/**
 * 계열 생성
 * 
 */
const SQL_SERIES_INSERT = "INSERT INTO series(name, english_name, description) VALUES(?, ?, ?)";
module.exports.create = ({name, english_name, description}) => {
    return pool.queryParam_Parse(SQL_SERIES_INSERT, [name, english_name, description]);
}


/**
 * 계열 조회
 * 
 */
const SQL_SERIES_SELECT_BY_IDX = "SELECT series_idx, name, english_name FROM series WHERE series_idx = ?";
module.exports.read = async (series_idx) => {
    const result = await pool.queryParam_Parse(SQL_SERIES_SELECT_BY_IDX, [series_idx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];
}


/**
 * 계열 전체 조회
 */
const SQL_SERIES_SELECT_ALL = "SELECT series_idx, name, english_name FROM series";
module.exports.readAll = async () => {
    return pool.queryParam_None(SQL_SERIES_SELECT_ALL);
}


/**
 * 계열 수정
 */
const SQL_SERIES_UPDATE = "UPDATE series SET name = ?, english_name = ? WHERE series_idx = ?";
module.exports.update = async ({series_idx, name, english_name}) => {
    return pool.queryParam_Parse(SQL_SERIES_UPDATE, [name, english_name, series_idx]);
}


/**
 * 계열 삭제
 */
const SQL_SERIES_DELETE = "DELETE FROM series WHERE series_idx = ?";
module.exports.delete = async (series_idx) => {
    return pool.queryParam_Parse(SQL_SERIES_DELETE, [series_idx]);   
}