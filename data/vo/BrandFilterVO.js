'use strict';

const {
    BrandResponseDTO,
    BrandFilterResponseDTO,
} = require('../response_dto/brand');

class BrandFilterVO {
    constructor({ firstInitial, brands }) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    /**
     *
     * @returns BrandFilterResponseDTO
     */
    toResponse() {
        return new BrandFilterResponseDTO({
            firstInitial: this.firstInitial,
            brands: this.brands.map((it) => new BrandResponseDTO(it)),
        });
    }
}

module.exports = BrandFilterVO;
