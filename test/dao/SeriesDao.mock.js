const { SeriesDTO, ListAndCountDTO } = require('../../data/dto');

const mockSeriesDTO = new SeriesDTO({
    seriesIdx: 1,
    name: '계열1',
    englishName: 'SERIES1',
    imageUrl: 'http://',
    description: '이것은 계열',
    createdAt: '2021-07-24T03:38:52.000Z',
    updatedAt: '2021-07-24T03:38:52.000Z',
});

const mockSeriesGenerator = (seriesIdx) =>
    new SeriesDTO({
        seriesIdx: seriesIdx,
        name: '계열' + seriesIdx,
        englishName: 'SERIES' + seriesIdx,
        imageUrl: 'http://',
        description: '이것은 계열',
        createdAt: '2021-07-24T03:38:52.000Z',
        updatedAt: '2021-07-24T03:38:52.000Z',
    });

const mockListAndCountDTO = new ListAndCountDTO({
    count: 1,
    rows: [
        mockSeriesGenerator(1),
        mockSeriesGenerator(2),
        mockSeriesGenerator(3),
    ],
});

module.exports = {
    readByIdx: async (seriesIdx) => mockSeriesDTO,
    readAll: async () => mockListAndCountDTO,
    search: async () => mockListAndCountDTO,
    findSeries: async () => mockSeriesDTO,
};
