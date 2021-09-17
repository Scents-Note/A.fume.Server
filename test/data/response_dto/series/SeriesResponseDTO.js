const expect = require('../../../utils/expect');

const SeriesResponseDTO = require('../../../data/response_dto/series/SeriesResponseDTO');

SeriesResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'seriesIdx', 'name');
    expect(this.seriesIdx).to.be.ok;
    expect(this.name).to.be.ok;
};

module.exports = SeriesResponseDTO;
