import BrandResponseHelper from './BrandResponseHelper';

const { expect } = require('chai');

const BrandFilterResponseDTO = require('../../../../src/data/response_dto/brand/BrandFilterResponseDTO');

BrandFilterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'firstInitial', 'brands');
    this.brands.forEach((brand) => {
        BrandResponseHelper.validTest.call(brand);
    });
};

module.exports = BrandFilterResponseDTO;
