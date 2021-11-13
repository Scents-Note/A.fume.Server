class CreatedResultDTO<Type> {
    idx: number;
    created: Type;
    constructor(idx: number, created: Type) {
        this.idx = idx;
        this.created = created;
    }
}

export default CreatedResultDTO;
