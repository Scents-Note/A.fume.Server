import { PerfumeIntegralDTO } from '@dto/index';

const NO_REVIEW: number = 0;

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

class PerfumeDetailResponse {
    perfumeIdx: number;
    name: string;
    brandName: string;
    story: string;
    abundanceRate: number;
    volumeAndPrice: string[];
    imageUrls: string[];
    score: number;
    seasonal: Seasonal;
    sillage: Sillage;
    longevity: Longevity;
    gender: Gender;
    isLiked: boolean;
    Keywords: string[];
    noteType: number;
    ingredients: NoteDict;
    reviewIdx: number;
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        story: string,
        abundanceRate: number,
        volumeAndPrice: string[],
        imageUrls: string[],
        score: number,
        seasonal: Seasonal,
        sillage: Sillage,
        longevity: Longevity,
        gender: Gender,
        isLiked: boolean,
        Keywords: string[],
        noteType: number,
        ingredients: NoteDict,
        reviewIdx: number = NO_REVIEW
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
        this.Keywords = Keywords;
        this.noteType = noteType;
        this.ingredients = ingredients;
        this.reviewIdx = reviewIdx;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static shouldBeAddedCommasRegex: RegExp = /\B(?=(\d{3})+(?!\d))/g;
    static createByPerfumeIntegralDTO(
        perfumeIntegralDTO: PerfumeIntegralDTO
    ): PerfumeDetailResponse {
        const volumeAndPrice: string[] = perfumeIntegralDTO.volumeAndPrice.map(
            (it: { volume: string; price: number }) => {
                return `${PerfumeDetailResponse.numberWithCommas(it.price)}/${
                    it.volume
                }ml`;
            }
        );
        return new PerfumeDetailResponse(
            perfumeIntegralDTO.perfumeIdx,
            perfumeIntegralDTO.name,
            perfumeIntegralDTO.brandName,
            perfumeIntegralDTO.story,
            perfumeIntegralDTO.abundanceRate,
            volumeAndPrice,
            perfumeIntegralDTO.imageUrls,
            perfumeIntegralDTO.score,
            perfumeIntegralDTO.seasonal,
            perfumeIntegralDTO.sillage,
            perfumeIntegralDTO.longevity,
            perfumeIntegralDTO.gender,
            perfumeIntegralDTO.isLiked,
            perfumeIntegralDTO.keywordList,
            perfumeIntegralDTO.noteType,
            perfumeIntegralDTO.noteDict
        );
    }
    private static numberWithCommas(x: number): string {
        return x
            .toString()
            .replace(PerfumeDetailResponse.shouldBeAddedCommasRegex, ',');
    }
}

class PerfumeResponse {
    perfumeIdx: number;
    name: string;
    brandName: string;
    imageUrl: string;
    isLiked: boolean;
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        imageUrl: string,
        isLiked: boolean
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.imageUrl = imageUrl;
        this.isLiked = isLiked;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeResponse {
        return new PerfumeResponse(
            json.perfumeIdx,
            json.name,
            json.brandName,
            json.imageUrl,
            json.isLiked
        );
    }
}

class PerfumeRecommendResponse extends PerfumeResponse {
    keywordList: string[];
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        imageUrl: string,
        isLiked: boolean,
        keywordList: string[]
    ) {
        super(perfumeIdx, name, brandName, imageUrl, isLiked);
        this.keywordList = keywordList;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeRecommendResponse {
        return new PerfumeRecommendResponse(
            json.perfumeIdx,
            json.name,
            json.brandName,
            json.imageUrl,
            json.isLiked,
            json.keywordList
        );
    }
}

export { PerfumeDetailResponse, PerfumeResponse, PerfumeRecommendResponse };
