'use strict';

class IngredientResponseDTO {
    constructor({ ingredientIdx, name }) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
    }
}

module.exports = IngredientResponseDTO;
