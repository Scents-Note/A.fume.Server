const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const userDao = require('../../dao/UserDao.js');
const {
    NotMatchedError,
    DuplicatedEntryError,
    UnExpectedError,
} = require('../../utils/errors/errors.js');
const { User } = require('../../models');

const UserDTO = require('../data/dto/UserDTO');
const CreatedResultDTO = require('../data/dto/CreatedResultDTO');
const { GENDER_MAN, GENDER_WOMAN } = require('../../utils/code.js');

describe('# userDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
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
                    email: 'createTest@afume.com',
                    birth: '1995',
                    grade: 1,
                })
                .then((result) => {
                    expect(result).instanceOf(CreatedResultDTO);
                    result.validTest((created) => {
                        expect(created).instanceOf(UserDTO);
                        created.validTest();
                    });
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            userDao
                .create({
                    nickname: '생성 테스트',
                    password: 'hashed',
                    gender: GENDER_MAN,
                    email: 'createTest@afume.com',
                    birth: '1995',
                    grade: 1,
                })
                .then(() => {
                    done(new UnExpectedError(DuplicatedEntryError));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
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
                        expect(result).instanceOf(UserDTO);
                        result.validTest();
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# Not Matched case', (done) => {
                userDao
                    .read({ email: '존재하지 않는 아이디' })
                    .then(() => {
                        throw new UnExpectedError(NotMatchedError);
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
                        expect(result).to.be.instanceOf(UserDTO);
                        result.validTest();
                        expect(result.userIdx).to.be.eq(1);
                        done();
                    })
                    .catch((err) => done(err));
            });
            it('# Not Matched case', (done) => {
                userDao
                    .readByIdx(0)
                    .then(() => {
                        throw new UnExpectedError(NotMatchedError);
                    })
                    .catch((err) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    })
                    .catch((err) => done(err));
            });
        });
    });

    describe('# update Test', () => {
        let userIdx;
        before(async () => {
            userIdx = (
                await userDao.create({
                    nickname: '수정 테스트',
                    password: 'hashed',
                    gender: GENDER_MAN,
                    email: 'updateTest@afume.com',
                    birth: '1995',
                    grade: 1,
                })
            ).idx;
        });
        it('# success case', (done) => {
            userDao
                .update({
                    userIdx,
                    nickname: '수정 테스트(完)',
                    password: '변경',
                    gender: GENDER_WOMAN,
                    email: 'updateTest@afume.com',
                    birth: '1995',
                    grade: 0,
                })
                .then((result) => {
                    expect(result).eq(1);
                    return userDao.readByIdx(userIdx);
                })
                .then((result) => {
                    expect(result).to.be.instanceOf(UserDTO);
                    result.validTest();
                    expect(result.userIdx).to.be.eq(userIdx);
                    expect(result.nickname).to.be.eq('수정 테스트(完)');
                    expect(result.email).to.be.eq('updateTest@afume.com');
                    expect(result.password).to.be.eq('변경');
                    expect(result.gender).to.be.eq(GENDER_WOMAN);
                    expect(result.birth).to.be.eq(1995);
                    expect(result.grade).to.be.eq(0);
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
            userIdx = (
                await userDao.create({
                    nickname: '삭제 테스트',
                    password: 'hashed',
                    gender: GENDER_MAN,
                    email: 'deleteTest@afume.com',
                    birth: '1995',
                    grade: 0,
                })
            ).idx;
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

    describe('# postSurvey Test', () => {
        it('# success case', (done) => {
            // TODO set mongoDB test
            done();
        });
    });
});
