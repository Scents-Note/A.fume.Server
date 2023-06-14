import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import SeriesDao from '@dao/SeriesDao';

import { PagingDTO, ListAndCountDTO } from '@dto/index';

const seriesDao = new SeriesDao();

import { Series } from '@sequelize';

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
});
