import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
dotenv.config();

import StatusCode from '@utils/statusCode';

import {
    MSG_GET_SUPPORTABLE_YES,
    MSG_GET_SUPPORTABLE_NO,
    BASE_PATH,
} from '@utils/strings';

import app from '@src/app';

const basePath: string = BASE_PATH;

const System: any = require('@controllers/System');
const androidChecker = System.VersionCheckerFactory.factory('android');

describe('# System Controller Test', () => {
    describe('# getSupportable Test', () => {
        it('# case : same version', (done: Done) => {
            request(app)
                .get(
                    `${basePath}/system/supportable?apkversion=${androidChecker.latestVersion}`
                )
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq(MSG_GET_SUPPORTABLE_YES);
                    expect(data).to.be.eq(true);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# case : over version', (done: Done) => {
            request(app)
                .get(
                    `${basePath}/system/supportable?apkversion=${androidChecker.latestVersion.increase()}`
                )
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq(MSG_GET_SUPPORTABLE_YES);
                    expect(data).to.be.eq(true);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# case : previous version', (done: Done) => {
            request(app)
                .get(
                    `${basePath}/system/supportable?apkversion=${androidChecker.prevVersion}`
                )
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq(MSG_GET_SUPPORTABLE_YES);
                    expect(data).to.be.eq(true);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# case : old version', (done: Done) => {
            request(app)
                .get(`${basePath}/system/supportable?apkversion=1.3.9`)
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq(MSG_GET_SUPPORTABLE_NO);
                    expect(data).to.be.eq(false);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# case : old version', (done: Done) => {
            request(app)
                .get(`${basePath}/system/supportable?apkversion=0.9.9`)
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq(MSG_GET_SUPPORTABLE_NO);
                    expect(data).to.be.eq(false);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
