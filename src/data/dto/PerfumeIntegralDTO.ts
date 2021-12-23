const { ABUNDANCE_RATE_LIST } = require('../../utils/constantUtil.js');

class PerfumeIntegralDTO {
    perfumeIdx: number;
    name: string;
    brandName: string;
    story: string;
    abundanceRate: number;
    volumeAndPrice: { [key: string]: number }[];
    imageUrls: string[];
    score: number;
    seasonal: { [key: string]: number };
    sillage: { [key: string]: number };
    longevity: { [key: string]: number };
    gender: { [key: string]: number };
    isLiked: boolean;
    keywordList: string[];
    /* TODO change Value to Enum */
    noteType: number;
    noteDict: { [key: string]: string };
    reviewIdx: number;
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        story: string,
        abundanceRate: number,
        volumeAndPrice: { [key: string]: number }[],
        imageUrls: string[],
        score: number,
        seasonal: { [key: string]: number },
        sillage: { [key: string]: number },
        longevity: { [key: string]: number },
        gender: { [key: string]: number },
        isLiked: boolean,
        keywordList: string[],
        noteType: number,
        noteDict: { [key: string]: string },
        reviewIdx: number
    ) {
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
        this.reviewIdx = reviewIdx;
    }

    static create(
        perfumeDTO: any,
        perfumeSummaryDTO: any,
        keywordList: string[],
        noteDictDTO: { [key: string]: number },
        noteType: number,
        imageUrls: string[],
        reviewIdx: number
    ) {
        perfumeDTO.volumeAndPrice = perfumeDTO.volumeAndPrice.map(
            (it: { [key: string]: number }) => {
                return `${numberWithCommas(it.price)}/${it.volume}ml`;
            }
        );
        perfumeDTO.abundanceRate =
            ABUNDANCE_RATE_LIST[perfumeDTO.abundanceRate];
        const perfume: { [key: string]: any } = Object.assign(
            {
                keywordList,
                noteDict: noteDictDTO,
                noteType,
                imageUrls,
                reviewIdx,
            },
            perfumeSummaryDTO,
            perfumeDTO
        );
        for (const key in perfume) {
            if (!(perfume[key] instanceof String)) continue;
            perfume[key] = emptyCheck(perfume[key]);
        }
        return PerfumeIntegralDTO.createByJson(perfume);
    }

    static createByJson(json: any): PerfumeIntegralDTO {
        return new PerfumeIntegralDTO(
            json.perfumeIdx,
            json.name,
            json.brandName,
            json.story,
            json.abundanceRate,
            json.volumeAndPrice,
            json.imageUrls,
            json.score,
            json.seasonal,
            json.sillage,
            json.longevity,
            json.gender,
            json.isLiked,
            json.keywordList,
            json.noteType,
            json.noteDict,
            json.reviewIdx
        );
    }
}

function emptyCheck(x: any) {
    if (x == null || x == undefined || x.length == 0) {
        if (x instanceof Array) {
            return [];
        }
        return '정보 없음';
    }
    return x;
}

const shouldBeAddedCommasRegex = /\B(?=(\d{3})+(?!\d))/g;
function numberWithCommas(x: number) {
    return x.toString().replace(shouldBeAddedCommasRegex, ',');
}

export default PerfumeIntegralDTO;
