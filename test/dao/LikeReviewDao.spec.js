const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const likeReviewDao = require('../../src/dao/LikeReviewDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
    UnExpectedError,
} = require('../../src/utils/errors/errors.js');
const { LikeReview } = require('../../models');

describe('# LikeReviewDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# create Test', () => {
        before(async () => {
            // const before = await LikeReview.findOne({
            //     where: { userIdx: 1, reviewIdx: 2 },
            //     raw: true,
            //     nest: true,
            // });
            // console.log('likeReview create before result: ', before)
            await LikeReview.destroy({ where: { userIdx: 1, reviewIdx: 2 } });
            // const after = await LikeReview.findOne({
            //     where: { userIdx: 1, reviewIdx: 2 },
            //     raw: true,
            //     nest: true,
            // });
            // console.log('likeReview create after result: ', after)
        });
        it('# success case', (done) => {
            likeReviewDao
                .create(1, 2)
                .then((result) => {
                    const likeReview = result[0];
                    const updateLikeCnt = result[1];
                    expect(likeReview.userIdx).eq(1);
                    expect(likeReview.reviewIdx).eq(2);
                    expect(updateLikeCnt[0]).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (duplicated)', (done) => {
            likeReviewDao
                .create(1, 2)
                .then(() => {
                    done(new UnExpectedError(DuplicatedEntryError));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (invalid userIdx)', (done) => {
            likeReviewDao
                .create(-1, 2)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# fail case (invalid reviewIdx)', (done) => {
            likeReviewDao
                .create(1, -2)
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
        });

        after(async () => {
            await LikeReview.destroy({ where: { userIdx: 1, reviewIdx: 2 } });
            await LikeReview.destroy({ where: { userIdx: -1, reviewIdx: 2 } });
            await LikeReview.destroy({ where: { userIdx: -1, reviewIdx: -2 } });
        });
    });

    describe('# read case', () => {
        it('# success case', (done) => {
            likeReviewDao
                .read(1, 1)
                .then((result) => {
                    expect(result.userIdx).eq(1);
                    expect(result.reviewIdx).eq(1);
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
                    expect(result[0]).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            await likeReviewDao.create(3, 1);
        });

        it('# success case', (done) => {
            likeReviewDao
                .delete(3, 1)
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
