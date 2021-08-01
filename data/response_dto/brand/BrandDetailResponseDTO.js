'use strict';

class BrandDetailResponseDTO {
    constructor({ brandIdx, name, firstInitial, imageUrl, description }) {
        this.brandIdx = brandIdx;
        this.name = name;
        this.firstInitial = firstInitial;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

module.exports = BrandDetailResponseDTO;
