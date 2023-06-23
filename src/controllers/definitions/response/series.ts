import { SeriesFilterDTO, SeriesDTO, IngredientCategoryDTO } from '@dto/index';

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
 *       seriesIdx: 2
 *       name: 시트러스
 *       imageUrl: http://
 *
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
 *       id:
 *         type: number
 *       name:
 *         type: string
 *     example:
 *       id: 5
 *       name: 버터오렌지
 *  */
class IngredientCategoryResponse {
    readonly id: number;
    readonly name: string;
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    static create(
        ingredientCategoryDTO: IngredientCategoryDTO
    ): IngredientCategoryResponse {
        return new IngredientCategoryResponse(
            ingredientCategoryDTO.id,
            ingredientCategoryDTO.name
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
