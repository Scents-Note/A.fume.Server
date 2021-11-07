import { InvalidRequestError } from './errors/errors';

module.exports.validateType = (obj, key, type, next) => {
    if (obj[key] instanceof type) {
        return true;
    }
    next(new InvalidRequestError(key, type, obj[key]));
    return false;
};
