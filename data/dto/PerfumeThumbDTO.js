'use strict';

class PerfumeThumbDTO {
    constructor({ perfumeIdx, name, brandName, isLiked, imageUrl }) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.isLiked = isLiked;
        this.imageUrl = imageUrl;
    }
}

module.exports = PerfumeThumbDTO;
