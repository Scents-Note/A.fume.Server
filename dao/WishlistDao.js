const pool = require('../utils/db/pool.js');

const {
    NotMatchedError
} = require('../utils/errors/errors.js');

const { sequelize, Wishlist } = require('../models');
/**
 * 위시리스트 등록
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @param {number} priority
 * @returns {Promise}
 */
module.exports.create = async (perfumeIdx, userIdx, priority) => {
    const wishlist = await Wishlist.create({perfumeIdx, userIdx, priority});
    return wishlist.dataValues;
}

/**
 * 위시리스트 전체 조회
 * 
 * @param {number} userIdx
 * @returns {Promise<WishList[]>}
 */
module.exports.readByUserIdx = (userIdx) => {
    return Wishlist.findAll({ where: { userIdx } });
}

/**
 * 위시리스트 조회
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise<WishList[]>}
 */
module.exports.readByPK = async (perfumeIdx, userIdx) => {
    const result = await Wishlist.findOne({ where: { userIdx, perfumeIdx } });
    if (!result) {
        throw new NotMatchedError();
    }
    return result.dataValues;
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
    const [ affectedRows ] = await Wishlist.update({ priority }, { where: { perfumeIdx, userIdx }});
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
module.exports.deleteByUserIdx = (userIdx) => {   
    return Wishlist.destroy({ where: { userIdx } });
}

/**
 * 위시 리스트 향수 삭제
 * 
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.delete = (perfumeIdx, userIdx) => {   
    return Wishlist.destroy({ where: { userIdx, perfumeIdx } });
}
