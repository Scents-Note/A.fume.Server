'use strict';

const {
    GENDER_MAN,
    GENDER_WOMAN,
    GRADE_USER,
    GRADE_MANAGER,
    GRADE_SYSTEM_ADMIN,
} = require('../../utils/constantUtil');

const genderMap = {
    MAN: GENDER_MAN,
    WOMAN: GENDER_WOMAN,
};

const gradeMap = {
    USER: GRADE_USER,
    MANAGER: GRADE_MANAGER,
    SYSTEM_ADMIN: GRADE_SYSTEM_ADMIN,
};

class UserEditRequestDTO {
    constructor({ userIdx, nickname, password, gender, email, birth, grade }) {
        this.userIdx = userIdx;
        this.grade = gradeMap[grade] || GRADE_USER;
        this.gender = genderMap[gender];
        this.nickname = nickname;
        this.password = password;
        this.email = email;
        this.birth = birth;
    }
}

module.exports = UserEditRequestDTO;
