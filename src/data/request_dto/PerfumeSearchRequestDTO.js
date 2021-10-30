'use strict';

class PerfumeSearchRequestDTO {
    constructor({
        keywordList,
        brandList,
        ingredientList,
        searchText,
        userIdx,
    }) {
        this.userIdx = userIdx;
        this.keywordList = keywordList;
        this.brandList = brandList;
        this.ingredientList = ingredientList;
        this.searchText = searchText;
    }
}

module.exports = PerfumeSearchRequestDTO;
