class IngredientConditionDTO {
    readonly ingredientIdx: number | undefined;
    readonly name: string | undefined;
    readonly englishName: string | undefined;
    readonly description: string | undefined;
    readonly imageUrl: string | undefined;
    readonly seriesIdx: number | undefined;
    constructor(
        ingredientIdx?: number,
        name?: string,
        englishName?: string,
        description?: string,
        imageUrl?: string,
        seriesIdx?: number
    ) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.seriesIdx = seriesIdx;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
}

export { IngredientConditionDTO };
