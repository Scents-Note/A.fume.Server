import { ReportReview } from '../models';
import {
    DuplicatedEntryError,
    FailedToCreateError,
} from '../utils/errors/errors';

class ReportReviewDao {
    /**
     * 시향노트 신고 생성
     *
     * @param {Object} ReportReview
     * @returns {Promise}
     */

    create = async ({
        reporterIdx,
        reviewIdx,
        reason,
    }: {
        reporterIdx: number;
        reviewIdx: number;
        reason: string;
    }) => {
        try {
            const createLike = await ReportReview.create({
                reporterIdx: Number(reporterIdx),
                reviewIdx: Number(reviewIdx),
                reason,
            });
            return createLike;
        } catch (err: any) {
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

    readAllReportedReviewByUser = async (userIdx: number) => {
        const result = await ReportReview.findAll({
            where: { reporterIdx: userIdx },
            raw: true,
            nest: true,
        });
        return result;
    };
}

export default ReportReviewDao;
