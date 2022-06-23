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
 *       ingredientCategoryList:
 *         type: array
 *         items:
 *           type: string
 *       brandList:
 *         type: array
 *         items:
 *           type: integer
 * */
class PerfumeSearchRequest {
    readonly keywordList: number[];
    readonly brandList: number[];
    readonly ingredientCategoryList: number[];
    readonly searchText: string;
    constructor(
        keywordList: number[],
        brandList: number[],
        ingredientCategoryList: number[],
        searchText: string
    ) {
        this.keywordList = keywordList;
        this.brandList = brandList;
        this.ingredientCategoryList = ingredientCategoryList;
        this.searchText = searchText;
    }
    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    public toPerfumeSearchDTO(userIdx: number): PerfumeSearchDTO {
        return new PerfumeSearchDTO(
            this.keywordList,
            this.brandList,
            this.ingredientCategoryList,
            this.searchText,
            userIdx
        );
    }

    static createByJson(json: any): PerfumeSearchRequest {
        return new PerfumeSearchRequest(
            json.keywordList,
            json.brandList,
            json.ingredientCategoryList,
            json.searchText
        );
    }
}

export { PerfumeSearchRequest };
