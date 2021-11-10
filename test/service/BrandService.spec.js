import dotenv from 'dotenv';
import chai from 'chai';

import BrandDTO from '../../src/data/dto/BrandDTO';
import BrandHelper from '../data/dto/BrandHelper';
import BrandFilterDTO from '../../src/data/dto/BrandFilterDTO';
import BrandFilterHelper from '../data/dto/BrandFilterHelper';

dotenv.config();
const { expect } = chai;

const { PagingRequestDTO } = require('../../src/data/request_dto');

const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

const mockListAndCountDTO = new ListAndCountDTO({
    count: 1,
    rows: [
        BrandHelper.createWithIdx(1),
        BrandHelper.createWithIdx(2),
        BrandHelper.createWithIdx(3),
    ],
});
const mockBrandDAO = {
    read: async (brandIdx) => BrandHelper.createWithIdx(1),
    search: async (pagingDTO) => mockListAndCountDTO,
    readAll: async () => mockListAndCountDTO,
    findBrand: async (condition) => BrandHelper.createWithIdx(1),
};
const Brand = new (require('../../src/service/BrandService'))(mockBrandDAO);

describe('# Brand Service Test', () => {
    describe('# searchBrand Test', () => {
        it('# success Test', (done) => {
            Brand.searchBrand(new PagingRequestDTO({}))
                .then((res) => {
                    expect(res).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(res, BrandHelper.validTest);
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
                    ListAndCountDTO.validTest.call(res, BrandHelper.validTest);
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
                    BrandHelper.validTest.call(brandDTO);
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
                        BrandFilterHelper.validTest.call(item);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
