'use strict';

class UserInputRequestDTO {
    constructor({ nickname, password, gender, email, birth, grade }) {
        this.nickname = nickname;
        this.password = password;
        this.gender = gender;
        this.email = email;
        this.birth = birth;
        this.grade = grade;
    }
}

module.exports = UserInputRequestDTO;
