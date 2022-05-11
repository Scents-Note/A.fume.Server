import { SeriesFilterDTO, SeriesDTO } from '@dto/index';
import { IngredientResponse } from '@response/ingredient';

class SeriesResponse {
    seriesIdx: number;
    name: string;
    imageUrl: string;
    constructor(seriesIdx: number, name: string, imageUrl: string) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(seriesDTO: SeriesDTO): SeriesResponse {
        return new SeriesResponse(
            seriesDTO.seriesIdx,
            seriesDTO.name,
            seriesDTO.imageUrl
        );
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

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
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
