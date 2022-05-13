class PerfumeThumbKeywordDTO {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly isLiked: boolean;
    readonly imageUrl: string;
    readonly keywordList: string[];
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        isLiked: boolean,
        imageUrl: string,
        keywordList: string[]
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.isLiked = isLiked;
        this.imageUrl = imageUrl;
        this.keywordList = keywordList;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
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

export { PerfumeThumbKeywordDTO };
