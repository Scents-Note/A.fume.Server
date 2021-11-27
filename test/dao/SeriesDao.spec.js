import dotenv from 'dotenv';
dotenv.config();

import {
    NotMatchedError,
    UnExpectedError,
} from '../../src/utils/errors/errors';
import PagingDTO from '../../src/data/dto/PagingDTO';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';

import SeriesDTO from '../../src/data/dto/SeriesDTO';
import SeriesMockHelper from '../data/dto/SeriesMockHelper';

const chai = require('chai');
const { expect } = chai;
const seriesDao = require('../../src/dao/SeriesDao.js');

const { Series } = require('../../src/models/index.js');

describe('# seriesDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# read Test', () => {
        let seriesIdx;
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
        it('# success case(readyByIdx)', (done) => {
            seriesDao
                .readByIdx(seriesIdx)
                .then((result) => {
                    expect(result).instanceOf(SeriesDTO);
                    SeriesMockHelper.validTest.call(result);
                    expect(result.seriesIdx).to.be.eq(seriesIdx);
                    expect(result.name).to.be.eq('읽기 데이터');
                    expect(result.englishName).to.be.eq('Test Data');
                    done();
                })
                .catch((err) => done(err));
        });
        it('# success case(readByName)', (done) => {
            seriesDao
                .readByName('읽기 데이터')
                .then((result) => {
                    expect(result).instanceOf(SeriesDTO);
                    SeriesMockHelper.validTest.call(result);
                    expect(result.name).to.be.eq('읽기 데이터');
                    expect(result.englishName).to.be.eq('Test Data');
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Series.destroy({ where: { seriesIdx } });
        });
    });

    describe(' # readAll Test', () => {
        it(' # success case', (done) => {
            seriesDao
                .readAll(new PagingDTO(100, 1, []))
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    // ListAndCountDTO.validTest.call(result, SeriesDTO.validTest);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# search Test', () => {
        it('# success case', (done) => {
            seriesDao
                .search(new PagingDTO(10, 1, [['createdAt', 'desc']]))
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    // ListAndCountDTO.validTest.call(result, SeriesDTO.validTest);
                    const originString = result.rows
                        .map((it) => it.seriesIdx)
                        .toString();
                    const sortedString = result.rows
                        .sort((a, b) => a.createdAt > b.createdAt)
                        .map((it) => it.seriesIdx)
                        .toString();
                    expect(sortedString).to.be.eq(originString);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# findSeries success case', (done) => {
            seriesDao
                .findSeries({
                    name: '계열1',
                })
                .then((result) => {
                    expect(result.seriesIdx).to.be.eq(1);
                    expect(result.name).to.be.eq('계열1');
                    SeriesMockHelper.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# findSeries not found case', (done) => {
            seriesDao
                .findSeries({
                    name: '계열10',
                })
                .then(() => {
                    throw new UnExpectedError(NotMatchedError);
                })
                .catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
