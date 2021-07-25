const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');
require('../../lib/token').verify = (token) => {
    return {
        userIdx: 1,
    };
};

const basePath = '/A.fume/api/0.0.1';
const {
    SeriesDTO,
    IngredientDTO,
    ListAndCountDTO,
    CreatedResultDTO,
} = require('../../data/dto');
const { SeriesFilterVO } = require('../../data/vo');

const mockSeriesDTO = new SeriesDTO({
    seriesIdx: 1,
    name: '계열1',
    englishName: 'SERIES1',
    imageUrl: 'http://',
    description: '이것은 계열',
    createdAt: '2021-07-24T03:38:52.000Z',
    updatedAt: '2021-07-24T03:38:52.000Z',
});

const mockSeriesInputDTO = {
    name: '꿀',
    englishName: 'Honey',
    description: '화이트 허니, 허니',
    imageUrl: 'http://',
};

const mockListAndCountDTO = new ListAndCountDTO({
    count: 1,
    rows: [mockSeriesDTO, mockSeriesDTO, mockSeriesDTO],
});

const Series = require('../../controllers/Series.js');
Series.setSeriesService({
    postSeries: async (seriesDTO) =>
        new CreatedResultDTO({
            idx: 1,
            created: mockSeriesDTO,
        }),
    getSeriesByIdx: async () => mockSeriesDTO,
    getSeriesAll: async () => mockListAndCountDTO,
    searchSeries: async () => mockListAndCountDTO,
    putSeries: async () => 1,
    deleteSeries: async () => 1,
    getFilterSeries: async () =>
        new ListAndCountDTO({
            count: 1,
            rows: [
                new SeriesFilterVO({
                    series: {
                        seriesIdx: 1,
                        name: '계열1',
                        englishName: 'SERIES1',
                        description: '이것은 계열',
                        imageUrl: 'http://',
                        createdAt: '2021-07-24T03:38:52.000Z',
                        updatedAt: '2021-07-24T03:38:52.000Z',
                    },
                    ingredients: [
                        new IngredientDTO({
                            ingredientIdx: 1,
                            name: '재료1',
                            englishName: 'Ingredient 1',
                            description: '이것은 재료',
                            imageUrl: 'http://',
                            seriesIdx: 1,
                            createdAt: '2021-07-24T03:38:52.000Z',
                            updatedAt: '2021-07-24T03:38:52.000Z',
                        }),
                        new IngredientDTO({
                            ingredientIdx: 3,
                            name: '재료3',
                            englishName: 'Ingredient 3',
                            description: '이것은 재료',
                            imageUrl: 'http://',
                            seriesIdx: 1,
                            createdAt: '2021-07-24T03:38:52.000Z',
                            updatedAt: '2021-07-24T03:38:52.000Z',
                        }),
                        new IngredientDTO({
                            ingredientIdx: 5,
                            name: '재료5',
                            englishName: 'Ingredient 5',
                            description: '이것은 재료',
                            imageUrl: 'http://',
                            seriesIdx: 1,
                            createdAt: '2021-07-24T03:38:52.000Z',
                            updatedAt: '2021-07-24T03:38:52.000Z',
                        }),
                    ],
                }),
                new SeriesFilterVO({
                    series: {
                        seriesIdx: 2,
                        name: '계열2',
                        englishName: 'SERIES2',
                        description: '이것은 계열',
                        imageUrl: 'http://',
                        createdAt: '2021-07-24T03:38:52.000Z',
                        updatedAt: '2021-07-24T03:38:52.000Z',
                    },
                    ingredients: [
                        new IngredientDTO({
                            ingredientIdx: 7,
                            name: '재료7',
                            englishName: 'Ingredient 7',
                            description: '이것은 재료',
                            imageUrl: 'http://',
                            seriesIdx: 2,
                            createdAt: '2021-07-24T03:38:52.000Z',
                            updatedAt: '2021-07-24T03:38:52.000Z',
                        }),
                    ],
                }),
                new SeriesFilterVO({
                    series: {
                        seriesIdx: 3,
                        name: '계열3',
                        englishName: 'SERIES3',
                        description: '이것은 계열',
                        imageUrl: 'http://',
                        createdAt: '2021-07-24T03:38:52.000Z',
                        updatedAt: '2021-07-24T03:38:52.000Z',
                    },
                    ingredients: [
                        new IngredientDTO({
                            ingredientIdx: 9,
                            name: '재료9',
                            englishName: 'Ingredient 9',
                            description: '이것은 재료',
                            imageUrl: 'http://',
                            seriesIdx: 3,
                            createdAt: '2021-07-24T03:38:52.000Z',
                            updatedAt: '2021-07-24T03:38:52.000Z',
                        }),
                    ],
                }),
            ],
        }),
    findSeriesByEnglishName: async () => mockSeriesDTO,
});

