import { SeriesFilterDTO, SeriesDTO } from '@dto/index';

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
 *   IngredientCategory:
 *     type: object
 *     properties:
 *       idx:
 *         type: number
 *       name:
 *         type: string
 *     example:
 *       idx: 1
 *       name: 꿀
 *  */
class IngredientCategoryResponse {
    readonly idx: number;
    readonly name: string;
    constructor(idx: number, name: string) {
        this.idx = idx;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    static createByJson(json: any): IngredientCategoryResponse {
        return new IngredientCategoryResponse(json.idx, json.name);
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
 *       ingredientList:
 *         type: array
 *         items:
 *           $ref: '#/definitions/IngredientCategory'
 *  */
class SeriesFilterResponse {
    readonly seriesIdx: number;
    readonly name: string;
    readonly ingredients: IngredientCategoryResponse[];
    constructor(
        seriesIdx: number,
        name: string,
        ingredients: IngredientCategoryResponse[]
    ) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.ingredients = ingredients;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(seriesFilterDTO: SeriesFilterDTO): SeriesFilterResponse {
        return new SeriesFilterResponse(
            seriesFilterDTO.seriesIdx,
            seriesFilterDTO.name,
            seriesFilterDTO.ingredientCategoryList.map((it) => {
                return new IngredientCategoryResponse(it.id, it.name);
            })
        );
    }
}

export { SeriesResponse, SeriesFilterResponse, IngredientCategoryResponse };
