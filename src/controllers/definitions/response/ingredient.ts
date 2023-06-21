import { IngredientCategoryDTO, SeriesDTO } from '@src/data/dto';
import { IngredientCategoryResponse, SeriesResponse } from './series';

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
 *       name: 베르가못
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
 *  IngredientCategoryResponse:
 *     type: object
 *     properties:
 *       ingredientIdx:
 *         type: number
 *       name:
 *         type: string
 *     example:
 *       ingredientIdx: 1
 *       name: 베르가못
 *  */
class IngredientCategoryResponse1 {
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
    }): IngredientCategoryResponse1 {
        return new IngredientCategoryResponse1(json.ingredientIdx, json.name);
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
 *       ingredientCategory:
 *         - $ref: '#/definitions/IngredientCategoryResponse'
 *
 *     examples:
 *       ingredientIdx: 1
 *       name: 씨쏠트
 *       englishName: seesalt
 *       description: 설명
 *       Series:
 *         seriesIdx: 2
 *         name: 시트러스
 *       IngredientCategory:
 *         ingredientIdx: 5
 *         name: 버터오렌지
 *  */
class IngredientFullResponse {
    readonly ingredientIdx: number;
    readonly name: string;
    readonly englishName: string;
    readonly description: string;
    readonly Series: SeriesResponse;
    readonly IngredientCategory: IngredientCategoryResponse;

    constructor(
        ingredientIdx: number,
        name: string,
        englishName: string,
        description: string,
        Series: SeriesResponse,
        IngredientCategory: IngredientCategoryResponse
    ) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.Series = Series;
        this.IngredientCategory = IngredientCategory;
    }

    static createByJson(json: {
        ingredientIdx: number;
        name: string;
        englishName: string;
        description: string;
        Series: object;
        IngredientCategory: object;
    }) {
        return new IngredientFullResponse(
            json.ingredientIdx,
            json.name,
            json.englishName,
            json.description,
            SeriesResponse.create(SeriesDTO.createByJson(json.Series)),
            IngredientCategoryResponse.create(
                IngredientCategoryDTO.createByJson(json.IngredientCategory)
            )
        );
    }
}

export {
    IngredientResponse,
    IngredientCategoryResponse1,
    IngredientFullResponse,
};
