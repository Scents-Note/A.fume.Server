'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.createUser = (req, res, next) => {
  var body = req.swagger.params['body'].value;
  User.createUser(body)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '회원가입 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.deleteUser = (req, res, next) => {
  const userIdx = req.swagger.params['userIdx'].value;
  User.deleteUser(userIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '유저 삭제 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.getUserByIdx = (req, res, next) => {
  const userIdx = req.swagger.params['userIdx'].value;
  User.getUserByIdx(userIdx)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '유저 조회 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.loginUser = (req, res, next) => {
  const email = req.swagger.params['email'].value;
  const password = req.swagger.params['password'].value;
  User.loginUser(email, password)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '로그인',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    })
};

module.exports.logoutUser = (req, res, next) => {
  User.logoutUser()
    .then((response) => {
      utils.writeJson(res, response);
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};

module.exports.updateUser = (req, res, next) => {
  const userIdx = req.swagger.params['userIdx'].value;
  const body = req.swagger.params['body'].value;
  const payload = Object.assign(body, {
    userIdx
  });
  User.updateUser(payload)
    .then((response) => {
      utils.writeJson(res, utils.respondWithCode(200, {
        message: '유저 수정 성공',
        data: response
      }));
    })
    .catch((response) => {
      utils.writeJson(res, {message: response.message});
    });
};
