import { NotMatchedError } from '../utils/errors/errors';
import PerfumeDefaultReviewDTO from '../data/dto/PerfumeDefaultReviewDTO';

const { PerfumeDefaultReview, Keyword } = require('../models');

class PerfumeDefaultReviewDao {
    /**
     * default review 조회
     *
     * @param {number} perfumeIdx
     * @returns {Promise<PerfumeDefaultReviewDTO>} perfumeDefaultReviewDTO
     * @throws {NotMatchedError} it is occurred when nothing matched with perfumeIdx
     */
    async readByPerfumeIdx(
        perfumeIdx: number
    ): Promise<PerfumeDefaultReviewDTO> {
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
