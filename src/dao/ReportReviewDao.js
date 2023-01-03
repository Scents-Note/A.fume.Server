import {
    NotMatchedError,
    DuplicatedEntryError,
    FailedToCreateError,
} from '../utils/errors/errors';
const { sequelize, ReportReview, Review, User } = require('../models');

/**
 * 시향노트 신고 생성
 *
 * @param {Object} ReportReview
 * @returns {Promise}
 */

module.exports.create = async ({ reporterIdx, reviewIdx, reason }) => {
        try {
            const createLike = await ReportReview.create(
                { reporterIdx: Number(reporterIdx), reviewIdx: Number(reviewIdx), reason }
            )
            return createLike
        } catch (err) {
            if (
                err.original.code === 'ER_DUP_ENTRY' ||
                err.parent.errno === 1062
            ) {
                throw new DuplicatedEntryError();
            }
            throw new FailedToCreateError();
        }
};

/**
 * 내가 신고한 시향노트 목록 조회
 *
 * @param {number} userIdx
 * @returns {Promise<ReportReview[]>} ReportReviewObj List
 */

 module.exports.readAllReportedReviewByUser = async (userIdx) => {
    try {
        const result = await ReportReview.findAll({
            where: { reporterIdx: userIdx },
            raw: true,
            nest: true,
        })
        return result

    } catch (err) {
        throw err;
    }
};
