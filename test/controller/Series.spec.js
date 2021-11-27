import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import { expect } from 'chai';

import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import StatusCode from '../../src/utils/statusCode';

const app = require('../../src/index.js');

const basePath = '/A.fume/api/0.0.1';
const SeriesDTO = require('../data/dto/SeriesDTO');
const SeriesFilterDTO = require('../data/dto/SeriesFilterDTO');

const Series = require('../../src/controllers/Series.js');
const mockSeriesService = {};
Series.setSeriesService(mockSeriesService);

describe('# Series Controller Test', () => {
    describe('# getSeriesAll Test', () => {
        mockSeriesService.getSeriesAll = async () =>
            /* TODO */
            // new ListAndCountDTO<SeriesDTO>(
            new ListAndCountDTO(1, [
                SeriesDTO.create(),
                SeriesDTO.create(),
                SeriesDTO.create(),
            ]);
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/series`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('series 전체 조회 성공');
                    expect(data.count).to.be.eq(1);
                    data.rows.forEach((item) => {
                        expect.hasProperties.call(item, 'seriesIdx', 'name');
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
            /* TODO */
            // new ListAndCountDTO<SeriesFilterDTO>(
            new ListAndCountDTO(1, [
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
            ]);
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/filter/series`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('계열 검색 성공');
                    expect(data.count).to.be.eq(1);
                    data.rows.forEach((item) => {
                        expect.hasProperties.call(
                            item,
                            'seriesIdx',
                            'name',
                            'ingredients'
                        );
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
