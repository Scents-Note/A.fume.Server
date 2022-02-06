class NoteDTO {
    perfumeIdx: number;
    ingredientIdx: number;
    type: number;
    ingredientName: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(
        perfumeIdx: number,
        ingredientIdx: number,
        type: number,
        ingredientName: string,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.perfumeIdx = perfumeIdx;
        this.ingredientIdx = ingredientIdx;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ingredientName = ingredientName;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    static createByJson(json: {
        perfumeIdx: number;
        ingredientIdx: number;
        type: number;
        ingredientName: string;
        createdAt: Date;
        updatedAt: Date;
    }) {
        return new NoteDTO(
            json.perfumeIdx,
            json.ingredientIdx,
            json.type,
            json.ingredientName,
            json.createdAt,
            json.updatedAt
        );
    }
}

export { NoteDTO };
