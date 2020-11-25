'use strict';

var utils = require('../utils/writer.js');
var Wishlist = require('../service/WishlistService');

module.exports.createWishlist = (req, res, next) => {
  const { userIdx, perfumeIdx, priority } = req.swagger.params['body'].value;
  Wishlist.createWishlist({ userIdx, perfumeIdx, priority })
    .then(function (response) {
      console.log('catch')
      console.log(response)
      utils.writeJson(res, utils.respondWithCode(200, {message: '위시 리스트에 성공적으로 추가했습니다.'}));
    })
    .catch(function (response) {
      console.log('catch')
      console.log(response)
      utils.writeJson(res, response);
    });
};

module.exports.updateWishlist = (req, res, next) => {
  const { userIdx, perfumeIdx, priority } = req.swagger.params['body'].value;
  Wishlist.updateWishlist({ userIdx, perfumeIdx, priority })
    .then(function () {
      utils.writeJson(res, utils.respondWithCode(200, {message: '위시 리스트에 성공적으로 수정했습니다.'}));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteWishlist = (req, res, next) => {
  const { userIdx, perfumeIdx} = req.swagger.params['body'].value;
  Wishlist.deleteWishlist({ userIdx, perfumeIdx })
    .then(function () {
      utils.writeJson(res, utils.respondWithCode(200, {message: '위시 리스트에 성공적으로 삭제했습니다.'}));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.readWishlistByUser = (req, res, next) => {
  const userIdx = req.swagger.params['userIdx'].value;
  Wishlist.readWishlistByUser(userIdx)
    .then(function (response) {
      utils.writeJson(res, utils.respondWithCode(200, {message: '(임시)유저가 가지고 있는 위시 리스트 조회', data: response}));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteWishlistByUser = (req, res, next) => {
  var userIdx = req.swagger.params['userIdx'].value;
  Wishlist.deleteWishlistByUser(userIdx)
    .then(function (response) {
      utils.writeJson(res, utils.respondWithCode(200, {message: '유저가 가지고 있는 위시 리스트 삭제했습니다', data: response}));
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};