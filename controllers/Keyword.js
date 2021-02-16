'use strict';

const Keyword = require('../service/KeywordService')
const { OK } = require('../utils/statusCode.js')

module.exports.getKeywordAll = (req, res, next) => {
  let { pagingIndex, pagingSize} = req.query;
  pagingIndex = parseInt(pagingIndex) || 1;
  pagingSize = parseInt(pagingSize) || 10;
  Keyword.getKeywordAll(pagingIndex, pagingSize)
    .then((response) => {
      res.status(OK).json({
        message: '키워드 목록 전체 조회 성공',
        data: response
      })
    }).catch((err) => next(err))
}

module.exports.getKeywordOfPerfume = (req, res, next) => {
  let perfumeIdx  = req.swagger.params['perfumeIdx']['value'];
  Keyword.getKeywordOfPerfume(perfumeIdx)
    .then((response) => {
      res.status(OK).json({
        message: '향수별 키워드 전체 조회 성공',
        data: response
      })
    }).catch((err) => next(err))
}
