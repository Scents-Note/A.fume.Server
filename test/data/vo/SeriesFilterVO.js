const { expect } = require('chai');

const SeriesFilterVO = require('../../../data/vo/SeriesFilterVO');
const IngredientDTO = require('../dto/IngredientDTO');

SeriesFilterVO.prototype.validTest = function () {
    expect(this.seriesIdx).to.be.ok;
    expect(this.englishName).to.be.ok;
    expect(this.name).to.be.ok;
    expect(this.imageUrl).to.be.ok;
    expect(this.description).to.be.not.undefined;
    expect(this.createdAt).to.be.ok;
    expect(this.updatedAt).to.be.ok;
    for (const ingredient of this.ingredients) {
        expect(ingredient).instanceOf(IngredientDTO);
        IngredientDTO.validTest.call(ingredient);
    }
};

module.exports = SeriesFilterVO;
