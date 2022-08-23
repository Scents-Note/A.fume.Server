import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';

dotenv.config();

import { NotMatchedError, UnExpectedError } from '@errors';

import BrandDao from '@dao/BrandDao';

import { BrandDTO, ListAndCountDTO, PagingDTO } from '@dto/index';

import BrandHelper from '../mock_helper/BrandHelper';

const brandDao: BrandDao = new BrandDao();

describe('# brandDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# read Test', () => {
        it('# success case', (done: Done) => {
            brandDao
                .read(2)
                .then((result: BrandDTO) => {
                    expect(result.brandIdx).to.be.eq(2);
                    expect(result.name).to.be.eq('브랜드2');
                    expect(result.firstInitial).to.be.eq('ㅂ');
                    BrandHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# findBrand success case', (done: Done) => {
            brandDao
                .findBrand({
                    name: '브랜드1',
                })
                .then((result: BrandDTO) => {
                    expect(result.brandIdx).to.be.eq(1);
                    expect(result.name).to.be.eq('브랜드1');
                    expect(result.firstInitial).to.be.eq('ㅂ');
                    BrandHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# findBrand not found case', (done: Done) => {
            brandDao
                .findBrand({
                    name: '브랜드10',
                })
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err: Error) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# search Test', () => {
        it('# success case', (done: Done) => {
            brandDao
                .search(
                    PagingDTO.createByJson({ order: [['createdAt', 'desc']] })
                )
                .then((result: ListAndCountDTO<BrandDTO>) => {
                    expect(result.count).gte(5);
                    expect(result.rows.length).gte(5);
                    for (const brand of result.rows) {
                        expect(brand).to.be.instanceOf(BrandDTO);
                        BrandHelper.validTest.call(brand);
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# readAll Test', () => {
        it('# success case', (done: Done) => {
            brandDao
                .readAll()
                .then((result: ListAndCountDTO<BrandDTO>) => {
                    expect(result.count).to.be.gte(0);
                    expect(result.rows.length).to.be.gte(0);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
