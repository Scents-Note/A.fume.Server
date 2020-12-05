const pool = require('../utils/db/pool.js');

/**
 * 향수 조회 기록
 * @param {number} userIdx
 * @param {number} perfumeIdx
 */
const SQL_SEARCH_HISTORY_INSERT = 'INSERT search_history(user_idx, perfume_idx) VALUES(?, ?)';
module.exports.create = (userIdx, perfumeIdx) => {
    return pool.queryParam_Parse(SQL_SEARCH_HISTORY_INSERT, [userIdx, perfumeIdx]);
}
