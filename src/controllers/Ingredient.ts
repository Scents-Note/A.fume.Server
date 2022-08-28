import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger, LoggerHelper } from '@modules/winston';

import { MSG_GET_SEARCH_INGREDIENT_SUCCESS } from '@utils/strings';
import StatusCode from '@utils/statusCode';
import { DEFAULT_INGREDIENT_REQUEST_SIZE } from '@utils/constants';

import IngredientService from '@services/IngredientService';

import { PagingRequestDTO } from '@request/common';
import { ResponseDTO } from '@response/common';
import { IngredientResponse } from '@response/ingredient';
import { IngredientDTO, ListAndCountDTO, PagingDTO } from '@dto/index';

const LOG_TAG: string = '[Ingredient/Controller]';

let Ingredient: IngredientService = new IngredientService();

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
 *       - name: requestSize
 *         in: query
 *         type: integer
 *         required: false
 *       - name: lastPosition
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
 *                         - $ref: '#/definitions/IngredientResponse'
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Ingredient
 */
const getIngredientAll: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query,
        {
            requestSize: DEFAULT_INGREDIENT_REQUEST_SIZE,
        }
    );
    logger.debug(
        `${LOG_TAG} getIngredientAll(pagingRequestDTO = ${pagingRequestDTO})`
    );
    const pagingDTO: PagingDTO = pagingRequestDTO.toPageDTO();
    Ingredient.getIngredientAll(pagingDTO)
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            return result.convertType(IngredientResponse.createByJson);
        })
        .then((response: ListAndCountDTO<IngredientResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getIngredientAll's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponse>>(
                    MSG_GET_SEARCH_INGREDIENT_SUCCESS,
                    response
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
