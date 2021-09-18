const { expect } = require('chai');

const SeriesFilterDTO = require('../../../data/dto/SeriesFilterDTO');
const IngredientDTO = require('./IngredientDTO');
const SeriesDTO = require('./SeriesDTO');

SeriesFilterDTO.prototype.validTest = function () {
    expect(this.seriesIdx).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
    for (const ingredient of this.ingredients) {
        expect(ingredient).instanceOf(IngredientDTO);
        ingredient.validTest();
    }
};

SeriesFilterDTO.createWithIdx = function ({ seriesIdx, ingredientIdxList }) {
    return new SeriesFilterDTO({
        series: SeriesDTO.createWithIdx(seriesIdx),
        ingredients: ingredientIdxList.map((ingredientIdx) => {
            return IngredientDTO.createWithIdx({ seriesIdx, ingredientIdx });
        }),
    });
};

module.exports = SeriesFilterDTO;
