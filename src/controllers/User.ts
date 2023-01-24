import { Request, Response, NextFunction, RequestHandler } from 'express';

import { logger, LoggerHelper } from '@modules/winston';

import { UnAuthorizedError } from '@errors';

import { GENDER_NONE, BIRTH_NONE, GRADE_USER } from '@utils/constants';

import {
    MSG_REGISTER_SUCCESS,
    MSG_DELETE_USER_SUCCESS,
    MSG_LOGIN_SUCCESS,
    MSG_MODIFY_USER_SUCCESS,
    MSG_CHANGE_PASSWORD_SUCCESS,
    MSG_CHECK_PASSWORD,
    MSG_GET_AUTHORIZE_INFO,
    MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE,
    MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_AVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE,
    MSG_POST_SURVEY_SUCCESS,
} from '@utils/strings';

import StatusCode from '@utils/statusCode';

import UserService from '@services/UserService';

import { UserRegisterRequest, UserEditRequest } from '@request/user';

import { ResponseDTO, SimpleResponseDTO } from '@response/common';

import {
    UserResponse,
    UserRegisterResponse,
    UserAuthResponse,
    LoginResponse,
} from '@response/user';

import {
    UserAuthDTO,
    UserInputDTO,
    LoginInfoDTO,
    SurveyDTO,
    UserDTO,
} from '@dto/index';

const LOG_TAG: string = '[User/Controller]';

let User: UserService = new UserService();

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
 *           $ref: '#/definitions/UserRegisterRequest'
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
 *                 allOf:
 *                 - $ref: '#/definitions/UserRegisterResponse'
 *         default:
 *           description: successful operation
 *       x-swagger-router-controller: User
 *  */
const registerUser: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.debug(`${LOG_TAG} registerUser(body = ${JSON.stringify(req.body)})`);
    const userRegisterRequest: UserRegisterRequest =
        UserRegisterRequest.createByJson(req.body);

    if (userRegisterRequest.grade > GRADE_USER) {
        next(new UnAuthorizedError());
        return;
    }
    User.createUser(userRegisterRequest.toUserInputDTO())
        .then((result: UserInputDTO) => {
            return UserRegisterResponse.createByJson(result);
        })
        .then((response: UserRegisterResponse) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} registerUser's result = ${response}`
            );
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
 *                 allOf:
 *                 - $ref: '#/definitions/LoginResponse'
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
    logger.debug(`${LOG_TAG} loginUser(body = ${JSON.stringify(req.body)})`);
    const email: string = req.body.email;
    const password: string = req.body.password;
    User.loginUser(email, password)
        .then((result: LoginInfoDTO) => {
            const loginResponse: any = LoginResponse.createByJson(result);
            // TODO gender, birth nullable로 변경한 이후 아래 코드 삭제하기
            if (loginResponse.gender == GENDER_NONE) {
                delete loginResponse.gender;
            }
            if (loginResponse.birth == BIRTH_NONE) {
                delete loginResponse.birth;
            }

            return loginResponse;
        })
        .then((response: LoginResponse) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} loginUser's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<LoginResponse>(MSG_LOGIN_SUCCESS, response)
            );
        })
        .catch((err: Error) => next(err));
};

/**
 * @swagger
 *   /user/checkPassword:
 *     put:
 *       tags:
 *       - user
 *       description: <h3> 🎫로그인 토큰 필수🎫 </h3> <br/> 유저 비밀번호 변경 <br/>
 *       operationId: checkPassword
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
 *             password:
 *               type: string
 *           example:
 *             password: test
 *       responses:
 *         200:
 *           description: 비밀번호 일치
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 비밀번호 확인
 *               data:
 *                  type: boolean
 *                  example: true
 *                  description: true if password is correct
 *         default:
 *           description: successful operation
 *       x-swagger-router-controller: User
 *  */
