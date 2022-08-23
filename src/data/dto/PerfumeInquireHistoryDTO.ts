import { BrandDTO } from '@dto/BrandDTO';
import { PerfumeThumbDTO } from '@dto/PerfumeThumbDTO';

type InquireHistory = {
    readonly userIdx: number;
    readonly perfumeIdx: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

class PerfumeInquireHistoryDTO extends PerfumeThumbDTO {
    readonly InquireHistory: InquireHistory;
    constructor(
        perfumeIdx: number,
        name: string,
        isLiked: boolean,
        imageUrl: string,
        createdAt: Date,
        updatedAt: Date,
        Brand: BrandDTO,
        inquireHistory: InquireHistory
    ) {
        super(perfumeIdx, name, isLiked, imageUrl, createdAt, updatedAt, Brand);
        this.InquireHistory = inquireHistory;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeInquireHistoryDTO {
        return new PerfumeInquireHistoryDTO(
            json.perfumeIdx,
            json.name,
            json.isLiked,
            json.imageUrl,
            json.createdAt,
            json.updatedAt,
            json.Brand,
            json.InquireHistory
        );
    }
}

export { PerfumeInquireHistoryDTO };
