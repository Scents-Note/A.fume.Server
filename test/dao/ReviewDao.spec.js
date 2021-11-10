const dotenv = require('dotenv');
dotenv.config();

import { NotMatchedError } from '../../src/utils/errors/errors';

const chai = require('chai');
const { expect } = chai;
const reviewDao = require('../../src/dao/ReviewDao.js');
const keywordDao = require('../../src/dao/KeywordDao');
const { Review, JoinReviewKeyword } = require('../../src/models');
const { read } = require('../../src/dao/NoteDao.js');

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
                    result = result.dataValues;
                    expect(result.id).to.be.ok;
                    expect(result.likeCnt).to.be.eq(0);
                    expect(result.perfumeIdx).to.be.eq(2);
                    expect(result.userIdx).to.be.eq(2);
                    expect(result.score).to.be.eq(2);
                    expect(result.longevity).to.be.eq(2);
                    expect(result.sillage).to.be.eq(2);
                    expect(result.seasonal).to.be.eq(2);
                    expect(result.gender).to.be.eq(2);
                    expect(result.access).to.be.eq(2);
                    expect(result.content).to.be.eq('리뷰생성테스트');
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
                    expect(result.id).to.be.eq(reviewIdx);
                    expect(result.score).to.be.eq(1);
                    expect(result.longevity).to.be.eq(1);
                    expect(result.sillage).to.be.eq(1);
                    expect(result.seasonal).to.be.eq(4);
                    expect(result.gender).to.be.eq(1);
                    expect(result.access).to.be.eq(1);
                    expect(result.content).to.be.eq('시향노트1');
                    expect(result.likeCnt).to.be.gte(0);
                    expect(result.perfumeIdx).to.be.eq(1);
                    expect(result.userIdx).to.be.eq(1);
                    expect(result.keywordList).to.be.ok;
                    expect(result.keywordList.length).to.be.gte(1);
                    expect(
                        new Set(result.keywordList.map((it) => it.keywordIdx))
                    ).to.have.property('size', result.keywordList.length);

                    expect(result.Perfume).to.be.ok;
                    expect(result.Perfume.perfumeIdx).to.be.eq(
                        result.perfumeIdx
                    );
                    expect(result.Perfume.name).to.be.ok;
                    expect(result.Perfume.englishName).to.be.ok;
                    expect(result.Perfume.imageUrl).to.be.ok;
                    expect(result.Perfume.brandIdx).to.be.ok;
                    expect(result.Perfume.createdAt).to.be.ok;
                    expect(result.Perfume.updatedAt).to.be.ok;
                    expect(result.Perfume.Brand).to.be.ok;
                    expect(result.Perfume.Brand.brandIdx).to.be.eq(
                        result.Perfume.brandIdx
                    );
                    expect(result.Perfume.Brand.name).to.be.ok;
                    expect(result.Perfume.Brand.englishName).to.be.ok;
                    expect(result.Perfume.Brand.firstInitial).to.be.ok;
                    expect(result.Perfume.Brand.imageUrl).to.be.ok;
                    expect(result.Perfume.Brand.description).to.be.ok;
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
                    expect(result).to.be.ok;
                    expect(result.length).to.be.gte(1);
                    for (const review of result) {
                        expect(review.id).to.be.ok;
                        expect(review.score).to.be.ok;
                        expect(review.longevity).to.be.ok;
                        expect(review.sillage).to.be.ok;
                        expect(review.seasonal).to.be.ok;
                        expect(review.gender).to.be.ok;
                        expect(review.access).to.be.ok;
                        expect(review.content).to.be.ok;
                        expect(review.likeCnt).to.be.ok;
                        expect(review.perfumeIdx).to.be.ok;
                        expect(review.userIdx).to.be.ok;
                        expect(review.Perfume).to.be.ok;
                        expect(review.Perfume.perfumeIdx).to.be.eq(
                            review.perfumeIdx
                        );
                        expect(review.Perfume.name).to.be.ok;
                        expect(review.Perfume.englishName).to.be.ok;
                        expect(review.Perfume.imageUrl).to.be.ok;
                        expect(review.Perfume.brandIdx).to.be.ok;
                        expect(review.Perfume.createdAt).to.be.ok;
                        expect(review.Perfume.updatedAt).to.be.ok;
                        expect(review.Perfume.Brand).to.be.ok;
                        expect(review.Perfume.Brand.brandIdx).to.be.eq(
                            review.Perfume.brandIdx
                        );
                        expect(review.Perfume.Brand.name).to.be.ok;
                        expect(review.Perfume.Brand.englishName).to.be.ok;
                        expect(review.Perfume.Brand.firstInitial).to.be.ok;
                        expect(review.Perfume.Brand.imageUrl).to.be.ok;
                        expect(review.Perfume.Brand.description).to.be.ok;
                        expect(review.keywordList).to.be.undefined;
                    }
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
                    expect(result).to.be.ok;
                    expect(result.length).to.be.gte(1);
                    for (const review of result) {
                        expect(review.score).to.be.ok;
                        expect(review.longevity).to.be.not.undefined;
                        expect(review.sillage).to.be.not.undefined;
                        expect(review.seasonal).to.be.not.undefined;
                        expect(review.gender).to.be.not.undefined;
                        expect(review.access).to.be.ok;
                        expect(review.content).to.be.ok;

                        expect(review.User).to.be.ok;
                        expect(review.User.userIdx).to.be.ok;
                        expect(review.User.email).to.be.ok;
                        expect(review.User.nickname).to.be.ok;
                        expect(review.User.password).to.be.ok;
                        expect(review.User.gender).to.be.ok;
                        expect(review.User.accessTime).to.be.ok;

                        expect(review.LikeReview).to.be.ok;
                        expect(review.LikeReview.likeCount).to.be.gte(0);

                        expect(review.Perfume).to.be.undefined;
                        expect(review.keywordList).to.be.undefined;
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# update Test', () => {
        let reviewIdx = 2;
        let readReviewResult;
        it('# success case', (done) => {
            let perfumeIdx;
            reviewDao
                .update({
                    score: 1,
                    longevity: 1,
                    sillage: 1,
                    seasonal: 1,
                    gender: 1,
                    access: 1,
                    reviewIdx,
                    content: '리뷰수정테스트',
                })
                .then((result) => {
                    expect(result[0]).eq(1);
                    return reviewDao.read(reviewIdx);
                })
                .then((readReviewResult) => {
                    expect(readReviewResult.id).to.be.eq(reviewIdx);
                    expect(readReviewResult.score).to.be.eq(1);
                    expect(readReviewResult.longevity).to.be.eq(1);
                    expect(readReviewResult.sillage).to.be.eq(1);
                    expect(readReviewResult.seasonal).to.be.eq(1);
                    expect(readReviewResult.gender).to.be.eq(1);
                    expect(readReviewResult.access).to.be.eq(1);
                    expect(readReviewResult.content).to.be.eq('리뷰수정테스트');
                    perfumeIdx = readReviewResult.perfumeIdx;
                    //  TODO 어떤 의도의 코드인지 모름
                    //     return keywordDao.deleteReviewKeyword({
                    //         reviewIdx,
                    //         perfumeIdx,
                    //     });
                    // })
                    // .then((deleteReviewKeywordResult) => {
                    //     expect(deleteReviewKeywordResult[0][0]).eq(1);
                    //     return Promise.all(
                    //         [1, 2].map((it) => {
                    //             return keywordDao.create({
                    //                 reviewIdx,
                    //                 keywordIdx: it,
                    //                 perfumeIdx: perfumeIdx,
                    //             });
                    //         })
                    //     );
                    // })
                    // .then((createReviewKeywordResult) => {
                    //     console.log(createReviewKeywordResult);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# delete Test', () => {
        let reviewIdx;
        let keywordCount1;
        let keywordCount2;
        before(async () => {
            const result = await reviewDao.create({
                userIdx: 3,
                perfumeIdx: 3,
                score: 3,
                longevity: 3,
                sillage: 3,
                seasonal: 3,
                gender: 1,
                access: 1,
                content: '리뷰삭제테스트',
            });
            reviewIdx = result.id;
            const keywordList = [1, 3];
            await Promise.all(
                keywordList.map((it) => {
                    return keywordDao.create({
                        reviewIdx,
                        keywordIdx: it,
                        perfumeIdx: 3,
                    });
                })
            );

            keywordCount1 = await keywordDao.readPerfumeKeywordCount({
                perfumeIdx: 3,
                keywordIdx: 1,
            });
            keywordCount2 = await keywordDao.readPerfumeKeywordCount({
                perfumeIdx: 3,
                keywordIdx: 3,
            });
        });
        it('# success case', (done) => {
            keywordDao
                .deleteReviewKeyword({ reviewIdx, perfumeIdx: 3 })
                .then(async () => {
                    // 리뷰 키워드 개수 수정 여부 체크
                    const keywordCount1After = await keywordDao
                        .readPerfumeKeywordCount({
                            perfumeIdx: 3,
                            keywordIdx: 1,
                        })
                        .catch((err) => {
                            if (err instanceof NotMatchedError) {
                                return 0;
                            }
                            throw err;
                        });
                    const keywordCount2After = await keywordDao
                        .readPerfumeKeywordCount({
                            perfumeIdx: 3,
                            keywordIdx: 3,
                        })
                        .catch((err) => {
                            if (err instanceof NotMatchedError) {
                                return 0;
                            }
                            throw err;
                        });
                    expect(keywordCount1After).eq(keywordCount1 - 1);
                    expect(keywordCount2After).eq(keywordCount2 - 1);

                    //데이터 무결성을 위해, 향수 키워드 중 count가 0이하인 행 제거
                    const deleteZeroCountResult =
                        await reviewDao.deleteZeroCount();
                    expect(deleteZeroCountResult).to.be.eq(0);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await reviewDao.delete(reviewIdx);
            await Review.destroy({ where: { content: '리뷰삭제테스트' } });
        });
    });

    describe('# findOne Test', () => {
        it('# success case', (done) => {
            reviewDao
                .findOne({ userIdx: 1, perfumeIdx: 1 })
                .then((it) => {
                    expect(it.id).to.be.eq(1);
                    expect(it.userIdx).to.be.eq(1);
                    expect(it.perfumeIdx).to.be.eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
