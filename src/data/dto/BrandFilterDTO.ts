import { BrandDTO } from '@dto/BrandDTO';

class BrandFilterDTO {
    readonly firstInitial: string;
    readonly brands: BrandDTO[];
    constructor(firstInitial: string, brands: BrandDTO[]) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { BrandFilterDTO };
