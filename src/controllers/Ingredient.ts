import { Request, Response, NextFunction, RequestHandler } from 'express';

import IngredientService from '../service/IngredientService';
import IngredientDTO from '../data/dto/IngredientDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import { ResponseDTO } from '../data/response/common';
import { IngredientResponse } from '../data/response/ingredient';
import StatusCode from '../utils/statusCode';

import { MSG_GET_SEARCH_INGREDIENT_SUCCESS } from '../utils/strings';

let Ingredient: IngredientService = new IngredientService();

const getIngredientAll: RequestHandler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    Ingredient.getIngredientAll()
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            return new ListAndCountDTO<IngredientResponse>(
                result.count,
                result.rows.map(IngredientResponse.createByJson)
            );
        })
        .then((result: ListAndCountDTO<IngredientResponse>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponse>>(
                    MSG_GET_SEARCH_INGREDIENT_SUCCESS,
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
