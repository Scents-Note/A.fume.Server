'use strict';

class SeriesDetailResponseDTO {
    constructor({ seriesIdx, name, imageUrl, description }) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

module.exports = SeriesDetailResponseDTO;
