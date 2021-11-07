const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../src/index.js');
const {
    InvalidTokenError,
    ExpiredTokenError,
} = require('../../src/utils/errors/errors');

const basePath = '/A.fume/api/0.0.1';

const statusCode = require('../../src/utils/statusCode');

const User = require('../../src/controllers/User.js');
const mockUserService = {};
User.setUserService(mockUserService);

const UserResponseDTO = require('../data/response_dto/user/UserResponseDTO');
const UserRegisterResponseDTO = require('../data/response_dto/user/UserRegisterResponseDTO');
const UserAuthResponseDTO = require('../data/response_dto/user/UserAuthResponseDTO');

const token = require('../../src/lib/token');
const LoginResponseDTO = require('../data/response_dto/user/LoginResponseDTO.js');
const TokenGroupDTO = require('../data/dto/TokenGroupDTO');
const LoginInfoDTO = require('../data/dto/LoginInfoDTO');
const UserDTO = require('../data/dto/UserDTO');
const { UserAuthDTO } = require('../../src/data/dto');
const user1token = token.create({ userIdx: 1 });
const invalidToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWR4IjoyMDAsIm5pY2tuYW1lIjoi7L-87Lm066eoMiIsImdlbmRlciI6ImZlbWFsZSIsImVtYWlsIjoiaGVlLnlvdW4yQHNhbXN1bmcuY29tIiwiYmlydGgiOjE5OTUsImlhdCI6MTYyOTEwNzc3NSwiZXhwIjoxNjMwODM1Nzc1LCJpc3MiOiJhZnVtZS1qYWNrcG90In0.hWxF0OHzIWZoQhPhkkOyJs3HYB2tPdrpIaVqe0IZRKI';

describe('# User Controller Test', () => {
    describe('# registerUser Test', () => {
        mockUserService.createUser = async () => TokenGroupDTO.createMock();
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/user/register`)
                .send({
                    email: 'hee.youn@samsung.com',
                    nickname: '쿼카맨',
                    gender: 'MAN',
                    birth: 1995,
                    password: 'test',
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('회원가입 성공');
                    UserRegisterResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# deleteUser Test', () => {
        mockUserService.deleteUser = async () => {
            const affectedRows = 1;
            return affectedRows;
        };
        it('success case', (done) => {
            request(app)
                .delete(`${basePath}/user/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message } = res.body;
                    expect(message).to.be.eq('유저 삭제 성공');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# loginUser Test', () => {
        mockUserService.loginUser = async (email, password) => {
            return LoginInfoDTO.createMock({ email });
        };
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/user/login`)
                .send({
                    email: 'hee.youn@samsung.com',
                    password: 'test',
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('로그인 성공');
                    LoginResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# updateUser Test', () => {
        mockUserService.updateUser = async () => {
            return UserDTO.createMock();
        };
        it('success case', (done) => {
            request(app)
                .put(`${basePath}/user/1`)
                .set('x-access-token', 'Bearer ' + user1token)
                .send({
                    email: 'hee.youn@samsung.com',
                    nickname: '쿼카맨',
                    gender: 'MAN',
                    birth: 1995,
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('유저 수정 성공');
                    UserResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .put(`${basePath}/user/1`)
                .set('x-access-token', 'Bearer ' + invalidToken)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.UNAUTHORIZED);
                    const { message } = res.body;
                    expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                    done();
                })
                .catch((err) => done(err));
        });

        it('Wrong userIdx between path and jwt case', (done) => {
            request(app)
                .put(`${basePath}/user/2`)
                .set('x-access-token', 'Bearer ' + user1token)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.UNAUTHORIZED);
                    const { message } = res.body;
                    expect(message).to.be.eq('권한이 없습니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# changePassword Test', () => {
        mockUserService.changePassword = async ({}) => {
            const affectedRows = 1;
            return affectedRows;
        };
        it('success case', (done) => {
            request(app)
                .put(`${basePath}/user/changePassword`)
                .set('x-access-token', 'Bearer ' + user1token)
                .send({
                    prevPassword: 'test',
                    newPassword: 'change',
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message } = res.body;
                    expect(message).to.be.eq('비밀번호 변경 성공');
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .put(`${basePath}/user/changePassword`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.UNAUTHORIZED);
                    const { message } = res.body;
                    expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# authUser Test', () => {
        mockUserService.authUser = async () => {
            return new UserAuthDTO({ isAuth: false, isAdmin: false });
        };
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/user/auth`)
                .set('x-access-token', 'Bearer ' + user1token)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('권한 조회');
                    UserAuthResponseDTO.validTest.call(data);
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .post(`${basePath}/user/auth`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('권한 조회');
                    UserAuthResponseDTO.validTest.call(data);
                    expect(data.isAuth).to.be.false;
                    expect(data.isAdmin).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# validateEmail Test', () => {
        mockUserService.validateEmail = async (email) => {
            if (email && email != 'duplicate') return true;
            else return false;
        };
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/user/validate/email?email=test`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('Email 중복 체크: 사용 가능');
                    expect(data).to.be.true;
                    done();
                })
                .catch((err) => done(err));
        });

        it('duplicate case', (done) => {
            request(app)
                .get(`${basePath}/user/validate/email?email=duplicate`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.CONFLICT);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('Email 중복 체크: 사용 불가능');
                    expect(data).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# validateName Test', () => {
        mockUserService.validateName = async (nickname) => {
            if (nickname && nickname != 'duplicate') return true;
            else return false;
        };
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/user/validate/name?nickname=test`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('Name 중복 체크: 사용 가능');
                    expect(data).to.be.true;
                    done();
                })
                .catch((err) => done(err));
        });

        it('duplicate case', (done) => {
            request(app)
                .get(`${basePath}/user/validate/name?nickname=duplicate`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.CONFLICT);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('Name 중복 체크: 사용 불가능');
                    expect(data).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
