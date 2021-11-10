'use strict';

let Brand = new (require('../service/BrandService'))();

import BrandResponseDTO from '../data/response_dto/brand/BrandResponseDTO';
import BrandFilterResponseDTO from '../data/response_dto/brand/BrandFilterResponseDTO';

module.exports.setBrandService = (brandService) => {
    Brand = brandService;
};
const { OK } = require('../utils/statusCode.js');

const {
    ResponseDTO,
    ListAndCountResponseDTO,
} = require('../data/response_dto/common');

module.exports.getBrandAll = (req, res, next) => {
    Brand.getBrandAll()
        .then((result) => {
            return {
                count: result.count,
                rows: result.rows.map(
                    (it) => new BrandResponseDTO(it.brandIdx, it.name)
                ),
            };
        })
        .then(({ count, rows }) => {
            res.status(OK).json(
                new ListAndCountResponseDTO({
                    message: '브랜드 조회 성공',
                    count,
                    rows,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getFilterBrand = (req, res, next) => {
    Brand.getFilterBrand()
        .then((result) => {
            return result.map((it) => BrandFilterResponseDTO.create(it));
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '브랜드 필터 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};
