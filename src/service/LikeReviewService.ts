import LikeReviewDao from '@dao/LikeReviewDao';
const likeReviewDao = new LikeReviewDao();

class LikeReviewService {
    /**
     * 시향노트 좋아요 생성/취소
     *
     * @param {number} reviewIdx
     * @param {number} userIdx
     * @returns {boolean} isLiked
     * reviewIdx Long 시향노트 Idx
     * returns Boolean
     **/
    async likeReview(reviewIdx: number, userIdx: number) {
        const resultOfReadLike = await likeReviewDao.read(userIdx, reviewIdx);
        let isLiked = resultOfReadLike ? true : false;
        if (!isLiked) {
            await likeReviewDao.create(userIdx, reviewIdx);
        }
        if (isLiked) {
            await likeReviewDao.delete(userIdx, reviewIdx);
        }
        return !isLiked;
    }

    async read(userIdx: number, reviewIdx: number) {
        return await likeReviewDao.read(userIdx, reviewIdx);
    }
}

export default LikeReviewService;
