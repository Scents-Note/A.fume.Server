'use strict';

const SeriesDTO = require('./SeriesDTO');

class SeriesFilterDTO extends SeriesDTO {
    constructor({ series, ingredients }) {
        super(series);
        this.ingredients = ingredients;
    }
}

module.exports = SeriesFilterDTO;
