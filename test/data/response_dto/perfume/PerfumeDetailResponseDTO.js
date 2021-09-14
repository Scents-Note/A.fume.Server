const { expect } = require('chai');

const PerfumeDetailResponseDTO = require('../../../data/response_dto/perfume/PerfumeDetailResponseDTO');

const volumeAndPriceRegex = '^[0-9,]+/[0-9,]+ml$';

function expectProperties(...properties) {
    properties.forEach((property) => {
        expect(this).to.be.have.property(property);
    });
    expect(Object.entries(this).length).to.be.eq(properties.length);
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
    expect(score).to.be.within(0, 10);

    expectProperties.call(seasonal, 'spring', 'summer', 'fall', 'winter');
    const { spring, summer, fall, winter } = seasonal;
    expect(spring).to.be.within(0, 100);
    expect(summer).to.be.within(0, 100);
    expect(fall).to.be.within(0, 100);
    expect(winter).to.be.within(0, 100);
    expect(spring + summer + fall + winter).to.be.eq(100);

    expectProperties.call(sillage, 'light', 'medium', 'heavy');
    const { light, medium, heavy } = sillage;
    expect(light).to.be.within(0, 100);
    expect(medium).to.be.within(0, 100);
    expect(heavy).to.be.within(0, 100);
    expect(light + medium + heavy).to.be.eq(100);

    expectProperties.call(
        longevity,
        'veryWeak',
        'weak',
        'normal',
        'strong',
        'veryStrong'
    );
    const { veryWeak, weak, normal, strong, veryStrong } = longevity;
    expect(veryWeak).to.be.within(0, 100);
    expect(weak).to.be.within(0, 100);
    expect(normal).to.be.within(0, 100);
    expect(strong).to.be.within(0, 100);
    expect(veryStrong).to.be.within(0, 100);
    expect(veryWeak + weak + normal + strong + veryStrong).to.be.eq(100);

    expectProperties.call(gender, 'male', 'neutral', 'female');
    const { male, neutral, female } = gender;
    expect(male).to.be.within(0, 100);
    expect(neutral).to.be.within(0, 100);
    expect(female).to.be.within(0, 100);
    expect(male + neutral + female).to.be.eq(100);

    expect(Keywords).instanceOf(Array);
    Keywords.forEach((it) => expect(it).instanceOf(String));

    expect(noteType).to.be.within(0, 1);

    expectProperties.call(ingredients, 'top', 'middle', 'base', 'single');
    const { top, middle, base, single } = ingredients;
    expect(top).to.be.a('string');
    expect(middle).to.be.a('string');
    expect(base).to.be.a('string');
    expect(single).to.be.a('string');
};

module.exports = PerfumeDetailResponseDTO;
