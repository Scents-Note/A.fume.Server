const jwt = require('../lib/token');
const { InvalidTokenError } = require('../utils/errors/errors');

module.exports.verifyTokenMiddleware =  (req, authOrSecDef, token, callback) => {
    const currentScopes = req.swagger.operation["x-security-scopes"] || [];
    if(!token) {
        if(currentScopes.indexOf('admin') > -1) {
            return callback(new InvalidTokenError());
        }
        req.middlewareToken = { loginUserIdx: -1 };
        return callback(null);
    }

    if (token.indexOf("Bearer ") != 0) {
        throw new InvalidTokenError();
    }
    const tokenString = token.split(' ')[1];

    const { userIdx } = jwt.verify(tokenString);
    req.middlewareToken = { loginUserIdx: userIdx };
    return callback(null);
};