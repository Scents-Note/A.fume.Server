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
    keywordList: number[];
    brandList: number[];
    ingredientList: number[];
    searchText: string;
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
