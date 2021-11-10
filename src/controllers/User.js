'use strict';

let User = require('../service/UserService');

module.exports.setUserService = (userService) => {
    User = userService;
};

const { UnAuthorizedError } = require('../utils/errors/errors');
const { OK, CONFLICT } = require('../utils/statusCode.js');

const { ResponseDTO } = require('../data/response_dto/common');
const {
    UserResponseDTO,
    UserRegisterResponseDTO,
    UserAuthResponseDTO,
    LoginResponseDTO,
} = require('../data/response_dto/user');

const { GRADE_USER } = require('../utils/constantUtil');
const UserRegisterRequestDTO = require('../data/request_dto/UserRegisterRequestDTO');
const UserEditRequestDTO = require('../data/request_dto/UserEditRequestDTO');

module.exports.registerUser = (req, res, next) => {
    const body = req.swagger.params['body'].value;
    const userRegisterRequestDTO = new UserRegisterRequestDTO(body);
    if (userRegisterRequestDTO.grade > GRADE_USER) {
        next(new UnAuthorizedError());
        return;
    }
    User.createUser(userRegisterRequestDTO)
        .then((result) => {
            return new UserRegisterResponseDTO(result);
        })
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

module.exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    User.loginUser(email, password)
        .then((result) => {
            return new LoginResponseDTO(result);
        })
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

module.exports.updateUser = (req, res, next) => {
    const userIdx = req.swagger.params['userIdx'].value;
    const tokenUserIdx = req.middlewareToken.loginUserIdx;
    if (userIdx != tokenUserIdx) {
        next(new UnAuthorizedError());
        return;
    }
    const body = req.swagger.params['body'].value;
    const userEditRequestDTO = new UserEditRequestDTO(
        Object.assign({ userIdx }, body)
    );
    User.updateUser(userEditRequestDTO)
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
        .then((result) => {
            return new UserAuthResponseDTO(result);
        })
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
