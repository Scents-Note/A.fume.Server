'use strict';

class SeriesFilterResponseDTO {
    constructor({ seriesIdx, name, ingredients }) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.ingredients = ingredients;
    }
}

module.exports = SeriesFilterResponseDTO;
