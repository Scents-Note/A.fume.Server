import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import {
    WrongPasswordError,
    PasswordPolicyError,
    UnExpectedError,
} from '@errors';

import UserService from '@services/UserService';

import { UserAuthDTO, UserDTO, TokenSetDTO } from '@dto/index';

import LoginInfoMockHelper from '../mock_helper/LoginInfoMockHelper';
import TokenGroupMockHelper from '../mock_helper/TokenGroupMockHelper';
import UserMockHelper from '../mock_helper/UserMockHelper';

const mockUserDao = Object.assign({}, require('../dao/UserDao.mock.js'));
const mockTokenDao = Object.assign({});
const mockJWT = Object.assign({}, require('../lib/token.mock.js'));
const userService = new UserService(
    mockUserDao,
    mockTokenDao,
    undefined,
    mockJWT
);

describe('# User Service Test', () => {
    describe('# createUser Test', () => {
        it('# success Test', (done: Done) => {
            userService
                .createUser({})
                .then((result) => {
                    TokenGroupMockHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# authUser Test', () => {
        it('# success Test', (done: Done) => {
            userService
                .authUser('token')
                .then((result) => {
                    expect(result).to.be.instanceOf(UserAuthDTO);
                    expect(result.isAuth).to.be.true;
                    expect(result.isAdmin).to.be.true;
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# With No Auth', (done: Done) => {
            mockJWT.verify = () => {
                throw 'error';
            };
            userService
                .authUser('token')
                .then((result) => {
                    expect(result.isAuth).to.be.false;
                    expect(result.isAdmin).to.be.false;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# loginUser Test', () => {
        mockTokenDao.create = async (_: TokenSetDTO) => {
            return true;
        };
        it('# wrong password', (done: Done) => {
            mockUserDao.read = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .loginUser('', userService.crypto.encrypt('password'))
                .then(() => {
                    done(new UnExpectedError(WrongPasswordError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(WrongPasswordError);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# success case', (done: Done) => {
            mockUserDao.read = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .loginUser('', userService.crypto.encrypt('encrypted'))
                .then((result) => {
                    LoginInfoMockHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# updateUser Test', () => {
        it('# success Test', (done: Done) => {
            userService
                .updateUser({ userIdx: 1 })
                .then((it: UserDTO) => {
                    UserMockHelper.validTest.call(it);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# changePassword Test', () => {
        it('# success case', (done: Done) => {
            mockUserDao.readByIdx = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .changePassword(
                    1,
                    userService.crypto.encrypt('encrypted'),
                    userService.crypto.encrypt('newpassword')
                )
                .then(() => {
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# wrong prev password', (done: Done) => {
            mockUserDao.readByIdx = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .changePassword(
                    1,
                    userService.crypto.encrypt('wrong'),
                    userService.crypto.encrypt('')
                )
                .then(() => {
                    done(new UnExpectedError(WrongPasswordError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(WrongPasswordError);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# same password(restrict by password policy)', (done: Done) => {
            mockUserDao.readByIdx = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .changePassword(
                    1,
                    userService.crypto.encrypt('encrypted'),
                    userService.crypto.encrypt('encrypted')
                )
                .then(() => {
                    done(new UnExpectedError(PasswordPolicyError));
                })
                .catch((err: Error) => {
                    expect(err).to.be.instanceOf(PasswordPolicyError);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
    describe('# checkPassword Test', () => {
        it('# case: valid password', (done: Done) => {
            mockUserDao.readByIdx = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .checkPassword(1, userService.crypto.encrypt('encrypted'))
                .then((isSuccess: boolean) => {
                    expect(isSuccess).to.be.true;
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# case: invalid password', (done: Done) => {
            mockUserDao.readByIdx = () => {
                return UserDTO.createByJson({
                    userIdx: 1,
                    nickname: 'user1',
                    password: userService.crypto.encrypt('encrypted'),
                    gender: 2,
                    email: 'email1@afume.com',
                    birth: 1995,
                    grade: 1,
                    accessTime: '2021-07-13T11:33:49.000Z',
                    createdAt: '2021-07-13T11:33:49.000Z',
                    updatedAt: '2021-08-07T09:20:29.000Z',
                });
            };
            userService
                .checkPassword(1, userService.crypto.encrypt('encrypted2'))
                .then((isSuccess: boolean) => {
                    expect(isSuccess).to.be.false;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
