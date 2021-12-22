'use strict';

import PerfumeThumbDTO from './PerfumeThumbDTO';

class PerfumeThumbKeywordDTO extends PerfumeThumbDTO {
    constructor({
        perfumeIdx,
        name,
        brandName,
        isLiked,
        imageUrl,
        keywordList,
    }) {
        super(perfumeIdx, name, brandName, isLiked, imageUrl);
        this.keywordList = keywordList;
    }
}

module.exports = PerfumeThumbKeywordDTO;
