import IngredientService from '../service/IngredientService';
import IngredientResponseDTO from '../data/response_dto/ingredient/IngredientResponseDTO';

let Ingredient = new IngredientService();
const { OK } = require('../utils/statusCode.js');

const { ListAndCountResponseDTO } = require('../data/response_dto/common');

module.exports.getIngredientAll = (_: any, res: any, next: any) => {
    Ingredient.getIngredientAll()
        .then((result) => {
            result.rows = result.rows.map(
                (it: any) =>
                    new IngredientResponseDTO(it.ingredientIdx, it.name)
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
        .catch((err) => {
            next(err);
        });
};

module.exports.setIngredientService = (service: any) => {
    Ingredient = service;
};
