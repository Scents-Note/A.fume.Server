import BrandDTO from '../../dto/BrandDTO';

class BrandResponseDTO {
    brandIdx: number;
    name: string;
    constructor(brandIdx: number, name: string) {
        this.brandIdx = brandIdx;
        this.name = name;
    }
    static create(brandDTO: BrandDTO): BrandResponseDTO {
        return new BrandResponseDTO(brandDTO.brandIdx, brandDTO.name);
    }
}

export default BrandResponseDTO;
