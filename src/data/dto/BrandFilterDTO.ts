import BrandDTO from './BrandDTO';

class BrandFilterDTO {
    firstInitial: string;
    brands: BrandDTO[];
    constructor(firstInitial: string, brands: BrandDTO[]) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }
}

export default BrandFilterDTO;
