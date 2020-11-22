'use strict';

var utils = require('../utils/writer.js');
var Brand = require('../service/BrandService');

module.exports.getBrandList = function getBrandList (req, res, next) {
  Brand.getBrandList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
