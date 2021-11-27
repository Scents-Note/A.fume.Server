import dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config();

import LoginInfoMockHelper from '../data/dto/LoginInfoMockHelper';
import TokenGroupMockHelper from '../data/dto/TokenGroupMockHelper';
import UserAuthDTO from '../../src/data/dto/UserAuthDTO';

import UserMockHelper from '../data/dto/UserMockHelper';

const userService = require('../../src/service/UserService');
const {
    WrongPasswordError,
    PasswordPolicyError,
} = require('../../src/utils/errors/errors');
const mockJWT = Object.assign({}, require('../lib/token.mock.js'));
userService.setJwt(mockJWT);
userService.setCrypto({
    encrypt: () => 'encrypted',
    decrypt: () => 'decrypted',
});
userService.setUserDao(require('../dao/UserDao.mock.js'));

describe('# User Service Test', () => {
    describe('# createUser Test', () => {
        it('# success Test', (done) => {
            userService
                .createUser({})
                .then((result) => {
                    TokenGroupMockHelper.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# authUser Test', () => {
        it('# success Test', (done) => {
            userService
                .authUser('token')
                .then((result) => {
                    expect(result).to.be.instanceOf(UserAuthDTO);
                    expect(result.isAuth).to.be.true;
                    expect(result.isAdmin).to.be.true;
                    done();
                })
                .catch((err) => done(err));
        });
        it('# With No Auth', (done) => {
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
                .catch((err) => done(err));
        });
    });

    describe('# loginUser Test', () => {
        it('# wrong password', (done) => {
            userService
                .loginUser('', 'password')
                .then((it) => {
                    done(new UnExpectedError(WrongPasswordError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(WrongPasswordError);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# success case', (done) => {
            userService
                .loginUser('', 'decrypted')
                .then((result) => {
                    LoginInfoMockHelper.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# updateUser Test', () => {
        it('# success Test', (done) => {
            userService
                .updateUser({ userIdx: 1 })
                .then((it) => {
                    UserMockHelper.validTest.call(it);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# changePassword Test', () => {
        it('# wrong prev password', (done) => {
            userService
                .changePassword({
                    userIdx: 1,
                    prevPassword: 'wrong',
                    newPassword: '',
                })
                .then(() => {
                    done(new UnExpectedError(WrongPasswordError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(WrongPasswordError);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# same password(restrict by password policy)', (done) => {
            userService
                .changePassword({
                    userIdx: 1,
                    prevPassword: 'decrypted',
                    newPassword: 'decrypted',
                })
                .then(() => {
                    done(new UnExpectedError(PasswordPolicyError));
                })
                .catch((err) => {
                    expect(err).to.be.instanceOf(PasswordPolicyError);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
