const { expect } = require('chai');

const UserDTO = require('../../../data/dto/UserDTO');

UserDTO.prototype.validTest = function () {
    expect(this.userIdx).to.be.gt(0);
    expect(this.nickname).to.be.ok;
    expect(this.email).to.be.ok;
    expect(this.password).to.be.ok;
    expect(this.gender).to.be.within(1, 2);
    expect(this.birth).to.be.ok;
    expect(this.grade).to.be.gte(0);
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

module.exports = UserDTO;
