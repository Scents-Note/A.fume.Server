import { Request, Response, NextFunction, RequestHandler } from 'express';

import BrandService from '../service/BrandService';

import { ResponseDTO } from '../data/response/common';
import { BrandResponse, BrandFilterResponse } from '../data/response/brand';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import BrandDTO from '../data/dto/BrandDTO';
import BrandFilterDTO from '../data/dto/BrandFilterDTO';

import StatusCode from '../utils/statusCode';
import {
    MSG_GET_BRAND_FILTER_SUCCESS,
    MSG_GET_BRAND_ALL_SUCCESS,
} from '../utils/strings';

let Brand: BrandService = new BrandService();

module.exports.setBrandService = (brandService: BrandService) => {
    Brand = brandService;
};

const getBrandAll: RequestHandler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    Brand.getBrandAll()
        .then((result: ListAndCountDTO<BrandDTO>) => {
            return new ListAndCountDTO<BrandResponse>(
                result.count,
                result.rows.map(BrandResponse.createByJson)
            );
        })
        .then((result: ListAndCountDTO<BrandResponse>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<BrandResponse>>(
                    MSG_GET_BRAND_ALL_SUCCESS,
                    result
                )
            );
        })
        .catch((err: Error) => next(err));
};

const getFilterBrand: RequestHandler = (
    _: Request,
    res: Response,
    next: NextFunction
) => {
    Brand.getFilterBrand()
        .then((result: BrandFilterDTO[]) => {
            return result.map(BrandFilterResponse.create);
        })
        .then((response: BrandFilterResponse[]) => {
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
