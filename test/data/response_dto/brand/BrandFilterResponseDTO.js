const { expect } = require('chai');

const BrandFilterResponseDTO = require('../../../../data/response_dto/brand/BrandFilterResponseDTO');

BrandFilterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'firstInitial', 'brands');
    this.brands.forEach((brand) => {
        expect.hasProperties.call(brand, 'brandIdx', 'name');
    });
};

module.exports = BrandFilterResponseDTO;
