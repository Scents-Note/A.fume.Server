'use strict';

class UserAuthDTO {
    constructor({ isAuth, isAdmin }) {
        this.isAuth = isAuth;
        this.isAdmin = isAdmin;
    }

    static create(user) {
        return new UserAuthDTO({
            isAuth: true,
            isAdmin: user.grade >= 1,
        });
    }
}

module.exports = UserAuthDTO;
