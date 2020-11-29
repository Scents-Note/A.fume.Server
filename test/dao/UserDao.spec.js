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
            await pool.queryParam_Parse('DELETE FROM user WHERE name = ?', ['생성 테스트']);
        });
        it('# success case', (done) => {
            userDao.create({username: '생성 테스트', password: 'hashed', gender: 'M', phone: '010-2081-3818', email: 'hee.youn@samsung.com', birth: '1995-09-29'})
            .then((result) => {
                expect(result).gt(0);
                done();
            });
        });
        it(' # DuplicatedEntryError case', (done) => {
            userDao.create({username: '생성 테스트', password: 'hashed', gender: 'M', phone: '010-2081-3818', email: 'hee.youn@samsung.com', birth: '1995-09-29'})
            .then(() => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
        after(async() => {
            await pool.queryParam_Parse('DELETE FROM user WHERE name = ?', ['생성 테스트']);
        });
    });
    
    describe(' # read Test', () => {    
        describe('# read Test', () => {
            it('# success case', (done) => {
                userDao.readByName('윤희성')
                .then((result) => {
                    expect(result.username).eq('윤희성');
                    expect(result.gender).eq('M');
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                userDao.readByName('존재하지 않는 이름')
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
            userIdx = await userDao.create({username: '수정 테스트', password: 'hashed', gender: 'M', phone: '010-2081-3818', email: 'hee.youn@samsung.com', birth: '1995-09-29'});
        });
        it('# success case', (done) => {
            userDao.update({userIdx, username: '수정 테스트(完)', password: '변경', gender: 'F', phone: '010-1234-1234', email: 'test@test.com', birth: '1995-09-29'})
            .then((result) => {
                expect(result).eq(1);
                done();
            });
        });
        after(() => {
            pool.queryParam_Parse('DELETE FROM user WHERE name = ?', ['수정 테스트(完)']);
            pool.queryParam_Parse('DELETE FROM user WHERE name = ?', ['수정 테스트']);
        });
    });
    describe('# delete Test', () => {
        let userIdx;
        before(async () => {            
            userIdx = await userDao.create({username: '삭제 테스트', password: 'hashed', gender: 'M', phone: '010-2081-3818', email: 'hee.youn@samsung.com', birth: '1995-09-29'});
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
            pool.queryParam_Parse('DELETE FROM user WHERE name = ?', ['삭제 테스트']);
        })
    });
});
