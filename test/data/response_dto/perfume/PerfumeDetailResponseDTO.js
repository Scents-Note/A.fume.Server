const { expect } = require('chai');

const PerfumeDetailResponseDTO = require('../../../data/response_dto/perfume/PerfumeDetailResponseDTO');

const volumeAndPriceRegex = '^[0-9,]+/[0-9,]+ml$';

function expectProperties(...properties) {
    properties.forEach((property) => {
        expect(this).to.be.have.property(property);
    });
    expect(Object.entries(this).length).to.be.eq(properties.length);
}

const {
    NOTE_TYPE_SINGLE,
    NOTE_TYPE_NORMAL,
    MIN_SCORE,
    MAX_SCORE,
} = require('../../../../utils/constantUtil');

function expectIsPercentage() {
    let sum = 0;
    Object.entries(this).forEach(([key, value]) => {
        expect(value).to.be.within(0, 100);
        sum += value;
    });
    expect(sum).to.be.eq(100);
}

PerfumeDetailResponseDTO.validTest = function () {
    expectProperties.call(
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
    for (const item of this.volumeAndPrice) {
        expect(item).to.be.match(volumeAndPriceRegex);
    }
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

    expectProperties.call(seasonal, 'spring', 'summer', 'fall', 'winter');
    expectIsPercentage.call(seasonal);

    expectProperties.call(sillage, 'light', 'medium', 'heavy');
    expectIsPercentage.call(sillage);

    expectProperties.call(
        longevity,
        'veryWeak',
        'weak',
        'normal',
        'strong',
        'veryStrong'
    );
    expectIsPercentage.call(longevity);

    expectProperties.call(gender, 'male', 'neutral', 'female');
    expectIsPercentage.call(gender);

    expect(Keywords).instanceOf(Array);
    Keywords.forEach((it) => expect(it).instanceOf(String));

    expect(noteType).to.be.oneOf([NOTE_TYPE_SINGLE, NOTE_TYPE_NORMAL]);

    expectProperties.call(ingredients, 'top', 'middle', 'base', 'single');
    const { top, middle, base, single } = ingredients;
    expect(top).to.be.a('string');
    expect(middle).to.be.a('string');
    expect(base).to.be.a('string');
    expect(single).to.be.a('string');
};

module.exports = PerfumeDetailResponseDTO;
