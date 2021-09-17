const expect = require('../../../utils/expect');

const UserRegisterResponseDTO = require('../../../data/response_dto/user/UserRegisterResponseDTO');

UserRegisterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'userIdx', 'token', 'refreshToken');
};

module.exports = UserRegisterResponseDTO;
