'use strict';

const wishlistDao = require('../dao/WishlistDao.js');
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
  return wishlistDao.create(perfumeIdx, userIdx, priority);
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
  return wishlistDao.update(perfumeIdx, userIdx, priority);
};

/**
 * 위시 리스트에 삭제하기
 *
 * @param {number} perfumeIdx
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.deleteWishlist = (perfumeIdx, userIdx) => {
  return wishlistDao.delete(perfumeIdx, userIdx);
};

/**
 * 유저의 위시 리스트에 조회하기
 *
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.readWishlistByUser = (userIdx) => {
  return perfumeDao.readAllOfWishlist(userIdx);
};

/**
 * 유저가 가지고 있는 위시 리스트에 전체 삭제하기
 *
 * @param {number} userIdx
 * @returns {Promise}
 **/
exports.deleteWishlistByUser = (userIdx) => {
  return wishlistDao.deleteByUserIdx(userIdx);
};
