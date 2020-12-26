'use strict';

const Brand = require('../service/BrandService');
const { OK, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.getBrandList = (req, res, next) => {
  Brand.getBrandList()
    .then((response) => {
      res.status(OK).json({
        message: '브랜드 조회 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.getBrandByIdx = (req, res, next) => {
  const brandIdx = req.swagger.params['brandIdx'].value;
  Brand.getBrandByIdx(brandIdx)
    .then((response) => {
      res.status(OK).json({
        message: '브랜드 조회 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.postBrand = (req, res, next) => {
  const {
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
  } = req.swagger.params['body'].value;
  Brand.insertBrand({
      name,
      englishName,
      startCharacter,
      imageUrl,
      description
    }).then((response) => {
      res.status(OK).json({
        message: '브랜드 추가 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.putBrand = (req, res, next) => {
  const brandIdx = req.swagger.params['brandIdx'].value;
  const {
    name,
    englishName,
    startChar,
    imageUrl,
    description
  } = req.swagger.params['body'].value;
  Brand.putBrand({
      brandIdx,
      name,
      englishName,
      startChar,
      imageUrl,
      description
    })
    .then(() => {
      res.status(OK).json({
        message: '브랜드 수정 성공'
      })  ;
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({message: response.message});
    });
};

module.exports.deleteBrand = (req, res, next) => {
  const brandIdx = req.swagger.params['brandIdx'].value;
  Brand.deleteBrand(brandIdx)
    .then(() => {
      res.status(OK).json({
        message: '브랜드 삭제 성공'
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({message: response.message});
    });
};
