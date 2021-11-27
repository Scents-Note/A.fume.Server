import IngredientResponseDTO from '../response_dto/ingredient/IngredientResponseDTO';
import SeriesFilterDTO from '../dto/SeriesFilterDTO';
import SeriesDTO from '../dto/SeriesDTO';

class SeriesResponseDTO {
    seriesIdx: number;
    name: string;
    constructor(seriesIdx: number, name: string) {
        this.seriesIdx = seriesIdx;
        this.name = name;
    }
    static create(seriesDTO: SeriesDTO): SeriesResponseDTO {
        return new SeriesResponseDTO(seriesDTO.seriesIdx, seriesDTO.name);
    }
}

class SeriesFilterResponseDTO {
    seriesIdx: number;
    name: string;
    ingredients: IngredientResponseDTO[];
    constructor(
        seriesIdx: number,
        name: string,
        ingredients: IngredientResponseDTO[]
    ) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.ingredients = ingredients;
    }

    static create(seriesFilterDTO: SeriesFilterDTO) {
        return new SeriesFilterResponseDTO(
            seriesFilterDTO.seriesIdx,
            seriesFilterDTO.name,
            seriesFilterDTO.ingredients.map(
                (it: IngredientResponseDTO) =>
                    new IngredientResponseDTO(it.ingredientIdx, it.name)
            )
        );
    }
}

export { SeriesResponseDTO, SeriesFilterResponseDTO };
