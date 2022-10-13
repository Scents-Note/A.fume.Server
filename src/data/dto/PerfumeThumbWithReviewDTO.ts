import { BrandDTO } from '@dto/BrandDTO';

class PerfumeThumbWithReviewDTO {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly isLiked: boolean;
    readonly imageUrl: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly Brand: BrandDTO;
    readonly reviewIdx: number;
    constructor(
        perfumeIdx: number,
        name: string,
        isLiked: boolean,
        imageUrl: string,
        createdAt: Date,
        updatedAt: Date,
        Brand: BrandDTO,
        reviewIdx: number
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = Brand.name;
        this.isLiked = isLiked || false;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.Brand = Brand;
        this.reviewIdx = reviewIdx;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeThumbWithReviewDTO {
        return new PerfumeThumbWithReviewDTO(
            json.perfumeIdx,
            json.name,
            json.isLiked,
            json.imageUrl,
            json.createdAt,
            json.updatedAt,
            json.Brand,
            json.reviewIdx
        );
    }
}

export { PerfumeThumbWithReviewDTO };
