import {
    ExpiredTokenError,
    InvalidTokenError,
} from '../../src/utils/errors/errors';

module.exports.publish = () => {
    return {
        token: 'token',
        refreshToken: 'refreshToken',
    };
};

module.exports.create = () => {
    return 'token';
};

module.exports.verify = (token) => {
    if (token == 'expired') {
        throw new ExpiredTokenError();
    }
    if (token == 'invalid') {
        throw new InvalidTokenError();
    }
    return {
        userIdx: 200,
        nickname: '쿼카맨2',
        gender: 'female',
        email: 'hee.youn2@samsung.com',
        birth: 1995,
        iat: 1628327246,
        exp: 1630055246,
        iss: 'afume-jackpot',
    };
};

module.exports.reissue = () => {
    return 'token';
};
