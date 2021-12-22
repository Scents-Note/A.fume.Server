import PerfumeThumbDTO from './PerfumeThumbDTO';

class PerfumeThumbKeywordDTO extends PerfumeThumbDTO {
    keywordList: string[];
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        isLiked: boolean,
        imageUrl: string,
        keywordList: string[]
    ) {
        super(perfumeIdx, name, brandName, isLiked, imageUrl);
        this.keywordList = keywordList;
    }
    static createByJson(json: any): PerfumeThumbKeywordDTO {
        const perfumeIdx: number = json.perfumeIdx;
        const name: string = json.name;
        const brandName: string = json.brandName;
        const isLiked: boolean = json.isLiked;
        const imageUrl: string = json.imageUrl;
        const keywordList: string[] = json.keywordList;
        return new PerfumeThumbKeywordDTO(
            perfumeIdx,
            name,
            brandName,
            isLiked,
            imageUrl,
            keywordList
        );
    }
}

export default PerfumeThumbKeywordDTO;
