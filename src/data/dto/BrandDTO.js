'use strict';

class BrandDTO {
    constructor({
        brandIdx,
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
        createdAt,
        updatedAt,
    }) {
        this.brandIdx = brandIdx;
        this.name = name;
        this.englishName = englishName;
        this.firstInitial = firstInitial;
        this.imageUrl = imageUrl;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = BrandDTO;
