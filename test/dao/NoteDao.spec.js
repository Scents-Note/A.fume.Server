const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const noteDao = require('../../dao/NoteDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
    InvalidInputError,
} = require('../../utils/errors/errors.js');
const { Note } = require('../../models');
const NoteDTO = require('../data/dto/NoteDTO');

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
                    expect(result.ingredientIdx).to.be.eq(5);
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.type).to.be.eq(1);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # DuplicatedEntryError case', (done) => {
            noteDao
                .create({ ingredientIdx: 5, perfumeIdx: 1, type: 1 })
                .then(() => done(new UnExpectedError(DuplicatedEntryError)))
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # fail case (invalid ingredientIdx) ', (done) => {
            noteDao
                .create({ ingredientIdx: -5, perfumeIdx: 1, type: 1 })
                .then(() => done(new UnExpectedError(NotMatchedError)))
                .catch((err) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # fail case (invalid perfumeIdx) ', (done) => {
            noteDao
                .create({ ingredientIdx: 5, perfumeIdx: -1, type: 1 })
                .then(() => done(new UnExpectedError(NotMatchedError)))
                .catch((err) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # fail case (invalid type) ', (done) => {
            noteDao
                .create({ ingredientIdx: 5, perfumeIdx: 1, type: 6 })
                .then(() => done(new UnExpectedError(InvalidInputError)))
                .catch((err) => {
                    expect(err).to.be.instanceOf(InvalidInputError);
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
                    for (const note of result) {
                        expect(note.perfumeIdx).to.be.eq(1);
                        expect(note.ingredientIdx).to.be.ok;
                        expect(note.type).to.be.within(1, 4);
                        expect(note.createAt).to.be.undefined;
                        expect(note.updatedAt).to.be.undefined;
                    }
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # readByPerfumeIdx test', (done) => {
            noteDao
                .readByPerfumeIdx(1)
                .then((result) => {
                    result.forEach((note) => {
                        expect(note).instanceOf(NoteDTO);
                        note.validTest();
                    });
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
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.ingredientIdx).to.be.eq(5);
                    expect(result.type).to.eq(5);
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
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
        after(async () => {
            await Note.upsert({
                ingredientIdx: 5,
                perfumeIdx: 1,
                type: 1,
            });
        });
    });
});
