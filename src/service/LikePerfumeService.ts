import LikePerfumeDao from '@src/dao/LikePerfumeDao';
import { FailedToCreateError, NotMatchedError } from '@src/utils/errors/errors';

let likePerfumeDao: LikePerfumeDao = new LikePerfumeDao();

export class LikePerfumeService {
    likePerfumeDao: LikePerfumeDao;

    constructor(likePerfumeDao?: LikePerfumeDao) {
        this.likePerfumeDao = likePerfumeDao ?? new LikePerfumeDao();
    }
    /**
     * 향수 좋아요
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise}
     * @throws {FailedToCreateError} if failed to create likePerfume
     **/
    async likePerfume(userIdx: number, perfumeIdx: number): Promise<boolean> {
        try {
            await likePerfumeDao.read(userIdx, perfumeIdx);
            await likePerfumeDao.delete(userIdx, perfumeIdx);
            return false;
        } catch (err) {
            if (err instanceof NotMatchedError) {
                await likePerfumeDao.create(userIdx, perfumeIdx);
                return true;
            }
            throw new FailedToCreateError();
        }
    }
}
