class CreatedResultDTO<Type> {
    readonly idx: number;
    readonly created: Type;
    constructor(idx: number, created: Type) {
        this.idx = idx;
        this.created = created;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { CreatedResultDTO };
