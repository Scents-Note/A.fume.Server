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
 *       ingredients: [{category: '오렌지}, {category: '사과'}}]
 *  */
class SeriesFilterResponse {
    readonly seriesIdx: number;
    readonly name: string;
    readonly ingredientCategoryList: { category: string }[];
    constructor(
        seriesIdx: number,
        name: string,
        ingredientCategoryList: { category: string }[]
    ) {
        this.seriesIdx = seriesIdx;
        this.name = name;
        this.ingredientCategoryList = ingredientCategoryList;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(seriesFilterDTO: SeriesFilterDTO): SeriesFilterResponse {
        return new SeriesFilterResponse(
            seriesFilterDTO.seriesIdx,
            seriesFilterDTO.name,
            seriesFilterDTO.ingredientCategoryList.map((it: string) => {
                return { category: it };
            })
        );
    }
}

export { SeriesResponse, SeriesFilterResponse };
