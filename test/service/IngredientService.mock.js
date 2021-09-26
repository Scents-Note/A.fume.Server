'use strict';

const IngredientDTO = require('../data/dto/IngredientDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

exports.getIngredientAll = async () => {
    const seriesIdx = 1;
    return new ListAndCountDTO({
        count: 5,
        rows: [1, 2, 3, 4, 5].map((idx) =>
            IngredientDTO.createWithIdx({ ingredientIdx: idx, seriesIdx })
        ),
    });
};

exports.findIngredient = async (ingredientConditionDTO) => {
    return IngredientDTO.create(ingredientConditionDTO);
};

exports.getIngredientList = async (seriesIdx) => {
    return new ListAndCountDTO({
        count: 5,
        rows: [1, 2, 3, 4, 5].map((idx) =>
            IngredientDTO.createWithIdx({ ingredientIdx: idx, seriesIdx })
        ),
    });
};
