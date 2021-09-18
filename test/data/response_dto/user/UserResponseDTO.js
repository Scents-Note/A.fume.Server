const expect = require('../../../utils/expect');

const UserResponseDTO = require('../../../data/response_dto/user/UserResponseDTO');

UserResponseDTO.validTest = function () {
    expect.hasProperties.call(
        this,
        'userIdx',
        'nickname',
        'gender',
        'email',
        'birth'
    );
};

module.exports = UserResponseDTO;
