const dotenv = require('dotenv');
dotenv.config({path: './config/.env.test'});

const chai = require('chai');
const { expect } = chai;
const userDao = require('../../dao/UserDao.js');
const { DuplicatedEntryError, NotMatchedError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# userDao Test', () => {
    describe(' # create Test', () => {
        before(async () => {
            await pool.queryParam_Parse('DELETE FROM user WHERE email = ?', ['createTest@afume.com']);
        });
        it('# success case', (done) => {
            userDao.create({nickname: '생성 테스트', password: 'hashed', gender: 'male', phone: '010-2081-3818', email: 'createTest@afume.com', birth: '1995-09-29'})
            .then((result) => {
                expect(result).gt(0);
                done();
            });
        });
        it(' # DuplicatedEntryError case', (done) => {
            userDao.create({nickname: '생성 테스트', password: 'hashed', gender: 'male', phone: '010-2081-3818', email: 'createTest@afume.com', birth: '1995-09-29'})
            .then(() => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
        after(async() => {
            await pool.queryParam_Parse('DELETE FROM user WHERE email = ?', ['createTest@afume.com']);
        });
    });
    
    describe(' # read Test', () => {    
        describe('# readByEmail Test', () => {
            it('# success case', (done) => {
                userDao.readByEmail('hee.youn@samsung.com')
                .then((result) => {
                    expect(result.nickname).eq('윤희성');
                    expect(result.gender).eq('male');
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                userDao.readByEmail('존재하지 않는 아이디')
                .then(() => {
                    expect(false).true();
                    done();
                }).catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                });
            });
        });
        describe('# readByIdx Test', () => {
            it('# success case', (done) => {
                userDao.readByIdx(1)
                .then((result) => {
                    expect(result.nickname).eq('윤희성');
                    expect(result.gender).eq('male');
                    expect(result.email).eq('hee.youn@samsung.com');
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                userDao.readByIdx(0)
                .then(() => {
                    expect(false).true();
                    done();
                }).catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                });
            });
        });
    });

    describe('# update Test', () => {
        let userIdx;
        before(async () => {            
            userIdx = await userDao.create({nickname: '수정 테스트', password: 'hashed', gender: 'male', phone: '010-2081-3818', email: 'updateTest@afume.com', birth: '1995-09-29'});
        });
        it('# success case', (done) => {
            userDao.update({userIdx, nickname: '수정 테스트(完)', password: '변경', gender: 'F', phone: '010-1234-1234', email: 'updateTest@afume.com', birth: '1995-09-29'})
            .then((result) => {
                expect(result).eq(1);
                done();
            });
        });
        after(() => {
            pool.queryParam_Parse('DELETE FROM user WHERE email = ?', ['updateTest@afume.com']);
        });
    });
    describe('# delete Test', () => {
        let userIdx;
        before(async () => {            
            userIdx = await userDao.create({nickname: '삭제 테스트', password: 'hashed', gender: 'male', phone: '010-2081-3818', email: 'deleteTest@afume.com', birth: '1995-09-29'});
        });
        describe('# delete Test', () => {
            it('# success case', (done) => {
                userDao.delete(userIdx)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                });
            });
        });
        after(() => {
            pool.queryParam_Parse('DELETE FROM user WHERE email = ?', ['deleteTest@afume.com']);
        })
    });
});
