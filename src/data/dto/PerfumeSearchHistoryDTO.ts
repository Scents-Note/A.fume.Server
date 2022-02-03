import BrandDTO from './BrandDTO';
import PerfumeThumbDTO from './PerfumeThumbDTO';

type SearchHistory = {
    userIdx: number;
    perfumeIdx: number;
    count: number;
    createdAt: Date;
    updatedAt: Date;
};

class PerfumeSearchHistoryDTO extends PerfumeThumbDTO {
    SearchHistory: SearchHistory;
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

export default PerfumeSearchHistoryDTO;
