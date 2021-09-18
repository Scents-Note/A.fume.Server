const { expect } = require('chai');

const UserDTO = require('../../../data/dto/UserDTO');
const {
    GENDER_WOMAN,
    GRADE_MANAGER,
    GRADE_USER,
    GRADE_SYSTEM_ADMIN,
} = require('../../../utils/constantUtil');

UserDTO.prototype.validTest = function () {
    expect(this.userIdx).to.be.gt(0);
    expect(this.nickname).to.be.ok;
    expect(this.email).to.be.ok;
    expect(this.password).to.be.ok;
    expect(this.gender).to.be.oneOf([
        GRADE_USER,
        GRADE_MANAGER,
        GRADE_SYSTEM_ADMIN,
    ]);
    expect(this.birth).to.be.ok;
    expect(this.grade).to.be.gte(0);
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

UserDTO.createMock = function (condition) {
    return new UserDTO(
        {
            userIdx: 1,
            nickname: 'user1',
            password: 'test',
            gender: GENDER_WOMAN,
            email: 'email1@afume.com',
            birth: 1995,
            grade: GRADE_MANAGER,
            accessTime: '2021-07-13T11:33:49.000Z',
            createdAt: '2021-07-13T11:33:49.000Z',
            updatedAt: '2021-08-07T09:20:29.000Z',
        },
        condition
    );
};

module.exports = UserDTO;
