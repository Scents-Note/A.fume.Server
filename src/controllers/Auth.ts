import { Request, Response, NextFunction } from 'express';

import { logger, LoggerHelper } from '@modules/winston';

import StatusCode from '@utils/statusCode';

import { ReissueRequest } from '@request/auth';
import { OpCode, ResponseDTO, SimpleResponseDTO } from '@response/common';

import { TokenSetDTO } from '@dto/index';

import AuthService from '@services/AuthService';

import { MSG_REISSUE_SUCCESS } from '@utils/strings';
import { AbnormalConnectionError } from '@src/utils/errors/errors';
import { JsonWebTokenError } from 'jsonwebtoken';

const LOG_TAG: string = '[Auth/Controller]';

interface AuthController {
    reissueAccessToken(req: Request, res: Response, next: NextFunction): void;
}

class AuthControllerImpl implements AuthController {
    authService: AuthService;
    constructor(authService?: AuthService) {
        this.authService = authService || new AuthService();
    }

    setAuthService(authService: AuthService) {
        this.authService = authService;
    }

    /**
     * @swagger
     *   /auth/reissue:
     *     post:
     *       tags:
     *       - auth
     *       description: 토큰 재발행
     *       operationId: reissueAccessToken
     *       produces:
     *       - application/json
     *       consumes:
     *       - application/json
     *       parameters:
     *       - in: body
     *         name: body
     *         description: Created user object
     *         required: true
     *         schema:
     *           $ref: '#/definitions/ReissueRequest'
     *       responses:
     *         200:
     *           description: success
     *           schema:
     *             type: object
     *             properties:
     *               message:
     *                 type: string
     *                 example: 재발행 성공
     *               data:
     *         default:
     *           description: successful operation
     *       x-swagger-router-controller: Auth
     *  */
    reissueAccessToken(req: Request, res: Response, next: NextFunction) {
        logger.debug(
            `${LOG_TAG} reissueAccessToken(body = ${JSON.stringify(req.body)})`
        );
        const request: ReissueRequest = ReissueRequest.createByJson(req.body);
        const tokenSet: TokenSetDTO = new TokenSetDTO(
            request.accessToken,
            request.refreshToken
        );
        this.authService
            .reissueAccessToken(tokenSet)
            .then((result: string) => {
                LoggerHelper.logTruncated(
                    logger.debug,
                    `${LOG_TAG} reissueAccessToken's result = ${result}`
                );
                res.status(StatusCode.OK).json(
                    new ResponseDTO<string>(MSG_REISSUE_SUCCESS, result)
                );
                return;
            })
            .catch((err: Error) => {
                if (err instanceof AbnormalConnectionError) {
                    LoggerHelper.logTruncated(
                        logger.debug,
                        `${LOG_TAG} detect AbnormalConnection on during reissueAccessToken`
                    );
                    res.status(StatusCode.FORBIDDEN).json(
                        new SimpleResponseDTO(err.message, OpCode.LOGOUT)
                    );
                    return;
                }
                if (err instanceof JsonWebTokenError) {
                    res.status(StatusCode.BAD_REQUEST).json(
                        new SimpleResponseDTO(err.message)
                    );
                    return;
                }
                next(err);
            });
    }
}

const authController: AuthControllerImpl = new AuthControllerImpl();
module.exports.reissueAccessToken =
    authController.reissueAccessToken.bind(authController);
module.exports.setAuthService =
    authController.setAuthService.bind(authController);
