const dotenv = require('dotenv');
dotenv.config({path: './config/.env.test'});

const chai = require('chai');
const { expect } = chai;
const noteDao = require('../../dao/NoteDao.js');
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
            perfume_idx = (await pool.queryParam_Parse("SELECT perfume_idx FROM perfume"))[1].perfume_idx;
        })
        // 성공 케이스
        it(' # success case', (done) => {
            noteDao.create({ingredient_idx, perfume_idx, type: 1}).then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        // 중복 데이터 발생 케이스
        it(' # DuplicatedEntryError case', (done) => {
            noteDao.create({ingredient_idx, perfume_idx, type: 1}).then((result) => {
                console.log(result)
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
    });

    describe(' # read Test', () => {
        let perfume_idx
        before(async() => {
            perfume_idx = (await pool.queryParam_Parse("SELECT perfume_idx FROM perfume"))[0].perfume_idx;
        })
        it('# success case', (done) => {
            noteDao.read(perfume_idx).then((result) => {
                expect(result.length).gt(0);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
    });

    describe(' # create Test', () => {
    });

});