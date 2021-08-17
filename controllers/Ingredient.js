'use strict';

const Ingredient = require('../service/IngredientService');
const { OK } = require('../utils/statusCode.js');
const { IngredientConditionDTO } = require('../data/dto');
module.exports.getIngredientAll = (req, res, next) => {
    Ingredient.getIngredientAll()
        .then((response) => {
            res.status(OK).json({
                message: 'ingredient 전체  조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getIngredientByEnglishName = (req, res, next) => {
    Ingredient.findIngredient(new IngredientConditionDTO(req.body))
        .then((response) => {
            res.status(OK).json({
                message: '재료 조회 성공',
                data: response,
            });
        })
        .catch((err) => {
            next(err);
        });
};
