import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
dotenv.config();

import StatusCode from '@utils/statusCode';

import {
    // MSG_GET_BRAND_ALL_SUCCESS,
    MSG_GET_BRAND_FILTER_SUCCESS,
    BASE_PATH,
} from '@utils/strings';

import { BrandResponse } from '@response/brand';

// import { BrandDTO } from '@dto/index';

import app from '@src/app';

const expect = require('../utils/expect');

const basePath: string = BASE_PATH;

describe('# Brand Controller Test', () => {
    // describe('# getBrandAll Test', () => {
    //     it('success case', (done: Done) => {
    //         request(app)
    //             .get(`${basePath}/brand`)
    //             .expect((res: any) => {
    //                 expect(res.status).to.be.eq(StatusCode.OK);
    //                 const { message, data } = res.body;

    //                 expect(message).to.be.eq(MSG_GET_BRAND_ALL_SUCCESS);
    //                 expect(data.count).to.be.gt(0);
    //                 data.rows.forEach((brand: BrandDTO) => {
    //                     expect.hasProperties.call(brand, 'brandIdx', 'name');
    //                 });
    //                 done();
    //             })
    //             .catch((err: Error) => done(err));
    //     });
    //     it('success case with paging', (done: Done) => {
    //         request(app)
    //             .get(`${basePath}/brand?requestSize=1`)
    //             .expect((res: any) => {
    //                 expect(res.status).to.be.eq(StatusCode.OK);
    //                 const { message, data } = res.body;

    //                 expect(message).to.be.eq(MSG_GET_BRAND_ALL_SUCCESS);
    //                 expect(data.count).to.be.gt(0);
    //                 data.rows.forEach((brand: BrandDTO) => {
    //                     expect.hasProperties.call(brand, 'brandIdx', 'name');
    //                 });
    //                 expect(data.rows.length).to.be.eq(1);
    //                 done();
    //             })
    //             .catch((err: Error) => done(err));
    //     });
    // });

    describe('# getFilterBrand Test', () => {
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/filter/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq(MSG_GET_BRAND_FILTER_SUCCESS);
                    for (const item of data) {
                        item.brands.forEach((brand: BrandResponse) => {
                            expect.hasProperties.call(
                                brand,
                                'brandIdx',
                                'name'
                            );
                        });
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
