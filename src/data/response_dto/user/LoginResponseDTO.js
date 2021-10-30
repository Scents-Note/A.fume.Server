'use strict';

class LoginResponseDTO {
    constructor({
        userIdx,
        nickname,
        gender,
        email,
        birth,
        token,
        refreshToken,
    }) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

module.exports = LoginResponseDTO;
