const { expect } = require('chai');

const IngredientDTO = require('../../../data/dto/IngredientDTO');

IngredientDTO.prototype.validTest = function () {
    expect(this.ingredientIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.seriesIdx).to.be.ok;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

IngredientDTO.createWithIdx = function ({ ingredientIdx, seriesIdx }) {
    return new IngredientDTO({
        ingredientIdx,
        name: `재료${ingredientIdx}`,
        englishName: `Ingredient ${ingredientIdx}`,
        description: `이것은 재료 ${ingredientIdx}`,
        imageUrl: 'http://',
        seriesIdx,
        createdAt: '2021-07-24T03:38:52.000Z',
        updatedAt: '2021-07-24T03:38:52.000Z',
    });
};

module.exports = IngredientDTO;
