'use strict';

class PerfumeResponseDTO {
    constructor({ perfumeIdx, name, brandName, imageUrl, isLiked }) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.imageUrl = imageUrl;
        this.isLiked = isLiked;
    }
}

module.exports = PerfumeResponseDTO;
