import BrandResponseDTO from './BrandResponseDTO';

class BrandFilterResponseDTO {
    firstInitial: string;
    brands: BrandResponseDTO[];
    constructor(firstInitial: string, brands: BrandResponseDTO[]) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    static create(brandFilterDTO: any) {
        const firstInitial = brandFilterDTO.firstInitial;
        const brands = brandFilterDTO.brands.map(
            (it: any) => new BrandResponseDTO(it.brandIdx, it.name)
        );
        return new BrandFilterResponseDTO(firstInitial, brands);
    }
}

export default BrandFilterResponseDTO;
