import IngredientDTO from '../../../src/data/dto/IngredientDTO';
import IngredientMockHelper from './IngredientMockHelper';

const { expect } = require('chai');

const SeriesFilterDTO = require('../../../src/data/dto/SeriesFilterDTO');
const SeriesDTO = require('./SeriesDTO');

SeriesFilterDTO.validTest = function () {
    expect(this.seriesIdx).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
    for (const ingredient of this.ingredients) {
        expect(ingredient).instanceOf(IngredientDTO);
        IngredientMockHelper.validTest.call(ingredient);
    }
};

SeriesFilterDTO.createWithIdx = function ({ seriesIdx, ingredientIdxList }) {
    return new SeriesFilterDTO({
        series: SeriesDTO.createWithIdx(seriesIdx),
        ingredients: ingredientIdxList.map((ingredientIdx) =>
            IngredientMockHelper.createWithIdx(ingredientIdx, seriesIdx)
        ),
    });
};

module.exports = SeriesFilterDTO;
