import IngredientResponseDTO from '../ingredient/IngredientResponseDTO';

class SeriesFilterResponseDTO {
    constructor({ seriesIdx, name, ingredients }) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.ingredients = ingredients;
    }

    static create(seriesFilterDTO) {
        return new SeriesFilterResponseDTO({
            seriesIdx: seriesFilterDTO.seriesIdx,
            name: seriesFilterDTO.name,
            ingredients: seriesFilterDTO.ingredients.map(
                (it) => new IngredientResponseDTO(it.ingredientIdx, it.name)
            ),
        });
    }
}

module.exports = SeriesFilterResponseDTO;
