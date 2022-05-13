import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger, LoggerHelper } from '@modules/winston';

import IngredientService from '@services/IngredientService';
import SeriesService from '@services/SeriesService';

import { PagingRequestDTO } from '@request/common';

import { ResponseDTO } from '@response/common';
import { SeriesResponse, SeriesFilterResponse } from '@response/series';
import { IngredientResponse } from '@response/ingredient';

import {
    ListAndCountDTO,
    SeriesDTO,
    SeriesFilterDTO,
    IngredientDTO,
} from '@dto/index';

import {
    MSG_GET_SERIES_ALL_SUCCESS,
    MSG_GET_INGREDIENT_BY_SERIES_SUCCESS,
    MSG_SEARCH_SERIES_LIST_SUCCESS,
} from '@utils/strings';

import StatusCode from '@utils/statusCode';

const LOG_TAG: string = '[Series/Controller]';

let Series = new SeriesService();
let Ingredient = new IngredientService();

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
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/SeriesResponse'
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Series
 *  */
const getSeriesAll: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): any => {
    logger.debug(`${LOG_TAG} getSeriesAll(query = ${req.query})`);
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Series.getSeriesAll(pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<SeriesDTO>) => {
            // remove etc by concept
            result = removeEtc(result);
            return result.convertType(SeriesResponse.create);
        })
        .then((response: ListAndCountDTO<SeriesResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getSeriesAll's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<SeriesResponse>>(
                    MSG_GET_SERIES_ALL_SUCCESS,
                    response
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
    logger.debug(`${LOG_TAG} getIngredients(params = ${req.params})`);
    const seriesIdx: number = parseInt(req.params['seriesIdx']);
    Ingredient.getIngredientList(seriesIdx)
        .then((result: ListAndCountDTO<IngredientDTO>) => {
            return result.convertType(IngredientResponse.createByJson);
        })
        .then((response: ListAndCountDTO<IngredientResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getIngredients's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponse>>(
                    MSG_GET_INGREDIENT_BY_SERIES_SUCCESS,
                    response
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
 *       - name: requestSize
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
 *                       - $ref: '#/definitions/SeriesFilterResponse'
 *       x-swagger-router-controller: Series
 *  */
const getFilterSeries: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.debug(`${LOG_TAG} getFilterSeries(query = ${req.query})`);
    const pagingRequestDTO: PagingRequestDTO = PagingRequestDTO.createByJson(
        req.query
    );
    Series.getFilterSeries(pagingRequestDTO.toPageDTO())
        .then((result: ListAndCountDTO<SeriesFilterDTO>) => {
            return result.convertType(SeriesFilterResponse.create);
        })
        .then((response: ListAndCountDTO<SeriesFilterResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getFilterSeries's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<SeriesFilterResponse>>(
                    MSG_SEARCH_SERIES_LIST_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

function removeEtc(
    result: ListAndCountDTO<SeriesDTO>
): ListAndCountDTO<SeriesDTO> {
    const filtered: SeriesDTO[] = result.rows.filter((seriesDTO) => {
        return seriesDTO.seriesIdx != 1;
    });
    if (filtered.length + 1 == result.rows.length) {
        return new ListAndCountDTO<SeriesDTO>(result.count - 1, filtered);
    }
    return result;
}

module.exports.getSeriesAll = getSeriesAll;
module.exports.getIngredients = getIngredients;
module.exports.getFilterSeries = getFilterSeries;

module.exports.setSeriesService = (service: any) => {
    Series = service;
};

module.exports.setIngredientService = (service: any) => {
    Ingredient = service;
};
