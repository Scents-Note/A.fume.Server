'use strict';

class IngredientConditionDTO {
    constructor({
        ingredientIdx,
        name,
        englishName,
        description,
        imageUrl,
        seriesIdx,
    }) {
        if (ingredientIdx) {
            this.ingredientIdx = ingredientIdx;
        }
        if (name) {
            this.name = name;
        }
        if (englishName) {
            this.englishName = englishName;
        }
        if (description) {
            this.description = description;
        }
        if (imageUrl) {
            this.imageUrl = imageUrl;
        }
        if (seriesIdx) {
            this.seriesIdx = seriesIdx;
        }
    }
}

module.exports = IngredientConditionDTO;
