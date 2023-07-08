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
    readonly keywordList?: number[];
    readonly brandList?: number[];
    readonly ingredientList?: number[];
    readonly searchText: string;
    constructor(
        keywordList: number[] | undefined,
        brandList: number[] | undefined,
        ingredientList: number[] | undefined,
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

// /**
//  * @swagger
//  * definitions:
//  *   Brand:
//  *     type: object
//  *     properties:
//  *       brandIdx:
//  *         type: number
//  *       name:
//  *         type: string
//  */
// class Brand {
//     brandIdx: number;
//     name: string;

//     constructor(brandIdx: number, name: string) {
//         this.brandIdx = brandIdx;
//         this.name = name;
//     }
// }

// /**
//  * @swagger
//  * definitions:
//  *   Ingredient:
//  *     type: object
//  *     properties:
//  *       ingredientIdx:
//  *         type: number
//  *       name:
//  *         type: string
//  */

/**
 * @swagger
 * definitions:
 *   Note:
 *     type: object
 *     properties:
 *       ingredientIdx:
 *         type: number
 *       type:
 *         type: number
 */
class Note {
    ingredientIdx: number;
    type: number;

    constructor(ingredientIdx: number, type: number) {
        this.ingredientIdx = ingredientIdx;
        this.type = type;
    }
}

/**
 * @swagger
 * definitions:
 *   PerfumeInput:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       englishName:
 *         type: string
 *       brandIdx:
 *         type: number
 *       abundanceRate:
 *         type: number
 *       Notes:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Note'
 */
class PerfumeInput {
    name: string;
    englishName: string;
    brandIdx: number;
    abundanceRate: number;
    Notes: Note;

    constructor(
        name: string,
        englishName: string,
        brandIdx: number,
        abundanceRate: number,
        Notes: Note
    ) {
        this.name = name;
        this.englishName = englishName;
        this.brandIdx = brandIdx;
        this.abundanceRate = abundanceRate;
        this.Notes = Notes;
    }
}
export { PerfumeSearchRequest, PerfumeInput };
