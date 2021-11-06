const dotenv = require('dotenv');
dotenv.config();

import IngredientConditionDTO from '../../src/data/dto/IngredientConditionDTO';

import {
    NotMatchedError,
    UnExpectedError,
} from '../../src/utils/errors/errors';

const chai = require('chai');
const { expect } = chai;
const ingredientDao = require('../../src/dao/IngredientDao.js');

const ListAndCountDTO = require('../data/dto/ListAndCountDTO');
const IngredientDTO = require('../data/dto/IngredientDTO');

describe('# ingredientDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe(' # read test', () => {
        it(' # success case (By PrimaryKey)', (done) => {
            ingredientDao
                .readByIdx(1)
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    IngredientDTO.validTest.call(result);
                    done();
                })
                .catch((err) => done(err));
        });
        it(' # success case (By Name)', (done) => {
            ingredientDao
                .readByName('재료2')
                .then((result) => {
                    expect(result).instanceOf(IngredientDTO);
                    IngredientDTO.validTest.call(result);
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
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        IngredientDTO.validTest
                    );
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
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        IngredientDTO.validTest
                    );
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
                        IngredientDTO.validTest.call(ingredient);
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
                    IngredientDTO.validTest.call(result);
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
                    IngredientDTO.validTest.call(result);
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
});
