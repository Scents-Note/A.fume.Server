'use strict';

class SeriesDTO {
    constructor({
        seriesIdx,
        name,
        englishName,
        description,
        imageUrl,
        createdAt,
        updatedAt,
    }) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = SeriesDTO;
