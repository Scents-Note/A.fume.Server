

class ReviewDTO {
    readonly reviewIdx: number;
    readonly score: number;
    readonly  longevity: number;
    readonly  sillage: number;
    readonly  seasonal: number;
    readonly  gender: number;
    readonly  access: boolean;
    readonly  content: string;
    readonly  likeCount: number;
    readonly  createdAt: Date;
    readonly  updatedAt: Date;
    readonly  keywordList: any;

    constructor(
        reviewIdx: number,
        score: number,
        longevity: number,
        sillage: number,
        seasonal: number,
        gender: number,
        access: boolean,
        content: string,
        likeCount: number,
        createdAt: Date,
        updatedAt: Date,
        keywordList: any,
    ) {
        this.reviewIdx = reviewIdx;
        this.score = score;
        this.longevity = longevity;
        this. sillage = sillage;
        this.seasonal = seasonal;
        this.gender = gender;
        this.access = access;
        this.content = content;
        this.likeCount = likeCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.keywordList = keywordList;
    }
}