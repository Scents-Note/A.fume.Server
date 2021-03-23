const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const likeReviewDao = require('../../dao/LikeReviewDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const { LikeReview } = require('../../models');

describe('# LikeReviewDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        before(async () => {
            await LikeReview.destroy({ where: { userIdx: 1, reviewIdx: 2 } });
        });
        it('# success case', (done) => {
            likeReviewDao
                .create({ userIdx: 1, reviewIdx: 2 })
                .then((result) => {
                    expect(result[0].userIdx).eq(1);
                    expect(result[0].reviewIdx).eq(2);
                    expect(result[1][0]).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            likeReviewDao
                .create({ userIdx: 1, reviewIdx: 2 })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# read case', () => {
        it('# success case', (done) => {
            likeReviewDao
                .read(1, 2)
                .then((result) => {
                    if (result != null) {
                        expect(result.userIdx).eq(1);
                        expect(result.reviewIdx).eq(2);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAllOfUser case', () => {
        it('# success case', (done) => {
            likeReviewDao
                .readAllOfUser({ userIdx: 1, perfumeIdx: 1 })
                .then((result) => {
                    if (result.length > 0) {
                        expect(result[0]).eq(1);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            await likeReviewDao
                .create({
                    userIdx: 3,
                    reviewIdx: 1,
                })
                .catch((err) => done(err));
        });
        it('# success case', (done) => {
            likeReviewDao
                .delete({ userIdx: 3, reviewIdx: 1 })
                .then((result) => {
                    expect(result[0]).eq(1);
                    expect(result[1][0]).eq(1);
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });
});
