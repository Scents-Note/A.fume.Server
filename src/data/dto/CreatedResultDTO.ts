class CreatedResultDTO<Type> {
    idx: number;
    created: Type;
    constructor(idx: number, created: Type) {
        this.idx = idx;
        this.created = created;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export default CreatedResultDTO;
