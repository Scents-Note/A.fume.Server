const dotenv = require('dotenv');
dotenv.config();
const request = require('supertest');

const chai = require('chai');
const { expect } = chai;
const app = require('../../src/index.js');

const basePath = '/A.fume/api/0.0.1';
const { ListAndCountDTO } = require('../../src/data/dto');
const statusCode = require('../../src/utils/statusCode');
const SeriesDTO = require('../data/dto/SeriesDTO');
const SeriesFilterDTO = require('../data/dto/SeriesFilterDTO');
const SeriesResponseDTO = require('../data/response_dto/series/SeriesResponseDTO');
const SeriesFilterResponseDTO = require('../data/response_dto/series/SeriesFilterResponseDTO');

const Series = require('../../src/controllers/Series.js');
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
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('series 전체 조회 성공');
                    expect(data.count).to.be.eq(1);
                    data.rows.forEach((item) => {
                        SeriesResponseDTO.validTest.call(item);
                    });
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
                    SeriesFilterDTO.createWithIdx({
                        seriesIdx: 1,
                        ingredientIdxList: [1, 3, 5],
                    }),
                    SeriesFilterDTO.createWithIdx({
                        seriesIdx: 2,
                        ingredientIdxList: [7],
                    }),
                    SeriesFilterDTO.createWithIdx({
                        seriesIdx: 3,
                        ingredientIdxList: [9],
                    }),
                ],
            });
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/filter/series`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('계열 검색 성공');
                    expect(data.count).to.be.eq(1);
                    data.rows.forEach((item) => {
                        SeriesFilterResponseDTO.validTest.call(item);
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
