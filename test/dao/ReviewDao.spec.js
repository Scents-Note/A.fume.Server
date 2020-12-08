const dotenv = require('dotenv');
dotenv.config({path: './config/.env.tst'});

const chai = require('chai');
const should = chai.should();
const { expect } = chai;
const reviewDao = require('../../dao/ReviewDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# reviewDao Test', () => {
    describe('# create Test', () => {
        it('# success case', (done) => {
            reviewDao.create({perfumeIdx: 2, userIdx: 4, score: 4, longevity: "강함", sillage: "가벼움", seasonal: ["봄", "여름"], gender: "여성", access: true, content: '리뷰추가테스트'}).then((result) => {
                //console.log(result)
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });
    
    describe('# read Test', () => {
        let reviewIdx = 1;
        it('# success case', (done) => {
            reviewDao.read(reviewIdx).then((result) => {
                //console.log(result)
                expect(result.content).eq('시향기 내용');
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAllByUser Test', () => {
        let userIdx = 1;
        it('# success case', (done) => {
            reviewDao.readAllByUser(userIdx).then((result) => {
                //console.log(result)
                expect(result.length).greaterThan(0);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAll Test', () => {
        let perfumeIdx = 1;
        it('# success case', (done) => {
            reviewDao.readAllOrderByLike(perfumeIdx).then((result) => {
                //console.log(result)
                expect(result.length).greaterThan(0);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAllOrderByScore Test', () => {
        let perfumeIdx = 1;
        it('# success case', (done) => {
            reviewDao.readAllOrderByScore(perfumeIdx).then((result) => {
                //console.log(result)
                expect(result.length).greaterThan(0);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAllOrderByRecent Test', () => {
        let perfumeIdx = 1;
        it('# success case', (done) => {
            reviewDao.readAllOrderByRecent(perfumeIdx).then((result) => {
                expect(result.length).gte(2);
                    const str1 = result.map(it => it.createTime).join(',');
                    const str2 = result.map(it => it.createTime).sort().reverse().join(',');
                    expect(str1).eq(str2);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });

    describe('# update Test', () => {
        let reviewIdx = 2;
        it('# success case', (done) => {
            reviewDao.update({reviewIdx, score: 4, longevity: "매우 약함", sillage: "가벼움", seasonal: ["가을", "겨울"], gender: "여성", access: true, content: "리뷰수정테스트"}).then((result) => {
                //console.log(result)
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });
    
    describe('# delete Test', () => {
        let reviewIdx;
        before(async () => {
            const result = await pool.queryParam_None(`INSERT review(perfume_idx, user_idx, score, longevity, sillage, seasonal, gender, access, content) values(1, 1, 1, "약함", "가벼움", null, "중성", false, "리뷰삭제테스트")`);
            reviewIdx = result.insertId;
        });
        it('# success case', (done) => {
            reviewDao.delete(reviewIdx).then((result) => {
                //console.log(result)
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
        // after(async () => {
        //     if(!reviewIdx) return;
        //     await pool.queryParam_None(`DELETE FROM review WHERE review_idx = ${reviewIdx}`);
        // });
    });
})