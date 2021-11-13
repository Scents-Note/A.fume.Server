import IngredientService from '../service/IngredientService';
import IngredientResponseDTO from '../data/response_dto/ingredient/IngredientResponseDTO';
import IngredientDTO from '../data/dto/IngredientDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import ResponseDTO from '../data/response_dto/common/ResponseDTO';

let Ingredient = new IngredientService();
const { OK } = require('../utils/statusCode.js');

module.exports.getIngredientAll = (_: any, res: any, next: any) => {
    Ingredient.getIngredientAll()
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            /* TODO: Change IngredientResponseDTO to interface */
            return new ListAndCountDTO<IngredientResponseDTO>(
                result.count,
                result.rows.map(
                    (it: any) =>
                        new IngredientResponseDTO(it.ingredientIdx, it.name)
                )
            );
        })
        .then((result: ListAndCountDTO<IngredientResponseDTO>) => {
            res.status(OK).json(new ResponseDTO('재료 검색 성공', result));
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.setIngredientService = (service: IngredientService) => {
    Ingredient = service;
};
