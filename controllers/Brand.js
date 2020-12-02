'use strict';

const utils = require('../utils/writer.js');
const Brand = require('../service/BrandService');

module.exports.getBrandList = (req, res, next) => {
  Brand.getBrandList()
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '브랜드 조회 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

module.exports.getBrandByIdx = (req, res, next) => {
  const brandIdx = req.swagger.params['brandIdx'].value;
  Brand.getBrandByIdx(brandIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '브랜드 조회 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
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
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '브랜드 추가 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
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
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '브랜드 수정 성공'
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

module.exports.deleteBrand = (req, res, next) => {
  const brandIdx = req.swagger.params['brandIdx'].value;
  Brand.deleteBrand(brandIdx)
    .then(() => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '브랜드 삭제 성공'
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};
