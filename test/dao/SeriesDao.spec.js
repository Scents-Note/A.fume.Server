const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const seriesDao = require('../../dao/SeriesDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const { sequelize, Series } = require('../../models/index.js');

describe('# seriesDao Test', () => {
    before(async () => {
        await sequelize.sync();
        await require('./seeds.js')();
    });
    describe(' # create Test', () => {
        // 중복 데이터 미리 삭제
        before(async () => {
            await Series.destroy({ where: { name: '테스트 데이터' } });
        });
        // 성공 케이스
        it(' # success case', (done) => {
            seriesDao
                .create({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '왈라왈라',
                })
                .then((result) => {
                    return Series.findOne({ where: { name: '테스트 데이터' } });
                })
                .then((result) => {
                    expect(result.name).eq('테스트 데이터');
                    expect(result.englishName).eq('Test Data');
                    expect(result.description).eq('왈라왈라');
                    done();
                })
                .catch((err) => done(err));
        });
        // 중복 데이터 발생 케이스
        it(' # DuplicatedEntryError case', (done) => {
            seriesDao
                .create({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '왈라왈라',
                })
                .then(() => done(new Error('expected DuplicatedEntryError')))
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        // 테스트 데이터 삭제
        after(async () => {
            await Series.destroy({ where: { name: '테스트 데이터' } });
        });
    });

    describe('# read Test', () => {
        let seriesIdx;
        before(async () => {
            seriesIdx = (
                await Series.upsert({
                    name: '읽기 데이터',
                    englishName: 'Test Data',
                    description: '',
                })
            )[0].seriesIdx;
        });
        it('# success case(readyByIdx)', (done) => {
            seriesDao
                .readByIdx(seriesIdx)
                .then((result) => {
                    expect(result.name).eq('읽기 데이터');
                    done();
                })
                .catch((err) => done(err));
        });
        it('# success case(readByName)', (done) => {
            seriesDao
                .readByName('읽기 데이터')
                .then((result) => {
                    expect(result.name).eq('읽기 데이터');
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
                .readAll()
                .then((result) => {
                    expect(result.length).greaterThan(0);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# read By ingredientIdx Test', () => {
        it('# success case', (done) => {
            seriesDao
                .readByIngredientIdx(1)
                .then((result) => {
                    expect(result.length).eq(5);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# search Test', () => {
        it('# success case', (done) => {
            seriesDao.search(1, 10, [['createdAt', 'desc']]).then((result) => {
                expect(result.count).gt(0);
                expect(result.rows.length).gt(0);
                done();
            });
        });
    });

    describe('# update Test', () => {
        let seriesIdx;
        before(async () => {
            seriesIdx = (
                await Series.upsert({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '',
                })
            )[0].seriesIdx;
        });
        it('# success case', (done) => {
            seriesDao
                .update({
                    seriesIdx,
                    name: '수정 데이터',
                    english_name: 'Update Data',
                })
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Series.destroy({ where: { seriesIdx } });
        });
    });

    describe('# delete Test', () => {
        let seriesIdx;
        before(async () => {
            seriesIdx = (
                await Series.upsert({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '',
                })
            )[0].seriesIdx;
        });
        it('# success case', (done) => {
            seriesDao
                .delete(seriesIdx)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Series.destroy({ where: { seriesIdx } });
        });
    });
});
