const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const brandDao = require('../../dao/BrandDao.js');
const { Brand, Sequelize } = require('../../models');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');

describe('# brandDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe('# create Test', () => {
        before(async () => {
            await Brand.destroy({ where: { name: '삽입테스트' } });
        });
        it('# success case', (done) => {
            brandDao
                .create({
                    name: '삽입테스트',
                    englishName: 'insert Test',
                    firstInitial: 'ㅅ',
                    imageUrl: '',
                    description: 'brand 생성 테스트를 위한 더미데이터입니다.',
                })
                .then((result) => {
                    expect(result).gt(0);
                    done();
                })
                .catch((err) => done(err));
        });
        it('# DuplicatedEntryError case', (done) => {
            brandDao
                .create({
                    name: '삽입테스트',
                    englishName: 'insert Test',
                    firstInitial: 'ㅅ',
                    imageUrl: '',
                    description: '',
                })
                .then(() => {
                    done(new Error('expected DuplicatedEntryError'));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Brand.destroy({ where: { name: '삽입테스트' } });
        });
    });

    describe('# read Test', () => {
        it('# success case', (done) => {
            brandDao
                .read(2)
                .then((result) => {
                    expect(result.brandIdx).to.be.eq(2);
                    expect(result.name).to.be.eq('브랜드2');
                    expect(result.firstInitial).to.be.eq('ㅂ');
                    expect(result.imageUrl).to.be.ok;
                    expect(result.description).to.be.ok;
                    expect(result.createdAt).to.be.ok;
                    expect(result.updatedAt).to.be.ok;
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
                    expect(result.imageUrl).to.be.not.null;
                    expect(result.description).to.be.ok;
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
                    throw new Error('Must be occur NotMatchedError');
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
                .search(1, 10, [['createdAt', 'desc']])
                .then((result) => {
                    expect(result.count).gte(5);
                    expect(result.rows.length).gte(5);
                    for (const brand of result.rows) {
                        expect(brand.brandIdx).to.be.ok;
                        expect(brand.name).to.be.ok;
                        expect(brand.firstInitial).to.be.ok;
                        expect(brand.imageUrl).to.be.not.null;
                        expect(brand.description).to.be.ok;
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# readAll Test', () => {
        it('# success case', (done) => {
            brandDao
                .readAll([['createdAt', 'desc']])
                .then((result) => {
                    expect(result.count).gte(5);
                    expect(result.rows.length).gte(5);
                    for (const brand of result.rows) {
                        expect(brand.brandIdx).to.be.ok;
                        expect(brand.name).to.be.ok;
                        expect(brand.firstInitial).to.be.ok;
                        expect(brand.imageUrl).to.be.not.null;
                        expect(brand.description).to.be.ok;
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# update Test', () => {
        let brandIdx;
        let origin = {
            name: '수정테스트',
            englishName: 'modify test',
            firstInitial: 'ㅅ',
            imageUrl: '',
            description: '',
        };

        before(async () => {
            let { dataValues } = await Brand.create(origin);
            brandIdx = dataValues.brandIdx;
        });
        it('# success case', (done) => {
            brandDao
                .update({
                    brandIdx,
                    name: '변경된 이름',
                    englishName: 'modified_name',
                    firstInitial: 'ㅂ',
                    imageUrl: 'image_url',
                    description: '변경완료',
                })
                .then(async (result) => {
                    expect(result).eq(1);
                    const updated = await brandDao.read(brandIdx);
                    expect(updated.name).eq('변경된 이름');
                    expect(updated.englishName).eq('modified_name');
                    expect(updated.firstInitial).eq('ㅂ');
                    expect(updated.imageUrl).eq('image_url');
                    expect(updated.description).eq('변경완료');
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Brand.destroy({ where: { brandIdx } });
        });
    });

    describe('# delete Test', () => {
        let brandIdx;
        before(async () => {
            const { dataValues } = await Brand.create({
                name: '삭제테스트',
                englishName: 'delete test',
                firstInitial: 'ㅅ',
                imageUrl: '',
                description: '',
            });
            brandIdx = dataValues.brandIdx;
        });
        it('# success case', (done) => {
            brandDao
                .delete(brandIdx)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            if (!brandIdx) return;
            await Brand.destroy({ where: { brandIdx } });
        });
    });
});
