const statusCode = require('../statusCode.js');

class DatabaseError extends Error {
    status: number;
    constructor(status = statusCode.DB_ERROR, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
        this.status = status;
        this.message = '디비 내부 오류';
    }
}

class NoReferencedRowError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoReferencedRowError);
        }
        this.status = status;
        this.message = '잘못된 외래키입니다.';
    }
}

class DuplicatedEntryError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DuplicatedEntryError);
        }
        this.status = status;
        this.message = '중복되는 값이 이미 존재합니다';
    }
}

class NotMatchedError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotMatchedError);
        }
        this.status = status;
        this.message = '해당 조건에 일치하는 데이터가 없습니다.';
    }
}

class FailedToCreateError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FailedToCreateError);
        }
        this.status = status;
        this.message = '해당 데이터를 생성하는 중에 오류가 발생헀습니다.';
    }
}

class InvalidInputError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidInputError);
        }
        this.status = status;
        this.message = '유효하지않은 값을 입력했습니다.';
    }
}

class InvalidValueError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidValueError);
        }
        this.status = status;
        this.message = '유효하지 않는 값입니다.';
    }
}

class InvalidTokenError extends Error {
    status: number;
    constructor(status = statusCode.UNAUTHORIZED, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidTokenError);
        }
        this.status = status;
        this.message = '유효하지 않는 토큰입니다.';
    }
}

class ExpiredTokenError extends Error {
    status: number;
    constructor(status = statusCode.UNAUTHORIZED, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExpiredTokenError);
        }
        this.status = status;
        this.message = '만료된 토큰입니다.';
    }
}

class WrongPasswordError extends Error {
    status: number;
    constructor(status = statusCode.UNAUTHORIZED, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, WrongPasswordError);
        }
        this.status = status;
        this.message = '비밀번호가 잘못되었습니다';
    }
}

class PasswordPolicyError extends Error {
    status: number;
    constructor(status = statusCode.BAD_REQUEST, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PasswordPolicyError);
        }
        this.status = status;
        this.message =
            '사용할 수 없는 패스워드입니다. 패스워드 정책을 확인해주세요.';
    }
}

class UnAuthorizedError extends Error {
    status: number;
    constructor(
        message = '권한이 없습니다.',
        status = statusCode.UNAUTHORIZED,
        ...params: any
    ) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnAuthorizedError);
        }
        this.status = status;
        this.message = message;
    }
}

class InvalidRequestError extends Error {
    status: number;
    constructor(
        key: string,
        type: any,
        value: string,
        status = statusCode.UNAUTHORIZED,
        ...params: any
    ) {
        super(...params);
        this;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, InvalidTokenError);
        }
        this.status = status;
        this.message = `잘못된 요청입니다. ${key} must to be ${type.name} but ${value}`;
    }
}

class UnExpectedError extends Error {
    constructor(expectedError: any, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, PasswordPolicyError);
        }
        this.message = `${expectedError.name}: must be caught or declared to be thrown`;
    }
}

export {
    DatabaseError,
    NoReferencedRowError,
    DuplicatedEntryError,
    NotMatchedError,
    InvalidInputError,
    InvalidTokenError,
    FailedToCreateError,
    ExpiredTokenError,
    WrongPasswordError,
    UnAuthorizedError,
    PasswordPolicyError,
    InvalidRequestError,
    InvalidValueError,
    UnExpectedError,
};
