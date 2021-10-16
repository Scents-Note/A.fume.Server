'use strict';

class PerfumeDefaultReviewDTO {
    constructor({
        perfumeIdx,
        rating,
        seasonal,
        gender,
        sillage,
        longevity,
        keywordIdxList,
    }) {
        this.perfumeIdx = perfumeIdx;
        this.rating = rating;
        this.seasonal = seasonal;
        this.gender = gender;
        this.sillage = sillage;
        this.longevity = longevity;
        this.keywordIdxList = keywordIdxList;
    }

    static create({
        perfumeIdx,
        rating,
        seasonal,
        gender,
        sillage,
        longevity,
        keyword,
    }) {
        const seasonalList = seasonal.split('/').map((it) => parseInt(it));
        const sillageList = sillage.split('/').map((it) => parseInt(it));
        const longevityList = longevity.split('/').map((it) => parseInt(it));
        const genderList = gender.split('/').map((it) => parseInt(it));
        return new PerfumeDefaultReviewDTO({
            perfumeIdx,
            rating,
            seasonal: {
                spring: seasonalList[0],
                summer: seasonalList[1],
                fall: seasonalList[2],
                winter: seasonalList[3],
            },
            sillage: {
                light: sillageList[0],
                medium: sillageList[1],
                heavy: sillageList[2],
            },
            longevity: {
                veryWeak: longevityList[0],
                weak: longevityList[1],
                normal: longevityList[2],
                strong: longevityList[3],
                veryStrong: longevityList[4],
            },
            gender: {
                male: genderList[0],
                neutral: genderList[1],
                female: genderList[2],
            },
            keywordIdxList: keyword.split(',').map((it) => parseInt(it)),
        });
    }
}
module.exports = PerfumeDefaultReviewDTO;
