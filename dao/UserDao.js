const { NotMatchedError } = require('../utils/errors/errors.js');

const { sequelize, User } = require('../models');

/**
 * 유저 생성
 * 
 * @param {Object} User
 * @returns {Promise}
 */
module.exports.create = async ({nickname, password, gender, phone, email, birth, grade, accessTime}) => {
    accessTime = accessTime || sequelize.literal('CURRENT_TIMESTAMP');
    const { dataValues } = await User.create({ nickname, password, gender, phone, email, birth, grade, accessTime });
    return dataValues.userIdx;
};

/**
 * 유저 조회
 * 
 * @param {string} email
 * @returns {Promise<User>}
 */
module.exports.readByEmail = async (email) => {
    const result = await User.findOne({ where: { email }});
    if (!result) {
        throw new NotMatchedError();
    }
    return result.dataValues;
};

/**
 * 유저 조회
 * 
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.readByIdx = async (userIdx) => {
    const result = await User.findOne({ where: { userIdx }});
    if (!result) {
        throw new NotMatchedError();
    }
    return result.dataValues;
};

/**
 * 유저 수정
 * 
 * @param {Object} User
 * @return {Promise}
 */
module.exports.update = async ({userIdx, nickname, password, gender, phone, birth, email, grade}) => {
    const result = await User.update({ nickname, password, gender, phone, email, birth, grade }, { where: { userIdx } });
    const affectedRows = result[0];
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};

/**
 * 유저 access Time 갱신
 * 
 * @param {number} userIdx
 * @return {Promise}
 */
module.exports.updateAccessTime = async (userIdx) => {
    const accessTime = sequelize.literal('CURRENT_TIMESTAMP');
    const result = await User.update({ accessTime }, { where: { userIdx }, silent: true });
    const affectedRows = result[0];
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
module.exports.delete = (userIdx) => {   
    return User.destroy({ where: { userIdx } });
};
