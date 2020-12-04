const pool = require('../utils/db/pool.js');

const {
    NotMatchedError, FailedToCreateError
} = require('../utils/errors/errors.js');

/**
 * 위시리스트 등록
 * - 유저가 위시 리스트에 향수를 추가한다.
 */
const SQL_WISHLIST_INSERT = 'INSERT wishlist(user_idx, perfume_idx, priority) VALUES(?,?,?);'
module.exports.create = async ({perfumeIdx, userIdx, priority}) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_INSERT, [userIdx, perfumeIdx, priority]);
    if(affectedRows == 0) {
        throw new FailedToCreateError();
    }
    return affectedRows;
}

/**
 * 위시리스트 전체 조회
 * 
 */
const SQL_WISHLIST_SELECT_BY_USER_IDX = 'SELECT user_idx as UserIdx, perfume_idx as perfumeIdx, priority FROM wishlist WHERE user_idx = ?;'
module.exports.readByUserIdx = (userIdx) => {
    return pool.queryParam_Parse(SQL_WISHLIST_SELECT_BY_USER_IDX, [userIdx]);
}

/**
 * 위시리스트 조회
 * 
 */
const SQL_WISHLIST_SELECT_BY_PK = 'SELECT user_idx as userIdx, perfume_idx as perfumeIdx, priority FROM wishlist WHERE user_idx = ? AND perfume_idx = ?;'
module.exports.readByPK = async ({perfumeIdx, userIdx}) => {
    const result = await pool.queryParam_Parse(SQL_WISHLIST_SELECT_BY_PK, [userIdx, perfumeIdx]);
    if (result.length == 0) {
        throw new NotMatchedError();
    }
    return result[0];
}

/**
 * 위시리스트 수정
 * - 유저가 위시 리스트에 priority를 수정한다.
 */
const SQL_WISHLIST_UPDATE = 'UPDATE wishlist SET priority = ? WHERE perfume_idx = ? AND user_idx = ?'
module.exports.update = async ({perfumeIdx, userIdx, priority}) => {
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_UPDATE, [priority, perfumeIdx, userIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}

/**
 * 위시 리스트 향수 전체 삭제
 * - 유저가 위시리스트에 포함된 향수를 모두 삭제한다.
 */
const SQL_WISHLIST_DELETE_BY_USER_IDX = 'DELETE FROM wishlist WHERE user_idx = ?'
module.exports.deleteByUserIdx = async (userIdx) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_DELETE_BY_USER_IDX, [userIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}

/**
 * 위시 리스트 향수 삭제
 * - 유저가 위시리스트에 특정 향수를 삭제한다.
 */
const SQL_WISHLIST_DELETE = 'DELETE FROM wishlist WHERE user_idx = ? AND perfume_idx = ?;'
module.exports.delete = async ({userIdx, perfumeIdx}) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_WISHLIST_DELETE, [userIdx, perfumeIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}
