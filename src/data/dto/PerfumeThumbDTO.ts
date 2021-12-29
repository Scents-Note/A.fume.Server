import BrandDTO from './BrandDTO';

class PerfumeThumbDTO {
    perfumeIdx: number;
    name: string;
    brandName: string;
    isLiked: boolean;
    imageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    Brand: BrandDTO;
    constructor(
        perfumeIdx: number,
        name: string,
        isLiked: boolean,
        imageUrl: string,
        createdAt: Date,
        updatedAt: Date,
        Brand: BrandDTO
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = Brand.name;
        this.isLiked = isLiked || false;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.Brand = Brand;
    }

    static createByJson(json: any): PerfumeThumbDTO {
        return new PerfumeThumbDTO(
            json.perfumeIdx,
            json.name,
            json.isLiked,
            json.imageUrl,
            json.createdAt,
            json.updatedAt,
            json.Brand
        );
    }
}

export default PerfumeThumbDTO;
