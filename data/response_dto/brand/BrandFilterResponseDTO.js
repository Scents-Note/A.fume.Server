'use strict';
const BrandResponseDTO = require('./BrandResponseDTO');

class BrandFilterResponseDTO {
    constructor({ firstInitial, brands }) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    static create(brandFilterDTO) {
        return new BrandFilterResponseDTO({
            firstInitial: brandFilterDTO.firstInitial,
            brands: brandFilterDTO.brands.map((it) => new BrandResponseDTO(it)),
        });
    }
}

module.exports = BrandFilterResponseDTO;
