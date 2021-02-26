const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const likePerfumeDao = require('../../dao/LikePerfumeDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');
const { LikePerfume } = require('../../models');

describe('# likeDao Test', () => {
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
                    expect(result).to.be.not.null;
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            likePerfumeDao
                .create(5, 5)
                .then(() => {
                    done(new Error('must be expected DuplicatedEntryError'));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# read case', () => {
        it('# success case', (done) => {
            likePerfumeDao
                .read(1, 1)
                .then((result) => {
                    expect(result.userIdx).eq(1);
                    expect(result.perfumeIdx).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case', (done) => {
            likePerfumeDao
                .read(-1, 1)
                .then((it) => {
                    expect(it).not.be.ok;
                    done();
                })
                .catch((err) => done(err));
        });

        it('# success case', (done) => {
            likePerfumeDao
                .readLikeInfo(1, [1, 2, 3, 4, 5])
                .then((result) => {
                    expect(result.filter((it) => it.userIdx == 1).length).eq(
                        result.length
                    );
                    expect(result.length).gte(5);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            LikePerfume.upsert({
                userIdx: 5,
                perfumeIdx: 5,
            }).catch((err) => done(err));
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
    });
});
