import dotenv from 'dotenv';
import { expect } from 'chai';
import { Done } from 'mocha';
dotenv.config();

import IngredientDao from '@dao/IngredientDao';

import { IngredientDTO, ListAndCountDTO, PagingDTO } from '@dto/index';

import IngredientMockHelper from '../mock_helper/IngredientMockHelper';

const ingredientDao = new IngredientDao();

describe('# ingredientDao Test', () => {
    before(async function () {
        await require('./common/presets.js')(this);
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
