const pool = require('../utils/db/pool.js');
const {NotMatchedError, FailedToCreateError} = require('../utils/errors/errors.js');

const SQL_USER_INSERT = 'INSERT user(nickname, password, gender, phone, email, birth, role) VALUES(?,?,?,?,?,?,?)';
const SQL_USER_SELECT_BY_EMAIL = 'SELECT user_idx AS userIdx, nickname, password, IF(gender = 1, "남자", "여자") AS gender, phone, email, birth, role FROM user WHERE email = ?';
const SQL_USER_SELECT_BY_IDX = 'SELECT user_idx AS userIdx, nickname, password, IF(gender = 1, "남자", "여자") AS gender, phone, email, birth, role FROM user WHERE user_idx = ?';
const SQL_USER_UPDATE = 'UPDATE user SET nickname = ?, password = ?, gender = ?, phone = ?, email = ?, birth = ?, role = ? WHERE user_idx = ?';
const SQL_USER_DELETE = 'DELETE FROM user WHERE user_idx = ?';

const genderMap = {
    '남자': 1,
    '여자': 2,
}

/**
 * 유저 생성
 * 
 * @param {Object} User
 * @returns {Promise}
 */
module.exports.create = async ({nickname, password, gender, phone, email, birth, role}) => {
    gender = genderMap[gender] || 0;
    const result = await pool.queryParam_Parse(SQL_USER_INSERT, [nickname, password, gender, phone, email, birth, role]);
    if(result.insertId == 0) {
        throw new FailedToCreateError();
    }
    return result.insertId;
};

/**
 * 유저 조회
 * 
 * @param {string} email
 * @returns {Promise<User>}
 */
module.exports.readByEmail = async (email) => {
    const result = await pool.queryParam_Parse(SQL_USER_SELECT_BY_EMAIL, [email]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    const res = result[0];
    return res;
};

/**
 * 유저 조회
 * 
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.readByIdx = async (userIdx) => {
    const result = await pool.queryParam_Parse(SQL_USER_SELECT_BY_IDX, [userIdx]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    const res = result[0];
    return res;
};

/**
 * 유저 수정
 * 
 * @param {Object} User
 * @return {Promise}
 */
module.exports.update = async ({userIdx, nickname, password, gender, phone, birth, email, role}) => {
    gender = genderMap[gender] || 0;
    const { affectedRows } = await pool.queryParam_Parse(SQL_USER_UPDATE, [nickname, password, gender, phone, email, birth, role, userIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 유저 삭제
 * 
 * @param {number} userIdx
 * @return {Promise}
 */
module.exports.delete = async (userIdx) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_USER_DELETE, [userIdx]); 
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};
