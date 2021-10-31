'use strict';

class SeriesInputDTO {
    constructor({ seriesIdx, name, englishName, description, imageUrl }) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
    }
}

module.exports = SeriesInputDTO;
