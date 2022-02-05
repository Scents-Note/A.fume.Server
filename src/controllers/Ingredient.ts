import { Request, Response, NextFunction, RequestHandler } from 'express';

import { loggerAdapter } from '../modules/winston';

import IngredientService from '../service/IngredientService';
import IngredientDTO from '../data/dto/IngredientDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import { ResponseDTO } from '../data/response/common';
import { IngredientResponse } from '../data/response/ingredient';
import StatusCode from '../utils/statusCode';

import { MSG_GET_SEARCH_INGREDIENT_SUCCESS } from '../utils/strings';

const LOG_TAG: string = '[Ingredient/Controller]';

let Ingredient: IngredientService = new IngredientService();
/**
 *
 * @swagger
 * definitions:
 *  IngredientInfo:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       englishName:
 *         type: string
 *       description:
 *         type: string
 *       imageUrl:
 *         type: string
 *       seriesIdx:
 *         type: number
 *     example:
 *       name: 씨쏠트
 *       englishName: Sea Salt
 *       description: 바다 소금
 *       imageUrl: 'url'
 *       seriesIdx: 4
 *  */

/**
 * @swagger
 *  /ingredient:
 *     get:
 *       tags:
 *       - ingredient
 *       summary: 재료 목록 조회
 *       description: 재료 리스트 조회 <br /> 반환 되는 정보 [재료]
 *       operationId: getIngredientAll
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: pagingSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: pagingIndex
 *         in: query
 *         type: integer
 *         required: false
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: ingredient 목록 조회 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 1
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                         - $ref: '#/definitions/IngredientInfo'
 *                         - type: object
 *                           properties:
 *                             ingredientIdx:
 *                               type: integer
 *                           example:
 *                             ingredientIdx: 333
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Ingredient
 */
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
            loggerAdapter.infoWithTruncate(
                `${LOG_TAG} getIngredientAll's result = ${result}`
            );
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
