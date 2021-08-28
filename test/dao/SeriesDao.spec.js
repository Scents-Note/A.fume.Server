const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const seriesDao = require('../../dao/SeriesDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
    UnExpectedError,
} = require('../../utils/errors/errors.js');
const { Series } = require('../../models/index.js');
const { CreatedResultDTO } = require('../../data/dto');
const { PagingVO } = require('../../data/vo');
const SeriesDTO = require('../data/dto/SeriesDTO.js');

describe('# seriesDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe(' # create Test', () => {
        before(async () => {
            await Series.destroy({ where: { name: '테스트 데이터' } });
        });
        it(' # success case', (done) => {
            seriesDao
                .create(
                    new SeriesDTO({
                        name: '테스트 데이터',
                        englishName: 'Test Data',
                        description: '왈라왈라',
                        imageUrl: 'imageUrl',
                    })
                )
                .then((result) => {
                    expect(result).to.be.instanceOf(CreatedResultDTO);
                    const { idx, created } = result;
                    expect(idx).to.be.gt(0);
                    return created;
                })
                .then((result) => {
                    expect(result.name).to.be.eq('테스트 데이터');
                    expect(result.englishName).to.be.eq('Test Data');
                    expect(result.description).to.be.eq('왈라왈라');
                    expect(result.imageUrl).to.be.eq('imageUrl');
                    result.validTest();
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # DuplicatedEntryError case', (done) => {
            seriesDao
                .create(
                    new SeriesDTO({
                        name: '테스트 데이터',
                        englishName: 'Test Data',
                        description: '왈라왈라',
                        imageUrl: 'imageUrl',
                    })
                )
                .then(() => done(new UnExpectedError(DuplicatedEntryError)))
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });

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
                    result.validTest();
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
                    result.validTest();
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
                .readAll(new PagingVO({ pagingIndex: 1, pagingSize: 100 }))
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# search Test', () => {
        it('# success case', (done) => {
            seriesDao
                .search(
                    new PagingVO({
                        pagingIndex: 1,
                        pagingSize: 10,
                        order: [['createdAt', 'desc']],
                    })
                )
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    result.validTest();
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
                    result.validTest();
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

    describe('# update Test', () => {
        let seriesIdx;
        before(async () => {
            seriesIdx = (
                await Series.upsert({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: 'description',
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
                    description: 'description',
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
