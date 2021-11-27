import { expect } from 'chai';

import IngredientDTO from '../../../src/data/dto/IngredientDTO';
import IngredientMockHelper from './IngredientMockHelper';

import SeriesFilterDTO from '../../../src/data/dto/SeriesFilterDTO';
import SeriesHelper from './SeriesMockHelper';

class SeriesFilterMockHelper {
    static validTest(this: SeriesFilterDTO) {
        expect(this.seriesIdx).to.be.ok;
        expect(this.englishName).to.be.ok;
        expect(this.name).to.be.ok;
        expect(this.imageUrl).to.be.ok;
        expect(this.description).to.be.not.undefined;
        expect(this.createdAt).to.be.ok;
        expect(this.updatedAt).to.be.ok;
        for (const ingredient of this.ingredients) {
            expect(ingredient).instanceOf(IngredientDTO);
            IngredientMockHelper.validTest.call(ingredient);
        }
    }
    static createWithIdx(seriesIdx: number, ingredientIdxList: number[]) {
        return SeriesFilterDTO.createByJson(
            Object.assign({}, SeriesHelper.createWithIdx(seriesIdx), {
                ingredients: ingredientIdxList.map((ingredientIdx) =>
                    IngredientMockHelper.createWithIdx(ingredientIdx, seriesIdx)
                ),
            })
        );
    }
}

export default SeriesFilterMockHelper;
