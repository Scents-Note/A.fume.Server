'use strict';

const utils = require('../utils/writer.js');
const Brand = require('../service/BrandService');

module.exports.getBrandList = function getBrandList (req, res, next) {
  Brand.getBrandList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
