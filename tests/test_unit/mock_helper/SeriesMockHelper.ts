import { SeriesDTO } from '@dto/index';

class SeriesMockHelper {
    static create(condition: any): SeriesDTO {
        return SeriesDTO.createByJson(
            Object.assign(
                {
                    seriesIdx: 1,
                    name: '계열1',
                    englishName: 'SERIES1',
                    imageUrl: 'http://',
                    description: '이것은 계열',
                    createdAt: '2021-07-24T03:38:52.000Z',
                    updatedAt: '2021-07-24T03:38:52.000Z',
                },
                condition
            )
        );
    }

    static createWithIdx(seriesIdx: number): SeriesDTO {
        return SeriesDTO.createByJson({
            seriesIdx,
            name: `계열 ${seriesIdx}`,
            englishName: `SERIES ${seriesIdx}`,
            imageUrl: 'http://',
            description: '이것은 계열',
            createdAt: '2021-07-24T03:38:52.000Z',
            updatedAt: '2021-07-24T03:38:52.000Z',
        });
    }
}

export default SeriesMockHelper;
