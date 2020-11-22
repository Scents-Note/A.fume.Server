'use strict';

var utils = require('../utils/writer.js');
var Wishlist = require('../service/WishlistService');

module.exports.createWishList = function createWishList (req, res, next) {
  var userIdx = req.swagger.params['userIdx'].value;
  var body = req.swagger.params['body'].value;
  Wishlist.createWishList(userIdx,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
