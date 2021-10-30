const { NotMatchedError } = require('../utils/errors/errors.js');
const { SearchHistory } = require('../../models');

/**
 * 향수 조회 기록 조회
 * @param {number} userIdx
 * @param {number} perfumeIdx
 */
module.exports.read = async (userIdx, perfumeIdx) => {
    return SearchHistory.findOne({
        where: { userIdx, perfumeIdx },
        raw: true,
        nest: true,
    });
};

/**
 * 향수 조회 기록 생성
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @return {Promise}
 */
module.exports.create = (userIdx, perfumeIdx, count) => {
    return SearchHistory.create(
        { userIdx, perfumeIdx, count },
        { raw: true, nest: true }
    ).then((result) => {
        return result.dataValues;
    });
};

/**
 * 향수 조회 기록 업데이트
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @param {number} count
 * @return {Promise<number>} affectedRows
 */
module.exports.update = async (userIdx, perfumeIdx, count) => {
    const [affectedRows] = await SearchHistory.update(
        { count },
        { where: { userIdx, perfumeIdx } }
    );
    if (affectedRows == 0) {
        throw new NotMatchedError();
    }
    return affectedRows;
};
