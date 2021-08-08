const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');
const {
    InvalidTokenError,
    ExpiredTokenError,
} = require('../../utils/errors/errors');
require('../../lib/token').verify = (token) => {
    if (token == 'expired') {
        throw new ExpiredTokenError();
    }
    if (token == 'invalid') {
        throw new InvalidTokenError();
    }
    return {
        userIdx: 1,
        nickname: '쿼카맨2',
        gender: 'female',
        phone: '010-2081-38',
        email: 'hee.youn2@samsung.com',
        birth: 1995,
        iat: 1628327246,
        exp: 1630055246,
        iss: 'afume-jackpot',
    };
};

const basePath = '/A.fume/api/0.0.1';

const User = require('../../controllers/User.js');
User.setUserService(require('../service/UserService.mock.js'));

describe('# User Controller Test', () => {
    describe('# registerUser Test', () => {
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
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('회원가입 성공');
                    expect(data).to.be.have.property('userIdx');
                    expect(data).to.be.have.property('token');
                    expect(data).to.be.have.property('refreshToken');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# deleteUser Test', () => {
        it('success case', (done) => {
            request(app)
                .delete(`${basePath}/user/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message } = res.body;
                    expect(message).to.be.eq('유저 삭제 성공');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getUserByIdx Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/user/1`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('유저 조회 성공');
                    expect(data).to.be.have.property('userIdx');
                    expect(data).to.be.have.property('nickname');
                    expect(data).to.be.have.property('gender');
                    expect(data).to.be.have.property('email');
                    expect(data).to.be.have.property('birth');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# loginUser Test', () => {
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/user/login`)
                .send({
                    email: 'hee.youn@samsung.com',
                    password: 'test',
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('로그인 성공');
                    expect(data).to.be.have.property('userIdx');
                    expect(data).to.be.have.property('nickname');
                    expect(data).to.be.have.property('gender');
                    expect(data).to.be.have.property('email');
                    expect(data).to.be.have.property('birth');
                    expect(data).to.be.have.property('token');
                    expect(data).to.be.have.property('refreshToken');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# logoutUser Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/user/logout`)
                .set('x-access-token', 'Bearer {token}')
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('로그아웃');
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .get(`${basePath}/user/logout`)
                .expect((res) => {
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('권한이 없습니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# updateUser Test', () => {
        it('success case', (done) => {
            request(app)
                .put(`${basePath}/user/1`)
                .set('x-access-token', 'Bearer {token}')
                .send({
                    email: 'hee.youn@samsung.com',
                    nickname: '쿼카맨',
                    gender: 'MAN',
                    birth: 1995,
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('유저 수정 성공');
                    expect(data).to.be.have.property('userIdx');
                    expect(data).to.be.have.property('nickname');
                    expect(data).to.be.have.property('gender');
                    expect(data).to.be.have.property('email');
                    expect(data).to.be.have.property('birth');
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .put(`${basePath}/user/1`)
                .set('x-access-token', 'Bearer invalid')
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                    done();
                })
                .catch((err) => done(err));
        });

        it('Wrong userIdx between path and jwt case', (done) => {
            request(app)
                .put(`${basePath}/user/2`)
                .set('x-access-token', 'Bearer {token}')
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('유효하지 않는 접근입니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# changePassword Test', () => {
        it('success case', (done) => {
            request(app)
                .put(`${basePath}/user/changePassword`)
                .set('x-access-token', 'Bearer {token}')
                .send({
                    prevPassword: 'test',
                    newPassword: 'change',
                })
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
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
                    expect(res.status).to.be.eq(401);
                    const { message } = res.body;
                    expect(message).to.be.eq('유효하지 않는 토큰입니다.');
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# authUser Test', () => {
        it('success case', (done) => {
            request(app)
                .post(`${basePath}/user/auth`)
                .set('x-access-token', 'Bearer {token}')
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('권한 조회');
                    expect(data).to.be.have.property('isAuth');
                    expect(data).to.be.have.property('isAdmin');
                    done();
                })
                .catch((err) => done(err));
        });

        it('No permission case', (done) => {
            request(app)
                .post(`${basePath}/user/auth`)
                .send({})
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('권한 조회');
                    expect(data).to.be.have.property('isAuth');
                    expect(data).to.be.have.property('isAdmin');
                    expect(data.isAuth).to.be.false;
                    expect(data.isAdmin).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# validateEmail Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/user/validate/email?email=test`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
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
                    expect(res.status).to.be.eq(409);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('Email 중복 체크: 사용 불가능');
                    expect(data).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# validateName Test', () => {
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/user/validate/name?nickname=test`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
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
                    expect(res.status).to.be.eq(409);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('Name 중복 체크: 사용 불가능');
                    expect(data).to.be.false;
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
