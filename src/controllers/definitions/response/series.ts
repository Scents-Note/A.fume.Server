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
 *       ingredientCategoryList:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             category: string
 *     example:
 *       seriesIdx: 1
 *       name: 꿀
 *       imageUrl: http://
 *       ingredients: [{idx: 1, category: '오렌지}, {idx:2, category: '사과'}}]
 *  */
class SeriesFilterResponse {
    readonly seriesIdx: number;
    readonly name: string;
    readonly ingredients: IngredientCategoryDTO[];
    constructor(
        seriesIdx: number,
        name: string,
        ingredients: IngredientCategoryDTO[]
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
            seriesFilterDTO.ingredientCategoryList
        );
    }
}

export { SeriesResponse, SeriesFilterResponse };
