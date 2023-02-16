import express from 'express';

import { InvalidTokenError, UnAuthorizedError } from '@errors';

import JwtController from '@libs/JwtController';
import { encrypt } from '@libs/crypto';

/**
 * @swagger
 * securityDefinitions:
 *   userToken:
 *       type: apiKey
 *       name: x-access-token
 *       in: header
 *       description: /Bearer {token}/ 를 입력해주시면 됩니다.
 * */

/**
 * 로그인 토큰을 읽어서 userIdx를 req.middlewareToken에 추가
 *
 * @param {*} req
 * @param {*} authOrSecDef
 * @param {*} token
 * @param {*} callback
 */
function verifyTokenMiddleware(
    req: express.Request | any,
    _res: express.Response,
    next: express.NextFunction
) {
    const currentScopes = req.swagger['x-security-scopes'] || [];
    const token = req.headers['x-access-token'] || '';
    req.middlewareToken = {};
    if (!token) {
        if (currentScopes.indexOf('admin') > -1) {
            return next(new UnAuthorizedError());
        }
        if (currentScopes.indexOf('user') > -1) {
            return next(new InvalidTokenError());
        }
        req.middlewareToken.loginUserIdx = -1;
        return next(null);
    }

    if (token.indexOf('Bearer ') != 0) {
        throw new InvalidTokenError();
    }
    const tokenString: string = token.split(' ')[1];
    const { userIdx, gender }: { userIdx: number; gender: string } =
        JwtController.verify(tokenString);
    req.middlewareToken.loginUserIdx = userIdx;
    req.middlewareToken.userGender = gender;
    return next(null);
}

/**
 * body의 password 암호화
 *
 * @param {*} req
 * @param {*} authOrSecDef
 * @param {*} token
 * @param {*} callback
 */
function encryptPassword(
    req: express.Request | any,
    _res: express.Response,
    next: express.NextFunction
) {
    if (req.body.password) {
        req.body.password = encrypt(req.body.password);
    }
    if (req.body.prevPassword) {
        req.body.prevPassword = encrypt(req.body.prevPassword);
    }
    if (req.body.newPassword) {
        req.body.newPassword = encrypt(req.body.newPassword);
    }
    return next(null);
}
export { verifyTokenMiddleware, encryptPassword };
