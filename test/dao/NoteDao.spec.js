const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const noteDao = require('../../dao/NoteDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');
const { queryParam_Parse } = require('../../utils/db/pool.js');

describe('# NoteDao Test', () => {
    describe(' # create Test', () => {
        let ingredientName, perfumeName;
        before(async () => {
            ingredientName = (
                await pool.queryParam_Parse('SELECT name FROM ingredient')
            )[0].name;
            perfumeName = (
                await pool.queryParam_Parse('SELECT name FROM perfume')
            )[1].name;
        });
        it(' # success case', (done) => {
            noteDao
                .create({ ingredientName, perfumeName, type: 111 })
                .then((result) => {
                    expect(result).gt(0);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
        it(' # DuplicatedEntryError case', (done) => {
            noteDao
                .create({ ingredientName, perfumeName, type: 111 })
                .then((result) => {
                    console.log(result);
                    expect(false).true();
                    done();
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                });
        });
        after(() => {
            pool.queryParam_Parse("DELETE FROM note WHERE type = '111'");
        });
    });

    describe(' # read Test', () => {
        let perfumeIdx;
        before(async () => {
            perfumeIdx = (
                await pool.queryParam_Parse('SELECT perfume_idx FROM perfume')
            )[0].perfume_idx;
        });
        it('# success case', (done) => {
            noteDao
                .read(perfumeIdx)
                .then((result) => {
                    expect(result.length).gt(0);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
    });

    describe(' # update Test', () => {
        let ingredientName, perfumeName, type, ingredientIdx, perfumeIdx;
        before(async () => {
            const result = await pool.queryParam_Parse('SELECT * FROM note');
            ingredientIdx = result[0].ingredient_idx;
            perfumeIdx = result[0].perfume_idx;
            type = result[0].type;

            ingredientName = (
                await pool.queryParam_Parse(
                    `SELECT name FROM ingredient WHERE ingredient_idx=${ingredientIdx}`
                )
            )[0].name;
            perfumeName = (
                await pool.queryParam_Parse(
                    `SELECT name FROM perfume WHERE perfume_idx=${perfumeIdx}`
                )
            )[0].name;
        });
        it('# note type update success case', (done) => {
            noteDao
                .updateType({ type: 111, perfumeName, ingredientName })
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
        after(async () => {
            await pool.queryParam_Parse(
                `UPDATE note SET type = ${type} WHERE perfume_idx = ${perfumeIdx} AND ingredient_idx = ${ingredientIdx}`
            );
        });
    });

    describe(' # delete Test', () => {});
});
