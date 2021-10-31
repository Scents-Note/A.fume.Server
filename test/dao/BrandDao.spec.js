const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const brandDao = require('../../src/dao/BrandDao.js');
const {
    NotMatchedError,
    UnExpectedError,
} = require('../../src/utils/errors/errors.js');
const PagingDTO = require('../../src/data/dto/PagingDTO');
const BrandDTO = require('../data/dto/BrandDTO.js');
const ListAndCountDTO = require('../data/dto/ListAndCountDTO.js');

describe('# brandDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe('# read Test', () => {
        it('# success case', (done) => {
            brandDao
                .read(2)
                .then((result) => {
                    expect(result.brandIdx).to.be.eq(2);
                    expect(result.name).to.be.eq('브랜드2');
                    expect(result.firstInitial).to.be.eq('ㅂ');
                    BrandDTO.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# findBrand success case', (done) => {
            brandDao
                .findBrand({
                    name: '브랜드1',
                })
                .then((result) => {
                    expect(result.brandIdx).to.be.eq(1);
                    expect(result.name).to.be.eq('브랜드1');
                    expect(result.firstInitial).to.be.eq('ㅂ');
                    BrandDTO.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# findBrand not found case', (done) => {
            brandDao
                .findBrand({
                    name: '브랜드10',
                })
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).instanceOf(NotMatchedError);
                    done();
                })
                .catch((err) => done(err));
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
                .then((result) => {
                    expect(result.count).gte(5);
                    expect(result.rows.length).gte(5);
                    for (const brand of result.rows) {
                        expect(brand).to.be.instanceOf(BrandDTO);
                        BrandDTO.validTest.call(brand);
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAll Test', () => {
        it('# success case', (done) => {
            brandDao
                .readAll()
                .then((result) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(result, BrandDTO.validTest);
                    done();
                })
                .catch((err) => done(err));
        });
    });
});
