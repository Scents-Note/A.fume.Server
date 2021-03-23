'use strict';

const Brand = require('../service/BrandService');
const { OK } = require('../utils/statusCode.js');

module.exports.searchBrand = (req, res, next) => {
    let { pagingIndex, pagingSize, sort } = req.query;
    pagingIndex = parseInt(pagingIndex) || 1;
    pagingSize = parseInt(pagingSize) || 10;
    sort = sort || 'createdAt_desc';
    Brand.searchBrand(pagingIndex, pagingSize, sort)
        .then((response) => {
            res.status(OK).json({
                message: '브랜드 검색 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getBrandAll = (req, res, next) => {
    Brand.getBrandAll()
        .then((response) => {
            res.status(OK).json({
                message: '브랜드 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getBrand = (req, res, next) => {
    const brandIdx = req.swagger.params['brandIdx'].value;
    Brand.getBrandByIdx(brandIdx)
        .then((response) => {
            res.status(OK).json({
                message: '브랜드 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.postBrand = (req, res, next) => {
    const {
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    } = req.swagger.params['body'].value;
    Brand.insertBrand({
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    })
        .then((response) => {
            res.status(OK).json({
                message: '브랜드 추가 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.putBrand = (req, res, next) => {
    const brandIdx = req.swagger.params['brandIdx'].value;
    const {
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    } = req.swagger.params['body'].value;
    Brand.putBrand({
        brandIdx,
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    })
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
        .then((response) => {
            res.status(OK).json({
                message: '브랜드 필터 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getBrandByEnglishName = (req, res, next) => {
    const { englishName } = req.body;
    Brand.findBrandByEnglishName(englishName)
        .then((response) => {
            res.status(OK).json({
                message: '브랜드 조회 성공',
                data: response,
            });
        })
        .catch((err) => {
            next(err);
        });
};
