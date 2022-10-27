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

/**
 * @swagger
 * definitions:
 *   NoteDict:
 *     type: object
 *     properties:
 *       top:
 *         type: string
 *       middle:
 *         type: string
 *       base:
 *         type: string
 *       single:
 *         type: string
 */
type NoteDict = {
    top: string;
    middle: string;
    base: string;
    single: string;
};

/**
 * @swagger
 * definitions:
 *   PerfumeDetailResponse:
 *     properties:
 *       story:
 *         type: string
 *       abundanceRate:
 *         type: string
 *         enum:
 *         - None
 *         - 오 드 코롱
 *         - 코롱
 *         - 오 드 뚜왈렛
 *         - 오 드 퍼퓸
 *         - 퍼퓸
 *       imageUrls:
 *         type: array
 *         items:
 *           type: string
 *       volumeAndPrice:
 *         type: array
 *         items:
 *           type: string
 *       score:
 *         type: number
 *         description: 점수 평균 값
 *         minimum: 0
 *         maximum: 5
 *       longevity:
 *         type: object
 *         description: 지속감
 *         properties:
 *           veryWeak:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 매우 약함
 *           weak:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 약함
 *           medium:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 보통
 *           strong:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 강함
 *           veryStrong:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 매우 강함
 *       sillage:
 *         type: object
 *         description: 잔향감
 *         properties:
 *           light:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 약함
 *           normal:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 보통
 *           heavy:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 강함
 *       seasonal:
 *         type: object
 *         properties:
 *           spring:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 봄
 *           summer:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 여름
 *           fall:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 가을
 *           winter:
 *             type: number
 *             minimum: 0
 *             maximum: 100
 *             description: 겨울
 *       noteType:
 *         type: integer
 *         description: 0은 일반 노트, 1은 single 노트
 *       ingredients:
 *         $ref: '#/definitions/NoteDict'
 *       reviewIdx:
 *         type: number
 * */
class PerfumeDetailResponse {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly story: string;
    readonly abundanceRate: number;
    readonly volumeAndPrice: string[];
    readonly imageUrls: string[];
    readonly score: number;
    readonly seasonal: Seasonal;
    readonly sillage: Sillage;
    readonly longevity: Longevity;
    readonly gender: Gender;
    readonly isLiked: boolean;
    readonly Keywords: string[];
    readonly noteType: number;
    readonly ingredients: NoteDict;
    readonly reviewIdx: number;
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
                if (isNaN(it.price) || !it.price) {
                    return `정보 없음/${it.volume}ml`;
                }
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
            perfumeIntegralDTO.noteDict,
            perfumeIntegralDTO.reviewIdx
        );
    }
    private static numberWithCommas(x: number): string {
        return x
            .toString()
            .replace(PerfumeDetailResponse.shouldBeAddedCommasRegex, ',');
    }
}

/**
 * @swagger
 * definitions:
 *   PerfumeResponse:
 *     type: object
 *     properties:
 *       perfumeIdx:
 *         type: number
 *       name:
 *         type: string
 *       brandName:
 *         type: string
 *       imageUrl:
 *         type: string
 *       isLiked:
 *         type: boolean
 *     example:
 *       perfumeIdx: 1
 *       name: 154 코롱
 *       brandName: 154 kolon
 *       imageUrl: https://contents.lotteon.com/itemimage/_v065423/LE/12/04/59/50/19/_1/22/48/08/13/9/LE1204595019_1224808139_1.jpg/dims/resizef/554X554
 *       isLiked: true
 * */
class PerfumeResponse {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly imageUrl: string;
    readonly isLiked: boolean;
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

/**
 * @swagger
 * definitions:
 *   PerfumeRecommendResponse:
 *     type: object
 *     properties:
 *       perfumeIdx:
 *         type: number
 *       name:
 *         type: string
 *       brandName:
 *         type: string
 *       imageUrl:
 *         type: string
 *       isLiked:
 *         type: boolean
 *       keywordList:
 *         type: array
 *         items:
 *           type: string
 *     example:
 *       perfumeIdx: 1
 *       name: 154 코롱
 *       brandName: 154 kolon
 *       imageUrl: https://contents.lotteon.com/itemimage/_v065423/LE/12/04/59/50/19/_1/22/48/08/13/9/LE1204595019_1224808139_1.jpg/dims/resizef/554X554
 *       isLiked: true
 *       keyword: ['키워드', '키워드2']
 * */
class PerfumeRecommendResponse extends PerfumeResponse {
    readonly keywordList: string[];
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
/**
 * @swagger
 * definitions:
 *   PerfumeWishedResponse:
 *     type: object
 *     properties:
 *       perfumeIdx:
 *         type: number
 *       name:
 *         type: string
 *       brandName:
 *         type: string
 *       imageUrl:
 *         type: string
 *       isLiked:
 *         type: boolean
 *       reviewIdx:
 *         trype: number
 *     example:
 *       perfumeIdx: 1
 *       name: 154 코롱
 *       brandName: 154 kolon
 *       imageUrl: https://contents.lotteon.com/itemimage/_v065423/LE/12/04/59/50/19/_1/22/48/08/13/9/LE1204595019_1224808139_1.jpg/dims/resizef/554X554
 *       isLiked: true
 *       reviewIdx: 1
 * */
class PerfumeWishedResponse {
    readonly perfumeIdx: number;
    readonly name: string;
    readonly brandName: string;
    readonly imageUrl: string;
    readonly isLiked: boolean;
    readonly reviewIdx: number;
    constructor(
        perfumeIdx: number,
        name: string,
        brandName: string,
        imageUrl: string,
        isLiked: boolean,
        reviewIdx: number
    ) {
        this.perfumeIdx = perfumeIdx;
        this.name = name;
        this.brandName = brandName;
        this.imageUrl = imageUrl;
        this.isLiked = isLiked;
        this.reviewIdx = reviewIdx;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: any): PerfumeWishedResponse {
        return new PerfumeWishedResponse(
            json.perfumeIdx,
            json.name,
            json.brandName,
            json.imageUrl,
            json.isLiked,
            json.reviewIdx
        );
    }
}

export {
    PerfumeDetailResponse,
    PerfumeResponse,
    PerfumeRecommendResponse,
    PerfumeWishedResponse,
};
