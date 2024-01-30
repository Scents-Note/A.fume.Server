import LikePerfumeDao from '@src/dao/LikePerfumeDao';
import { LikePerfume } from '@src/models';
import { FailedToCreateError, NotMatchedError } from '@src/utils/errors/errors';
import _ from 'lodash';

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

    async isLike(userIdx: number, perfumeIdx: number): Promise<boolean> {
        try {
            await this.likePerfumeDao.read(userIdx, perfumeIdx);
            return true;
        } catch (err) {
            if (err instanceof NotMatchedError) {
                return false;
            }
            throw err;
        }
    }

    isLikeJob(likePerfumeList: LikePerfume[]): (obj: any) => any {
        const likeMap: { [key: string]: boolean } = _.chain(likePerfumeList)
            .keyBy('perfumeIdx')
            .mapValues(() => true)
            .value();

        return (obj: any) => {
            const ret: any = Object.assign({}, obj);
            ret.isLiked = likeMap[obj.perfumeIdx] ? true : false;
            return ret;
        };
    }

    async readLikeInfo(userIdx: number, perfumeIdxList: number[]) {
        return await likePerfumeDao.readLikeInfo(userIdx, perfumeIdxList);
    }
}
