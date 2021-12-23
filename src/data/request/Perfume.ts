class PerfumeSearchRequestDTO {
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
    static createByJson(json: any): PerfumeSearchRequestDTO {
        return new PerfumeSearchRequestDTO(
            json.keywordList,
            json.brandList,
            json.ingredientList,
            json.searchText,
            json.userIdx
        );
    }
}

export { PerfumeSearchRequestDTO };
