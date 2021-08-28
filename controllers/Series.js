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
    SeriesDetailResponseDTO,
    SeriesFilterResponseDTO,
} = require('../data/response_dto/series');

const { SeriesInputDTO } = require('../data/dto');

module.exports.postSeries = (req, res, next) => {
    Series.postSeries(new SeriesInputDTO(req.body))
        .then((createdResultDTO) => {
            return createdResultDTO.idx;
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: 'series post 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getSeries = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Series.getSeriesByIdx(seriesIdx)
        .then((result) => {
            return new SeriesDetailResponseDTO(result);
        })
        .then((response) => {
            res.status(OK).json({
                message: 'series 개별 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

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

module.exports.searchSeries = (req, res, next) => {
    Series.searchSeries(new PagingRequestDTO(req.query))
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
                    message: '계열 검색 성공',
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.putSeries = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    const json = Object.assign({}, req.body, { seriesIdx });
    Series.putSeries(new SeriesInputDTO(json))
        .then(() => {
            res.status(OK).json({
                message: 'series put 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.deleteSeries = (req, res, next) => {
    const seriesIdx = req.swagger.params['seriesIdx'].value;
    Series.deleteSeries(seriesIdx)
        .then(() => {
            res.status(OK).json({
                message: 'series delete 성공',
            });
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
                rows: rows.map((it) => it.toResponse()),
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

module.exports.getSeriesByEnglishName = (req, res, next) => {
    const { englishName } = req.body;
    Series.findSeriesByEnglishName(englishName)
        .then((seriesDTO) => new SeriesDetailResponseDTO(seriesDTO))
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '계열 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err) => {
            next(err);
        });
};

module.exports.setSeriesService = (service) => {
    Series = service;
};

module.exports.setIngredientService = (service) => {
    Ingredient = service;
};
