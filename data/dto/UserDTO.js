'use strict';

class UserDTO {
    constructor({
        userIdx,
        nickname,
        password,
        gender,
        email,
        birth,
        grade,
        accessTime,
        createdAt,
        updatedAt,
    }) {
        this.userIdx = userIdx;
        this.nickname = nickname;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.grade = grade;
        this.accessTime = accessTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = UserDTO;
