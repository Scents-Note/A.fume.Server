'use strict';

const perfumeDao = require('../dao/PerfumeDao.js')

/**
 * 향수 정보 추가
 * 향수 정보를 추가한다.
 *
 * body Perfume  (optional)
 * no response value expected for this operation
 **/
exports.createPerfume = ({brandIdx, name, englishName, volumeAndPrice, imageThumbnailUrl, mainSeriesIdx, story, abundanceRate, imageUrl}) => {
  return perfumeDao.create({brandIdx, name, englishName, volumeAndPrice, imageThumbnailUrl, mainSeriesIdx, story, abundanceRate, imageUrl});
}


/**
 * Deletes a perfume
 * 
 *
 * perfumeIdx Long Pet id to delete
 * api_key String  (optional)
 * no response value expected for this operation
 **/
exports.deletePerfume = (perfumeIdx) => {
  return perfumeDao.delete(perfumeIdx);
}


/**
 * 향수 세부 정보 조회
 * 향수 세부 정보를 반환한다.
 *
 * perfumeIdx Long ID of perfume to return
 * returns PerfumeDetail
 **/
exports.getPerfumeById = ({userIdx, perfumeIdx}) => {
  const perfume = perfumeDao.readByPerfumeIdx({userIdx, perfumeIdx});
  // TODO 노트 type 추가
  // TODO ingredients 추가
  // TODO score 추가
  // TODO 계절감 추가
  // TODO 잔향감 추가
  // TODO 지속감 추가
  // TODO 성별감 추가
  return perfume;
}


/**
 * 향수 검색
 * 검색 조건에 해당하는 향수를 반환한다.
 *
 * filter Filter 검색 필터 (optional)
 * returns List
 **/
exports.searchPerfume = ({userIdx, filter}) => {
  const {series, brands, keywords, sortBy} = filter;
  return perfumeDao.search({userIdx, series, brands, keywords, sortBy});
}


/**
 * 향수 정보 업데이트
 * 
 *
 * body Perfume  (optional)
 * no response value expected for this operation
 **/
exports.updatePerfume = ({perfumeIdx, name, mainSeriesIdx, brandIdx, englishName, volumeAndPrice, imageThumbnailUrl, story, abundanceRate, imageUrl}) => {
  return perfumeDao.update({perfumeIdx, name, mainSeriesIdx, brandIdx, englishName, volumeAndPrice, imageThumbnailUrl, story, abundanceRate, imageUrl});
}

