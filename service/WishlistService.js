'use strict';

const wishlistDao = require('../dao/WishlistDao.js');

/**
 * add wishlist
 * 위시 리스트에 추가하기
 *
 * body Wishlist Created wishlist object
 * no response value expected for this operation
 **/
exports.createWishlist = ({perfumeIdx, userIdx, priority}) => {
  return wishlistDao.create({perfumeIdx, userIdx, priority});
};

/**
 * update wishlist
 * 위시 리스트에 수정하기
 *
 * body Wishlist Created wishlist object
 * no response value expected for this operation
 **/
exports.updateWishlist = ({perfumeIdx, userIdx, priority}) => {
  return wishlistDao.update({perfumeIdx, userIdx, priority});
};

/**
 * delete wishlist
 * 위시 리스트에 삭제하기
 *
 * body Wishlist Created wishlist object
 * no response value expected for this operation
 **/
exports.deleteWishlist = ({perfumeIdx, userIdx}) => {
  return wishlistDao.delete({perfumeIdx, userIdx});
};

/**
 * read user's wishlist
 * 유저의 위시 리스트에 조회하기
 *
 * userIdx Long 유저 ID
 * 위시 리스트에 포함된 향수 리스트 반환
 **/
exports.readWishlistByUser = (userIdx) => {
  return wishlistDao.readByUserIdx(userIdx)
};

/**
 * delete user's wishlist
 * 유저가 가지고 있는 위시 리스트에 전체 삭제하기
 *
 * userIdx Long 유저 ID
 * 삭제된 데이터의 개수 반환
 **/
exports.deleteWishlistByUser = (userIdx) => {
  return wishlistDao.deleteByUserIdx(userIdx);
};
