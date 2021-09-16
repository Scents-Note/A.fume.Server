const { expect } = require('chai');

const BrandFilterResponseDTO = require('../../../../data/response_dto/brand/BrandFilterResponseDTO');
const BrandResponseDTO = require('./BrandResponseDTO');

BrandFilterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'firstInitial', 'brands');
    this.brands.forEach((brand) => {
        BrandResponseDTO.validTest.call(brand);
    });
};

module.exports = BrandFilterResponseDTO;
