const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const userDao = require('../../dao/UserDao.js');
const { NotMatchedError } = require('../../utils/errors/errors.js');
const { User, sequelize } = require('../../models');

describe('# userDao Test', () => {
    before(async () => {
        await sequelize.sync();
        await User.upsert({
            userIdx: 1,
            nickname: '쿼카맨',
            password: 'dummy',
            gender: 1,
            phone: '010-2081-3818',
            email: 'heesung6701@naver.com',
            birth: '1995',
            grade: 1,
        });
    });
    describe('# create Test', () => {
        before(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
        it('# success case', (done) => {
            userDao
                .create({
                    nickname: '생성 테스트',
                    password: 'hashed',
                    gender: 1,
                    phone: '010-2081-3818',
                    email: 'createTest@afume.com',
                    birth: '1995',
                    grade: 1,
                })
                .then((result) => {
                    expect(result).gt(0);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    expect(false).true();
                    done();
                });
        });
        it('# DuplicatedEntryError case', (done) => {
            User.create({
                nickname: '생성 테스트',
                password: 'hashed',
                gender: 1,
                phone: '010-2081-3818',
                email: 'createTest@afume.com',
                birth: '1995',
                grade: 1,
            })
                .then(() => {
                    expect(false).true();
                    done();
                })
                .catch((err) => {
                    expect(err.parent.errno).eq(1062);
                    expect(err.parent.code).eq('ER_DUP_ENTRY');
                    done();
                });
        });
        after(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
    });

    describe(' # read Test', () => {
        describe('# readByEmail Test', () => {
            it('# success case', (done) => {
                userDao.readByEmail('heesung6701@naver.com').then((result) => {
                    expect(result.nickname).eq('쿼카맨');
                    expect(result.gender).eq(1);
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                userDao
                    .readByEmail('존재하지 않는 아이디')
                    .then(() => {
                        expect(false).true();
                        done();
                    })
                    .catch((err) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    });
            });
        });
        describe('# readByIdx Test', () => {
            it('# success case', (done) => {
                userDao.readByIdx(1).then((result) => {
                    expect(result.nickname).eq('쿼카맨');
                    expect(result.gender).eq(1);
                    expect(result.email).eq('heesung6701@naver.com');
                    done();
                });
            });
            it('# Not Matched case', (done) => {
                userDao
                    .readByIdx(0)
                    .then(() => {
                        expect(false).true();
                        done();
                    })
                    .catch((err) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    });
            });
        });
    });

    describe('# update Test', () => {
        let userIdx;
        before(async () => {
            userIdx = await userDao.create({
                nickname: '수정 테스트',
                password: 'hashed',
                gender: 1,
                phone: '010-2081-3818',
                email: 'updateTest@afume.com',
                birth: '1995',
                grade: 1,
            });
        });
        it('# success case', (done) => {
            userDao
                .update({
                    userIdx,
                    nickname: '수정 테스트(完)',
                    password: '변경',
                    gender: 2,
                    phone: '010-1234-1234',
                    email: 'updateTest@afume.com',
                    birth: '1995',
                    grade: 0,
                })
                .then((result) => {
                    expect(result).eq(1);
                    done();
                });
        });
        it('# updateAccessTime success case', (done) => {
            setTimeout(() => {
                userDao
                    .updateAccessTime(userIdx)
                    .then((result) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        expect(false).true();
                        done();
                    });
            }, 1000);
        });
        after(async () => {
            await User.destroy({ where: { email: 'updateTest@afume.com' } });
        });
    });
    describe('# delete Test', () => {
        let userIdx;
        before(async () => {
            userIdx = await userDao.create({
                nickname: '삭제 테스트',
                password: 'hashed',
                gender: 1,
                phone: '010-2081-3818',
                email: 'deleteTest@afume.com',
                birth: '1995',
                grade: 0,
            });
        });
        describe('# delete Test', () => {
            it('# success case', (done) => {
                userDao.delete(userIdx).then((result) => {
                    expect(result).eq(1);
                    done();
                });
            });
        });
        after(async () => {
            await User.destroy({ where: { email: 'deleteTest@afume.com' } });
        });
    });
});
