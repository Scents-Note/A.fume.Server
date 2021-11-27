import dotenv from 'dotenv';

import IngredientService from '../../src/service/IngredientService';
import IngredientDTO from '../../src/data/dto/IngredientDTO';
import ListAndCountDTO from '../../src/data/dto/ListAndCountDTO';
import IngredientMockHelper from '../data/dto/IngredientMockHelper';
import IngredientConditionDTO from '../../src/data/dto/IngredientConditionDTO';
import IngredientDao from '../../src/dao/IngredientDao';

const chai = require('chai');
const { expect } = chai;
dotenv.config();

const ingredientService = new IngredientService();
const mockIngredientDAO: any | IngredientDao = {};
ingredientService.setIngredientDao(mockIngredientDAO);

describe('# Ingredient Service Test', () => {
    describe('# read test', () => {
        describe('# findSIngredient Test', () => {
            mockIngredientDAO.findIngredient = async (condition: any) => {
                return IngredientMockHelper.create(condition);
            };
            it('# success Test', (done) => {
                ingredientService
                    .findIngredient(
                        new IngredientConditionDTO(undefined, '재료 이름')
                    )
                    .then((result: IngredientDTO) => {
                        IngredientMockHelper.validTest.call(result);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getIngredientAll Test', () => {
            mockIngredientDAO.readAll = async (where: any = {}) => {
                const seriesIdx = where.seriesIdx || 1;
                return new ListAndCountDTO<IngredientDTO>(
                    5,
                    [1, 2, 3, 4, 5].map((idx: number) =>
                        IngredientMockHelper.createWithIdx(idx, seriesIdx)
                    )
                );
            };
            it('# success Test', (done) => {
                ingredientService
                    .getIngredientAll()
                    .then((res: ListAndCountDTO<IngredientDTO>) => {
                        expect(res.count).to.be.gt(0);
                        expect(res.rows.length).to.be.gt(0);
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });

        describe('# getIngredientList Test', () => {
            mockIngredientDAO.readAll = async (where: any = {}) => {
                const seriesIdx = where.seriesIdx || 1;
                return new ListAndCountDTO<IngredientDTO>(
                    5,
                    [1, 2, 3, 4, 5].map((idx: number) =>
                        IngredientMockHelper.createWithIdx(idx, seriesIdx)
                    )
                );
            };
            it('# success Test', (done) => {
                ingredientService
                    .getIngredientList(1)
                    .then((res: ListAndCountDTO<IngredientDTO>) => {
                        expect(res.count).to.be.gt(0);
                        expect(res.rows.length).to.be.gt(0);
                        res.rows.forEach((item: IngredientDTO) => {
                            expect(item.seriesIdx).to.be.eq(1);
                        });
                        done();
                    })
                    .catch((err: Error) => done(err));
            });
        });
    });
});
