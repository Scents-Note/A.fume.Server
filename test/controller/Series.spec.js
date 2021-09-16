const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');

const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';
const { ListAndCountDTO, CreatedResultDTO } = require('../../data/dto');
const IngredientDTO = require('../data/dto/IngredientDTO');
const SeriesDTO = require('../data/dto/SeriesDTO');
const { SeriesFilterVO } = require('../../data/vo');

const Series = require('../../controllers/Series.js');
const mockSeriesService = {};
Series.setSeriesService(mockSeriesService);

describe('# Series Controller Test', () => {
    describe('# getSeriesAll Test', () => {
        mockSeriesService.getSeriesAll = async () =>
            new ListAndCountDTO({
                count: 1,
                rows: [
                    SeriesDTO.create(),
                    SeriesDTO.create(),
                    SeriesDTO.create(),
                ],
            });
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

    // TODO getIngredients Test
    describe('# getIngredients', () => {
        it('success case', (done) => {
            done();
        });
    });

    describe('# getFilterSeries Test', () => {
        mockSeriesService.getFilterSeries = async () =>
            new ListAndCountDTO({
                count: 1,
                rows: [
                    new SeriesFilterVO({
                        series: SeriesDTO.create(),
                        ingredients: [
                            IngredientDTO.createWithIdx({
                                ingredientIdx: 1,
                                seriesIdx: 1,
                            }),
                            IngredientDTO.createWithIdx({
                                ingredientIdx: 3,
                                seriesIdx: 1,
                            }),
                            IngredientDTO.createWithIdx({
                                ingredientIdx: 5,
                                seriesIdx: 1,
                            }),
                        ],
                    }),
                    new SeriesFilterVO({
                        series: SeriesDTO.create({
                            seriesIdx: 2,
                            name: '계열2',
                            englishName: 'SERIES2',
                        }),
                        ingredients: [
                            IngredientDTO.createWithIdx({
                                ingredientIdx: 7,
                                seriesIdx: 1,
                            }),
                        ],
                    }),
                    new SeriesFilterVO({
                        series: SeriesDTO.create({
                            seriesIdx: 3,
                            name: '계열3',
                            englishName: 'SERIES3',
                        }),
                        ingredients: [
                            IngredientDTO.createWithIdx({
                                ingredientIdx: 9,
                                seriesIdx: 1,
                            }),
                        ],
                    }),
                ],
            });
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
});
