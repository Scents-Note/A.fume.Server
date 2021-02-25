'use strict';

const searchHistoryDao = require('../dao/SearchHistoryDao.js');

/**
 * 향수 조회 정보 업데이트
 *
 * @param {number} userIdx
 * @param {number} perfumeIdx
 * @returns {Promise}
 **/
exports.incrementCount = async (userIdx, perfumeIdx) => {
    return searchHistoryDao.read(userIdx, perfumeIdx).then((result) => {
        if (!result) {
            return searchHistoryDao.create(userIdx, perfumeIdx, 1);
        } else {
            return searchHistoryDao.update(
                userIdx,
                perfumeIdx,
                result.count + 1
            );
        }
    });
};
