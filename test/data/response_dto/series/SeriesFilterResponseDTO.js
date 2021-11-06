const expect = require('../../../utils/expect');

const SeriesFilterResponseDTO = require('../../../data/response_dto/series/SeriesFilterResponseDTO');

SeriesFilterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'seriesIdx', 'name', 'ingredients');
    expect(this.seriesIdx).to.be.ok;
    expect(this.name).to.be.ok;
    this.ingredients.forEach((item) => {
        expect.hasProperties.call(item, 'ingredientIdx', 'name');
    });
};

module.exports = SeriesFilterResponseDTO;
