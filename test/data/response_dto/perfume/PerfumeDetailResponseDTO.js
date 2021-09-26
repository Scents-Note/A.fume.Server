const expect = require('../../../utils/expect');

const PerfumeDetailResponseDTO = require('../../../data/response_dto/perfume/PerfumeDetailResponseDTO');

const volumeAndPriceRegex = '^[0-9,]+/[0-9,]+ml$';

const {
    PERFUME_NOTE_TYPE_SINGLE,
    PERFUME_NOTE_TYPE_NORMAL,
    MIN_SCORE,
    MAX_SCORE,
} = require('../../../../utils/constantUtil');

PerfumeDetailResponseDTO.validTest = function () {
    expect.hasProperties.call(
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

    expect.hasProperties.call(seasonal, 'spring', 'summer', 'fall', 'winter');
    expect.isPercentage.call(seasonal);

    expect.hasProperties.call(sillage, 'light', 'medium', 'heavy');
    expect.isPercentage.call(sillage);

    expect.hasProperties.call(
        longevity,
        'veryWeak',
        'weak',
        'normal',
        'strong',
        'veryStrong'
    );
    expect.isPercentage.call(longevity);

    expect.hasProperties.call(gender, 'male', 'neutral', 'female');
    expect.isPercentage.call(gender);

    expect(Keywords).instanceOf(Array);
    Keywords.forEach((it) => expect(it).to.be.a('string'));

    expect(noteType).to.be.oneOf([
        PERFUME_NOTE_TYPE_SINGLE,
        PERFUME_NOTE_TYPE_NORMAL,
    ]);

    expect.hasProperties.call(ingredients, 'top', 'middle', 'base', 'single');
    const { top, middle, base, single } = ingredients;
    expect(top).to.be.a('string');
    expect(middle).to.be.a('string');
    expect(base).to.be.a('string');
    expect(single).to.be.a('string');
};

module.exports = PerfumeDetailResponseDTO;
