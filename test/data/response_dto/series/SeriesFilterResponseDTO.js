const expect = require('../../../utils/expect');

const SeriesFilterResponseDTO = require('../../../data/response_dto/series/SeriesResponseDTO');

SeriesFilterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'seriesIdx', 'name', 'ingredients');
};

module.exports = SeriesFilterResponseDTO;
