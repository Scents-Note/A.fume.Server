const statusCode = require('../util/statusCode.js');

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
    constructor(code = 'GENERIC', status = statusCode.DB_ERROR, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotMatchedError);
        }
        this.code = code;
        this.status = status;
        this.message = '해당 조건에 일치하는 데이터가 없습니다.';
    }
}

module.exports.DatabaseError = DatabaseError;
module.exports.NoReferencedRowError = NoReferencedRowError;
module.exports.DuplicatedEntryError = DuplicatedEntryError;
module.exports.NotMatchedError = NotMatchedError;