import { SeriesDTO } from '@src/data/dto';
import { SeriesResponse } from './series';

/**
 * @swagger
 * definitions:
 *  IngredientResponse:
 *     type: object
 *     properties:
 *       ingredientIdx:
 *         type: number
 *       name:
 *         type: string
 *     example:
 *       ingredientIdx: 1
 *       name: 씨쏠트
 *  */
class IngredientResponse {
    readonly ingredientIdx: number;
    readonly name: string;
    constructor(ingredientIdx: number, name: string) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        ingredientIdx: number;
        name: string;
    }): IngredientResponse {
        return new IngredientResponse(json.ingredientIdx, json.name);
    }
}

/**
 * @swagger
 * definitions:
 *  IngredientFullResponse:
 *     type: object
 *     properties:
 *       ingredientIdx:
 *         type: number
 *       name:
 *         type: string
 *       englishName:
 *         type: string
 *       description:
 *         type: string
 *       series:
 *         - $ref: '#/definitions/SeriesResponse'
 *
 *     example:
 *       ingredientIdx: 1
 *       name: 씨쏠트
 *       englishName: seesalt
 *       description: 설명
 *  */
class IngredientFullResponse {
    readonly ingredientIdx: number;
    readonly name: string;
    readonly englishName: string;
    readonly description: string;
    readonly Series: SeriesResponse;

    constructor(
        ingredientIdx: number,
        name: string,
        englishName: string,
        description: string,
        Series: SeriesResponse
    ) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.Series = Series;
    }

    static createByJson(json: {
        ingredientIdx: number;
        name: string;
        englishName: string;
        description: string;
        Series: object;
    }) {
        return new IngredientFullResponse(
            json.ingredientIdx,
            json.name,
            json.englishName,
            json.description,
            SeriesResponse.create(SeriesDTO.createByJson(json.Series))
        );
    }
}

export { IngredientResponse, IngredientFullResponse };
