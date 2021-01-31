const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const likeDao = require('../../dao/LikeDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');
const { sequelize, LikePerfume } = require('../../models');

describe('# likeDao Test', () => {
    before(async () => {
        sequelize.sync();
        await require('./seeds.js')();
    });
    describe('# create Test', () => {
        before(async () => {
            await LikePerfume.destroy({ where: { userIdx: 1, perfumeIdx: 1 } });
        });
        it('# success case', (done) => {
            likeDao
                .create(1, 1)
                .then((result) => {
                    expect(result).to.be.not.null;
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            likeDao
                .create(1, 1)
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
            likeDao
                .read(1, 2)
                .then((result) => {
                    expect(result.userIdx).eq(1);
                    expect(result.perfumeIdx).eq(2);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case', (done) => {
            likeDao
                .read(-1, 1)
                .then(() =>
                    done(new Error('must be expected DuplicatedEntryError'))
                )
                .catch((err) => {
                    expect(err).instanceof(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            LikePerfume.upsert({
                userIdx: 1,
                perfumeIdx: 2,
            }).catch((err) => done(err));
        });
        it('# success case', (done) => {
            likeDao
                .delete(1, 2)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
