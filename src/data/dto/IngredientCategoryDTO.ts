class IngredientCategoryDTO {
    readonly id: number;
    readonly name: string;
    readonly usedCountOnPerfume: number;
    readonly ingredientIdx: number;
    constructor(id: number, name: string, ingredientIdx: number) {
        this.id = id;
        this.name = name;
        this.ingredientIdx = ingredientIdx;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    static createByJson(json: any): IngredientCategoryDTO {
        return new IngredientCategoryDTO(
            json.id,
            json.name,
            json.ingredientIdx
        );
    }
}

export { IngredientCategoryDTO };
