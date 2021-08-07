'use strict';

class LoginInfoDTO {
    constructor({ userIdx, nickname, gender, birth, token, refreshToken }) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.gender = gender;
        this.birth = birth;
        this.token = token;
        this.refreshToken = refreshToken;
    }
}

module.exports = LoginInfoDTO;
