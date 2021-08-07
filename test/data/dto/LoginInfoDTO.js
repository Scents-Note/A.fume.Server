const { expect } = require('chai');

const LoginInfoDTO = require('../../../data/dto/LoginInfoDTO');

LoginInfoDTO.prototype.validTest = function () {
    expect(this.userIdx).to.be.ok;
    expect(this.nickname).to.be.ok;
    expect(this.gender).to.be.ok;
    expect(this.birth).to.be.ok;
    expect(this.token).to.be.ok;
    expect(this.refreshToken).to.be.ok;
};

module.exports = LoginInfoDTO;
