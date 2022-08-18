class InquireHistoryDTO {
    readonly userIdx: number;
    readonly perfumeIdx: number;
    readonly routes: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    constructor(
        userIdx: number,
        perfumeIdx: number,
        routes: string,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.userIdx = userIdx;
        this.perfumeIdx = perfumeIdx;
        this.routes = routes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        userIdx: number;
        perfumeIdx: number;
        routes: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        return new InquireHistoryDTO(
            json.userIdx,
            json.perfumeIdx,
            json.routes,
            json.createdAt,
            json.updatedAt
        );
    }
}

export { InquireHistoryDTO };
