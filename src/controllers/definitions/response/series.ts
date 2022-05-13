import { SeriesFilterDTO, SeriesDTO } from '@dto/index';
import { IngredientResponse } from '@response/ingredient';

/**
 * @swagger
 * definitions:
 *   SeriesResponse:
 *     type: object
 *     properties:
 *       seriesIdx:
 *         type: number
 *       name:
 *         type: string
 *       imageUrl:
 *         type: string
 *     example:
 *       seriesIdx: 1
 *       name: 꿀
 *       imageUrl: http://
 *  */
class SeriesResponse {
    readonly seriesIdx: number;
    readonly name: string;
    readonly imageUrl: string;
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

/**
 * @swagger
 * definitions:
 *   SeriesFilterResponse:
 *     type: object
 *     properties:
 *       seriesIdx:
 *         type: number
 *       name:
 *         type: string
 *       imageUrl:
 *         type: string
 *       ingredients:
 *         type: array
 *       items:
 *         $ref: '#/definitions/IngredientResponse'
 *     example:
 *       seriesIdx: 1
 *       name: 꿀
 *       imageUrl: http://
 *       ingredients: []
 *  */
class SeriesFilterResponse {
    readonly seriesIdx: number;
    readonly name: string;
    readonly ingredients: IngredientResponse[];
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
