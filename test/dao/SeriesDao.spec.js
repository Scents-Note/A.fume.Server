const chai = require('chai');
const { expect } = chai;
const seriesDao = require('../../dao/SeriesDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError
} = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# seriesDao Test', () => {
    describe(' # create Test', () => {
        // 중복 데이터 미리 삭제
        before(async () => {
            await pool.queryParam_None("DELETE FROM series WHERE name = '테스트 데이터'");
        });
        // 성공 케이스
        it(' # success case', (done) => {
            seriesDao.create({name : '테스트 데이터', english_name : 'Test Data', description : '왈라왈라'}).then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        // 중복 데이터 발생 케이스
        it(' # DuplicatedEntryError case', (done) => {
            seriesDao.create({name : '테스트 데이터', english_name : 'Test Data', description : '왈라왈라'}).then((result) => {
                console.log(result)
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
        // 테스트 데이터 삭제
        after(async() => {
            await pool.queryParam_None("DELETE FROM series WHERE name='테스트 데이터'");
        });
    });

    describe('# read Test', () => {
        let series_idx;
        before(async () => {
            await pool.queryParam_Parse("INSERT series(name, english_name) VALUES(?, ?)", ["읽기 데이터", "Test Data"]);
            const result = await pool.queryParam_Parse("SELECT series_idx FROM series WHERE name = ?", ["읽기 데이터"]);
            series_idx = result[0].series_idx;
        });
        it('# success case', (done) => {
            seriesDao.read(series_idx).then((result) => {
                expect(result.name).eq('읽기 데이터');
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async() => {
            await pool.queryParam_None(`DELETE FROM series WHERE series_idx=${series_idx}`);
        });
    });

    describe(' # readAll Test', () => {
        it(' # success case', (done) => {
            seriesDao.readAll().then((result) => {
                expect(result).greaterThan(0);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
    });

    describe('# update Test', () => {
        let series_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM series WHERE name='테스트 데이터'");
            const result = await pool.queryParam_None("INSERT INTO series(name, english_name) VALUES('테스트 데이터','Test Data')");
            series_idx = result.insertId;
        });
        it('# success case', (done) => {
            seriesDao.update({series_idx, name:'수정 데이터', english_name:'Update Data'})
            .then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
        after(async () => {
            await pool.queryParam_None(`DELETE FROM series WHERE series_idx=${series_idx}`);
        });
    });
    
    describe('# delete Test', () => {
        let series_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM series WHERE name='삭제테스트'");
            const result = await pool.queryParam_None("INSERT series(name, english_name) values('삭제 데이터','Delete Data')");
            series_idx = result.insertId;
        });
        it('# success case', (done) => {
            seriesDao.delete(series_idx).then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            if(!series_idx) return;
            await pool.queryParam_None(`DELETE FROM series WHERE series_idx=${series_idx}`);
        });
    });
});