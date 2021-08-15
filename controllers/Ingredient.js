'use strict';

const Ingredient = require('../service/IngredientService');
const { OK } = require('../utils/statusCode.js');

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
    const { englishName } = req.body;
    Ingredient.findIngredientByEnglishName(englishName)
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
