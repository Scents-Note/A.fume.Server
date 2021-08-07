'use strict';

class TokenPayloadDTO {
    constructor({ userIdx, nickname, gender, email, phone, birth }) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.birth = birth;
    }
}

module.exports = TokenPayloadDTO;
