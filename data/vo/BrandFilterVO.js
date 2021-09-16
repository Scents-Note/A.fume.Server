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
}

module.exports = BrandFilterVO;
