import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';

dotenv.config();

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

        it('# success case with pagingDTO', (done: Done) => {
            brandDao
                .readAll(PagingDTO.createByJson({ limit: 1 }))
                .then((result: ListAndCountDTO<BrandDTO>) => {
                    expect(result.count).to.be.gte(0);
                    expect(result.rows.length).to.be.eq(1);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
