const { expect } = require('chai');

const BrandDTO = require('../../../data/dto/BrandDTO');

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

BrandDTO.prototype.validTest = function () {
    expect(this.brandIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.firstInitial).to.be.oneOf(FIRST_INITIAL);
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

module.exports = BrandDTO;
