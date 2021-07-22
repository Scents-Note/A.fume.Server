'use strict';

class BrandInputDTO {
    constructor({
        brandIdx,
        name,
        englishName,
        firstInitial,
        imageUrl,
        description,
    }) {
        this.brandIdx = brandIdx;
        this.name = name;
        this.englishName = englishName;
        this.firstInitial = firstInitial;
        this.imageUrl = imageUrl;
        this.description = description;
    }
}

module.exports = BrandInputDTO;
