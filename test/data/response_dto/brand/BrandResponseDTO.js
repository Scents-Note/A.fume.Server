const { expect } = require('chai');

const BrandResponseDTO = require('../../../../data/response_dto/brand/BrandResponseDTO');

BrandResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'brandIdx', 'name');
};

module.exports = BrandResponseDTO;
