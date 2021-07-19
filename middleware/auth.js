const jwt = require('../lib/token');
const {
    InvalidTokenError,
    UnAuthorizedError,
} = require('../utils/errors/errors');

/**
 * 로그인 토큰을 읽어서 userIdx를 req.middlewareToken에 추가
 *
 * @param {*} req
 * @param {*} authOrSecDef
 * @param {*} token
 * @param {*} callback
 */
module.exports.verifyTokenMiddleware = (req, res, next) => {
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
        return next();
    }

    if (token.indexOf('Bearer ') != 0) {
        throw new InvalidTokenError();
    }
    const tokenString = token.split(' ')[1];
    const { userIdx } = jwt.verify(tokenString);
    req.middlewareToken.loginUserIdx = userIdx;
    return next();
};
