const pool = require('../utils/db/pool.js');
const {NotMatchedError, FailedToCreateError} = require('../utils/errors/errors.js');

/**
 * 유저 생성
 * 
 */
const SQL_USER_INSERT = 'INSERT user(name, password, gender, phone, email) VALUES(?,?,?,?,?)';
module.exports.create = async ({username, password, gender, phone, email}) => {
    gender = gender == 'M' ? 1 : 2;
    const result = await pool.queryParam_Parse(SQL_USER_INSERT, [username, password, gender, phone, email]);
    if(result.insertId == 0) {
        throw new FailedToCreateError();
    }
    return result.insertId;
}

/**
 * 유저 조회
 * 
 */
const SQL_USER_SELECT_BY_NAME = 'SELECT user_idx AS userIdx, name AS username, password, gender AS gender, phone, email FROM user WHERE name = ?';
module.exports.readByName = async (username) => {
    const result = await pool.queryParam_Parse(SQL_USER_SELECT_BY_NAME, [username]);
    if(result.length == 0) {
        throw new NotMatchedError();
    }
    const res = result[0];
    res.gender = res.gender == 1 ? 'M' : 'F';
    return res;
}

/**
 * 유저 수정
 * 
 */
const SQL_USER_UPDATE = 'UPDATE user SET name = ?, password = ?, gender = ?, phone = ?, email = ? WHERE user_idx = ?';
module.exports.update = async ({userIdx, username, password, gender, phone, email}) => {
    gender = gender == 'M' ? 1 : 2;
    const { affectedRows } = await pool.queryParam_Parse(SQL_USER_UPDATE, [username, password, gender, phone, email, userIdx]);
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}

/**
 * 유저 삭제
 * 
 */
const SQL_USER_DELETE = 'DELETE FROM user WHERE user_idx = ?';
module.exports.delete = async (userIdx) => {   
    const { affectedRows } = await pool.queryParam_Parse(SQL_USER_DELETE, [userIdx]); 
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
}
