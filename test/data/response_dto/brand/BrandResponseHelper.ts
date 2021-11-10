import BrandResponseDTO from '../../../../src/data/response_dto/brand/BrandResponseDTO';
const { expect } = require('chai');

class BrandResponseHelper {
    static validTest(this: BrandResponseDTO) {
        expect.hasProperties.call(this, 'brandIdx', 'name');
    }
}

export default BrandResponseHelper;
