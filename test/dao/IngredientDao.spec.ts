import dotenv from 'dotenv';
import { expect } from 'chai';

import {
    NotMatchedError,
    UnExpectedError,
} from '../../src/utils/errors/errors';

import IngredientConditionDTO from '../../src/data/dto/IngredientConditionDTO';
import IngredientDao from '../../src/dao/IngredientDao';
import IngredientDTO from '../../src/data/dto/IngredientDTO';

import IngredientMockHelper from '../data/dto/IngredientMockHelper';

dotenv.config();
const ingredientDao = new IngredientDao();

const ListAndCountDTO = require('../data/dto/ListAndCountDTO');

describe('# ingredientDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe(' # read test', () => {
        it(' # success case (By PrimaryKey)', (done) => {
            ingredientDao
                .readByIdx(1)
                .then((result: IngredientDTO) => {
                    IngredientMockHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it(' # success case (By Name)', (done) => {
            ingredientDao
                .readByName('재료2')
                .then((result: IngredientDTO) => {
                    IngredientMockHelper.validTest.call(result);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe(' # readAll Test', () => {
        it(' # success case', (done) => {
            ingredientDao
                .readAll({})
                .then((result: any) => {
                    expect(result.count).greaterThan(4);
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        IngredientMockHelper.validTest
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# read By seriesIdx Test', () => {
        it('# success case', (done) => {
            ingredientDao
                .readAll({ seriesIdx: 1 })
                .then((result: any) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    ListAndCountDTO.validTest.call(
                        result,
                        IngredientMockHelper.validTest
                    );
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# success case', (done) => {
            ingredientDao
                .readBySeriesIdxList([1, 2, 3, 4, 5])
                .then((result: IngredientDTO[]) => {
                    expect(result.length).gte(5);
                    for (const ingredient of result) {
                        IngredientMockHelper.validTest.call(ingredient);
                        expect(ingredient.seriesIdx).to.be.oneOf([
                            1, 2, 3, 4, 5,
                        ]);
                    }
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# findIngredient success case', (done) => {
            ingredientDao
                .findIngredient(
                    new IngredientConditionDTO(
                        2,
                        '재료2',
                        undefined,
                        undefined,
                        undefined,
                        undefined
                    )
                )
                .then((result: IngredientDTO) => {
                    IngredientMockHelper.validTest.call(result);
                    expect(result.name).eq('재료2');
                    expect(result.ingredientIdx).eq(2);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# findIngredient success case', (done) => {
            ingredientDao
                .findIngredient({
                    englishName: 'ingredient english-name',
                })
                .then((result: IngredientDTO) => {
                    IngredientMockHelper.validTest.call(result);
                    expect(result.name).eq('재료1');
                    expect(result.ingredientIdx).eq(1);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it('# findIngredient not found case', (done) => {
            ingredientDao
                .findIngredient({
                    name: '재료10',
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
});
