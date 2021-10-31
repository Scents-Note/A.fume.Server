const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const likePerfumeDao = require('../../src/dao/LikePerfumeDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
    UnExpectedError,
} = require('../../src/utils/errors/errors.js');
const { LikePerfume } = require('../../src/models');

describe('# likePerfumeDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# create Test', () => {
        before(async () => {
            await LikePerfume.destroy({ where: { userIdx: 5, perfumeIdx: 5 } });
        });
        it('# success case', (done) => {
            likePerfumeDao
                .create(5, 5)
                .then((result) => {
                    expect(result.userIdx).to.be.eq(5);
                    expect(result.perfumeIdx).to.be.eq(5);
                    expect(result.createdAt).to.be.not.undefined;
                    expect(result.updatedAt).to.be.not.undefined;
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            likePerfumeDao
                .create(5, 5)
                .then(() => {
                    done(new UnExpectedError(DuplicatedEntryError));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await LikePerfume.destroy({ where: { userIdx: 5, perfumeIdx: 5 } });
        });
    });

    describe('# read case', () => {
        it('# success case (state: like)', (done) => {
            likePerfumeDao
                .read(1, 1)
                .then((result) => {
                    expect(result.userIdx).eq(1);
                    expect(result.perfumeIdx).eq(1);
                    expect(result.createdAt).to.be.not.undefined;
                    expect(result.updatedAt).to.be.not.undefined;
                    done();
                })
                .catch((err) => done(err));
        });

        it('# success case (state: unlike)', (done) => {
            likePerfumeDao
                .read(2, 2)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (invalid userIdx)', (done) => {
            likePerfumeDao
                .read(-1, 1)
                .then((result) => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (invalid perfumeIdx)', (done) => {
            likePerfumeDao
                .read(1, -1)
                .then((result) => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# success case', (done) => {
            likePerfumeDao
                .readLikeInfo(1, [1, 2, 3, 4, 5])
                .then((result) => {
                    expect(result.length).gte(5);
                    for (const likePerfume of result) {
                        expect(likePerfume.userIdx).to.eq(1);
                        expect(likePerfume.perfumeIdx).to.be.oneOf([
                            1, 2, 3, 4, 5,
                        ]);
                        expect(likePerfume.createdAt).to.be.not.undefined;
                        expect(likePerfume.updatedAt).to.be.not.undefined;
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            await LikePerfume.upsert({
                userIdx: 5,
                perfumeIdx: 5,
            });
        });
        it('# success case', (done) => {
            likePerfumeDao
                .delete(5, 5)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (not like state)', (done) => {
            likePerfumeDao
                .delete(5, 15)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (invalid argument)', (done) => {
            likePerfumeDao
                .delete(-5, 15)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        after(async () => {
            await LikePerfume.destroy({ where: { userIdx: 5, perfumeIdx: 5 } });
        });
    });
});
