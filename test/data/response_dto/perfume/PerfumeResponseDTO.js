const { expect } = require('chai');

const PerfumeResponseDTO = require('../../../data/response_dto/perfume/PerfumeResponseDTO');

PerfumeResponseDTO.validTest = function () {
    expect(this.perfumeIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.brandName).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.isLiked).to.be.not.undefined;
    expect(Object.entries(this).length).to.be.eq(5);
};

module.exports = PerfumeResponseDTO;
