class PerfumeSearchDTO {
    keywordIdxList: number[];
    brandIdxList: number[];
    ingredientIdxList: number[];
    searchText: string;
    userIdx: number;
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

    static create(perfumeSearchRequestDTO: any) {
        const {
            keywordList: keywordIdxList,
            brandList: brandIdxList,
            ingredientList: ingredientIdxList,
            searchText,
            userIdx,
        } = perfumeSearchRequestDTO;
        return new PerfumeSearchDTO(
            keywordIdxList,
            brandIdxList,
            ingredientIdxList,
            searchText,
            userIdx
        );
    }
}

export default PerfumeSearchDTO;
