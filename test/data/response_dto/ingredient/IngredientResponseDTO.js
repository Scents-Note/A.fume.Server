'use strict';
const expect = require('../../../utils/expect');

const IngredientResponseDTO = require('../../../data/response_dto/ingredient/IngredientResponseDTO');

IngredientResponseDTO.validTest = function () {
    expect.hasProperties.call(this, 'ingredientIdx', 'name');
    expect(this.ingredientIdx).to.be.ok;
    expect(this.name).to.be.ok;
};

module.exports = IngredientResponseDTO;
