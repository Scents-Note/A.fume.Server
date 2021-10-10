'use strict';

const PerfumeResponseDTO = require('./PerfumeResponseDTO');

class PerfumeRecommendResponseDTO extends PerfumeResponseDTO {
    constructor({
        perfumeIdx,
        name,
        brandName,
        imageUrl,
        isLiked,
        keywordList,
    }) {
        super({ perfumeIdx, name, brandName, imageUrl, isLiked });
        this.keywordList = keywordList;
    }
}

module.exports = PerfumeRecommendResponseDTO;
