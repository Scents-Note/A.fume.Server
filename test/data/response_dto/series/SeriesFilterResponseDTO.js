const expect = require('../../../utils/expect');

const SeriesFilterResponseDTO = require('../../../data/response_dto/series/SeriesFilterResponseDTO');

const IngredientResponseDTO = require('../ingredient/IngredientResponseDTO');

SeriesFilterResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'seriesIdx', 'name', 'ingredients');
    expect(this.seriesIdx).to.be.ok;
    expect(this.name).to.be.ok;
    this.ingredients.forEach((item) => {
        IngredientResponseDTO.validTest.call(item);
    });
};

module.exports = SeriesFilterResponseDTO;
