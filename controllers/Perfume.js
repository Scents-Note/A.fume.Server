'use strict';

const utils = require('../utils/writer.js');
const Perfume = require('../service/PerfumeService');

module.exports.createPerfume = (req, res, next) => {
  const body = req.swagger.params['body'].value;
  body.imageThumbnailUrl = body.imageUrl;
  Perfume.createPerfume(body)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '향수 생성 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

module.exports.getPerfumeById = (req, res, next) => {
  const perfumeIdx = req.swagger.params['perfumeIdx'].value;
  const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
  Perfume.getPerfumeById(perfumeIdx, loginUserIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '향수 조회 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, response);
    });
};

module.exports.searchPerfume = (req, res, next) => {
  const {series, brands, keywords, sortBy} = req.swagger.params['filter'].value;
  const loginUserIdx = req.middlewareToken.loginUserIdx || -1;
  Perfume.searchPerfume({series, brands, keywords}, sortBy, loginUserIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '향수 검색 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.updatePerfume = (req, res, next) => {
  const body = req.swagger.params['body'].value;
  Perfume.updatePerfume(body)
    .then(() => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '향수 수정 성공'
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.likePerfume = (req, res, next) => {
  const perfumeIdx = req.swagger.params['perfumeIdx'].value;
  const loginUserIdx = req.middlewareToken.loginUserIdx;
  Perfume.likePerfume({perfumeIdx, userIdx: loginUserIdx})
    .then((result) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '향수 좋아요',
        data: result
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.deletePerfume = (req, res, next) => {
  const perfumeIdx = req.swagger.params['perfumeIdx'].value;
  Perfume.deletePerfume(perfumeIdx)
    .then(() => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '향수 삭제 성공'
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};