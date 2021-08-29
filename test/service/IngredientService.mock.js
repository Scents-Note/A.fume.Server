'use strict';

const ingredientDao = Object.assign(
    {},
    require('../dao/IngredientDao.mock.js')
);

exports.getIngredientAll = () => {
    return ingredientDao.readAll();
};

exports.findIngredient = (ingredientConditionDTO) => {
    return ingredientDao.findIngredient(ingredientConditionDTO);
};

exports.getIngredientList = (seriesIdx) => {
    return ingredientDao.readAll({ seriesIdx });
};
