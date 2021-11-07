import { NotMatchedError } from '../utils/errors/errors';

const { PerfumeDefaultReview, Keyword } = require('../models');
const PerfumeDefaultReviewDTO = require('../data/dto/PerfumeDefaultReviewDTO');

/**
 * default review 조회
 *
 * @param {number} perfumeIdx
 * @returns {Promise<PerfumeDefaultReviewDTO>} perfumeDefaultReviewDTO
 * @throws {NotMatchedError} it is occurred when nothing matched with perfumeIdx
 */
module.exports.readByPerfumeIdx = async (perfumeIdx) => {
    const result = await PerfumeDefaultReview.findOne({
        where: { perfumeIdx },
        raw: true,
        nest: true,
    });
    if (!result) {
        throw new NotMatchedError();
    }
    const keywordIdxList = result.keyword.split(',').map((it) => parseInt(it));
    delete result.keyword;
    result.keywordList = await Promise.all(
        keywordIdxList.map((id) => {
            return Keyword.findByPk(id, {
                attributes: ['id', 'name'],
                raw: true,
                nest: true,
            });
        })
    ).then((it) => it.filter((it) => it != null));
    return PerfumeDefaultReviewDTO.create(result);
};
