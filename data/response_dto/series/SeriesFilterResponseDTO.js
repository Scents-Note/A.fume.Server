'use strict';

const SeriesResponseDTO = require('./SeriesResponseDTO');

class SeriesFilterResponseDTO extends SeriesResponseDTO {
    constructor(json) {
        super(json);
        this.ingredients = json.ingredients;
    }
}

module.exports = SeriesFilterResponseDTO;
