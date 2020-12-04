const statusCode = require('../statusCode.js');

class DatabaseError extends Error {
    constructor(code = 'GENERIC', status = statusCode.DB_ERROR, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
        this.code = code;
        this.status = status;
        this.message = '디비 내부 오류';
    }
}

class NoReferencedRowError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoReferencedRowError);
        }
        this.code = code;
        this.status = status;
        this.message = '잘못된 외래키입니다.';
    }
}

class DuplicatedEntryError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DuplicatedEntryError);
        }
        this.code = code;
        this.status = status;
        this.message = '중복되는 값이 이미 존재합니다';
    }
}

class NotMatchedError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotMatchedError);
        }
        this.code = code;
        this.status = status;
        this.message = '해당 조건에 일치하는 데이터가 없습니다.';
    }
}

class FailedToCreateError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FailedToCreateError);
        }
        this.code = code;
        this.status = status;
        this.message = '해당 데이터를 생성하는 중에 오류가 발생헀습니다.';
    }
}

class InvalidTokenError extends Error {
    constructor(code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidTokenError);
        }
        this.code = code;
        this.status = status;
        this.message = '유효하지 않는 토큰입니다.';
    }
}

class ExpiredTokenError extends Error {
    constructor(code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExpiredTokenError);
        }
        this.code = code;
        this.status = status;
        this.message = '만료된 토큰입니다.';
    }
}

class WrongPasswordError extends Error {
    constructor(code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WrongPasswordError);
        }
        this.code = code;
        this.status = status;
        this.message = '비밀번호가 잘못되었습니다';
    }
}

class UnAuthorizedError extends Error {
    constructor(code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnAuthorizedError);
        }
        this.code = code;
        this.status = status;
        this.message = '권한이 없습니다.';
    }
}

module.exports.DatabaseError = DatabaseError;
module.exports.NoReferencedRowError = NoReferencedRowError;
module.exports.DuplicatedEntryError = DuplicatedEntryError;
module.exports.NotMatchedError = NotMatchedError;
module.exports.FailedToCreateError = FailedToCreateError;
module.exports.InvalidTokenError = InvalidTokenError;
module.exports.ExpiredTokenError = ExpiredTokenError;
module.exports.WrongPasswordError = WrongPasswordError;
module.exports.UnAuthorizedError = UnAuthorizedError;
