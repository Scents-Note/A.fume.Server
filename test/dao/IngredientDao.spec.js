const dotenv = require('dotenv');
dotenv.config({ path: './config/.env.test' });

const chai = require('chai');
const { expect } = chai;
const ingredientDao = require('../../dao/IngredientDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
} = require('../../utils/errors/errors.js');
const pool = require('../../utils/db/pool.js');

describe('# ingredientDao Test', () => {
    describe(' # create Test', () => {
        // 중복 데이터 미리 삭제
        let seriesName;
        before(async () => {
            seriesName = (
                await pool.queryParam_Parse('SELECT name FROM series')
            )[0].name;
            await pool.queryParam_None(
                "DELETE FROM ingredient WHERE name = '테스트 데이터'"
            );
        });
        // 성공 케이스
        it(' # success case', (done) => {
            ingredientDao
                .create({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '왈라왈라',
                    seriesName,
                })
                .then((result) => {
                    expect(result).gt(0);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
        // 중복 데이터 발생 케이스
        it(' # DuplicatedEntryError case', (done) => {
            ingredientDao
                .create({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '왈라왈라',
                    seriesName,
                })
                .then((result) => {
                    expect(false).true();
                    done();
                })
                .catch((err) => {
                    expect(err).instanceOf(Error);
                    done();
                });
        });
        // 테스트 데이터 삭제
        after(async () => {
            await pool.queryParam_None(
                "DELETE FROM ingredient WHERE name='테스트 데이터'"
            );
        });
    });

    describe(' # read test', () => {
        let read, ingredientIdx, name;
        before(async () => {
            read = (
                await pool.queryParam_Parse(
                    'SELECT ingredient_idx, name FROM ingredient'
                )
            )[0];
            ingredientIdx = read.ingredient_idx;
            name = read.name;
        });
        it(' # success case', (done) => {
            ingredientDao
                .read(ingredientIdx)
                .then((result) => {
                    expect(result.name).eq(name);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
    });

    describe(' # readAll Test', () => {
        it(' # success case', (done) => {
            ingredientDao
                .readAll()
                .then((result) => {
                    expect(result.length).greaterThan(0);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
    });

    describe('# update Test', () => {
        let ingredientIdx;
        before(async () => {
            await pool.queryParam_None(
                "DELETE FROM ingredient WHERE name='테스트 데이터'"
            );
            const result = await pool.queryParam_None(
                "INSERT INTO ingredient(name, english_name) VALUES('테스트 데이터','Test Data')"
            );
            ingredientIdx = result.insertId;
        });
        it('# success case', (done) => {
            ingredientDao
                .update({
                    ingredientIdx,
                    name: '수정 데이터',
                    englishName: 'Update Data',
                })
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
        after(async () => {
            await pool.queryParam_None(
                `DELETE FROM ingredient WHERE ingredient_idx=${ingredientIdx}`
            );
        });
    });

    describe('# delete Test', () => {
        let ingredientIdx;
        before(async () => {
            await pool.queryParam_None(
                "DELETE FROM ingredient WHERE name='삭제 데이터'"
            );
            const result = await pool.queryParam_None(
                "INSERT ingredient(name, english_name) values('삭제 데이터','Delete Data')"
            );
            ingredientIdx = result.insertId;
        });
        it('# success case', (done) => {
            ingredientDao
                .delete(ingredientIdx)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => {
                    expect(false).true();
                    done();
                });
        });
        after(async () => {
            if (!ingredientIdx) return;
            await pool.queryParam_None(
                `DELETE FROM ingredient WHERE ingredient_idx=${ingredientIdx}`
            );
        });
    });
});
