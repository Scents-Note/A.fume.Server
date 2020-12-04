'use strict';

const seriesDAO = require('../dao/SeriesDao.js');

/**
 * 계열 삽입
 * 계열 삽입
 *
 * body SeriesInfo Insert new series info (optional)
 * no response value expected for this operation
 **/
exports.postSeries = ({name, englishName, description}) => {
  return seriesDAO.create({name, englishName, description});
}

/**
 * 특정 계열 조회
 * 특정 계열 조회
 *
 * seriesIdx Long 계열 ID
 * returns SeriesInfo
 **/
exports.getSeriesByIdx = (seriesIdx) => {
  return seriesDAO.read(seriesIdx);
};


/**
 * 계열 전체 목록 조회
 * 계열 전체 목록 반환
 *
 * returns List
 **/
exports.getSeriesList = () => {
  console.log("service -> series getList");
  return seriesDAO.readAll();
};



/**
 * 계열 수정
 * 계열 수정
 *
 * seriesIdx Long 계열 ID
 * body SeriesInfo Updated series info (optional)
 * no response value expected for this operation
 **/
exports.putSeries = ({seriesIdx, name, englishName, description}) => {
  return seriesDAO.update({seriesIdx, name, englishName, description});
};


/**
 * 계열 삭제
 * 계열 삭제
 *
 * seriesIdx Long 계열 ID
 * no response value expected for this operation
 **/
exports.deleteSeries = (seriesIdx) => {
  return seriesDAO.delete(seriesIdx);
}