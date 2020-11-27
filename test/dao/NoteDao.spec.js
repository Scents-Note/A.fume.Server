const dotenv = require('dotenv');
dotenv.config({path: './config/.env.test'});

const chai = require('chai');
const { expect } = chai;
const NoteDao = require('../../dao/NoteDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError
} = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# NoteDao Test', () => {
    describe(' # create Test', () => {
        let ingredient_idx, perfume_idx
        before(async() => {
            ingredient_idx = (await pool.queryParam_Parse("SELECT ingredient_idx FROM ingredient"))[0].ingredient_idx;
            perfume_idx = (await pool.queryParam_Parse("SELECT perfume_idx FROM perfume"))[0].perfume_idx;
        })
        // 성공 케이스
        it(' # success case', (done) => {
            noteDao.create({ingredient_idx : 1, }).then((result) => {
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

    describe(' # read Test', () => {
    });

    describe(' # create Test', () => {
    });

});