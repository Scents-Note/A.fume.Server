const { SearchHistory } = require('../models');

/**
 * 향수 조회 기록
 * @param {number} userIdx
 * @param {number} perfumeIdx
 */
module.exports.create = (userIdx, perfumeIdx) => {
    return SearchHistory.create({userIdx, perfumeIdx}, {raw: true, nest: true});
}
