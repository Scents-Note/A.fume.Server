import dotenv from 'dotenv';
import { Done } from 'mocha';
import request from 'supertest';
dotenv.config();

import BrandFilterDTO from '../../src/data/dto/BrandFilterDTO';
import BrandDTO from '../../src/data/dto/BrandDTO';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import { BrandResponse } from '../../src/data/response/brand';
import BrandHelper from '../mock_helper/BrandHelper';
import StatusCode from '../../src/utils/statusCode';

import BrandService from '../../src/service/BrandService';

import {
    MSG_GET_BRAND_ALL_SUCCESS,
    MSG_GET_BRAND_FILTER_SUCCESS,
} from '../../src/utils/strings';

const app = require('../../src/index.js');
const expect = require('../utils/expect');

const basePath = '/A.fume/api/0.0.1';

const Brand = require('../../src/controllers/Brand');

const mockBrandService: BrandService | any = {};
Brand.setBrandService(mockBrandService);

describe('# Brand Controller Test', () => {
    describe('# getBrandAll Test', () => {
        mockBrandService.getBrandAll = async () =>
            new ListAndCountDTO<BrandDTO>(1, [
                BrandHelper.create(),
                BrandHelper.create(),
                BrandHelper.create(),
            ]);
        it('success case', (done: Done) => {
            request(app)
                .get(`${basePath}/brand`)
                .expect((res: any) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq(MSG_GET_BRAND_ALL_SUCCESS);
                    expect(data.count).to.be.gt(0);
                    data.rows.forEach((brand: BrandDTO) => {
                        expect.hasProperties.call(brand, 'brandIdx', 'name');
                    });
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        mockBrandService.getFilterBrand = async (_: any) => [
            new BrandFilterDTO('ㄱ', []),
            new BrandFilterDTO('ㅂ', [
                BrandHelper.create(),
                BrandHelper.create(),
                BrandHelper.create(),
            ]),
        ];
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
