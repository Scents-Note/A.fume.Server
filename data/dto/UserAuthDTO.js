'use strict';

const { GRADE_MANAGER } = require('../../../utils/constantUtil');

class UserAuthDTO {
    constructor({ isAuth, isAdmin }) {
        this.isAuth = isAuth;
        this.isAdmin = isAdmin;
    }

    static create(user) {
        return new UserAuthDTO({
            isAuth: true,
            isAdmin: user.grade >= GRADE_MANAGER,
        });
    }
}

module.exports = UserAuthDTO;
