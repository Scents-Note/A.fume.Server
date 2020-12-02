const dotenv = require('dotenv');
dotenv.config({path: './config/.env.test'});

const chai = require('chai');
const { expect } = chai;
const ingredientDao = require('../../dao/IngredientDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError
} = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# ingredientDao Test', () => {
    describe(' # create Test', () => {
        // 중복 데이터 미리 삭제
        let series_idx
        before(async () => {
            series_idx = (await pool.queryParam_Parse("SELECT series_idx FROM series"))[0].series_idx;
            await pool.queryParam_None("DELETE FROM ingredient WHERE name = '테스트 데이터'");
        });
        // 성공 케이스
        it(' # success case', (done) => {
            ingredientDao.create({name : '테스트 데이터', english_name : "Test Data", description : "왈라왈라", series_idx}).then((result) => {
                expect(result).gt(0)
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        // 중복 데이터 발생 케이스
        it(' # DuplicatedEntryError case', (done) => {
            ingredientDao.create({name : '테스트 데이터', english_name : "Test Data", description : "왈라왈라", series_idx}).then((result) => {
                expect(false).true();
                done();
            }).catch((err) => {
                expect(err).instanceOf(Error);
                done();
            });
        });
        // 테스트 데이터 삭제
        after(async() => {
            await pool.queryParam_None("DELETE FROM ingredient WHERE name='테스트 데이터'");
        });
    });

    describe(' # read test', () =>{
        let read, ingredient_idx, name
        before(async() => {
            read = (await pool.queryParam_Parse("SELECT ingredient_idx, name FROM ingredient"))[0];
            ingredient_idx = read.ingredient_idx
            name = read.name
        });
        it(' # success case', (done) => {
            ingredientDao.read(ingredient_idx).then((result) => {
                expect(result.name).eq(name);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        })
    })

    describe(' # readAll Test', () => {
        it(' # success case', (done) => {
            ingredientDao.readAll().then((result) => {
                expect(result.length).greaterThan(0);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
    });

    describe('# update Test', () => {
        let ingredient_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM ingredient WHERE name='테스트 데이터'");
            const result = await pool.queryParam_None("INSERT INTO ingredient(name, english_name) VALUES('테스트 데이터','Test Data')");
            ingredient_idx = result.insertId;
        });
        it('# success case', (done) => {
            ingredientDao.update({ingredient_idx, name:'수정 데이터', english_name:'Update Data'})
            .then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            await pool.queryParam_None(`DELETE FROM ingredient WHERE ingredient_idx=${ingredient_idx}`);
        });
    });
    
    describe('# delete Test', () => {
        let ingredient_idx;
        before(async () => {
            await pool.queryParam_None("DELETE FROM ingredient WHERE name='삭제 데이터'");
            const result = await pool.queryParam_None("INSERT ingredient(name, english_name) values('삭제 데이터','Delete Data')");
            ingredient_idx = result.insertId;
        });
        it('# success case', (done) => {
            ingredientDao.delete(ingredient_idx).then((result) => {
                expect(result).eq(1);
                done();
            }).catch((err) => {
                expect(false).true();
                done();
            });
        });
        after(async () => {
            if(!ingredient_idx) return;
            await pool.queryParam_None(`DELETE FROM ingredient WHERE ingredient_idx=${ingredient_idx}`);
        });
    });
})