const { expect } = require('chai');

const IngredientDTO = require('../../../data/dto/IngredientDTO');

IngredientDTO.prototype.validTest = function () {
    expect(this.ingredientIdx).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.description).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.seriesIdx).to.be.ok;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
};

module.exports = IngredientDTO;
