'use strict';

class UserAuthResponseDTO {
    constructor({ isAuth, isAdmin }) {
        this.isAuth = isAuth;
        this.isAdmin = isAdmin;
    }
}

module.exports = UserAuthResponseDTO;
