'use strict';

const { validateType } = require('../utils/validation.js');
const User = require('../service/UserService');
const { OK, CONFLICT } = require('../utils/statusCode.js');

const genderMap = {
    남자: 1,
    여자: 2,
};

module.exports.registerUser = (req, res, next) => {
    const body = req.swagger.params['body'].value;
    body.grade = 0;
    body.gender = genderMap[body.gender] || 0;
    User.createUser(body)
        .then(() => {
            res.status(OK).json({
                message: '회원가입 성공',
            });
        })
        .catch((err) => next(err));
};

module.exports.deleteUser = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    User.deleteUser(userIdx)
        .then((response) => {
            res.status(OK).json({
                message: '유저 삭제 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.getUserByIdx = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    User.getUserByIdx(userIdx)
        .then((response) => {
            res.status(OK).json({
                message: '유저 조회 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    User.loginUser(email, password)
        .then((response) => {
            res.status(OK).json({
                message: '로그인 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.logoutUser = (req, res, next) => {
    User.logoutUser()
        .then((response) => {
            res.status(OK).json(response);
        })
        .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    const body = req.swagger.params['body'].value;
    body.gender = genderMap[body.gender] || 0;
    const payload = Object.assign(body, {
        userIdx,
    });
    User.updateUser(payload)
        .then((response) => {
            res.status(OK).json({
                message: '유저 수정 성공',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.authUser = (req, res, next) => {
    const { token } = req.body;
    User.authUser(token)
        .then((response) => {
            res.status(OK).json({
                message: '권한 조회',
                data: response,
            });
        })
        .catch((err) => next(err));
};

module.exports.validateEmail = (req, res, next) => {
    const { email } = req.query;
    User.validateEmail(email)
        .then((response) => {
            if (response) {
                res.status(OK).json({
                    message: 'Email 중복 체크: 사용 가능',
                    data: response,
                });
            } else {
                res.status(CONFLICT).json({
                    message: 'Email 중복 체크: 사용 불가능',
                    data: response,
                });
            }
        })
        .catch((err) => next(err));
};

module.exports.validateName = (req, res, next) => {
    const nickname = decodeURIComponent(req.query.nickname);
    User.validateName(nickname)
        .then((response) => {
            if (response) {
                res.status(OK).json({
                    message: 'Name 중복 체크: 사용 가능',
                    data: response,
                });
            } else {
                res.status(CONFLICT).json({
                    message: 'Name 중복 체크: 사용 불가능',
                    data: response,
                });
            }
        })
        .catch((err) => next(err));
};

module.exports.postSurvey = (req, res, next) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    if (!validateType(req.body, 'keywordList', Array, next)) return;
    if (!validateType(req.body, 'perfumeList', Array, next)) return;
    if (!validateType(req.body, 'seriesList', Array, next)) return;
    const { keywordList, perfumeList, seriesList } = req.body;
    User.addSurvey(userIdx, keywordList, perfumeList, seriesList)
        .then((response) => {
            console.log(response);
            res.status(OK).json({
                message: 'Survey 등록 성공',
            });
        })
        .catch((err) => next(err));
};
