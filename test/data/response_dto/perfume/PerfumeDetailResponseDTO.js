const { expect } = require('chai');

const PerfumeDetailResponseDTO = require('../../../data/response_dto/perfume/PerfumeDetailResponseDTO');

const volumeAndPriceRegex = '^[0-9,]+/[0-9,]+ml$';

const {
    NOTE_TYPE_SINGLE,
    NOTE_TYPE_NORMAL,
    MIN_SCORE,
    MAX_SCORE,
} = require('../../../../utils/constantUtil');

function expectHasProperties(...properties) {
    properties.forEach((property) => {
        expect(this).to.be.have.property(property);
    });
    expect(Object.entries(this).length).to.be.eq(properties.length);
}

function expectIsPercentage() {
    let sum = 0;
    Object.entries(this).forEach(([key, value]) => {
        expect(value).to.be.within(0, 100);
        sum += value;
    });
    expect(sum).to.be.eq(100);
}

PerfumeDetailResponseDTO.validTest = function () {
    expectHasProperties.call(
        this,
        'perfumeIdx',
        'name',
        'brandName',
        'imageUrls',
        'story',
        'abundanceRate',
        'volumeAndPrice',
        'score',
        'seasonal',
        'sillage',
        'gender',
        'longevity',
        'isLiked',
        'Keywords',
        'noteType',
        'ingredients'
    );

    expect(this.volumeAndPrice).instanceOf(Array);
    this.volumeAndPrice.forEach((item) => {
        expect(item).to.be.match(volumeAndPriceRegex);
    });
    expect(this.imageUrls).instanceOf(Array);

    const {
        score,
        seasonal,
        sillage,
        longevity,
        gender,
        Keywords,
        ingredients,
        noteType,
    } = this;
    expect(score).to.be.within(MIN_SCORE, MAX_SCORE);

    expectHasProperties.call(seasonal, 'spring', 'summer', 'fall', 'winter');
    expectIsPercentage.call(seasonal);

    expectHasProperties.call(sillage, 'light', 'medium', 'heavy');
    expectIsPercentage.call(sillage);

    expectHasProperties.call(
        longevity,
        'veryWeak',
        'weak',
        'normal',
        'strong',
        'veryStrong'
    );
    expectIsPercentage.call(longevity);

    expectHasProperties.call(gender, 'male', 'neutral', 'female');
    expectIsPercentage.call(gender);

    expect(Keywords).instanceOf(Array);
    Keywords.forEach((it) => expect(it).instanceOf(String));

    expect(noteType).to.be.oneOf([NOTE_TYPE_SINGLE, NOTE_TYPE_NORMAL]);

    expectHasProperties.call(ingredients, 'top', 'middle', 'base', 'single');
    const { top, middle, base, single } = ingredients;
    expect(top).to.be.a('string');
    expect(middle).to.be.a('string');
    expect(base).to.be.a('string');
    expect(single).to.be.a('string');
};

module.exports = PerfumeDetailResponseDTO;
