const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const noteDao = require('../../dao/NoteDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const { Note } = require('../../models');

describe('# NoteDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe(' # create Test', () => {
        before(async () => {
            await Note.destroy({ where: { ingredientIdx: 5, perfumeIdx: 1 } });
        });
        it(' # success case', (done) => {
            noteDao
                .create({ ingredientIdx: 5, perfumeIdx: 1, type: 1 })
                .then((result) => {
                    expect(result).to.not.be.null;
                    done();
                })
                .catch((err) => done(err));
        });
        it(' # DuplicatedEntryError case', (done) => {
            noteDao
                .create({ ingredientIdx: 5, perfumeIdx: 1, type: 1 })
                .then(() =>
                    done(new Error('must be expected DuplicatedEntryError'))
                )
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Note.destroy({ where: { ingredientIdx: 5, perfumeIdx: 1 } });
        });
    });

    describe(' # read Test', () => {
        it('# success case', (done) => {
            noteDao
                .read({ perfumeIdx: 1 })
                .then((result) => {
                    expect(result.length).gte(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# countIngredientUsed Test', () => {
        it('# success case', (done) => {
            const ingredientIdxList = [1, 2, 3, 4, 5];
            const expectedCountList = [5, 5, 5, 5, 4];
            noteDao
                .countIngredientUsed(ingredientIdxList)
                .then((result) => {
                    for (const json of result) {
                        expect(json.perfumeIdx).to.be.ok;
                        expect(json.ingredientIdx).to.be.oneOf(
                            ingredientIdxList
                        );
                        expect(json.type).to.be.ok;
                        expect(json.createdAt).to.be.ok;
                        expect(json.updatedAt).to.be.ok;
                        const expectedCount =
                            expectedCountList[
                                ingredientIdxList.indexOf(json.ingredientIdx)
                            ];
                        expect(json.count).to.be.gte(expectedCount);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe(' # update Test', () => {
        before(async () => {
            await Note.upsert({
                ingredientIdx: 5,
                perfumeIdx: 1,
                type: 1,
            });
        });
        it('# note type update success case', (done) => {
            noteDao
                .updateType({ type: 5, perfumeIdx: 1, ingredientIdx: 5 })
                .then((result) => {
                    expect(result).eq(1);
                    return Note.findOne({
                        where: { ingredientIdx: 5, perfumeIdx: 1 },
                    });
                })
                .then((result) => {
                    expect(result.type).to.eq(5);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe(' # delete Test', () => {
        before(async () => {
            await Note.upsert({
                ingredientIdx: 5,
                perfumeIdx: 1,
                type: 1,
            });
        });
        it('# success case', (done) => {
            noteDao
                .delete(1, 5)
                .then((result) => {
                    expect(result).eq(1);
                    return Note.findOne({
                        where: { ingredientIdx: 5, perfumeIdx: 1 },
                    });
                })
                .then((result) => {
                    expect(result).to.be.null;
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
