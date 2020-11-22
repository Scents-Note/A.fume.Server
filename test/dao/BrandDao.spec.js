const chai = require('chai');
const { expect } = chai;
const brandDao = require('../../dao/BrandDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# brandDao Test', () => {
    describe('# create Test', () => {
        before(async () => {
            await pool.queryParam_None("DELETE FROM brand WHERE name='조말론'");
        });
        it('# success case', (done) => {
            brandDao.create({name: '조말론', english_name: 'Jo Malone', start_char: 'ㅈ', image_url: '', description: ''}).then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        it('# DuplicatedEntryError case', (done) => {
            brandDao.create({name: '조말론', english_name: 'Jo Malone', start_char: 'ㅈ', image_url: '', description: ''}).then((result) => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
    });
    
    describe('# read Test', () => {
        let brand_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM brand WHERE name='읽기테스트'");
            const result = await pool.queryParam_None("INSERT brand(name, english_name, start_character, image_url, description) values('읽기테스트','modify test', 'ㅇ', '', '')");
            brand_idx = result.insertId;
        });
        // TODO Database에 Dependency 가지지 않도록 수정하기
        it('# success case', (done) => {
            brandDao.read(brand_idx).then((result) => {
                expect(result.name).eq('읽기테스트');
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
    });

    describe('# readAll Test', () => {
        it('# success case', (done) => {
            brandDao.readAll().then((result) => {
                expect(result.length).greaterThan(0);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
    });

    describe('# update Test', () => {
        let brand_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM brand WHERE name='수정테스트'");
            const result = await pool.queryParam_None("INSERT brand(name, english_name, start_character, image_url, description) values('수정테스트','modify test', 'ㅅ', '', '')");
            brand_idx = result.insertId;
        });
        it('# success case', (done) => {
            brandDao.update({brand_idx, name:'수정버전', english_name:'modify_test', start_char:'ㅅ', image_url: '', description: ''}).then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            await pool.queryParam_None(`DELETE FROM brand WHERE brand_idx=${brand_idx}`);
        });
    });
    
    describe('# delete Test', () => {
        let brand_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM brand WHERE name = '삭제테스트'");
            const result = await pool.queryParam_None("INSERT brand(name, english_name, start_character, image_url, description) values('삭제테스트','delete test', 'ㅅ', '', '')");
            brand_idx = result.insertId;
        });
        it('# success case', (done) => {
            brandDao.delete(brand_idx).then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            if(!brand_idx) return;
            await pool.queryParam_None(`DELETE FROM brand WHERE brand_idx = ${brand_idx}`);
        });
    });
})