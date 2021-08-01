'use strict';

const SeriesDTO = require('../dto/SeriesDTO');

const { SeriesFilterResponseDTO } = require('../response_dto/series');
const { IngredientResponseDTO } = require('../response_dto/ingredient');

class SeriesFilterVO extends SeriesDTO {
    constructor({ series, ingredients }) {
        super(series);
        this.ingredients = ingredients;
    }

    /**
     *
     * @returns SeriesFilterResponseDTO
     */
    toResponse() {
        return new SeriesFilterResponseDTO({
            seriesIdx: this.seriesIdx,
            name: this.name,
            ingredients: this.ingredients.map(
                (it) => new IngredientResponseDTO(it)
            ),
        });
    }
}

module.exports = SeriesFilterVO;
