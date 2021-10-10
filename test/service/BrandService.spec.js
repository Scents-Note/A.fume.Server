const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;

const { PagingRequestDTO } = require('../../data/request_dto');

const BrandDTO = require('../data/dto/BrandDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const BrandFilterDTO = require('../data/dto/BrandFilterDTO');

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
const Brand = new (require('../../service/BrandService'))({
    read: async (brandIdx) => mockBrandDTO,
    search: async (pagingDTO) => mockListAndCountDTO,
    readAll: async () => mockListAndCountDTO,
    findBrand: async (condition) => mockBrandDTO,
});

describe('# Brand Service Test', () => {
    describe('# searchBrand Test', () => {
        it('# success Test', (done) => {
            Brand.searchBrand(new PagingRequestDTO({}))
                .then((res) => {
                    expect(res).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(res, BrandDTO.validTest);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getBrandAll Test', () => {
        it('# success Test', (done) => {
            Brand.getBrandAll(1)
                .then((res) => {
                    expect(res).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(res, BrandDTO.validTest);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getBrandByIdx Test', () => {
        it('# success Test', (done) => {
            Brand.getBrandByIdx(1)
                .then((brandDTO) => {
                    expect(brandDTO).to.be.instanceOf(BrandDTO);
                    BrandDTO.validTest.call(brandDTO);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        it('# success Test', (done) => {
            Brand.getFilterBrand()
                .then((result) => {
                    for (const item of result) {
                        expect(item).to.be.instanceOf(BrandFilterDTO);
                        BrandFilterDTO.validTest.call(item);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
