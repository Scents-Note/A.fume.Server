'use strict';

class UserResponseDTO {
    constructor({ userIdx, nickname, gender, email, birth }) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
    }
}

module.exports = UserResponseDTO;
