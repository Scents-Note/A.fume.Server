import PerfumeIntegralDTO from '../dto/PerfumeIntegralDTO';

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

class PerfumeDetailResponseDTO {
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

    static shouldBeAddedCommasRegex: RegExp = /\B(?=(\d{3})+(?!\d))/g;
    static createByPerfumeIntegralDTO(
        perfumeIntegralDTO: PerfumeIntegralDTO
    ): PerfumeDetailResponseDTO {
        const volumeAndPrice: string[] = perfumeIntegralDTO.volumeAndPrice.map(
            (it: { volume: string; price: number }) => {
                return `${PerfumeDetailResponseDTO.numberWithCommas(
                    it.price
                )}/${it.volume}ml`;
            }
        );
        return new PerfumeDetailResponseDTO(
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
            .replace(PerfumeDetailResponseDTO.shouldBeAddedCommasRegex, ',');
    }
}

class PerfumeResponseDTO {
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

    static createByJson(json: any): PerfumeResponseDTO {
        return new PerfumeResponseDTO(
            json.perfumeIdx,
            json.name,
            json.brandName,
            json.imageUrl,
            json.isLiked
        );
    }
}

class PerfumeRecommendResponseDTO extends PerfumeResponseDTO {
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
    static createByJson(json: any): PerfumeRecommendResponseDTO {
        return new PerfumeRecommendResponseDTO(
            json.perfumeIdx,
            json.name,
            json.brandName,
            json.imageUrl,
            json.isLiked,
            json.keywordList
        );
    }
}

export {
    PerfumeDetailResponseDTO,
    PerfumeResponseDTO,
    PerfumeRecommendResponseDTO,
};
