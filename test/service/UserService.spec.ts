import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();
import UserService from '../../src/service/UserService';

import {
    WrongPasswordError,
    PasswordPolicyError,
    UnExpectedError,
} from '../../src/utils/errors/errors';

import UserAuthDTO from '../../src/data/dto/UserAuthDTO';

import { Error } from 'aws-sdk/clients/servicecatalog';
import UserDTO from '../../src/data/dto/UserDTO';

import LoginInfoMockHelper from '../mock_helper/LoginInfoMockHelper';
import TokenGroupMockHelper from '../mock_helper/TokenGroupMockHelper';
import UserMockHelper from '../mock_helper/UserMockHelper';

const mockUserDao = require('../dao/UserDao.mock.js');
const mockJWT = Object.assign({}, require('../lib/token.mock.js'));
const mockCrypt = {
    encrypt: (data: string): string => data,
    decrypt: (data: string): string => data,
};
const userService = new UserService(mockUserDao, mockCrypt, mockJWT);

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
        it('# wrong password', (done: Done) => {
            userService
                .loginUser('', 'password')
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
            userService
                .loginUser('', 'encrypted')
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
        it('# wrong prev password', (done: Done) => {
            userService
                .changePassword(1, 'wrong', '')
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
            userService
                .changePassword(1, 'encrypted', 'encrypted')
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
});
