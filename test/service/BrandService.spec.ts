import dotenv from 'dotenv';
import { expect } from 'chai';

import BrandDTO from '../../src/data/dto/BrandDTO';
import BrandHelper from '../data/dto/BrandHelper';
import BrandFilterDTO from '../../src/data/dto/BrandFilterDTO';
import BrandFilterHelper from '../data/dto/BrandFilterHelper';
import BrandService from '../../src/service/BrandService';
import BrandDao from '../../src/dao/BrandDao';

dotenv.config();

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
const mockBrandDAO: BrandDao | any = {
    read: async (brandIdx) => BrandHelper.createWithIdx(1),
    search: async (pagingDTO) => mockListAndCountDTO,
    readAll: async () => mockListAndCountDTO,
    findBrand: async (condition) => BrandHelper.createWithIdx(1),
};
const Brand = new BrandService(mockBrandDAO);

describe('# Brand Service Test', () => {
    describe('# searchBrand Test', () => {
        it('# success Test', (done) => {
            Brand.searchBrand(PagingRequestDTO.createByJson({}))
                .then((res: any) => {
                    expect(res).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(res, BrandHelper.validTest);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getBrandAll Test', () => {
        it('# success Test', (done) => {
            Brand.getBrandAll()
                .then((res: any) => {
                    expect(res).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(res, BrandHelper.validTest);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getBrandByIdx Test', () => {
        it('# success Test', (done) => {
            Brand.getBrandByIdx(1)
                .then((brandDTO: BrandDTO) => {
                    BrandHelper.validTest.call(brandDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        it('# success Test', (done) => {
            Brand.getFilterBrand()
                .then((result: BrandFilterDTO[]) => {
                    for (const item of result) {
                        BrandFilterHelper.validTest.call(item);
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
