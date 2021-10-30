const { expect } = require('chai');

const BrandFilterDTO = require('../../../src/data/dto/BrandFilterDTO');
const BrandDTO = require('./BrandDTO');

const FIRST_INITIAL_REGEX = /^[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅍㅌㅎ]$/;

BrandFilterDTO.validTest = function () {
    expect(this.firstInitial).to.be.match(FIRST_INITIAL_REGEX);
    expect(this.brands).to.be.ok;
    for (const brand of this.brands) {
        expect(brand).instanceOf(BrandDTO);
        BrandDTO.validTest.call(brand);
    }
};

module.exports = BrandFilterDTO;
