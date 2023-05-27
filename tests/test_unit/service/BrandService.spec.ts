import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import BrandService from '@services/BrandService';

import BrandDao from '@dao/BrandDao';

import {
    BrandDTO,
    BrandFilterDTO,
    PagingDTO,
    ListAndCountDTO,
} from '@dto/index';

import BrandHelper from '../mock_helper/BrandHelper';
import BrandFilterHelper from '../mock_helper/BrandFilterHelper';

const mockListAndCountDTO: ListAndCountDTO<BrandDTO> =
    new ListAndCountDTO<BrandDTO>(1, [
        BrandHelper.createWithIdx(1),
        BrandHelper.createWithIdx(2),
        BrandHelper.createWithIdx(3),
    ]);

const mockBrandDAO: BrandDao | any = {
    read: async (_: number) => BrandHelper.createWithIdx(1),
    search: async (_: PagingDTO) => mockListAndCountDTO,
    readAll: async () => mockListAndCountDTO,
};
const Brand: BrandService = new BrandService(mockBrandDAO);

describe('# Brand Service Test', () => {
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
