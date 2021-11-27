import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import BrandDTO from '../../src/data/dto/BrandDTO';
import BrandHelper from '../data/dto/BrandHelper';
import BrandFilterDTO from '../../src/data/dto/BrandFilterDTO';
import BrandFilterHelper from '../data/dto/BrandFilterHelper';
import BrandService from '../../src/service/BrandService';
import BrandDao from '../../src/dao/BrandDao';
import PagingDTO from '../../src/data/dto/PagingDTO';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';

const { PagingRequestDTO } = require('../../src/data/request_dto');

const mockListAndCountDTO: ListAndCountDTO<BrandDTO> =
    new ListAndCountDTO<BrandDTO>(1, [
        BrandHelper.createWithIdx(1),
        BrandHelper.createWithIdx(2),
        BrandHelper.createWithIdx(3),
    ]);

const mockBrandDAO: BrandDao | any = {
    read: async (brandIdx: number) => BrandHelper.createWithIdx(1),
    search: async (pagingDTO: PagingDTO) => mockListAndCountDTO,
    readAll: async () => mockListAndCountDTO,
    findBrand: async (condition: any) => BrandHelper.createWithIdx(1),
};
const Brand = new BrandService(mockBrandDAO);

describe('# Brand Service Test', () => {
    describe('# searchBrand Test', () => {
        it('# success Test', (done: Done) => {
            Brand.searchBrand(PagingRequestDTO.createByJson({}))
                .then((res: ListAndCountDTO<BrandDTO>) => {
                    expect(res.count).to.be.gt(0);
                    expect(res.rows.length).to.be.gt(0);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getBrandAll Test', () => {
        it('# success Test', (done: Done) => {
            Brand.getBrandAll()
                .then((res: ListAndCountDTO<BrandDTO>) => {
                    expect(res.count).to.be.gt(0);
                    expect(res.rows.length).to.be.gt(0);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getBrandByIdx Test', () => {
        it('# success Test', (done: Done) => {
            Brand.getBrandByIdx(1)
                .then((brandDTO: BrandDTO) => {
                    BrandHelper.validTest.call(brandDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# getFilterBrand Test', () => {
        it('# success Test', (done: Done) => {
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
