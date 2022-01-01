class PerfumeSearchRequest {
    keywordList: number[];
    brandList: number[];
    ingredientList: number[];
    searchText: string;
    userIdx: number;
    constructor(
        keywordList: number[],
        brandList: number[],
        ingredientList: number[],
        searchText: string,
        userIdx: number
    ) {
        this.userIdx = userIdx;
        this.keywordList = keywordList;
        this.brandList = brandList;
        this.ingredientList = ingredientList;
        this.searchText = searchText;
    }
    static createByJson(json: any): PerfumeSearchRequest {
        return new PerfumeSearchRequest(
            json.keywordList,
            json.brandList,
            json.ingredientList,
            json.searchText,
            json.userIdx
        );
    }
}

export { PerfumeSearchRequest };
