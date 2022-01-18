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
import UserInputDTO from '../data/dto/UserInputDTO';
import LoginInfoDTO from '../data/dto/LoginInfoDTO';
import SurveyDTO from '../data/dto/SurveyDTO';

const { GRADE_USER } = require('../utils/constantUtil');

let User: UserService = new UserService();

module.exports.setUserService = (userService: any) => {
    User = userService;
};
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       nickname:
 *         type: string
 *       gender:
 *         type: string
 *         enum: [MAN, WOMAN]
 *       birth:
 *         type: integer
 *       grade:
 *         type: string
 *         enum: [USER, MANAGER, SYSTEM_ADMIN]
 *     example:
 *       email: hee.youn@samsung.com
 *       nickname: 쿼카맨
 *       gender: MAN
 *       birth: 1995
 *  */

/**
 * @swagger
 *   /user/register:
 *     post:
 *       tags:
 *       - user
 *       description: 사용자 회원 가입
 *       operationId: registerUser
 *       produces:
 *       - application/json
 *       - application/x-www-urlencoded
 *       consumes:
 *       - application/json
 *       - application/x-www-urlencoded
 *       parameters:
 *       - in: body
 *         name: body
 *         description: Created user object
 *         required: true
 *         schema:
 *           allOf:
 *           - $ref: '#/definitions/User'
 *           - type: object
 *             properties:
 *               password:
 *                 type: string
 *             example:
 *               password: test
 *       responses:
 *         200:
 *           description: success
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 회원가입 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   userIdx:
 *                     type: integer
 *                     example: 29
 *                   token:
 *                     type: string
 *                     description: login용 userToken
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoyOSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTI4VDAwOjUyOjI4LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJpYXQiOjE2MTQ0OTk5OTQsImV4cCI6MTYxNjIyNzk5NCwiaXNzIjoiYWZ1bWUtamFja3BvdCJ9.lztExrMNy-HCeaDDheos-EXRQEHMdVmQNiaYvKBPHGw
 *                   refreshToken:
 *                     type: string
 *                     description: token 재발급 용
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZyZXNoVG9rZW4iOnsidXNlcklkeCI6MSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoifSwiaWF0IjoxNjA5ODUxODIzLCJleHAiOjE2MTE1Nzk4MjMsImlzcyI6ImFmdW1lLWphY2twb3QifQ.Vb9-KO1DWOBhuVAoBzh0USybt5b5YpZqfqG1OU3snUY
 *         default:
 *           description: successful operation
 *       x-swagger-router-controller: User
 *  */
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
    User.createUser(UserInputDTO.createByJson(userRegisterRequest))
        .then((result: UserInputDTO) => {
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

/**
 * @swagger
 *   /user/{userIdx}:
 *     delete:
 *       tags:
 *       - user
 *       summary: Delete user
 *       description: This can only be done by the logged in user.
 *       operationId: deleteUser
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: userIdx
 *         in: path
 *         required: true
 *         type: string
 *       responses:
 *         400:
 *           description: Invalid username supplied
 *         404:
 *           description: User not found
 *       x-swagger-router-controller: User
 *  */
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

/**
 * @swagger
 *   /user/login:
 *     post:
 *       tags:
 *       - user
 *       description: 로그인 <br/> 반환 되는 정보 [유저 정보 + Token + refresh Token] <br/> 발행된 로그인 토큰은 헤더[x-access-token="Bearer " + Token]에 넣어주세요.
 *       operationId: loginUser
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: hee.youn@samsung.com
 *             password:
 *               type: string
 *               example: test
 *       responses:
 *         200:
 *           description: success
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 로그인 성공
 *               data:
 *                 type: object
 *                 properties:
 *                   userIdx:
 *                     type: integer
 *                     example: 29
 *                   nickname:
 *                     type: string
 *                     example: nickname
 *                   gender:
 *                     type: string
 *                     example: MAN
 *                   birth:
 *                     type: integer
 *                     example: 1995
 *                   token:
 *                     type: string
 *                     description: login용 userToken
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoyOSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAyLTI4VDAwOjUyOjI4LjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAyLTI4VDA4OjEwOjI4LjAwMFoiLCJpYXQiOjE2MTQ0OTk5OTQsImV4cCI6MTYxNjIyNzk5NCwiaXNzIjoiYWZ1bWUtamFja3BvdCJ9.lztExrMNy-HCeaDDheos-EXRQEHMdVmQNiaYvKBPHGw
 *                   refreshToken:
 *                     type: string
 *                     description: token 재발급 용
 *                     example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZyZXNoVG9rZW4iOnsidXNlcklkeCI6MSwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsIm5pY2tuYW1lIjoi7L-87Lm066eoIiwiZ2VuZGVyIjoxLCJwaG9uZSI6IjAxMC0yMDgxLTM4MTgiLCJiaXJ0aCI6MTk5NSwiZ3JhZGUiOjAsImFjY2Vzc1RpbWUiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJjcmVhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIxLTAxLTA1VDEzOjAzOjQwLjAwMFoifSwiaWF0IjoxNjA5ODUxODIzLCJleHAiOjE2MTE1Nzk4MjMsImlzcyI6ImFmdW1lLWphY2twb3QifQ.Vb9-KO1DWOBhuVAoBzh0USybt5b5YpZqfqG1OU3snUY
 *         400:
 *           description: Invalid username/password supplied
 *         401:
 *           description: 비밀번호가 잘못된 경우 / 아이디가 존재하지 않는 경우
 *           schema:
 *             type: object
 *             example:
 *               message: 비밀번호가 잘못되었습니다 / 해당 조건에 일치하는 데이터가 없습니다.
 *       x-swagger-router-controller: User
 *  */
const loginUser: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email: string = req.body.email;
    const password: string = req.body.password;
    User.loginUser(email, password)
        .then((result: LoginInfoDTO) => {
            return LoginResponse.createByJson(result);
        })
        .then((response: LoginResponse) => {
            res.status(StatusCode.OK).json(
                new ResponseDTO<LoginResponse>(MSG_LOGIN_SUCCESS, response)
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /user/{userIdx}:
 *     put:
 *       tags:
 *       - user
 *       summary: 유저 정보 수정
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 유저 정보 수정 <br/>
 *       operationId: updateUser
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: userIdx
 *         in: path
 *         description: name that need to be updated
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Updated user object
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *       responses:
 *         200:
 *           description: successful operation
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               data:
 *                 allOf:
 *                 - $ref: '#/definitions/User'
 *                 - type: object
 *                   properties:
 *                     userIdx:
 *                       type: integer
 *             example:
 *               message: 유저 수정 성공
 *               data:
 *                 userIdx: 1
 *                 nickname: nickname
 *                 gender: WOMAN
 *                 birth: 1995
 *                 email: email
 *         401:
 *           description: login Token 의 UserIdx와 일치하지 않는 경우 /  login Token이 없는 경우
 *           schema:
 *             type: object
 *             example:
 *               message: 권한이 없습니다 / 유효하지 않는 토큰입니다.
 *         404:
 *           description: User not found
 *       x-swagger-router-controller: User
 *  */
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
    User.updateUser(UserInputDTO.createByJson(userEditRequest))
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

/**
 * @swagger
 *   /user/changePassword:
 *     put:
 *       tags:
 *       - user
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 유저 비밀번호 변경 <br/>
 *       operationId: changePassword
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       produces:
 *       - application/json
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             prevPassword:
 *               type: string
 *             newPassword:
 *               type: string
 *           example:
 *             prevPassword: test
 *             newPassword: change
 *       responses:
 *         default:
 *           description: successful operation
 *       x-swagger-router-controller: User
 *  */
const changePassword: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    const { prevPassword, newPassword } = req.body;
    User.changePassword(userIdx, prevPassword, newPassword)
        .then(() => {
            res.status(StatusCode.OK).json(
                new SimpleResponseDTO(MSG_CHANGE_PASSWORD_SUCCESS)
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /user/auth:
 *     post:
 *       tags:
 *       - user
 *       summary: 유저 권한 조회
 *       operationId: authUser
 *       produces:
 *       - application/json
 *       parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: userToken 값
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoxLCJuaWNrbmFtZSI6IuycpO2drOyEsSIsImdlbmRlciI6Im1hbGUiLCJwaG9uZSI6IjAxMC0yMDgxLTM4IiwiZW1haWwiOiJoZWUueW91bkBzYW1zdW5nLmNvbSIsImJpcnRoIjoxOTk1LCJpYXQiOjE2MDcwMDU3NTIsImV4cCI6MTYwODczMzc1MiwiaXNzIjoiYWZ1bWUtamFja3BvdCJ9.wHBPi8pQuzJRbUy4noAwdwhCRtA9mG_UrI-S0IUEkxY
 *       responses:
 *         200:
 *           description: 권한 조회 성공
 *           schema:
 *             allOf:
 *             - type: object
 *               properties:
 *                 isAuth:
 *                   type: boolean
 *                   description: 로그인 여부
 *                   example: false
 *                 isAdmin:
 *                   type: boolean
 *                   description: 관리자 여부
 *                   example: false
 *             - $ref: '#/definitions/User'
 *       x-swagger-router-controller: User
 *  */
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

/**
 * @swagger
 *   /user/validate/email:
 *     get:
 *       tags:
 *       - user
 *       description: 이메일 중복 체크
 *       operationId: validateEmail
 *       produces:
 *       - application/json
 *       - application/x-www-urlencoded
 *       parameters:
 *       - in: query
 *         name: email
 *         type: string
 *         required: true
 *       responses:
 *         200:
 *           description: success
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 이메일 중복 체크
 *               data:
 *                 type: boolean
 *                 description: 사용 가능 여부
 *                 example: true
 *       x-swagger-router-controller: User
 *  */
const validateEmail: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email: string = req.query.email as string;
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

/**
 * @swagger
 *   /user/validate/name:
 *     get:
 *       tags:
 *       - user
 *       description: 이름 중복 체크
 *       operationId: validateName
 *       produces:
 *       - application/json
 *       - application/x-www-urlencoded
 *       parameters:
 *       - in: query
 *         name: nickname
 *         type: string
 *         required: true
 *       responses:
 *         200:
 *           description: success
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 이름 중복 체크
 *               data:
 *                 type: boolean
 *                 description: 사용 가능 여부
 *                 example: true
 *       x-swagger-router-controller: User
 *  */
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

/**
 * @swagger
 *   /user/survey:
 *     post:
 *       tags:
 *       - user
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 사용자 서베이를 등록한다. <br/>
 *       operationId: postSurvey
 *       security:
 *         - userToken: []
 *       x-security-scopes:
 *         - user
 *       produces:
 *       - application/json
 *       consumes:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             keywordList:
 *               type: array
 *               items:
 *                 type: integer
 *               example: [1, 2]
 *             seriesList:
 *               type: array
 *               items:
 *                 type: integer
 *               example: [1, 2]
 *             perfumeList:
 *               type: array
 *               items:
 *                 type: integer
 *               example: [1, 2]
 *       responses:
 *         default:
 *           description: successful operation
 *       x-swagger-router-controller: User
 *  */
const postSurvey: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx: number = req.middlewareToken.loginUserIdx;
    const {
        keywordList,
        perfumeList,
        seriesList,
    }: {
        keywordList?: number[];
        perfumeList?: number[];
        seriesList?: number[];
    } = req.body;
    const surveyDTO: SurveyDTO = new SurveyDTO(
        userIdx,
        keywordList || [],
        perfumeList || [],
        seriesList || []
    );
    User.addSurvey(surveyDTO)
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
