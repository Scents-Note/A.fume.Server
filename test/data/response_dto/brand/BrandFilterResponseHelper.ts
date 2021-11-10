import BrandResponseHelper from './BrandResponseHelper';
import BrandFilterResponseDTO from '../../../../src/data/response_dto/brand/BrandFilterResponseDTO';

const { expect } = require('chai');

class BrandFilterResponseHelper {
    static validTest(this: BrandFilterResponseDTO) {
        expect.hasProperties.call(this, 'firstInitial', 'brands');
        this.brands.forEach((brand: any) => {
            BrandResponseHelper.validTest.call(brand);
        });
    }
}

export default BrandFilterResponseHelper;
