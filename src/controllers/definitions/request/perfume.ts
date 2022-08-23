import { PerfumeSearchDTO } from '@src/data/dto';

/**
 * @swagger
 * definitions:
 *   PerfumeSearchRequest:
 *     type: object
 *     properties:
 *       searchText:
 *         type: string
 *         example: 'Tom'
 *       keywordList:
 *         type: array
 *         items:
 *           type: integer
 *       ingredientList:
 *         type: array
 *         items:
 *           type: integer
 *       brandList:
 *         type: array
 *         items:
 *           type: integer
 * */
class PerfumeSearchRequest {
    readonly keywordList: number[];
    readonly brandList: number[];
    readonly ingredientList: number[];
    readonly searchText: string;
    constructor(
        keywordList: number[],
        brandList: number[],
        ingredientList: number[],
        searchText: string
    ) {
        this.keywordList = keywordList;
        this.brandList = brandList;
        this.ingredientList = ingredientList;
        this.searchText = searchText;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    public toPerfumeSearchDTO(userIdx: number): PerfumeSearchDTO {
        return new PerfumeSearchDTO(
            this.keywordList,
            this.brandList,
            this.ingredientList,
            this.searchText,
            userIdx
        );
    }

    static createByJson(json: any): PerfumeSearchRequest {
        return new PerfumeSearchRequest(
            json.keywordList,
            json.brandList,
            json.ingredientList,
            json.searchText
        );
    }
}

export { PerfumeSearchRequest };
