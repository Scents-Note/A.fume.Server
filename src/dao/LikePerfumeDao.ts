import { NotMatchedError, DuplicatedEntryError } from '../utils/errors/errors';
const { LikePerfume, Sequelize } = require('../models');
const { Op } = Sequelize;

class LikePerfumeDao {
    /**
     * 향수 좋아요 생성
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise}
     */
    create(
        userIdx: number,
        perfumeIdx: number
    ): Promise<{ userIdx: number; perfumeIdx: number }> {
        return LikePerfume.create({ userIdx, perfumeIdx })
            .then((it: { userIdx: number; perfumeIdx: number }) => {
                return { userIdx: it.userIdx, perfumeIdx: it.perfumeIdx };
            })
            .catch((err: Error | any) => {
                if (
                    err.parent.errno === 1062 ||
                    err.parent.code === 'ER_DUP_ENTRY'
                ) {
                    throw new DuplicatedEntryError();
                }
                throw err;
            });
    }

    /**
     * 향수 좋아요 조회
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise}
     */
    read(
        userIdx: number,
        perfumeIdx: number
    ): Promise<{ userIdx: number; perfumeIdx: number }> {
        return LikePerfume.findOne({
            where: { userIdx, perfumeIdx },
        }).then((it: any) => {
            if (!it) {
                throw new NotMatchedError();
            }
            return { userIdx: it.userIdx, perfumeIdx: it.perfumeIdx };
        });
    }

    /**
     * 향수 좋아요 취소
     *
     * @param {number} userIdx
     * @param {number} perfumeIdx
     * @returns {Promise}
     */
    delete(userIdx: number, perfumeIdx: number): Promise<number> {
        return LikePerfume.destroy({
            where: { userIdx, perfumeIdx },
            raw: true,
            nest: true,
        }).then((it: number) => {
            if (it == 0) throw new NotMatchedError();
            return it;
        });
    }

    /**
     * 위시 리스트 향수 전체 삭제
     *
     * @param {number} userIdx
     * @returns {Promise}
     */
    deleteByUserIdx(userIdx: number): Promise<void> {
        return LikePerfume.destroy({
            where: {
                userIdx,
            },
        });
    }

    /**
     * 향수 좋아요 정보
     *
     * @param {number[]} userIdx
     * @param {number[]} perfumeIdxList
     * @returns {Promise}
     */
    async readLikeInfo(
        userIdx: number,
        perfumeIdxList: number[]
    ): Promise<{ userIdx: number; perfumeIdx: number }[]> {
        return LikePerfume.findAll({
            where: {
                userIdx,
                perfumeIdx: {
                    [Op.in]: perfumeIdxList,
                },
            },
            raw: true,
            nest: true,
        }).then((res: any[]) => {
            return res.map((it: any) => {
                return { userIdx: it.userIdx, perfumeIdx: it.perfumeIdx };
            });
        });
    }
}

export default LikePerfumeDao;
