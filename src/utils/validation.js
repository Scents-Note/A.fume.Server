const { InvalidRequestError } = require('./errors/errors.js');

module.exports.validateType = (obj, key, type, next) => {
    if (obj[key] instanceof type) {
        return true;
    }
    next(new InvalidRequestError(key, type, obj[key]));
    return false;
};