const checkPassword: RequestHandler = (
    req: Request | any,
    res: Response,
    next: NextFunction
) => {
    const userIdx = req.middlewareToken.loginUserIdx;
    logger.debug(
        `${LOG_TAG} checkPassword(userIdx = ${userIdx}, body = ${JSON.stringify(
            req.body
        )})`
    );
    const { password } = req.body;
    User.checkPassword(userIdx, password)
        .then((isSuccess: boolean) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} checkPassword isSuccess ${isSuccess}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO(MSG_CHECK_PASSWORD, isSuccess)
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
    logger.debug(
        `${LOG_TAG} changePassword(userIdx = ${userIdx}, body = ${JSON.stringify(
            req.body
        )})`
    );
    const { prevPassword, newPassword } = req.body;
    User.changePassword(userIdx, prevPassword, newPassword)
        .then(() => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} changePassword success`
            );
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
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: 권한 조회 성공
 *               data:
 *                 allOf:
 *                 - $ref: '#/definitions/UserAuthResponse'
 *       x-swagger-router-controller: User
 *  */
const authUser: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.debug(`${LOG_TAG} authUser(body = ${JSON.stringify(req.body)})`);
    const { token } = req.body;
    User.authUser(token)
        .then((result: UserAuthDTO) => {
            return UserAuthResponse.createByJson(result);
        })
        .then((response: UserAuthResponse) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} authUser's result = ${response}`
            );
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
    logger.debug(`${LOG_TAG} validateEmail(query = ${req.query})`);
    const email: string = req.query.email as string;
    User.validateEmail(email)
        .then((response: boolean) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} validateEmail's result = ${response}`
            );
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
    logger.debug(`${LOG_TAG} validateName(query = ${req.query})`);
    if (!req.query.nickname) {
        LoggerHelper.logTruncated(
            logger.debug,
            `${LOG_TAG} validateName's result = false`
        );
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
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} validateName's result = ${response}`
            );
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
    logger.debug(
        `${LOG_TAG} postSurvey(userIdx = ${userIdx}, body = ${JSON.stringify(
            req.body
        )})`
    );
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
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} postSurvey success`
            );
            res.status(StatusCode.OK).json(
                new SimpleResponseDTO(MSG_POST_SURVEY_SUCCESS)
            );
        })
        .catch((err: Error) => next(err));
};

/* 
    TODO
    endpoint에 path variable이 있는 경우 
    다른 엔드포인트의 경로를 path variable로 인식하는 문제가 발생한다.
    e.g ) /user/changePassword 에서 changePassword를 userIdx로 인식하여 의도하지 않는 operation 호출
    현재 이에 대한 해결 방법이 필요하다.
    임시 적인 조치로 path variable이 들어간 경우 controller 내에서 하단에 위치하면 회피할 수 있다.
*/

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
 *           $ref: '#/definitions/UserEditRequest'
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
 *                 - $ref: '#/definitions/UserResponse'
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
    logger.debug(
        `${LOG_TAG} updateUser(userIdx = ${tokenUserIdx}, params = ${
            req.params
        }, body = ${JSON.stringify(req.body)})`
    );
    if (userIdx != tokenUserIdx) {
        logger.warn('userIdx and tokenUserIdx is not same');
        next(new UnAuthorizedError());
        return;
    }
    const userEditRequest = UserEditRequest.createByJson(req.body);
    User.updateUser(userEditRequest.toUserInputDTO(userIdx))
        .then((result: UserDTO) => {
            return UserResponse.createByJson(result);
        })
        .then((response: UserResponse) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} updateUser's result = ${response}`
            );
            res.status(StatusCode.OK).json(
                new ResponseDTO<UserResponse>(MSG_MODIFY_USER_SUCCESS, response)
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
    logger.debug(`${LOG_TAG} deleteUser(params = ${req.params})`);
    User.deleteUser(userIdx)
        .then((_: any) => {
            LoggerHelper.logTruncated(
                logger.debug,
                `${LOG_TAG} deleteUser success`
            );
            res.status(StatusCode.OK).json(
                new SimpleResponseDTO(MSG_DELETE_USER_SUCCESS)
            );
        })
        .catch((err: Error) => next(err));
};

module.exports.setUserService = (userService: any) => {
    User = userService;
};

module.exports.registerUser = registerUser;
module.exports.deleteUser = deleteUser;
module.exports.loginUser = loginUser;
module.exports.updateUser = updateUser;
module.exports.changePassword = changePassword;
module.exports.checkPassword = checkPassword;
module.exports.authUser = authUser;
module.exports.validateEmail = validateEmail;
module.exports.validateName = validateName;
module.exports.postSurvey = postSurvey;
