import dotenv from 'dotenv';
dotenv.config();
import request from 'supertest';
import BrandFilterDTO from '../../src/data/dto/BrandFilterDTO';
import BrandDTO from '../../src/data/dto/BrandDTO';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import BrandResponseDTO from '../../src/data/response_dto/brand/BrandResponseDTO';
import BrandHelper from '../data/dto/BrandHelper';
import BrandService from '../../src/service/BrandService';
import StatusCode from '../../src/utils/statusCode';

const app = require('../../src/index.js');
const expect = require('../utils/expect');

const basePath = '/A.fume/api/0.0.1';

const Brand = require('../../src/controllers/Brand.js');

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
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq('브랜드 조회 성공');
                    expect(data.count).to.be.gt(0);
                    data.rows.forEach((brand) => {
                        expect.hasProperties.call(brand, 'brandIdx', 'name');
                    });
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        mockBrandService.getFilterBrand = async (condition) => [
            new BrandFilterDTO('ㄱ', []),
            new BrandFilterDTO('ㅂ', [
                BrandHelper.create(),
                BrandHelper.create(),
                BrandHelper.create(),
            ]),
        ];
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/filter/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(StatusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('브랜드 필터 조회 성공');
                    for (const item of data) {
                        item.brands.forEach((brand: BrandResponseDTO) => {
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