describe('# Series Controller Test', () => {
    describe('# postSeries Test', () => {
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/series`)
                .set('x-access-token', 'Bearer {token}')
                .send(mockSeriesInputDTO)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('series post 성공');
                    expect(data).to.be.eq(1);
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .post(`${basePath}/series`)
                .send(mockSeriesInputDTO)
                .expect((res) => {
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('권한이 없습니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeries Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/series/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data: series } = res.body;
                    expect(message).to.be.eq('series 개별 조회 성공');
                    expect(series).to.be.have.property('seriesIdx');
                    expect(series).to.be.have.property('name');
                    expect(series).to.be.have.property('imageUrl');
                    expect(series).to.be.have.property('description');
                    expect(Object.entries(series).length).to.be.eq(4);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesAll Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/series`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('series 전체 조회 성공');
                    expect(data.count).to.be.eq(1);
                    for (const series of data.rows) {
                        expect(series).to.be.have.property('seriesIdx');
                        expect(series).to.be.have.property('name');
                        expect(Object.entries(series).length).to.be.eq(2);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# searchSeries Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/series/search`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('계열 검색 성공');
                    expect(data.count).to.be.eq(1);
                    for (const series of data.rows) {
                        expect(series).to.be.have.property('seriesIdx');
                        expect(series).to.be.have.property('name');
                        expect(Object.entries(series).length).to.be.eq(2);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# putSeries Test', () => {
        it('success case', (done) => {
            request(app)
                .put(`${basePath}/series/1`)
                .set('x-access-token', 'Bearer {token}')
                .send(mockSeriesInputDTO)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message } = res.body;
                    expect(message).to.be.eq('series put 성공');
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .put(`${basePath}/series/1`)
                .send(mockSeriesInputDTO)
                .expect((res) => {
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('권한이 없습니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    // TODO getIngredients Test
    describe('# getIngredients', () => {
        it('success case', (done) => {
            done();
        });
    });

    describe('# deleteSeries Test', () => {
        it('success case', (done) => {
            request(app)
                .delete(`${basePath}/series/1`)
                .set('x-access-token', 'Bearer {token}')
                .send(mockSeriesInputDTO)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message } = res.body;
                    expect(message).to.be.eq('series delete 성공');
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .delete(`${basePath}/series/1`)
                .send(mockSeriesInputDTO)
                .expect((res) => {
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('권한이 없습니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterSeries Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/filter/series`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('계열 검색 성공');
                    expect(data.count).to.be.eq(1);
                    for (const seriesFilter of data.rows) {
                        expect(seriesFilter).to.be.have.property('seriesIdx');
                        expect(seriesFilter).to.be.have.property('name');
                        expect(seriesFilter).to.be.have.property('ingredients');
                        expect(Object.entries(seriesFilter).length).to.be.eq(3);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getSeriesByEnglishName Test', () => {
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/series/find`)
                .send({ englishName: 'Floral' })
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data: series } = res.body;
                    expect(message).to.be.eq('계열 조회 성공');
                    expect(series).to.be.have.property('seriesIdx');
                    expect(series).to.be.have.property('name');
                    expect(series).to.be.have.property('imageUrl');
                    expect(series).to.be.have.property('description');
                    expect(Object.entries(series).length).to.be.eq(4);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
