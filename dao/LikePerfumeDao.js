const {
    NotMatchedError,
    DuplicatedEntryError,
} = require('../utils/errors/errors.js');
const { Perfume, LikePerfume, Sequelize, sequelize } = require('../models');
const { Op } = Sequelize;

/**
 * 향수 좋아요 생성
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 */
module.exports.create = (userIdx, perfumeIdx) => {
    return sequelize.transaction((t) => {
        const createLikePerfume = LikePerfume.create(
            { userIdx, perfumeIdx },
            { transaction: t }
        ).catch((err) => {
            if (
                err.parent.errno === 1062 ||
                err.parent.code === 'ER_DUP_ENTRY'
            ) {
                throw new DuplicatedEntryError();
            }
            throw err;
        });
        const updateLikeCntOfPerfume = Perfume.findOne({
            where: { perfumeIdx },
        }).then((perfume) => {
            return Perfume.update(
                { likeCnt: perfume.likeCnt + 1 },
                {
                    where: { perfumeIdx: perfume.perfumeIdx },
                    transaction: t,
                    silent: true,
                }
            );
        });
        return Promise.all([createLikePerfume, updateLikeCntOfPerfume]).then(
            (it) => {
                return it[0];
            }
        );
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
    return sequelize.transaction((t) => {
        const deleteLikePerfume = LikePerfume.destroy({
            where: { userIdx, perfumeIdx },
            transaction: t,
        }).then((it) => {
            if (it == 0) throw new NotMatchedError();
            return it;
        });
        const updateLikeCntOfPerfume = Perfume.findOne({
            where: { perfumeIdx },
        }).then((perfume) => {
            return Perfume.update(
                { likeCnt: perfume.likeCnt - 1 },
                {
                    where: { perfumeIdx: perfume.perfumeIdx },
                    transaction: t,
                    silent: true,
                }
            );
        });
        return Promise.all([deleteLikePerfume, updateLikeCntOfPerfume]).then(
            (it) => {
                return it[0];
            }
        );
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
