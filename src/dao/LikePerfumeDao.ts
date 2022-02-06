import { logger } from '@modules/winston';

import { NotMatchedError, DuplicatedEntryError } from '@errors';

const { LikePerfume, Sequelize } = require('@sequelize');
const { Op } = Sequelize;

const LOG_TAG: string = '[Ingredient/DAO]';

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
        logger.debug(
            `${LOG_TAG} create(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx})`
        );
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
        logger.debug(
            `${LOG_TAG} read(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx})`
        );
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
        logger.debug(
            `${LOG_TAG} delete(userIdx = ${userIdx}, perfumeIdx = ${perfumeIdx})`
        );
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
        logger.debug(`${LOG_TAG} deleteByUserIdx(userIdx = ${userIdx})`);
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
        logger.debug(
            `${LOG_TAG} readLikeInfo(userIdx = ${userIdx}, perfumeIdxList = ${perfumeIdxList.join(
                ', '
            )})`
        );
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
