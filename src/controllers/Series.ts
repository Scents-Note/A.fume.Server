import { Request, Response, NextFunction, RequestHandler } from 'express';

import { loggerAdapter } from '../modules/winston';

import StatusCode from '../utils/statusCode';

import IngredientService from '../service/IngredientService';
import SeriesService from '../service/SeriesService';

import { PagingRequestDTO } from '../data/request/common';

import { ResponseDTO } from '../data/response/common';
import { SeriesResponse, SeriesFilterResponse } from '../data/response/series';
import { IngredientResponse } from '../data/response/ingredient';

import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import SeriesDTO from '../data/dto/SeriesDTO';
import SeriesFilterDTO from '../data/dto/SeriesFilterDTO';
import IngredientDTO from '../data/dto/IngredientDTO';

import {
    MSG_GET_SERIES_ALL_SUCCESS,
    MSG_GET_INGREDIENT_BY_SERIES_SUCCESS,
    MSG_SEARCH_SERIES_LIST_SUCCESS,
} from '../utils/strings';

const LOG_TAG: string = '[Series/Controller]';

let Series = new SeriesService();
let Ingredient = new IngredientService();
/**
 * @swagger
 * definitions:
 *   SeriesInfo:
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
 *     example:
 *       name: 꿀
 *       englishName: Honey
 *       description: 화이트 허니, 허니
 *       imageUrl: http://
 *  */

/**
 * @swagger
 *    /series:
 *     get:
 *       tags:
 *       - series
 *       summary: 계열 전체 목록 조회
 *       description: 계열 조회 <br/> 반환 되는 정보 [계열]
 *       operationId: getSeriesAll
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
 *                 example: series 목록 조회 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   count:
 *                     type: integer
 *                     example: 10
 *                   rows:
 *                     type: array
 *                     items:
 *                       allOf:
 *                         - $ref: '#/definitions/SeriesInfo'
 *                         - type: object
 *                           properties:
 *                             seriesIdx:
 *                               type: integer
 *                           example:
 *                             seriesIdx: 222
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Series
 *  */
const getSeriesAll: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    Series.getSeriesAll(PagingRequestDTO.createByJson(req.query))
        .then((result: ListAndCountDTO<SeriesDTO>) => {
            return {
                count: result.count,
                rows: result.rows.map(SeriesResponse.create),
            };
        })
        .then((result: ListAndCountDTO<SeriesResponse>) => {
            loggerAdapter.infoWithTruncate(
                `${LOG_TAG} getSeriesAll's result = ${result}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<SeriesResponse>>(
                    MSG_GET_SERIES_ALL_SUCCESS,
                    result
                )
            );
        })
        .catch((err: Error) => next(err));
};

const getIngredients: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const seriesIdx: number = parseInt(req.params['seriesIdx']);
    Ingredient.getIngredientList(seriesIdx)
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            return new ListAndCountDTO(
                result.count,
                result.rows.map(IngredientResponse.createByJson)
            );
        })
        .then((result: ListAndCountDTO<IngredientResponse>) => {
            loggerAdapter.infoWithTruncate(
                `${LOG_TAG} getIngredients's result = ${result}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponse>>(
                    MSG_GET_INGREDIENT_BY_SERIES_SUCCESS,
                    result
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /filter/series:
 *     get:
 *       tags:
 *       - series
 *       summary: 필터를 위한 series 리스트
 *       description: 향수 검색 화면에서 제공되는 계열 + 재료 리스트 <br/> 반환 되는 정보 [계열 x 재료 리스트]
 *       operationId: getFilterSeries
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
 *                 example: Filter Series 리스트 조회 성공
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
 *                       - $ref: '#/definitions/SeriesInfo'
 *                       - type: object
 *                         properties:
 *                           ingredients:
 *                             type: array
 *                             items:
 *                               $ref: '#/definitions/IngredientInfo'
 *                         example:
 *                           ingredients: []
 *       x-swagger-router-controller: Series
 *  */
const getFilterSeries: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    Series.getFilterSeries(PagingRequestDTO.createByJson(req.query))
        .then((result: ListAndCountDTO<SeriesFilterDTO>) => {
            return new ListAndCountDTO(
                result.count,
                result.rows.map(SeriesFilterResponse.create)
            );
        })
        .then((result: ListAndCountDTO<SeriesFilterResponse>) => {
            loggerAdapter.infoWithTruncate(
                `${LOG_TAG} getFilterSeries's result = ${result}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<SeriesFilterResponse>>(
                    MSG_SEARCH_SERIES_LIST_SUCCESS,
                    result
                )
            );
        })
        .catch((err: Error) => next(err));
};

module.exports.getSeriesAll = getSeriesAll;
module.exports.getIngredients = getIngredients;
module.exports.getFilterSeries = getFilterSeries;

module.exports.setSeriesService = (service: any) => {
    Series = service;
};

module.exports.setIngredientService = (service: any) => {
    Ingredient = service;
};
