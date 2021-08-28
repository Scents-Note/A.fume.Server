const dotenv = require('dotenv');
dotenv.config();

const chai = require('chai');
const { expect } = chai;
const ingredientDao = require('../../dao/IngredientDao.js');
const {
    DuplicatedEntryError,
    NotMatchedError,
    UnExpectedError,
} = require('../../utils/errors/errors.js');
const { Ingredient } = require('../../models');

const { IngredientConditionDTO } = require('../../data/dto');
const CreatedResultDTO = require('../data/dto/CreatedResultDTO').create(
    (created) => {
        expect(created).instanceOf(IngredientDTO);
        created.validTest();
    }
);
const IngredientDTO = require('../data/dto/IngredientDTO');

describe('# ingredientDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });
    describe(' # create Test', () => {
        before(async () => {
            await Ingredient.destroy({ where: { name: '테스트 데이터' } });
        });
        it(' # success case', (done) => {
            ingredientDao
                .create({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '왈라왈라',
                    seriesIdx: 1,
                    imageUrl: '',
                })
                .then((result) => {
                    expect(result).instanceOf(CreatedResultDTO);
                    done();
                })
                .catch((err) => done(err));
        });

        it(' # DuplicatedEntryError case', (done) => {
            ingredientDao
                .create({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: '왈라왈라',
                    seriesIdx: 1,
                    imageUrl: '',
                })
                .then(() => done(new UnExpectedError(DuplicatedEntryError)))
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Ingredient.destroy({ where: { name: '테스트 데이터' } });
        });
    });

    describe(' # read test', () => {
        it(' # success case (By PrimaryKey)', (done) => {
            ingredientDao
                .readByIdx(1)
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    result.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
        it(' # success case (By Name)', (done) => {
            ingredientDao
                .readByName('재료2')
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    result.validTest();
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe(' # readAll Test', () => {
        it(' # success case', (done) => {
            ingredientDao
                .readAll()
                .then((result) => {
                    expect(result.count).greaterThan(4);
                    expect(result.rows.length).greaterThan(4);
                    for (const ingredient of result.rows) {
                        expect(ingredient).instanceOf(IngredientDTO);
                        ingredient.validTest();
                    }
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('# read By seriesIdx Test', () => {
        it('# success case', (done) => {
            ingredientDao
                .readAll({ seriesIdx: 1 })
                .then((result) => {
                    expect(result.count).eq(1);
                    expect(result.rows.length).eq(1);
                    for (const ingredient of result.rows) {
                        expect(ingredient).instanceOf(IngredientDTO);
                        ingredient.validTest();
                    }
                    done();
                })
                .catch((err) => done(err));
        });
        it('# success case', (done) => {
            ingredientDao
                .readBySeriesIdxList([1, 2, 3, 4, 5])
                .then((result) => {
                    expect(result.length).gte(5);
                    for (const ingredient of result) {
                        expect(ingredient).instanceOf(IngredientDTO);
                        ingredient.validTest();
                        expect(ingredient.seriesIdx).to.be.oneOf([
                            1, 2, 3, 4, 5,
                        ]);
                    }
                    done();
                })
                .catch((err) => done(err));
        });

        it('# findIngredient success case', (done) => {
            ingredientDao
                .findIngredient(
                    new IngredientConditionDTO({
                        name: '재료2',
                    })
                )
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    result.validTest();
                    expect(result.name).eq('재료2');
                    expect(result.ingredientIdx).eq(2);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# findIngredient success case', (done) => {
            ingredientDao
                .findIngredient({
                    englishName: 'ingredient english-name',
                })
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    result.validTest();
                    expect(result.name).eq('재료1');
                    expect(result.ingredientIdx).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });

        it('# findIngredient not found case', (done) => {
            ingredientDao
                .findIngredient({
                    name: '재료10',
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

    describe('# update Test', () => {
        let ingredientIdx;
        before(async () => {
            ingredientIdx = (
                await Ingredient.upsert({
                    name: '테스트 데이터',
                    englishName: 'Test Data',
                    description: 'description',
                    seriesIdx: 1,
                    imageUrl: 'image-url',
                })
            )[0].ingredientIdx;
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
                    return ingredientDao.readByIdx(ingredientIdx);
                })
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    result.validTest();
                    expect(result.ingredientIdx).to.be.eq(ingredientIdx);
                    expect(result.name).to.be.eq('수정 데이터');
                    expect(result.englishName).to.be.eq('Update Data');
                    done();
                })
                .catch((err) => done(err));
        });
        it('# Duplicate Error case', (done) => {
            ingredientDao
                .update({
                    ingredientIdx,
                    name: '재료5',
                    englishName: 'Update Data',
                })
                .then(() => {
                    done(new UnExpectedError(NotMatchedError));
                })
                .catch((err) => {
                    expect(err).instanceOf(DuplicatedEntryError);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Ingredient.destroy({ where: { ingredientIdx } });
        });
    });

    describe('# delete Test', () => {
        let ingredientIdx;
        before(async () => {
            ingredientIdx = (
                await Ingredient.upsert({
                    name: '삭제 데이터',
                    englishName: 'Delete Data',
                    description: '',
                    seriesIdx: 1,
                    imageUrl: '',
                })
            )[0].ingredientIdx;
        });
        it('# success case', (done) => {
            ingredientDao
                .delete(ingredientIdx)
                .then((result) => {
                    expect(result).eq(1);
                    done();
                })
                .catch((err) => done(err));
        });
        after(async () => {
            await Ingredient.destroy({ where: { ingredientIdx } });
        });
    });
});
