import {
    SeriesFilterDTO,
    SeriesDTO,
    IngredientCategoryDTO,
    IngredientDTO,
} from '@dto/index';

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
 *       ingredientIdx:
 *         type: number
 *       name:
 *         type: string
 *     example:
 *       ingredientIdx: 1
 *       name: 꿀
 *  */
class IngredientCategoryResponse {
    static create(arg0: IngredientCategoryDTO): IngredientCategoryResponse {
        throw new Error('Method not implemented.');
    }
    readonly ingredientIdx: number;
    readonly name: string;
    // readonly usedCountOnPerfume: number;
    constructor(
        ingredientIdx: number,
        name: string
        // usedCountOnPerfume: number
    ) {
        this.ingredientIdx = ingredientIdx;
        this.name = name;
        // this.usedCountOnPerfume = usedCountOnPerfume;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }
    public create(
        ingredientCategoryDTO: IngredientCategoryDTO
    ): IngredientCategoryResponse {
        return new IngredientCategoryResponse(
            ingredientCategoryDTO.ingredientIdx,
            ingredientCategoryDTO.name
            // ingredientCategoryDTO.usedCountOnPerfume
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
