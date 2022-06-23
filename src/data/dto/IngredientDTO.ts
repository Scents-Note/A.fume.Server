class IngredientDTO {
    readonly ingredientIdx: number;
    readonly name: string;
    readonly englishName: string;
    readonly description: string;
    readonly imageUrl: string;
    readonly seriesIdx: number;
    readonly categoryIdx: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    constructor(
        ingredientIdx: number,
        name: string,
        englishName: string,
        description: string,
        imageUrl: string,
        seriesIdx: number,
        categoryIdx: number,
        createdAt: string,
        updatedAt: string
    ) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.seriesIdx = seriesIdx;
        this.categoryIdx = categoryIdx;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    static createByJson(json: any): IngredientDTO {
        const ingredientIdx: number = json.ingredientIdx;
        const name: string = json.name;
        const englishName: string = json.englishName;
        const description: string = json.description;
        const imageUrl: string = json.imageUrl;
        const seriesIdx: number = json.seriesIdx;
        const categoryIdx: number = json.categoryIdx;
        const createdAt: string = json.createdAt;
        const updatedAt: string = json.updatedAt;
        return new IngredientDTO(
            ingredientIdx,
            name,
            englishName,
            description,
            imageUrl,
            seriesIdx,
            categoryIdx,
            createdAt,
            updatedAt
        );
    }
}

export { IngredientDTO };
