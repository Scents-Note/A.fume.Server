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

class InvalidInputError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidInputError);
        }
        this.code = code;
        this.status = status;
        this.message = '유효하지않은 값을 입력했습니다.';
    }
}

class InvalidValueError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidValueError);
        }
        this.code = code;
        this.status = status;
        this.message = '유효하지 않는 값입니다.';
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

class PasswordPolicyError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PasswordPolicyError);
        }
        this.code = code;
        this.status = status;
        this.message =
            '사용할 수 없는 패스워드입니다. 패스워드 정책을 확인해주세요.';
    }
}

class UnAuthorizedError extends Error {
    constructor(
        message = '권한이 없습니다.',
        code = 'GENERIC',
        status = statusCode.UNAUTHORIZED,
        ...params
    ) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnAuthorizedError);
        }
        this.code = code;
        this.status = status;
        this.message = message;
    }
}

class InvalidRequestError extends Error {
    constructor(
        key,
        type,
        value,
        code = 'GENERIC',
        status = statusCode.UNAUTHORIZED,
        ...params
    ) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidTokenError);
        }
        this.code = code;
        this.status = status;
        this.message = `잘못된 요청입니다. ${key} must to be ${type.name} but ${value}`;
    }
}

class UnExpectedError extends Error {
    constructor(expectedError, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PasswordPolicyError);
        }
        this.message = `${expectedError.name}: must be caught or declared to be thrown`;
    }
}

module.exports.DatabaseError = DatabaseError;
module.exports.NoReferencedRowError = NoReferencedRowError;
module.exports.DuplicatedEntryError = DuplicatedEntryError;
module.exports.NotMatchedError = NotMatchedError;
module.exports.FailedToCreateError = FailedToCreateError;
module.exports.InvalidInputError = InvalidInputError;
module.exports.InvalidTokenError = InvalidTokenError;
module.exports.ExpiredTokenError = ExpiredTokenError;
module.exports.WrongPasswordError = WrongPasswordError;
module.exports.UnAuthorizedError = UnAuthorizedError;
module.exports.PasswordPolicyError = PasswordPolicyError;
module.exports.InvalidRequestError = InvalidRequestError;
module.exports.InvalidValueError = InvalidValueError;
module.exports.UnExpectedError = UnExpectedError;
