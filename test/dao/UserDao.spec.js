const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const userDao = require('../../dao/UserDao.js');
const { NotMatchedError } = require('../../utils/errors/errors.js');
const { User, sequelize } = require('../../models');

const { GENDER_MAN, GENDER_WOMAN } = require('../../utils/code.js');

describe('# userDao Test', () => {
    before(async () => {
        await sequelize.sync();
        await require('./seeds.js')();
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
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            User.create({
                nickname: '생성 테스트',
                password: 'hashed',
                gender: GENDER_MAN,
                phone: '010-2081-3818',
                email: 'createTest@afume.com',
                birth: '1995',
                grade: 1,
            })
                .then(() => {
                    done(new Error('Must expect Error'));
                })
                .catch((err) => {
                    expect(err.parent.errno).eq(1062);
                    expect(err.parent.code).eq('ER_DUP_ENTRY');
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
    });

    describe(' # read Test', () => {
        describe('# readByEmail Test', () => {
            it('# success case', (done) => {
                userDao
                    .read({ email: 'email1@afume.com' })
                    .then((result) => {
                        expect(result.nickname).eq('user1');
                        expect(result.phone).eq('010-0000-0001');
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# Not Matched case', (done) => {
                userDao
                    .read({ email: '존재하지 않는 아이디' })
                    .then(() => {
                        throw new Error('Must be expected NotMatchedError');
                    })
                    .catch((err) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        describe('# readByIdx Test', () => {
            it('# success case', (done) => {
                userDao
                    .readByIdx(1)
                    .then((result) => {
                        expect(result.nickname).eq('user1');
                        expect(result.phone).eq('010-0000-0001');
                        expect(result.email).eq('email1@afume.com');
                        done();
                    })
                    .catch((err) => done(err));
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
                gender: GENDER_MAN,
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
                    gender: GENDER_WOMAN,
                    phone: '010-1234-1234',
                    email: 'updateTest@afume.com',
                    birth: '1995',
                    grade: 0,
                })
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# updateAccessTime success case', (done) => {
            setTimeout(() => {
                userDao
                    .updateAccessTime(userIdx)
                    .then((result) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err) => done(err));
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
                gender: GENDER_MAN,
                phone: '010-2081-3818',
                email: 'deleteTest@afume.com',
                birth: '1995',
                grade: 0,
            });
        });
        describe('# delete Test', () => {
            it('# success case', (done) => {
                userDao
                    .delete(userIdx)
                    .then((result) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
        after(async () => {
            await User.destroy({ where: { email: 'deleteTest@afume.com' } });
        });
    });
});
