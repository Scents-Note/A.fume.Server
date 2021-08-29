'use strict';

let Ingredient = require('../service/IngredientService');
const { OK } = require('../utils/statusCode.js');

const {
    ResponseDTO,
    ListAndCountResponseDTO,
} = require('../data/response_dto/common');

const { IngredientConditionDTO } = require('../data/dto');
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

module.exports.getIngredientByEnglishName = (req, res, next) => {
    Ingredient.findIngredient(new IngredientConditionDTO(req.body))
        .then((result) => {
            return new IngredientResponseDTO(result);
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '재료 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.setIngredientService = (service) => {
    Ingredient = service;
};
