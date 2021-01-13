'use strict';

const Ingredient = require('../service/IngredientService');
const { OK, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.postIngredient = function postIngredient(req, res, next) {
    const { name, englishName, description, seriesName } = req.swagger.params[
        'body'
    ].value;
    Ingredient.postIngredient({ name, englishName, description, seriesName })
        .then(function (response) {
            res.status(OK).json({
                message: 'ingredient post 성공',
                data: response,
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.getIngredientByIdx = function getIngredientByIdx(
    req,
    res,
    next
) {
    const ingredientIdx = req.swagger.params['ingredientIdx'].value;
    Ingredient.getIngredientByIdx(ingredientIdx)
        .then(function (response) {
            res.status(OK).json({
                message: 'ingredient 개별 조회 성공',
                data: response,
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.getIngredientList = function getIngredientList(req, res, next) {
    Ingredient.getIngredientList()
        .then(function (response) {
            res.status(OK).json({
                message: 'ingredient 전체  조회 성공',
                data: response,
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.putIngredient = function putIngredient(req, res, next) {
    const ingredientIdx = req.swagger.params['ingredientIdx'].value;
    const { name, englishName, description } = req.swagger.params['body'].value;
    Ingredient.putIngredient({ ingredientIdx, name, englishName, description })
        .then(function (response) {
            res.status(OK).json({
                message: 'ingredient put 성공',
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};

module.exports.deleteIngredient = function deleteIngredient(req, res, next) {
    const ingredientIdx = req.swagger.params['ingredientIdx'].value;
    Ingredient.deleteIngredient(ingredientIdx)
        .then(function (response) {
            res.status(OK).json({
                message: 'ingredient delete 성공',
            });
        })
        .catch(function (response) {
            res.status(response.status || INTERNAL_SERVER_ERROR).json({
                message: response.message,
            });
        });
};
