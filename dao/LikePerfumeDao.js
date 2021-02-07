const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');
const { LikePerfume } = require('../models');

/**
 * 향수 좋아요 생성
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.create = (userIdx, perfumeIdx) => {
    return LikePerfume.create({ userIdx, perfumeIdx }).catch((err) => {
        if (err.parent.errno === 1062 || err.parent.code === 'ER_DUP_ENTRY') {
            throw new DuplicatedEntryError();
        }
        throw err;
    });
};

/**
 * 향수 좋아요 조회
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.read = async (userIdx, perfumeIdx) => {
    const result = await LikePerfume.findOne({
        where: { userIdx, perfumeIdx },
    });
    if (!result) {
        throw new NotMatchedError();
    }
    return result;
};

/**
 * 향수 좋아요 취소
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.delete = (userIdx, perfumeIdx) => {
    return LikePerfume.destroy({ where: { userIdx, perfumeIdx } });
};

/**
 * 위시 리스트 향수 전체 삭제
 *
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.deleteByUserIdx = (userIdx) => {
    return LikePerfume.destroy({ where: { userIdx } });
};
