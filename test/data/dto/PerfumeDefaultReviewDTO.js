'use strict';
const expect = require('../../utils/expect');

const PerfumeDefaultReviewDTO = require('../../../src/data/dto/PerfumeDefaultReviewDTO');

function isNumber() {
    expect(this).to.be.a('number');
    expect(this).to.be.gte(0);
}

PerfumeDefaultReviewDTO.validTest = function () {
    expect(this.perfumeIdx).to.be.ok;
    expect(this.rating).to.be.within(0, 5);
    expect(this.seasonal).to.be.ok;
    expect.hasProperties.call(
        this.seasonal,
        'spring',
        'summer',
        'fall',
        'winter'
    );
    expect.propertyTest.call(this.seasonal, isNumber);
    expect(this.longevity).to.be.ok;
    expect.hasProperties.call(
        this.longevity,
        'veryWeak',
        'weak',
        'normal',
        'strong',
        'veryStrong'
    );
    expect.propertyTest.call(this.longevity, isNumber);
    expect(this.gender).to.be.ok;
    expect.hasProperties.call(this.gender, 'male', 'neutral', 'female');
    expect.propertyTest.call(this.longevity, isNumber);
    expect(this.sillage).to.be.ok;
    expect.hasProperties.call(this.sillage, 'light', 'medium', 'heavy');
    expect.propertyTest.call(this.sillage, isNumber);

    expect(this.keywordList).instanceOf(Array);
    this.keywordList.forEach((it) => {
        expect.hasProperties.call(it, 'id', 'name');
    });
};

module.exports = PerfumeDefaultReviewDTO;
