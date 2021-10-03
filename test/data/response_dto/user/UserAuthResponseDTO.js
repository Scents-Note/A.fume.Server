'use strict';
const expect = require('../../../utils/expect');

const UserAuthResponseDTO = require('../../../data/response_dto/user/UserAuthResponseDTO');

UserAuthResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'isAuth', 'isAdmin');
};

module.exports = UserAuthResponseDTO;
