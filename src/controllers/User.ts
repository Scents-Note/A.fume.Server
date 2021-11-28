import { Request, Response, NextFunction, RequestHandler } from 'express';

import ResponseDTO from '../data/response_dto/common/ResponseDTO';
import StatusCode from '../utils/statusCode';

import {
    UserResponse,
    UserRegisterResponse,
    UserAuthResponse,
    LoginResponse,
} from '../data/response/user';

import { UserRegisterRequest, UserEditRequest } from '../data/request/user';
import UserDTO from '../data/dto/UserDTO';
import UserAuthDTO from '../data/dto/UserAuthDTO';
import { UnAuthorizedError } from '../utils/errors/errors';
import { GenderMap } from '../utils/enumType';

const { GRADE_USER } = require('../utils/constantUtil');

let User = require('../service/UserService');

module.exports.setUserService = (userService: any) => {
    User = userService;
};

const registerUser: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userRegisterRequest: UserRegisterRequest =
        UserRegisterRequest.createByJson(req.body);

    if (userRegisterRequest.grade > GRADE_USER) {
        next(new UnAuthorizedError());
        return;
    }
    User.createUser(userRegisterRequest)
        .then((result: UserDTO) => {
            return UserRegisterResponse.createByJson(result);
        })
        .then((response: UserRegisterResponse) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('회원가입 성공', response)
            );
        })
        .catch((err: Error) => next(err));
};

const deleteUser: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.swagger.params['userIdx'].value;
    User.deleteUser(userIdx)
        .then((response: any) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('유저 삭제 성공', response)
            );
        })
        .catch((err: Error) => next(err));
};

const loginUser: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body;
    User.loginUser(email, password)
        .then((result: UserDTO) => {
            return LoginResponse.createByJson(result);
        })
        .then((response: LoginResponse) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('로그인 성공', response)
            );
        })
        .catch((err: Error) => next(err));
};

const updateUser: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.swagger.params['userIdx'].value;
    const tokenUserIdx = req.middlewareToken.loginUserIdx;
    if (userIdx != tokenUserIdx) {
        next(new UnAuthorizedError());
        return;
    }
    const userEditRequest = UserEditRequest.createByJson(
        Object.assign({ userIdx }, req.body)
    );
    if (userEditRequest.gender) {
        userEditRequest.gender = GenderMap[userEditRequest.gender];
    }
    User.updateUser(userEditRequest)
        .then((result: UserResponse) => {
            return UserResponse.createByJson(result);
        })
        .then((response: UserResponse) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('유저 수정 성공', response)
            );
        })
        .catch((err: Error) => next(err));
};

const changePassword: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    const { prevPassword, newPassword } = req.body;
    User.changePassword({ userIdx, prevPassword, newPassword })
        .then(() => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('비밀번호 변경 성공')
            );
        })
        .catch((err: Error) => next(err));
};

const authUser: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.body;
    User.authUser(token)
        .then((result: UserAuthDTO) => {
            return UserAuthResponse.createByJson(result);
        })
        .then((response: UserAuthResponse) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO('권한 조회', response)
            );
        })
        .catch((err: Error) => next(err));
};

const validateEmail: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email } = req.query;
    User.validateEmail(email)
        .then((response: boolean) => {
            if (response) {
                res.status(StatusCode.OK).json(
                    new ResponseDTO('Email 중복 체크: 사용 가능', response)
                );
            } else {
                res.status(StatusCode.CONFLICT).json(
                    new ResponseDTO('Email 중복 체크: 사용 불가능', response)
                );
            }
        })
        .catch((err: Error) => next(err));
};

const validateName: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.query.nickname) {
        res.status(StatusCode.CONFLICT).json(
            new ResponseDTO('Name 중복 체크: 사용 불가능', false)
        );
        return;
    }
    const nickname: string = decodeURIComponent(req.query.nickname + '');
    User.validateName(nickname)
        .then((response: boolean) => {
            if (response) {
                res.status(StatusCode.OK).json(
                    new ResponseDTO('Name 중복 체크: 사용 가능', response)
                );
            } else {
                res.status(StatusCode.CONFLICT).json(
                    new ResponseDTO('Name 중복 체크: 사용 불가능', response)
                );
            }
        })
        .catch((err: Error) => next(err));
};

const postSurvey: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx: number = req.middlewareToken.loginUserIdx;
    const { keywordList, perfumeList, seriesList } = req.body;
    User.addSurvey(userIdx, keywordList, perfumeList, seriesList)
        .then(() => {
            res.status(StatusCode.OK).json(new ResponseDTO('Survey 등록 성공'));
        })
        .catch((err: Error) => next(err));
};

module.exports.registerUser = registerUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.updateUser = updateUser;
module.exports.changePassword = changePassword;
module.exports.authUser = authUser;
module.exports.validateEmail = validateEmail;
module.exports.validateName = validateName;
module.exports.postSurvey = postSurvey;
