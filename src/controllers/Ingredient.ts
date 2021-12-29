import { Request, Response, NextFunction, RequestHandler } from 'express';

import IngredientService from '../service/IngredientService';
import IngredientResponseDTO from '../data/response_dto/ingredient/IngredientResponseDTO';
import IngredientDTO from '../data/dto/IngredientDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import { ResponseDTO } from '../data/response/common';
import StatusCode from '../utils/statusCode';

let Ingredient: IngredientService = new IngredientService();

const getIngredientAll: RequestHandler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    Ingredient.getIngredientAll()
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            return new ListAndCountDTO<IngredientResponseDTO>(
                result.count,
                result.rows.map(IngredientResponseDTO.create)
            );
        })
        .then((result: ListAndCountDTO<IngredientResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponseDTO>>(
                    '재료 검색 성공',
                    result
                )
            );
        })
        .catch((err: Error) => {
            next(err);
        });
};

module.exports.getIngredientAll = getIngredientAll;

module.exports.setIngredientService = (service: IngredientService) => {
    Ingredient = service;
};
