class IngredientResponseDTO {
    ingredientIdx: number;
    name: string;
    constructor(ingredientIdx: number, name: string) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
    }
}

export default IngredientResponseDTO;
