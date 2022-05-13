class PerfumeSearchDTO {
    readonly keywordIdxList: number[];
    readonly brandIdxList: number[];
    readonly ingredientIdxList: number[];
    readonly searchText: string;
    readonly userIdx: number;
    constructor(
        keywordIdxList: number[],
        brandIdxList: number[],
        ingredientIdxList: number[],
        searchText: string,
        userIdx: number
    ) {
        this.userIdx = userIdx;
        this.keywordIdxList = keywordIdxList;
        this.brandIdxList = brandIdxList;
        this.ingredientIdxList = ingredientIdxList;
        this.searchText = searchText;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { PerfumeSearchDTO };
