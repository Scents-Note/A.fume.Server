'use strict';

var utils = require('../utils/writer.js');
var Ingredient = require('../service/IngredientService');

module.exports.deleteIngredient = function deleteIngredient (req, res, next) {
  var ingredientIdx = req.swagger.params['ingredientIdx'].value;
  Ingredient.deleteIngredient(ingredientIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getIngredientByIdx = function getIngredientByIdx (req, res, next) {
  var ingredientIdx = req.swagger.params['ingredientIdx'].value;
  Ingredient.getIngredientByIdx(ingredientIdx)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getIngredientList = function getIngredientList (req, res, next) {
  Ingredient.getIngredientList()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.postIngredient = function postIngredient (req, res, next) {
  var body = req.swagger.params['body'].value;
  Ingredient.postIngredient(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.putIngredient = function putIngredient (req, res, next) {
  var ingredientIdx = req.swagger.params['ingredientIdx'].value;
  var body = req.swagger.params['body'].value;
  Ingredient.putIngredient(ingredientIdx,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
