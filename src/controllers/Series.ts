import { Request, Response, NextFunction, RequestHandler } from 'express';

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

let Series = new SeriesService();
let Ingredient = new IngredientService();

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
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponse>>(
                    MSG_GET_INGREDIENT_BY_SERIES_SUCCESS,
                    result
                )
            );
        })
        .catch((err: Error) => next(err));
};

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
