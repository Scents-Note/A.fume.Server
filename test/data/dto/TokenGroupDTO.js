const { expect } = require('chai');

const TokenGroupDTO = require('../../../data/dto/TokenGroupDTO');

TokenGroupDTO.prototype.validTest = function () {
    expect(this.userIdx).to.be.ok;
    expect(this.token).to.be.ok;
    expect(this.refreshToken).to.be.ok;
};

module.exports = TokenGroupDTO;
