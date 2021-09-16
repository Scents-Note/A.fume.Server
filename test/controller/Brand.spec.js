const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';
const { ListAndCountDTO, CreatedResultDTO } = require('../../data/dto');
const BrandDTO = require('../data/dto/BrandDTO');
const { BrandFilterVO } = require('../../data/vo');
const statusCode = require('../../utils/statusCode');

const mockBrandService = {};
const Brand = require('../../controllers/Brand.js');
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
                    for (const brand of data.rows) {
                        expect(brand).to.be.have.property('brandIdx');
                        expect(brand).to.be.have.property('name');
                        expect(Object.entries(brand).length).to.be.eq(2);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        mockBrandService.getFilterBrand = async (condition) => [
            new BrandFilterVO({
                firstInitial: 'ㄱ',
                brands: [],
            }),
            new BrandFilterVO({
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
                    for (const brandFilterResponseDTO of data) {
                        expect(brandFilterResponseDTO).have.property(
                            'firstInitial'
                        );
                        expect(brandFilterResponseDTO).have.property('brands');
                        for (const brand of brandFilterResponseDTO.brands) {
                            expect(brand).to.be.have.property('brandIdx');
                            expect(brand).to.be.have.property('name');
                            expect(Object.entries(brand).length).to.be.eq(2);
                        }
                        expect();
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
