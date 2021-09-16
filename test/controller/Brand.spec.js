const dotenv = require('dotenv');
dotenv.config();

const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');

const basePath = '/A.fume/api/0.0.1';
const {
    BrandDTO,
    ListAndCountDTO,
    CreatedResultDTO,
} = require('../../data/dto');
const { BrandFilterVO } = require('../../data/vo');

const mockBrandDTO = new BrandDTO({
    brandIdx: 1,
    name: '브랜드1',
    englishName: 'BRAND1',
    firstInitial: 'ㅂ',
    imageUrl: 'http://',
    description: '이것은 브랜드',
    createdAt: '2021-07-24T03:38:52.000Z',
    updatedAt: '2021-07-24T03:38:52.000Z',
});

const mockListAndCountDTO = new ListAndCountDTO({
    count: 1,
    rows: [mockBrandDTO, mockBrandDTO, mockBrandDTO],
});

const mockBrandService = {};
const Brand = require('../../controllers/Brand.js');
Brand.setBrandService(mockBrandService);

describe('# Brand Controller Test', () => {
    describe('# getBrandAll Test', () => {
        mockBrandService.getBrandAll = async () => mockListAndCountDTO;
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
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
                brands: [mockBrandDTO, mockBrandDTO, mockBrandDTO],
            }),
        ];
        it('success case', (done) => {
            request(app)
                .get(`${basePath}/filter/brand`)
                .expect((res) => {
                    expect(res.status).to.be.eq(200);
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
