import { BrandFilterDTO } from '@dto/index';

/**
 * @swagger
 * definitions:
 *  BrandResponse:
 *     type: object
 *     properties:
 *       brand_idx:
 *         type: number
 *       name:
 *         type: string
 *     example:
 *       brand_idx: 1
 *       name: (테스트)조말론
 *  */
class BrandResponse {
    readonly brandIdx: number;
    readonly name: string;
    constructor(brandIdx: number, name: string) {
        this.brandIdx = brandIdx;
        this.name = name;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        brandIdx: number;
        name: string;
    }): BrandResponse {
        return new BrandResponse(json.brandIdx, json.name);
    }
}

/**
 * @swagger
 * definitions:
 *  BrandFilterResponse:
 *     type: object
 *     properties:
 *       firstInitial:
 *         type: string
 *         example: ㄷ
 *       brands:
 *         type: array
 *         items:
 *           allOf:
 *           - $ref: '#/definitions/BrandResponse'
 * */
class BrandFilterResponse {
    readonly firstInitial: string;
    readonly brands: BrandResponse[];
    constructor(firstInitial: string, brands: BrandResponse[]) {
        this.firstInitial = firstInitial;
        this.brands = brands;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static create(brandFilterDTO: BrandFilterDTO) {
        const firstInitial = brandFilterDTO.firstInitial;
        const brands = brandFilterDTO.brands.map(BrandResponse.createByJson);
        return new BrandFilterResponse(firstInitial, brands);
    }
}

/**
 * @swagger
 * definitions:
 *  BrandFullResponse:
 *     type: object
 *     properties:
 *       brand_idx:
 *         type: number
 *       name:
 *         type: string
 *       englishName:
 *         type: string
 *       description:
 *         type: string
 *       firstInitial:
 *         type: string
 *     example:
 *       brand_idx: 1
 *       name: (테스트)조말론
 *       englishName: jo malone
 *       description: 설명
 *       firstInitial: ㅈ
 *  */
class BrandFullResponse {
    readonly brandIdx: number;
    readonly name: string;
    readonly englishName: string;
    readonly description: string;
    readonly firstInitial: string;
    constructor(
        brandIdx: number,
        name: string,
        englishName: string,
        description: string,
        firstInitial: string
    ) {
        this.brandIdx = brandIdx;
        this.name = name;
        this.englishName = englishName;
        this.description = description;
        this.firstInitial = firstInitial;
    }

    public toString(): string {
        return `${this.constructor.name} (${JSON.stringify(this)})`;
    }

    static createByJson(json: {
        brandIdx: number;
        name: string;
        englishName: string;
        description: string;
        firstInitial: string;
    }): BrandFullResponse {
        return new BrandFullResponse(
            json.brandIdx,
            json.name,
            json.englishName,
            json.description,
            json.firstInitial
        );
    }
}

export { BrandResponse, BrandFilterResponse, BrandFullResponse };
