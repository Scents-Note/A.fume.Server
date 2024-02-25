import { ABUNDANCE_RATE_STR_DICT } from '@utils/constants';
import { PerfumeSummaryDTO } from './PerfumeSummaryDTO';

type VolumeAndPrice = { volume: string; price: number }[];

type Seasonal = {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
};

type Sillage = { light: number; medium: number; heavy: number };

type Longevity = {
    veryWeak: number;
    weak: number;
    normal: number;
    strong: number;
    veryStrong: number;
};

type Gender = { male: number; neutral: number; female: number };

type NoteDict = {
    top: string;
    middle: string;
    base: string;
    single: string;
};

class PerfumeIntegralDTO {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly story: string;
    readonly abundanceRate: number;
    readonly volumeAndPrice: VolumeAndPrice;
    readonly imageUrls: string[];
    readonly score: number;
    readonly seasonal: Seasonal;
    readonly sillage: Sillage;
    readonly longevity: Longevity;
    readonly gender: Gender;
    readonly isLiked: boolean;
    readonly keywordList: string[];
    /* TODO change Value to Enum */
    readonly noteType: number;
    readonly noteDict: NoteDict;
    readonly reviewIdx: number;
    readonly priceComparisonUrl: string;
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        story: string,
        abundanceRate: number,
        volumeAndPrice: VolumeAndPrice,
        imageUrls: string[],
        score: number,
        seasonal: Seasonal,
        sillage: Sillage,
        longevity: Longevity,
        gender: Gender,
        isLiked: boolean,
        keywordList: string[],
        noteType: number,
        noteDict: NoteDict,
        reviewIdx: number,
        priceComparisonUrl: string
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
        this.priceComparisonUrl = priceComparisonUrl;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(
        perfumeDTO: any,
        perfumeSummaryDTO: PerfumeSummaryDTO,
        keywordList: string[],
        noteDictDTO: {
            top: string;
            middle: string;
            base: string;
            single: string;
        },
        noteType: number,
        imageUrls: string[],
        reviewIdx: number
    ) {
        perfumeDTO.abundanceRate =
            ABUNDANCE_RATE_STR_DICT[perfumeDTO.abundanceRate];
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
            json.reviewIdx,
            json.priceComparisonUrl
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

export { PerfumeIntegralDTO };
