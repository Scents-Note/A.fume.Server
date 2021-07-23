'use strict';

const Brand = require('../service/BrandService');
const { OK } = require('../utils/statusCode.js');

const { PagingRequestDTO, BrandInputDTO } = require('../data/request_dto');

const {
    ResponseDTO,
    ListAndCountResponseDTO,
} = require('../data/response_dto/common');

const {
    BrandResponseDTO,
    BrandDetailResponseDTO,
} = require('../data/response_dto/brand');

module.exports.searchBrand = (req, res, next) => {
    Brand.searchBrand(new PagingRequestDTO(req.query))
        .then((result) => {
            return {
                count: result.count,
                rows: result.rows.map((it) => new BrandResponseDTO(it)),
            };
        })
        .then(({ count, rows }) => {
            res.status(OK).json(
                new ListAndCountResponseDTO({
                    message: '브랜드 검색 성공',
                    count,
                    rows,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getBrandAll = (req, res, next) => {
    Brand.getBrandAll()
        .then((result) => {
            return {
                count: result.count,
                rows: result.rows.map((it) => new BrandResponseDTO(it)),
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

module.exports.getBrand = (req, res, next) => {
    const brandIdx = req.swagger.params['brandIdx'].value;
    Brand.getBrandByIdx(brandIdx)
        .then((result) => {
            return new BrandDetailResponseDTO(result);
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '브랜드 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.postBrand = (req, res, next) => {
    Brand.insertBrand(new BrandInputRequestDTO(req.body))
        .then((result) => {
            return result.idx;
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '브랜드 추가 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.putBrand = (req, res, next) => {
    const brandIdx = req.swagger.params['brandIdx'].value;
    const json = Object.assign({}, req.body, { brandIdx });
    Brand.putBrand(new BrandInputDTO(json))
        .then(() => {
            res.status(OK).json({
                message: '브랜드 수정 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.deleteBrand = (req, res, next) => {
    const brandIdx = req.swagger.params['brandIdx'].value;
    Brand.deleteBrand(brandIdx)
        .then(() => {
            res.status(OK).json({
                message: '브랜드 삭제 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.getFilterBrand = (req, res, next) => {
    Brand.getFilterBrand()
        .then((result) => {
            return result.map((it) => it.toResponse());
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

module.exports.getBrandByEnglishName = (req, res, next) => {
    const { englishName } = req.body;
    Brand.findBrandByEnglishName(englishName)
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '브랜드 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err) => {
            next(err);
        });
};
