const expect = require('../../../utils/expect');

const PerfumeRecommendResponseDTO = require('./PerfumeRecommendResponseDTO');

PerfumeRecommendResponseDTO.validTest = function () {
    expect.hasProperties.call(
        this,
        'perfumeIdx',
        'name',
        'brandName',
        'imageUrl',
        'isLiked',
        'keywordList'
    );
    expect(this.perfumeIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.brandName).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.isLiked).to.be.not.undefined;
    expect(this.keywordList).to.be.instanceOf(Array);
};

module.exports = PerfumeRecommendResponseDTO;
