import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import { NotMatchedError, UnExpectedError } from '@errors';

import SeriesDao from '@dao/SeriesDao';

import { PagingDTO, ListAndCountDTO, SeriesDTO } from '@dto/index';

import SeriesMockHelper from '../mock_helper/SeriesMockHelper';

const seriesDao = new SeriesDao();

const { Series } = require('@sequelize');

describe('# seriesDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# read Test', () => {
        let seriesIdx: number = 0;
        before(async () => {
            seriesIdx = (
                await Series.upsert({
                    name: '읽기 데이터',
                    englishName: 'Test Data',
                    description: 'description',
                    imageUrl: 'image-url',
                })
            )[0].seriesIdx;
        });
        after(async () => {
            await Series.destroy({ where: { seriesIdx } });
        });
    });

    describe(' # readAll Test', () => {
        it(' # success case', (done: Done) => {
            seriesDao
                .readAll(new PagingDTO(100, 1, []))
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# search Test', () => {
        it('# success case', (done: Done) => {
            seriesDao
                .search(new PagingDTO(10, 1, [['createdAt', 'desc']]))
                .then((result: ListAndCountDTO<SeriesDTO>) => {
                    const originString = result.rows
                        .map((it) => it.seriesIdx)
                        .toString();
                    const sortedString: string = result.rows
                        .sort((a: SeriesDTO, b: SeriesDTO) =>
                            a.createdAt > b.createdAt ? -1 : 1
                        )
                        .map((it) => it.seriesIdx)
                        .toString();
                    expect(sortedString).to.be.eq(originString);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# findSeries success case', (done: Done) => {
            seriesDao
                .findSeries({
                    name: '계열1',
                })
                .then((result: SeriesDTO) => {
                    expect(result.seriesIdx).to.be.eq(1);
                    expect(result.name).to.be.eq('계열1');
                    SeriesMockHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# findSeries not found case', (done: Done) => {
            seriesDao
                .findSeries({
                    name: '계열10',
                })
                .then(() => {
                    throw new UnExpectedError(NotMatchedError);
                })
                .catch((err: Error) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
