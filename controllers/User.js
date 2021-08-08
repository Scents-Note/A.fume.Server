'use strict';

let User = require('../service/UserService');

module.exports.setUserService = (userService) => {
    User = userService;
};

const { UnAuthorizedError } = require('../utils/errors/errors');
const { OK, CONFLICT } = require('../utils/statusCode.js');

const { ResponseDTO } = require('../data/response_dto/common');
const { UserResponseDTO } = require('../data/response_dto/user');

const genderMap = {
    MAN: 1,
    WOMAN: 2,
};

const gradeMap = {
    USER: 0,
    OPERATOR: 1,
    SYSTEM: 9,
};

module.exports.registerUser = (req, res, next) => {
    const body = req.swagger.params['body'].value;
    body.grade = body.grade || 'USER';
    body.grade = gradeMap[body.grade];
    if (body.grade > 0) {
        next(new UnAuthorizedError());
        return;
    }
    body.gender = genderMap[body.gender] || 0;
    User.createUser(body)
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '회원가입 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.deleteUser = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    User.deleteUser(userIdx)
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '유저 삭제 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.getUserByIdx = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    User.getUserByIdx(userIdx)
        .then((result) => {
            return new UserResponseDTO(result);
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '유저 조회 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    User.loginUser(email, password)
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '로그인 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.logoutUser = (req, res, next) => {
    User.logoutUser()
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '로그아웃',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.updateUser = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    const tokenUserIdx = req.middlewareToken.loginUserIdx;
    if (userIdx != tokenUserIdx) {
        next(new UnAuthorizedError('유효하지 않는 접근입니다.'));
        return;
    }
    const body = req.swagger.params['body'].value;
    body.gender = genderMap[body.gender] || 0;
    const payload = Object.assign(body, {
        userIdx,
    });
    User.updateUser(payload)
        .then((result) => {
            return new UserResponseDTO(result);
        })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '유저 수정 성공',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.changePassword = (req, res, next) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    const { prevPassword, newPassword } = req.swagger.params['body'].value;
    User.changePassword({ userIdx, prevPassword, newPassword })
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '비밀번호 변경 성공',
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.authUser = (req, res, next) => {
    const { token } = req.body;
    User.authUser(token)
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: '권한 조회',
                    data: response,
                })
            );
        })
        .catch((err) => next(err));
};

module.exports.validateEmail = (req, res, next) => {
    const { email } = req.query;
    User.validateEmail(email)
        .then((response) => {
            if (response) {
                res.status(OK).json(
                    new ResponseDTO({
                        message: 'Email 중복 체크: 사용 가능',
                        data: response,
                    })
                );
            } else {
                res.status(CONFLICT).json(
                    new ResponseDTO({
                        message: 'Email 중복 체크: 사용 불가능',
                        data: response,
                    })
                );
            }
        })
        .catch((err) => next(err));
};

module.exports.validateName = (req, res, next) => {
    const nickname = decodeURIComponent(req.query.nickname);
    User.validateName(nickname)
        .then((response) => {
            if (response) {
                res.status(OK).json(
                    new ResponseDTO({
                        message: 'Name 중복 체크: 사용 가능',
                        data: response,
                    })
                );
            } else {
                res.status(CONFLICT).json(
                    new ResponseDTO({
                        message: 'Name 중복 체크: 사용 불가능',
                        data: response,
                    })
                );
            }
        })
        .catch((err) => next(err));
};

module.exports.postSurvey = (req, res, next) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    const { keywordList, perfumeList, seriesList } = req.body;
    User.addSurvey(userIdx, keywordList, perfumeList, seriesList)
        .then((response) => {
            res.status(OK).json(
                new ResponseDTO({
                    message: 'Survey 등록 성공',
                })
            );
        })
        .catch((err) => next(err));
};
