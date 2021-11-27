import dotenv from 'dotenv';
import { expect } from 'chai';

import {
    NotMatchedError,
    UnExpectedError,
} from '../../src/utils/errors/errors';

import BrandDao from '../../src/dao/BrandDao';
import BrandDTO from '../../src/data/dto/BrandDTO';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import BrandHelper from '../data/dto/BrandHelper';

dotenv.config();

const brandDao = new BrandDao();

const PagingDTO = require('../../src/data/dto/PagingDTO');

describe('# brandDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# read Test', () => {
        it('# success case', (done) => {
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

        it('# findBrand success case', (done) => {
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
        it('# findBrand not found case', (done) => {
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
        it('# success case', (done) => {
            brandDao
                .search(
                    new PagingDTO({
                        pagingIndex: 1,
                        pagingSize: 10,
                        order: [['createdAt', 'desc']],
                    })
                )
                .then((result: any) => {
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
        it('# success case', (done) => {
            brandDao
                .readAll()
                .then((result: ListAndCountDTO<BrandDTO>) => {
                    expect(result.count).to.be.eq(0);
                    expect(result.rows.length).to.be.eq(0);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
