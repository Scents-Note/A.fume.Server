'use strict';

const User = require('../service/UserService');
const { OK, CONFLICT, INTERNAL_SERVER_ERROR } = require('../utils/statusCode.js');

module.exports.registerUser = (req, res, next) => {
  const body = req.swagger.params['body'].value;
  body.role = 0;
  User.createUser(body)
    .then(() => {
      res.status(OK).json({
        message: '회원가입 성공',
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.deleteUser = (req, res, next) => {
  const userIdx = req.swagger.params['userIdx'].value;
  User.deleteUser(userIdx)
    .then((response) => {
      res.status(OK).json({
        message: '유저 삭제 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.getUserByIdx = (req, res, next) => {
  const userIdx = req.swagger.params['userIdx'].value;
  User.getUserByIdx(userIdx)
    .then((response) => {
      res.status(OK).json({
        message: '유저 조회 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.loginUser = (req, res, next) => {
  const { email, password} = req.body;
  User.loginUser(email, password)
    .then((response) => {
      res.status(OK).json({
        message: '로그인 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    })
};

module.exports.logoutUser = (req, res, next) => {
  User.logoutUser()
    .then((response) => {
      res.status(OK).json(response);
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
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
      res.status(OK).json({
        message: '유저 수정 성공',
        data: response
      });
    })
    .catch((response) => {
      res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
    });
};

module.exports.authUser = (req, res, next) => {
  const { token } = req.body;
  User.authUser(token)
  .then((response) => {
    res.status(OK).json({
      message: '권한 조회',
      data: response
    })
  })
  .catch((response) => {
    res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
  })
}

module.exports.validateEmail = (req, res, next) => {
  const { email } = req.query;
  User.validateEmail(email)
  .then((response) => {
    if(response) {
      res.status(OK).json({
        message: 'Email 중복 체크: 사용 가능',
        data: response
      })
    } else {
      res.status(CONFLICT).json({
        message: 'Email 중복 체크: 사용 불가능',
        data: response
      })
    }
    
  })
  .catch((response) => {
    res.status(response.status || INTERNAL_SERVER_ERROR).json({ message: response.message });
  })
}
