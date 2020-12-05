'use strict';

const brandDao = require('../dao/BrandDao.js');

/**
 * 브랜드 전체 조회
 *
 * @param {number} brandIdx
 * @returns {Promise<Brand[]>}
 **/
exports.getBrandList = () => {
  return brandDao.readAll();
};

/**
 * 브랜드 조회
 *
 * @param {number} brandIdx
 * @returns {Promise<Brand>}
 **/
exports.getBrandByIdx = (brandIdx) => {
  return brandDao.read(brandIdx);
};

/**
 * 브랜드 삽입
 *
 * @param {Object} Brand
 * @returns {Promise}
 **/
exports.insertBrand = ({
  name,
  englishName,
  startCharacter,
  imageUrl,
  description
}) => {
  return brandDao.create({
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
  });
};

/**
 * 브랜드 수정
 *
 * @param {Object} Brand
 * @returns {Promise}
 **/
exports.putBrand = ({
  brandIdx,
  name,
  englishName,
  startCharacter,
  imageUrl,
  description
}) => {
  return brandDao.update({
    brandIdx,
    name,
    englishName,
    startCharacter,
    imageUrl,
    description
  });
};

/**
 * 브랜드 삭제
 *
 * @param {number} brandIdx
 * @returns {Promise}
 **/
exports.deleteBrand = (brandIdx) => {
  return brandDao.delete(brandIdx);
};
