'use strict';

const LoginResponseDTO = require('../../../../data/response_dto/user/LoginResponseDTO');
const expect = require('../../../utils/expect');

LoginResponseDTO.validTest = function () {
    expect.hasProperties.call(
        this,
        'userIdx',
        'nickname',
        'gender',
        'email',
        'birth',
        'token',
        'refreshToken'
    );
};

module.exports = LoginResponseDTO;
