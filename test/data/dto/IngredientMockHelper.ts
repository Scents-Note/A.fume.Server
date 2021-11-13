import { expect } from 'chai';

import IngredientDTO from '../../../src/data/dto/IngredientDTO';

class IngredientMockHelper {
    static validTest(this: IngredientDTO) {
        expect(this.ingredientIdx).to.be.ok;
        expect(this.name).to.be.ok;
        expect(this.englishName).to.be.ok;
        expect(this.description).to.be.ok;
        expect(this.imageUrl).to.be.ok;
        expect(this.seriesIdx).to.be.ok;
        expect(this.createdAt).to.be.ok;
        expect(this.updatedAt).to.be.ok;
    }

    static create(condition: any): IngredientDTO {
        return IngredientDTO.createByJson(
            Object.assign(
                {
                    ingredientIdx: 1,
                    seriesIdx: 1,
                    name: `재료`,
                    englishName: `ingredient english name`,
                    description: `ingredient description`,
                    imageUrl: `https://www.naver.com/`,
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                },
                JSON.parse(JSON.stringify(condition))
            )
        );
    }
    static createWithIdx(ingredientIdx: number, seriesIdx: number) {
        return IngredientDTO.createByJson({
            ingredientIdx,
            name: `재료${ingredientIdx}`,
            englishName: `Ingredient ${ingredientIdx}`,
            description: `ingredient description ${ingredientIdx}`,
            imageUrl: `https://www.naver.com/${ingredientIdx}`,
            seriesIdx,
            createdAt: '2021-07-24T03:38:52.000Z',
            updatedAt: '2021-07-24T03:38:52.000Z',
        });
    }
}

export default IngredientMockHelper;
