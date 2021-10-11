const { expect } = require('chai');

const LoginInfoDTO = require('../../../data/dto/LoginInfoDTO');

const { GENDER_WOMAN } = require('../../../utils/constantUtil');

LoginInfoDTO.validTest = function () {
    expect(this.userIdx).to.be.ok;
    expect(this.nickname).to.be.ok;
    expect(this.gender).to.be.ok;
    expect(this.birth).to.be.ok;
    expect(this.email).to.be.ok;
    expect(this.token).to.be.ok;
    expect(this.refreshToken).to.be.ok;
};

LoginInfoDTO.createMock = function (condition) {
    return new LoginInfoDTO(
        Object.assign(
            {
                userIdx: 1,
                nickname: 'user1',
                gender: GENDER_WOMAN,
                email: 'email@a.fume.com',
                birth: 1995,
                token: 'token',
                refreshToken: 'refreshToken',
            },
            condition
        )
    );
};

module.exports = LoginInfoDTO;
