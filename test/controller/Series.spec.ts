import dotenv from 'dotenv';
import request from 'supertest';
import { Done } from 'mocha';
dotenv.config();

import {
    MSG_GET_SERIES_ALL_SUCCESS,
    MSG_SEARCH_SERIES_LIST_SUCCESS,
} from '@utils/strings';

import StatusCode from '@utils/statusCode';

import { ListAndCountDTO, SeriesDTO, SeriesFilterDTO } from '@dto/index';

import SeriesMockHelper from '../mock_helper/SeriesMockHelper';
import SeriesFilterMockHelper from '../mock_helper/SeriesFilterMockHelper';

import app from '@src/app';

const expect = require('../utils/expect');

const basePath = '/A.fume/api/0.0.1';

const Series = require('@controllers/Series');
const mockSeriesService: any = {};
Series.setSeriesService(mockSeriesService);
const SERIES_IDX_ETC: number = 1;

describe('# Series Controller Test', () => {
    describe('# getSeriesAll Test', () => {
        mockSeriesService.getSeriesAll = async () =>
            new ListAndCountDTO<SeriesDTO>(3, [
                SeriesMockHelper.create({ seriesIdx: 1 }),
                SeriesMockHelper.create({ seriesIdx: 2 }),
                SeriesMockHelper.create({ seriesIdx: 3 }),
            ]);
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/series`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_GET_SERIES_ALL_SUCCESS);
                    expect(data.count).to.be.eq(2);
                    data.rows.forEach((item: SeriesDTO) => {
                        expect.hasProperties.call(
                            item,
                            'seriesIdx',
                            'name',
                            'imageUrl'
                        );
                        expect(item.seriesIdx).to.be.not.eq(SERIES_IDX_ETC);
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
                    expect(message).to.be.eq(MSG_SEARCH_SERIES_LIST_SUCCESS);
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
