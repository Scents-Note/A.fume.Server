'use strict';

const brandDao = require('../dao/BrandDao.js');

/**
 * 브랜드 전체 조회
 * 브랜드 리스트 반환
 *
 * returns List
 **/
exports.getBrandList = () => {
  return brandDao.readAll();
};

/**
 * 브랜드 조회
 * 브랜드 객체 반환
 *
 * returns Object
 **/
exports.getBrandByIdx = (brandIdx) => {
  return brandDao.read(brandIdx);
};

/**
 * 브랜드 삽입
 * 생성된 brandIdx 반환
 *
 * returns List
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
 * no response value expected for this operation
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
 * no response value expected for this operation
 **/
exports.deleteBrand = (brandIdx) => {
  return brandDao.delete(brandIdx);
};
