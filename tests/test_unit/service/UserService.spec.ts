import dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config();

import { WrongPasswordError, PasswordPolicyError } from '@errors';

import { TokenGroupDTO, LoginInfoDTO } from '@dto/index';

import UserService from '@services/UserService';

import { UserAuthDTO, UserDTO, TokenSetDTO } from '@dto/index';

import { GENDER_WOMAN, GENDER_MAN } from '@utils/constants';

import UserMockHelper from '../mock_helper/UserMockHelper';
import { composeValidator, TestSingle } from '../../internal/TestHelper';

const mockUserDao = Object.assign({}, require('../dao/UserDao.mock.js'));
const mockTokenDao = Object.assign({});
const mockJWT = Object.assign({}, require('../lib/token.mock.js'));
const userService = new UserService(
    mockUserDao,
    mockTokenDao,
    undefined,
    mockJWT
);

describe('▣ UserService', () => {
    describe('▶ create Test', () => {
        describe('# method: createUser', () => {
            new TestSingle<TokenGroupDTO>(
                'common',
                userService.createUser,
                [{}],
                (result: TokenGroupDTO | null, err: any, _: any[]) => {
                    expect(result).to.be.not.null;
                    expect(err).to.be.eq(null);

                    const token: TokenGroupDTO = result!!;
                    expect(token).to.be.instanceOf(TokenGroupDTO);
                    expect(token.userIdx).to.be.ok;
                    expect(token.token).to.be.ok;
                    expect(token.refreshToken).to.be.ok;
                }
            ).test(it);
        });
    });

    describe('▶ auth Test', () => {
        describe('# method: authUser', () => {
            function commonValidator(
                result: UserAuthDTO | null,
                err: any,
                _: any[]
            ) {
                expect(result).to.be.not.null;
                expect(err).to.be.eq(null);

                expect(result).to.be.instanceOf(UserAuthDTO);
            }

            new TestSingle<UserAuthDTO>(
                'common',
                userService.authUser,
                ['token'],
                composeValidator(
                    commonValidator,
                    (result: UserAuthDTO | null, _: any, __: any[]) => {
                        expect(result!!.isAuth).to.be.true;
                        expect(result!!.isAdmin).to.be.true;
                    }
                )
            ).test(it);

            mockJWT.verify = () => {
                throw 'error';
            };

            new TestSingle<UserAuthDTO>(
                'no auth',
                userService.authUser,
                ['token'],
                composeValidator(
                    commonValidator,
                    (result: UserAuthDTO | null, _: any, __: any[]) => {
                        expect(result!!.isAuth).to.be.false;
                        expect(result!!.isAdmin).to.be.false;
                    }
                )
            ).test(it);
        });
        describe('# method: loginUser', () => {
            function loginInfoValidator(
                result: LoginInfoDTO | null,
                _: any,
                __: any[]
            ) {
                const loginInfo: LoginInfoDTO = result!!;
                expect(loginInfo.userIdx).to.be.ok;
                expect(loginInfo.nickname).to.be.ok;
                expect(loginInfo.gender).to.be.oneOf([
                    GENDER_WOMAN,
                    GENDER_MAN,
                ]);
                expect(loginInfo.birth).to.be.gte(1900);
                expect(loginInfo.email).to.be.ok;
                expect(loginInfo.token).to.be.ok;
                expect(loginInfo.refreshToken).to.be.ok;
            }

            new TestSingle<LoginInfoDTO>(
                'wrong password',
                userService.loginUser,
                ['', userService.crypto.encrypt('password')],
                (result: LoginInfoDTO | null, err: any, __: any[]) => {
                    expect(result).to.be.null;
                    expect(err).to.be.instanceOf(WrongPasswordError);
                }
            )
                .addPrecondition(() => {
                    mockTokenDao.create = async (_: TokenSetDTO) => {
                        return true;
                    };

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
                })
                .test(it);

            new TestSingle<LoginInfoDTO>(
                'common',
                userService.loginUser,
                ['', userService.crypto.encrypt('encrypted')],
                composeValidator(
                    loginInfoValidator,
                    (result: LoginInfoDTO | null, err: any, __: any[]) => {
                        expect(result).to.be.not.null;
                        expect(err).to.be.null;
                    }
                )
            )
                .addPrecondition(() => {
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
                })
                .test(it);
        });

        describe('# method: checkPassword', () => {
            new TestSingle<boolean>(
                'valid password',
                userService.checkPassword,
                [1, userService.crypto.encrypt('encrypted')],
                (result: boolean | null, err: any, __: any[]) => {
                    expect(result).to.be.true;
                    expect(err).to.be.null;
                }
            )
                .addPrecondition(() => {
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
                })
                .test(it);

            new TestSingle<boolean>(
                'invalid password',
                userService.checkPassword,
                [1, userService.crypto.encrypt('encrypted2')],
                (result: boolean | null, err: any, __: any[]) => {
                    expect(result).to.be.false;
                    expect(err).to.be.null;
                }
            )
                .addPrecondition(() => {
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
                })
                .test(it);
        });
    });

    describe('▶ update Test', () => {
        describe('# method: updateUser', () => {
            new TestSingle<UserDTO>(
                'common',
                userService.updateUser,
                [{ userIdx: 1 }],
                (result: UserDTO | null, err: any, _: any[]) => {
                    expect(result).to.be.not.null;
                    expect(err).to.be.null;
                    UserMockHelper.validTest.call(result!!);
                }
            ).test(it);
        });

        describe('# method: changePassword', () => {
            new TestSingle<number>(
                'common',
                userService.changePassword,
                [
                    1,
                    userService.crypto.encrypt('encrypted'),
                    userService.crypto.encrypt('newpassword'),
                ],
                (result: number | null, err: any, _: any[]) => {
                    expect(result).to.be.not.null;
                    expect(err).to.be.null;
                    expect(result).to.be.eq(1);
                }
            )
                .addPrecondition(() => {
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
                })
                .test(it);

            new TestSingle<number>(
                'wrong password',
                userService.changePassword,
                [
                    1,
                    userService.crypto.encrypt('wrong'),
                    userService.crypto.encrypt(''),
                ],
                (result: number | null, err: any, _: any[]) => {
                    expect(result).to.be.null;
                    expect(err).to.be.instanceOf(WrongPasswordError);
                }
            )
                .addPrecondition(() => {
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
                })
                .test(it);

            new TestSingle<number>(
                'same password',
                userService.changePassword,
                [
                    1,
                    userService.crypto.encrypt('encrypted'),
                    userService.crypto.encrypt('encrypted'),
                ],
                (result: number | null, err: any, _: any[]) => {
                    expect(result).to.be.null;
                    expect(err).to.be.instanceOf(PasswordPolicyError);
                }
            )
                .addPrecondition(() => {
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
                })
                .test(it);
        });
    });
});
