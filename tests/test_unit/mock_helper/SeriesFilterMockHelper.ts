import { SeriesFilterDTO } from '@dto/index';

import SeriesHelper from './SeriesMockHelper';

class SeriesFilterMockHelper {
    static createWithIdx(seriesIdx: number, ingredientIdxList: number[]) {
        return SeriesFilterDTO.createByJson(
            Object.assign({}, SeriesHelper.createWithIdx(seriesIdx), {
                ingredientCategoryList: ingredientIdxList.map(
                    (ingredientIdx) => '카테고리' + ingredientIdx
                ),
            })
        );
    }
}

export default SeriesFilterMockHelper;
