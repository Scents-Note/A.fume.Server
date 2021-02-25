const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const reviewDao = require('../../dao/ReviewDao.js');
const { Review, Perfume, User } = require('../../models');
const {DuplicatedEntryError} = require('../../utils/errors/errors.js');

describe('# reviewDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        before(async () => {
            await Review.destroy({ where: { content: '리뷰생성테스트' } });
        });
        it('# success case', (done) => {
            reviewDao
                .create({
                    perfumeIdx: 2,
                    userIdx: 2,
                    score: 2,
                    longevity: 2,
                    sillage: 2,
                    seasonal: 2,
                    gender: 2,
                    access: 2,
                    content: '리뷰생성테스트',
                })
                .then((result) => {
                    console.log(result)
                    expect(result.dataValues.content).eq('리뷰생성테스트');
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Review.destroy({ where: { content: '리뷰생성테스트' } });
        });
    });

    describe('# read Test', () => {
        let reviewIdx = 1;
        it('# success case', (done) => {
            reviewDao
                .read(reviewIdx)
                .then((result) => {
                    expect(result.content).eq('시향노트1');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAllOfUser Test', () => {
        let userIdx = 1;
        it('# success case', (done) => {
            reviewDao
                .readAllOfUser(userIdx)
                .then((result) => {
                    expect(result.length).greaterThan(0);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAllOfPerfume Test', () => {
        let perfumeIdx = 1;
        it('# success case', (done) => {
            reviewDao
                .readAllOfPerfume(perfumeIdx)
                .then((result) => {
                    expect(result.length).gt(0);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# update Test', () => {
        let reviewIdx = 2;
        it('# success case', (done) => {
            reviewDao
                .update({
                    reviewIdx,
                    perfumeIdx: 1,
                    userIdx: 1,
                    score: 1,
                    longevity: 1,
                    sillage: 1,
                    seasonal: 1,
                    gender: 1,
                    access: 1,
                    content: '리뷰수정테스트',
                })
                .then((result) => {
                    expect(result[0]).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        before(async () => {
            result = await reviewDao.create({
                userIdx: 3,
                perfumeIdx :3,
                score: 3,
                longevity: 3,
                sillage: 3,
                seasonal: 3,
                gender: 1,
                access: 1,
                content: '리뷰삭제테스트',
            });
            reviewIdx = result.dataValues.id;
        });
        it('# success case', (done) => {
            reviewDao
                .delete(reviewIdx)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Review.destroy({ where: { content: '리뷰삭제테스트' } });
        });
    });
});
