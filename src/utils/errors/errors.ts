import StatusCode from '../statusCode';

class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}
class DatabaseError extends HttpError {
    constructor(
        status: number = StatusCode.DB_ERROR,
        message: string = '디비 내부 오류'
    ) {
        super(status, message);
    }
}

class NoReferencedRowError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '잘못된 외래키입니다.'
    ) {
        super(status, message);
    }
}

class DuplicatedEntryError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '중복되는 값이 이미 존재합니다'
    ) {
        super(status, message);
    }
}

class NotMatchedError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '해당 조건에 일치하는 데이터가 없습니다.'
    ) {
        super(status, message);
    }
}

class FailedToCreateError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '해당 데이터를 생성하는 중에 오류가 발생헀습니다.'
    ) {
        super(status, message);
    }
}

class InvalidInputError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '유효하지않은 값을 입력했습니다.'
    ) {
        super(status, message);
    }
}

class InvalidValueError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '유효하지 않는 값입니다.'
    ) {
        super(status, message);
    }
}

class InvalidTokenError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = '유효하지 않는 토큰입니다.'
    ) {
        super(status, message);
    }
}

class ExpiredTokenError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = '만료된 토큰입니다.'
    ) {
        super(status, message);
    }
}

class WrongPasswordError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = '비밀번호가 잘못되었습니다'
    ) {
        super(status, message);
    }
}

class PasswordPolicyError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = '사용할 수 없는 패스워드입니다. 패스워드 정책을 확인해주세요.'
    ) {
        super(status, message);
    }
}

class UnAuthorizedError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = '권한이 없습니다.'
    ) {
        super(status, message);
    }
}

class InvalidRequestError extends HttpError {
    constructor(
        key: string,
        type: any,
        value: string,
        status = StatusCode.UNAUTHORIZED
    ) {
        super(
            status,
            `잘못된 요청입니다. ${key} must to be ${type.name} but ${value}`
        );
    }
}

class UnExpectedError extends Error {
    constructor(expectedError: any, ...params: any) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnExpectedError);
        }
        this.message = `${expectedError.name}: must be caught or declared to be thrown`;
    }
}

export {
    HttpError,
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
