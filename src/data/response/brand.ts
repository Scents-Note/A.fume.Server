import BrandFilterDTO from '../dto/BrandFilterDTO';

class BrandResponse {
    brandIdx: number;
    name: string;
    constructor(brandIdx: number, name: string) {
        this.brandIdx = brandIdx;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        brandIdx: number;
        name: string;
    }): BrandResponse {
        return new BrandResponse(json.brandIdx, json.name);
    }
}

class BrandFilterResponse {
    firstInitial: string;
    brands: BrandResponse[];
    constructor(firstInitial: string, brands: BrandResponse[]) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(brandFilterDTO: BrandFilterDTO) {
        const firstInitial = brandFilterDTO.firstInitial;
        const brands = brandFilterDTO.brands.map(BrandResponse.createByJson);
        return new BrandFilterResponse(firstInitial, brands);
    }
}

export { BrandResponse, BrandFilterResponse };
