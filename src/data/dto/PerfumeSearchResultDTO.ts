import { BrandDTO } from '@dto/BrandDTO';

type Score = {
    ingredient: number;
    keyword: number;
    total: number;
};

class PerfumeSearchResultDTO {
    perfumeIdx: number;
    name: string;
    brandName: string;
    isLiked: boolean;
    imageUrl: string;
    Brand: BrandDTO;
    brandIdx: number;
    createdAt: Date;
    updatedAt: Date;
    Score: Score;
    constructor(
        perfumeIdx: number,
        name: string,
        isLiked: boolean,
        imageUrl: string,
        Brand: BrandDTO,
        brandIdx: number,
        createdAt: Date,
        updatedAt: Date,
        Score: Score
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = Brand.name;
        this.isLiked = isLiked || false;
        this.imageUrl = imageUrl;
        this.Brand = Brand;
        this.brandIdx = brandIdx;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.Score = Score;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeSearchResultDTO {
        return new PerfumeSearchResultDTO(
            json.perfumeIdx,
            json.name,
            json.isLiked,
            json.imageUrl,
            BrandDTO.createByJson(json.Brand),
            json.brandIdx,
            json.createdAt,
            json.updatedAt,
            json.Score
        );
    }
}

export { PerfumeSearchResultDTO };
