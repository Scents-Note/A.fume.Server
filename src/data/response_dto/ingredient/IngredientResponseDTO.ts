import IngredientDTO from '../../dto/IngredientDTO';

class IngredientResponseDTO {
    ingredientIdx: number;
    name: string;
    constructor(ingredientIdx: number, name: string) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
    }

    static create(ingredientDTO: IngredientDTO): IngredientResponseDTO {
        return new IngredientResponseDTO(
            ingredientDTO.ingredientIdx,
            ingredientDTO.name
        );
    }
}

export default IngredientResponseDTO;
