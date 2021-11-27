import dotenv from 'dotenv';
import request from 'supertest';
import { Done } from 'mocha';
dotenv.config();

import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import StatusCode from '../../src/utils/statusCode';
import SeriesDTO from '../../src/data/dto/SeriesDTO';
import SeriesFilterDTO from '../../src/data/dto/SeriesFilterDTO';

import SeriesMockHelper from '../data/dto/SeriesMockHelper';
import SeriesFilterMockHelper from '../data/dto/SeriesFilterMockHelper';

const app = require('../../src/index.js');
const expect = require('../utils/expect');

const basePath = '/A.fume/api/0.0.1';

const Series = require('../../src/controllers/Series');
const mockSeriesService: any = {};
Series.setSeriesService(mockSeriesService);

describe('# Series Controller Test', () => {
    describe('# getSeriesAll Test', () => {
        mockSeriesService.getSeriesAll = async () =>
            new ListAndCountDTO<SeriesDTO>(1, [
                SeriesMockHelper.create({}),
                SeriesMockHelper.create({}),
                SeriesMockHelper.create({}),
            ]);
        it('success case', (done: Done) => {
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
        it('success case', (done: Done) => {
            done();
        });
    });

    describe('# getFilterSeries Test', () => {
        mockSeriesService.getFilterSeries = async () =>
            new ListAndCountDTO<SeriesFilterDTO>(1, [
                SeriesFilterMockHelper.createWithIdx(1, [1, 3, 5]),
                SeriesFilterMockHelper.createWithIdx(2, [7]),
                SeriesFilterMockHelper.createWithIdx(3, [9]),
            ]);
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/filter/series`)
                .send({})
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('계열 검색 성공');
                    expect(data.count).to.be.eq(1);
                    data.rows.forEach((item: any) => {
                        expect.hasProperties.call(
                            item,
                            'seriesIdx',
                            'name',
                            'ingredients'
                        );
                    });
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
