const pool = require('../utils/db/pool.js');

const {
    NotMatchedError, FailedToCreateError
} = require('../utils/errors/errors.js');

const SQL_WISHLIST_INSERT = 'INSERT wishlist(user_idx, perfume_idx, priority) VALUES(?,?,?);'
const SQL_WISHLIST_SELECT_BY_USER_IDX = 'SELECT user_idx as UserIdx, perfume_idx as perfumeIdx, priority FROM wishlist WHERE user_idx = ?;'
const SQL_WISHLIST_SELECT_BY_PK = 'SELECT user_idx as userIdx, perfume_idx as perfumeIdx, priority FROM wishlist WHERE user_idx = ? AND perfume_idx = ?;'
const SQL_WISHLIST_UPDATE = 'UPDATE wishlist SET priority = ? WHERE perfume_idx = ? AND user_idx = ?'
const SQL_WISHLIST_DELETE_BY_USER_IDX = 'DELETE FROM wishlist WHERE user_idx = ?'
const SQL_WISHLIST_DELETE = 'DELETE FROM wishlist WHERE user_idx = ? AND perfume_idx = ?;'

/**
 * 위시리스트 등록
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @param {number} priority
 * @returns {Promise}
 */
module.exports.create = async (perfumeIdx, userIdx, priority) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_INSERT, [userIdx, perfumeIdx, priority]);
    if(affectedRows == 0) {
        throw new FailedToCreateError();
    }
    return affectedRows;
}

/**
 * 위시리스트 전체 조회
 * 
 * @param {number} userIdx
 * @returns {Promise<WishList[]>}
 */
module.exports.readByUserIdx = (userIdx) => {
    return pool.queryParam_Parse(SQL_WISHLIST_SELECT_BY_USER_IDX, [userIdx]);
}

/**
 * 위시리스트 조회
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise<WishList[]>}
 */
module.exports.readByPK = async (perfumeIdx, userIdx) => {
    const result = await pool.queryParam_Parse(SQL_WISHLIST_SELECT_BY_PK, [userIdx, perfumeIdx]);
    if (result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];
}

/**
 * 위시리스트 수정
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @param {number} priority
 * @returns {Promise}
 */
module.exports.update = async (perfumeIdx, userIdx, priority) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_UPDATE, [priority, perfumeIdx, userIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}

/**
 * 위시 리스트 향수 전체 삭제
 * 
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.deleteByUserIdx = async (userIdx) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_DELETE_BY_USER_IDX, [userIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}

/**
 * 위시 리스트 향수 삭제
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.delete = async (perfumeIdx, userIdx) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_DELETE, [userIdx, perfumeIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}
