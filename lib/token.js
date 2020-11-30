const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { ExpiredTokenError, InvalidTokenError } = require('../utils/errors/errors');

const options = {
    expiresIn: '20d',
    issuer: 'afume-jackpot'
};

const refreshOptions = {
    expiresIn: '20d',
    issuer: 'afume-jackpot'
};

/**
 * JWT 토큰 발행
 * @param {any} payload 
 * @returns {object} {token, refreshToken}
 */
module.exports.publish = (payload) => {
    const token = jwt.sign(payload, jwtSecret, options);
    const refreshToken = jwt.sign({
        refreshToken: payload
    }, jwtSecret, refreshOptions);
    return {
        token,
        refreshToken
    };
};

/**
 * JWT 토큰 생성
 * @param {any} payload 
 * @returns {string} token
 */
module.exports.create = (payload) => {
    return jwt.sign(payload, jwtSecret, options);
};

/**
 * JWT 토큰 검증
 * @param {string} token
 * @returns {any} payload
 */
module.exports.verify = (token) => {
    try {
        return jwt.verify(token, jwtSecret);
    } catch (err) {
        if (err.message === 'jwt expired') {
            throw new ExpiredTokenError();
        }
        if (err.message === 'invalid signature') {
            throw new InvalidTokenError();
        }
        throw err;
    }
};

/**
 * JWT 토큰 재발행
 * @param {string} token 
 * @returns {string} token
 */
module.exports.reissue = (refreshToken) => {
    const result = jwt.verify(refreshToken, jwtSecret);
    return jwt.sign(result.refreshToken, jwtSecret, options);
};
