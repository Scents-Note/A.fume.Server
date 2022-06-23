class IngredientCategoryDTO {
    readonly idx: number;
    readonly name: string;
    constructor(idx: number, name: string) {
        this.idx = idx;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { IngredientCategoryDTO };
