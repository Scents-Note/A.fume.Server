const { expect } = require('chai');

const TokenGroupDTO = require('../../../src/data/dto/TokenGroupDTO');

TokenGroupDTO.validTest = function () {
    expect(this.userIdx).to.be.ok;
    expect(this.token).to.be.ok;
    expect(this.refreshToken).to.be.ok;
};

TokenGroupDTO.createMock = function (condition) {
    return new TokenGroupDTO(
        Object.assign(
            {
                userIdx: 1,
                token: 'token',
                refreshToken: 'refreshToken',
            },
            condition
        )
    );
};

module.exports = TokenGroupDTO;
