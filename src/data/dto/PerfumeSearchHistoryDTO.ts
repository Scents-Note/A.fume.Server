import { BrandDTO } from '@dto/BrandDTO';
import { PerfumeThumbDTO } from '@dto/PerfumeThumbDTO';

type SearchHistory = {
    readonly userIdx: number;
    readonly perfumeIdx: number;
    readonly count: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

class PerfumeSearchHistoryDTO extends PerfumeThumbDTO {
    readonly SearchHistory: SearchHistory;
    constructor(
        perfumeIdx: number,
        name: string,
        isLiked: boolean,
        imageUrl: string,
        createdAt: Date,
        updatedAt: Date,
        Brand: BrandDTO,
        SearchHistory: SearchHistory
    ) {
        super(perfumeIdx, name, isLiked, imageUrl, createdAt, updatedAt, Brand);
        this.SearchHistory = SearchHistory;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeSearchHistoryDTO {
        return new PerfumeSearchHistoryDTO(
            json.perfumeIdx,
            json.name,
            json.isLiked,
            json.imageUrl,
            json.createdAt,
            json.updatedAt,
            json.Brand,
            json.SearchHistory
        );
    }
}

export { PerfumeSearchHistoryDTO };
