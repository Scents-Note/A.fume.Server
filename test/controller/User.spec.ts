import dotenv from 'dotenv';
import request from 'supertest';
import { Done } from 'mocha';
dotenv.config();

import JwtController from '../../src/lib/JwtController';
import TokenPayloadDTO from '../../src/data/dto/TokenPayloadDTO';
import UserAuthDTO from '../../src/data/dto/UserAuthDTO';
import StatusCode from '../../src/utils/statusCode';
import UserDTO from '../../src/data/dto/UserDTO';

import TokenGroupDTO from '../../src/data/dto/TokenGroupDTO';

import UserMockHelper from '../mock_helper/UserMockHelper';
import LoginInfoMockHelper from '../mock_helper/LoginInfoMockHelper';
import TokenGroupMockHelper from '../mock_helper/TokenGroupMockHelper';

import {
    MSG_REGISTER_SUCCESS,
    MSG_DELETE_USER_SUCCESS,
    MSG_LOGIN_SUCCESS,
    MSG_MODIFY_USER_SUCCESS,
    MSG_GET_AUTHORIZE_INFO,
    MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE,
    MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_AVAILABLE,
    MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE,
    MSG_INVALID_TOKEN,
    NO_AUTHORIZE,
    MSG_CHANGE_PASSWORD_SUCCESS,
} from '../../src/utils/strings';

const expect = require('../utils/expect');

const User = require('../../src/controllers/User');

const app = require('../../src/index.js');

const basePath = '/A.fume/api/0.0.1';

const mockUserService: any = {};
User.setUserService(mockUserService);

const user1tokenUser = JwtController.create(
    new TokenPayloadDTO(1, 'nickname', 'MAN', 'email', 1995)
);
const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoyMDAsIm5pY2tuYW1lIjoi7L-87Lm066eoMiIsImdlbmRlciI6ImZlbWFsZSIsImVtYWlsIjoiaGVlLnlvdW4yQHNhbXN1bmcuY29tIiwiYmlydGgiOjE5OTUsImlhdCI6MTYyOTEwNzc3NSwiZXhwIjoxNjMwODM1Nzc1LCJpc3MiOiJhZnVtZS1qYWNrcG90In0.hWxF0OHzIWZoQhPhkkOyJs3HYB2tPdrpIaVqe0IZRKI';

