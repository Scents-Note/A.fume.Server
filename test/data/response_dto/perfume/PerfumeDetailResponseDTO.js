const { expect } = require('chai');

const PerfumeDetailResponseDTO = require('../../../data/response_dto/perfume/PerfumeDetailResponseDTO');

PerfumeDetailResponseDTO.validTest = function () {
    const properties = [
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
        'ingredients',
    ];
    properties.forEach((it) => expect(this).to.be.have.property(it));
    expect(Object.entries(this).length).to.be.eq(properties.length);

    expect(this.volumeAndPrice).instanceOf(Array);
    for (const item of this.volumeAndPrice) {
        expect(item).to.be.match('^[0-9,]+/[0-9,]+ml$');
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

    expect(seasonal).to.be.have.property('spring');
    expect(seasonal).to.be.have.property('summer');
    expect(seasonal).to.be.have.property('fall');
    expect(seasonal).to.be.have.property('winter');
    expect(Object.entries(seasonal).length).to.be.eq(4);
    const { spring, summer, fall, winter } = seasonal;
    expect(spring).to.be.within(0, 100);
    expect(summer).to.be.within(0, 100);
    expect(fall).to.be.within(0, 100);
    expect(winter).to.be.within(0, 100);
    expect(spring + summer + fall + winter).to.be.eq(100);

    expect(sillage).to.be.have.property('light');
    expect(sillage).to.be.have.property('medium');
    expect(sillage).to.be.have.property('heavy');
    expect(Object.entries(sillage).length).to.be.eq(3);
    const { light, medium, heavy } = sillage;
    expect(light).to.be.within(0, 100);
    expect(medium).to.be.within(0, 100);
    expect(heavy).to.be.within(0, 100);
    expect(light + medium + heavy).to.be.eq(100);

    expect(longevity).to.be.have.property('veryWeak');
    expect(longevity).to.be.have.property('weak');
    expect(longevity).to.be.have.property('normal');
    expect(longevity).to.be.have.property('strong');
    expect(longevity).to.be.have.property('veryStrong');
    expect(Object.entries(longevity).length).to.be.eq(5);
    const { veryWeak, weak, normal, strong, veryStrong } = longevity;
    expect(veryWeak).to.be.within(0, 100);
    expect(weak).to.be.within(0, 100);
    expect(normal).to.be.within(0, 100);
    expect(strong).to.be.within(0, 100);
    expect(veryStrong).to.be.within(0, 100);
    expect(veryWeak + weak + normal + strong + veryStrong).to.be.eq(100);

    expect(gender).to.be.have.property('male');
    expect(gender).to.be.have.property('neutral');
    expect(gender).to.be.have.property('female');
    expect(Object.entries(gender).length).to.be.eq(3);
    const { male, neutral, female } = gender;
    expect(male).to.be.within(0, 100);
    expect(neutral).to.be.within(0, 100);
    expect(female).to.be.within(0, 100);
    expect(male + neutral + female).to.be.eq(100);

    expect(Keywords).instanceOf(Array);
    Keywords.forEach((it) => expect(it).instanceOf(String));

    expect(noteType).to.be.within(0, 1);

    expect(ingredients).to.be.have.property('top');
    expect(ingredients).to.be.have.property('middle');
    expect(ingredients).to.be.have.property('base');
    expect(ingredients).to.be.have.property('single');
    expect(Object.entries(ingredients).length).to.be.eq(4);
    const { top, middle, base, single } = ingredients;
    expect(top).to.be.a('string');
    expect(middle).to.be.a('string');
    expect(base).to.be.a('string');
    expect(single).to.be.a('string');
};

module.exports = PerfumeDetailResponseDTO;
