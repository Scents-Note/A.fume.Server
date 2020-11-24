const chai = require('chai');
const { expect } = chai;
const brandDao = require('../../dao/BrandDao.js');
const { DuplicatedEntryError } = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# brandDao Test', () => {
    describe('# create Test', () => {
        before(async () => {
            await pool.queryParam_None('DELETE FROM brand WHERE name="삽입테스트"');
        });
        it('# success case', (done) => {
            brandDao.create({name: '삽입테스트', english_name: 'insert Test', start_char: 'ㅅ', image_url: '', description: 'brand 생성 테스트를 위한 더미데이터입니다.'})
            .then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            });
        });
        it('# DuplicatedEntryError case', (done) => {
            brandDao.create({name: '삽입테스트', english_name: 'insert Test', start_char: 'ㅅ', image_url: '', description: ''})
            .then((result) => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(DuplicatedEntryError);
                done();
            });
        });
    });
    
    describe('# read Test', () => {
        it('# success case', (done) => {
            brandDao.read(2).then((result) => {
                expect(result.name).eq('르 라보');
                expect(result.start_character).eq('ㄹ');
                expect(result.description.length).gt(0);
                done();
            });
        });
    });

    describe('# readAll Test', () => {
        it('# success case', (done) => {
            brandDao.readAll().then((result) => {
                expect(result.length).gt(3);
                done();
            });
        });
    });

    describe('# update Test', () => {
        let brand_idx;
        before(async () => {
            const result = await pool.queryParam_None('INSERT brand(name, english_name, start_character, image_url, description) values("수정테스트","modify test", "ㅅ", "", "")');
            brand_idx = result.insertId;
        });
        it('# success case', (done) => {
            brandDao.update({brand_idx, name:'변경된 이름', english_name:'modified_name', start_character:'ㅂ', image_url: 'image_url', description: '변경완료'})
            .then(async (result) => {
                expect(result.affectedRows).eq(1);
                const updated = await brandDao.read(brand_idx);
                expect(updated.name).eq('변경된 이름');
                expect(updated.english_name).eq('modified_name');
                expect(updated.start_character).eq('ㅂ');
                expect(updated.image_url).eq('image_url');
                expect(updated.description).eq('변경완료');
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
            const result = await pool.queryParam_None('INSERT brand(name, english_name, start_character, image_url, description) values("삭제테스트","delete test", "ㅅ", "", "") ON DUPLICATE KEY UPDATE name = "삭제테스트"');
            brand_idx = result.insertId;
        });
        it('# success case', (done) => {
            brandDao.delete(brand_idx).then((result) => {
                expect(result.affectedRows).eq(1);
                done();
            });
        });
        after(async () => {
            if(!brand_idx) return;
            await pool.queryParam_None(`DELETE FROM brand WHERE brand_idx = ${brand_idx}`);
        });
    });
})