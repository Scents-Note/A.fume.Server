'use strict';

const NO_REVIEW = 0;

class PerfumeDetailResponseDTO {
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
        Keywords /* TODO change lower case */,
        noteType /* TODO change Value to String */,
        ingredients,
        reviewIdx,
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
        this.Keywords = Keywords;
        this.noteType = noteType;
        this.ingredients = ingredients;
        this.reviewIdx = reviewIdx || NO_REVIEW;
    }
}

module.exports = PerfumeDetailResponseDTO;