describe('# User Controller Test', () => {
    describe('# registerUser Test', () => {
        mockUserService.createUser = async (): Promise<TokenGroupDTO> =>
            TokenGroupMockHelper.createMock({});
        it('success case', (done: Done) => {
            request(app)
                .post(`${basePath}/user/register`)
                .send({
                    email: 'hee.youn@samsung.com',
                    nickname: '쿼카맨',
                    gender: 'MAN',
                    birth: 1995,
                    password: 'test',
                })
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_REGISTER_SUCCESS);
                    expect.hasProperties.call(
                        data,
                        'userIdx',
                        'token',
                        'refreshToken'
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# deleteUser Test', () => {
        mockUserService.deleteUser = async () => {
            const affectedRows = 1;
            return affectedRows;
        };
        it('success case', (done: Done) => {
            request(app)
                .delete(`${basePath}/user/1`)
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message } = res.body;
                    expect(message).to.be.eq(MSG_DELETE_USER_SUCCESS);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# loginUser Test', () => {
        mockUserService.loginUser = async (email: string, _: string) => {
            return LoginInfoMockHelper.createMock({ email });
        };
        it('success case', (done: Done) => {
            request(app)
                .post(`${basePath}/user/login`)
                .send({
                    email: 'hee.youn@samsung.com',
                    password: 'test',
                })
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_LOGIN_SUCCESS);
                    expect.hasProperties.call(
                        data,
                        'userIdx',
                        'nickname',
                        'gender',
                        'email',
                        'birth',
                        'token',
                        'refreshToken'
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# updateUser Test', () => {
        mockUserService.updateUser = async (): Promise<UserDTO> => {
            return UserMockHelper.createMock({});
        };
        it('success case', (done: Done) => {
            request(app)
                .put(`${basePath}/user/1`)
                .set('x-access-token', 'Bearer ' + user1tokenUser)
                .send({
                    email: 'hee.youn@samsung.com',
                    nickname: '쿼카맨',
                    gender: 'MAN',
                    birth: 1995,
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_MODIFY_USER_SUCCESS);
                    expect.hasProperties.call(
                        data,
                        'userIdx',
                        'nickname',
                        'gender',
                        'email',
                        'birth'
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('No permission case', (done: Done) => {
            request(app)
                .put(`${basePath}/user/1`)
                .set('x-access-token', 'Bearer ' + invalidToken)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.UNAUTHORIZED);
                    const { message } = res.body;
                    expect(message).to.be.eq(MSG_INVALID_TOKEN);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('Wrong userIdx between path and jwt case', (done: Done) => {
            request(app)
                .put(`${basePath}/user/2`)
                .set('x-access-token', 'Bearer ' + user1tokenUser)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.UNAUTHORIZED);
                    const { message } = res.body;
                    expect(message).to.be.eq(NO_AUTHORIZE);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# changePassword Test', () => {
        mockUserService.changePassword = async ({}): Promise<number> => {
            const affectedRows = 1;
            return affectedRows;
        };
        it('success case', (done: Done) => {
            request(app)
                .put(`${basePath}/user/changePassword`)
                .set('x-access-token', 'Bearer ' + user1tokenUser)
                .send({
                    prevPassword: 'test',
                    newPassword: 'change',
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message } = res.body;
                    expect(message).to.be.eq(MSG_CHANGE_PASSWORD_SUCCESS);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('No permission case', (done: Done) => {
            request(app)
                .put(`${basePath}/user/changePassword`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.UNAUTHORIZED);
                    const { message } = res.body;
                    expect(message).to.be.eq(MSG_INVALID_TOKEN);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# authUser Test', () => {
        mockUserService.authUser = async (): Promise<UserAuthDTO> => {
            return new UserAuthDTO(false, false);
        };
        it('success case', (done: Done) => {
            request(app)
                .post(`${basePath}/user/auth`)
                .set('x-access-token', 'Bearer ' + user1tokenUser)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_GET_AUTHORIZE_INFO);
                    expect.hasProperties.call(data, 'isAuth', 'isAdmin');
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('No permission case', (done: Done) => {
            request(app)
                .post(`${basePath}/user/auth`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_GET_AUTHORIZE_INFO);
                    expect.hasProperties.call(data, 'isAuth', 'isAdmin');
                    expect(data.isAuth).to.be.false;
                    expect(data.isAdmin).to.be.false;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# validateEmail Test', () => {
        mockUserService.validateEmail = async (
            email: string
        ): Promise<Boolean> => {
            if (email && email != 'duplicate') return true;
            else return false;
        };
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/user/validate/email?email=test`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(
                        MSG_DUPLICATE_CHECK_EMAIL_AVAILABLE
                    );
                    expect(data).to.be.true;
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('duplicate case', (done: Done) => {
            request(app)
                .get(`${basePath}/user/validate/email?email=duplicate`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.CONFLICT);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(
                        MSG_DUPLICATE_CHECK_EMAIL_UNAVAILABLE
                    );
                    expect(data).to.be.false;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# validateName Test', () => {
        mockUserService.validateName = async (
            nickname: string
        ): Promise<Boolean> => {
            if (nickname && nickname != 'duplicate') return true;
            else return false;
        };
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/user/validate/name?nickname=test`)
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(
                        MSG_DUPLICATE_CHECK_NAME_AVAILABLE
                    );
                    expect(data).to.be.true;
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('duplicate case', (done: Done) => {
            request(app)
                .get(`${basePath}/user/validate/name?nickname=duplicate`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.CONFLICT);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(
                        MSG_DUPLICATE_CHECK_NAME_UNAVAILABLE
                    );
                    expect(data).to.be.false;
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
