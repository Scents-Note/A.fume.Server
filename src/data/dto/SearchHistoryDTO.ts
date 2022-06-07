class SearchHistoryDTO {
    userIdx: number;
    perfumeIdx: number;
    count: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        userIdx: number,
        perfumeIdx: number,
        count: number,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.userIdx = userIdx;
        this.perfumeIdx = perfumeIdx;
        this.count = count;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        userIdx: number;
        perfumeIdx: number;
        count: number;
        createdAt: Date;
        updatedAt: Date;
    }) {
        return new SearchHistoryDTO(
            json.userIdx,
            json.perfumeIdx,
            json.count,
            json.createdAt,
            json.updatedAt
        );
    }
}

export { SearchHistoryDTO };
