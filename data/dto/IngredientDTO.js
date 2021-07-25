'use strict';

class IngredientDTO {
    constructor({
        ingredientIdx,
        name,
        englishName,
        description,
        imageUrl,
        seriesIdx,
        createdAt,
        updatedAt,
    }) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.seriesIdx = seriesIdx;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = IngredientDTO;
