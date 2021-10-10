'use strict';

class UserRegisterResponseDTO {
    constructor({ userIdx, token, refreshToken }) {
        this.userIdx = userIdx;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

module.exports = UserRegisterResponseDTO;
