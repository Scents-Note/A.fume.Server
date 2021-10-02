'use strict';

let Ingredient = require('../service/IngredientService');
const { OK } = require('../utils/statusCode.js');

const { ListAndCountResponseDTO } = require('../data/response_dto/common');

const { IngredientResponseDTO } = require('../data/response_dto/ingredient');

module.exports.getIngredientAll = (req, res, next) => {
    Ingredient.getIngredientAll()
        .then((result) => {
            result.rows = result.rows.map(
                (it) => new IngredientResponseDTO(it)
            );
            return result;
        })
        .then(({ count, rows }) => {
            res.status(OK).json(
                new ListAndCountResponseDTO({
                    message: '재료 검색 성공',
                    count,
                    rows,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.setIngredientService = (service) => {
    Ingredient = service;
};
