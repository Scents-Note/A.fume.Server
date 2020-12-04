const dotenv = require('dotenv');
dotenv.config({path: './config/.env.tst'});

const chai = require('chai');
const should = chai.should();
const { expect } = chai;
const replyDao = require('../../dao/ReplyDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# replyDao Test', () => {
    describe('# create Test', () => {
        it('# success case', (done) => {
            replyDao.create({userIdx: 1, reviewIdx: 1, content: "댓글테스트"}).then((result) => {
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
        let replyIdx = 3;
        it('# success case', (done) => {
            replyDao.read(replyIdx).then((result) => {
                //console.log(result)
                expect(result[0].content).eq('댓글1_테스트');
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAll Test', () => {
        let reviewIdx = 2;
        it('# success case', (done) => {
            replyDao.readAll(reviewIdx).then((result) => {
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

    describe('# update Test', () => {
        let replyIdx = 18;
        it('# success case', (done) => {
            replyDao.update({replyIdx, content: "리뷰수정테스트"}).then((result) => {
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
        let replyIdx;
        before(async () => {
            const result = await pool.queryParam_None("INSERT reply(user_idx, review_idx, content) values(1, 1, '댓글삭제테스트')");
            replyIdx = result.insertId;
        });
        it('# success case', (done) => {
            replyDao.delete(replyIdx).then((result) => {
                //console.log(result)
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                console.log(err)
                expect(false).true();
                done();
            });
        });
        after(async () => {
            if(!replyIdx) return;
            await pool.queryParam_None(`DELETE FROM reply WHERE reply_idx = ${replyIdx}`);
        });
    });
})