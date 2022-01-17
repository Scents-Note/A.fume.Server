import { expect } from 'chai';
import dotenv from 'dotenv';
import { Done } from 'mocha';
dotenv.config();

import {
    NotMatchedError,
    DuplicatedEntryError,
    UnExpectedError,
} from '../../src/utils/errors/errors';

import UserDao from '../../src/dao/UserDao';

import CreatedResultDTO from '../../src/data/dto/CreatedResultDTO';
import UserDTO from '../../src/data/dto/UserDTO';

import UserMockHelper from '../mock_helper/UserMockHelper';

const userDao = new UserDao();
const { User } = require('../../src/models');

const { GENDER_MAN, GENDER_WOMAN } = require('../../src/utils/constantUtil');

describe('# userDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        before(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
        it('# success case', (done: Done) => {
            const expected: { [index: string]: string | number } = {
                nickname: '생성 테스트',
                password: 'hashed',
                gender: 1,
                email: 'createTest@afume.com',
                birth: '1995',
                grade: 1,
            };
            userDao
                .create(expected)
                .then((result: CreatedResultDTO<any>) => {
                    expect(result).instanceOf(CreatedResultDTO);
                    for (const key in expected) {
                        const value = expected[key];
                        expect(result.created[key]).to.be.eq(value);
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# DuplicatedEntryError case', (done: Done) => {
            userDao
                .create({
                    nickname: '생성 테스트',
                    password: 'hashed',
                    gender: GENDER_MAN,
                    email: 'createTest@afume.com',
                    birth: 1995,
                    grade: 1,
                })
                .then(() => {
                    done(new UnExpectedError(DuplicatedEntryError));
                })
                .catch((err: Error) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        after(async () => {
            await User.destroy({ where: { email: 'createTest@afume.com' } });
        });
    });

    describe(' # read Test', () => {
        describe('# readByEmail Test', () => {
            it('# success case', (done: Done) => {
                userDao
                    .read({ email: 'email1@afume.com' })
                    .then((result: UserDTO) => {
                        UserMockHelper.validTest.call(result);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
            it('# Not Matched case', (done: Done) => {
                userDao
                    .read({ email: '존재하지 않는 아이디' })
                    .then(() => {
                        throw new UnExpectedError(NotMatchedError);
                    })
                    .catch((err: Error) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        describe('# readByIdx Test', () => {
            it('# success case', (done: Done) => {
                userDao
                    .readByIdx(1)
                    .then((result: UserDTO) => {
                        UserMockHelper.validTest.call(result);
                        expect(result.userIdx).to.be.eq(1);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
            it('# Not Matched case', (done: Done) => {
                userDao
                    .readByIdx(0)
                    .then(() => {
                        throw new UnExpectedError(NotMatchedError);
                    })
                    .catch((err: Error) => {
                        expect(err).instanceOf(NotMatchedError);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });

    describe('# update Test', () => {
        let userIdx: number = 0;
        before(async () => {
            userIdx = (
                await userDao.create({
                    nickname: '수정 테스트',
                    password: 'hashed',
                    gender: GENDER_MAN,
                    email: 'updateTest@afume.com',
                    birth: 1995,
                    grade: 1,
                })
            ).idx;
        });
        it('# success case', (done: Done) => {
            userDao
                .update({
                    userIdx,
                    nickname: '수정 테스트(完)',
                    password: '변경',
                    gender: GENDER_WOMAN,
                    email: 'updateTest@afume.com',
                    birth: 1995,
                    grade: 0,
                })
                .then((result: number) => {
                    expect(result).eq(1);
                    return userDao.readByIdx(userIdx);
                })
                .then((result: UserDTO) => {
                    UserMockHelper.validTest.call(result);
                    expect(result.userIdx).to.be.eq(userIdx);
                    expect(result.nickname).to.be.eq('수정 테스트(完)');
                    expect(result.email).to.be.eq('updateTest@afume.com');
                    expect(result.password).to.be.eq('변경');
                    expect(result.gender).to.be.eq(GENDER_WOMAN);
                    expect(result.birth).to.be.eq(1995);
                    expect(result.grade).to.be.eq(0);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# updateAccessTime success case', (done: Done) => {
            setTimeout(() => {
                userDao
                    .updateAccessTime(userIdx)
                    .then((result: number) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err: Error) => done(err));
            }, 1000);
        });
        after(async () => {
            await User.destroy({ where: { email: 'updateTest@afume.com' } });
        });
    });

    describe('# delete Test', () => {
        let userIdx: number = 0;
        before(async () => {
            userIdx = (
                await userDao.create({
                    nickname: '삭제 테스트',
                    password: 'hashed',
                    gender: GENDER_MAN,
                    email: 'deleteTest@afume.com',
                    birth: 1995,
                    grade: 0,
                })
            ).idx;
        });
        describe('# delete Test', () => {
            it('# success case', (done: Done) => {
                userDao
                    .delete(userIdx)
                    .then((result: number) => {
                        expect(result).eq(1);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        after(async () => {
            await User.destroy({ where: { email: 'deleteTest@afume.com' } });
        });
    });

    describe('# postSurvey Test', () => {
        it('# success case', (done: Done) => {
            // TODO set mongoDB test
            done();
        });
    });
});
