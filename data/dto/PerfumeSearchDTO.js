'use strict';

class PerfumeSearchDTO {
    constructor({
        keywordIdxList,
        brandIdxList,
        ingredientIdxList,
        searchText,
        userIdx,
    }) {
        this.userIdx = userIdx;
        this.keywordIdxList = keywordIdxList;
        this.brandIdxList = brandIdxList;
        this.ingredientIdxList = ingredientIdxList;
        this.searchText = searchText;
    }

    static create(perfumeSearchRequestDTO) {
        const {
            keywordList: keywordIdxList,
            brandList: brandIdxList,
            ingredientList: ingredientIdxList,
            searchText,
            userIdx,
        } = perfumeSearchRequestDTO;
        return new PerfumeSearchDTO({
            keywordIdxList,
            brandIdxList,
            ingredientIdxList,
            searchText,
            userIdx,
        });
    }
}

module.exports = PerfumeSearchDTO;
