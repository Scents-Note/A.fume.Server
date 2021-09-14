const expect = require('../../../utils/expect');

const PerfumeResponseDTO = require('../../../data/response_dto/perfume/PerfumeResponseDTO');

PerfumeResponseDTO.validTest = function () {
    expect.hasProperties.call(
        this,
        'perfumeIdx',
        'name',
        'brandName',
        'imageUrl',
        'isLiked'
    );
    expect(this.perfumeIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.brandName).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.isLiked).to.be.not.undefined;
};

module.exports = PerfumeResponseDTO;
