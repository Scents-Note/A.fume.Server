'use strict';

const SeriesDTO = require('../dto/SeriesDTO');

const { SeriesFilterResponseDTO } = require('../response_dto/series');
const { IngredientResponseDTO } = require('../response_dto/ingredient');

class SeriesFilterVO extends SeriesDTO {
    constructor({ series, ingredients }) {
        super(series);
        this.ingredients = ingredients;
    }
}

module.exports = SeriesFilterVO;
