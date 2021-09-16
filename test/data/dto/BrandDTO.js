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

BrandDTO.create = function (condition) {
    return new BrandDTO(
        Object.assign(
            {
                brandIdx: 1,
                name: '브랜드1',
                englishName: 'BRAND1',
                firstInitial: 'ㅂ',
                imageUrl: 'http://',
                description: '이것은 브랜드',
                createdAt: '2021-07-24T03:38:52.000Z',
                updatedAt: '2021-07-24T03:38:52.000Z',
            },
            condition
        )
    );
};

module.exports = BrandDTO;
