class BrandResponseDTO {
    brandIdx: number;
    name: string;
    constructor(brandIdx: number, name: string) {
        this.brandIdx = brandIdx;
        this.name = name;
    }
}

export default BrandResponseDTO;
