import SeriesFilterDTO from '../dto/SeriesFilterDTO';
import SeriesDTO from '../dto/SeriesDTO';
import { IngredientResponse } from '../response/ingredient';

class SeriesResponse {
    seriesIdx: number;
    name: string;
    constructor(seriesIdx: number, name: string) {
        this.seriesIdx = seriesIdx;
        this.name = name;
    }
    static create(seriesDTO: SeriesDTO): SeriesResponse {
        return new SeriesResponse(seriesDTO.seriesIdx, seriesDTO.name);
    }
}

class SeriesFilterResponse {
    seriesIdx: number;
    name: string;
    ingredients: IngredientResponse[];
    constructor(
        seriesIdx: number,
        name: string,
        ingredients: IngredientResponse[]
    ) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.ingredients = ingredients;
    }

    static create(seriesFilterDTO: SeriesFilterDTO) {
        return new SeriesFilterResponse(
            seriesFilterDTO.seriesIdx,
            seriesFilterDTO.name,
            seriesFilterDTO.ingredients.map(IngredientResponse.createByJson)
        );
    }
}

export { SeriesResponse, SeriesFilterResponse };
