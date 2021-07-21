'use strict';

class BrandFilterDTO {
    constructor({ firstInitial, brands }) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }
}

module.exports = BrandFilterDTO;
