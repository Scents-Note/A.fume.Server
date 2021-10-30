const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');
const { LikePerfume, Sequelize, sequelize } = require('../../models');
const { Op } = Sequelize;

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
module.exports.read = (userIdx, perfumeIdx) => {
    return LikePerfume.findOne({
        where: { userIdx, perfumeIdx },
    }).then((it) => {
        if (!it) {
            throw new NotMatchedError();
        }
        return it;
    });
};

/**
 * 향수 좋아요 취소
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.delete = (userIdx, perfumeIdx) => {
    return LikePerfume.destroy({
        where: { userIdx, perfumeIdx },
        raw: true,
        nest: true,
    }).then((it) => {
        if (it == 0) throw new NotMatchedError();
        return it;
    });
};

/**
 * 위시 리스트 향수 전체 삭제
 *
 * @param {number} userIdx
 * @returns {Promise}
 */
module.exports.deleteByUserIdx = (userIdx) => {
    return LikePerfume.destroy({
        where: {
            userIdx,
        },
    });
};

/**
 * 향수 좋아요 정보
 *
 * @param {number[]} userIdx
 * @param {number[]} perfumeIdxList
 * @returns {Promise}
 */
module.exports.readLikeInfo = async (userIdx, perfumeIdxList) => {
    return LikePerfume.findAll({
        where: {
            userIdx,
            perfumeIdx: {
                [Op.in]: perfumeIdxList,
            },
        },
        raw: true,
        nest: true,
    });
};
