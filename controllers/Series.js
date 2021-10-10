'use strict';

let Series = require('../service/SeriesService');
let Ingredient = require('../service/IngredientService');

const { OK } = require('../utils/statusCode.js');

const { PagingRequestDTO } = require('../data/request_dto');

const {
    ResponseDTO,
    ListAndCountResponseDTO,
} = require('../data/response_dto/common');

const {
    SeriesResponseDTO,
    SeriesFilterResponseDTO,
} = require('../data/response_dto/series');

module.exports.getSeriesAll = (req, res, next) => {
    Series.getSeriesAll(new PagingRequestDTO(req.query))
        .then((result) => {
            return {
                count: result.count,
                rows: result.rows.map((it) => new SeriesResponseDTO(it)),
            };
        })
        .then(({ count, rows }) => {
            res.status(OK).json(
                new ListAndCountResponseDTO({
                    count,
                    rows,
                    message: 'series 전체 조회 성공',
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getIngredients = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Ingredient.getIngredientList(seriesIdx)
        .then((result) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: 'Series에 해당하는 Ingredient 조회 성공',
                    data: result,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getFilterSeries = (req, res, next) => {
    Series.getFilterSeries(new PagingRequestDTO(req.query))
        .then(({ count, rows }) => {
            return {
                count,
                rows: rows.map((it) => SeriesFilterResponseDTO.create(it)),
            };
        })
        .then(({ count, rows }) => {
            res.status(OK).json(
                new ListAndCountResponseDTO({
                    message: '계열 검색 성공',
                    count,
                    rows,
                })
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
