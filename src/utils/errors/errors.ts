import StatusCode from '../statusCode';
import {
    MSG_WRONG_FOREIGN_KEY,
    INTERNAL_DB_ERROR,
    MSG_NOT_MATCHED_DATA,
    MSG_EXIST_DUPLICATE_ENTRY,
    MSG_OCCUR_ERROR_DURING_CREATING_DATA,
    MSG_ENTER_INVALID_INPUT,
    MSG_INVALID_VALUE,
    MSG_INVALID_TOKEN,
    MSG_EXPIRED_TOKEN,
    MSG_WRONG_PASSWORD,
    MSG_CANT_USE_PASSWORD_BY_POLICY,
    NO_AUTHORIZE,
} from '../strings';

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
        message: string = INTERNAL_DB_ERROR
    ) {
        super(status, message);
    }
}

class NoReferencedRowError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_WRONG_FOREIGN_KEY
    ) {
        super(status, message);
    }
}

class DuplicatedEntryError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_EXIST_DUPLICATE_ENTRY
    ) {
        super(status, message);
    }
}

class NotMatchedError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_NOT_MATCHED_DATA
    ) {
        super(status, message);
    }
}

class FailedToCreateError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_OCCUR_ERROR_DURING_CREATING_DATA
    ) {
        super(status, message);
    }
}

class InvalidInputError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_ENTER_INVALID_INPUT
    ) {
        super(status, message);
    }
}

class InvalidValueError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_INVALID_VALUE
    ) {
        super(status, message);
    }
}

class InvalidTokenError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = MSG_INVALID_TOKEN
    ) {
        super(status, message);
    }
}

class ExpiredTokenError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = MSG_EXPIRED_TOKEN
    ) {
        super(status, message);
    }
}

class WrongPasswordError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = MSG_WRONG_PASSWORD
    ) {
        super(status, message);
    }
}

class PasswordPolicyError extends HttpError {
    constructor(
        status: number = StatusCode.BAD_REQUEST,
        message: string = MSG_CANT_USE_PASSWORD_BY_POLICY
    ) {
        super(status, message);
    }
}

class UnAuthorizedError extends HttpError {
    constructor(
        status: number = StatusCode.UNAUTHORIZED,
        message: string = NO_AUTHORIZE
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
