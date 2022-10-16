import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import { NotMatchedError, UnExpectedError } from '@errors';

import IngredientDao from '@dao/IngredientDao';

import {
    IngredientConditionDTO,
    IngredientDTO,
    ListAndCountDTO,
    PagingDTO,
} from '@dto/index';

import IngredientMockHelper from '../mock_helper/IngredientMockHelper';

const ingredientDao = new IngredientDao();

describe('# ingredientDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
    });

    describe(' # read test', () => {
        it(' # success case (By PrimaryKey)', (done: Done) => {
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
        it(' # success case', (done: Done) => {
            ingredientDao
                .readAll({})
                .then((result: ListAndCountDTO<IngredientDTO>) => {
                    expect(result.count).greaterThan(4);
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });

        it(' # success case with paging', (done: Done) => {
            ingredientDao
                .readAll({}, PagingDTO.createByJson({ limit: 1 }))
                .then((result: ListAndCountDTO<IngredientDTO>) => {
                    expect(result.count).greaterThan(4);
                    expect(result).instanceOf(ListAndCountDTO);
                    expect(result.rows.length).to.be.eq(1);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });

    describe('# read By seriesIdx Test', () => {
        it('# success case', (done: Done) => {
            ingredientDao
                .readAll({ seriesIdx: 1 })
                .then((result: ListAndCountDTO<IngredientDTO>) => {
                    expect(result).instanceOf(ListAndCountDTO);
                    done();
                })
                .catch((err: Error) => done(err));
        });
        it('# success case', (done: Done) => {
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

        it('# findIngredient success case', (done: Done) => {
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

        it('# findIngredient success case', (done: Done) => {
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

        it('# findIngredient not found case', (done: Done) => {
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

    describe('# category Test', () => {
        it('# getIngredientIdxByCategories test', (done: Done) => {
            ingredientDao
                .getIngredientIdxByCategories([1, 2])
                .then((result: any) => {
                    expect(
                        result.map((it: IngredientDTO) => it.ingredientIdx)
                    ).to.be.deep.eq([1, 2]);
                    done();
                })
                .catch((err: Error) => done(err));
        });
    });
});
