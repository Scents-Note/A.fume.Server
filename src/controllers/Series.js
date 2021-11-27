import IngredientService from '../service/IngredientService';
import PagingRequestDTO from '../data/request_dto/PagingRequestDTO';
import ResponseDTO from '../data/response_dto/common/ResponseDTO';
import StatusCode from '../utils/statusCode';
import {
    SeriesResponseDTO,
    SeriesFilterResponseDTO,
} from '../data/response/series';

let Series = require('../service/SeriesService');
let Ingredient = new IngredientService();

module.exports.getSeriesAll = (req, res, next) => {
    Series.getSeriesAll(PagingRequestDTO.createByJson(req.query))
        .then((result) => {
            return {
                count: result.count,
                rows: result.rows.map(SeriesResponseDTO.create),
            };
        })
        /* TODO */
        // .then((result: ListAndCountDTO<SeriesResponseDTO>) => {
        .then((result) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('series 전체 조회 성공', result)
            );
        })
        .catch((err) => next(err));
};

module.exports.getIngredients = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Ingredient.getIngredientList(seriesIdx)
        .then((result) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO(
                    'Series에 해당하는 Ingredient 조회 성공',
                    result
                )
            );
        })
        .catch((err) => next(err));
};

module.exports.getFilterSeries = (req, res, next) => {
    Series.getFilterSeries(PagingRequestDTO.createByJson(req.query))
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map(SeriesFilterResponseDTO.create),
            };
        })
        /* TODO */
        // .then((result: ListAndCountDTO<SeriesFIlterResponseDTO>) => {
        .then((result) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('계열 검색 성공', result)
            );
        })
        .catch((err) => next(err));
};

module.exports.setSeriesService = (service) => {
    Series = service;
};

module.exports.setIngredientService = (service) => {
    Ingredient = service;
};
