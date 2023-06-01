import dotenv from 'dotenv';
import { expect } from 'chai';
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

const FIRST_INITIAL_REGEX = /^[ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅍㅌㅎ]$/;

describe('# Brand Service Test', () => {
    describe('# getBrandAll Test', () => {
        it('# success Test', () => {
            Brand.getBrandAll().then((res: ListAndCountDTO<BrandDTO>) => {
                expect(res.count).to.be.gt(0);
                expect(res.rows.length).to.be.gt(0);
            });
        });
    });

    describe('# getFilterBrand Test', () => {
        it('# success Test', () => {
            Brand.getFilterBrand().then((result: BrandFilterDTO[]) => {
                for (const item of result) {
                    expect(item.firstInitial).to.be.match(FIRST_INITIAL_REGEX);
                    expect(item.brands).to.be.ok;
                    for (const brand of item.brands) {
                        BrandHelper.validTest.call(brand);
                    }
                }
            });
        });
    });
});
