import { Request, Response, NextFunction, RequestHandler } from 'express';

import IngredientService from '../service/IngredientService';
import PagingRequestDTO from '../data/request_dto/PagingRequestDTO';
import { ResponseDTO } from '../data/response/common';
import StatusCode from '../utils/statusCode';
import {
    SeriesResponseDTO,
    SeriesFilterResponseDTO,
} from '../data/response/series';
import SeriesDTO from '../data/dto/SeriesDTO';
import SeriesFilterDTO from '../data/dto/SeriesFilterDTO';
import ListAndCountDTO from '../data/dto/ListAndCountDTO';
import IngredientDTO from '../data/dto/IngredientDTO';
import IngredientResponseDTO from '../data/response_dto/ingredient/IngredientResponseDTO';
import SeriesService from '../service/SeriesService';

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
                rows: result.rows.map(SeriesResponseDTO.create),
            };
        })
        .then((result: ListAndCountDTO<SeriesResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<SeriesResponseDTO>>(
                    'series 전체 조회 성공',
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
                result.rows.map(
                    (it: IngredientDTO) =>
                        new IngredientResponseDTO(it.ingredientIdx, it.name)
                )
            );
        })
        .then((result: ListAndCountDTO<IngredientResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<IngredientResponseDTO>>(
                    'Series에 해당하는 Ingredient 조회 성공',
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
                result.rows.map(SeriesFilterResponseDTO.create)
            );
        })
        .then((result: ListAndCountDTO<SeriesFilterResponseDTO>) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<ListAndCountDTO<SeriesFilterResponseDTO>>(
                    '계열 검색 성공',
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
