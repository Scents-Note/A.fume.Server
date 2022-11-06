import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
dotenv.config();

import StatusCode from '@utils/statusCode';

import app from '@src/app';

import { TokenSetDTO } from '@dto/index';
import { BASE_PATH, ABNORMAL_CONNECTION } from '@utils/strings';

import { ResponseDTO, SimpleResponseDTO, Opcode } from '@response/common';
import { LoginResponse } from '@response/user';

const basePath: string = BASE_PATH;

describe('# Auth Controller Test', () => {
    describe('# pass Test', () => {
        it('success case', (done: Done) => {
            request(app)
                .get(`/docs`)
                .expect((res: request.Response) => {
                    expect(res.status).to.be.eq(StatusCode.MOVED_PERMANENTLY);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
    describe(' # normal case', () => {
        it('success case', (done: Done) => {
            request(app)
                .post(`${basePath}/user/login`)
                .send({
                    email: process.env.TEST_ACCOUNT_ID!!,
                    password: process.env.TEST_ACCOUNT_PWD!!,
                })
                .expect(StatusCode.OK)
                .end((err: Error, res: request.Response) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    const responseDTO: ResponseDTO<LoginResponse> = res.body;
                    const loginResponse: LoginResponse = responseDTO.data;
                    const tokenSet: TokenSetDTO = new TokenSetDTO(
                        loginResponse.token,
                        loginResponse.refreshToken
                    );
                    expect(tokenSet).to.be.not.null;
                    request(app)
                        .post(`${basePath}/auth/reissue`)
                        .send({
                            accessToken: tokenSet.accessToken,
                            refreshToken: tokenSet.refreshToken,
                        })
                        .expect(StatusCode.OK)
                        .end((err: Error, _: request.Response) => {
                            if (err) {
                                done(err);
                                return;
                            }
                            done();
                        });
                });
        });
    });

    describe(' # hacker attack case with access token', () => {
        it('success case', (done: Done) => {
            request(app)
                .post(`${basePath}/user/login`)
                .send({
                    email: process.env.TEST_ACCOUNT_ID!!,
                    password: process.env.TEST_ACCOUNT_PWD!!,
                })
                .expect(StatusCode.OK)
                .end((err: Error, res: request.Response) => {
                    if (err) {
                        done(err);
                        return;
                    }
                    expect(err).to.be.null;
                    const responseDTO: ResponseDTO<LoginResponse> = res.body;
                    const loginResponse: LoginResponse = responseDTO.data;
                    const tokenSet = new TokenSetDTO(
                        loginResponse.token,
                        loginResponse.refreshToken
                    );
                    // user access
                    setTimeout(() => {
                        request(app)
                            .post(`${basePath}/auth/reissue`)
                            .send({
                                accessToken: tokenSet.accessToken,
                                refreshToken: tokenSet.refreshToken,
                            })
                            .expect(StatusCode.OK)
                            .end((err: Error, _: request.Response) => {
                                if (err) {
                                    done(err);
                                    return;
                                }
                                // hacker access
                                request(app)
                                    .post(`${basePath}/auth/reissue`)
                                    .send({
                                        accessToken: tokenSet.accessToken,
                                        refreshToken: tokenSet.refreshToken,
                                    })
                                    .expect(StatusCode.FORBIDDEN)
                                    .end(
                                        (err: Error, res: request.Response) => {
                                            if (err) {
                                                done(err);
                                                return;
                                            }
                                            const responseDTO: SimpleResponseDTO =
                                                res.body;
                                            expect(
                                                responseDTO.message
                                            ).to.be.eq(ABNORMAL_CONNECTION);
                                            expect(responseDTO.opcode).to.be.eq(
                                                Opcode.LOGOUT
                                            );
                                            done();
                                        }
                                    );
                            });
                    }, 1000);
                });
        });
    });
});
