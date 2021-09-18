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

module.exports = UserDTO;
