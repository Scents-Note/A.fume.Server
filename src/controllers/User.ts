import { Request, Response, NextFunction, RequestHandler } from 'express';

import { ResponseDTO, SimpleResponseDTO } from '../data/response/common';
import StatusCode from '../utils/statusCode';

import {
    UserResponse,
    UserRegisterResponse,
    UserAuthResponse,
    LoginResponse,
} from '../data/response/user';

import UserService from '../service/UserService';

import { UserRegisterRequest, UserEditRequest } from '../data/request/user';
import UserDTO from '../data/dto/UserDTO';
import UserAuthDTO from '../data/dto/UserAuthDTO';
import { UnAuthorizedError } from '../utils/errors/errors';
import { GenderMap } from '../utils/enumType';

import {
    MSG_REGISTER_SUCCESS,
    MSG_DELETE_USER_SUCCESS,
    MSG_LOGIN_SUCCESS,
    MSG_MODIFY_USER_SUCCESS,
    MSG_CHANGE_PASSWORD_SUCCESS,
    MSG_GET_AUTHORIZE_INFO,
    MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE,
    MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_AVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE,
    MSG_POST_SURVEY_SUCCESS,
} from '../utils/strings';

const { GRADE_USER } = require('../utils/constantUtil');

let User: UserService = new UserService();

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
                new ResponseDTO<UserRegisterResponse>(
                    MSG_REGISTER_SUCCESS,
                    response
                )
            );
        })
        .catch((err: Error) => next(err));
};

const deleteUser: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.params['userIdx'];
    User.deleteUser(userIdx)
        .then((_: any) => {
            res.status(StatusCode.OK).json(
                new SimpleResponseDTO(MSG_DELETE_USER_SUCCESS)
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
                new ResponseDTO<LoginResponse>(MSG_LOGIN_SUCCESS, response)
            );
        })
        .catch((err: Error) => next(err));
};

const updateUser: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.params['userIdx'];
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
                new ResponseDTO<UserResponse>(MSG_MODIFY_USER_SUCCESS, response)
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
                new SimpleResponseDTO(MSG_CHANGE_PASSWORD_SUCCESS)
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
                new ResponseDTO<UserAuthResponse>(
                    MSG_GET_AUTHORIZE_INFO,
                    response
                )
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
                    new ResponseDTO<boolean>(
                        MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE,
                        response
                    )
                );
            } else {
                res.status(StatusCode.CONFLICT).json(
                    new ResponseDTO<boolean>(
                        MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE,
                        response
                    )
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
            new ResponseDTO<boolean>(
                MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE,
                false
            )
        );
        return;
    }
    const nickname: string = decodeURIComponent(req.query.nickname + '');
    User.validateName(nickname)
        .then((response: boolean) => {
            if (response) {
                res.status(StatusCode.OK).json(
                    new ResponseDTO<boolean>(
                        MSG_DUPLICATE_CHECK_NAME_AVAILABLE,
                        response
                    )
                );
            } else {
                res.status(StatusCode.CONFLICT).json(
                    new ResponseDTO<boolean>(
                        MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE,
                        response
                    )
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
            res.status(StatusCode.OK).json(
                new SimpleResponseDTO(MSG_POST_SURVEY_SUCCESS)
            );
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
