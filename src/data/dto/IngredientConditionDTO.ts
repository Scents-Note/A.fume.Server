class IngredientConditionDTO {
    ingredientIdx: number | undefined;
    name: string | undefined;
    englishName: string | undefined;
    description: string | undefined;
    imageUrl: string | undefined;
    seriesIdx: number | undefined;
    constructor(ingredientIdx?: number, name?: string, englishName?: string, description?: string, imageUrl?: string, seriesIdx?: number) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.imageUrl = imageUrl;
        this.seriesIdx = seriesIdx;
    }
}

export default IngredientConditionDTO;
