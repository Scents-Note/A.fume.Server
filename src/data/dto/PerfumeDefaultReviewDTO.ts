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

type Keyword = {
    name: string;
};
class PerfumeDefaultReviewDTO {
    perfumeIdx: number;
    rating: number;
    seasonal: Seasonal;
    gender: Gender;
    sillage: Sillage;
    longevity: Longevity;
    keywordList: Keyword[];
    constructor(
        perfumeIdx: number,
        rating: number,
        seasonal: Seasonal,
        gender: Gender,
        sillage: Sillage,
        longevity: Longevity,
        keywordList: Keyword[]
    ) {
        this.perfumeIdx = perfumeIdx;
        this.rating = rating;
        this.seasonal = seasonal;
        this.gender = gender;
        this.sillage = sillage;
        this.longevity = longevity;
        this.keywordList = keywordList;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any) {
        return new PerfumeDefaultReviewDTO(
            json.perfumeIdx,
            json.rating,
            json.seasonal,
            json.gender,
            json.sillage,
            json.longevity,
            json.keywordList
        );
    }

    static create(json: any) {
        const {
            seasonal,
            gender,
            sillage,
            longevity,
        }: { [key: string]: string } = json;
        const seasonalList: number[] = seasonal
            .split('/')
            .map((it) => parseInt(it));
        const sillageList: number[] = sillage
            .split('/')
            .map((it) => parseInt(it));
        const longevityList: number[] = longevity
            .split('/')
            .map((it) => parseInt(it));
        const genderList: number[] = gender
            .split('/')
            .map((it) => parseInt(it));
        return new PerfumeDefaultReviewDTO(
            json.perfumeIdx,
            json.rating,
            {
                spring: seasonalList[0],
                summer: seasonalList[1],
                fall: seasonalList[2],
                winter: seasonalList[3],
            },
            {
                male: genderList[0],
                neutral: genderList[1],
                female: genderList[2],
            },
            {
                light: sillageList[0],
                medium: sillageList[1],
                heavy: sillageList[2],
            },
            {
                veryWeak: longevityList[0],
                weak: longevityList[1],
                normal: longevityList[2],
                strong: longevityList[3],
                veryStrong: longevityList[4],
            },
            json.keywordList
        );
    }
}

export { PerfumeDefaultReviewDTO };
