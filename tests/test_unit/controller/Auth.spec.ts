import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
dotenv.config();

import StatusCode from '@utils/statusCode';
import { JsonWebTokenError } from 'jsonwebtoken';

import {
    MSG_REISSUE_SUCCESS,
    BASE_PATH,
    ABNORMAL_CONNECTION,
} from '@utils/strings';

import { OpCode } from '@response/common';

import { TokenSetDTO } from '@dto/index';

import { AbnormalConnectionError } from '@errors';

import app from '@src/app';

const mockAuthService: any = {};

const Auth = require('@controllers/Auth');
Auth.setAuthService.bind(Auth)(mockAuthService);

const expect = require('../utils/expect');

const basePath: string = BASE_PATH;

describe('# Auth Controller Test', () => {
    describe('# reissueAccessToken Test', () => {
        describe('# success case', () => {
            before(() => {
                mockAuthService.reissueAccessToken = async (_: TokenSetDTO) => {
                    return 'newAccessToken';
                };
            });
            it('# test', (done: Done) => {
                request(app)
                    .post(`${basePath}/auth/reissue`)
                    .send({
                        accessToken: '',
                        refreshToken: '',
                    })
                    .expect((res: any) => {
                        expect(res.status).to.be.eq(StatusCode.OK);
                        const { message, data } = res.body;
                        expect(message).to.be.eq(MSG_REISSUE_SUCCESS);
                        expect(data).to.be.eq('newAccessToken');
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
        describe('# fail case with abnormalConeectionError', () => {
            const inputToken: string = '';
            before(() => {
                mockAuthService.reissueAccessToken = async (
                    token: TokenSetDTO
                ) => {
                    expect(token.accessToken).to.be.eq(inputToken);
                    expect(token.refreshToken).to.be.eq(inputToken);
                    throw new AbnormalConnectionError();
                };
            });
            it('# test', (done: Done) => {
                request(app)
                    .post(`${basePath}/auth/reissue`)
                    .send({
                        accessToken: inputToken,
                        refreshToken: inputToken,
                    })
                    .expect((res: any) => {
                        expect(res.status).to.be.eq(StatusCode.FORBIDDEN);
                        const { message, opcode } = res.body;
                        expect(message).to.be.eq(ABNORMAL_CONNECTION);
                        expect(opcode).to.be.eq(OpCode.LOGOUT);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# fail case with JsonWebTokenError', () => {
            before(() => {
                mockAuthService.reissueAccessToken = async (_: TokenSetDTO) => {
                    throw new JsonWebTokenError('test');
                };
            });
            it('# test', (done: Done) => {
                request(app)
                    .post(`${basePath}/auth/reissue`)
                    .send({
                        accessToken: '',
                        refreshToken: '',
                    })
                    .expect((res: any) => {
                        expect(res.status).to.be.eq(StatusCode.BAD_REQUEST);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
