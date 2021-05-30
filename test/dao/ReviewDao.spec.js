const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const reviewDao = require('../../dao/ReviewDao.js');
const keywordDao = require('../../dao/KeywordDao');
const { Review } = require('../../models');

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
                    keywordList: [1, 2],
                })
                .then((result) => {
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
                    console.log(result);
                    expect(result.content).eq('시향노트1');
                    expect(result.score).eq(1);
                    expect(result.keywordList[0].keywordIdx).eq(1);
                    expect(result.keywordList[0].keyword).eq('키워드1');
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
                    console.log(result);
                    expect(result).to.not.be.null;
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
                    console.log(result);
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
                    console.log(result);
                    expect(result[0]).eq(1);
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
            try{
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
                const keywordList = [1,3]
                const createReviewKeyword = await Promise.all(keywordList.map((it) => {
                    return keywordDao.create({reviewIdx, keywordIdx: it, perfumeIdx: 3});
                }));

                keywordCount1 = await keywordDao.readPerfumeKeywordCount({perfumeIdx: 3, keywordIdx: 1})
                keywordCount2 = await keywordDao.readPerfumeKeywordCount({perfumeIdx: 3, keywordIdx: 3})
            }
            catch(err) {
                console.log(err)
            }
        });
        it('# success case', (done) => {
            keywordDao
                .deleteReviewKeyword({reviewIdx, perfumeIdx:3})
                .then(async () => {
                    // 리뷰 키워드 개수 수정 여부 체크

                    const keywordCount1After = await keywordDao.readPerfumeKeywordCount({perfumeIdx: 3, keywordIdx: 1})
                    const keywordCount2After = await keywordDao.readPerfumeKeywordCount({perfumeIdx: 3, keywordIdx: 3})
                    expect(keywordCount1After).eq(keywordCount1 - 1)
                    expect(keywordCount2After).eq(keywordCount2 - 1)

                    //데이터 무결성을 위해, 향수 키워드 중 count가 0이하인 행 제거
                    const deleteZeroCountResult = await reviewDao.deleteZeroCount();
                })
                .then(async() => {
                    // 리뷰 삭제 여부 체크
                    const deleteReviewResult = await reviewDao.delete(reviewIdx);
                    expect(deleteReviewResult).eq(1);
                    done();
                }) 
                .catch((err) => done(err));
        });
        after(async () => {
            await Review.destroy({ where: { content: '리뷰삭제테스트' } });
        });
    });
});
