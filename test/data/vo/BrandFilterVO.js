const { expect } = require('chai');

const BrandFilterVO = require('../../../data/vo/BrandFilterVO');
const BrandDTO = require('../dto/BrandDTO');

const FIRST_INITIAL = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅍ',
    'ㅌ',
    'ㅎ',
];

BrandFilterVO.prototype.validTest = function () {
    expect(this.firstInitial).to.be.oneOf(FIRST_INITIAL);
    for (const brand of this.brands) {
        expect(brand).instanceOf(BrandDTO);
        brand.validTest();
    }
};

module.exports = BrandFilterVO;
