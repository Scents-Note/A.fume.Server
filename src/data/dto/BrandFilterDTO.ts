import BrandDTO from './BrandDTO';

class BrandFilterDTO {
    firstInitial: string;
    brands: BrandDTO[];
    constructor(firstInitial: string, brands: BrandDTO[]) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export default BrandFilterDTO;
