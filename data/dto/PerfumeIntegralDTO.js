'use strict';

const { ABUNDANCE_RATE_LIST } = require('../../utils/constantUtil.js');

class PerfumeIntegralDTO {
    constructor({
        perfumeIdx,
        name,
        brandName,
        story,
        abundanceRate,
        volumeAndPrice,
        imageUrls,
        score,
        seasonal,
        sillage,
        longevity,
        gender,
        isLiked,
        keywordList,
        noteType /* TODO change Value to String */,
        noteDict,
    }) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.isLiked = isLiked;
        this.imageUrls = imageUrls;
        this.story = story;
        this.abundanceRate = abundanceRate;
        this.volumeAndPrice = volumeAndPrice;
        this.score = score;
        this.seasonal = seasonal;
        this.sillage = sillage;
        this.longevity = longevity;
        this.gender = gender;
        this.keywordList = keywordList;
        this.noteType = noteType;
        this.noteDict = noteDict;
    }

    static create({
        perfumeDTO,
        perfumeSummaryDTO,
        keywordList,
        noteDictDTO,
        noteType,
        imageUrls,
    }) {
        perfumeDTO.volumeAndPrice = perfumeDTO.volumeAndPrice.map((it) => {
            return `${numberWithCommas(it.price)}/${it.volume}ml`;
        });
        perfumeDTO.abundanceRate =
            ABUNDANCE_RATE_LIST[perfumeDTO.abundanceRate];
        const perfume = Object.assign(
            { keywordList, noteDict: noteDictDTO, noteType, imageUrls },
            perfumeSummaryDTO,
            perfumeDTO
        );
        for (const key in perfume) {
            if (!perfume[key] instanceof String) continue;
            perfume[key] = emptyCheck(perfume[key]);
        }
        return new PerfumeIntegralDTO(perfume);
    }
}

function emptyCheck(x) {
    if (x == null || x == undefined || x.length == 0) {
        if (x instanceof Array) {
            return [];
        }
        return '정보 없음';
    }
    return x;
}

const shouldBeAddedCommasRegex = /\B(?=(\d{3})+(?!\d))/g;
function numberWithCommas(x) {
    return x.toString().replace(shouldBeAddedCommasRegex, ',');
}

module.exports = PerfumeIntegralDTO;
