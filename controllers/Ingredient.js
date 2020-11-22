'use strict';

var utils = require('../utils/writer.js');
var Ingredient = require('../service/IngredientService');

module.exports.getIngredientList = function getIngredientList (req, res, next) {
  Ingredient.getIngredientList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
