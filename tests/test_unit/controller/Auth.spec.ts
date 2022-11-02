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
            before(() => {
                mockAuthService.reissueAccessToken = async (_: TokenSetDTO) => {
                    throw new AbnormalConnectionError();
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
                        expect(res.status).to.be.eq(StatusCode.FORBIDDEN);
                        const { message } = res.body;
                        expect(message).to.be.eq(ABNORMAL_CONNECTION);
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
