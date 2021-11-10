import dotenv from 'dotenv';
dotenv.config();
import BrandResponseHelper from '../data/response_dto/brand/BrandResponseHelper';
import BrandFilterResponseHelper from '../data/response_dto/brand/BrandFilterResponseHelper';

const request = require('supertest');
const app = require('../../src/index.js');
const expect = require('../utils/expect');

const basePath = '/A.fume/api/0.0.1';
const { ListAndCountDTO } = require('../../src/data/dto');
const BrandDTO = require('../data/dto/BrandDTO');
const BrandFilterDTO = require('../../src/data/dto/BrandFilterDTO');
const statusCode = require('../../src/utils/statusCode');

const Brand = require('../../src/controllers/Brand.js');

const mockBrandService = {};
Brand.setBrandService(mockBrandService);

describe('# Brand Controller Test', () => {
    describe('# getBrandAll Test', () => {
        mockBrandService.getBrandAll = async () =>
            new ListAndCountDTO({
                count: 1,
                rows: [BrandDTO.create(), BrandDTO.create(), BrandDTO.create()],
            });
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;

                    expect(message).to.be.eq('브랜드 조회 성공');
                    expect(data.count).to.be.gt(0);
                    data.rows.forEach((brand) => {
                        BrandResponseHelper.validTest.call(brand);
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        mockBrandService.getFilterBrand = async (condition) => [
            new BrandFilterDTO({
                firstInitial: 'ㄱ',
                brands: [],
            }),
            new BrandFilterDTO({
                firstInitial: 'ㅂ',
                brands: [
                    BrandDTO.create(),
                    BrandDTO.create(),
                    BrandDTO.create(),
                ],
            }),
        ];
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/filter/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(statusCode.OK);
                    const { message, data } = res.body;
                    expect(message).to.be.eq('브랜드 필터 조회 성공');
                    for (const item of data) {
                        BrandFilterResponseHelper.validTest.call(item);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
