'use strict';

class BrandFilterResponseDTO {
    constructor({ firstInitial, brands }) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }
}

module.exports = BrandFilterResponseDTO;
