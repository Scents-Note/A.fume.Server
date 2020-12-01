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
        it(' # success case', (done) => {
            noteDao.create({ingredient_idx, perfume_idx, type: 1}).then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
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

    describe(' # update Type Test', () => {
        let ingredient_idx, perfume_idx, type;
        before(async () => {
            const result = await pool.queryParam_Parse("SELECT * FROM note limit 1");
            ingredient_idx = result[0].ingredient_idx;
            perfume_idx = result[0].perfume_idx;
            type = result[0].type;
        });
        it('# note type update success case', (done) => {
            noteDao.updateType({ingredient_idx, type : 5, perfume_idx})
            .then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            await pool.queryParam_Parse(`UPDATE note SET type = ${type} WHERE perfume_idx = ${perfume_idx} AND ingredient_idx = ${ingredient_idx}`);
        });
    });

    describe(' # update Ingredient Test', () => {
        let ingredient_idx, perfume_idx, type, temp_ingredient_idx;
        before(async () => {
            const result = await pool.queryParam_Parse("SELECT * FROM note limit 1");
            ingredient_idx = result[0].ingredient_idx;
            perfume_idx = result[0].perfume_idx;
            type = result[0].type;
            const result2 = await pool.queryParam_Parse("SELECT ingredient_idx FROM ingredient limit 1");
            temp_ingredient_idx = result2[0].ingredient_idx;
        });
        it('# note type update success case', (done) => {
            noteDao.updateIngredient({ingredient_idx : temp_ingredient_idx, type, perfume_idx})
            .then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            await pool.queryParam_Parse(`UPDATE note SET ingredient_idx = ${ingredient_idx} WHERE perfume_idx = ${perfume_idx} AND type = ${type}`);
        });
    });

    describe(' # delete Test', () => {
    });
});