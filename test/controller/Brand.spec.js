const request = require('supertest');
const chai = require('chai');
const { expect } = chai;
const app = require('../../index.js');
require('../../lib/token').verify = (token) => {
    return {
        userIdx: 1,
    };
};

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

const mockBrandInputDTO = {
    name: '(테스트)조말론',
    englishName: '(테스트)Jo Malone',
    firstInitial: 'ㅌ',
    description: '(테스트)런던 브랜드',
    imageUrl: '(테스트)',
};

const mockListAndCountDTO = new ListAndCountDTO({
    count: 1,
    rows: [mockBrandDTO, mockBrandDTO, mockBrandDTO],
});

const Brand = require('../../controllers/Brand.js');
Brand.setBrandService({
    insertBrand: async (brandDTO) =>
        new CreatedResultDTO({
            idx: 1,
            created: mockBrandDTO,
        }),
    getBrandByIdx: async (brandIdx) => mockBrandDTO,
    searchBrand: async (pagingDTO) => mockListAndCountDTO,
    getBrandAll: async () => mockListAndCountDTO,
    putBrand: async (brandDTO) => 1,
    deleteBrand: async (brandIdx) => 1,
    getFilterBrand: async (condition) => [
        new BrandFilterVO({
            firstInitial: 'ㄱ',
            brands: [],
        }),
        new BrandFilterVO({
            firstInitial: 'ㅂ',
            brands: [mockBrandDTO, mockBrandDTO, mockBrandDTO],
        }),
    ],
    findBrandByEnglishName: async (englishName) => mockBrandDTO,
});

describe('# Brand Controller Test', () => {
    // describe('# searchBrand Test', () => {
    //     it('success case', (done) => {
    //         request(app)
    //             .get(`${basePath}/brand/search`)
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(200);
    //                 const { message, data } = res.body;
    //                 expect(message).to.be.eq('브랜드 검색 성공');
    //                 expect(data.count).to.be.gt(0);
    //                 for (const brand of data.rows) {
    //                     expect(brand).to.be.have.property('brandIdx');
    //                     expect(brand).to.be.have.property('name');
    //                     expect(Object.entries(brand).length).to.be.eq(2);
    //                 }
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });
    // });

    describe('# getBrandAll Test', () => {
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

    // describe('# postBrand Test', () => {
    //     it('success case', (done) => {
    //         request(app)
    //             .post(`${basePath}/brand`)
    //             .set('x-access-token', 'Bearer {token}')
    //             .send(mockBrandInputDTO)
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(200);
    //                 const { message, data } = res.body;
    //                 expect(message).to.be.eq('브랜드 추가 성공');
    //                 expect(data).to.be.eq(1);
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });

    //     it('No permission case', (done) => {
    //         request(app)
    //             .post(`${basePath}/brand`)
    //             .send(mockBrandInputDTO)
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(401);
    //                 const { message } = res.body;
    //                 expect(message).to.be.eq('권한이 없습니다.');
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });
    // });

    // describe('# putBrand Test', () => {
    //     it('success case', (done) => {
    //         request(app)
    //             .put(`${basePath}/brand/1`)
    //             .set('x-access-token', 'Bearer {token}')
    //             .send(mockBrandInputDTO)
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(200);
    //                 const { message } = res.body;
    //                 expect(message).to.be.eq('브랜드 수정 성공');
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });

    //     it('No permission case', (done) => {
    //         request(app)
    //             .put(`${basePath}/brand/1`)
    //             .send(mockBrandInputDTO)
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(401);
    //                 const { message } = res.body;
    //                 expect(message).to.be.eq('권한이 없습니다.');
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });
    // });

    // describe('# deleteBrand Test', () => {
    //     it('success case', (done) => {
    //         request(app)
    //             .delete(`${basePath}/brand/1`)
    //             .set('x-access-token', 'Bearer {token}')
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(200);
    //                 const { message } = res.body;
    //                 expect(message).to.be.eq('브랜드 삭제 성공');
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });

    //     it('No permission case', (done) => {
    //         request(app)
    //             .delete(`${basePath}/brand/1`)
    //             .expect((res) => {
    //                 expect(res.status).to.be.eq(401);
    //                 const { message } = res.body;
    //                 expect(message).to.be.eq('권한이 없습니다.');
    //                 done();
    //             })
    //             .catch((err) => done(err));
    //     });
    // });

    describe('# getFilterBrand Test', () => {
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
