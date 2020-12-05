const pool = require('../utils/db/pool.js');

const {
    NotMatchedError,
} = require('../utils/errors/errors.js');

const SQL_LIKE_PERFUME_INSERT = 'INSERT like_perfume(user_idx, perfume_idx) VALUES(?, ?)';
const SQL_LIKE_PERFUME_SELECT = 'SELECT user_idx as userIdx, perfume_idx as perfumeIdx FROM like_perfume WHERE user_idx = ? AND perfume_idx = ?';
const SQL_LIKE_PERFUME_DELETE = 'DELETE FROM like_perfume WHERE user_idx = ? AND perfume_idx';

/**
 * 향수 좋아요 생성
 * 
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.create = async (userIdx, perfumeIdx) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_LIKE_PERFUME_INSERT, [userIdx, perfumeIdx]);
    if(affectedRows == 0){
        throw new FailedToCreateError();
    }
    return affectedRows;
};


/**
 * 향수 좋아요 조회
 * 
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.read = async (userIdx, perfumeIdx) => {
    const result = await pool.queryParam_Parse(SQL_LIKE_PERFUME_SELECT, [userIdx, perfumeIdx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];
};

/**
 * 향수 좋아요 취소
 * 
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.delete = async (userIdx, perfumeIdx) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_LIKE_PERFUME_DELETE, [userIdx, perfumeIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};
