import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger, LoggerHelper } from '@modules/winston';

import BrandService from '@services/BrandService';

import { ResponseDTO } from '@response/common';
import { BrandResponse, BrandFilterResponse } from '@response/brand';

import { ListAndCountDTO, BrandDTO, BrandFilterDTO } from '@dto/index';

import StatusCode from '@utils/statusCode';

import {
    MSG_GET_BRAND_FILTER_SUCCESS,
    MSG_GET_BRAND_ALL_SUCCESS,
} from '@utils/strings';

let Brand: BrandService = new BrandService();
const LOG_TAG: string = '[Brand/Controller]';

module.exports.setBrandService = (brandService: BrandService) => {
    Brand = brandService;
};

/**
 * @swagger
 *   /brand:
 *     get:
 *       tags:
 *       - brand
 *       summary: 브랜드 전체 조회
 *       description: 브랜드 조회 <br/> 반환 되는 정보 [브랜드]
 *       operationId: getBrandAll
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: itemSize
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
 *                 example: 브랜드 조회 성공
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
 *                       - $ref: '#/definitions/BrandResponse'
 *         401:
 *           description: Token is missing or invalid
 *       x-swagger-router-controller: Brand
 * */
const getBrandAll: RequestHandler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    logger.debug(`${LOG_TAG} getBrandAll()`);
    Brand.getBrandAll()
        .then((result: ListAndCountDTO<BrandDTO>) => {
            return new ListAndCountDTO<BrandResponse>(
                result.count,
                result.rows.map(BrandResponse.createByJson)
            );
        })
        .then((response: ListAndCountDTO<BrandResponse>) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getBrandAll's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<BrandResponse>>(
                    MSG_GET_BRAND_ALL_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /filter/brand:
 *     get:
 *       tags:
 *       - brand
 *       summary: 필터를 위한 brand 리스트
 *       description: 향수 검색 화면에서 제공되는 브랜드 리스트 <br/> 반환 되는 정보 [브랜드 + 초성]
 *       operationId: getFilterBrand
 *       produces:
 *       - application/json
 *       responses:
 *         200:
 *           description: 성공
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Filter Brand 리스트 조회 성공
 *               data:
 *                 type: array
 *                 items:
 *                   allOf:
 *                   - $ref: '#/definitions/BrandFilterResponse'
 *
 *
 *       x-swagger-router-controller: Brand
 *  */
const getFilterBrand: RequestHandler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    logger.debug(`${LOG_TAG} getFilterBrand()`);
    Brand.getFilterBrand()
        .then((result: BrandFilterDTO[]) => {
            return result.map(BrandFilterResponse.create);
        })
        .then((response: BrandFilterResponse[]) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} getFilterBrand's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<BrandFilterResponse[]>(
                    MSG_GET_BRAND_FILTER_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

module.exports.getBrandAll = getBrandAll;
module.exports.getFilterBrand = getFilterBrand;
