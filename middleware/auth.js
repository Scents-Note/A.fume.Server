const jwt = require('../lib/token');
const { InvalidTokenError, UnAuthorizedError } = require('../utils/errors/errors');

module.exports.verifyTokenMiddleware =  (req, authOrSecDef, token, callback) => {
    const currentScopes = req.swagger.operation["x-security-scopes"] || [];
    req.middlewareToken = {};
    if(!token) {
        if(currentScopes.indexOf('admin') > -1) {
            return callback(new UnAuthorizedError());
        }
        if(currentScopes.indexOf('user') > -1) {
            return callback(new InvalidTokenError());
        }
        return callback(null);
    }

    if (token.indexOf("Bearer ") != 0) {
        throw new InvalidTokenError();
    }
    const tokenString = token.split(' ')[1];
    const {userIdx} = jwt.verify(tokenString);
    req.middlewareToken.loginUserIdx = userIdx;
    return callback(null);
};