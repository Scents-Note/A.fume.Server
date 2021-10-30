'use strict';

const likePerfumeDao = require('../dao/LikePerfumeDao.js');
const perfumeDao = require('../dao/PerfumeDao.js');

/**
 * 위시 리스트에 추가하기
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @param {number} priority
 * @returns {Promise}
 **/
exports.createWishlist = (perfumeIdx, userIdx, priority) => {
    return likePerfumeDao.create(perfumeIdx, userIdx, priority);
};

/**
 * 위시 리스트에 수정하기
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @param {number} priority
 * @returns {Promise}
 **/
exports.updateWishlist = (perfumeIdx, userIdx, priority) => {
    return likePerfumeDao.update(perfumeIdx, userIdx, priority);
};

/**
 * 위시 리스트에 삭제하기
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.deleteWishlist = (perfumeIdx, userIdx) => {
    return likePerfumeDao.delete(perfumeIdx, userIdx);
};

/**
 * 유저의 위시 리스트에 조회하기
 *
 * @param {number} userIdx
 * @param {number} pagingIndex
 * @param {number} pagingSize
 * @returns {Promise}
 **/
exports.readWishlistByUser = (userIdx, pagingIndex, pagingSize) => {
    return perfumeDao
        .readAllOfWishlist(userIdx, pagingIndex, pagingSize)
        .then((it) => {
            it.rows.forEach((it) => {
                delete it.Wishlist;
            });
            return it;
        });
};

/**
 * 유저가 가지고 있는 위시 리스트에 전체 삭제하기
 *
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.deleteWishlistByUser = (userIdx) => {
    return likePerfumeDao.deleteByUserIdx(userIdx);
};
