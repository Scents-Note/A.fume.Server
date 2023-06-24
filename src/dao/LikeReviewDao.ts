import {
    NotMatchedError,
    DuplicatedEntryError,
    FailedToCreateError,
} from '../utils/errors/errors';
import { sequelize, LikeReview, Review } from '@src/models';

class LikeReviewDao {
    /**
     * 시향노트 좋아요 생성
     *
     * @param {Object} LikeReview
     * @returns {Promise}
     */

    async create(userIdx: number, reviewIdx: number) {
        return sequelize.transaction((t) => {
            const createLike = LikeReview.create(
                { userIdx, reviewIdx },
                { transaction: t }
            ).catch((err) => {
                if (
                    err.original.code === 'ER_DUP_ENTRY' ||
                    err.parent.errno === 1062
                ) {
                    throw new DuplicatedEntryError();
                }
                if (
                    err.original.code === 'ER_NO_REFERENCED_ROW_2' ||
                    err.original.errno === 1452
                ) {
                    throw new NotMatchedError();
                }
                throw new FailedToCreateError();
            });

            const updateLikeCnt = Review.update(
                { likeCnt: sequelize.literal('like_cnt + 1') },
                {
                    where: { id: reviewIdx },
                    transaction: t,
                }
            );

            return Promise.all([createLike, updateLikeCnt]);
        });
    }

    /**
     * 시향노트 좋아요 조회
     *
     * @param {number} userIdx
     * @param {number} reviewIdx
     * @returns {Promise} || null
     */

    async read(userIdx: number, reviewIdx: number) {
        return await LikeReview.findOne({
            where: { userIdx, reviewIdx },
            raw: true,
            nest: true,
        });
    }

    /**
     * 시향노트 좋아요 취소
     *
     * @param {Object} whereObj
     * @returns Boolean
     */

    async delete(userIdx: number, reviewIdx: number) {
        return sequelize.transaction((t) => {
            const deleteLike = LikeReview.destroy({
                where: { userIdx, reviewIdx },
                transaction: t,
            }).then((it) => {
                if (it == 0) throw new NotMatchedError();
                return it;
            });

            const updateLikeCnt = Review.update(
                { likeCnt: sequelize.literal('like_cnt - 1') },
                {
                    where: { id: reviewIdx },
                    transaction: t,
                }
            );

            return Promise.all([deleteLike, updateLikeCnt]).then((it) => {
                return it;
            });
        });
    }
}

export default LikeReviewDao;
