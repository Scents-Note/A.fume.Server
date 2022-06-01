import { logger } from '@modules/winston';

import { NotMatchedError } from '@errors';

import { PerfumeDefaultReviewDTO } from '@dto/index';

const LOG_TAG: string = '[PerfumeDefaultReview/DAO]';

const { PerfumeDefaultReview, Keyword } = require('@sequelize');

class PerfumeDefaultReviewDao {
    /**
     * default review 조회
     *
     * @param {number} perfumeIdx
     * @returns {Promise<PerfumeDefaultReviewDTO>} perfumeDefaultReviewDTO
     * @throws {NotMatchedError} if there is no PerfumeDefaultReview
     */
    async readByPerfumeIdx(
        perfumeIdx: number
    ): Promise<PerfumeDefaultReviewDTO> {
        logger.debug(`${LOG_TAG} readByPerfumeIdx(perfumeIdx = ${perfumeIdx})`);
        const result: any = await PerfumeDefaultReview.findOne({
            where: { perfumeIdx },
            raw: true,
            nest: true,
        });
        if (!result) {
            throw new NotMatchedError();
        }
        const keywordIdxList: number[] = result.keyword
            .split(',')
            .map((it: string) => parseInt(it));
        delete result.keyword;
        result.keywordList = await Promise.all(
            keywordIdxList.map((id: number) => {
                return Keyword.findByPk(id, {
                    attributes: ['id', 'name'],
                    raw: true,
                    nest: true,
                });
            })
        ).then((it: any[]) => it.filter((it: any) => it != null));
        return PerfumeDefaultReviewDTO.create(result);
    }
}
export default PerfumeDefaultReviewDao;
