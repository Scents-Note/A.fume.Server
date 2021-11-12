class IngredientDTO {
    ingredientIdx: number;
    name: string;
    englishName: string;
    description: string;
    imageUrl: string;
    seriesIdx: number;
    createdAt: string;
    updatedAt: string;
    constructor(
        ingredientIdx: number,
        name: string,
        englishName: string,
        description: string,
        imageUrl: string,
        seriesIdx: number,
        createdAt: string,
        updatedAt: string
    ) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.seriesIdx = seriesIdx;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static createByJson(json: any) {
        const ingredientIdx: number = json.ingredientIdx;
        const name: string = json.name;
        const englishName: string = json.englishName;
        const description: string = json.description;
        const imageUrl: string = json.imageUrl;
        const seriesIdx: number = json.seriesIdx;
        const createdAt: string = json.createdAt;
        const updatedAt: string = json.updatedAt;
        return new IngredientDTO(
            ingredientIdx,
            name,
            englishName,
            description,
            imageUrl,
            seriesIdx,
            createdAt,
            updatedAt
        );
    }
}

export default IngredientDTO;
