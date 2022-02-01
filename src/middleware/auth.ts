import JwtController from '../lib/JwtController';
import { InvalidTokenError, UnAuthorizedError } from '../utils/errors/errors';
import express from 'express';

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
    const { userIdx }: { userIdx: number } = JwtController.verify(tokenString);
    req.middlewareToken.loginUserIdx = userIdx;
    return next(null);
}

export { verifyTokenMiddleware };
