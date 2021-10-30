class NoteDTO {
    constructor({
        perfumeIdx,
        ingredientIdx,
        type,
        createdAt,
        updatedAt,
        ingredientName,
    }) {
        this.perfumeIdx = perfumeIdx;
        this.ingredientIdx = ingredientIdx;
        this.type = type;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.ingredientName = ingredientName;
    }
}

module.exports = NoteDTO;
