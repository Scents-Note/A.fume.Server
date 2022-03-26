class IngredientResponse {
    ingredientIdx: number;
    name: string;
    constructor(ingredientIdx: number, name: string) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        ingredientIdx: number;
        name: string;
    }): IngredientResponse {
        return new IngredientResponse(json.ingredientIdx, json.name);
    }
}

export { IngredientResponse };
