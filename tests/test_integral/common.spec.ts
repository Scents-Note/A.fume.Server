import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
import { expect } from 'chai';
dotenv.config();

import StatusCode from '@utils/statusCode';

import app from '@src/app';

describe('# Controller Test', () => {
    describe('# docs Test', () => {
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
});
