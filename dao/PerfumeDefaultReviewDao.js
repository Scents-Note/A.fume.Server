const { NotMatchedError } = require('../utils/errors/errors.js');

const { PerfumeDefaultReview } = require('../models');
const PerfumeDefaultReviewDTO = require('../data/dto/PerfumeDefaultReviewDTO');

/**
 * default review 조회
 *
 * @param {number} perfumeIdx
 * @returns {Promise<PerfumeDefaultReviewDTO>} perfumeDefaultReviewDTO
 * @throws {NotMatchedError} it is occurred when nothing matched with perfumeIdx
 */
module.exports.readByPerfumeIdx = async (perfumeIdx) => {
    return PerfumeDefaultReview.findOne({
        where: { perfumeIdx },
        raw: true,
        nest: true,
    }).then((result) => {
        if (!result) {
            throw new NotMatchedError();
        }
        return PerfumeDefaultReviewDTO.create(result);
    });
};
