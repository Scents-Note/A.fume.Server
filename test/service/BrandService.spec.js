const chai = require('chai');
const { expect } = chai;

const { PagingRequestDTO } = require('../../data/request_dto');

const BrandDTO = require('../data/dto/BrandDTO');
const CreatedResultDTO = require('../data/dto/CreatedResultDTO');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const BrandFilterVO = require('../data/vo/BrandFilterVO');

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
    create: async (brandDTO) =>
        new CreatedResultDTO({
            idx: 1,
            created: mockBrandDTO,
        }),
    read: async (brandIdx) => mockBrandDTO,
    search: async (pagingDTO) => mockListAndCountDTO,
    readAll: async () => mockListAndCountDTO,
    update: async (brandDTO) => 1,
    delete: async (brandIdx) => 1,
    findBrand: async (condition) => mockBrandDTO,
});

describe('# Brand Service Test', () => {
    describe('# searchBrand Test', () => {
        it('# success Test', (done) => {
            Brand.searchBrand(new PagingRequestDTO({}))
                .then((res) => {
                    expect(res).instanceOf(ListAndCountDTO);
                    res.validTest((item) => {
                        expect(item).instanceOf(BrandDTO);
                        item.validTest();
                    });
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
                    res.validTest((item) => {
                        expect(item).instanceOf(BrandDTO);
                        item.validTest();
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getBrandByIdx Test', () => {
        it('# success Test', (done) => {
            Brand.getBrandByIdx(1)
                .then((brandDTO) => {
                    brandDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# insertBrand Test', () => {
        it('# success Test', (done) => {
            Brand.insertBrand(mockBrandDTO)
                .then((res) => {
                    expect(res).instanceOf(CreatedResultDTO);
                    res.validTest((created) => {
                        expect(created).instanceOf(BrandDTO);
                        created.validTest();
                    });
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# putBrand Test', () => {
        it('# success Test', (done) => {
            Brand.putBrand(mockBrandDTO)
                .then((affectedRow) => {
                    expect(affectedRow).to.be.eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# deleteBrand Test', () => {
        it('# success Test', (done) => {
            Brand.deleteBrand(1)
                .then(() => {
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        it('# success Test', (done) => {
            Brand.getFilterBrand()
                .then((result) => {
                    for (const brandFilterVO of result) {
                        expect(brandFilterVO).to.be.instanceOf(BrandFilterVO);
                        brandFilterVO.validTest();
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# findBrandByEnglishName Test', () => {
        it('# success Test', (done) => {
            Brand.findBrandByEnglishName('브랜드')
                .then((brandDTO) => {
                    expect(brandDTO).to.be.instanceOf(BrandDTO);
                    brandDTO.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
